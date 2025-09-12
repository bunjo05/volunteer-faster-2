<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VolunteerFollowingOrganization extends Model
{
    protected $fillable = ['organization_public_id', 'user_public_id'];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(
            OrganizationProfile::class,
            'organization_public_id', // Foreign key in this table
            'public_id' // Primary key in the related table
        );
    }
    public function volunteer()
    {
        return $this->belongsTo(
            User::class,
            'user_public_id',
            'public_id'
        );
    }
}
