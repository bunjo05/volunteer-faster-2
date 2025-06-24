import { useState } from "react";
import { Link } from "@inertiajs/react";
import SidebarLink from "@/Components/SidebarLink";

import FloatingChat from "@/Components/FloatingChat";

// Icons
import {
    Home,
    FolderKanban,
    MessageSquare,
    User,
    LogOut,
    Menu,
    X,
} from "lucide-react";

export default function VolunteerLayout({ children, auth }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform
                    transition-transform duration-300 ease-in-out
                    lg:translate-x-0 lg:static lg:inset-0
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                <div className="h-16 flex items-center justify-between px-4 border-b">
                    <span className="font-bold text-xl text-indigo-600">
                        Volunteer Faster
                    </span>
                    <button
                        className="lg:hidden text-gray-600"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <SidebarLink
                        href={route("volunteer.dashboard")}
                        icon={Home}
                    >
                        Dashboard
                    </SidebarLink>
                    <SidebarLink
                        href={route("volunteer.projects")}
                        icon={FolderKanban}
                    >
                        My Projects
                    </SidebarLink>
                    <SidebarLink
                        href={route("volunteer.messages")}
                        icon={MessageSquare}
                    >
                        Messages
                    </SidebarLink>
                    <SidebarLink
                    //  href={route("volunteer.profile")} icon={User}
                    >
                        Profile
                    </SidebarLink>
                </nav>
                <div className="border-t p-4">
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-3 py-2 px-4 rounded bg-red-500 text-white hover:bg-red-600"
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
            <div className="flex-1 flex flex-col overflow-y-auto w-full">
                {/* Topbar for mobile */}
                <div className="lg:hidden p-4 bg-white shadow flex items-center justify-between">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-gray-600"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="font-bold text-lg text-indigo-600">
                        Volunteer Panel
                    </span>
                    <div className="w-6" /> {/* placeholder to center title */}
                </div>
                <main className="p-6">{children}</main>
                <FloatingChat auth={auth} /> {/* Pass auth prop directly */}
            </div>
        </div>
    );
}
