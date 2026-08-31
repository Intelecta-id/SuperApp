<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->enum('source', ['instagram_dm', 'instagram_comment', 'web_contact_form', 'web_terminal_cli', 'whatsapp', 'manual']);
            $table->string('external_sender_id')->nullable(); // IG Scoped ID or Web Session UUID
            $table->string('sender_name');
            $table->string('sender_contact')->nullable(); // Email / Phone / IG Handle
            $table->string('company_name')->nullable();
            $table->string('subject_or_intent')->nullable();
            $table->text('initial_message');
            $table->enum('status', ['new', 'qualified', 'pitching', 'converted_to_project', 'dropped'])->default('new');
            $table->foreignId('assigned_to_user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('converted_to_client_id')->nullable()->constrained('clients')->onDelete('set null');
            $table->foreignId('converted_to_project_id')->nullable()->constrained('projects')->onDelete('set null');
            $table->decimal('ai_sentiment_score', 3, 2)->nullable(); // -1.00 to 1.00
            $table->text('ai_suggested_reply')->nullable();
            $table->json('metadata_json')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
