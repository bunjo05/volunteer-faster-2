import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import SidebarLink from "@/Components/SidebarLink";
import FloatingChat from "@/Components/FloatingChat";
import TotalPoints from "@/Components/TotalPoints";
import PlatformReview from "@/Components/PlatformReview";

import {
    Home,
    FolderKanban,
    MessageSquare,
    User,
    LogOut,
    Menu,
    X,
    Star,
} from "lucide-react";

export default function VolunteerLayout({ children, auth, points }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [hasVolunteerProfile, setHasVolunteerProfile] = useState(false);

    const totalPoints = auth?.user?.points || points || 0;

    // Check if user has volunteer_profile field
    useEffect(() => {
        // Check if volunteer_profile is already in the auth object
        if (auth?.user?.volunteer_profile) {
            setHasVolunteerProfile(true);
        } else {
            // If not, make an API call to check if the user has a volunteer profile
            axios
                .get("/api/check-volunteer-profile")
                .then((response) => {
                    setHasVolunteerProfile(response.data.hasProfile);
                })
                .catch((error) => {
                    console.error("Error checking volunteer profile:", error);
                });
        }
    }, [auth]);

    console.log("Has volunteer profile:", hasVolunteerProfile);

    return (
        <div className="flex h-screen bg-base-200 overflow-hidden">
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
                        href={route("volunteer.messages")}
                        icon={MessageSquare}
                        className="btn btn-ghost w-full justify-start"
                    >
                        Messages
                    </SidebarLink>
                    <SidebarLink
                        href={route("volunteer.points")}
                        icon={Star}
                        className="btn btn-ghost w-full justify-start"
                    >
                        My Points
                    </SidebarLink>
                    <SidebarLink
                        href={route("volunteer.profile")}
                        icon={User}
                        className="btn btn-ghost w-full justify-start"
                    >
                        Profile
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
            <div className="flex-1 flex flex-col overflow-y-auto w-full">
                {/* Topbar for mobile */}
                <div className="lg:hidden px-4 py-3 bg-base-100 shadow-md flex items-center justify-between">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="btn btn-ghost btn-square"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="font-bold text-lg text-primary">
                        Volunteer Panel
                    </span>
                    <div className="w-6" />
                </div>

                {/* Page Content */}
                <main className="p-6">{children}</main>

                {/* Floating Chat */}
                <FloatingChat auth={auth} />

                {/* Conditionally render PlatformReview component */}
                {hasVolunteerProfile && <PlatformReview />}
            </div>
        </div>
    );
}
