<?php

namespace App\Http\Controllers\API\V1;

use App\Models\Ticket;
use App\Models\TicketReply;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TicketController extends BaseApiController
{
    /**
     * Display a listing of helpdesk tickets.
     */
    public function index(Request $request)
    {
        $query = Ticket::with(['client', 'project', 'assignedEngineer', 'replies.user']);

        if ($request->has('priority') && !empty($request->priority)) {
            $query->where('priority', $request->priority);
        }

        if ($request->has('status') && !empty($request->status)) {
            $query->where('status', $request->status);
        }

        if ($request->has('client_id') && !empty($request->client_id)) {
            $query->where('client_id', $request->client_id);
        }

        $tickets = $query->orderBy('created_at', 'desc')->get();

        return $this->jsonResponse($tickets);
    }

    /**
     * Store a newly created ticket.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:low,medium,high,critical_sla_1hr',
            'assigned_engineer_id' => 'nullable|exists:users,id',
        ]);

        $ticketCode = 'TCK-' . rand(1000, 9999);
        $slaDueAt = ($validated['priority'] === 'critical_sla_1hr') ? now()->addHour() : now()->addHours(24);

        $ticket = Ticket::create([
            'ticket_code' => $ticketCode,
            'client_id' => $validated['client_id'],
            'project_id' => $validated['project_id'],
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'priority' => $validated['priority'],
            'status' => 'open',
            'assigned_engineer_id' => $validated['assigned_engineer_id'] ?? null,
            'sla_due_at' => $slaDueAt,
        ]);

        AuditLog::create([
            'user_id' => $request->user()?->id,
            'action' => 'ticket.created',
            'auditable_type' => Ticket::class,
            'auditable_id' => $ticket->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'state_diff_json' => $ticket->toArray(),
        ]);

        return $this->jsonResponse($ticket->load(['client', 'project', 'assignedEngineer']), 'Tiket SLA berhasil dibuat.', 201);
    }

    /**
     * Display the specified ticket.
     */
    public function show(string $id)
    {
        $ticket = Ticket::with(['client', 'project', 'assignedEngineer', 'replies.user'])
            ->where('id', $id)
            ->orWhere('uuid', $id)
            ->first();

        if (!$ticket) {
            return $this->jsonError('Tiket tidak ditemukan.', 404);
        }

        return $this->jsonResponse($ticket);
    }

    /**
     * Update ticket status or resolution notes (RCA)
     */
    public function update(Request $request, string $id)
    {
        $ticket = Ticket::where('id', $id)->orWhere('uuid', $id)->first();

        if (!$ticket) {
            return $this->jsonError('Tiket tidak ditemukan.', 404);
        }

        $validated = $request->validate([
            'status' => 'sometimes|required|in:open,investigating,resolved,closed',
            'priority' => 'sometimes|required|in:low,medium,high,critical_sla_1hr',
            'assigned_engineer_id' => 'nullable|exists:users,id',
            'resolution_notes' => 'nullable|string',
        ]);

        if (isset($validated['status']) && $validated['status'] === 'resolved' && !$ticket->resolved_at) {
            $validated['resolved_at'] = now();
        }

        $ticket->update($validated);

        AuditLog::create([
            'user_id' => $request->user()?->id,
            'action' => 'ticket.updated',
            'auditable_type' => Ticket::class,
            'auditable_id' => $ticket->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'state_diff_json' => $validated,
        ]);

        return $this->jsonResponse($ticket->load(['client', 'project', 'assignedEngineer']), 'Status tiket berhasil diperbarui.');
    }

    /**
     * Add reply or internal note to ticket thread
     */
    public function addReply(Request $request, string $id)
    {
        $ticket = Ticket::where('id', $id)->orWhere('uuid', $id)->first();

        if (!$ticket) {
            return $this->jsonError('Tiket tidak ditemukan.', 404);
        }

        $validated = $request->validate([
            'message' => 'required|string',
            'is_internal_note' => 'boolean',
        ]);

        $reply = TicketReply::create([
            'ticket_id' => $ticket->id,
            'user_id' => $request->user()?->id,
            'message' => $validated['message'],
            'is_internal_note' => $validated['is_internal_note'] ?? false,
        ]);

        return $this->jsonResponse($reply->load('user'), 'Balasan tiket berhasil ditambahkan.', 201);
    }
}
