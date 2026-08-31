<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class InstagramService
{
    protected ?string $appSecret;
    protected ?string $pageAccessToken;
    protected ?string $instagramAccountId;
    protected ?string $verifyToken;

    public function __construct()
    {
        $this->appSecret = config('services.meta.app_secret');
        $this->pageAccessToken = config('services.meta.page_access_token');
        $this->instagramAccountId = config('services.meta.instagram_account_id');
        $this->verifyToken = config('services.meta.webhook_verify_token');
    }

    /**
     * Verify Meta Webhook Challenge
     */
    public function verifyWebhook(string $mode, string $token, string $challenge): ?string
    {
        if ($mode === 'subscribe' && $token === $this->verifyToken) {
            return $challenge;
        }

        return null;
    }

    /**
     * Validate X-Hub-Signature-256
     */
    public function validateSignature(string $rawPayload, ?string $signatureHeader): bool
    {
        if (empty($this->appSecret)) {
            // Local dev mode without secret set
            return true;
        }

        if (empty($signatureHeader) || !str_starts_with($signatureHeader, 'sha256=')) {
            return false;
        }

        $expectedSignature = hash_hmac('sha256', $rawPayload, $this->appSecret);
        $providedSignature = substr($signatureHeader, 7);

        return hash_equals($expectedSignature, $providedSignature);
    }

    /**
     * Send direct message via Meta Graph API
     */
    public function sendDirectMessage(string $recipientId, string $messageText): array
    {
        if (empty($this->pageAccessToken)) {
            Log::info("Simulating Instagram reply to {$recipientId}: {$messageText}");
            return [
                'status' => 'simulated',
                'recipient_id' => $recipientId,
                'message_id' => 'mid_sim_' . uniqid(),
                'timestamp' => now()->toIso8601String(),
            ];
        }

        try {
            $response = Http::withToken($this->pageAccessToken)
                ->post("https://graph.facebook.com/v19.0/me/messages", [
                    'recipient' => ['id' => $recipientId],
                    'message' => ['text' => $messageText],
                    'messaging_type' => 'RESPONSE',
                ]);

            if ($response->successful()) {
                return [
                    'status' => 'sent',
                    'data' => $response->json(),
                ];
            }

            Log::error("Instagram API error: " . $response->body());
            return [
                'status' => 'failed',
                'error' => $response->json(),
            ];
        } catch (\Exception $e) {
            Log::error("Failed to send Instagram DM: " . $e->getMessage());
            return [
                'status' => 'error',
                'message' => $e->getMessage(),
            ];
        }
    }
}
