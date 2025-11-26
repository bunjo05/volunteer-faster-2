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
        Schema::create('appreciations', function (Blueprint $table) {
            $table->id();
            $table->string('public_id')->unique();
            $table->string('volunteer_public_id');
            $table->string('donor_public_id');
            $table->string('sponsorship_public_id');
            $table->text('message');
            $table->string('status')->default('sent');
            $table->timestamps();

            $table->foreign('volunteer_public_id')->references('public_id')->on('users')->onDelete('cascade');
            $table->foreign('donor_public_id')->references('public_id')->on('users')->onDelete('cascade');
            $table->foreign('sponsorship_public_id')->references('public_id')->on('sponsorships')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appreciations');
    }
};
