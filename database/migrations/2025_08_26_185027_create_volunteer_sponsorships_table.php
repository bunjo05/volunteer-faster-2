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
        Schema::create('volunteer_sponsorships', function (Blueprint $table) {
            $table->id();
            $table->ulid('public_id')->unique();
            $table->foreignUlid('user_public_id')->constrained('users', 'public_id')->onDelete('cascade');
            $table->foreignUlid('booking_public_id')->constrained('volunteer_bookings', 'public_id')->onDelete('cascade');
            // $table->foreignId('user_id')->constrained()->onDelete('cascade');
            // $table->foreignId('booking_id')->nullable()->constrained('volunteer_bookings')->onDelete('cascade');
            $table->json('aspect_needs_funding');
            $table->decimal('total_amount', 10, 2);
            $table->decimal('travel', 10, 2)->nullable();
            $table->decimal('accommodation', 10, 2)->nullable();
            $table->decimal('meals', 10, 2)->nullable();
            $table->decimal('living_expenses', 10, 2)->nullable();
            $table->decimal('visa_fees', 10, 2)->nullable();
            $table->decimal('project_fees_amount', 10, 2)->nullable();
            $table->text('self_introduction');
            $table->json('skills');
            $table->text('impact');
            $table->boolean('commitment')->default(false);
            $table->boolean('privacy')->default(false);
            $table->enum('status', ['Pending', 'Approved', 'Rejected'])->default('Pending');
            $table->boolean('agreement')->default(false);
            $table->text('rejection_reason')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('volunteer_sponsorships');
    }
};
