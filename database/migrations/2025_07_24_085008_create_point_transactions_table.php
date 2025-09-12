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
        Schema::create('point_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignUlid('user_public_id')->constrained('users', 'public_id')->onDelete('cascade');
            $table->foreignUlid('organization_public_id')->nullable()->constrained('users', 'public_id')->onDelete('cascade');
            $table->foreignUlid('booking_public_id')->nullable()->constrained('volunteer_bookings', 'public_id')->onDelete('cascade');
            $table->integer('points');
            $table->string('type'); // 'debit' or 'credit'
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('point_transactions');
    }
};
