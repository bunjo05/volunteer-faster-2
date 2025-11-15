<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function volunteerIndex(Request $request)
    {
        $user = Auth::user();
        $notifications = NotificationService::getUserNotifications($user->public_id, 20);
        $unreadCount = NotificationService::getUnreadCount($user->public_id);

        return Inertia::render('Volunteers/NotificationIndex', [
            'notifications' => $notifications,
            'unreadCount' => $unreadCount
        ]);
    }

    public function organizationIndex(Request $request)
    {
        $user = Auth::user();
        $notifications = NotificationService::getUserNotifications($user->public_id, 20);
        $unreadCount = NotificationService::getUnreadCount($user->public_id);

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
            'unreadCount' => $unreadCount
        ]);
    }

    public function markAsRead(Notification $notification)
    {
        $user = Auth::user();

        // Verify the notification belongs to the user
        if ($notification->user_public_id !== $user->public_id) {
            abort(403);
        }

        $notification->markAsRead();

        return response()->json(['success' => true]);
    }

    public function markAllAsRead()
    {
        $user = Auth::user();
        Notification::markAllAsReadForUser($user->public_id);

        return response()->json(['success' => true]);
    }

    public function getUnreadCount()
    {
        $user = Auth::user();
        $count = NotificationService::getUnreadCount($user->public_id);

        return response()->json(['count' => $count]);
    }

    public function getRecentNotifications()
    {
        $user = Auth::user();
        $notifications = NotificationService::getUserNotifications($user->public_id, 5);

        return response()->json(['notifications' => $notifications]);
    }
}
