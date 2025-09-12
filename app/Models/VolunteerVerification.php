<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class VolunteerVerification extends Model
{
    use HasFactory;

    protected $fillable = [
        'volunteer_public_id',
        'verification_type',
        'document',
        'status',
        'comments',
        'verified_at',
        'admin_public_id'
    ];

    protected $casts = [
        'verified_at' => 'datetime',
    ];

    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'admin_public_id', 'public_id');
    }

    public function volunteer(): BelongsTo
    {
        return $this->belongsTo(VolunteerProfile::class, 'volunteer_public_id', 'public_id');
    }

    public function verification(): HasOne
    {
        return $this->hasOne(VolunteerVerification::class, 'volunteer_public_id', 'public_id');
    }
}
