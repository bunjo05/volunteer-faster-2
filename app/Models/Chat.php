<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Chat extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'status'];

    public function participants(): HasMany
    {
        return $this->hasMany(ChatParticipant::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(ChatMessage::class);
    }

    // Alias for messages() to maintain consistency with your code
    public function chatMessages(): HasMany
    {
        return $this->messages();
    }

    public function latestMessage(): HasOne
    {
        return $this->hasOne(ChatMessage::class)->latestOfMany();
    }

    public function volunteer()
    {
        return $this->participants()->whereNotNull('user_id')->first()?->user;
    }

    public function admin()
    {
        return $this->participants()->whereNotNull('admin_id')->first()?->admin;
    }
}
