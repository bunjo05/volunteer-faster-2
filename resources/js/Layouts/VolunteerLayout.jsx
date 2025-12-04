import { useState, useEffect, useRef } from "react";
import { Link } from "@inertiajs/react";
import SidebarLink from "@/Components/SidebarLink";
import FloatingConversation from "@/Components/FloatingConversation";
import PlatformReview from "@/Components/PlatformReview";
import NotificationBell from "@/Components/NotificationBell";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
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
    User,
    TrendingUp,
    HeartHandshake,
    ChevronRight,
} from "lucide-react";
import FloatingChat from "@/Components/FloatingChat";

export default function VolunteerLayout({ children, auth, points }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [hasVolunteerProfile, setHasVolunteerProfile] = useState(false);
    const [isMessageSidebarOpen, setIsMessageSidebarOpen] = useState(false);

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
    }, [auth]);

    // Close message sidebar when main sidebar opens on mobile
    useEffect(() => {
        if (sidebarOpen && window.innerWidth < 1024) {
            setIsMessageSidebarOpen(false);
        }
    }, [sidebarOpen]);

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
            {/* Main Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-30 w-80 bg-white shadow-xl border-r border-slate-200
                    transition-transform duration-300 ease-in-out
                    lg:translate-x-0 lg:static lg:inset-0
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                {/* Brand Header */}
                <div className="p-8 bg-gradient-to-r from-emerald-600 to-emerald-700">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                            <HeartHandshake className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-white text-2xl block leading-tight">
                                VolunteerFaster
                            </span>
                            <span className="text-white/80 text-sm font-medium">
                                Volunteer Portal
                            </span>
                        </div>
                    </div>
                </div>

                {/* User Profile & Points */}
                {/* <div className="p-6 border-b border-slate-100 bg-gradient-to-b from-white to-slate-50/50">
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-4 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium opacity-90">
                                    Your Points
                                </p>
                                <p className="text-2xl font-bold">
                                    {totalPoints.toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-white/20 p-2 rounded-xl">
                                <Star className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="flex items-center mt-2 text-xs opacity-90">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            <span>Earn more by volunteering</span>
                        </div>
                    </div>
                </div> */}

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <SidebarLink
                        href={route("volunteer.dashboard")}
                        icon={Home}
                        className="group flex items-center w-full px-4 py-4 text-left rounded-2xl hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 border border-transparent hover:border-emerald-200 hover:shadow-sm"
                        activeClassName="bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm"
                    >
                        <Home className="w-5 h-5 mr-3" />
                        Dashboard
                    </SidebarLink>
                    <SidebarLink
                        href={route("volunteer.projects")}
                        icon={FolderKanban}
                        className="group flex items-center w-full px-4 py-4 text-left rounded-2xl hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 border border-transparent hover:border-emerald-200 hover:shadow-sm"
                        activeClassName="bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm"
                    >
                        <FolderKanban className="w-5 h-5 mr-3" />
                        My Projects
                    </SidebarLink>
                    <SidebarLink
                        href={route("volunteer.points")}
                        icon={Star}
                        className="group flex items-center w-full px-4 py-4 text-left rounded-2xl hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 border border-transparent hover:border-emerald-200 hover:shadow-sm"
                        activeClassName="bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm"
                    >
                        <Star className="w-5 h-5 mr-3" />
                        My Points
                        {/* <span className="ml-auto bg-amber-500 text-white text-xs font-medium rounded-full px-2 py-1">
                            {totalPoints}
                        </span> */}
                    </SidebarLink>
                    <SidebarLink
                        href={route("volunteer.sponsorships")}
                        icon={CircleUserIcon}
                        className="group flex items-center w-full px-4 py-4 text-left rounded-2xl hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 border border-transparent hover:border-emerald-200 hover:shadow-sm"
                        activeClassName="bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm"
                    >
                        <CircleUserIcon className="w-5 h-5 mr-3" />
                        Sponsorships
                    </SidebarLink>
                </nav>

                {/* Bottom Section */}
                <div className="p-6 border-t border-slate-200 space-y-3 bg-slate-50/50">
                    <SidebarLink
                        href={route("volunteer.profile")}
                        icon={User}
                        className="group flex items-center w-full px-4 py-3 text-left rounded-xl hover:bg-white hover:text-slate-700 transition-all duration-200 text-slate-600 hover:shadow-sm"
                    >
                        <User className="w-5 h-5 mr-3" />
                        Profile
                    </SidebarLink>

                    <SidebarLink
                        href={route("volunteer.settings")}
                        icon={Cog6ToothIcon} // Import from heroicons
                        className="group flex items-center w-full px-4 py-3 text-left rounded-xl hover:bg-white hover:text-slate-700 transition-all duration-200 text-slate-600 hover:shadow-sm"
                    >
                        <Cog6ToothIcon className="w-5 h-5 mr-3" />
                        Account Settings
                    </SidebarLink>

                    {/* volunteer.settings */}
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
                <header className="bg-white border-b border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between px-8 py-4">
                        {/* Mobile menu button and title */}
                        <div className="flex items-center lg:hidden">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="p-3 rounded-2xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 mr-3 transition-colors"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <div>
                                <span className="font-semibold text-lg text-slate-900">
                                    Volunteer Panel
                                </span>
                                <p className="text-sm text-slate-500">
                                    Welcome back, {auth?.user?.name}
                                </p>
                            </div>
                        </div>

                        {/* Desktop spacer */}
                        <div className="hidden lg:block flex-1"></div>

                        {/* Right-aligned icons container */}
                        <div className="flex items-center justify-end gap-4">
                            {/* Notification Bell */}
                            <NotificationBell />

                            {/* Messages - Modified to open message sidebar */}
                            <button
                                onClick={() => setIsMessageSidebarOpen(true)}
                                className="p-3 rounded-2xl hover:bg-slate-100 transition-colors relative group"
                                aria-label="Messages"
                            >
                                <MessageSquare className="w-5 h-5 text-slate-600 group-hover:text-slate-700" />
                                {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-medium">
                                    3
                                </span> */}
                            </button>

                            {/* User Profile */}
                            {/* <div className="dropdown dropdown-end">
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
                                            Volunteer
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
                                            href={route("volunteer.profile")}
                                            className="hover:bg-slate-50 rounded-xl"
                                        >
                                            <User className="w-4 h-4" />
                                            Profile & Settings
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
                            </div> */}
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto bg-slate-50/30">
                    <div className="p-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
                            {children}
                        </div>
                    </div>
                </main>

                {/* Chat Sidebar - Modified to be controlled by state */}
                <FloatingConversation
                    auth={auth}
                    isOpen={isMessageSidebarOpen}
                    onClose={() => setIsMessageSidebarOpen(false)}
                />

                <FloatingChat />

                {/* Conditionally render PlatformReview component */}
                {hasVolunteerProfile && <PlatformReview />}
            </div>
        </div>
    );
}
