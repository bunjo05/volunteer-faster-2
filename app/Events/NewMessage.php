<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class NewMessage implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    public function __construct(Message $message)
    {
        try {
            $this->message = $message->load([
                'sender',
                'receiver',
                'originalMessage.sender',
                'project',
                'booking'
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to load message relationships: ' . $e->getMessage());
            throw $e;
        }
    }

    public function broadcastOn()
    {
        // Sort IDs to ensure consistent channel naming
        $ids = [$this->message->sender_id, $this->message->receiver_id];
        sort($ids);
        $channelName = 'message.' . implode('-', $ids);

        return new PrivateChannel($channelName);
    }

    public function broadcastAs()
    {
        return 'new.message';
    }

    public function broadcastWith()
    {
        return [
            'message' => [
                'id' => $this->message->id,
                'message' => $this->message->message,
                'sender_id' => $this->message->sender_id,
                'receiver_id' => $this->message->receiver_id,
                'status' => $this->message->status,
                'created_at' => $this->message->created_at->toISOString(),
                'reply_to' => $this->message->reply_to,
                'original_message' => $this->message->originalMessage ? [
                    'id' => $this->message->originalMessage->id,
                    'message' => $this->message->originalMessage->message,
                    'sender_id' => $this->message->originalMessage->sender_id,
                    'sender' => $this->message->originalMessage->sender ? [
                        'id' => $this->message->originalMessage->sender->id,
                        'name' => $this->message->originalMessage->sender->name,
                        'email' => $this->message->originalMessage->sender->email,
                    ] : null,
                ] : null,
                'project_id' => $this->message->project_id,
                'booking_id' => $this->message->booking_id,
                'sender' => [
                    'id' => $this->message->sender->id,
                    'name' => $this->message->sender->name,
                    'email' => $this->message->sender->email,
                ],
                'receiver' => [
                    'id' => $this->message->receiver->id,
                    'name' => $this->message->receiver->name,
                    'email' => $this->message->receiver->email,
                ],
            ]
        ];
    }
}
