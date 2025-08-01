<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageRead implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $chatId;
    public $timestamp;

    public function __construct($chatId, $timestamp)
    {
        $this->chatId = $chatId;
        $this->timestamp = $timestamp;
    }

    public function broadcastOn()
    {
        return new PrivateChannel("chat.{$this->chatId}");
    }

    public function broadcastAs()
    {
        return 'MessageRead';
    }

    public function broadcastWith()
    {
        return [
            'chatId' => $this->chatId,
            'timestamp' => $this->timestamp->toISOString()
        ];
    }
}
