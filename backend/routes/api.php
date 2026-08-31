<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\V1\AuthController;
use App\Http\Controllers\API\V1\DashboardController;
use App\Http\Controllers\API\V1\ClientController;
use App\Http\Controllers\API\V1\ProjectController;
use App\Http\Controllers\API\V1\LeadController;
use App\Http\Controllers\API\V1\InvoiceController;
use App\Http\Controllers\API\V1\TeamController;
use App\Http\Controllers\API\V1\TicketController;
use App\Http\Controllers\Webhooks\InstagramWebhookController;
use App\Http\Controllers\Webhooks\CorporateWebWebhookController;

/*
|--------------------------------------------------------------------------
| Public Webhook Ingress Routes
|--------------------------------------------------------------------------
*/
Route::prefix('webhooks')->group(function () {
    // Meta / Instagram Webhook
    Route::get('/instagram', [InstagramWebhookController::class, 'verify']);
    Route::post('/instagram', [InstagramWebhookController::class, 'handle']);

    // Next.js Corporate Web Webhook
    Route::post('/corporate-web', [CorporateWebWebhookController::class, 'handle']);
});

/*
|--------------------------------------------------------------------------
| REST API V1 Endpoints
|--------------------------------------------------------------------------
*/
Route::prefix('v1')->group(function () {
    // Authentication
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Protected Routes (Internal Operators)
    Route::middleware('auth:sanctum')->group(function () {
        // Auth Session
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Dashboard Stats
        Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

        // Clients Directory
        Route::apiResource('clients', ClientController::class);

        // Projects & Kanban Board
        Route::apiResource('projects', ProjectController::class);
        Route::get('/projects/{uuid}/board', [ProjectController::class, 'board']);
        Route::patch('/tasks/{uuid}/status', [ProjectController::class, 'updateTaskStatus']);
        Route::post('/projects/{uuid}/tasks', [ProjectController::class, 'storeTask']);

        // Omnichannel Leads
        Route::apiResource('omnichannel/leads', LeadController::class);
        Route::post('/omnichannel/instagram/reply', [LeadController::class, 'replyInstagram']);
        Route::post('/omnichannel/leads/{id}/convert', [LeadController::class, 'convertToProject']);

        // Financial & Invoices
        Route::apiResource('invoices', InvoiceController::class);
        Route::post('/invoices/{uuid}/generate-payment', [InvoiceController::class, 'generatePayment']);
        Route::post('/invoices/{uuid}/mark-paid', [InvoiceController::class, 'markPaid']);

        // Talent & Corporate Web Sync
        Route::get('/team', [TeamController::class, 'index']);
        Route::post('/team/sync-public-profile', [TeamController::class, 'syncPublicProfile']);

        // SLA Helpdesk & Ticketing
        Route::apiResource('tickets', TicketController::class);
        Route::post('/tickets/{id}/reply', [TicketController::class, 'addReply']);
    });
});
