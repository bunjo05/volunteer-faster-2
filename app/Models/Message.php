<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'sender_id',
        'receiver_id',
        'project_id',
        'message',
        'status',
        'reply_to'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    // Add this relationship
    public function originalMessage(): BelongsTo
    {
        return $this->belongsTo(Message::class, 'reply_to');
    }

    // Add this if you want to get all replies to a message
    public function replies()
    {
        return $this->hasMany(Message::class, 'reply_to');
    }

    public function markAsRead(): void
    {
        $this->update(['status' => 'read']);
    }

    public function isUnread(): bool
    {
        return $this->status === 'unread';
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(VolunteerBooking::class, 'booking_id');
    }
}
