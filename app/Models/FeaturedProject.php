<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FeaturedProject extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'user_id',
        'plan_type',
        'amount',
        'stripe_payment_id',
        'start_date',
        'end_date',
        'status',
        'rejection_reason',
        'is_active',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    // In your FeaturedProject model (app/Models/FeaturedProject.php)
    protected $dates = ['start_date', 'end_date'];

    public function getIsActiveAttribute($value)
    {
        // If manually set to false, return false
        if (!$value) {
            return false;
        }

        // If end_date is passed and project is still marked active
        if ($this->end_date && now()->gt($this->end_date)) {
            // Update the database if needed
            if ($value) {
                DB::table('featured_projects')
                    ->where('id', $this->id)
                    ->update(['is_active' => false]);
            }
            return false;
        }

        return $value;
    }
}
