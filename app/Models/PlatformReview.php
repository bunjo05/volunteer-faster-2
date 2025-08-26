<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlatformReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'status',
        'message',
        'admin_id',
        'rating'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }

    // Fix this relationship - it should be through the user
    public function volunteer_profile()
    {
        return $this->hasOneThrough(
            VolunteerProfile::class,
            User::class,
            'id', // Foreign key on users table
        );
    }
}
