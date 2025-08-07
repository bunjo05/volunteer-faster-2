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
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
