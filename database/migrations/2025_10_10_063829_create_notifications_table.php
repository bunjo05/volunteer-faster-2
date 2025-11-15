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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('public_id')->unique();
            $table->string('user_public_id'); // Target user
            $table->string('admin_public_id')->nullable(); // Admin who triggered notification
            $table->string('type'); // project_approved, booking_made, booking_approved, etc.
            $table->string('title');
            $table->text('message');
            $table->json('data')->nullable(); // Additional data like project_id, booking_id, etc.
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->foreign('user_public_id')->references('public_id')->on('users')->onDelete('cascade');
            $table->foreign('admin_public_id')->references('public_id')->on('admins')->onDelete('set null');
            $table->index(['user_public_id', 'is_read']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
