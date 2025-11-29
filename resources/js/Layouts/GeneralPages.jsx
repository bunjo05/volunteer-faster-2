import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { useState } from "react";
import { LogOut } from "lucide-react";

export default function GeneralPages({ children, auth }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Function to get the correct dashboard route based on user role
    const getDashboardRoute = () => {
        if (!auth?.user) return "/dashboard";

        const role = auth.user.role;
        switch (role) {
            case "Volunteer":
                return "/volunteer/dashboard";
            case "Organization":
                return "/organization/dashboard";
            case "Sponsor":
                return "/sponsor/dashboard";
            default:
                return "/dashboard";
        }
    };

    return (
        <div className="min-h-screen bg-base-100 flex flex-col">
            {/* Navbar */}
            <header className="bg-base-100 shadow-sm sticky top-0 z-30 border-b border-base-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                    <Link href="/" className="flex items-center space-x-2">
                        <ApplicationLogo className="h-[50px] w-[40px] text-primary" />
                        <span className="text-xl font-bold text-base-content">
                            Volunteer Faster
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden sm:flex items-center space-x-6">
                        <Link
                            href={route("home")}
                            className="text-base-content hover:text-primary font-medium"
                        >
                            Home
                        </Link>
                        <Link
                            href={route("projects")}
                            className="text-base-content hover:text-primary font-medium"
                        >
                            Volunteer Programs
                        </Link>
                        <Link
                            href={route("guest.sponsorship.page")}
                            className="text-base-content hover:text-primary font-medium"
                        >
                            Corporate Impact Sponsorship
                        </Link>
                        <Link
                            href={route("guide")}
                            className="text-base-content hover:text-primary font-medium"
                        >
                            Volunteer Guide
                        </Link>
                    </nav>

                    {/* Auth Links */}
                    <div className="hidden sm:flex items-center space-x-4">
                        {auth?.user ? (
                            <>
                                <Link
                                    href={getDashboardRoute()}
                                    className="btn btn-primary"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="btn btn-error"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Logout
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-base-content hover:text-primary font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="btn btn-primary"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="sm:hidden btn btn-ghost btn-square"
                    >
                        {mobileMenuOpen ? (
                            <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Navigation Menu */}
                {mobileMenuOpen && (
                    <div className="sm:hidden px-4 pb-4">
                        <div className="flex flex-col space-y-4">
                            <Link
                                href={route("home")}
                                className="btn btn-ghost justify-start"
                            >
                                Home
                            </Link>
                            <Link
                                href={route("projects")}
                                className="btn btn-ghost justify-start"
                            >
                                Volunteer Programs
                            </Link>
                            <Link
                                href={route("guest.sponsorship.page")}
                                className="btn btn-ghost justify-start"
                            >
                                Corporate Impact Sponsorship
                            </Link>
                            <Link
                                href={route("guide")}
                                className="btn btn-ghost justify-start"
                            >
                                Volunteer Guide
                            </Link>

                            <div className="flex flex-col space-y-2">
                                {auth?.user ? (
                                    <>
                                        <Link
                                            href={getDashboardRoute()}
                                            className="btn btn-primary"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                            className="btn btn-error"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            Logout
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            className="btn btn-ghost"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="btn btn-primary"
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
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="bg-base-100 border-t border-base-200 mt-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center space-x-1 mb-4">
                            <ApplicationLogo className="h-[50px] w-[40px] text-primary mb-2" />
                        </div>
                        <div className="text-center">
                            <h4 className="text-lg font-bold text-base-content mb-3">
                                Volunteer Faster
                            </h4>
                            <p className="text-base-content/70">
                                Connecting volunteers with meaningful causes
                                worldwide.
                            </p>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-base-content mb-3">
                            Navigation
                        </h4>
                        <ul className="space-y-2">
                            {[
                                { route: "home", label: "Home" },
                                {
                                    route: "projects",
                                    label: "Volunteer Programs",
                                },
                                { route: "guide", label: "Volunteer Guide" },
                                { route: "about", label: "About Us" },
                                { route: "contact", label: "Contact" },
                            ].map((item) => (
                                <li key={item.route}>
                                    <Link
                                        href={route(item.route)}
                                        className="text-base-content/70 hover:text-primary"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-base-content mb-3">
                            Legal
                        </h4>
                        <ul className="space-y-2">
                            {[
                                {
                                    route: "terms.conditions",
                                    label: "Terms & Conditions",
                                },
                                {
                                    route: "privacy.policy",
                                    label: "Privacy Policy",
                                },
                                { route: "gdpr", label: "GDPR Compliance" },
                                { route: "cookies", label: "Cookie Policy" },
                            ].map((item) => (
                                <li key={item.route}>
                                    <Link
                                        href={route(item.route)}
                                        className="text-base-content/70 hover:text-primary"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-base-content mb-3">
                            Resources
                        </h4>
                        <ul className="space-y-2">
                            {[
                                // { route: "faq", label: "FAQs" },
                                // { route: "blog", label: "Blog" },
                                // {
                                //     route: "testimonials",
                                //     label: "Testimonials",
                                // },
                            ].map((item) => (
                                <li key={item.route}>
                                    <Link
                                        href={route(item.route)}
                                        className="text-base-content/70 hover:text-primary"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-base-200 text-center text-xs py-4 text-base-content/50">
                    &copy; {new Date().getFullYear()} Volunteer Faster. All
                    rights reserved.
                </div>
            </footer>
        </div>
    );
}
