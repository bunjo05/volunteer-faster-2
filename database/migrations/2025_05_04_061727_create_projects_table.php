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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('featured_image')->nullable();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->foreignId('subcategory_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('address');
            $table->text('short_description')->required();
            $table->text('detailed_description')->required();
            $table->string('duration')->required();
            $table->string('duration_type')->default('Days');
            $table->text('daily_routine')->nullable();
            $table->decimal('fees', 10, 2)->nullable();
            $table->string('currency')->default('USD')->nullable();
            $table->text('activities')->nullable();
            $table->text('suitable')->nullable();
            $table->text('availability_months')->nullable();
            $table->text('gallery_images')->nullable();
            $table->date('start_date')->nullable();
            $table->enum('status', ['Active', 'Pending', 'Suspended'])->default('Pending');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->boolean('request_for_approval')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
