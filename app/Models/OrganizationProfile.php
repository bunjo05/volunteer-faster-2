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
        // 'email',
        'city',
        'country',
        'foundedYear',
        'phone',
        'website',
        'description',
        'logo',
    ];

    /**
     * Get the user that owns the organization profile.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
