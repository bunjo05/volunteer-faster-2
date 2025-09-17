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
        Schema::create('share_contacts', function (Blueprint $table) {
            $table->id();
            $table->ulid('public_id')->unique();
            $table->foreignUlid('volunteer_public_id')
                ->nullable()
                ->constrained('users', 'public_id')
                ->onDelete('cascade');
            $table->foreignUlid('organization_public_id')
                ->nullable()
                ->constrained('users', 'public_id')
                ->onDelete('cascade');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('message')->nullable();
            $table->timestamp('requested_at');
            $table->timestamp('approved_at')->nullable();

            // Add unique constraint to prevent duplicate requests
            $table->unique(['organization_public_id', 'volunteer_public_id']);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('share_contacts');
    }
};
