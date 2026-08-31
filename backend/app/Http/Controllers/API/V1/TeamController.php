<?php

namespace App\Http\Controllers\API\V1;

use App\Models\User;
use App\Models\TeamProfile;
use App\Models\AuditLog;
use App\Services\WebhookService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TeamController extends BaseApiController
{
    protected WebhookService $webhookService;

    public function __construct(WebhookService $webhookService)
    {
        $this->webhookService = $webhookService;
    }

    /**
     * Display listing of team members & talent profiles
     */
    public function index()
    {
        $team = User::with(['teamProfile', 'assignedTasks' => function ($q) {
                $q->whereIn('status', ['todo', 'in_progress'])->with('project');
            }])
            ->where('status', 'active')
            ->get();

        return $this->jsonResponse($team);
    }

    /**
     * Update engineer profile & sync to Corporate Web Next.js /tim/[slug]
     */
    public function syncPublicProfile(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'job_title' => 'required|string|max:255',
            'tagline' => 'nullable|string|max:255',
            'bio_id' => 'nullable|string',
            'skills_json' => 'required|array',
            'certifications_json' => 'nullable|array',
            'social_links_json' => 'nullable|array',
            'is_public_showcase' => 'boolean',
        ]);

        $user = User::findOrFail($validated['user_id']);
        $slug = Str::slug($user->name);

        $profile = TeamProfile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'slug' => $slug,
                'job_title' => $validated['job_title'],
                'tagline' => $validated['tagline'] ?? null,
                'bio_id' => $validated['bio_id'] ?? null,
                'skills_json' => $validated['skills_json'],
                'certifications_json' => $validated['certifications_json'] ?? null,
                'social_links_json' => $validated['social_links_json'] ?? null,
                'is_public_showcase' => $validated['is_public_showcase'] ?? true,
            ]
        );

        // Trigger on-demand ISR revalidation on Corporate Web
        $revalidationResult = $this->webhookService->triggerTeamRevalidation($slug);

        AuditLog::create([
            'user_id' => $request->user()?->id,
            'action' => 'team.profile_synced',
            'auditable_type' => TeamProfile::class,
            'auditable_id' => $profile->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'state_diff_json' => [
                'profile' => $profile->toArray(),
                'revalidation' => $revalidationResult,
            ],
        ]);

        return $this->jsonResponse([
            'profile' => $profile->load('user'),
            'revalidation' => $revalidationResult,
        ], 'Profil publik berhasil diperbarui dan disinkronkan ke Corporate Web (/tim/[slug]).');
    }
}
