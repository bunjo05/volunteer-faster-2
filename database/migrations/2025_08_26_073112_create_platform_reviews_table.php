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
        Schema::create('platform_reviews', function (Blueprint $table) {
            $table->id();
            // $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignUlid('user_public_id')->constrained('users', 'public_id')->onDelete('cascade');
            $table->foreignUlid('admin_public_id')->constrained('admins', 'public_id')->onDelete('cascade');

            // $table->foreignId('admin_id')->nullable()->constrained('admins')->onDelete('set null');
            $table->enum('status', ['Pending', 'Approved', 'Rejected'])->default('pending');
            $table->text('message');
            $table->integer('rating');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('platform_reviews');
    }
};
