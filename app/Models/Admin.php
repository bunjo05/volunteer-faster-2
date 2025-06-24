<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Admin extends Authenticatable
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function chats()
    {
        return $this->belongsToMany(Chat::class, 'chat_participants')
            ->withTimestamps();
    }

    public function chatMessages()
    {
        return $this->morphMany(ChatMessage::class, 'sender');
    }
}
