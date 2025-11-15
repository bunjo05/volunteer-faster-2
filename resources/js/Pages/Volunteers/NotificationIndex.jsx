// resources/js/Pages/Notifications/Index.jsx
import VolunteerLayout from "@/Layouts/VolunteerLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import { Ban, CircleCheckBig, CircleX } from "lucide-react";

export default function NotificationsIndex({
    auth,
    notifications,
    unreadCount,
}) {
    const [localNotifications, setLocalNotifications] = useState(notifications);
    const [localUnreadCount, setLocalUnreadCount] = useState(unreadCount);

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

    const markAsRead = async (id) => {
        try {
            await fetch(`/notifications/${id}/read`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]'
                    ).content,
                },
            });
            setLocalNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
            );
            setLocalUnreadCount((prev) => Math.max(0, prev - 1));
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
            setLocalNotifications((prev) =>
                prev.map((n) => ({ ...n, is_read: true }))
            );
            setLocalUnreadCount(0);
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    const getNotificationIcon = (type) => {
        const iconBase =
            "w-10 h-10 rounded-full flex items-center justify-center";
        const icons = {
            booking_approved: (
                <div className={`${iconBase} bg-emerald-100 text-emerald-600`}>
                    <CircleCheckBig className="w-5 h-5" />
                </div>
            ),
            booking_rejected: (
                <div className={`${iconBase} bg-red-100 text-red-600`}>
                    <CircleX className="w-5 h-5" />
                </div>
            ),
            booking_cancelled: (
                <div className={`${iconBase} bg-orange-100 text-orange-600`}>
                    <Ban className="w-5 h-5" />
                </div>
            ),
            new_booking: (
                <div className={`${iconBase} bg-blue-100 text-blue-600`}>
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                </div>
            ),
        };
        return (
            icons[type] || (
                <div className={`${iconBase} bg-gray-100 text-gray-600`}>
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                    </svg>
                </div>
            )
        );
    };

    return (
        <VolunteerLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-bold text-2xl text-gray-900 leading-tight">
                            Notifications
                        </h2>
                        <p className="text-gray-600 text-sm mt-1">
                            Stay informed with updates from your activities
                        </p>
                    </div>
                    {localUnreadCount > 0 && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full shadow-sm">
                            {localUnreadCount} unread
                        </span>
                    )}
                </div>
            }
        >
            <Head title="Notifications" />

            <div className="py-4">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-2 space-y-6">
                    {/* Header Card */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Notification Center
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Review, manage, and stay updated
                                        effortlessly
                                    </p>
                                </div>
                            </div>
                            {localUnreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 hover:shadow transition-all duration-200 font-medium text-sm"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
                        {localNotifications.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {localNotifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() =>
                                            markAsRead(notification.id)
                                        }
                                        className={`p-2 flex justify-center items-center gap-3 space-x-4 cursor-pointer transition-all duration-200 ${
                                            notification.is_read
                                                ? "bg-white hover:bg-gray-50"
                                                : "bg-blue-50 border-l-4 border-blue-400 hover:bg-blue-100"
                                        }`}
                                    >
                                        {getNotificationIcon(notification.type)}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4
                                                        className={`text-base font-semibold ${
                                                            notification.is_read
                                                                ? "text-gray-800"
                                                                : "text-gray-900"
                                                        }`}
                                                    >
                                                        {notification.title}
                                                    </h4>
                                                    <p className="text-gray-600 mt-1 leading-relaxed text-sm">
                                                        {notification.message}
                                                    </p>
                                                </div>
                                                {!notification.is_read && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                        New
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="text-xs text-gray-500 font-medium">
                                                    {formatTimeAgo(
                                                        notification.created_at
                                                    )}
                                                </span>
                                                {!notification.is_read && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            markAsRead(
                                                                notification.id
                                                            );
                                                        }}
                                                        className="text-xs text-blue-600 hover:text-blue-800 font-medium transition"
                                                    >
                                                        Mark as read
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                                    <svg
                                        className="w-8 h-8 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    You're all caught up!
                                </h3>
                                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                                    You’ve seen all recent updates. Check back
                                    later for new ones.
                                </p>
                            </div>
                        )}
                    </div>

                    {localNotifications.length > 0 && (
                        <div className="text-center pt-2">
                            <p className="text-sm text-gray-500">
                                Showing {localNotifications.length} notification
                                {localNotifications.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </VolunteerLayout>
    );
}
