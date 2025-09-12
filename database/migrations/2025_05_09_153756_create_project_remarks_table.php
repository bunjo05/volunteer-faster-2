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
        Schema::create('project_remarks', function (Blueprint $table) {
            $table->id();
            $table->foreignUlid('user_public_id')->constrained('users', 'public_id')->onDelete('cascade');
            $table->foreignUlid('project_public_id')->constrained('projects', 'public_id')->onDelete('cascade');
            $table->foreignUlid('admin_public_id')->constrained('admins', 'public_id')->onDelete('cascade');
            $table->foreignUlid('booking_public_id')->constrained('volunteer_bookings', 'public_id')->onDelete('cascade');

            // $table->foreignId('user_id')->constrained()->onDelete('cascade');
            // $table->foreignId('project_id')->constrained()->onDelete('cascade');
            // $table->foreignId('booking_id')->nullable()->constrained('volunteer_bookings')->onDelete('cascade');
            // $table->foreignId('admin_id')->nullable()->constrained('admins')->onDelete('cascade');
            $table->text('comment')->nullable();
            $table->integer('rating');
            $table->enum('status', ['Rejected', 'Resolved', 'Pending'])->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_remarks');
    }
};
