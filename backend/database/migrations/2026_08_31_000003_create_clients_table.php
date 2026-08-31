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
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('company_name');
            $table->string('pic_name');
            $table->string('pic_email');
            $table->string('pic_phone', 30)->nullable();
            $table->string('pic_position', 100)->nullable();
            $table->string('industry', 100)->nullable();
            $table->text('address')->nullable();
            $table->string('website')->nullable();
            $table->string('tax_id', 100)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
