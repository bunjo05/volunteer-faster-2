<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Sponsorship extends Model
{
    use HasFactory;

    protected $fillable = [
        'public_id',
        'user_public_id',
        'booking_public_id',
        'sponsorship_public_id',
        'amount',
        'funding_allocation',
        // 'stripe_payment_id',
        'paypal_order_id',   // Add PayPal fields
        'paypal_capture_id',
        'status',
        'payment_method',
        'is_anonymous'
    ];

    protected $casts = [
        'funding_allocation' => 'array',
        'amount' => 'decimal:2'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_public_id', 'public_id');
    }

    public function organization()
    {
        return $this->hasOneThrough(
            OrganizationProfile::class,
            VolunteerBooking::class,
            'public_id', // Foreign key on VolunteerBooking table
            'user_public_id', // Foreign key on OrganizationProfile table
            'booking_public_id', // Local key on Sponsorship table
            'user_public_id' // Local key on VolunteerBooking table
        );
    }

    public function booking()
    {
        return $this->belongsTo(VolunteerBooking::class, 'booking_public_id', 'public_id');
    }

    public function sponsorship()
    {
        return $this->belongsTo(VolunteerSponsorship::class, 'sponsorship_public_id', 'public_id');
    }

    // Helper method to calculate volunteers sponsored
    public function calculateVolunteersSponsored()
    {
        if ($this->booking && $this->booking->project) {
            // This is a simple example - you might have more complex logic
            return $this->booking->project->volunteers_count ?? 1;
        }
        return 1;
    }

    public function organizationProfile()
    {
        return $this->belongsTo(OrganizationProfile::class, 'organization_public_id', 'public_id');
    }

    // Add this relationship
    public function appreciations()
    {
        return $this->hasMany(Appreciation::class, 'sponsorship_public_id', 'public_id');
    }
}
