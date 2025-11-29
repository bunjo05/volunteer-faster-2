import VerifiedBadge from "@/Components/VerifiedBadge";
import GeneralPages from "@/Layouts/GeneralPages";
import { Link } from "@inertiajs/react";
import { router } from "@inertiajs/react";

export default function OrganizationProfile({
    organization,
    activeProjects,
    featuredProjects,
    auth,
    isVerified,
    isFollowing,
    followersCount,
    totalProjects,
}) {
    return (
        <GeneralPages auth={auth || null}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Organization Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-12">
                    <div className="relative">
                        <div className="w-40 h-40 rounded-xl overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-gray-50 to-gray-100">
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
                            <div className="absolute -top-2 -right-2 z-10">
                                <VerifiedBadge className="w-10 h-10 drop-shadow-md" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-bold text-gray-900 font-serif">
                                {organization.name}
                            </h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-gray-600">
                            <svg
                                className="w-5 h-5 text-gray-500"
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
                                <span className="text-gray-700">
                                    {organization.country}
                                </span>
                            )}
                            {organization.state && (
                                <span className="text-gray-700">
                                    {organization.state}
                                </span>
                            )}
                            {organization.city && (
                                <span className="text-gray-700">
                                    {organization.city}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Organization Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-8">
                        {/* About Section */}
                        <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 font-serif">
                                    About Us
                                </h2>
                                <div className="w-10 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                            </div>
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
                                        <div className="bg-blue-50 p-6 rounded-lg">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                                <svg
                                                    className="w-5 h-5 text-blue-600 mr-2"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                                    />
                                                </svg>
                                                Mission
                                            </h3>
                                            <p className="text-gray-700 pl-7">
                                                {organization.mission_statement}
                                            </p>
                                        </div>
                                    )}
                                    {organization.vision_statement && (
                                        <div className="bg-purple-50 p-6 rounded-lg">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                                <svg
                                                    className="w-5 h-5 text-purple-600 mr-2"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                    />
                                                </svg>
                                                Vision
                                            </h3>
                                            <p className="text-gray-700 pl-7">
                                                {organization.vision_statement}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </section>

                        {/* Featured Projects Section */}
                        {featuredProjects.length > 0 && (
                            <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                                    <h2 className="text-2xl font-bold text-gray-900 font-serif">
                                        Featured Projects
                                    </h2>
                                    <div className="w-10 h-1 bg-gradient-to-r from-green-500 to-teal-500 rounded-full"></div>
                                </div>
                                <div className="space-y-6">
                                    {featuredProjects.map((project) => (
                                        <div
                                            key={project.id}
                                            className="border border-gray-200 rounded-xl overflow-hidden transition-all hover:shadow-lg group"
                                        >
                                            <div className="h-60 overflow-hidden relative">
                                                <img
                                                    src={
                                                        project.featured_image
                                                            ? `/storage/${project.featured_image}`
                                                            : "/images/placeholder.jpg"
                                                    }
                                                    alt={project.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                <div className="absolute top-4 right-4">
                                                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                                                        Featured
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                                    <Link
                                                        href={route(
                                                            "projects.home.view",
                                                            project.slug
                                                        )}
                                                        className="hover:text-blue-600 hover:underline transition-colors"
                                                    >
                                                        {project.title}
                                                    </Link>
                                                </h3>
                                                <p className="text-gray-600 mb-4 line-clamp-2">
                                                    {project.short_description}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <Link
                                                        href={route(
                                                            "projects.home.view",
                                                            project.slug
                                                        )}
                                                        className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 group transition-colors"
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
                                                    {project.featuredProjects &&
                                                        project
                                                            .featuredProjects[0] && (
                                                            <div className="text-sm text-gray-500">
                                                                Featured until:{" "}
                                                                {new Date(
                                                                    project.featuredProjects[0].end_date
                                                                ).toLocaleDateString()}
                                                            </div>
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Follow Button */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            {auth && auth.user ? (
                                isFollowing ? (
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
                                        className="w-full bg-gradient-to-r from-red-50 to-red-100 text-red-700 py-3 px-4 rounded-lg hover:from-red-100 hover:to-red-200 transition-all font-medium flex items-center justify-center shadow-sm hover:shadow-md"
                                    >
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                        Unfollow
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
                                        className="w-full bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 py-3 px-4 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all font-medium flex items-center justify-center shadow-sm hover:shadow-md"
                                    >
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 4v16m8-8H4"
                                            />
                                        </svg>
                                        Follow
                                    </button>
                                )
                            ) : (
                                <Link
                                    href={route("login")}
                                    className="block w-full bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 py-3 px-4 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all text-center font-medium flex items-center justify-center shadow-sm hover:shadow-md"
                                >
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                    Login to Follow
                                </Link>
                            )}
                        </div>

                        {/* Stats Section */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {followersCount || 0}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        Followers
                                    </div>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {totalProjects || 0}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        Projects
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Active Projects Section */}
                        {activeProjects.length > 0 && (
                            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                                    <h2 className="text-xl font-bold text-gray-900 font-serif">
                                        Active Projects ({activeProjects.length}
                                        )
                                    </h2>
                                    <div className="w-8 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                                </div>
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                    {activeProjects.map((project) => (
                                        <div
                                            key={project.id}
                                            className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-start space-x-3">
                                                <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden">
                                                    <img
                                                        src={
                                                            project.featured_image
                                                                ? `/storage/${project.featured_image}`
                                                                : "/images/placeholder.jpg"
                                                        }
                                                        alt={project.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-medium text-gray-900 truncate">
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
                                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                        {
                                                            project.short_description
                                                        }
                                                    </p>
                                                    <div className="mt-2 flex items-center text-xs text-gray-500">
                                                        <svg
                                                            className="w-3 h-3 mr-1"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            />
                                                        </svg>
                                                        {project.min_duration}-
                                                        {project.max_duration}{" "}
                                                        {project.duration_type?.toLowerCase()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {activeProjects.length === 0 && (
                                    <p className="text-gray-500 text-sm text-center py-4">
                                        No active projects found
                                    </p>
                                )}
                            </section>
                        )}

                        {/* Social Media */}
                        {(organization.facebook ||
                            organization.twitter ||
                            organization.instagram ||
                            organization.youtube ||
                            organization.website ||
                            organization.linkedin) && (
                            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                                    <h2 className="text-xl font-bold text-gray-900 font-serif">
                                        Connect With Us
                                    </h2>
                                    <div className="w-8 h-1 bg-gradient-to-r from-pink-500 to-red-500 rounded-full"></div>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {organization.website && (
                                        <a
                                            href={organization.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
                                            aria-label="Website"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke-width="1.5"
                                                stroke="currentColor"
                                                class="size-6"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                                                />
                                            </svg>
                                        </a>
                                    )}
                                    {organization.facebook && (
                                        <a
                                            href={organization.facebook}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
                                            aria-label="Facebook"
                                        >
                                            <svg
                                                className="w-5 h-5"
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
                                            className="w-10 h-10 bg-blue-400 text-white rounded-lg flex items-center justify-center hover:bg-blue-500 transition-all shadow-sm hover:shadow-md"
                                            aria-label="Twitter"
                                        >
                                            <svg
                                                className="w-5 h-5"
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
                                            className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-all shadow-sm hover:shadow-md"
                                            aria-label="Instagram"
                                        >
                                            <svg
                                                className="w-5 h-5"
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
                                            className="w-10 h-10 bg-blue-700 text-white rounded-lg flex items-center justify-center hover:bg-blue-800 transition-all shadow-sm hover:shadow-md"
                                            aria-label="LinkedIn"
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                            </svg>
                                        </a>
                                    )}
                                    {organization.youtube && (
                                        <a
                                            href={organization.youtube}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10  text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
                                            aria-label="Youtube"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 640 640"
                                            >
                                                <path
                                                    fill="#ff0000"
                                                    d="M581.7 188.1C575.5 164.4 556.9 145.8 533.4 139.5C490.9 128 320.1 128 320.1 128C320.1 128 149.3 128 106.7 139.5C83.2 145.8 64.7 164.4 58.4 188.1C47 231 47 320.4 47 320.4C47 320.4 47 409.8 58.4 452.7C64.7 476.3 83.2 494.2 106.7 500.5C149.3 512 320.1 512 320.1 512C320.1 512 490.9 512 533.5 500.5C557 494.2 575.5 476.3 581.8 452.7C593.2 409.8 593.2 320.4 593.2 320.4C593.2 320.4 593.2 231 581.8 188.1zM264.2 401.6L264.2 239.2L406.9 320.4L264.2 401.6z"
                                                />
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
