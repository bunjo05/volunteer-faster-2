<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrganizationProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'city',
        'state',
        'country',
        'foundedYear',
        'phone',
        'website',
        'facebook',
        'twitter',
        'instagram',
        'linkedin',
        'youtube',
        // 'email',
        'description',
        'mission_statement',
        'vision_statement',
        'values',
        'address',
        'postal',
        'logo'
    ];

    /**
     * Get the user that owns the organization profile.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
