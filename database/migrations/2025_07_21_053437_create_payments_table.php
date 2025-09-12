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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->ulid('public_id')->unique();
            // $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignUlid('user_public_id')->constrained('users', 'public_id')->onDelete('cascade');
            $table->foreignUlid('booking_public_id')->constrained('volunteer_bookings', 'public_id')->onDelete('cascade');
            $table->foreignUlid('project_public_id')->constrained('projects', 'public_id')->onDelete('cascade');
            // $table->foreignId('booking_id')->constrained('volunteer_bookings')->onDelete('cascade');
            // $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->string('stripe_payment_id');
            $table->string('status');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
