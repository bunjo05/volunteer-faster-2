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

    public function verification()
    {
        return $this->hasOne(OrganizationVerification::class, 'organization_profile_id');
    }

    /**
     * Get all users who follow this organization.
     */
    public function followers()
    {
        return $this->belongsToMany(User::class, 'volunteer_following_organizations', 'organization_id', 'user_id')
            ->withTimestamps();
    }
}
