import {
    LogOut,
    Users,
    Folder,
    MessageSquare,
    Home,
    Bell,
    Menu,
    ChevronDown,
    ChevronRight,
    Clock,
    Check,
    X,
} from "lucide-react";
import { Link, router, usePage } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [projectsOpen, setProjectsOpen] = useState(false);
    const [reportsOpen, setReportsOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const notificationsRef = useRef(null);

    useEffect(() => {
        if (window.Echo) {
            // Listen for new chat requests
            window.Echo.private(`admin.${auth.user.id}`)
                .listen("NewChatRequest", (data) => {
                    addNotification({
                        type: "chat_request",
                        chat: data.chat,
                        user: data.chat.user,
                        status: "pending",
                        timestamp: new Date(),
                    });
                })
                .listen("ChatDeclined", (data) => {
                    if (data.adminId !== auth.user.id) {
                        updateNotifications(data.chatId, "declined");
                    }
                });
        }

        return () => {
            if (window.Echo) {
                window.Echo.private(`admin.${auth.user.id}`).stopListening(
                    "NewChatRequest"
                );
                window.Echo.private(`admin.${auth.user.id}`).stopListening(
                    "ChatDeclined"
                );
            }
        };
    }, [auth.user.id]);

    const addNotification = (notification) => {
        setNotifications((prev) => [
            {
                id: Date.now(),
                ...notification,
                read: false,
            },
            ...prev,
        ]);
        setUnreadCount((prev) => prev + 1);
        playNotificationSound();
    };

    const updateNotifications = (chatId, status) => {
        setNotifications((prev) =>
            prev.map((n) => (n.chat?.id === chatId ? { ...n, status } : n))
        );
    };

    const playNotificationSound = () => {
        new Audio("/sounds/notification.mp3").play();
    };

    const markAsRead = (id = null) => {
        if (id) {
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } else {
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            setUnreadCount(0);
        }
    };

    const handleAcceptChat = async (chatId) => {
        try {
            await axios.post(`/admin/chat/${chatId}/accept`);
            updateNotifications(chatId, "accepted");
            router.visit(route("admin.chat.show", chatId));
        } catch (error) {
            console.error("Error accepting chat:", error);
        }
    };

    const handleDeclineChat = async (chatId) => {
        try {
            await axios.post(`/admin/chat/${chatId}/decline`);
            updateNotifications(chatId, "declined");
        } catch (error) {
            console.error("Error declining chat:", error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar Overlay for Mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-30 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`fixed z-30 inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
                ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0 lg:static lg:inset-0`}
            >
                <div className="h-16 flex items-center justify-center border-b">
                    <span className="font-bold text-xl text-indigo-600">
                        Admin Panel
                    </span>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    <Link
                        href={route("admin.dashboard")}
                        className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg"
                    >
                        <Home size={18} />
                        Dashboard
                    </Link>

                    <Link
                        href={route("admin.organizations")}
                        className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg"
                    >
                        <Folder size={18} />
                        Organizations
                    </Link>

                    <Link
                        href={route("admin.volunteers")}
                        className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg"
                    >
                        <Folder size={18} />
                        Volunteers
                    </Link>

                    {/* Projects Dropdown */}
                    <div className="space-y-1">
                        <button
                            onClick={() => setProjectsOpen(!projectsOpen)}
                            className="flex items-center justify-between w-full text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <Folder size={18} />
                                <span>Projects</span>
                            </div>
                            {projectsOpen ? (
                                <ChevronDown size={16} />
                            ) : (
                                <ChevronRight size={16} />
                            )}
                        </button>
                        {projectsOpen && (
                            <div className="pl-8 space-y-1">
                                <Link
                                    href={route("admin.projects")}
                                    className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg"
                                >
                                    All Projects
                                </Link>
                                <Link
                                    href={route("admin.featured.projects")}
                                    className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg"
                                >
                                    Featured Projects
                                </Link>
                                <Link
                                    href={route("admin.categories")}
                                    className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg"
                                >
                                    Categories
                                </Link>
                                <Link
                                    href={route("admin.subcategories")}
                                    className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg"
                                >
                                    Subcategories
                                </Link>
                            </div>
                        )}
                    </div>

                    <Link
                        href={route("admin.messages")}
                        className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg"
                    >
                        <MessageSquare size={18} />
                        Messages
                    </Link>

                    <Link
                        href={route("admin.payments")}
                        className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg"
                    >
                        <MessageSquare size={18} />
                        Payments
                    </Link>

                    <Link
                        href={route("chat.index")}
                        className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg"
                    >
                        <MessageSquare size={18} />
                        Chat Support
                    </Link>

                    {/* Reports Dropdown */}
                    <div className="space-y-1">
                        <button
                            onClick={() => setReportsOpen(!reportsOpen)}
                            className="flex items-center justify-between w-full text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <Folder size={18} />
                                <span>Reports</span>
                            </div>
                            {reportsOpen ? (
                                <ChevronDown size={16} />
                            ) : (
                                <ChevronRight size={16} />
                            )}
                        </button>
                        {reportsOpen && (
                            <div className="pl-8 space-y-1">
                                <Link
                                    href={route("admin.project.reports")}
                                    className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg"
                                >
                                    Project Reports
                                </Link>
                                <Link
                                    href={route("admin.report-categories")}
                                    className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg"
                                >
                                    Report Categories
                                </Link>
                                <Link
                                    href={route(
                                        "admin.report-subcategories.index"
                                    )}
                                    className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg"
                                >
                                    Report Subcategories
                                </Link>
                            </div>
                        )}
                    </div>
                    <Link
                        href={route("admin.users")}
                        className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg"
                    >
                        <Users size={18} />
                        Manage Users
                    </Link>
                    <Link
                        href={route("admin.contacts.index")}
                        className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg"
                    >
                        <Users size={18} />
                        User Contacts
                    </Link>

                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="flex items-center gap-3 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg mt-auto"
                    >
                        <LogOut size={18} />
                        Logout
                    </Link>
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1">
                {/* Top Bar */}
                <header className="h-16 bg-white shadow px-4 sm:px-6 flex items-center justify-between">
                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden text-gray-600"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <Menu size={24} />
                    </button>

                    <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
                        Admin Dashboard
                    </h1>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="relative" ref={notificationsRef}>
                            <button
                                onClick={() => {
                                    setNotificationsOpen(!notificationsOpen);
                                    markAsRead();
                                }}
                                className="p-1 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none"
                            >
                                <Bell className="h-6 w-6" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notification Dropdown */}
                            {notificationsOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
                                    <div className="py-1">
                                        <div className="px-4 py-2 border-b flex justify-between items-center bg-gray-50">
                                            <h3 className="font-medium">
                                                Notifications
                                            </h3>
                                            <button
                                                onClick={() => markAsRead()}
                                                className="text-xs text-indigo-600 hover:text-indigo-800"
                                            >
                                                Mark all as read
                                            </button>
                                        </div>

                                        {notifications.length === 0 ? (
                                            <div className="px-4 py-6 text-center text-gray-500">
                                                No notifications
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                                                {notifications.map(
                                                    (notification) => (
                                                        <div
                                                            key={
                                                                notification.id
                                                            }
                                                            className={`px-4 py-3 ${
                                                                !notification.read
                                                                    ? "bg-blue-50"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {notification.type ===
                                                                "chat_request" && (
                                                                <div>
                                                                    <div className="flex items-start">
                                                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                                                                            {notification.user?.name?.charAt(
                                                                                0
                                                                            ) ||
                                                                                "U"}
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <p className="text-sm font-medium">
                                                                                New
                                                                                Chat
                                                                                Request
                                                                            </p>
                                                                            <p className="text-xs text-gray-500 mt-1">
                                                                                From:{" "}
                                                                                {notification
                                                                                    .user
                                                                                    ?.name ||
                                                                                    "User"}
                                                                            </p>
                                                                            <div className="flex items-center mt-1 text-xs text-gray-500">
                                                                                {notification.status ===
                                                                                    "pending" && (
                                                                                    <Clock className="h-3 w-3 mr-1" />
                                                                                )}
                                                                                {notification.status ===
                                                                                    "accepted" && (
                                                                                    <Check className="h-3 w-3 mr-1 text-green-500" />
                                                                                )}
                                                                                {notification.status ===
                                                                                    "declined" && (
                                                                                    <X className="h-3 w-3 mr-1 text-red-500" />
                                                                                )}
                                                                                {
                                                                                    notification.status
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {notification.status ===
                                                                        "pending" && (
                                                                        <div className="mt-2 flex justify-end space-x-2">
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleAcceptChat(
                                                                                        notification
                                                                                            .chat
                                                                                            .id
                                                                                    )
                                                                                }
                                                                                className="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
                                                                            >
                                                                                Accept
                                                                            </button>
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleDeclineChat(
                                                                                        notification
                                                                                            .chat
                                                                                            .id
                                                                                    )
                                                                                }
                                                                                className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
                                                                            >
                                                                                Decline
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <img
                                src="/images/admin-avatar.png"
                                alt="Admin"
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <span className="hidden sm:block text-sm font-medium text-gray-700">
                                {auth.user.name}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 sm:p-6 bg-gray-50 flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
