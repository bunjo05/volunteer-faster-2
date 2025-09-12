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
        Schema::create('sponsorships', function (Blueprint $table) {
            $table->id();
            $table->ulid('public_id')->unique();
            $table->foreignUlid('user_public_id')
                ->nullable()
                ->constrained('users', 'public_id')
                ->onDelete('cascade');
            $table->foreignUlid('booking_public_id')->constrained('volunteer_bookings', 'public_id')->onDelete('cascade');
            $table->foreignUlid('sponsorship_public_id')->constrained('volunteer_sponsorships', 'public_id')->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->json('funding_allocation')->nullable(); // Stores which items are being funded
            $table->string('stripe_payment_id')->nullable();
            $table->enum('status', ['pending', 'completed', 'failed', 'refunded'])->default('pending');
            $table->string('payment_method')->nullable();
            $table->boolean('is_anonymous')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sponsorships');
    }
};
