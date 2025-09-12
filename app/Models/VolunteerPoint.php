<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VolunteerPoint extends Model
{
    protected $fillable = [
        'user_public_id',
        'booking_public_id',
        'points_earned',
        'notes'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_public_id', 'public_id');
    }

    public function booking()
    {
        return $this->belongsTo(VolunteerBooking::class, 'booking_public_id', 'public_id');
    }
}
