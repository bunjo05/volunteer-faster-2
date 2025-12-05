import AdminLayout from "@/Layouts/AdminLayout";
import { usePage, router } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import {
    CalendarDays,
    Clock,
    DollarSign,
    Globe,
    Users,
    Search,
    Filter,
    TrendingUp,
    Eye,
    Edit,
    Trash2,
    Plus,
    Building,
    Award,
    TrendingUp as TrendingUpIcon,
    Download,
    MoreVertical,
    MapPin,
    UserCheck,
    Shield,
} from "lucide-react";
import { useState } from "react";

export default function Projects() {
    const { projects = [] } = usePage().props;
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [viewMode, setViewMode] = useState("grid");

    // Filter projects
    const filteredProjects = projects.filter((project) => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            project.title.toLowerCase().includes(searchLower) ||
            project.short_description?.toLowerCase().includes(searchLower) ||
            project.organization_profile?.name
                ?.toLowerCase()
                .includes(searchLower) ||
            project.country?.toLowerCase().includes(searchLower);

        const matchesStatus =
            statusFilter === "all" || project.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Sort projects
    const sortedProjects = [...filteredProjects].sort((a, b) => {
        if (sortBy === "newest") {
            return new Date(b.created_at) - new Date(a.created_at);
        } else if (sortBy === "oldest") {
            return new Date(a.created_at) - new Date(b.created_at);
        } else if (sortBy === "name-asc") {
            return a.title.localeCompare(b.title);
        } else if (sortBy === "name-desc") {
            return b.title.localeCompare(a.title);
        } else if (sortBy === "featured") {
            return (b.featured === 1 ? 1 : 0) - (a.featured === 1 ? 1 : 0);
        }
        return 0;
    });

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "active":
                return "text-green-700 bg-green-50 border-green-200";
            case "pending":
                return "text-amber-700 bg-amber-50 border-amber-200";
            case "draft":
                return "text-gray-700 bg-gray-50 border-gray-200";
            case "completed":
                return "text-blue-700 bg-blue-50 border-blue-200";
            default:
                return "text-gray-700 bg-gray-50 border-gray-200";
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "active":
                return <TrendingUpIcon className="w-4 h-4" />;
            case "pending":
                return <Clock className="w-4 h-4" />;
            case "draft":
                return <Edit className="w-4 h-4" />;
            case "completed":
                return <Award className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const handleDeleteProject = (projectId) => {
        if (
            confirm(
                "Are you sure you want to delete this project? This action cannot be undone."
            )
        ) {
            router.delete(`/admin/projects/${projectId}`);
        }
    };

    // Statistics
    const stats = {
        total: projects.length,
        active: projects.filter((p) => p.status === "Active").length,
        pending: projects.filter((p) => p.status === "Pending").length,
        featured: projects.filter((p) => p.featured === 1).length,
        forReview: projects.filter(
            (p) => p.request_for_approval === 1 && p.status === "Pending"
        ).length,
    };

    return (
        <AdminLayout>
            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                Projects Management
                            </h1>
                            <p className="text-sm md:text-base text-gray-600 mt-1">
                                Manage and monitor all volunteer projects
                            </p>
                        </div>
                        {/* <div className="flex items-center gap-3">
                            <Link
                                href={route("admin.projects.create")}
                                className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                    New Project
                                </span>
                                <span className="sm:hidden">Add</span>
                            </Link>
                        </div> */}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Total Projects
                                </p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {stats.total}
                                </p>
                            </div>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Award className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Active</p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {stats.active}
                                </p>
                            </div>
                            <div className="p-2 bg-green-50 rounded-lg">
                                <TrendingUpIcon className="h-5 w-5 text-green-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    For Review
                                </p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {stats.forReview}
                                </p>
                            </div>
                            <div className="p-2 bg-amber-50 rounded-lg">
                                <Shield className="h-5 w-5 text-amber-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Featured
                                </p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {stats.featured}
                                </p>
                            </div>
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <Award className="h-5 w-5 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search projects by title, description, organization, or location..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                    className="w-full sm:w-auto pl-10 pr-8 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
                                >
                                    <option value="all">All Status</option>
                                    <option value="Active">Active</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Draft">Draft</option>
                                    <option value="Completed">Completed</option>
                                </select>
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            </div>
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full sm:w-auto pl-10 pr-8 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="name-asc">
                                        Title (A-Z)
                                    </option>
                                    <option value="name-desc">
                                        Title (Z-A)
                                    </option>
                                    <option value="featured">
                                        Featured First
                                    </option>
                                </select>
                                <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Projects Grid/List View */}
                {sortedProjects.length > 0 ? (
                    viewMode === "grid" ? (
                        /* Grid View */
                        <div className="grid gap-4 md:gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                            {sortedProjects.map((project) => (
                                <div
                                    key={project.id}
                                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col"
                                >
                                    {/* Image with badges */}
                                    <div className="relative h-48">
                                        <img
                                            src={
                                                project.featured_image
                                                    ? `/storage/${project.featured_image}`
                                                    : "/images/placeholder.jpg"
                                            }
                                            alt={project.title}
                                            className="object-cover w-full h-full"
                                        />
                                        <div className="absolute top-3 right-3 flex flex-col gap-2">
                                            {project.request_for_approval ===
                                                1 &&
                                                project.status ===
                                                    "Pending" && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded shadow">
                                                        <Shield className="w-3 h-3" />
                                                        For Review
                                                    </span>
                                                )}
                                            {project.featured === 1 && (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500 text-white text-xs font-medium rounded shadow">
                                                    <Award className="w-3 h-3" />
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-4 flex-1 flex flex-col">
                                        {/* Title and Organization */}
                                        <div className="mb-3">
                                            <Link
                                                className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                                                href={route(
                                                    "admin.projects.view",
                                                    project.slug
                                                )}
                                            >
                                                {project.title}
                                            </Link>
                                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                                                <Building className="w-4 h-4" />
                                                <span className="truncate">
                                                    {project
                                                        .organization_profile
                                                        ?.name ||
                                                        "No organization"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
                                            {project.short_description ||
                                                "No description available"}
                                        </p>

                                        {/* Quick Info Badges */}
                                        <div className="grid grid-cols-2 gap-2 mb-4">
                                            {project.duration && (
                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                    <Clock className="w-3 h-3" />
                                                    <span>
                                                        {project.duration}
                                                    </span>
                                                </div>
                                            )}
                                            {project.start_date && (
                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                    <CalendarDays className="w-3 h-3" />
                                                    <span>
                                                        {new Date(
                                                            project.start_date
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            )}
                                            {project.fees && (
                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                    <DollarSign className="w-3 h-3" />
                                                    <span>
                                                        {project.fees}{" "}
                                                        {project.currency}
                                                    </span>
                                                </div>
                                            )}
                                            {project.country && (
                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                    <MapPin className="w-3 h-3" />
                                                    <span>
                                                        {project.country}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Suitable Tags */}
                                        {Array.isArray(project.suitable) &&
                                            project.suitable.length > 0 && (
                                                <div className="mb-4">
                                                    <p className="text-xs text-gray-500 font-medium mb-1">
                                                        Suitable For:
                                                    </p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {project.suitable
                                                            .slice(0, 3)
                                                            .map(
                                                                (item, idx) => (
                                                                    <span
                                                                        key={
                                                                            idx
                                                                        }
                                                                        className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs"
                                                                    >
                                                                        {item}
                                                                    </span>
                                                                )
                                                            )}
                                                        {project.suitable
                                                            .length > 3 && (
                                                            <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-xs">
                                                                +
                                                                {project
                                                                    .suitable
                                                                    .length -
                                                                    3}{" "}
                                                                more
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                        {/* Footer */}
                                        <div className="mt-auto pt-4 border-t border-gray-100">
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                        project.status
                                                    )}`}
                                                >
                                                    {getStatusIcon(
                                                        project.status
                                                    )}
                                                    {project.status}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <Link
                                                        href={route(
                                                            "admin.projects.view",
                                                            project.slug
                                                        )}
                                                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteProject(
                                                                project.id
                                                            )
                                                        }
                                                        className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* List View */
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                                Project
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden md:table-cell">
                                                Organization
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden lg:table-cell">
                                                Location
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {sortedProjects.map((project) => (
                                            <tr
                                                key={project.id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                                            <img
                                                                src={
                                                                    project.featured_image
                                                                        ? `/storage/${project.featured_image}`
                                                                        : "/images/placeholder.jpg"
                                                                }
                                                                alt={
                                                                    project.title
                                                                }
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Link
                                                                href={route(
                                                                    "admin.projects.view",
                                                                    project.slug
                                                                )}
                                                                className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                                                            >
                                                                {project.title}
                                                            </Link>
                                                            <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                                                                {project.short_description ||
                                                                    "No description"}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                {project.fees && (
                                                                    <span className="text-xs text-gray-600 flex items-center gap-1">
                                                                        <DollarSign className="w-3 h-3" />
                                                                        {
                                                                            project.fees
                                                                        }{" "}
                                                                        {
                                                                            project.currency
                                                                        }
                                                                    </span>
                                                                )}
                                                                {project.duration && (
                                                                    <span className="text-xs text-gray-600 flex items-center gap-1">
                                                                        <Clock className="w-3 h-3" />
                                                                        {
                                                                            project.duration
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 hidden md:table-cell">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Building className="w-4 h-4" />
                                                        <span>
                                                            {project
                                                                .organization_profile
                                                                ?.name ||
                                                                "No organization"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 hidden lg:table-cell">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>
                                                            {project.country ||
                                                                "Not specified"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span
                                                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                                project.status
                                                            )}`}
                                                        >
                                                            {getStatusIcon(
                                                                project.status
                                                            )}
                                                            {project.status}
                                                        </span>
                                                        {project.request_for_approval ===
                                                            1 &&
                                                            project.status ===
                                                                "Pending" && (
                                                                <span className="text-xs text-amber-600 flex items-center gap-1">
                                                                    <Shield className="w-3 h-3" />
                                                                    Needs Review
                                                                </span>
                                                            )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Link
                                                            href={route(
                                                                "admin.projects.view",
                                                                project.slug
                                                            )}
                                                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Link>
                                                        <Link
                                                            href={route(
                                                                "admin.projects.edit",
                                                                project.slug
                                                            )}
                                                            className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteProject(
                                                                    project.id
                                                                )
                                                            }
                                                            className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                ) : (
                    /* Empty State */
                    <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 text-center">
                        <div className="mx-auto max-w-md">
                            <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No projects found
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                {searchTerm || statusFilter !== "all"
                                    ? "Try adjusting your search or filter criteria"
                                    : "Get started by creating your first project"}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link
                                    href={route("admin.projects.create")}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition-colors"
                                >
                                    <Plus className="h-4 w-4" />
                                    Create Project
                                </Link>
                                {(searchTerm || statusFilter !== "all") && (
                                    <button
                                        onClick={() => {
                                            setSearchTerm("");
                                            setStatusFilter("all");
                                        }}
                                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg shadow-sm transition-colors"
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {sortedProjects.length > 0 && (
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-600">
                            Showing{" "}
                            <span className="font-medium">
                                1-{Math.min(12, sortedProjects.length)}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium">
                                {sortedProjects.length}
                            </span>{" "}
                            projects
                        </p>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                Previous
                            </button>
                            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
