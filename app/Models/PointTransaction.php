<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PointTransaction extends Model
{
    protected $fillable = [
        'user_id',
        'organization_id',
        'booking_id',
        'points',
        'type',
        'description'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function organization()
    {
        return $this->belongsTo(User::class, 'organization_id');
    }

    public function booking()
    {
        return $this->belongsTo(VolunteerBooking::class);
    }
}
