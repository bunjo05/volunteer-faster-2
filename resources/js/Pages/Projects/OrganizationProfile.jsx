import VerifiedBadge from "@/Components/VerifiedBadge";
import GeneralPages from "@/Layouts/GeneralPages";
import { Link } from "@inertiajs/react";
import { router } from "@inertiajs/react";

export default function OrganizationProfile({
    organization,
    project,
    auth,
    isVerified,
    isFollowing, // Add this prop
}) {
    return (
        <GeneralPages auth={auth || null}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Organization Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-12">
                    <div className="relative">
                        <div className="w-40 h-40 rounded-lg overflow-hidden border-4 border-white shadow-xl bg-gray-100">
                            <img
                                src={
                                    organization.logo
                                        ? `/storage/${organization.logo}`
                                        : "/images/placeholder.jpg"
                                }
                                alt={`${organization.name} logo`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {isVerified && (
                            <div className="absolute -top-0 -right-0 z-10">
                                <VerifiedBadge className="w-10 h-10" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-bold text-gray-900">
                                {organization.name}
                            </h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-gray-600">
                            <>
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                {organization.country && (
                                    <span>{organization.country}</span>
                                )}
                                {organization.state && (
                                    <span>{organization.state} |</span>
                                )}
                                {organization.city && (
                                    <span className="flex items-center gap-1">
                                        {organization.city} |
                                    </span>
                                )}
                            </>
                        </div>
                    </div>
                </div>

                {/* Organization Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-8">
                        {/* About Section */}
                        <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                                About Us
                            </h2>
                            <div className="prose prose-lg max-w-none text-gray-700">
                                {organization.description || (
                                    <p className="text-gray-500 italic">
                                        No description provided
                                    </p>
                                )}
                            </div>

                            {(organization.mission_statement ||
                                organization.vision_statement) && (
                                <div className="mt-8 space-y-6">
                                    {organization.mission_statement && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                Mission
                                            </h3>
                                            <p className="text-gray-700">
                                                {organization.mission_statement}
                                            </p>
                                        </div>
                                    )}
                                    {organization.vision_statement && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                Vision
                                            </h3>
                                            <p className="text-gray-700">
                                                {organization.vision_statement}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </section>

                        {/* Projects Section */}
                        {project && (
                            <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                                    Featured Project
                                </h2>
                                <div className="border border-gray-200 rounded-xl overflow-hidden transition-all hover:shadow-md">
                                    <div className="h-60 overflow-hidden">
                                        <img
                                            src={
                                                project.featured_image
                                                    ? `/storage/${project.featured_image}`
                                                    : "/images/placeholder.jpg"
                                            }
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                                            <Link
                                                href={route(
                                                    "projects.home.view",
                                                    project.slug
                                                )}
                                                className="hover:text-blue-600 hover:underline"
                                            >
                                                {project.title}
                                            </Link>
                                        </h3>
                                        <p className="text-gray-600 mb-4 line-clamp-2">
                                            {project.short_description}
                                        </p>
                                        <Link
                                            href={route(
                                                "projects.home.view",
                                                project.slug
                                            )}
                                            className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 group"
                                        >
                                            View Project
                                            <svg
                                                className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Follow Button */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            {auth.user ? (
                                isFollowing ? ( // Changed from auth.user.is_following to isFollowing
                                    <button
                                        onClick={() => {
                                            if (
                                                confirm(
                                                    "Are you sure you want to unfollow this organization?"
                                                )
                                            ) {
                                                router.delete(
                                                    route(
                                                        "organizations.unfollow",
                                                        organization.id
                                                    )
                                                );
                                            }
                                        }}
                                        className="w-full bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors font-medium"
                                    >
                                        Unfollow Organization
                                    </button>
                                ) : (
                                    <button
                                        onClick={() =>
                                            router.post(
                                                route(
                                                    "organizations.follow",
                                                    organization.id
                                                )
                                            )
                                        }
                                        className="w-full bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                                    >
                                        Follow Organization
                                    </button>
                                )
                            ) : (
                                <Link
                                    href={route("login")}
                                    className="block w-full bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors text-center font-medium"
                                >
                                    Login to Follow
                                </Link>
                            )}
                        </div>

                        {/* Contact Info */}
                        <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                                Contact
                            </h2>
                            <div className="space-y-4">
                                {organization.email && (
                                    <div className="flex items-start">
                                        <div className="bg-blue-50 p-2 rounded-lg mr-4">
                                            <svg
                                                className="w-5 h-5 text-blue-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Email
                                            </p>
                                            <a
                                                href={`mailto:${organization.email}`}
                                                className="text-gray-700 hover:text-blue-600"
                                            >
                                                {organization.email}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {organization.address && (
                                    <div className="flex items-start">
                                        <div className="bg-blue-50 p-2 rounded-lg mr-4">
                                            <svg
                                                className="w-5 h-5 text-blue-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Address
                                            </p>
                                            <p className="text-gray-700">
                                                {organization.address}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Social Media */}
                        {(organization.facebook ||
                            organization.twitter ||
                            organization.instagram ||
                            organization.linkedin) && (
                            <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                                    Connect With Us
                                </h2>
                                <div className="flex flex-wrap gap-4">
                                    {organization.facebook && (
                                        <a
                                            href={organization.facebook}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors"
                                            aria-label="Facebook"
                                        >
                                            <svg
                                                className="w-6 h-6"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                            </svg>
                                        </a>
                                    )}
                                    {organization.twitter && (
                                        <a
                                            href={organization.twitter}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 bg-blue-400 text-white rounded-xl flex items-center justify-center hover:bg-blue-500 transition-colors"
                                            aria-label="Twitter"
                                        >
                                            <svg
                                                className="w-6 h-6"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                            </svg>
                                        </a>
                                    )}
                                    {organization.instagram && (
                                        <a
                                            href={organization.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-colors"
                                            aria-label="Instagram"
                                        >
                                            <svg
                                                className="w-6 h-6"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                            </svg>
                                        </a>
                                    )}
                                    {organization.linkedin && (
                                        <a
                                            href={organization.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 bg-blue-700 text-white rounded-xl flex items-center justify-center hover:bg-blue-800 transition-colors"
                                            aria-label="LinkedIn"
                                        >
                                            <svg
                                                className="w-6 h-6"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                            </svg>
                                        </a>
                                    )}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </GeneralPages>
    );
}
