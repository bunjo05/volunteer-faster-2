// resources/js/Layouts/SponsorLayout.jsx
import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { Menu, X } from "lucide-react"; // modern icons

export default function SponsorLayout({ children }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Navbar */}
            <header className="bg-white shadow sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    {/* Logo / Title */}
                    <h1 className="text-xl font-bold text-gray-800">
                        Volunteer Faster
                    </h1>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex space-x-8">
                        <Link
                            // href={route("sponsor.dashboard")}
                            className="text-gray-600 hover:text-blue-600 transition font-medium"
                        >
                            Dashboard
                        </Link>
                        {/* <Link
                            // href={route("sponsor.sponsorships")}
                            className="text-gray-600 hover:text-blue-600 transition font-medium"
                        >
                            Sponsorships
                        </Link> */}
                        {/* <Link
                            // href={route("sponsor.profile")}
                            className="text-gray-600 hover:text-blue-600 transition font-medium"
                        >
                            Profile
                        </Link> */}
                    </nav>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                    >
                        {menuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden bg-white border-t shadow-sm">
                        <nav className="flex flex-col px-4 py-3 space-y-3">
                            <Link
                                // href={route("sponsor.dashboard")}
                                className="text-gray-700 hover:text-blue-600 transition font-medium"
                            >
                                Dashboard
                            </Link>
                            <Link
                                // href={route("sponsor.sponsorships")}
                                className="text-gray-700 hover:text-blue-600 transition font-medium"
                            >
                                Sponsorships
                            </Link>
                            <Link
                                // href={route("sponsor.profile")}
                                className="text-gray-700 hover:text-blue-600 transition font-medium"
                            >
                                Profile
                            </Link>
                        </nav>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t py-4 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Volunteer Faster — Sponsor Portal
            </footer>
        </div>
    );
}
