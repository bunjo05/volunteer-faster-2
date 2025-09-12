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
        Schema::create('volunteer_following_organizations', function (Blueprint $table) {
            $table->id();
            // $table->foreignId('organization_id')->constrained('organization_profiles')->onDelete('cascade');
            $table->foreignUlid('organization_public_id')->constrained('organization_profiles', 'public_id')->onDelete('cascade');
            $table->foreignUlid('user_public_id')->constrained('users', 'public_id')->onDelete('cascade');

            $table->timestamps();

            $table->unique(['user_public_id', 'organization_public_id'], 'vfo_user_org_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('volunteer_following_organizations');
    }
};
