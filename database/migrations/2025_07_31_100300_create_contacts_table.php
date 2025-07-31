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
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('subject');
            $table->text('message');
            $table->boolean('is_read')->default(false);
            $table->boolean('is_replied')->default(false);
            $table->timestamp('replied_at')->nullable();
            $table->string('reply_message')->nullable();
            $table->string('reply_subject')->nullable();
            $table->foreignId('admin_id')->nullable()->constrained('admins')->onDelete('set null');
            $table->boolean('is_suspended')->default(false); // Added is_active column
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
