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
        Schema::create('featured_projects', function (Blueprint $table) {
            $table->id();
            // $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->foreignUlid('project_public_id')->constrained('projects', 'public_id')->onDelete('cascade');

            // $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignUlid('user_public_id')->constrained('users', 'public_id')->onDelete('cascade');

            $table->string('plan_type'); // 1_month, 3_months, 6_months, 1_year
            $table->decimal('amount', 10, 2);
            // $table->string('stripe_payment_id');
            $table->string('paypal_order_id')->nullable();
            $table->string('paypal_capture_id')->nullable();
            $table->index(['paypal_order_id']);
            $table->index(['paypal_capture_id']);

            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected', 'expired'])->default('pending');
            $table->text('rejection_reason')->nullable();
            $table->boolean('is_active')->default(false);

            $table->boolean('notified_7_days')->default(false);
            $table->boolean('notified_1_day')->default(false);
            $table->boolean('notified_expired')->default(false);

            $table->timestamps();

            // Add indexes for better performance
            $table->index(['status', 'is_active']);
            $table->index('end_date');
            $table->index(['status', 'is_active', 'end_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('featured_projects');
    }
};
