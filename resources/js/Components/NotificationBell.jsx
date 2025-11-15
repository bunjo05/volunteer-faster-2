// components/NotificationBell.jsx
import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { BellIcon } from "@heroicons/react/24/outline";

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const { auth } = usePage().props;

    useEffect(() => {
        fetchUnreadCount();
        fetchRecentNotifications();
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const response = await fetch("/api/notifications/unread-count");
            const data = await response.json();
            setUnreadCount(data.count);
        } catch (error) {
            console.error("Error fetching unread count:", error);
        }
    };

    const fetchRecentNotifications = async () => {
        try {
            const response = await fetch("/api/notifications/recent");
            const data = await response.json();
            setNotifications(data.notifications);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await fetch(`/notifications/${notificationId}/read`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]'
                    ).content,
                },
            });
            fetchUnreadCount();
            fetchRecentNotifications();
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch("/notifications/mark-all-read", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]'
                    ).content,
                },
            });
            fetchUnreadCount();
            fetchRecentNotifications();
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    // Function to get the correct notifications route based on user role
    const getNotificationsRoute = () => {
        const user = auth?.user;

        if (!user) {
            return "/notifications";
        }

        switch (user.role) {
            case "Organization":
                return "/organization/notifications";
            case "Volunteer":
                return "/volunteer/notifications";
            case "Admin":
                return "/admin/notifications";
            default:
                return "/notifications";
        }
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        if (diffInSeconds < 60) return "Just now";
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const notificationsRoute = getNotificationsRoute();

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none transition-colors"
            >
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                                        !notification.is_read
                                            ? "bg-blue-50 border-l-2 border-blue-500"
                                            : ""
                                    }`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-medium text-gray-900 text-sm">
                                                    {notification.title}
                                                </p>
                                                {!notification.is_read && (
                                                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {formatTimeAgo(
                                                    notification.created_at
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-6 text-center">
                                <div className="text-gray-400 text-4xl mb-2">
                                    🔔
                                </div>
                                <p className="text-gray-500 text-sm">
                                    No notifications
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-gray-200">
                        <Link
                            href={notificationsRoute}
                            className="block text-center text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                            View all notifications
                        </Link>
                    </div>
                </div>
            )}

            {/* Close when clicking outside */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </div>
    );
}
