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
        Schema::create('reminders', function (Blueprint $table) {
            $table->id();
            $table->foreignUlid('user_public_id')->constrained('users', 'public_id')->onDelete('cascade');
            $table->foreignUlid('project_public_id')->constrained('projects', 'public_id')->onDelete('cascade');
            $table->foreignUlid('booking_public_id')->constrained('volunteer_bookings', 'public_id')->onDelete('cascade');

            // $table->foreignId('user_id')->constrained();
            // $table->foreignId('project_id')->constrained();
            // $table->foreignId('booking_id')->constrained('volunteer_bookings');
            $table->enum('stage', ['first', 'second', 'final']);
            $table->text('message');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reminders');
    }
};
