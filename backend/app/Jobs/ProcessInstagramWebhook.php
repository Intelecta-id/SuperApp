<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessInstagramWebhook implements ShouldQueue
{
    use Queueable;

    public function __construct(public array $payload)
    {
    }

    public function handle(): void
    {
        // Asynchronous processing for Instagram webhook events
    }
}
