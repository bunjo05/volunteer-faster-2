<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'public_id',
        'user_public_id',
        'admin_public_id',
        'type',
        'title',
        'message',
        'data',
        'is_read',
        'read_at'
    ];

    protected $casts = [
        'data' => 'array',
        'is_read' => 'boolean',
        'read_at' => 'datetime'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->public_id)) {
                $model->public_id = (string) \Illuminate\Support\Str::ulid();
            }
        });
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'user_public_id', 'public_id');
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class, 'admin_public_id', 'public_id');
    }

    // Scopes
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    public function scopeForUser($query, $userPublicId)
    {
        return $query->where('user_public_id', $userPublicId);
    }

    public function scopeRecent($query, $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    // Mark as read
    public function markAsRead()
    {
        $this->update([
            'is_read' => true,
            'read_at' => now()
        ]);
    }

    // Mark all as read for user
    public static function markAllAsReadForUser($userPublicId)
    {
        return static::forUser($userPublicId)
            ->unread()
            ->update([
                'is_read' => true,
                'read_at' => now()
            ]);
    }
}
