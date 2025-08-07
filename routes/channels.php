<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('chat.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

// Broadcast::channel('chat.{chatId}', function ($user, $chatId) {
//     return \App\Models\ChatParticipant::where('chat_id', $chatId)
//         ->where(function ($query) use ($user) {
//             $query->where('user_id', $user->id)
//                 ->orWhere('admin_id', $user->id);
//         })
//         ->exists();
// });
