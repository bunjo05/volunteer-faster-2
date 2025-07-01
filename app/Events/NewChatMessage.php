<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewChatMessage implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;
    public $chatId;

    public function __construct($message, $chatId)
    {
        $this->message = $message;
        $this->chatId = $chatId;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('chat.' . $this->chatId);
    }

    public function broadcastAs()
    {
        return 'NewChatMessage';
    }

    public function broadcastWith()
    {
        // Ensure consistent message format
        $messageData = is_array($this->message) ? $this->message : [
            'id' => $this->message->id,
            'content' => $this->message->content,
            'sender_id' => $this->message->sender_id,
            'sender_type' => $this->message->sender_type,
            'created_at' => $this->message->created_at->toISOString(),
            'status' => 'Sent',
            'sender' => $this->message->sender,
            'is_admin' => $this->message->sender_type === 'App\Models\Admin'
        ];

        return [
            'message' => $messageData,
            'chatId' => $this->chatId
        ];
    }
}
