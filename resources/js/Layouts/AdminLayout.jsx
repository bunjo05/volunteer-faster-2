import {
    LogOut,
    Users,
    Folder,
    MessageSquare,
    Home,
    Bell,
    Menu as MenuIcon,
    ChevronDown,
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
import { Fragment, useState, useEffect, useRef } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import axios from "axios";

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // ✅ Nav config
    const navItems = [
        { name: "Dashboard", href: route("admin.dashboard"), icon: Home },
        {
            name: "Organizations",
            href: route("admin.organizations"),
            icon: Users,
        },
        { name: "Volunteers", href: route("admin.volunteers"), icon: Users },
        {
            name: "Projects",
            icon: Folder,
            subItems: [
                { name: "All Projects", href: route("admin.projects") },
                {
                    name: "Featured Projects",
                    href: route("admin.featured.projects"),
                },
                { name: "Categories", href: route("admin.categories") },
                { name: "Subcategories", href: route("admin.subcategories") },
            ],
        },
        {
            name: "Messages",
            href: route("admin.messages"),
            icon: MessageSquare,
        },
        { name: "Payments", href: route("admin.payments"), icon: CreditCard },
        { name: "Chat Support", href: route("chat.index"), icon: HelpCircle },
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
        { name: "Manage Users", href: route("admin.users"), icon: Shield },
        {
            name: "User Contacts",
            href: route("admin.contacts.index"),
            icon: Users,
        },
        {
            name: "User Referrals",
            href: route("admin.referrals.index"),
            icon: Users,
        },
        { name: "Settings", href: "#", icon: Settings },
    ];

    // ✅ Listen to notifications
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
            { id: Date.now(), ...notification, read: false },
            ...prev,
        ]);
        setUnreadCount((prev) => prev + 1);
        new Audio("/sounds/notification.mp3").play();
    };

    const updateNotifications = (chatId, status) => {
        setNotifications((prev) =>
            prev.map((n) => (n.chat?.id === chatId ? { ...n, status } : n))
        );
    };

    const markAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    const handleAcceptChat = async (chatId) => {
        await axios.post(`/admin/chat/${chatId}/accept`);
        updateNotifications(chatId, "accepted");
        router.visit(route("admin.chat.show", chatId));
    };

    const handleDeclineChat = async (chatId) => {
        await axios.post(`/admin/chat/${chatId}/decline`);
        updateNotifications(chatId, "declined");
    };

    return (
        <div className="flex h-screen bg-base-200 overflow-hidden">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <aside className="h-full flex flex-col bg-base-100 shadow-xl">
                    <div className="h-16 flex items-center justify-center border-b border-base-300">
                        <span className="font-extrabold text-xl text-primary">
                            Admin Panel
                        </span>
                    </div>
                    <ul className="menu p-2 flex-1">
                        {navItems.map((item) =>
                            item.subItems ? (
                                <Disclosure key={item.name}>
                                    {({ open }) => (
                                        <>
                                            <Disclosure.Button className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-base-200">
                                                <div className="flex items-center gap-3">
                                                    <item.icon size={18} />
                                                    {item.name}
                                                </div>
                                                <ChevronDown
                                                    className={`w-4 h-4 transition-transform ${
                                                        open ? "rotate-180" : ""
                                                    }`}
                                                />
                                            </Disclosure.Button>
                                            <Disclosure.Panel className="pl-8">
                                                {item.subItems.map((sub) => (
                                                    <li key={sub.name}>
                                                        <Link
                                                            href={sub.href}
                                                            className="hover:bg-base-200 rounded-lg"
                                                        >
                                                            {sub.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </Disclosure.Panel>
                                        </>
                                    )}
                                </Disclosure>
                            ) : (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="flex items-center gap-3"
                                    >
                                        <item.icon size={18} />
                                        {item.name}
                                    </Link>
                                </li>
                            )
                        )}
                    </ul>
                    <div className="border-t border-base-300 p-4">
                        <Link
                            href={route("logout")}
                            method="post"
                            as="button"
                            className="btn btn-error w-full"
                        >
                            <LogOut size={18} />
                            Logout
                        </Link>
                    </div>
                </aside>
            </div>

            {/* Main */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-base-100 shadow px-4 flex items-center justify-between">
                    <button
                        className="lg:hidden btn btn-ghost btn-square"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <MenuIcon size={22} />
                    </button>
                    <h1 className="text-lg font-semibold text-base-content">
                        Admin Dashboard
                    </h1>

                    <div className="flex items-center gap-4">
                        {/* Notifications Dropdown */}
                        <Menu as="div" className="relative">
                            <Menu.Button
                                onClick={markAsRead}
                                className="btn btn-ghost btn-circle relative"
                            >
                                <Bell className="h-5 w-5" />
                                {unreadCount > 0 && (
                                    <span className="badge badge-error badge-xs absolute top-0 right-0">
                                        {unreadCount}
                                    </span>
                                )}
                            </Menu.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 mt-2 w-80 bg-base-100 rounded-lg shadow-lg border border-base-300 z-50">
                                    <div className="p-3 font-medium">
                                        Notifications
                                    </div>
                                    <div className="max-h-80 overflow-y-auto divide-y divide-base-200">
                                        {notifications.length === 0 && (
                                            <div className="p-4 text-center text-sm text-base-content/70">
                                                No notifications
                                            </div>
                                        )}
                                        {notifications.map((n) => (
                                            <div
                                                key={n.id}
                                                className={`p-3 text-sm ${
                                                    !n.read ? "bg-base-200" : ""
                                                }`}
                                            >
                                                {n.type === "chat_request" && (
                                                    <div>
                                                        <p className="font-medium">
                                                            Chat Request from{" "}
                                                            {n.user?.name ||
                                                                "User"}
                                                        </p>
                                                        <div className="flex items-center gap-2 text-xs mt-1">
                                                            {n.status ===
                                                                "pending" && (
                                                                <>
                                                                    <Clock className="w-3 h-3 text-warning" />
                                                                    <span className="text-warning">
                                                                        Pending
                                                                    </span>
                                                                </>
                                                            )}
                                                            {n.status ===
                                                                "accepted" && (
                                                                <>
                                                                    <Check className="w-3 h-3 text-success" />
                                                                    <span className="text-success">
                                                                        Accepted
                                                                    </span>
                                                                </>
                                                            )}
                                                            {n.status ===
                                                                "declined" && (
                                                                <>
                                                                    <X className="w-3 h-3 text-error" />
                                                                    <span className="text-error">
                                                                        Declined
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>

                                                        {n.status ===
                                                            "pending" && (
                                                            <div className="flex justify-end gap-2 mt-2">
                                                                <button
                                                                    onClick={() =>
                                                                        handleDeclineChat(
                                                                            n
                                                                                .chat
                                                                                .id
                                                                        )
                                                                    }
                                                                    className="btn btn-xs"
                                                                >
                                                                    Decline
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleAcceptChat(
                                                                            n
                                                                                .chat
                                                                                .id
                                                                        )
                                                                    }
                                                                    className="btn btn-xs btn-primary"
                                                                >
                                                                    Accept
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>

                        {/* User Dropdown */}
                        <Menu as="div" className="relative">
                            <Menu.Button className="flex items-center gap-2 btn btn-ghost">
                                <div className="avatar placeholder">
                                    <div className="w-8 rounded-full bg-primary text-white flex items-center justify-center">
                                        {auth.user.name.charAt(0)}
                                    </div>
                                </div>
                                <span className="hidden sm:block">
                                    {auth.user.name}
                                </span>
                                <ChevronDown className="w-4 h-4" />
                            </Menu.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 mt-2 w-48 bg-base-100 shadow-lg rounded-lg border border-base-300 z-50">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                href="#"
                                                className={`block px-4 py-2 text-sm ${
                                                    active ? "bg-base-200" : ""
                                                }`}
                                            >
                                                Profile
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                                className={`w-full text-left block px-4 py-2 text-sm ${
                                                    active ? "bg-base-200" : ""
                                                }`}
                                            >
                                                Logout
                                            </Link>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6 bg-base-200">
                    <div className="max-w-7xl mx-auto">{children}</div>
                </main>
            </div>
        </div>
    );
}
