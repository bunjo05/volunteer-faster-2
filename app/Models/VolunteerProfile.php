<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class VolunteerProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'public_id', // Add this
        'user_public_id',
        'gender',
        'dob',
        'country',
        'state',
        'city',
        'postal',
        'phone',
        'profile_picture',
        'facebook',
        'twitter',
        'instagram',
        'linkedin',
        'hobbies',
        'education_status',
        'skills',
        'nok',
        'nok_phone',
        'nok_relation'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($profile) {
            if (!$profile->public_id) {
                $profile->public_id = (string) Str::ulid();
            }
        });
    }

    protected $casts = [
        'hobbies' => 'array',
        'skills' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_public_id', 'public_id');
    }


    public function verification()
    {
        return $this->hasOne(VolunteerVerification::class, 'volunteer_public_id', 'public_id');
    }
}
