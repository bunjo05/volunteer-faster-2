<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('chat.{chatId}', function ($user, $chatId) {
    // For users
    if ($user instanceof \App\Models\User) {
        return \App\Models\Chat::where('id', $chatId)
            ->whereHas('participants', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->exists();
    }

    // For admins
    if ($user instanceof \App\Models\Admin) {
        return \App\Models\Chat::where('id', $chatId)
            ->whereHas('participants', function ($q) use ($user) {
                $q->where('admin_id', $user->id);
            })
            ->exists();
    }

    return false;
});
