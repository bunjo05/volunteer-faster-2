import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { useState } from "react";

export default function GuestLayout({ children }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navbar */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    {/* Logo / Brand */}
                    <Link href="/" className="flex items-center space-x-2">
                        <ApplicationLogo className="h-8 w-8 text-blue-600" />
                        <span className="text-xl font-bold text-gray-800">
                            Volunteer Faster
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden sm:flex items-center space-x-6">
                        <Link
                            href={route("home")}
                            className="text-gray-600 hover:text-blue-600 font-medium"
                        >
                            Home
                        </Link>
                        <Link
                            href={route("projects")}
                            className="text-gray-600 hover:text-blue-600 font-medium"
                        >
                            Volunteer Programs
                        </Link>

                        <Link
                            href="/guide"
                            className="text-gray-600 hover:text-blue-600 font-medium"
                        >
                            Volunteer Guide
                        </Link>
                    </nav>

                    {/* Auth Links */}
                    <div className="hidden sm:flex items-center space-x-4">
                        <Link
                            href="/login"
                            className="text-gray-700 hover:text-blue-600 font-medium"
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold"
                        >
                            Register
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-blue-600 focus:outline-none"
                    >
                        <svg
                            className="h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {mobileMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation Menu */}
                {mobileMenuOpen && (
                    <div className="sm:hidden px-4 pb-4">
                        <div className="space-y-2">
                            <Link
                                href={route("home")}
                                className="block text-gray-700 hover:text-blue-600 font-medium"
                            >
                                Home
                            </Link>
                            <Link
                                href={route("projects")}
                                className="block text-gray-700 hover:text-blue-600 font-medium"
                            >
                                Volunteer Programs
                            </Link>
                            <Link
                                href="/guide"
                                className="block text-gray-700 hover:text-blue-600 font-medium"
                            >
                                Volunteer Guide
                            </Link>

                            <div className="flex w-full">
                                <Link
                                    href="/login"
                                    className="w-full block text-center text-gray-700 hover:text-blue-600 font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="w-full block text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold"
                                >
                                    Register
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Page Content */}
            <main className="flex flex-1 items-center justify-center px-4">
                <div className="mt-6 w-full max-w-md bg-white px-6 py-8 shadow-lg rounded-lg">
                    {children}
                </div>
            </main>
            {/* Footer */}
            <footer className="bg-white shadow mt-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
                    <p className="text-gray-600 text-sm">
                        &copy; {new Date().getFullYear()} Volunteer Faster. All
                        rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
