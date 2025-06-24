<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('chat.{chatId}', function ($user, $chatId) {
    return \App\Models\Chat::where('id', $chatId)
        ->whereHas('participants', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        })
        ->exists();
});
