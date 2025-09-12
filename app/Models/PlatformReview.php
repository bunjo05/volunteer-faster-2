<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlatformReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_public_id',
        'status',
        'message',
        'admin_id',
        'rating'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_public_id', 'public_id');
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class, 'admin_public_id', 'public_id');
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
