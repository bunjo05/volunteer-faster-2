<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PointTransaction extends Model
{
    protected $fillable = [
        'user_public_id', // Changed from 'user_id'
        'organization_public_id', // Changed from 'organization_id'
        'booking_public_id', // Changed from 'booking_id'
        'points',
        'type',
        'description'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_public_id', 'public_id');
    }

    public function organization()
    {
        return $this->belongsTo(User::class, 'organization_public_id', 'public_id');
    }

    public function booking()
    {
        return $this->belongsTo(VolunteerBooking::class, 'booking_public_id', 'public_id');
    }
}
