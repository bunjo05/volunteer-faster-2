<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;

class VolunteerBooking extends Model
{
    protected $fillable = [
        'public_id', // Add this
        'user_public_id',
        'project_public_id',
        'start_date',
        'end_date',
        'number_of_travellers',
        'booking_status'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($booking) {
            if (!$booking->public_id) {
                $booking->public_id = (string) Str::ulid();
            }
        });
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'user_public_id', 'public_id');
    }

    public function reminders()
    {
        return $this->hasMany(Reminder::class, 'booking_public_id', 'public_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'booking_public_id', 'public_id');
    }

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_public_id', 'public_id');
    }

    public function calculateDaysSpent()
    {
        $start = new \DateTime($this->start_date);
        $end = new \DateTime($this->end_date);
        $interval = $start->diff($end);
        return $interval->days + 1;
    }

    public function pointTransactions()
    {
        return $this->hasMany(PointTransaction::class, 'booking_public_id', 'public_id');
    }

    public function getRouteKeyName()
    {
        return 'public_id';
    }

    public function sponsorships()
    {
        return $this->hasMany(Sponsorship::class, 'booking_public_id', 'public_id');
    }

    public function organizationProfile()
    {
        return $this->belongsTo(OrganizationProfile::class, 'organization_public_id', 'public_id');
    }
}
