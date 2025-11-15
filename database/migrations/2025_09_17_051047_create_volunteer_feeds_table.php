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
        Schema::create('volunteer_feeds', function (Blueprint $table) {
            $table->id();
            $table->ulid('public_id')->unique();
            $table->foreignUlid('user_public_id')->constrained('users', 'public_id')->onDelete('cascade');
            $table->foreignUlid('booking_public_id')->constrained('volunteer_bookings', 'public_id')->onDelete('cascade');
            $table->text('feed_item');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('volunteer_feeds');
    }
};
