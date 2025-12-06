import GeneralPages from "@/Layouts/GeneralPages";
import { Head } from "@inertiajs/react"; // Add this import
import { Link } from "@inertiajs/react";
import { useState } from "react";
import {
    Search,
    Filter,
    MapPin,
    Clock,
    Users,
    Award,
    Star,
    Building,
    Globe,
    Calendar,
    ChevronRight,
    X,
    TrendingUp,
    Heart,
    Target,
    Shield,
    Eye,
    Briefcase,
    DollarSign,
    CheckCircle,
    Sparkles,
    Building2,
    Navigation,
} from "lucide-react";

export default function Projects({
    projects: initialProjects,
    auth,
    organization_verification,
}) {
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [projects, setProjects] = useState(initialProjects);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        category: "",
        type_of_project: "",
        country: "",
        state: "",
        city: "",
    });
    const [activeFilters, setActiveFilters] = useState([]);

    // Get APP_URL for SEO
    const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    const currentUrl =
        typeof window !== "undefined" ? window.location.href : appUrl;

    // Page-specific SEO
    const pageTitle = "Volunteer Projects | Volunteer Faster";
    const pageDescription =
        "Browse meaningful volunteer projects worldwide. Find opportunities that match your skills, location, and interests on Volunteer Faster.";
    const pageKeywords =
        "volunteer projects, volunteering opportunities, volunteer work, community service, nonprofit projects, social impact";

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
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            project.organization_profile?.name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesCategory =
            !filters.category || project.category?.name === filters.category;

        const matchesPaymentType =
            !filters.type_of_project ||
            project.type_of_project?.toLowerCase() ===
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

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        if (key === "country") {
            newFilters.state = "";
            newFilters.city = "";
        }
        if (key === "state") {
            newFilters.city = "";
        }
        setFilters(newFilters);

        // Update active filters for display
        if (value) {
            setActiveFilters((prev) => [
                ...prev.filter((f) => f.key !== key),
                { key, value },
            ]);
        } else {
            setActiveFilters((prev) => prev.filter((f) => f.key !== key));
        }
    };

    const removeFilter = (key) => {
        handleFilterChange(key, "");
    };

    const resetFilters = () => {
        setSearchTerm("");
        setFilters({
            category: "",
            type_of_project: "",
            country: "",
            state: "",
            city: "",
        });
        setActiveFilters([]);
    };

    const getFilterLabel = (key, value) => {
        const labels = {
            category: `Category: ${value}`,
            type_of_project: `Type: ${value === "paid" ? "Paid" : "Free"}`,
            country: `Country: ${value}`,
            state: `State: ${value}`,
            city: `City: ${value}`,
        };
        return labels[key] || `${key}: ${value}`;
    };

    return (
        <>
            <Head>
                {/* Primary Meta Tags */}
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta name="keywords" content={pageKeywords} />
                <meta name="author" content="Volunteer Faster" />
                <meta name="robots" content="index, follow" />
                <meta name="language" content="English" />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content={currentUrl} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:image" content={`${appUrl}/hero.jpg`} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta
                    property="og:image:alt"
                    content="Volunteer Projects - Find Meaningful Opportunities"
                />
                <meta property="og:site_name" content="Volunteer Faster" />
                <meta property="og:locale" content="en_US" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={currentUrl} />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
                <meta name="twitter:image" content={`${appUrl}/hero.jpg`} />
                <meta name="twitter:site" content="@volunteerfaster" />
                <meta name="twitter:creator" content="@volunteerfaster" />
                <meta
                    name="twitter:image:alt"
                    content="Volunteer Projects - Find Meaningful Opportunities"
                />

                {/* Additional Meta Tags */}
                <link rel="canonical" href={currentUrl} />

                {/* Structured Data for SEO */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "CollectionPage",
                        name: pageTitle,
                        description: pageDescription,
                        url: currentUrl,
                        breadcrumb: {
                            "@type": "BreadcrumbList",
                            itemListElement: [
                                {
                                    "@type": "ListItem",
                                    position: 1,
                                    name: "Home",
                                    item: appUrl,
                                },
                                {
                                    "@type": "ListItem",
                                    position: 2,
                                    name: "Projects",
                                    item: currentUrl,
                                },
                            ],
                        },
                        mainEntity: {
                            "@type": "ItemList",
                            name: "Volunteer Opportunities",
                            description:
                                "Browse volunteer projects across different categories and locations",
                            numberOfItems: initialProjects.length,
                            itemListOrder:
                                "http://schema.org/ItemListOrderAscending",
                            itemListElement: initialProjects
                                .slice(0, 20)
                                .map((project, index) => ({
                                    "@type": "ListItem",
                                    position: index + 1,
                                    item: {
                                        "@type": "Event",
                                        name: project.title,
                                        description:
                                            project.short_description ||
                                            "Volunteer opportunity",
                                        eventStatus:
                                            "https://schema.org/EventScheduled",
                                        location: {
                                            "@type": "Place",
                                            name:
                                                project.location ||
                                                "Multiple Locations",
                                            address: {
                                                "@type": "PostalAddress",
                                                addressCountry: project.country,
                                                addressRegion: project.state,
                                                addressLocality: project.city,
                                            },
                                        },
                                        organizer: project.organization_profile
                                            ? {
                                                  "@type": "Organization",
                                                  name: project
                                                      .organization_profile
                                                      .name,
                                                  url: `${appUrl}/organization/${project.organization_profile.slug}`,
                                              }
                                            : null,
                                        url: `${appUrl}/projects/${project.slug}`,
                                        startDate: project.start_date,
                                        endDate: project.end_date,
                                    },
                                })),
                        },
                        publisher: {
                            "@type": "Organization",
                            name: "Volunteer Faster",
                            logo: `${appUrl}/logo.png`,
                            description: "Volunteer matching platform",
                        },
                        about: {
                            "@type": "Thing",
                            name: "Volunteer Opportunities",
                        },
                    })}
                </script>
            </Head>

            <GeneralPages auth={auth}>
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="container relative mx-auto px-4 py-20 lg:py-24">
                        <div className="max-w-3xl mx-auto text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
                                <Target className="w-10 h-10" />
                            </div>
                            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight">
                                Discover Impactful Volunteer Opportunities
                            </h1>
                            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                                Join meaningful projects that align with your
                                passions, skills, and create lasting positive
                                change worldwide.
                            </p>
                            <div className="flex flex-wrap justify-center gap-3">
                                <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <Users className="w-4 h-4 mr-2" />
                                    <span>
                                        {filteredProjects.length} Active
                                        Projects
                                    </span>
                                </div>
                                <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <Globe className="w-4 h-4 mr-2" />
                                    <span>{allCountries.length} Countries</span>
                                </div>
                                <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <Building2 className="w-4 h-4 mr-2" />
                                    <span>
                                        {
                                            new Set(
                                                initialProjects.map(
                                                    (p) =>
                                                        p.organization_profile
                                                            ?.id
                                                )
                                            ).size
                                        }{" "}
                                        Organizations
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="sticky top-[70px] z-40 bg-white shadow-md border-b border-gray-100">
                    <div className="container mx-auto px-4">
                        {/* Main Search - Better spacing on desktop */}
                        <div className="py-4 lg:py-6">
                            <div className="relative max-w-2xl mx-auto">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                <input
                                    type="text"
                                    className="w-full pl-10 sm:pl-12 pr-10 py-2.5 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg border border-gray-300 rounded-lg lg:rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                    placeholder="Search for projects, organizations, or causes..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Mobile Filter Toggle */}
                        <div className="lg:hidden py-2 border-t border-gray-100">
                            <button
                                onClick={() =>
                                    setIsMobileFiltersOpen(!isMobileFiltersOpen)
                                }
                                className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center">
                                    <Filter className="w-4 h-4 text-gray-500 mr-2" />
                                    <span className="text-sm font-medium text-gray-700">
                                        Filters ({activeFilters.length})
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {activeFilters.length > 0 && (
                                        <div className="flex items-center gap-1">
                                            {activeFilters
                                                .slice(0, 2)
                                                .map((filter, index) => (
                                                    <span
                                                        key={filter.key}
                                                        className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded"
                                                    >
                                                        {index === 1 &&
                                                        activeFilters.length > 2
                                                            ? `+${
                                                                  activeFilters.length -
                                                                  1
                                                              }`
                                                            : filter.key ===
                                                              "type_of_project"
                                                            ? filter.value ===
                                                              "paid"
                                                                ? "Paid"
                                                                : "Volunteer"
                                                            : filter.value.substring(
                                                                  0,
                                                                  8
                                                              )}
                                                        {index === 0 &&
                                                        activeFilters.length > 1
                                                            ? "..."
                                                            : ""}
                                                    </span>
                                                ))}
                                        </div>
                                    )}
                                    <ChevronRight
                                        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                                            isMobileFiltersOpen
                                                ? "rotate-90"
                                                : "rotate-0"
                                        }`}
                                    />
                                </div>
                            </button>
                        </div>

                        {/* Desktop Filter Controls - Improved layout */}
                        <div className="hidden lg:block border-t border-gray-100">
                            <div className="py-4">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-evenly gap-2">
                                    {/* Filter Label */}
                                    <div className="flex items-center">
                                        <Filter className="w-5 h-5 text-gray-500 mr-2" />
                                        <span className="text-base font-semibold text-gray-700">
                                            Filter by:
                                        </span>
                                    </div>

                                    {/* Filter Controls Row */}
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:flex-wrap gap-4">
                                        {/* First Row of Filters */}
                                        <div className="flex flex-wrap items-center gap-3">
                                            {/* Category Filter */}
                                            <div className="relative min-w-[180px]">
                                                <label className="sr-only">
                                                    Category
                                                </label>
                                                <select
                                                    className="w-full pl-4 pr-10 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 appearance-none"
                                                    value={filters.category}
                                                    onChange={(e) =>
                                                        handleFilterChange(
                                                            "category",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        All Categories
                                                    </option>
                                                    {categories.map(
                                                        (category) => (
                                                            <option
                                                                key={category}
                                                                value={category}
                                                            >
                                                                {category}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                                <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none w-4 h-4 text-gray-400 rotate-90" />
                                            </div>

                                            {/* Payment Type Filter */}
                                            <div className="relative min-w-[160px]">
                                                <label className="sr-only">
                                                    Project Type
                                                </label>
                                                <select
                                                    className="w-full pl-4 pr-10 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 appearance-none"
                                                    value={
                                                        filters.type_of_project
                                                    }
                                                    onChange={(e) =>
                                                        handleFilterChange(
                                                            "type_of_project",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        Project Type
                                                    </option>
                                                    <option value="paid">
                                                        Paid Opportunities
                                                    </option>
                                                    <option value="free">
                                                        Volunteer Positions
                                                    </option>
                                                </select>
                                                <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            </div>
                                        </div>

                                        {/* Location Filters Row */}
                                        <div className="flex flex-wrap items-center gap-3">
                                            {/* Country Filter */}
                                            <div className="relative min-w-[180px]">
                                                <label className="sr-only">
                                                    Country
                                                </label>
                                                <select
                                                    className="w-full pl-4 pr-10 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 appearance-none"
                                                    value={filters.country}
                                                    onChange={(e) =>
                                                        handleFilterChange(
                                                            "country",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        Select Country
                                                    </option>
                                                    {allCountries.map(
                                                        (country) => (
                                                            <option
                                                                key={country}
                                                                value={country}
                                                            >
                                                                {country}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                                <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            </div>

                                            {/* State Filter (Conditional) */}
                                            {filters.country && (
                                                <div className="relative min-w-[160px]">
                                                    <label className="sr-only">
                                                        State/Region
                                                    </label>
                                                    <select
                                                        className="w-full pl-4 pr-10 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 appearance-none"
                                                        value={filters.state}
                                                        onChange={(e) =>
                                                            handleFilterChange(
                                                                "state",
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option value="">
                                                            State/Region
                                                        </option>
                                                        {allStates
                                                            .filter((state) =>
                                                                initialProjects.some(
                                                                    (p) =>
                                                                        p.country ===
                                                                            filters.country &&
                                                                        p.state ===
                                                                            state
                                                                )
                                                            )
                                                            .map((state) => (
                                                                <option
                                                                    key={state}
                                                                    value={
                                                                        state
                                                                    }
                                                                >
                                                                    {state}
                                                                </option>
                                                            ))}
                                                    </select>
                                                    <Navigation className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                </div>
                                            )}

                                            {/* City Filter (Conditional) */}
                                            {filters.state && (
                                                <div className="relative min-w-[160px]">
                                                    <label className="sr-only">
                                                        City
                                                    </label>
                                                    <select
                                                        className="w-full pl-4 pr-10 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 appearance-none"
                                                        value={filters.city}
                                                        onChange={(e) =>
                                                            handleFilterChange(
                                                                "city",
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option value="">
                                                            City
                                                        </option>
                                                        {allCities
                                                            .filter((city) =>
                                                                initialProjects.some(
                                                                    (p) =>
                                                                        p.state ===
                                                                            filters.state &&
                                                                        p.city ===
                                                                            city
                                                                )
                                                            )
                                                            .map((city) => (
                                                                <option
                                                                    key={city}
                                                                    value={city}
                                                                >
                                                                    {city}
                                                                </option>
                                                            ))}
                                                    </select>
                                                    <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Clear Button */}
                                        {activeFilters.length > 0 && (
                                            <div className="flex items-center">
                                                <button
                                                    onClick={resetFilters}
                                                    className="px-4 py-2.5 text-sm text-red-600 hover:text-red-800 font-medium flex items-center gap-2 border border-red-200 hover:border-red-300 rounded-lg transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                    Clear Filters
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Active Filters Display - Desktop */}
                            {activeFilters.length > 0 && (
                                <div className="py-3 border-t border-gray-100">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-sm font-medium text-gray-700">
                                            Active filters:
                                        </span>
                                        {activeFilters.map((filter) => (
                                            <div
                                                key={filter.key}
                                                className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm"
                                            >
                                                <span className="font-medium">
                                                    {getFilterLabel(
                                                        filter.key,
                                                        filter.value
                                                    )}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        removeFilter(filter.key)
                                                    }
                                                    className="ml-2 hover:text-blue-900 p-0.5"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                        {activeFilters.length > 0 && (
                                            <button
                                                onClick={resetFilters}
                                                className="text-sm text-red-600 hover:text-red-800 font-medium ml-2"
                                            >
                                                Clear all
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile Filter Controls */}
                        <div
                            className={`
            ${isMobileFiltersOpen ? "block" : "hidden"}
            lg:hidden border-t border-gray-100
        `}
                        >
                            {/* Mobile Filter Header */}
                            <div className="py-3 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-base font-semibold text-gray-900">
                                        Filters
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        {activeFilters.length > 0 && (
                                            <button
                                                onClick={resetFilters}
                                                className="text-sm text-red-600 hover:text-red-800 font-medium px-2 py-1"
                                            >
                                                Clear all
                                            </button>
                                        )}
                                        <button
                                            onClick={() =>
                                                setIsMobileFiltersOpen(false)
                                            }
                                            className="text-gray-500 hover:text-gray-700 p-1"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Filter Grid */}
                            <div className="py-4">
                                <div className="grid grid-cols-1 gap-4">
                                    {/* Category Filter */}
                                    <div className="relative">
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Category
                                        </label>
                                        <select
                                            className="w-full pl-4 pr-10 py-3 text-sm bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 appearance-none"
                                            value={filters.category}
                                            onChange={(e) =>
                                                handleFilterChange(
                                                    "category",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="">
                                                All Categories
                                            </option>
                                            {categories.map((category) => (
                                                <option
                                                    key={category}
                                                    value={category}
                                                >
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none w-4 h-4 text-gray-400 rotate-90" />
                                    </div>

                                    {/* Payment Type Filter */}
                                    <div className="relative">
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Project Type
                                        </label>
                                        <select
                                            className="w-full pl-4 pr-10 py-3 text-sm bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 appearance-none"
                                            value={filters.type_of_project}
                                            onChange={(e) =>
                                                handleFilterChange(
                                                    "type_of_project",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="">
                                                Project Type
                                            </option>
                                            <option value="paid">
                                                Paid Opportunities
                                            </option>
                                            <option value="free">
                                                Volunteer Positions
                                            </option>
                                        </select>
                                        <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    </div>

                                    {/* Location Filters */}
                                    <div className="space-y-4">
                                        {/* Country Filter */}
                                        <div className="relative">
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Country
                                            </label>
                                            <select
                                                className="w-full pl-4 pr-10 py-3 text-sm bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 appearance-none"
                                                value={filters.country}
                                                onChange={(e) =>
                                                    handleFilterChange(
                                                        "country",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Select Country
                                                </option>
                                                {allCountries.map((country) => (
                                                    <option
                                                        key={country}
                                                        value={country}
                                                    >
                                                        {country}
                                                    </option>
                                                ))}
                                            </select>
                                            <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>

                                        {/* State Filter (Conditional) */}
                                        {filters.country && (
                                            <div className="relative">
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    State/Region
                                                </label>
                                                <select
                                                    className="w-full pl-4 pr-10 py-3 text-sm bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 appearance-none"
                                                    value={filters.state}
                                                    onChange={(e) =>
                                                        handleFilterChange(
                                                            "state",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        Select State/Region
                                                    </option>
                                                    {allStates
                                                        .filter((state) =>
                                                            initialProjects.some(
                                                                (p) =>
                                                                    p.country ===
                                                                        filters.country &&
                                                                    p.state ===
                                                                        state
                                                            )
                                                        )
                                                        .map((state) => (
                                                            <option
                                                                key={state}
                                                                value={state}
                                                            >
                                                                {state}
                                                            </option>
                                                        ))}
                                                </select>
                                                <Navigation className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            </div>
                                        )}

                                        {/* City Filter (Conditional) */}
                                        {filters.state && (
                                            <div className="relative">
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    City
                                                </label>
                                                <select
                                                    className="w-full pl-4 pr-10 py-3 text-sm bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 appearance-none"
                                                    value={filters.city}
                                                    onChange={(e) =>
                                                        handleFilterChange(
                                                            "city",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        Select City
                                                    </option>
                                                    {allCities
                                                        .filter((city) =>
                                                            initialProjects.some(
                                                                (p) =>
                                                                    p.state ===
                                                                        filters.state &&
                                                                    p.city ===
                                                                        city
                                                            )
                                                        )
                                                        .map((city) => (
                                                            <option
                                                                key={city}
                                                                value={city}
                                                            >
                                                                {city}
                                                            </option>
                                                        ))}
                                                </select>
                                                <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Mobile Action Buttons */}
                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() =>
                                                setIsMobileFiltersOpen(false)
                                            }
                                            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                                        >
                                            Apply Filters
                                        </button>
                                        {activeFilters.length > 0 && (
                                            <button
                                                onClick={resetFilters}
                                                className="flex-1 px-4 py-3 text-gray-700 text-sm font-medium border border-gray-300 rounded-lg hover:border-red-300 hover:text-red-600 transition-colors"
                                            >
                                                Clear All
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results and Projects Grid */}
                <div className="container mx-auto px-4 py-8">
                    {/* Results Header */}
                    <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Available Opportunities
                            </h2>
                            <p className="text-gray-600">
                                Found{" "}
                                <span className="font-bold text-blue-600">
                                    {filteredProjects.length}
                                </span>{" "}
                                projects matching your criteria
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center text-gray-600">
                                <Eye className="w-5 h-5 mr-2" />
                                <span>
                                    Showing {filteredProjects.length} of{" "}
                                    {initialProjects.length} total
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Projects Grid */}
                    {filteredProjects.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredProjects.map((project) => (
                                <div
                                    key={project.id}
                                    className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:border-blue-200 transition-all duration-300"
                                >
                                    {/* Image Section */}
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            src={
                                                project.featured_image
                                                    ? `/storage/${project.featured_image}`
                                                    : "/images/placeholder.jpg"
                                            }
                                            alt={`${project.title} - Volunteer project at Volunteer Faster`}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                                        {/* Organization Badge */}
                                        {project.organization_profile?.logo && (
                                            <div className="absolute bottom-3 right-3">
                                                <div className="relative">
                                                    <div className="w-14 h-14 rounded-xl bg-white p-1.5 shadow-lg">
                                                        <img
                                                            src={`/storage/${project.organization_profile.logo}`}
                                                            alt={
                                                                project
                                                                    .organization_profile
                                                                    .name
                                                            }
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                    </div>
                                                    {project
                                                        .organization_profile
                                                        .verification
                                                        ?.status ===
                                                        "Approved" && (
                                                        <div className="absolute -top-2 -right-2">
                                                            <div className="bg-green-500 text-white p-1 rounded-full">
                                                                <Shield className="w-4 h-4" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Project Type Badge */}
                                        <div className="absolute top-4 left-4">
                                            <div
                                                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                                                    project.type_of_project ===
                                                    "Paid"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-blue-100 text-blue-800"
                                                }`}
                                            >
                                                {project.type_of_project ===
                                                "Paid" ? (
                                                    <>
                                                        <DollarSign className="w-4 h-4 mr-1" />
                                                        Paid
                                                    </>
                                                ) : (
                                                    <>
                                                        <Heart className="w-4 h-4 mr-1" />
                                                        Volunteer
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Featured Badge */}
                                        {project.is_featured && (
                                            <div className="absolute top-4 right-4">
                                                <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-sm font-medium">
                                                    <Star className="w-4 h-4 mr-1" />
                                                    Featured
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-6">
                                        {/* Category Tags */}
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {project.category?.name && (
                                                <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                                                    {project.category.name}
                                                </span>
                                            )}
                                            {project.subcategory?.name && (
                                                <span className="inline-flex items-center px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                                                    {project.subcategory.name}
                                                </span>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
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

                                        {/* Organization Name */}
                                        {project.organization_profile?.name && (
                                            <div className="flex items-center text-gray-600 mb-4">
                                                <Building className="w-4 h-4 mr-2" />
                                                <span className="text-sm font-medium">
                                                    {
                                                        project
                                                            .organization_profile
                                                            .name
                                                    }
                                                </span>
                                            </div>
                                        )}

                                        {/* Location */}
                                        <div className="flex items-center text-gray-600 mb-4">
                                            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                                            <span className="text-sm truncate">
                                                {[
                                                    project.city,
                                                    project.state,
                                                    project.country,
                                                ]
                                                    .filter(Boolean)
                                                    .join(", ") ||
                                                    "Multiple Locations"}
                                            </span>
                                        </div>

                                        {/* Description */}
                                        <p className="text-gray-700 mb-6 line-clamp-3 text-sm leading-relaxed">
                                            {project.short_description}
                                        </p>

                                        {/* Stats and CTA */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                {project.duration && (
                                                    <div className="flex items-center">
                                                        <Clock className="w-4 h-4 mr-1" />
                                                        <span>
                                                            {project.duration}
                                                        </span>
                                                    </div>
                                                )}
                                                {project.volunteers_needed && (
                                                    <div className="flex items-center">
                                                        <Users className="w-4 h-4 mr-1" />
                                                        <span>
                                                            {
                                                                project.volunteers_needed
                                                            }{" "}
                                                            needed
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <Link
                                                href={route(
                                                    "projects.home.view",
                                                    project.slug
                                                )}
                                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 group/btn"
                                            >
                                                View Details
                                                <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* No Results State */
                        <div className="max-w-md mx-auto text-center py-16">
                            <div className="mb-6">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                                    <Target className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    No projects found
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Try adjusting your search criteria or
                                    filters to find more opportunities.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <button
                                    onClick={resetFilters}
                                    className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                                >
                                    Clear All Filters
                                </button>
                                <div className="text-sm text-gray-500">
                                    Or browse{" "}
                                    <Link
                                        href="/projects"
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        all projects
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quick Tips Section */}
                    {filteredProjects.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <div className="flex items-center justify-center mb-6">
                                <Sparkles className="w-6 h-6 text-blue-600 mr-3" />
                                <h3 className="text-xl font-bold text-gray-900">
                                    Finding the Right Opportunity
                                </h3>
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-blue-50 rounded-xl p-5">
                                    <div className="flex items-center mb-3">
                                        <Briefcase className="w-5 h-5 text-blue-600 mr-3" />
                                        <h4 className="font-semibold text-gray-900">
                                            Match Your Skills
                                        </h4>
                                    </div>
                                    <p className="text-gray-700 text-sm">
                                        Look for projects that align with your
                                        expertise and interests for maximum
                                        impact.
                                    </p>
                                </div>
                                <div className="bg-blue-50 rounded-xl p-5">
                                    <div className="flex items-center mb-3">
                                        <CheckCircle className="w-5 h-5 text-blue-600 mr-3" />
                                        <h4 className="font-semibold text-gray-900">
                                            Verify Organizations
                                        </h4>
                                    </div>
                                    <p className="text-gray-700 text-sm">
                                        Check for verified organization badges
                                        to ensure credibility and safety.
                                    </p>
                                </div>
                                <div className="bg-blue-50 rounded-xl p-5">
                                    <div className="flex items-center mb-3">
                                        <Award className="w-5 h-5 text-blue-600 mr-3" />
                                        <h4 className="font-semibold text-gray-900">
                                            Earn Recognition
                                        </h4>
                                    </div>
                                    <p className="text-gray-700 text-sm">
                                        Complete projects to earn points and
                                        certificates for your volunteer work.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SEO Meta Information */}
                    <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                        <p className="text-sm text-gray-600">
                            Volunteer Faster connects volunteers with{" "}
                            {initialProjects.length}+ projects across{" "}
                            {allCountries.length} countries. Find opportunities
                            in education, healthcare, environment, animal
                            welfare, and more.
                        </p>
                    </div>
                </div>
            </GeneralPages>
        </>
    );
}
