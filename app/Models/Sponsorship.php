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
        'stripe_payment_id',
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

    public function booking()
    {
        return $this->belongsTo(VolunteerBooking::class, 'booking_public_id', 'public_id');
    }

    public function sponsorship()
    {
        return $this->belongsTo(VolunteerSponsorship::class, 'sponsorship_public_id', 'public_id');
    }
}
