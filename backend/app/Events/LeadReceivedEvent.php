<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LeadReceivedEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public array $leadData)
    {
    }
}
