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
    Settings,
    CreditCard,
    HelpCircle,
    BarChart2,
    Shield,
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

    // Navigation items
    const navItems = [
        {
            name: "Dashboard",
            href: route("admin.dashboard"),
            icon: Home,
        },
        {
            name: "Organizations",
            href: route("admin.organizations"),
            icon: Users,
        },
        {
            name: "Volunteers",
            href: route("admin.volunteers"),
            icon: Users,
        },
        {
            name: "Projects",
            icon: Folder,
            subItems: [
                {
                    name: "All Projects",
                    href: route("admin.projects"),
                },
                {
                    name: "Featured Projects",
                    href: route("admin.featured.projects"),
                },
                {
                    name: "Categories",
                    href: route("admin.categories"),
                },
                {
                    name: "Subcategories",
                    href: route("admin.subcategories"),
                },
            ],
        },
        {
            name: "Messages",
            href: route("admin.messages"),
            icon: MessageSquare,
        },
        {
            name: "Payments",
            href: route("admin.payments"),
            icon: CreditCard,
        },
        {
            name: "Chat Support",
            href: route("chat.index"),
            icon: HelpCircle,
        },
        {
            name: "Reports",
            icon: BarChart2,
            subItems: [
                {
                    name: "Project Reports",
                    href: route("admin.project.reports"),
                },
                {
                    name: "Report Categories",
                    href: route("admin.report-categories"),
                },
                {
                    name: "Report Subcategories",
                    href: route("admin.report-subcategories.index"),
                },
            ],
        },
        {
            name: "Manage Users",
            href: route("admin.users"),
            icon: Shield,
        },
        {
            name: "User Contacts",
            href: route("admin.contacts.index"),
            icon: Users,
        },
        {
            name: "Settings",
            // href: route("admin.settings"),
            icon: Settings,
        },
    ];

    useEffect(() => {
        if (window.Echo) {
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
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar Overlay for Mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`fixed z-30 inset-y-0 left-0 w-64 bg-indigo-700 text-white shadow-lg transform transition-transform duration-300 ease-in-out
                ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0 lg:static lg:inset-0`}
            >
                <div className="h-16 flex items-center justify-center border-b border-indigo-600">
                    <span className="font-bold text-xl">Admin Panel</span>
                </div>
                <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <div key={item.name}>
                            {item.href ? (
                                <Link
                                    href={item.href}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
                                    activeClassName="bg-indigo-800"
                                >
                                    <item.icon size={18} />
                                    {item.name}
                                </Link>
                            ) : (
                                <>
                                    <button
                                        onClick={() => {
                                            if (item.name === "Projects") {
                                                setProjectsOpen(!projectsOpen);
                                            } else if (
                                                item.name === "Reports"
                                            ) {
                                                setReportsOpen(!reportsOpen);
                                            }
                                        }}
                                        className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon size={18} />
                                            <span>{item.name}</span>
                                        </div>
                                        {item.name === "Projects" ? (
                                            projectsOpen ? (
                                                <ChevronDown size={16} />
                                            ) : (
                                                <ChevronRight size={16} />
                                            )
                                        ) : item.name === "Reports" ? (
                                            reportsOpen ? (
                                                <ChevronDown size={16} />
                                            ) : (
                                                <ChevronRight size={16} />
                                            )
                                        ) : null}
                                    </button>
                                    {(item.name === "Projects" &&
                                        projectsOpen) ||
                                    (item.name === "Reports" && reportsOpen) ? (
                                        <div className="pl-8 space-y-1 mt-1">
                                            {item.subItems.map((subItem) => (
                                                <Link
                                                    key={subItem.name}
                                                    href={subItem.href}
                                                    className="block px-3 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
                                                    activeClassName="bg-indigo-800"
                                                >
                                                    {subItem.name}
                                                </Link>
                                            ))}
                                        </div>
                                    ) : null}
                                </>
                            )}
                        </div>
                    ))}

                    <div className="mt-4 pt-4 border-t border-indigo-600">
                        <Link
                            href={route("logout")}
                            method="post"
                            as="button"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
                        >
                            <LogOut size={18} />
                            Logout
                        </Link>
                    </div>
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Top Bar */}
                <header className="h-16 bg-white shadow-sm px-4 sm:px-6 flex items-center justify-between">
                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden text-gray-600 hover:text-gray-900"
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
                                className="p-1 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none relative"
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
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-50 border border-gray-200">
                                    <div className="py-1">
                                        <div className="px-4 py-3 border-b flex justify-between items-center bg-gray-50">
                                            <h3 className="font-medium text-gray-900">
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
                                                                    : "bg-white"
                                                            } hover:bg-gray-50 transition-colors`}
                                                        >
                                                            {notification.type ===
                                                                "chat_request" && (
                                                                <div>
                                                                    <div className="flex items-start">
                                                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium mr-3">
                                                                            {notification.user?.name?.charAt(
                                                                                0
                                                                            ) ||
                                                                                "U"}
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <p className="text-sm font-medium text-gray-900">
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
                                                                            <div className="flex items-center mt-1 text-xs">
                                                                                {notification.status ===
                                                                                    "pending" && (
                                                                                    <>
                                                                                        <Clock className="h-3 w-3 mr-1 text-yellow-500" />
                                                                                        <span className="text-yellow-600">
                                                                                            Pending
                                                                                        </span>
                                                                                    </>
                                                                                )}
                                                                                {notification.status ===
                                                                                    "accepted" && (
                                                                                    <>
                                                                                        <Check className="h-3 w-3 mr-1 text-green-500" />
                                                                                        <span className="text-green-600">
                                                                                            Accepted
                                                                                        </span>
                                                                                    </>
                                                                                )}
                                                                                {notification.status ===
                                                                                    "declined" && (
                                                                                    <>
                                                                                        <X className="h-3 w-3 mr-1 text-red-500" />
                                                                                        <span className="text-red-600">
                                                                                            Declined
                                                                                        </span>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {notification.status ===
                                                                        "pending" && (
                                                                        <div className="mt-3 flex justify-end space-x-2">
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleDeclineChat(
                                                                                        notification
                                                                                            .chat
                                                                                            .id
                                                                                    )
                                                                                }
                                                                                className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-md hover:bg-gray-300 transition-colors"
                                                                            >
                                                                                Decline
                                                                            </button>
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleAcceptChat(
                                                                                        notification
                                                                                            .chat
                                                                                            .id
                                                                                    )
                                                                                }
                                                                                className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-md hover:bg-indigo-700 transition-colors"
                                                                            >
                                                                                Accept
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
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                                {auth.user.name.charAt(0)}
                            </div>
                            <span className="hidden sm:block text-sm font-medium text-gray-700">
                                {auth.user.name}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
                    <div className="max-w-7xl mx-auto">{children}</div>
                </main>
            </div>
        </div>
    );
}
