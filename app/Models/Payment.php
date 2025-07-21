<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'user_id',
        'booking_id',
        'project_id',
        'amount',
        'stripe_payment_id',
        'status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function booking()
    {
        return $this->belongsTo(VolunteerBooking::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
