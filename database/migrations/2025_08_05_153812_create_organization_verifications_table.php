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
        Schema::create('organization_verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_profile_id')->constrained('organization_profiles')->onDelete('cascade');
            $table->string('type_of_document'); // e.g., 'Certificate', 'License', etc.
            $table->string('certificate')->nullable(); // Path to the verification document
            $table->string('type_of_document_2')->nullable(); // Placeholder for additional document if needed
            $table->string('another_document')->nullable(); // Placeholder for additional document if needed
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
        Schema::dropIfExists('organization_verifications');
    }
};
