import { useState, useEffect, useRef } from "react";
import { Link } from "@inertiajs/react";
import SidebarLink from "@/Components/SidebarLink";
import FloatingChat from "@/Components/FloatingChat";
import PlatformReview from "@/Components/PlatformReview";

import {
    Home,
    FolderKanban,
    MessageSquare,
    LogOut,
    Menu,
    X,
    Star,
    Bell,
    CircleUserIcon,
} from "lucide-react";

export default function VolunteerLayout({ children, auth, points }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [hasVolunteerProfile, setHasVolunteerProfile] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [messagesOpen, setMessagesOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [messages, setMessages] = useState([]);

    const notificationsRef = useRef();
    const messagesRef = useRef();

    const totalPoints = auth?.user?.points || points || 0;

    // Check if user has volunteer_profile field
    useEffect(() => {
        if (auth?.user?.volunteer_profile) {
            setHasVolunteerProfile(true);
        } else {
            axios
                .get("/api/check-volunteer-profile")
                .then((response) => {
                    setHasVolunteerProfile(response.data.hasProfile);
                })
                .catch(console.error);
        }

        // Fetch notifications (mock data)
        const mockNotifications = [
            {
                id: 1,
                text: "Your project 'Clean the Beach' was approved",
                time: "2 hours ago",
                read: false,
            },
            {
                id: 2,
                text: "You earned 50 points for completing a task",
                time: "1 day ago",
                read: true,
            },
            {
                id: 3,
                text: "New volunteer opportunity available in your area",
                time: "3 days ago",
                read: false,
            },
        ];
        setNotifications(mockNotifications);

        // Fetch messages (mock data)
        const mockMessages = [
            {
                id: 1,
                sender: "Project Coordinator",
                text: "Hi there! We'd like to schedule a meeting about your volunteer application",
                time: "10:30 AM",
                read: false,
                avatar: "PC",
            },
            {
                id: 2,
                sender: "Community Manager",
                text: "Thanks for your help at the event last weekend!",
                time: "Yesterday",
                read: true,
                avatar: "CM",
            },
        ];
        setMessages(mockMessages);
    }, [auth]);

    const toggleNotifications = () => {
        setNotificationsOpen(!notificationsOpen);
        setMessagesOpen(false);
    };

    const toggleMessages = () => {
        setMessagesOpen(!messagesOpen);
        setNotificationsOpen(false);
    };

    const markNotificationAsRead = (id) => {
        setNotifications(
            notifications.map((notification) =>
                notification.id === id
                    ? { ...notification, read: true }
                    : notification
            )
        );
    };

    const markAllNotificationsAsRead = () => {
        setNotifications(
            notifications.map((notification) => ({
                ...notification,
                read: true,
            }))
        );
    };

    const markMessageAsRead = (id) => {
        setMessages(
            messages.map((message) =>
                message.id === id ? { ...message, read: true } : message
            )
        );
    };

    const markAllMessagesAsRead = () => {
        setMessages(
            messages.map((message) => ({
                ...message,
                read: true,
            }))
        );
    };

    // Close modals when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                notificationsRef.current &&
                !notificationsRef.current.contains(event.target)
            ) {
                setNotificationsOpen(false);
            }
            if (
                messagesRef.current &&
                !messagesRef.current.contains(event.target)
            ) {
                setMessagesOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-30 w-64 bg-base-100 shadow-xl border-r border-base-300
                    transition-transform duration-300 ease-in-out
                    lg:translate-x-0 lg:static lg:inset-0
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                {/* Brand */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-base-300">
                    <span className="font-extrabold text-xl text-primary">
                        Volunteer Faster
                    </span>
                    <button
                        className="lg:hidden btn btn-ghost btn-square"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1">
                    <SidebarLink
                        href={route("volunteer.dashboard")}
                        icon={Home}
                        className="btn btn-ghost w-full justify-start"
                    >
                        Dashboard
                    </SidebarLink>
                    <SidebarLink
                        href={route("volunteer.projects")}
                        icon={FolderKanban}
                        className="btn btn-ghost w-full justify-start"
                    >
                        My Projects
                    </SidebarLink>
                    <SidebarLink
                        href={route("volunteer.points")}
                        icon={Star}
                        className="btn btn-ghost w-full justify-start"
                    >
                        My Points
                    </SidebarLink>
                </nav>

                {/* Points & Logout */}
                <div className="border-t border-base-300 p-4 space-y-3">
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="btn btn-error w-full flex items-center gap-2"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </Link>
                </div>
            </aside>

            {/* Overlay for small screens */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header Section */}
                <header className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between px-4 py-3">
                        {/* Mobile menu button and title */}
                        <div className="flex items-center lg:hidden">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 mr-2"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <span className="font-semibold text-lg text-gray-900">
                                Volunteer Panel
                            </span>
                        </div>

                        {/* Desktop spacer - keeps icons aligned to right */}
                        <div className="hidden lg:block flex-1"></div>

                        {/* Right-aligned icons container */}
                        <div className="flex items-center justify-end gap-4">
                            {/* Messages Icon and Modal */}
                            <div className="relative" ref={messagesRef}>
                                <button
                                    onClick={toggleMessages}
                                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
                                    aria-label="Messages"
                                >
                                    <MessageSquare className="w-5 h-5 text-gray-600" />
                                    {messages.filter((m) => !m.read).length >
                                        0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                                            {
                                                messages.filter((m) => !m.read)
                                                    .length
                                            }
                                        </span>
                                    )}
                                </button>

                                {/* Messages Modal */}
                                {messagesOpen && (
                                    <div className="absolute right-0 top-12 z-50 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                                        <div className="p-3 bg-blue-600 text-white font-semibold flex justify-between items-center">
                                            <span>Messages</span>
                                            <button
                                                onClick={markAllMessagesAsRead}
                                                className="text-sm font-medium hover:underline"
                                            >
                                                Mark all as read
                                            </button>
                                        </div>

                                        <div className="max-h-96 overflow-y-auto">
                                            {messages.length > 0 ? (
                                                messages.map((message) => (
                                                    <div
                                                        key={message.id}
                                                        className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                                                            !message.read
                                                                ? "bg-blue-50"
                                                                : ""
                                                        }`}
                                                        onClick={() =>
                                                            markMessageAsRead(
                                                                message.id
                                                            )
                                                        }
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                                {message.avatar}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex justify-between items-start">
                                                                    <p className="text-sm font-medium truncate">
                                                                        {
                                                                            message.sender
                                                                        }
                                                                    </p>
                                                                    <span className="text-xs text-gray-500 whitespace-nowrap">
                                                                        {
                                                                            message.time
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-gray-600 truncate">
                                                                    {
                                                                        message.text
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {!message.read && (
                                                            <div className="text-xs text-blue-500 mt-1">
                                                                Click to mark as
                                                                read
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-4 text-center text-gray-500">
                                                    No messages
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-2 border-t border-gray-200 text-center">
                                            <Link
                                                href={route(
                                                    "volunteer.messages"
                                                )}
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                View all messages
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Notifications Icon and Modal */}
                            <div className="relative" ref={notificationsRef}>
                                <button
                                    onClick={toggleNotifications}
                                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
                                    aria-label="Notifications"
                                >
                                    <Bell className="w-5 h-5 text-gray-600" />
                                    {notifications.filter((n) => !n.read)
                                        .length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                                            {
                                                notifications.filter(
                                                    (n) => !n.read
                                                ).length
                                            }
                                        </span>
                                    )}
                                </button>

                                {/* Notification Modal */}
                                {notificationsOpen && (
                                    <div className="absolute right-0 top-12 z-50 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                                        <div className="p-3 bg-blue-600 text-white font-semibold flex justify-between items-center">
                                            <span>Notifications</span>
                                            <button
                                                onClick={
                                                    markAllNotificationsAsRead
                                                }
                                                className="text-sm font-medium hover:underline"
                                            >
                                                Mark all as read
                                            </button>
                                        </div>

                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                notifications.map(
                                                    (notification) => (
                                                        <div
                                                            key={
                                                                notification.id
                                                            }
                                                            className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                                                                !notification.read
                                                                    ? "bg-blue-50"
                                                                    : ""
                                                            }`}
                                                            onClick={() =>
                                                                markNotificationAsRead(
                                                                    notification.id
                                                                )
                                                            }
                                                        >
                                                            <p className="text-sm">
                                                                {
                                                                    notification.text
                                                                }
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {
                                                                    notification.time
                                                                }
                                                            </p>
                                                            {!notification.read && (
                                                                <div className="text-xs text-blue-500 mt-1">
                                                                    Click to
                                                                    mark as read
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                )
                                            ) : (
                                                <div className="p-4 text-center text-gray-500">
                                                    No notifications
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-2 border-t border-gray-200 text-center">
                                            <Link
                                                href="#"
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                View all notifications
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* User Profile Icon */}
                            <Link
                                href={route("volunteer.profile")}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                aria-label="Profile"
                            >
                                <CircleUserIcon className="w-5 h-5 text-gray-600" />
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-2">
                    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                        {children}
                    </div>
                </main>

                {/* Floating Chat */}
                <FloatingChat auth={auth} />

                {/* Conditionally render PlatformReview component */}
                {hasVolunteerProfile && <PlatformReview />}
            </div>
        </div>
    );
}
