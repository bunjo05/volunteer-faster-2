<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VolunteerVerification extends Model
{
    use HasFactory;


    protected $fillable = [
        'volunteer_id',
        'verification_type',
        'document',
        'status',
        'comments',
        'verified_at',
        'admin_id'
    ];

    protected $casts = [
        'verified_at' => 'datetime',
    ];

    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'admin_id');
    }

    public function volunteer(): BelongsTo
    {
        return $this->belongsTo(VolunteerProfile::class, 'volunteer_id');
    }
}
