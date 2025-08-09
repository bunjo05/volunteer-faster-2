<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VolunteerProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
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

    protected $casts = [
        'hobbies' => 'array',
        'skills' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function verification()
    {
        return $this->hasOne(VolunteerVerification::class, 'volunteer_id');
    }
}
