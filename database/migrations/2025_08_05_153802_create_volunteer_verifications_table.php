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
            $table->foreignId('volunteer_id')->constrained('volunteer_profiles')->onDelete('cascade');
            $table->string('verification_type'); // e.g., 'ID', 'Background Check', 'Reference'
            $table->string('document')->nullable(); // Path to the verification document
            $table->enum('status', ['Pending', 'Approved', 'Rejected'])->default('Pending');
            $table->text('comments')->nullable(); // Admin comments on the verification
            $table->dateTime('verified_at')->nullable(); // Timestamp when the verification was completed
            $table->foreignId('admin_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->timestamps();
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
