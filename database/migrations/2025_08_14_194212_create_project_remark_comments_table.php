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
        Schema::create('project_remark_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignUlid('user_public_id')->constrained('users', 'public_id')->onDelete('cascade');
            // $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('project_remark_id')->constrained()->onDelete('cascade');
            $table->foreignId('parent_id')->nullable()->constrained('project_remark_comments')->onDelete('cascade');
            $table->text('comment');
            $table->boolean('is_approved')->default(true); // For moderation
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_remark_comments');
    }
};
