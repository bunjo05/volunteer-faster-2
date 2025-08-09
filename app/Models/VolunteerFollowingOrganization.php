<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VolunteerFollowingOrganization extends Model
{
    protected $fillable = ['organization_id', 'user_id'];

    public function organization()
    {
        return $this->belongsTo(OrganizationProfile::class);
    }

    public function volunteer()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
