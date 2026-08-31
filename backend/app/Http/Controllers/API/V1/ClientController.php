<?php

namespace App\Http\Controllers\API\V1;

use App\Models\Client;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class ClientController extends BaseApiController
{
    /**
     * Display a listing of clients.
     */
    public function index(Request $request)
    {
        $query = Client::withCount(['projects', 'invoices', 'tickets']);

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('company_name', 'like', "%{$search}%")
                  ->orWhere('pic_name', 'like', "%{$search}%")
                  ->orWhere('pic_email', 'like', "%{$search}%")
                  ->orWhere('industry', 'like', "%{$search}%");
            });
        }

        if ($request->has('industry') && !empty($request->industry)) {
            $query->where('industry', $request->industry);
        }

        $clients = $query->orderBy('company_name', 'asc')->get();

        return $this->jsonResponse($clients);
    }

    /**
     * Store a newly created client.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'pic_name' => 'required|string|max:255',
            'pic_email' => 'required|email|max:255',
            'pic_phone' => 'nullable|string|max:30',
            'pic_position' => 'nullable|string|max:100',
            'industry' => 'nullable|string|max:100',
            'address' => 'nullable|string',
            'website' => 'nullable|string|max:255',
            'tax_id' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
        ]);

        $client = Client::create($validated);

        AuditLog::create([
            'user_id' => $request->user()?->id,
            'action' => 'client.created',
            'auditable_type' => Client::class,
            'auditable_id' => $client->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'state_diff_json' => $validated,
        ]);

        return $this->jsonResponse($client, 'Klien baru berhasil ditambahkan.', 201);
    }

    /**
     * Display the specified client with full relational data.
     */
    public function show(string $id)
    {
        $client = Client::with(['projects.sprints', 'invoices', 'tickets'])
            ->where('id', $id)
            ->orWhere('uuid', $id)
            ->first();

        if (!$client) {
            return $this->jsonError('Klien tidak ditemukan.', 404);
        }

        return $this->jsonResponse($client);
    }

    /**
     * Update the specified client.
     */
    public function update(Request $request, string $id)
    {
        $client = Client::where('id', $id)->orWhere('uuid', $id)->first();

        if (!$client) {
            return $this->jsonError('Klien tidak ditemukan.', 404);
        }

        $validated = $request->validate([
            'company_name' => 'sometimes|required|string|max:255',
            'pic_name' => 'sometimes|required|string|max:255',
            'pic_email' => 'sometimes|required|email|max:255',
            'pic_phone' => 'nullable|string|max:30',
            'pic_position' => 'nullable|string|max:100',
            'industry' => 'nullable|string|max:100',
            'address' => 'nullable|string',
            'website' => 'nullable|string|max:255',
            'tax_id' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
        ]);

        $client->update($validated);

        AuditLog::create([
            'user_id' => $request->user()?->id,
            'action' => 'client.updated',
            'auditable_type' => Client::class,
            'auditable_id' => $client->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'state_diff_json' => $validated,
        ]);

        return $this->jsonResponse($client, 'Data klien berhasil diperbarui.');
    }

    /**
     * Remove the specified client.
     */
    public function destroy(Request $request, string $id)
    {
        $client = Client::where('id', $id)->orWhere('uuid', $id)->first();

        if (!$client) {
            return $this->jsonError('Klien tidak ditemukan.', 404);
        }

        $client->delete();

        AuditLog::create([
            'user_id' => $request->user()?->id,
            'action' => 'client.deleted',
            'auditable_type' => Client::class,
            'auditable_id' => $client->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return $this->jsonResponse(null, 'Klien berhasil dihapus.');
    }
}
