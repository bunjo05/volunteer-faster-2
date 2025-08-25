import GeneralPages from "@/Layouts/GeneralPages";
import { Link } from "@inertiajs/react";
import { useState } from "react";

export default function Projects({
    projects: initialProjects,
    auth,
    organization_verification,
}) {
    const [projects, setProjects] = useState(initialProjects);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        category: "",
        type_of_project: "",
        country: "",
        state: "",
        city: "",
    });

    // Extract unique locations from projects
    const allCountries = [
        ...new Set(initialProjects.map((p) => p.country).filter(Boolean)),
    ];
    const allStates = [
        ...new Set(initialProjects.map((p) => p.state).filter(Boolean)),
    ];
    const allCities = [
        ...new Set(initialProjects.map((p) => p.city).filter(Boolean)),
    ];

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

        const matchesCountry =
            !filters.country || project.country === filters.country;

        const matchesState = !filters.state || project.state === filters.state;

        const matchesCity = !filters.city || project.city === filters.city;

        return (
            matchesSearch &&
            matchesCategory &&
            matchesPaymentType &&
            matchesCountry &&
            matchesState &&
            matchesCity
        );
    });

    // Get unique categories for filter dropdown
    const categories = [
        ...new Set(
            initialProjects.map((p) => p.category?.name).filter(Boolean)
        ),
    ];

    const organizationVerified =
        organization_verification?.status === "Approved";

    return (
        <GeneralPages auth={auth}>
            {/* Hero Section */}
            <div className="hero h-64 bg-gradient-to-r from-primary to-secondary text-primary-content">
                <div className="hero-content text-center">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Discover Volunteer Opportunities
                        </h1>
                        <p className="text-lg opacity-90">
                            Find meaningful projects that align with your
                            passions and create lasting impact.
                        </p>
                    </div>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="sticky top-[70px] z-10 bg-base-100 shadow-sm">
                <div className="container mx-auto p-6">
                    <div className="flex flex-col md:flex-row gap-4 md:items-end">
                        {/* Search Input */}
                        <div className="flex-1">
                            <label className="input input-bordered flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    className="w-4 h-4 opacity-70"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <input
                                    type="text"
                                    className="grow"
                                    placeholder="Search projects..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </label>
                        </div>

                        {/* Category Filter */}
                        <div className="w-full md:w-48">
                            <select
                                className="select select-bordered w-full"
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
                                className="select select-bordered w-full"
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

                        {/* Country Filter */}
                        <div className="w-full md:w-48">
                            <select
                                className="select select-bordered w-full"
                                value={filters.country}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        country: e.target.value,
                                        state: "",
                                        city: "",
                                    })
                                }
                            >
                                <option value="">All Countries</option>
                                {allCountries.map((country) => (
                                    <option key={country} value={country}>
                                        {country}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* State Filter - only shown if a country is selected */}
                        {filters.country && (
                            <div className="w-full md:w-48">
                                <select
                                    className="select select-bordered w-full"
                                    value={filters.state}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            state: e.target.value,
                                            city: "",
                                        })
                                    }
                                >
                                    <option value="">All States</option>
                                    {allStates
                                        .filter((state) =>
                                            initialProjects.some(
                                                (p) =>
                                                    p.country ===
                                                        filters.country &&
                                                    p.state === state
                                            )
                                        )
                                        .map((state) => (
                                            <option key={state} value={state}>
                                                {state}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        )}

                        {/* City Filter - only shown if a state is selected */}
                        {filters.state && (
                            <div className="w-full md:w-48">
                                <select
                                    className="select select-bordered w-full"
                                    value={filters.city}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            city: e.target.value,
                                        })
                                    }
                                >
                                    <option value="">All Cities</option>
                                    {allCities
                                        .filter((city) =>
                                            initialProjects.some(
                                                (p) =>
                                                    p.state === filters.state &&
                                                    p.city === city
                                            )
                                        )
                                        .map((city) => (
                                            <option key={city} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        )}

                        {/* Reset Filters */}
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setFilters({
                                    category: "",
                                    type_of_project: "",
                                    country: "",
                                    state: "",
                                    city: "",
                                });
                            }}
                            className="btn btn-ghost"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="container mx-auto p-6">
                {/* Results Count */}
                <div className="mb-8">
                    <p className="text-base-content/70">
                        Showing{" "}
                        <span className="font-semibold">
                            {filteredProjects.length}
                        </span>{" "}
                        {filteredProjects.length === 1 ? "project" : "projects"}
                    </p>
                </div>

                {/* Project Cards */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects.length > 0 ? (
                        filteredProjects.map((project) => (
                            <div
                                key={project.id}
                                className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300 group"
                            >
                                {/* Image with badges */}
                                <figure className="relative h-56 overflow-hidden">
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

                                    {/* Organization Logo */}
                                    {project.organization_profile?.logo && (
                                        <div className="absolute bottom-2 right-2 w-16 h-16 rounded-full bg-base-100 p-1 shadow-md border border-base-200">
                                            <div className="avatar">
                                                <div className="w-full rounded-full">
                                                    <img
                                                        src={`/storage/${project.organization_profile.logo}`}
                                                        alt="Organization logo"
                                                    />
                                                </div>
                                            </div>
                                            {/* Verification Badge */}
                                            {project.organization_profile
                                                .verification?.status ===
                                                "Approved" && (
                                                <div className="absolute -top-1 -right-1">
                                                    <div className="badge badge-primary p-1">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Payment Type Badge */}
                                    <div className="absolute top-4 right-4">
                                        <div
                                            className={`badge ${
                                                project.type_of_project ===
                                                "Paid"
                                                    ? "badge-secondary"
                                                    : "badge-accent"
                                            }`}
                                        >
                                            {project.type_of_project === "Paid"
                                                ? "Paid"
                                                : "Free"}
                                        </div>
                                    </div>

                                    {/* Featured Badge */}
                                    {project.is_featured && (
                                        <div className="absolute top-4 left-4">
                                            <div className="badge badge-primary">
                                                Featured
                                            </div>
                                        </div>
                                    )}
                                </figure>

                                {/* Card Content */}
                                <div className="card-body">
                                    <h2 className="card-title group-hover:text-primary transition-colors">
                                        <Link
                                            href={route(
                                                "projects.home.view",
                                                project.slug
                                            )}
                                            className="hover:underline"
                                        >
                                            {project.title}
                                        </Link>
                                    </h2>

                                    {/* Category Tags */}
                                    <div className="flex flex-wrap gap-2">
                                        <div className="badge badge-outline">
                                            {project.category?.name}
                                        </div>
                                        {project.subcategory?.name && (
                                            <div className="badge badge-outline">
                                                {project.subcategory?.name}
                                            </div>
                                        )}
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-center text-sm text-base-content/70 mt-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                        {[
                                            project.city,
                                            project.state,
                                            project.country,
                                        ]
                                            .filter(Boolean)
                                            .join(", ") || "Multiple Locations"}
                                    </div>

                                    {/* Description */}
                                    <p className="text-base-content/80 line-clamp-3 my-4">
                                        {project.short_description}
                                    </p>

                                    {/* CTA */}
                                    <div className="card-actions justify-end">
                                        <Link
                                            href={route(
                                                "projects.home.view",
                                                project.slug
                                            )}
                                            className="btn btn-primary btn-sm"
                                        >
                                            View Details
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 ml-1"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
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
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <div className="text-base-content/30 mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-16 h-16 mx-auto"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium mb-2">
                                No projects found
                            </h3>
                            <p className="text-base-content/70 mb-4">
                                Try adjusting your search or filters
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setFilters({
                                        category: "",
                                        type_of_project: "",
                                        country: "",
                                        state: "",
                                        city: "",
                                    });
                                }}
                                className="btn btn-primary"
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
