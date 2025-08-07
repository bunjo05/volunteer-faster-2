<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrganizationVerification extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_profile_id',
        'type_of_document',
        'certificate',
        'type_of_document_2',
        'another_document',
        'status',
        'comments',
        'verified_at',
        'admin_id'
    ];

    protected $casts = [
        'verified_at' => 'datetime',
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(OrganizationProfile::class, 'organization_profile_id');
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}
