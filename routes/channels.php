<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('message.{userId1}-{userId2}', function ($user, $userId1, $userId2) {
    // Check if user is part of this conversation
    return (int) $user->id === (int) $userId1 || (int) $user->id === (int) $userId2;
});
