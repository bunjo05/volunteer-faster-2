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
        Schema::create('volunteer_bookings', function (Blueprint $table) {
            $table->id();
            $table->ulid('public_id')->unique();
            $table->foreignUlid('user_public_id')->constrained('users', 'public_id')->onDelete('cascade');
            $table->foreignUlid('project_public_id')->constrained('projects', 'public_id')->onDelete('cascade');
            // $table->foreignId('user_id')->constrained()->onDelete('cascade');
            // $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->string('start_date');
            $table->string('end_date');
            $table->string('number_of_travellers');
            $table->enum('booking_status', allowed: ['Pending', 'Cancelled', 'Approved', 'Rejected', 'Completed'])->default('Pending');
            $table->text('completed_feedback')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('volunteer_bookings');
    }
};
