// resources/js/Pages/Notifications/Index.jsx
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function NotificationsIndex({
    auth,
    notifications,
    unreadCount,
}) {
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
            window.location.reload();
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
            window.location.reload();
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    const getNotificationIcon = (type) => {
        const icons = {
            project_approved: "✅",
            project_rejected: "❌",
            new_booking: "📅",
            booking_approved: "👍",
            booking_completed: "🎉",
            organization_verification_approved: "✅",
            organization_verification_rejected: "❌",
            volunteer_verification_approved: "✅",
            volunteer_verification_rejected: "❌",
            featured_project_approved: "⭐",
            featured_project_rejected: "❌",
        };
        return icons[type] || "🔔";
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Notifications
                </h2>
            }
        >
            <Head title="Notifications" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-semibold">
                                Notifications{" "}
                                {unreadCount > 0 && `(${unreadCount} unread)`}
                            </h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        <div className="divide-y divide-gray-200">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-6 hover:bg-gray-50 cursor-pointer ${
                                            !notification.is_read
                                                ? "bg-blue-50"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            markAsRead(notification.id)
                                        }
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0 text-2xl">
                                                {getNotificationIcon(
                                                    notification.type
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-lg font-medium text-gray-900">
                                                    {notification.title}
                                                </p>
                                                <p className="text-gray-600 mt-1">
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center mt-2 text-sm text-gray-500">
                                                    <span>
                                                        {new Date(
                                                            notification.created_at
                                                        ).toLocaleString()}
                                                    </span>
                                                    {!notification.is_read && (
                                                        <span className="ml-4 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                            New
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="text-gray-400 text-6xl mb-4">
                                        🔔
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No notifications yet
                                    </h3>
                                    <p className="text-gray-500">
                                        We'll notify you when there's something
                                        new.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
