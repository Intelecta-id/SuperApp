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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            $table->string('project_code', 50)->unique();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('category', ['web_development', 'mobile_app_development', 'webapp_development']);
            $table->enum('status', ['scoping', 'active_sprint', 'uat', 'maintenance', 'completed'])->default('scoping');
            $table->decimal('contract_value', 15, 2)->default(0.00);
            $table->date('start_date')->nullable();
            $table->date('target_completion_date')->nullable();
            $table->string('git_repository_url', 500)->nullable();
            $table->string('staging_url', 500)->nullable();
            $table->string('production_url', 500)->nullable();
            $table->boolean('is_featured_case_study')->default(false);
            $table->json('case_study_metrics_json')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
