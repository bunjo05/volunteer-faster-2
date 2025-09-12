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
        Schema::create('report_projects', function (Blueprint $table) {
            $table->id();
            $table->foreignUlid('user_public_id')->constrained('users', 'public_id')->onDelete('cascade');
            $table->foreignUlid('project_public_id')->constrained('projects', 'public_id')->onDelete('cascade');

            // $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            // $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->foreignId('report_category_id')->constrained('report_categories')->onDelete('cascade');
            $table->foreignId('report_subcategory_id')->constrained('report_subcategories')->onDelete('cascade');
            $table->text('description')->nullable();
            $table->boolean('mark_as_resolved')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_projects');
    }
};
