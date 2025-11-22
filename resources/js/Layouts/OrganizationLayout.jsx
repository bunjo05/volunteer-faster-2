import { useState, Fragment } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    ClipboardList,
    MessageSquare,
    User,
    LogOut,
    Menu,
    Home,
    FolderKanban,
    Star,
    ChevronRight,
    X,
    Building2,
    TrendingUp,
    Bell,
    Settings,
    HelpCircle,
} from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import SidebarLink from "@/Components/SidebarLink";
import FloatingConversation from "@/Components/FloatingConversation";
import FloatingChat from "@/Components/FloatingChat";

export default function OrganizationLayout({ children, auth }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { url, component } = usePage();

    // Get current page title based on route name
    const getPageTitle = () => {
        const routeName = component;
        const titleMap = {
            "Organization/Dashboard": "Dashboard",
            "Organization/Projects": "My Projects",
            "Organization/Projects/Index": "My Projects",
            "Organization/Projects/Create": "Create Project",
            "Organization/Projects/Edit": "Edit Project",
            "Organization/Messages": "Messages",
            "Organization/Bookings": "Volunteer Bookings",
            "Organization/Points": "Rewards & Points",
            "Organization/Profile": "Organization Profile",
            "Organization/Profile/Edit": "Edit Profile",
        };

        return titleMap[routeName] || "Organization Panel";
    };

    // Get breadcrumb items based on current route
    const getBreadcrumbs = () => {
        const routeName = component;
        const baseItems = [
            {
                label: "Organization",
                href: route("organization.dashboard"),
                current: false,
            },
        ];

        const routeMap = {
            "Organization/Dashboard": [
                {
                    label: "Dashboard",
                    href: route("organization.dashboard"),
                    current: true,
                },
            ],
            "Organization/Projects": [
                {
                    label: "My Projects",
                    href: route("organization.projects"),
                    current: true,
                },
            ],
            "Organization/Projects/Create": [
                {
                    label: "My Projects",
                    href: route("organization.projects"),
                    current: false,
                },
                {
                    label: "Create Project",
                    href: route("organization.projects.create"),
                    current: true,
                },
            ],
            "Organization/Projects/Edit": [
                {
                    label: "My Projects",
                    href: route("organization.projects"),
                    current: false,
                },
                { label: "Edit Project", href: url, current: true },
            ],
            "Organization/Messages": [
                {
                    label: "Messages",
                    href: route("organization.messages"),
                    current: true,
                },
            ],
            "Organization/Bookings": [
                {
                    label: "Bookings",
                    href: route("organization.bookings"),
                    current: true,
                },
            ],
            "Organization/Points": [
                {
                    label: "Points",
                    href: route("organization.points"),
                    current: true,
                },
            ],
            "Organization/Profile": [
                {
                    label: "Profile",
                    href: route("organization.profile"),
                    current: true,
                },
            ],
            "Organization/Profile/Edit": [
                {
                    label: "Profile",
                    href: route("organization.profile"),
                    current: false,
                },
                { label: "Edit Profile", href: url, current: true },
            ],
        };

        return [
            ...baseItems,
            ...(routeMap[routeName] || [
                { label: getPageTitle(), href: url, current: true },
            ]),
        ];
    };

    const breadcrumbs = getBreadcrumbs();
    const currentPageTitle = getPageTitle();

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
            {/* Mobile Sidebar with HeadlessUI */}
            <Transition.Root show={sidebarOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50 lg:hidden"
                    onClose={setSidebarOpen}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-in-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transform transition ease-in-out duration-300"
                                    enterFrom="-translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transform transition ease-in-out duration-300"
                                    leaveFrom="translate-x-0"
                                    leaveTo="-translate-x-full"
                                >
                                    <Dialog.Panel className="pointer-events-auto relative w-80">
                                        <div className="flex h-full flex-col bg-white shadow-xl border-r border-slate-200">
                                            {/* Brand Header */}
                                            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-blue-700">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                                        <Building2 className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-white text-lg block">
                                                            VolunteerFaster
                                                        </span>
                                                        <span className="text-white/80 text-sm">
                                                            Organization
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        setSidebarOpen(false)
                                                    }
                                                    className="btn btn-ghost btn-circle btn-sm text-white hover:bg-white/20"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>

                                            {/* User Profile */}
                                            <div className="p-6 border-b border-slate-100 bg-gradient-to-b from-white to-slate-50">
                                                <div className="flex items-center space-x-4">
                                                    <div className="avatar">
                                                        <div className="w-14 rounded-full ring-2 ring-white ring-offset-2 ring-offset-slate-50 shadow-sm">
                                                            <img
                                                                src={
                                                                    auth?.user
                                                                        ?.avatar_url ??
                                                                    "/default-avatar.png"
                                                                }
                                                                alt={
                                                                    auth?.user
                                                                        ?.name
                                                                }
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-slate-900 text-lg">
                                                            {auth?.user?.name}
                                                        </p>
                                                        <p className="text-sm text-slate-600">
                                                            Organization Manager
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Navigation */}
                                            <nav className="flex-1 px-4 py-6 space-y-2">
                                                <SidebarLink
                                                    href={route(
                                                        "organization.dashboard"
                                                    )}
                                                    icon={Home}
                                                    className="group flex items-center w-full px-4 py-3 text-left rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 border border-transparent hover:border-blue-100"
                                                    activeClassName="bg-blue-50 text-blue-700 border-blue-200 shadow-sm"
                                                >
                                                    <Home className="w-5 h-5 mr-3" />
                                                    Dashboard
                                                </SidebarLink>
                                                <SidebarLink
                                                    href={route(
                                                        "organization.projects"
                                                    )}
                                                    icon={FolderKanban}
                                                    className="group flex items-center w-full px-4 py-3 text-left rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 border border-transparent hover:border-blue-100"
                                                    activeClassName="bg-blue-50 text-blue-700 border-blue-200 shadow-sm"
                                                >
                                                    <FolderKanban className="w-5 h-5 mr-3" />
                                                    My Projects
                                                </SidebarLink>
                                                <SidebarLink
                                                    href={route(
                                                        "organization.messages"
                                                    )}
                                                    icon={MessageSquare}
                                                    className="group flex items-center w-full px-4 py-3 text-left rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 border border-transparent hover:border-blue-100"
                                                    activeClassName="bg-blue-50 text-blue-700 border-blue-200 shadow-sm"
                                                >
                                                    <MessageSquare className="w-5 h-5 mr-3" />
                                                    Messages
                                                    <span className="ml-auto bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                                                        3
                                                    </span>
                                                </SidebarLink>
                                                <SidebarLink
                                                    href={route(
                                                        "organization.bookings"
                                                    )}
                                                    icon={ClipboardList}
                                                    className="group flex items-center w-full px-4 py-3 text-left rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 border border-transparent hover:border-blue-100"
                                                    activeClassName="bg-blue-50 text-blue-700 border-blue-200 shadow-sm"
                                                >
                                                    <ClipboardList className="w-5 h-5 mr-3" />
                                                    Bookings
                                                </SidebarLink>
                                                <SidebarLink
                                                    href={route(
                                                        "organization.points"
                                                    )}
                                                    icon={Star}
                                                    className="group flex items-center w-full px-4 py-3 text-left rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 border border-transparent hover:border-blue-100"
                                                    activeClassName="bg-blue-50 text-blue-700 border-blue-200 shadow-sm"
                                                >
                                                    <Star className="w-5 h-5 mr-3" />
                                                    Rewards
                                                    <span className="ml-auto bg-amber-500 text-white text-xs rounded-full px-2 py-1">
                                                        1.2k
                                                    </span>
                                                </SidebarLink>
                                            </nav>

                                            {/* Bottom Section */}
                                            <div className="p-4 border-t border-slate-200 space-y-2">
                                                <SidebarLink
                                                    href={route(
                                                        "organization.profile"
                                                    )}
                                                    icon={User}
                                                    className="group flex items-center w-full px-4 py-3 text-left rounded-xl hover:bg-slate-50 hover:text-slate-700 transition-all duration-200"
                                                >
                                                    <User className="w-5 h-5 mr-3" />
                                                    Profile
                                                </SidebarLink>
                                                <Link
                                                    href={route("logout")}
                                                    method="post"
                                                    as="button"
                                                    className="group flex items-center w-full px-4 py-3 text-left rounded-xl hover:bg-red-50 hover:text-red-700 transition-all duration-200 text-slate-600"
                                                >
                                                    <LogOut className="w-5 h-5 mr-3" />
                                                    Sign Out
                                                </Link>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:flex-col w-80 bg-white border-r border-slate-200 shadow-sm">
                {/* Brand Header */}
                <div className="p-8 bg-gradient-to-r from-blue-600 to-blue-700">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                            <Building2 className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-white text-2xl block leading-tight">
                                VolunteerFaster
                            </span>
                            <span className="text-white/80 text-sm font-medium">
                                Organization Portal
                            </span>
                        </div>
                    </div>
                </div>

                {/* User Profile */}
                {/* <div className="p-6 border-b border-slate-100 bg-gradient-to-b from-white to-slate-50/50">
                    <div className="flex items-center space-x-4">
                        <div className="avatar">
                            <div className="w-16 rounded-2xl ring-4 ring-white ring-offset-2 ring-offset-slate-50 shadow-lg">
                                <img
                                    src={
                                        auth?.user?.avatar_url ??
                                        "/default-avatar.png"
                                    }
                                    alt={auth?.user?.name}
                                    className="object-cover"
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-slate-900 text-lg">
                                {auth?.user?.name}
                            </p>
                            <p className="text-sm text-slate-600">
                                Organization Manager
                            </p>
                            <div className="flex items-center mt-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                <span className="text-xs text-slate-500">
                                    Online
                                </span>
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <SidebarLink
                        href={route("organization.dashboard")}
                        icon={Home}
                        className="group flex items-center w-full px-4 py-4 text-left rounded-2xl hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 border border-transparent hover:border-blue-200 hover:shadow-sm"
                        activeClassName="bg-blue-50 text-blue-700 border-blue-200 shadow-sm"
                    >
                        <Home className="w-5 h-5 mr-3" />
                        Dashboard
                    </SidebarLink>
                    <SidebarLink
                        href={route("organization.projects")}
                        icon={FolderKanban}
                        className="group flex items-center w-full px-4 py-4 text-left rounded-2xl hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 border border-transparent hover:border-blue-200 hover:shadow-sm"
                        activeClassName="bg-blue-50 text-blue-700 border-blue-200 shadow-sm"
                    >
                        <FolderKanban className="w-5 h-5 mr-3" />
                        My Projects
                    </SidebarLink>
                    {/* <SidebarLink
                        href={route("organization.messages")}
                        icon={MessageSquare}
                        className="group flex items-center w-full px-4 py-4 text-left rounded-2xl hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 border border-transparent hover:border-blue-200 hover:shadow-sm"
                        activeClassName="bg-blue-50 text-blue-700 border-blue-200 shadow-sm"
                    >
                        <MessageSquare className="w-5 h-5 mr-3" />
                        Messages
                        <span className="ml-auto bg-blue-500 text-white text-xs font-medium rounded-full px-2 py-1 min-w-6 text-center">
                            3
                        </span>
                    </SidebarLink> */}
                    <SidebarLink
                        href={route("organization.bookings")}
                        icon={ClipboardList}
                        className="group flex items-center w-full px-4 py-4 text-left rounded-2xl hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 border border-transparent hover:border-blue-200 hover:shadow-sm"
                        activeClassName="bg-blue-50 text-blue-700 border-blue-200 shadow-sm"
                    >
                        <ClipboardList className="w-5 h-5 mr-3" />
                        Bookings
                    </SidebarLink>
                    <SidebarLink
                        href={route("organization.points")}
                        icon={Star}
                        className="group flex items-center w-full px-4 py-4 text-left rounded-2xl hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 border border-transparent hover:border-blue-200 hover:shadow-sm"
                        activeClassName="bg-blue-50 text-blue-700 border-blue-200 shadow-sm"
                    >
                        <Star className="w-5 h-5 mr-3" />
                        Rewards
                        <span className="ml-auto bg-amber-500 text-white text-xs font-medium rounded-full px-2 py-1 min-w-6 text-center">
                            1.2k
                        </span>
                    </SidebarLink>
                </nav>

                {/* Bottom Section */}
                <div className="p-6 border-t border-slate-200 space-y-3 bg-slate-50/50">
                    <SidebarLink
                        href={route("organization.profile")}
                        icon={User}
                        className="group flex items-center w-full px-4 py-3 text-left rounded-xl hover:bg-white hover:text-slate-700 transition-all duration-200 text-slate-600 hover:shadow-sm"
                    >
                        <User className="w-5 h-5 mr-3" />
                        Profile & Settings
                    </SidebarLink>
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="group flex items-center w-full px-4 py-3 text-left rounded-xl hover:bg-red-50 hover:text-red-700 transition-all duration-200 text-slate-600"
                    >
                        <LogOut className="w-5 h-5 mr-3 transition-transform group-hover:-translate-x-1" />
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navigation Bar */}
                <header className="bg-white border-b border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between px-8 py-4">
                        <div className="flex items-center space-x-4">
                            <div className="flex-none lg:hidden">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="btn btn-ghost btn-circle hover:bg-blue-50 text-slate-600"
                                >
                                    <Menu className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center space-x-4">
                                    <h1 className="text-2xl font-bold text-slate-900">
                                        {currentPageTitle}
                                    </h1>
                                    <div className="hidden md:flex breadcrumbs text-sm">
                                        <ul className="flex items-center space-x-2">
                                            {breadcrumbs.map((item, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-center"
                                                >
                                                    {item.current ? (
                                                        <span className="text-slate-500 font-medium">
                                                            {item.label}
                                                        </span>
                                                    ) : (
                                                        <>
                                                            <Link
                                                                href={item.href}
                                                                className="text-blue-600 hover:text-blue-700 font-medium"
                                                            >
                                                                {item.label}
                                                            </Link>
                                                            <ChevronRight className="w-4 h-4 text-slate-400 mx-2" />
                                                        </>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Notification Bell */}
                            <div className="dropdown dropdown-end">
                                <div
                                    tabIndex={0}
                                    role="button"
                                    className="btn btn-ghost btn-circle hover:bg-slate-100"
                                >
                                    <div className="indicator">
                                        <Bell className="w-5 h-5 text-slate-600" />
                                        <span className="badge badge-xs badge-primary indicator-item"></span>
                                    </div>
                                </div>
                            </div>

                            {/* User Menu */}
                            <div className="dropdown dropdown-end">
                                <div
                                    tabIndex={0}
                                    role="button"
                                    className="flex items-center space-x-3 hover:bg-slate-50 rounded-2xl p-2 transition-colors cursor-pointer"
                                >
                                    <div className="avatar">
                                        <div className="w-10 rounded-xl ring-2 ring-slate-200 ring-offset-2 ring-offset-white">
                                            <img
                                                src={
                                                    auth?.user?.avatar_url ??
                                                    "/default-avatar.png"
                                                }
                                                alt={auth?.user?.name}
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <p className="text-sm font-medium text-slate-900">
                                            {auth?.user?.name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Organization
                                        </p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-400 hidden md:block" />
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content menu bg-white rounded-2xl z-[1] w-56 p-2 shadow-lg border border-slate-200"
                                >
                                    <li>
                                        <Link
                                            href={route("organization.profile")}
                                            className="hover:bg-slate-50 rounded-xl"
                                        >
                                            <User className="w-4 h-4" />
                                            Profile & Settings
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="#"
                                            className="hover:bg-slate-50 rounded-xl"
                                        >
                                            <HelpCircle className="w-4 h-4" />
                                            Help & Support
                                        </Link>
                                    </li>
                                    <div className="divider my-2"></div>
                                    <li>
                                        <Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                            className="text-red-600 hover:bg-red-50 rounded-xl"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-slate-50/30">
                    <div className="p-8">{children}</div>
                </main>

                <FloatingChat auth={auth} />
                <FloatingConversation auth={auth} />
            </div>
        </div>
    );
}
