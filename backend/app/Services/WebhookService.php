<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WebhookService
{
    protected ?string $corporateWebhookSecret;
    protected ?string $corporateBaseUrl;
    protected ?string $revalidationSecret;

    public function __construct()
    {
        $this->corporateWebhookSecret = config('services.corporate_web.webhook_secret');
        $this->corporateBaseUrl = config('services.corporate_web.api_base_url', 'https://intelecta.id');
        $this->revalidationSecret = config('services.corporate_web.revalidation_secret');
    }

    /**
     * Validate signature from Corporate Webhook
     */
    public function validateCorporateSignature(string $rawPayload, ?string $signatureHeader): bool
    {
        if (empty($this->corporateWebhookSecret)) {
            return true;
        }

        if (empty($signatureHeader)) {
            return false;
        }

        $expected = hash_hmac('sha256', $rawPayload, $this->corporateWebhookSecret);
        return hash_equals($expected, $signatureHeader);
    }

    /**
     * Trigger Next.js on-demand ISR revalidation for /tim/[slug]
     */
    public function triggerTeamRevalidation(string $slug): array
    {
        if (empty($this->corporateBaseUrl) || $this->corporateBaseUrl === 'https://intelecta.id') {
            Log::info("Simulating Corporate Web ISR revalidation for /tim/{$slug}");
            return [
                'status' => 'simulated',
                'path' => "/tim/{$slug}",
                'revalidated' => true,
                'timestamp' => now()->toIso8601String(),
            ];
        }

        try {
            $response = Http::post("{$this->corporateBaseUrl}/api/revalidate", [
                'secret' => $this->revalidationSecret,
                'path' => "/tim/{$slug}",
                'tag' => "team-profile-{$slug}",
            ]);

            return [
                'status' => $response->successful() ? 'revalidated' : 'failed',
                'data' => $response->json(),
            ];
        } catch (\Exception $e) {
            Log::error("Failed to trigger Next.js revalidation: " . $e->getMessage());
            return [
                'status' => 'error',
                'message' => $e->getMessage(),
            ];
        }
    }
}
