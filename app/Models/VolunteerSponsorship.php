<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class VolunteerSponsorship extends Model
{
    use HasFactory;

    protected $fillable = [
        'public_id',
        'user_public_id',
        'booking_public_id',
        'total_amount',
        'accommodation',
        'meals',
        'living_expenses',
        'visa_fees',
        'travel',
        'project_fees_amount',
        'self_introduction',
        'impact',
        'commitment',
        'agreement',
        'aspect_needs_funding',
        'skills',
        'privacy'
    ];

    protected $casts = [
        'aspect_needs_funding' => 'array',
        'skills' => 'array',
        'commitment' => 'boolean',
        'agreement' => 'boolean',
        'total_amount' => 'decimal:2',
        'travel' => 'decimal:2',
        'accommodation' => 'decimal:2',
        'meals' => 'decimal:2',
        'living_expenses' => 'decimal:2',
        'visa_fees' => 'decimal:2',
        'project_fees_amount' => 'decimal:2',
    ];

    protected $appends = ['funded_amount'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($volunteer_sponsorship) {
            if (!$volunteer_sponsorship->public_id) {
                $volunteer_sponsorship->public_id = (string) Str::ulid();
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_public_id', 'public_id');
    }

    public function booking()
    {
        return $this->belongsTo(VolunteerBooking::class, 'booking_public_id', 'public_id')->with('user');
    }

    public function volunteer_profile()
    {
        return $this->hasOne(VolunteerProfile::class, 'user_public_id', 'user_public_id');
    }

    public function sponsorships()
    {
        return $this->hasMany(Sponsorship::class, 'sponsorship_public_id', 'public_id');
    }

    public function getFundedAmountAttribute()
    {
        return $this->sponsorships()
            ->where('status', 'completed')
            ->sum('amount');
    }
}
