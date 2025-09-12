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
        Schema::create('volunteer_verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignUlid('volunteer_public_id')->constrained('volunteer_profiles', 'public_id')->onDelete('cascade');
            $table->string('verification_type'); // e.g., 'ID', 'Background Check', 'Reference'
            $table->string('document')->nullable(); // Path to the verification document
            $table->enum('status', ['Pending', 'Approved', 'Rejected'])->default('Pending');
            $table->text('comments')->nullable(); // Admin comments on the verification
            $table->dateTime('verified_at')->nullable(); // Timestamp when the verification was completed
            $table->foreignUlid('admin_public_id')->nullable()->constrained('users', 'public_id')->onDelete('cascade');
            $table->timestamps();

            // $table->foreign('volunteer_public_id')->references('public_id')->on('volunteer_profiles')->onDelete('cascade');
            // $table->foreign('admin_public_id')->references('public_id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('volunteer_verifications');
    }
};
