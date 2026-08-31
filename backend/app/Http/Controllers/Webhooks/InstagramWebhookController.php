<?php

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\LeadActivity;
use App\Models\WebhookLog;
use App\Services\InstagramService;
use App\Services\AiCopilotService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class InstagramWebhookController extends Controller
{
    protected InstagramService $instagramService;
    protected AiCopilotService $aiCopilotService;

    public function __construct(InstagramService $instagramService, AiCopilotService $aiCopilotService)
    {
        $this->instagramService = $instagramService;
        $this->aiCopilotService = $aiCopilotService;
    }

    /**
     * Meta Hub Challenge Verification (GET)
     */
    public function verify(Request $request)
    {
        $mode = $request->query('hub_mode', $request->query('hub.mode'));
        $token = $request->query('hub_verify_token', $request->query('hub.verify_token'));
        $challenge = $request->query('hub_challenge', $request->query('hub.challenge'));

        $verifiedChallenge = $this->instagramService->verifyWebhook((string) $mode, (string) $token, (string) $challenge);

        if ($verifiedChallenge) {
            return response($verifiedChallenge, 200)->header('Content-Type', 'text/plain');
        }

        return response()->json(['error' => 'Unauthorized Challenge Verification'], 403);
    }

    /**
     * Handle Inbound Meta/Instagram Events (POST)
     */
    public function handle(Request $request)
    {
        $rawPayload = $request->getContent();
        $signature = $request->header('X-Hub-Signature-256');

        if (!$this->instagramService->validateSignature($rawPayload, $signature)) {
            WebhookLog::create([
                'provider' => 'instagram_meta',
                'event_type' => 'signature_mismatch',
                'signature' => $signature,
                'payload_json' => $request->all(),
                'status' => 'failed',
                'error_message' => 'Invalid HMAC SHA-256 Signature',
                'ip_address' => $request->ip(),
            ]);

            return response()->json(['error' => 'Invalid signature'], 401);
        }

        $payload = $request->all();
        $entries = $payload['entry'] ?? [];

        foreach ($entries as $entry) {
            $messaging = $entry['messaging'] ?? [];
            foreach ($messaging as $event) {
                $senderId = $event['sender']['id'] ?? 'unknown_sender';
                $messageText = $event['message']['text'] ?? null;

                if ($messageText) {
                    $sentiment = $this->aiCopilotService->analyzeSentiment($messageText);
                    $suggestedReply = $this->aiCopilotService->generateSuggestedReply($messageText, 'Instagram User');

                    // Find or create lead
                    $lead = Lead::firstOrCreate(
                        [
                            'source' => 'instagram_dm',
                            'external_sender_id' => $senderId,
                        ],
                        [
                            'sender_name' => "IG User @{$senderId}",
                            'sender_contact' => "@{$senderId}",
                            'subject_or_intent' => 'Inquiry via Instagram DM',
                            'initial_message' => $messageText,
                            'status' => 'new',
                            'ai_sentiment_score' => $sentiment,
                            'ai_suggested_reply' => $suggestedReply,
                            'metadata_json' => $event,
                        ]
                    );

                    LeadActivity::create([
                        'lead_id' => $lead->id,
                        'activity_type' => 'inbound_message',
                        'message_content' => $messageText,
                        'metadata_json' => $event,
                    ]);
                }
            }
        }

        WebhookLog::create([
            'provider' => 'instagram_meta',
            'event_type' => $payload['object'] ?? 'instagram_event',
            'signature' => $signature,
            'payload_json' => $payload,
            'status' => 'processed',
            'ip_address' => $request->ip(),
        ]);

        return response()->json(['status' => 'EVENT_RECEIVED'], 200);
    }
}
