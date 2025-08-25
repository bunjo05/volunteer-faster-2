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
} from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import SidebarLink from "@/Components/SidebarLink";
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
            "Organization/Bookings": "Bookings",
            "Organization/Points": "Points",
            "Organization/Profile": "Profile",
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
        <div className="flex h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300">
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
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
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
                                    <Dialog.Panel className="pointer-events-auto relative w-72">
                                        <div className="flex h-full flex-col bg-base-100 shadow-2xl">
                                            {/* Brand Header */}
                                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary to-primary-focus">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                                        <span className="text-primary font-bold text-sm">
                                                            VF
                                                        </span>
                                                    </div>
                                                    <span className="font-bold text-white text-lg">
                                                        Volunteer Faster
                                                    </span>
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
                                            <div className="p-4 border-b border-base-300">
                                                <div className="flex items-center space-x-3">
                                                    <div className="avatar">
                                                        <div className="w-12 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100">
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
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-base-content truncate">
                                                            {auth?.user?.name}
                                                        </p>
                                                        <p className="text-sm text-base-content/70 truncate">
                                                            Organization Account
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Navigation */}
                                            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                                                <SidebarLink
                                                    href={route(
                                                        "organization.dashboard"
                                                    )}
                                                    icon={Home}
                                                    className="btn btn-ghost justify-start w-full rounded-lg hover:bg-primary/10 hover:text-primary"
                                                    activeClassName="bg-primary/20 text-primary font-semibold"
                                                    currentRoute={component}
                                                    routeName="Organization/Dashboard"
                                                >
                                                    Dashboard
                                                </SidebarLink>
                                                <SidebarLink
                                                    href={route(
                                                        "organization.projects"
                                                    )}
                                                    icon={FolderKanban}
                                                    className="btn btn-ghost justify-start w-full rounded-lg hover:bg-primary/10 hover:text-primary"
                                                    activeClassName="bg-primary/20 text-primary font-semibold"
                                                    currentRoute={component}
                                                    routeName="Organization/Projects"
                                                >
                                                    My Projects
                                                </SidebarLink>
                                                <SidebarLink
                                                    href={route(
                                                        "organization.messages"
                                                    )}
                                                    icon={MessageSquare}
                                                    className="btn btn-ghost justify-start w-full rounded-lg hover:bg-primary/10 hover:text-primary"
                                                    activeClassName="bg-primary/20 text-primary font-semibold"
                                                    currentRoute={component}
                                                    routeName="Organization/Messages"
                                                >
                                                    Messages
                                                    <span className="badge badge-primary badge-sm ml-auto">
                                                        3
                                                    </span>
                                                </SidebarLink>
                                                <SidebarLink
                                                    href={route(
                                                        "organization.bookings"
                                                    )}
                                                    icon={ClipboardList}
                                                    className="btn btn-ghost justify-start w-full rounded-lg hover:bg-primary/10 hover:text-primary"
                                                    activeClassName="bg-primary/20 text-primary font-semibold"
                                                    currentRoute={component}
                                                    routeName="Organization/Bookings"
                                                >
                                                    Bookings
                                                </SidebarLink>
                                                <SidebarLink
                                                    href={route(
                                                        "organization.points"
                                                    )}
                                                    icon={Star}
                                                    className="btn btn-ghost justify-start w-full rounded-lg hover:bg-primary/10 hover:text-primary"
                                                    activeClassName="bg-primary/20 text-primary font-semibold"
                                                    currentRoute={component}
                                                    routeName="Organization/Points"
                                                >
                                                    Points
                                                    <span className="badge badge-secondary badge-sm ml-auto">
                                                        1.2k
                                                    </span>
                                                </SidebarLink>
                                                <SidebarLink
                                                    href={route(
                                                        "organization.profile"
                                                    )}
                                                    icon={User}
                                                    className="btn btn-ghost justify-start w-full rounded-lg hover:bg-primary/10 hover:text-primary"
                                                    activeClassName="bg-primary/20 text-primary font-semibold"
                                                    currentRoute={component}
                                                    routeName="Organization/Profile"
                                                >
                                                    Profile
                                                </SidebarLink>
                                            </nav>

                                            {/* Logout */}
                                            <div className="p-4 border-t border-base-300">
                                                <Link
                                                    href={route("logout")}
                                                    method="post"
                                                    as="button"
                                                    className="btn btn-error btn-outline w-full rounded-lg group"
                                                >
                                                    <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                                                    Sign Out
                                                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
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
            <aside className="hidden lg:flex lg:flex-col w-80 bg-base-100 border-r border-base-300 shadow-lg">
                {/* Brand Header */}
                <div className="p-6 bg-gradient-to-r from-primary to-primary-focus">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-primary font-bold text-lg">
                                VF
                            </span>
                        </div>
                        <div>
                            <span className="font-bold text-white text-xl block">
                                Volunteer Faster
                            </span>
                            <span className="text-white/80 text-sm">
                                Organization Portal
                            </span>
                        </div>
                    </div>
                </div>

                {/* User Profile */}
                <div className="p-6 border-b border-base-300">
                    <div className="flex items-center space-x-4">
                        <div className="avatar">
                            <div className="w-14 rounded-full ring-4 ring-primary/20 ring-offset-2 ring-offset-base-100">
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
                            <p className="font-semibold text-base-content text-lg">
                                {auth?.user?.name}
                            </p>
                            <p className="text-sm text-base-content/70">
                                Organization Manager
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <SidebarLink
                        href={route("organization.dashboard")}
                        icon={Home}
                        className="btn btn-ghost justify-start w-full rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200"
                        activeClassName="bg-primary/20 text-primary font-semibold shadow-md"
                        currentRoute={component}
                        routeName="Organization/Dashboard"
                    >
                        Dashboard
                    </SidebarLink>
                    <SidebarLink
                        href={route("organization.projects")}
                        icon={FolderKanban}
                        className="btn btn-ghost justify-start w-full rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200"
                        activeClassName="bg-primary/20 text-primary font-semibold shadow-md"
                        currentRoute={component}
                        routeName="Organization/Projects"
                    >
                        My Projects
                    </SidebarLink>
                    <SidebarLink
                        href={route("organization.messages")}
                        icon={MessageSquare}
                        className="btn btn-ghost justify-start w-full rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200"
                        activeClassName="bg-primary/20 text-primary font-semibold shadow-md"
                        currentRoute={component}
                        routeName="Organization/Messages"
                    >
                        Messages
                        <span className="badge badge-primary badge-sm ml-auto">
                            3
                        </span>
                    </SidebarLink>
                    <SidebarLink
                        href={route("organization.bookings")}
                        icon={ClipboardList}
                        className="btn btn-ghost justify-start w-full rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200"
                        activeClassName="bg-primary/20 text-primary font-semibold shadow-md"
                        currentRoute={component}
                        routeName="Organization/Bookings"
                    >
                        Bookings
                    </SidebarLink>
                    <SidebarLink
                        href={route("organization.points")}
                        icon={Star}
                        className="btn btn-ghost justify-start w-full rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200"
                        activeClassName="bg-primary/20 text-primary font-semibold shadow-md"
                        currentRoute={component}
                        routeName="Organization/Points"
                    >
                        Points
                        <span className="badge badge-secondary badge-sm ml-auto">
                            1.2k
                        </span>
                    </SidebarLink>
                    <SidebarLink
                        href={route("organization.profile")}
                        icon={User}
                        className="btn btn-ghost justify-start w-full rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200"
                        activeClassName="bg-primary/20 text-primary font-semibold shadow-md"
                        currentRoute={component}
                        routeName="Organization/Profile"
                    >
                        Profile
                    </SidebarLink>
                </nav>

                {/* Logout */}
                <div className="p-6 border-t border-base-300">
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="btn btn-error btn-outline w-full rounded-xl group hover:bg-error hover:text-error-content transition-all duration-200"
                    >
                        <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        Sign Out
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navigation Bar */}
                <div className="navbar bg-base-100 border-b border-base-300 px-6 py-4 shadow-sm">
                    <div className="flex-none lg:hidden">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="btn btn-ghost btn-circle hover:bg-primary/10"
                        >
                            <Menu className="w-6 h-6 text-base-content" />
                        </button>
                    </div>

                    <div className="flex-1">
                        <div className="breadcrumbs text-sm">
                            <ul>
                                {breadcrumbs.map((item, index) => (
                                    <li key={index}>
                                        {item.current ? (
                                            <span className="text-base-content/70">
                                                {item.label}
                                            </span>
                                        ) : (
                                            <Link
                                                href={item.href}
                                                className="text-primary hover:text-primary-focus"
                                            >
                                                {item.label}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="flex-none space-x-4">
                        <div className="dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost btn-circle avatar hover:bg-primary/10"
                            >
                                <div className="w-10 rounded-full ring-2 ring-primary/50 ring-offset-2 ring-offset-base-100">
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
                            <ul
                                tabIndex={0}
                                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg border border-base-300"
                            >
                                <li>
                                    <Link
                                        href={route("organization.profile")}
                                        className="hover:bg-primary/10 hover:text-primary"
                                    >
                                        <User className="w-4 h-4" />
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="text-error hover:bg-error/10 hover:text-error"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Page Header */}
                {/* <div className="bg-base-100 border-b border-base-300 px-6 py-4">
                    <h1 className="text-2xl font-bold text-base-content">
                        {currentPageTitle}
                    </h1>
                    {auth?.user?.name && (
                        <p className="text-sm text-base-content/70 mt-1">
                            Welcome back, {auth.user.name}
                        </p>
                    )}
                </div> */}

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-base-200/50">
                    <div className="p-6">{children}</div>
                </main>

                <FloatingChat auth={auth} />
            </div>
        </div>
    );
}
