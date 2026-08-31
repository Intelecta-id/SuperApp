<?php

namespace App\Services;

use Kreait\Firebase\Factory;
use Kreait\Firebase\Auth as FirebaseAuth;
use Illuminate\Support\Facades\Log;

class FirebaseService
{
    protected ?FirebaseAuth $auth = null;
    protected string $projectId;

    public function __construct()
    {
        $this->projectId = config('services.firebase.project_id', 'intelecta-superapp');
        $credentialsPath = config('services.firebase.credentials_file');

        if ($credentialsPath && file_exists($credentialsPath)) {
            try {
                $factory = (new Factory)
                    ->withServiceAccount($credentialsPath)
                    ->withProjectId($this->projectId);
                $this->auth = $factory->createAuth();
            } catch (\Exception $e) {
                Log::warning("Firebase Admin SDK init skipped: " . $e->getMessage());
            }
        }
    }

    /**
     * Generate Firebase Custom Token for a user.
     */
    public function createCustomToken(string $uid, array $claims = []): string
    {
        if ($this->auth) {
            try {
                return (string) $this->auth->createCustomToken($uid, $claims);
            } catch (\Exception $e) {
                Log::error("Failed to create Firebase custom token: " . $e->getMessage());
            }
        }

        // Development fallback token (base64 mock token)
        $payload = [
            'uid' => $uid,
            'claims' => $claims,
            'iss' => 'firebase-adminsdk@' . $this->projectId,
            'iat' => time(),
            'exp' => time() + 3600,
        ];

        return 'mock_fb_custom_token_' . base64_encode(json_encode($payload));
    }

    /**
     * Format Firestore channel payload
     */
    public function getChannelPayload(string $channelId, string $type, string $name, array $participants): array
    {
        return [
            'channel_id' => $channelId,
            'type' => $type, // 'project', 'direct', 'lead_omnichannel'
            'name' => $name,
            'participants' => $participants,
            'created_at' => now()->toIso8601String(),
        ];
    }
}
