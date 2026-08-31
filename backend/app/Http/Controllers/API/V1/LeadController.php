<?php

namespace App\Http\Controllers\API\V1;

use App\Models\Lead;
use App\Models\LeadActivity;
use App\Models\Client;
use App\Models\Project;
use App\Models\AuditLog;
use App\Services\InstagramService;
use App\Services\AiCopilotService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class LeadController extends BaseApiController
{
    protected InstagramService $instagramService;
    protected AiCopilotService $aiCopilotService;

    public function __construct(InstagramService $instagramService, AiCopilotService $aiCopilotService)
    {
        $this->instagramService = $instagramService;
        $this->aiCopilotService = $aiCopilotService;
    }

    /**
     * Display a listing of omnichannel leads.
     */
    public function index(Request $request)
    {
        $query = Lead::with(['assignee', 'convertedClient', 'convertedProject', 'activities']);

        if ($request->has('source') && !empty($request->source)) {
            $query->where('source', $request->source);
        }

        if ($request->has('status') && !empty($request->status)) {
            $query->where('status', $request->status);
        }

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('sender_name', 'like', "%{$search}%")
                  ->orWhere('sender_contact', 'like', "%{$search}%")
                  ->orWhere('company_name', 'like', "%{$search}%")
                  ->orWhere('initial_message', 'like', "%{$search}%");
            });
        }

        $leads = $query->orderBy('created_at', 'desc')->get();

        return $this->jsonResponse($leads);
    }

    /**
     * Store new manual lead
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'source' => 'required|in:instagram_dm,instagram_comment,web_contact_form,web_terminal_cli,whatsapp,manual',
            'sender_name' => 'required|string|max:255',
            'sender_contact' => 'nullable|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'subject_or_intent' => 'nullable|string|max:255',
            'initial_message' => 'required|string',
            'assigned_to_user_id' => 'nullable|exists:users,id',
        ]);

        $sentiment = $this->aiCopilotService->analyzeSentiment($validated['initial_message']);
        $suggestedReply = $this->aiCopilotService->generateSuggestedReply($validated['initial_message'], $validated['sender_name']);

        $validated['ai_sentiment_score'] = $sentiment;
        $validated['ai_suggested_reply'] = $suggestedReply;
        $validated['status'] = 'new';

        $lead = Lead::create($validated);

        LeadActivity::create([
            'lead_id' => $lead->id,
            'user_id' => $request->user()?->id,
            'activity_type' => 'inbound_message',
            'message_content' => $validated['initial_message'],
        ]);

        return $this->jsonResponse($lead, 'Lead berhasil didaftarkan.', 201);
    }

    /**
     * Show Lead Details
     */
    public function show(string $id)
    {
        $lead = Lead::with(['assignee', 'convertedClient', 'convertedProject', 'activities.user'])
            ->where('id', $id)
            ->orWhere('uuid', $id)
            ->first();

        if (!$lead) {
            return $this->jsonError('Lead tidak ditemukan.', 404);
        }

        return $this->jsonResponse($lead);
    }

    /**
     * Update Lead Status
     */
    public function update(Request $request, string $id)
    {
        $lead = Lead::where('id', $id)->orWhere('uuid', $id)->first();

        if (!$lead) {
            return $this->jsonError('Lead tidak ditemukan.', 404);
        }

        $validated = $request->validate([
            'status' => 'sometimes|required|in:new,qualified,pitching,converted_to_project,dropped',
            'assigned_to_user_id' => 'nullable|exists:users,id',
            'subject_or_intent' => 'nullable|string',
        ]);

        $lead->update($validated);

        return $this->jsonResponse($lead->load(['assignee', 'activities']), 'Status lead berhasil diperbarui.');
    }

    /**
     * Reply to Instagram DM via Meta Graph API
     */
    public function replyInstagram(Request $request)
    {
        $request->validate([
            'lead_id' => 'required|exists:leads,id',
            'message' => 'required|string',
        ]);

        $lead = Lead::findOrFail($request->lead_id);

        $recipientId = $lead->external_sender_id ?? $lead->sender_contact;
        $sendResult = $this->instagramService->sendDirectMessage($recipientId, $request->message);

        // Record activity
        $activity = LeadActivity::create([
            'lead_id' => $lead->id,
            'user_id' => $request->user()?->id,
            'activity_type' => 'outbound_reply',
            'message_content' => $request->message,
            'metadata_json' => $sendResult,
        ]);

        if ($lead->status === 'new') {
            $lead->update(['status' => 'qualified']);
        }

        return $this->jsonResponse([
            'activity' => $activity,
            'meta_result' => $sendResult,
        ], 'Pesan balasan berhasil dikirim.');
    }

    /**
     * 1-Click Convert Lead to Official Client & Project
     */
    public function convertToProject(Request $request, string $id)
    {
        $lead = Lead::where('id', $id)->orWhere('uuid', $id)->first();

        if (!$lead) {
            return $this->jsonError('Lead tidak ditemukan.', 404);
        }

        $request->validate([
            'company_name' => 'required|string|max:255',
            'pic_name' => 'required|string|max:255',
            'pic_email' => 'required|email|max:255',
            'project_title' => 'required|string|max:255',
            'category' => 'required|in:web_development,mobile_app_development,webapp_development',
            'contract_value' => 'required|numeric|min:0',
        ]);

        // Find or create client
        $client = Client::firstOrCreate(
            ['company_name' => $request->company_name],
            [
                'pic_name' => $request->pic_name,
                'pic_email' => $request->pic_email,
                'pic_phone' => $lead->sender_contact,
                'industry' => 'Corporate / Enterprise',
                'notes' => "Converted from lead #{$lead->id} ({$lead->source})",
            ]
        );

        // Create Project
        $year = date('Y');
        $randomCode = strtoupper(Str::random(4));
        $projectCode = "INTL-{$year}-{$randomCode}";

        $project = Project::create([
            'client_id' => $client->id,
            'project_code' => $projectCode,
            'title' => $request->project_title,
            'description' => $lead->initial_message,
            'category' => $request->category,
            'status' => 'scoping',
            'contract_value' => $request->contract_value,
            'start_date' => now(),
            'target_completion_date' => now()->addMonths(2),
        ]);

        // Update lead status
        $lead->update([
            'status' => 'converted_to_project',
            'converted_to_client_id' => $client->id,
            'converted_to_project_id' => $project->id,
        ]);

        LeadActivity::create([
            'lead_id' => $lead->id,
            'user_id' => $request->user()?->id,
            'activity_type' => 'status_change',
            'message_content' => "Lead dikonversi menjadi Klien ({$client->company_name}) dan Proyek ({$project->project_code})",
        ]);

        AuditLog::create([
            'user_id' => $request->user()?->id,
            'action' => 'lead.converted_to_project',
            'auditable_type' => Lead::class,
            'auditable_id' => $lead->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'state_diff_json' => [
                'client_id' => $client->id,
                'project_id' => $project->id,
            ],
        ]);

        return $this->jsonResponse([
            'lead' => $lead,
            'client' => $client,
            'project' => $project,
        ], 'Lead berhasil dikonversi menjadi Klien & Proyek resmi.', 201);
    }
}
