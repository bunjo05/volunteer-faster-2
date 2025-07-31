import GeneralPages from "@/Layouts/GeneralPages";
import { Link } from "@inertiajs/react";
import { useState } from "react";

export default function Projects({ projects: initialProjects, auth }) {
    const [projects, setProjects] = useState(initialProjects);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        category: "",
        type_of_project: "",
        location: "",
    });

    // Filter projects based on search and filters
    const filteredProjects = initialProjects.filter((project) => {
        const matchesSearch =
            project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.short_description
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesCategory =
            !filters.category || project.category?.name === filters.category;

        const matchesPaymentType =
            !filters.type_of_project ||
            project.type_of_project.toLowerCase() ===
                filters.type_of_project.toLowerCase();

        const matchesLocation =
            !filters.location ||
            project.address
                ?.toLowerCase()
                .includes(filters.location.toLowerCase());

        return (
            matchesSearch &&
            matchesCategory &&
            matchesPaymentType &&
            matchesLocation
        );
    });

    // Get unique categories for filter dropdown
    const categories = [
        ...new Set(
            initialProjects.map((p) => p.category?.name).filter(Boolean)
        ),
    ];

    return (
        <GeneralPages auth={auth}>
            {/* Enhanced Page Header */}
            <div className="py-16 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-b from-blue-200 to-white">
                <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
                    Discover Volunteer Opportunities
                </h1>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                    Find meaningful projects that align with your passions and
                    create lasting impact.
                </p>
            </div>

            {/* Search and Filter Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white sticky top-[70px] z-10 shadow-sm rounded-lg">
                <div className="flex flex-col md:flex-row gap-4 md:items-center">
                    {/* Search Input */}
                    <div className="flex-1">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    ></path>
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search projects..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="w-full md:w-48">
                        <select
                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={filters.category}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    category: e.target.value,
                                })
                            }
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Payment Type Filter */}
                    <div className="w-full md:w-48">
                        <select
                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={filters.type_of_project}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    type_of_project: e.target.value,
                                })
                            }
                        >
                            <option value="">All Types</option>
                            <option value="paid">Paid</option>
                            <option value="free">Free</option>
                        </select>
                    </div>

                    {/* Location Filter */}
                    <div className="w-full md:w-48">
                        <input
                            type="text"
                            placeholder="Filter by location"
                            className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={filters.location}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    location: e.target.value,
                                })
                            }
                        />
                    </div>

                    {/* Reset Filters */}
                    <button
                        onClick={() => {
                            setSearchTerm("");
                            setFilters({
                                category: "",
                                type_of_project: "",
                                location: "",
                            });
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Results Count */}
                <div className="mb-8">
                    <p className="text-gray-600">
                        Showing{" "}
                        <span className="font-semibold">
                            {filteredProjects.length}
                        </span>{" "}
                        {filteredProjects.length === 1 ? "project" : "projects"}
                    </p>
                </div>

                {/* Enhanced Project Cards */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects.length > 0 ? (
                        filteredProjects.map((project) => (
                            <div
                                key={project.id}
                                className="group bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden"
                            >
                                {/* Image with badges */}
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={
                                            project.featured_image
                                                ? `/storage/${project.featured_image}`
                                                : "/images/placeholder.jpg"
                                        }
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

                                    {/* Payment Type Badge */}
                                    <div className="absolute top-4 right-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                                                project.type_of_project ===
                                                "Paid"
                                                    ? "bg-purple-100 text-purple-800"
                                                    : "bg-green-100 text-green-800"
                                            }`}
                                        >
                                            {project.type_of_project === "Paid"
                                                ? "Paid"
                                                : "Free"}
                                        </span>
                                    </div>

                                    {/* Featured Badge (if applicable) */}
                                    {project.is_featured && (
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                                Featured
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Card Content */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                        <Link
                                            href={route(
                                                "projects.home.view",
                                                project.slug
                                            )}
                                            className="hover:underline"
                                        >
                                            {project.title}
                                        </Link>
                                    </h3>

                                    {/* Category Tags */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <span className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                                            {project.category?.name}
                                        </span>
                                        {project.subcategory?.name && (
                                            <span className="bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                                                {project.subcategory?.name}
                                            </span>
                                        )}
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-center text-gray-600 text-sm mb-4">
                                        <svg
                                            className="w-4 h-4 mr-1.5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            ></path>
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            ></path>
                                        </svg>
                                        {project.address ||
                                            "Multiple Locations"}
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-700 mb-5 line-clamp-3">
                                        {project.short_description}
                                    </p>

                                    {/* CTA */}
                                    <Link
                                        href={route(
                                            "projects.home.view",
                                            project.slug
                                        )}
                                        className="mt-auto inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors group"
                                    >
                                        View Details
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
                                            ></path>
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <div className="text-gray-500 mb-4">
                                <svg
                                    className="w-16 h-16 mx-auto"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    ></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">
                                No projects found
                            </h3>
                            <p className="text-gray-600">
                                Try adjusting your search or filters
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setFilters({
                                        category: "",
                                        type_of_project: "",
                                        location: "",
                                    });
                                }}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Reset Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </GeneralPages>
    );
}
