<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'public_id', // Add this
        'user_public_id',
        'booking_public_id',
        'project_public_id',
        'amount',
        // 'stripe_payment_id',
        'paypal_order_id',   // Add PayPal fields
        'paypal_capture_id',
        'status'
    ];

    protected static function booted()
    {
        // parent::booted();
        static::creating(function ($payment) {
            if (!$payment->public_id) {
                $payment->public_id = (string) Str::ulid();
            }
        });
    }


    public function user()
    {
        return $this->belongsTo(User::class, 'user_public_id', 'public_id');
    }

    // public function booking()
    // {
    //     return $this->belongsTo(VolunteerBooking::class);
    // }

    public function booking()
    {
        return $this->belongsTo(VolunteerBooking::class, 'booking_public_id', 'public_id'); // Explicitly set the foreign key
    }

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_public_id', 'public_id');
    }
}
