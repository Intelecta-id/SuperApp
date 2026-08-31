<?php

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\LeadActivity;
use App\Models\WebhookLog;
use App\Services\WebhookService;
use App\Services\AiCopilotService;
use Illuminate\Http\Request;

class CorporateWebWebhookController extends Controller
{
    protected WebhookService $webhookService;
    protected AiCopilotService $aiCopilotService;

    public function __construct(WebhookService $webhookService, AiCopilotService $aiCopilotService)
    {
        $this->webhookService = $webhookService;
        $this->aiCopilotService = $aiCopilotService;
    }

    /**
     * Handle Ingress from Next.js Corporate Web (Contact Form & Terminal CLI)
     */
    public function handle(Request $request)
    {
        $rawPayload = $request->getContent();
        $signature = $request->header('X-Corporate-Signature');

        if (!$this->webhookService->validateCorporateSignature($rawPayload, $signature)) {
            WebhookLog::create([
                'provider' => 'corporate_web',
                'event_type' => 'signature_mismatch',
                'signature' => $signature,
                'payload_json' => $request->all(),
                'status' => 'failed',
                'error_message' => 'Invalid Corporate Web Secret Signature',
                'ip_address' => $request->ip(),
            ]);

            return response()->json(['error' => 'Unauthorized Webhook Payload'], 401);
        }

        $type = $request->input('event_type', 'contact_form_submission'); // 'contact_form_submission' or 'terminal_cli_beacon'
        $data = $request->input('data', $request->all());

        if ($type === 'terminal_cli_beacon') {
            // CLI Beacon interaction from landing page terminal
            $senderName = $data['visitor_id'] ?? 'Terminal Visitor';
            $command = $data['command'] ?? 'help';
            $sessionUuid = $data['session_uuid'] ?? uniqid('term_');
            $message = "Command executed: `{$command}` (Intent: " . ($data['intent'] ?? 'exploring') . ")";

            $lead = Lead::create([
                'source' => 'web_terminal_cli',
                'external_sender_id' => $sessionUuid,
                'sender_name' => "Terminal: {$senderName}",
                'sender_contact' => $data['contact_if_provided'] ?? null,
                'subject_or_intent' => 'Terminal CLI Interaction',
                'initial_message' => $message,
                'status' => 'new',
                'ai_sentiment_score' => 0.60,
                'ai_suggested_reply' => "Visitor berinteraksi via terminal corporate web menggunakan command: {$command}.",
                'metadata_json' => $data,
            ]);

            LeadActivity::create([
                'lead_id' => $lead->id,
                'activity_type' => 'inbound_message',
                'message_content' => $message,
                'metadata_json' => $data,
            ]);
        } else {
            // Contact form submission
            $senderName = $data['name'] ?? 'Corporate Visitor';
            $senderEmail = $data['email'] ?? null;
            $companyName = $data['company'] ?? null;
            $serviceInterest = $data['service'] ?? 'General Consultation';
            $message = $data['message'] ?? 'Permintaan konsultasi proyek dari Form Kontak Corporate Web';

            $sentiment = $this->aiCopilotService->analyzeSentiment($message);
            $suggestedReply = $this->aiCopilotService->generateSuggestedReply($message, $senderName);

            $lead = Lead::create([
                'source' => 'web_contact_form',
                'external_sender_id' => uniqid('web_form_'),
                'sender_name' => $senderName,
                'sender_contact' => $senderEmail ?? ($data['phone'] ?? null),
                'company_name' => $companyName,
                'subject_or_intent' => "Inquiry: {$serviceInterest}",
                'initial_message' => $message,
                'status' => 'new',
                'ai_sentiment_score' => $sentiment,
                'ai_suggested_reply' => $suggestedReply,
                'metadata_json' => $data,
            ]);

            LeadActivity::create([
                'lead_id' => $lead->id,
                'activity_type' => 'inbound_message',
                'message_content' => $message,
                'metadata_json' => $data,
            ]);
        }

        WebhookLog::create([
            'provider' => 'corporate_web',
            'event_type' => $type,
            'signature' => $signature,
            'payload_json' => $request->all(),
            'status' => 'processed',
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Corporate Webhook Processed Successfully',
            'lead_id' => $lead->id ?? null,
        ], 200);
    }
}
