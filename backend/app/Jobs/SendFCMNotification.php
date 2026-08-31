<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendFCMNotification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $recipientToken,
        public string $title,
        public string $body,
        public array $data = []
    ) {
    }

    public function handle(): void
    {
        // Asynchronous FCM push notification dispatch
    }
}
