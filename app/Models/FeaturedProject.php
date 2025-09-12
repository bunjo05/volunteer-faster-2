<?php

namespace App\Models;

use App\Models\User;
use App\Models\Project;
use Illuminate\Support\Facades\DB;

use Illuminate\Support\Facades\Log;
use App\Mail\FeaturedProjectExpired;
use Illuminate\Support\Facades\Mail;
use App\Mail\FeaturedProjectExpiring;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FeaturedProject extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_public_id',
        'user_public_id',
        'plan_type',
        'amount',
        'stripe_payment_id',
        'start_date',
        'end_date',
        'status',
        'rejection_reason',
        'is_active',
        'notified_7_days',
        'notified_1_day',
        'notified_expired'
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'notified_7_days' => 'boolean',
        'notified_1_day' => 'boolean',
        'notified_expired' => 'boolean',
    ];

    protected static function booted()
    {
        // Check for expired featured projects on model retrieval
        static::retrieved(function ($featuredProject) {
            $featuredProject->checkAndUpdateExpiration();
        });

        // Also check when saving to ensure consistency
        static::saving(function ($featuredProject) {
            $featuredProject->checkAndUpdateExpiration();
        });
    }

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_public_id', 'public_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_public_id', 'public_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where('status', 'approved')
            ->where(function ($query) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>', now());
            });
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeExpired($query)
    {
        return $query->where('status', 'approved')
            ->where(function ($query) {
                $query->where('is_active', true)
                    ->where('end_date', '<=', now());
            });
    }

    // In your FeaturedProject model (app/Models/FeaturedProject.php)
    protected $dates = ['start_date', 'end_date'];

    /**
     * Check and update expiration status
     */
    public function checkAndUpdateExpiration()
    {
        // Only check approved featured projects that are still marked as active
        if ($this->status === 'approved' && $this->is_active && $this->end_date) {
            if (now()->gt($this->end_date)) {
                // Send expired notification before updating status
                if (!$this->notified_expired) {
                    $this->sendExpiredNotification();
                }

                $this->update([
                    'is_active' => false,
                    'status' => 'expired',
                ]);

                $this->refresh();
            }
        }

        // Always check for notifications, even for non-expired projects
        $this->checkAndSendNotifications();
    }

    public function checkAndSendNotifications()
    {
        // Only check approved and active featured projects
        if ($this->status === 'approved' && $this->is_active && $this->end_date) {
            $daysLeft = now()->diffInDays($this->end_date, false);

            // 7 days left notification
            if ($daysLeft <= 7 && $daysLeft > 1 && !$this->notified_7_days) {
                $this->sendSevenDaysNotification();
            }

            // 1 day left notification
            if ($daysLeft <= 1 && $daysLeft > 0 && !$this->notified_1_day) {
                $this->sendOneDayNotification();
            }

            // Expired notification - handle immediate expiration case
            if ($daysLeft <= 0 && !$this->notified_expired) {
                $this->sendExpiredNotification();
                $this->update([
                    'is_active' => false,
                    'status' => 'expired',
                    'notified_expired' => true
                ]);
            }
        }
    }

    /**
     * Send 7 days left notification
     */
    protected function sendSevenDaysNotification()
    {
        try {
            Mail::to($this->user->email)
                ->send(new FeaturedProjectExpiring($this, 7));

            $this->update(['notified_7_days' => true]);
        } catch (\Exception $e) {
            Log::error('Failed to send 7-day notification: ' . $e->getMessage());
        }
    }

    /**
     * Send 1 day left notification
     */
    protected function sendOneDayNotification()
    {
        try {
            Mail::to($this->user->email)
                ->send(new FeaturedProjectExpiring($this, 1));

            $this->update(['notified_1_day' => true]);
        } catch (\Exception $e) {
            Log::error('Failed to send 1-day notification: ' . $e->getMessage());
        }
    }

    /**
     * Send expired notification
     */
    protected function sendExpiredNotification()
    {
        try {
            Mail::to($this->user->email)
                ->send(new FeaturedProjectExpired($this));

            $this->update(['notified_expired' => true]);

            Log::info('Expired notification sent for featured project: ' . $this->id . ' to user: ' . $this->user->email);
        } catch (\Exception $e) {
            Log::error('Failed to send expired notification for project ' . $this->id . ': ' . $e->getMessage());
        }
    }

    public function getIsActiveAttribute($value)
    {
        // If manually set to false, return false
        if (!$value) {
            return false;
        }

        // If status is not approved, return false
        if ($this->status !== 'approved') {
            return false;
        }

        // If end_date is passed, automatically mark as expired
        if ($this->end_date && now()->gt($this->end_date)) {
            // Send notification if not already sent
            if (!$this->notified_expired) {
                $this->sendExpiredNotification();
            }

            // Update status
            if ($value) {
                $this->update([
                    'is_active' => false,
                    'status' => 'expired',
                    'notified_expired' => true
                ]);
            }
            return false;
        }

        return $value;
    }

    /**
     * Static method to check all featured projects for expiration
     * Can be called from controllers, middleware, or other places
     */
    public static function checkAllExpirations()
    {
        // Get projects that are either about to expire or have expired
        $featuredProjects = self::where('status', 'approved')
            ->where('is_active', true)
            ->where(function ($query) {
                $query->where('end_date', '<=', now()->addDays(8)) // Upcoming expirations
                    ->orWhere(function ($q) {
                        $q->where('end_date', '<=', now()) // Already expired
                            ->where('notified_expired', false); // But not notified yet
                    });
            })
            ->with(['user', 'project'])
            ->get();

        $processedCount = 0;
        $notifiedCount = 0;

        foreach ($featuredProjects as $project) {
            $originalNotified = $project->notified_expired;

            $project->checkAndUpdateExpiration();

            if (!$originalNotified && $project->notified_expired) {
                $notifiedCount++;
            }

            $processedCount++;
        }

        Log::info("Processed {$processedCount} featured projects, sent {$notifiedCount} expired notifications");

        return $processedCount;
    }
}
