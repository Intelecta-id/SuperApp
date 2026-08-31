<?php

namespace App\Http\Controllers\API\V1;

use App\Models\Invoice;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class InvoiceController extends BaseApiController
{
    /**
     * Display a listing of invoices.
     */
    public function index(Request $request)
    {
        $query = Invoice::with(['client', 'project']);

        if ($request->has('payment_status') && !empty($request->payment_status)) {
            $query->where('payment_status', $request->payment_status);
        }

        if ($request->has('client_id') && !empty($request->client_id)) {
            $query->where('client_id', $request->client_id);
        }

        $invoices = $query->orderBy('created_at', 'desc')->get();

        return $this->jsonResponse($invoices);
    }

    /**
     * Store a newly created invoice.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'project_id' => 'nullable|exists:projects,id',
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'tax_amount' => 'nullable|numeric|min:0',
            'due_date' => 'required|date',
            'notes' => 'nullable|string',
            'items_json' => 'nullable|array',
        ]);

        $taxAmount = $validated['tax_amount'] ?? 0;
        $totalPayable = $validated['amount'] + $taxAmount;

        $month = date('m');
        $year = date('Y');
        $count = Invoice::whereYear('created_at', $year)->whereMonth('created_at', $month)->count() + 1;
        $invoiceNumber = sprintf("INV/%s/%s/%04d", $year, $month, $count);

        $invoice = Invoice::create([
            'invoice_number' => $invoiceNumber,
            'client_id' => $validated['client_id'],
            'project_id' => $validated['project_id'] ?? null,
            'title' => $validated['title'],
            'amount' => $validated['amount'],
            'tax_amount' => $taxAmount,
            'total_payable' => $totalPayable,
            'due_date' => $validated['due_date'],
            'payment_status' => 'unpaid',
            'items_json' => $validated['items_json'] ?? null,
            'notes' => $validated['notes'] ?? null,
        ]);

        AuditLog::create([
            'user_id' => $request->user()?->id,
            'action' => 'invoice.created',
            'auditable_type' => Invoice::class,
            'auditable_id' => $invoice->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'state_diff_json' => $invoice->toArray(),
        ]);

        return $this->jsonResponse($invoice->load(['client', 'project']), 'Invoice berhasil dibuat.', 201);
    }

    /**
     * Show the specified invoice.
     */
    public function show(string $id)
    {
        $invoice = Invoice::with(['client', 'project'])
            ->where('id', $id)
            ->orWhere('uuid', $id)
            ->first();

        if (!$invoice) {
            return $this->jsonError('Invoice tidak ditemukan.', 404);
        }

        return $this->jsonResponse($invoice);
    }

    /**
     * Generate Payment Gateway Link (Midtrans / Xendit Simulator)
     */
    public function generatePayment(Request $request, string $uuid)
    {
        $invoice = Invoice::where('uuid', $uuid)->orWhere('id', $uuid)->first();

        if (!$invoice) {
            return $this->jsonError('Invoice tidak ditemukan.', 404);
        }

        $paymentRef = 'MID-' . strtoupper(Str::random(10));
        $paymentUrl = "https://app.sandbox.midtrans.com/snap/v2/vtweb/{$paymentRef}";

        $invoice->update([
            'payment_status' => 'pending_gateway',
            'payment_gateway_ref' => $paymentRef,
            'payment_url' => $paymentUrl,
        ]);

        return $this->jsonResponse([
            'invoice' => $invoice->load(['client', 'project']),
            'payment_url' => $paymentUrl,
            'payment_gateway_ref' => $paymentRef,
        ], 'Link pembayaran gateway berhasil di-generate.');
    }

    /**
     * Mark Invoice as Paid
     */
    public function markPaid(Request $request, string $uuid)
    {
        $invoice = Invoice::where('uuid', $uuid)->orWhere('id', $uuid)->first();

        if (!$invoice) {
            return $this->jsonError('Invoice tidak ditemukan.', 404);
        }

        $invoice->update([
            'payment_status' => 'paid',
            'paid_at' => now(),
        ]);

        AuditLog::create([
            'user_id' => $request->user()?->id,
            'action' => 'invoice.paid',
            'auditable_type' => Invoice::class,
            'auditable_id' => $invoice->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return $this->jsonResponse($invoice->load(['client', 'project']), 'Invoice berhasil ditandai telah dibayar.');
    }
}
