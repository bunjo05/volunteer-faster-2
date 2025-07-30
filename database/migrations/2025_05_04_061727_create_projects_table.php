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
            $table->text('short_description');
            $table->text('detailed_description');
            $table->integer('min_duration')->nullable();
            $table->integer('max_duration')->nullable();
            $table->enum('duration_type', ['Days', 'Weeks', 'Months'])->default('Days');
            $table->text('daily_routine');
            $table->enum('type_of_project', ['Paid', 'Free'])->default('Free');
            $table->decimal('fees', 10, 2)->nullable();
            $table->string('currency')->default('USD')->nullable();
            $table->string('category_of_charge')->nullable();
            $table->text('includes')->nullable();
            $table->text('excludes')->nullable();
            $table->text('activities');
            $table->json('suitable')->nullable();
            $table->json('availability_months')->nullable();
            $table->date('start_date')->nullable();
            $table->enum('status', ['Active', 'Pending', 'Suspended', 'Rejected'])->default('Pending');
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
