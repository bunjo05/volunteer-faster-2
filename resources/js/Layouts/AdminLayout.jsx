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
} from "lucide-react";
import { Link } from "@inertiajs/react";
import { useState } from "react";

export default function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [projectsOpen, setProjectsOpen] = useState(false);
    const [reportsOpen, setReportsOpen] = useState(false);

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
                        <button className="relative">
                            <Bell size={20} className="text-gray-600" />
                            <span className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                                3
                            </span>
                        </button>
                        <div className="flex items-center gap-2">
                            <img
                                src="/images/admin-avatar.png"
                                alt="Admin"
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <span className="hidden sm:block text-sm font-medium text-gray-700">
                                Admin
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
