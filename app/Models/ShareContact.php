<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ShareContact extends Model
{
    use HasFactory;

    protected $fillable = [
        'public_id',
        'volunteer_public_id',
        'organization_public_id',
        'booking_public_id',
        'project_public_id',
        'status',
        'message',
        'requested_at',
        'approved_at'
    ];

    protected $casts = [
        'requested_at' => 'datetime',
        'approved_at' => 'datetime',
    ];

    /**
     * Get the volunteer that owns the contact share request.
     */
    public function volunteer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'volunteer_public_id', 'public_id');
    }

    /**
     * Get the organization that owns the contact share request.
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(User::class, 'organization_public_id', 'public_id');
    }

    /**
     * Get the booking associated with the contact request.
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(VolunteerBooking::class, 'booking_public_id', 'public_id');
    }

    /**
     * Get the project associated with the contact request.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'project_public_id', 'public_id');
    }

    /**
     * Check if the request is pending.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if the request is approved.
     */
    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    /**
     * Check if the request is rejected.
     */
    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }
}
