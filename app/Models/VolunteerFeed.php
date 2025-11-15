<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class VolunteerFeed extends Model
{
    use HasFactory;
    protected $fillable = [
        'public_id',
        'user_public_id',
        'booking_public_id',
        'feed_item'
    ];

    protected static function booted()
    {
        // parent::booted();
        static::creating(function ($volunteer_feed) {
            if (!$volunteer_feed->public_id) {
                $volunteer_feed->public_id = (string) Str::ulid();
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_public_id', 'public_id');
    }
    public function booking()
    {
        return $this->belongsTo(VolunteerBooking::class, 'booking_public_id', 'public_id');
    }
}
