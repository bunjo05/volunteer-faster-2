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
    Building,
    UserCog,
    MessageCircle,
    DollarSign,
    UserCheck,
    Phone,
    GitMerge,
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
    const [activeGroup, setActiveGroup] = useState(null);
    const sidebarRef = useRef(null);

    // Close sidebar when clicking outside on mobile
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                sidebarOpen &&
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target) &&
                !event.target.closest("[data-menu-button]")
            ) {
                setSidebarOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [sidebarOpen]);

    // ✅ Grouped Navigation - Professional Organization
    const navigationGroups = [
        {
            group: "Overview",
            items: [
                {
                    name: "Dashboard",
                    href: route("admin.dashboard"),
                    icon: Home,
                    badge: null,
                },
            ],
        },
        {
            group: "User Management",
            items: [
                {
                    name: "Manage Users",
                    href: route("admin.users"),
                    icon: UserCog,
                    badge: null,
                },
                {
                    name: "Organizations",
                    href: route("admin.organizations"),
                    icon: Building,
                    badge: null,
                },
                {
                    name: "Volunteers",
                    href: route("admin.volunteers"),
                    icon: UserCheck,
                    badge: null,
                },
                {
                    name: "Sponsorships",
                    href: route("admin.sponsor.index"),
                    icon: Users,
                    badge: null,
                },
            ],
        },
        {
            group: "Project Management",
            items: [
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
                        {
                            name: "Subcategories",
                            href: route("admin.subcategories"),
                        },
                    ],
                },
            ],
        },
        {
            group: "Communication",
            items: [
                {
                    name: "Messages",
                    href: route("admin.messages"),
                    icon: MessageSquare,
                    badge: null,
                },
                {
                    name: "Chat Support",
                    href: route("chat.index"),
                    icon: MessageCircle,
                    badge: unreadCount > 0 ? unreadCount : null,
                },
                {
                    name: "User Contacts",
                    href: route("admin.contacts.index"),
                    icon: Phone,
                    badge: null,
                },
            ],
        },
        {
            group: "Financial",
            items: [
                {
                    name: "Payments",
                    href: route("admin.payments"),
                    icon: DollarSign,
                    badge: null,
                },
            ],
        },
        {
            group: "Analytics & Reports",
            items: [
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
            ],
        },
        {
            group: "Referral System",
            items: [
                {
                    name: "User Referrals",
                    href: route("admin.referrals.index"),
                    icon: GitMerge,
                    badge: null,
                },
            ],
        },
        // {
        //     group: "System",
        //     items: [
        //         {
        //             name: "Settings",
        //             href: "#",
        //             icon: Settings,
        //             badge: null,
        //         },
        //         {
        //             name: "Security",
        //             href: "#",
        //             icon: Shield,
        //             badge: null,
        //         },
        //     ],
        // },
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

    const closeSidebar = () => {
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
    };

    return (
        <div className="flex h-screen bg-base-200 overflow-hidden">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" />
            )}

            {/* Sidebar */}
            <div
                ref={sidebarRef}
                className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-all duration-300 lg:translate-x-0 lg:static lg:inset-0 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <aside className="h-full flex flex-col bg-base-100 shadow-xl border-r border-base-300">
                    {/* Logo/Brand */}
                    <div className="h-16 flex items-center justify-between px-4 border-b border-base-300">
                        <span className="font-extrabold text-xl text-primary whitespace-nowrap">
                            Admin Panel
                        </span>
                        <button
                            className="lg:hidden btn btn-ghost btn-sm btn-square"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* User Info - Mobile */}
                    <div className="lg:hidden p-4 border-b border-base-300">
                        <div className="flex items-center gap-3">
                            <div className="avatar placeholder">
                                <div className="w-10 rounded-full bg-primary text-white flex items-center justify-center">
                                    {auth.user.name.charAt(0)}
                                </div>
                            </div>
                            <div>
                                <p className="font-medium">{auth.user.name}</p>
                                <p className="text-xs text-base-content/70">
                                    Administrator
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 overflow-y-auto py-4 px-2">
                        {navigationGroups.map((group) => (
                            <div key={group.group} className="mb-6 last:mb-0">
                                <h3 className="px-3 mb-2 text-xs font-semibold uppercase text-base-content/50 tracking-wider">
                                    {group.group}
                                </h3>
                                <ul className="space-y-1">
                                    {group.items.map((item) =>
                                        item.subItems ? (
                                            <Disclosure key={item.name}>
                                                {({ open }) => (
                                                    <>
                                                        <Disclosure.Button
                                                            className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-base-200 transition-colors"
                                                            onClick={() =>
                                                                closeSidebar()
                                                            }
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <item.icon
                                                                    size={18}
                                                                />
                                                                <span className="text-sm">
                                                                    {item.name}
                                                                </span>
                                                            </div>
                                                            <ChevronDown
                                                                className={`w-4 h-4 transition-transform ${
                                                                    open
                                                                        ? "rotate-180"
                                                                        : ""
                                                                }`}
                                                            />
                                                        </Disclosure.Button>
                                                        <Disclosure.Panel className="pl-10 space-y-1">
                                                            {item.subItems.map(
                                                                (sub) => (
                                                                    <li
                                                                        key={
                                                                            sub.name
                                                                        }
                                                                    >
                                                                        <Link
                                                                            href={
                                                                                sub.href
                                                                            }
                                                                            className="block px-3 py-2 text-sm rounded-lg hover:bg-base-200 transition-colors"
                                                                            onClick={
                                                                                closeSidebar
                                                                            }
                                                                        >
                                                                            {
                                                                                sub.name
                                                                            }
                                                                        </Link>
                                                                    </li>
                                                                )
                                                            )}
                                                        </Disclosure.Panel>
                                                    </>
                                                )}
                                            </Disclosure>
                                        ) : (
                                            <li key={item.name}>
                                                <Link
                                                    href={item.href}
                                                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-base-200 transition-colors"
                                                    onClick={closeSidebar}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <item.icon size={18} />
                                                        <span className="text-sm">
                                                            {item.name}
                                                        </span>
                                                    </div>
                                                    {item.badge && (
                                                        <span className="badge badge-primary badge-sm">
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </Link>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Logout - Bottom */}
                    <div className="border-t border-base-300 p-4">
                        <Link
                            href={route("logout")}
                            method="post"
                            as="button"
                            className="btn btn-error w-full btn-sm"
                            onClick={closeSidebar}
                        >
                            <LogOut size={18} />
                            Logout
                        </Link>
                    </div>
                </aside>
            </div>

            {/* Main Content */}
            <div className="flex flex-col flex-1 overflow-hidden min-w-0">
                {/* Topbar */}
                <header className="h-16 bg-base-100 shadow px-4 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            data-menu-button
                            className="lg:hidden btn btn-ghost btn-square"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <MenuIcon size={22} />
                        </button>
                        <h1 className="text-lg font-semibold text-base-content truncate">
                            Admin Dashboard
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Notifications Dropdown - Mobile Optimized */}
                        <Menu as="div" className="relative">
                            <Menu.Button
                                onClick={markAsRead}
                                className="btn btn-ghost btn-circle relative btn-sm sm:btn-md"
                            >
                                <Bell className="h-5 w-5" />
                                {unreadCount > 0 && (
                                    <span className="badge badge-error badge-xs absolute top-1 right-1">
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
                                <Menu.Items className="absolute right-0 mt-2 w-[90vw] max-w-sm bg-base-100 rounded-lg shadow-lg border border-base-300 z-50 max-h-[80vh] overflow-hidden">
                                    <div className="p-4 font-medium border-b border-base-300">
                                        Notifications
                                    </div>
                                    <div className="overflow-y-auto max-h-96">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center text-base-content/70">
                                                <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                                <p>No notifications</p>
                                            </div>
                                        ) : (
                                            notifications.map((n) => (
                                                <div
                                                    key={n.id}
                                                    className={`p-4 border-b border-base-200 last:border-b-0 ${
                                                        !n.read
                                                            ? "bg-base-200/50"
                                                            : ""
                                                    }`}
                                                >
                                                    {n.type ===
                                                        "chat_request" && (
                                                        <div>
                                                            <p className="font-medium mb-2">
                                                                Chat Request
                                                                from{" "}
                                                                <span className="text-primary">
                                                                    {n.user
                                                                        ?.name ||
                                                                        "User"}
                                                                </span>
                                                            </p>
                                                            <div className="flex items-center gap-2 text-sm mb-3">
                                                                {n.status ===
                                                                    "pending" && (
                                                                    <span className="badge badge-warning">
                                                                        <Clock className="w-3 h-3 mr-1" />
                                                                        Pending
                                                                    </span>
                                                                )}
                                                                {n.status ===
                                                                    "accepted" && (
                                                                    <span className="badge badge-success">
                                                                        <Check className="w-3 h-3 mr-1" />
                                                                        Accepted
                                                                    </span>
                                                                )}
                                                                {n.status ===
                                                                    "declined" && (
                                                                    <span className="badge badge-error">
                                                                        <X className="w-3 h-3 mr-1" />
                                                                        Declined
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {n.status ===
                                                                "pending" && (
                                                                <div className="flex flex-col sm:flex-row gap-2">
                                                                    <button
                                                                        onClick={() =>
                                                                            handleDeclineChat(
                                                                                n
                                                                                    .chat
                                                                                    .id
                                                                            )
                                                                        }
                                                                        className="btn btn-outline btn-sm flex-1"
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
                                                                        className="btn btn-primary btn-sm flex-1"
                                                                    >
                                                                        Accept
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>

                        {/* User Dropdown - Mobile Optimized */}
                        <Menu as="div" className="relative">
                            <Menu.Button className="flex items-center gap-2 btn btn-ghost btn-sm sm:btn-md px-2 sm:px-4">
                                <div className="avatar placeholder">
                                    <div className="w-8 sm:w-9 rounded-full bg-primary text-white flex items-center justify-center">
                                        {auth.user.name.charAt(0)}
                                    </div>
                                </div>
                                <span className="hidden sm:block truncate max-w-[120px]">
                                    {auth.user.name}
                                </span>
                                <ChevronDown className="w-4 h-4 hidden sm:block" />
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
                                    <div className="p-4 border-b border-base-300 sm:hidden">
                                        <p className="font-medium">
                                            {auth.user.name}
                                        </p>
                                        <p className="text-xs text-base-content/70">
                                            Administrator
                                        </p>
                                    </div>
                                    <div className="py-2">
                                        {/* <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href="#"
                                                    className={`flex items-center gap-2 px-4 py-2 text-sm ${
                                                        active
                                                            ? "bg-base-200"
                                                            : ""
                                                    }`}
                                                >
                                                    <Settings size={16} />
                                                    Profile Settings
                                                </Link>
                                            )}
                                        </Menu.Item> */}
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href={route("logout")}
                                                    method="post"
                                                    as="button"
                                                    className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm ${
                                                        active
                                                            ? "bg-base-200"
                                                            : ""
                                                    }`}
                                                >
                                                    <LogOut size={16} />
                                                    Logout
                                                </Link>
                                            )}
                                        </Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-base-200">
                    <div className="max-w-7xl mx-auto w-full">{children}</div>
                </main>
            </div>
        </div>
    );
}
