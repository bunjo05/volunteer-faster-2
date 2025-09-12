<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrganizationProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'public_id',
        'user_public_id',
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

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($organizationProfile) {
            if (!$organizationProfile->public_id) {
                $organizationProfile->public_id = (string) Str::ulid();
            }
        });
    }


    /**
     * Get the user that owns the organization profile.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_public_id', 'public_id');
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
        return $this->belongsToMany(
            User::class,
            'volunteer_following_organizations',
            'organization_public_id', // Foreign key on the pivot table
            'user_public_id', // Foreign key on the pivot table
            'public_id', // Local key on organization_profiles table
            'public_id' // Foreign key on users table
        )->withTimestamps();
    }
}
