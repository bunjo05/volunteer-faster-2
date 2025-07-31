import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { useState } from "react";

import { LogOut } from "lucide-react";

export default function GeneralPages({ children, auth }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navbar */}
            <header className="bg-white shadow sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                    <Link href="/" className="flex items-center space-x-2">
                        <ApplicationLogo className="h-[50px] w-[40px] text-blue-600" />
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
                    {/* Auth Links */}
                    <div className="hidden sm:flex items-center space-x-4">
                        {auth?.user ? (
                            <>
                                <Link
                                    href={route("dashboard")}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="w-full flex items-center gap-3 py-2 px-4 rounded bg-red-500 text-white hover:bg-red-600"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Logout
                                </Link>
                            </>
                        ) : (
                            <>
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
                            </>
                        )}
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
                                {auth?.user ? (
                                    <>
                                        <Link
                                            href={route("dashboard")}
                                            className="w-full block text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                            className="w-full flex items-center gap-3 py-2 px-4 rounded bg-red-500 text-white hover:bg-red-600"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            Logout
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            className="w-1/2 block text-center text-gray-700 hover:text-blue-600 font-medium"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="w-1/2 block text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Page Content */}
            <main className="">{children}</main>
            <footer className="bg-white border-t mt-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-gray-700">
                    <div className="">
                        <div className="flex items-center justify-center space-x-1 mb-4">
                            <ApplicationLogo className="h-[50px] w-[40px] text-blue-600 mb-2" />
                        </div>
                        <div className="text-center">
                            <h4 className="text-base font-bold text-gray-900 mb-3">
                                Volunteer Faster
                            </h4>
                            <p>
                                Connecting volunteers with meaningful causes
                                worldwide.
                            </p>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                            Navigation
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href={route("home")}
                                    className="hover:text-blue-600"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route("projects")}
                                    className="hover:text-blue-600"
                                >
                                    Volunteer Programs
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route("guide")}
                                    className="hover:text-blue-600"
                                >
                                    Volunteer Guide
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route("about")}
                                    className="hover:text-blue-600"
                                >
                                    About Us
                                </Link>
                            </li>
                            {/* <li>
                                <Link
                                    href="/contact"
                                    className="hover:text-blue-600"
                                >
                                    Contact
                                </Link>
                            </li> */}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                            Legal
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href={route("terms")}
                                    className="hover:text-blue-600"
                                >
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route("privacy.policy")}
                                    className="hover:text-blue-600"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route("gdpr")}
                                    className="hover:text-blue-600"
                                >
                                    GDPR Compliance
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route("cookies")}
                                    className="hover:text-blue-600"
                                >
                                    Cookie Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                            Resources
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/faq"
                                    className="hover:text-blue-600"
                                >
                                    FAQs
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/blog"
                                    className="hover:text-blue-600"
                                >
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/testimonials"
                                    className="hover:text-blue-600"
                                >
                                    Testimonials
                                </Link>
                            </li>
                            {/* <li>
                                <Link
                                    href="/accessibility"
                                    className="hover:text-blue-600"
                                >
                                    Accessibility
                                </Link>
                            </li> */}
                        </ul>
                    </div>
                </div>

                <div className="border-t text-center text-xs py-4 text-gray-500">
                    &copy; {new Date().getFullYear()} Volunteer Faster. All
                    rights reserved.
                </div>
            </footer>
        </div>
    );
}
