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
        Schema::create('volunteer_profiles', function (Blueprint $table) {
            $table->id();
            $table->ulid('public_id')->unique();
            // $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignUlid('user_public_id')->constrained('users', 'public_id')->onDelete('cascade');
            $table->string('gender');
            $table->string('dob');
            $table->string('country');
            $table->string('city')->nullable();
            $table->string('state')->nullable(); // Added state field
            $table->string('postal')->nullable();
            $table->string('phone');
            $table->string('profile_picture')->nullable();
            $table->string('facebook')->nullable();
            $table->string('twitter')->nullable();
            $table->string('instagram')->nullable();
            $table->string('linkedin')->nullable();
            $table->json('hobbies')->nullable();
            $table->string('education_status')->nullable();
            $table->json('skills')->nullable();
            $table->string('nok')->nullable();
            $table->string('nok_phone')->nullable();
            $table->string('nok_relation')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('volunteer_profiles');
    }
};
