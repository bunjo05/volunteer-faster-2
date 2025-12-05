import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Search,
    Filter,
    ChevronDown,
    ChevronUp,
    Plus,
    X,
    Globe,
    Phone,
    Mail,
    Calendar,
    Link as LinkIcon,
    Users,
    CheckCircle,
    Clock,
    Eye,
    Edit,
    Trash2,
    MoreVertical,
    Building,
    MapPin,
    ExternalLink,
    UserPlus,
    TrendingUp,
} from "lucide-react";

import { usePage } from "@inertiajs/react";
import { Link, router } from "@inertiajs/react";

export default function Index({ organizations, verifications }) {
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

    const closeModal = () => setSelectedOrg(null);

    const handleDeleteOrg = (orgId) => {
        if (
            confirm(
                "Are you sure you want to delete this organization? This action cannot be undone."
            )
        ) {
            router.delete(`/admin/organizations/${orgId}`);
        }
    };

    // Filter organizations based on search and filters
    const filteredOrgs = organizations.filter((org) => {
        const matchesSearch =
            org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (org.description &&
                org.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())) ||
            (org.city &&
                org.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (org.country &&
                org.country.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus =
            statusFilter === "all" ||
            org.status?.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    // Sort organizations
    const sortedOrgs = [...filteredOrgs].sort((a, b) => {
        if (sortBy === "newest") {
            return new Date(b.created_at) - new Date(a.created_at);
        } else if (sortBy === "oldest") {
            return new Date(a.created_at) - new Date(b.created_at);
        } else if (sortBy === "name-asc") {
            return a.name.localeCompare(b.name);
        } else if (sortBy === "name-desc") {
            return b.name.localeCompare(a.name);
        }
        return 0;
    });

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "approved":
                return "text-green-700 bg-green-50 border-green-200";
            case "pending":
                return "text-amber-700 bg-amber-50 border-amber-200";
            case "rejected":
                return "text-red-700 bg-red-50 border-red-200";
            default:
                return "text-gray-700 bg-gray-50 border-gray-200";
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "approved":
                return <CheckCircle className="w-4 h-4" />;
            case "pending":
                return <Clock className="w-4 h-4" />;
            case "rejected":
                return <X className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    // Statistics
    const stats = {
        total: organizations.length,
        approved: organizations.filter((o) => o.status === "Approved").length,
        pending: organizations.filter((o) => o.status === "Pending").length,
        rejected: organizations.filter((o) => o.status === "Rejected").length,
        verified: verifications.filter((v) => v.status === "Approved").length,
    };

    return (
        <AdminLayout>
            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                Organizations
                            </h1>
                            <p className="text-sm md:text-base text-gray-600 mt-1">
                                Manage and monitor all registered organizations
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded-lg ${
                                        viewMode === "grid"
                                            ? "bg-blue-50 text-blue-600"
                                            : "text-gray-500 hover:bg-gray-100"
                                    }`}
                                >
                                    <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                                        <div
                                            className={`${
                                                viewMode === "grid"
                                                    ? "bg-blue-600"
                                                    : "bg-gray-400"
                                            }`}
                                        ></div>
                                        <div
                                            className={`${
                                                viewMode === "grid"
                                                    ? "bg-blue-600"
                                                    : "bg-gray-400"
                                            }`}
                                        ></div>
                                        <div
                                            className={`${
                                                viewMode === "grid"
                                                    ? "bg-blue-600"
                                                    : "bg-gray-400"
                                            }`}
                                        ></div>
                                        <div
                                            className={`${
                                                viewMode === "grid"
                                                    ? "bg-blue-600"
                                                    : "bg-gray-400"
                                            }`}
                                        ></div>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded-lg ${
                                        viewMode === "list"
                                            ? "bg-blue-50 text-blue-600"
                                            : "text-gray-500 hover:bg-gray-100"
                                    }`}
                                >
                                    <div className="flex flex-col gap-0.5 w-4 h-4">
                                        <div
                                            className={`h-1 w-full ${
                                                viewMode === "list"
                                                    ? "bg-blue-600"
                                                    : "bg-gray-400"
                                            }`}
                                        ></div>
                                        <div
                                            className={`h-1 w-full ${
                                                viewMode === "list"
                                                    ? "bg-blue-600"
                                                    : "bg-gray-400"
                                            }`}
                                        ></div>
                                        <div
                                            className={`h-1 w-full ${
                                                viewMode === "list"
                                                    ? "bg-blue-600"
                                                    : "bg-gray-400"
                                            }`}
                                        ></div>
                                    </div>
                                </button>
                            </div>
                            <button className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition-colors">
                                <Plus className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                    Add Organization
                                </span>
                                <span className="sm:hidden">Add</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Total Organizations
                                </p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {stats.total}
                                </p>
                            </div>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Building className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Approved
                                </p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {stats.approved}
                                </p>
                            </div>
                            <div className="p-2 bg-green-50 rounded-lg">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {stats.pending}
                                </p>
                            </div>
                            <div className="p-2 bg-amber-50 rounded-lg">
                                <Clock className="h-5 w-5 text-amber-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Verified
                                </p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {stats.verified}
                                </p>
                            </div>
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <UserPlus className="h-5 w-5 text-purple-600" />
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
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder="Search organizations by name, description, or location..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                                    <option value="approved">Approved</option>
                                    <option value="pending">Pending</option>
                                    <option value="rejected">Rejected</option>
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
                                    <option value="name-asc">Name (A-Z)</option>
                                    <option value="name-desc">
                                        Name (Z-A)
                                    </option>
                                </select>
                                <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Organizations Grid/List View */}
                {sortedOrgs.length > 0 ? (
                    viewMode === "grid" ? (
                        /* Grid View */
                        <div className="grid gap-4 md:gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                            {sortedOrgs.map((org) => (
                                <div
                                    key={org.id}
                                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col"
                                >
                                    {/* Header with image */}
                                    <div className="relative h-40">
                                        <img
                                            src={
                                                org.logo
                                                    ? `/storage/${org.logo}`
                                                    : "/images/default-org.jpg"
                                            }
                                            alt={org.name}
                                            className="object-cover w-full h-full"
                                        />
                                        <div className="absolute top-3 right-3">
                                            <span
                                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                                    org.status
                                                )}`}
                                            >
                                                {getStatusIcon(org.status)}
                                                {org.status}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                                            <h2 className="text-lg font-bold text-white line-clamp-1">
                                                {org.name}
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="p-4 flex-1 flex flex-col">
                                        {/* Location and basic info */}
                                        <div className="mb-3">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                                <MapPin className="w-4 h-4" />
                                                <span>
                                                    {org.city}, {org.country}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {org.description ||
                                                    "No description provided."}
                                            </p>
                                        </div>

                                        {/* Contact info (collapsed on mobile) */}
                                        <div className="mt-auto pt-3 border-t border-gray-100">
                                            <div className="hidden sm:flex flex-col gap-2 mb-3">
                                                {org.email && (
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <Mail className="w-3 h-3" />
                                                        <span className="truncate">
                                                            {org.email}
                                                        </span>
                                                    </div>
                                                )}
                                                {org.website && (
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <ExternalLink className="w-3 h-3" />
                                                        <span className="truncate">
                                                            {org.website.replace(
                                                                /^https?:\/\//,
                                                                ""
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center justify-between">
                                                <Link
                                                    href={route(
                                                        "admin.organizations.view",
                                                        org.slug
                                                    )}
                                                    className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                >
                                                    View Details
                                                    <ExternalLink className="w-3 h-3" />
                                                </Link>
                                                <div className="flex items-center gap-1">
                                                    <button className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteOrg(
                                                                org.id
                                                            )
                                                        }
                                                        className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                                                Organization
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden md:table-cell">
                                                Location
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden lg:table-cell">
                                                Contact
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
                                        {sortedOrgs.map((org) => (
                                            <tr
                                                key={org.id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center overflow-hidden">
                                                            <img
                                                                src={
                                                                    org.logo
                                                                        ? `/storage/${org.logo}`
                                                                        : "/images/default-org.jpg"
                                                                }
                                                                alt={org.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {org.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500 line-clamp-1">
                                                                {org.description ||
                                                                    "No description"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 hidden md:table-cell">
                                                    <div className="flex items-center gap-2 text-gray-700">
                                                        <MapPin className="w-4 h-4" />
                                                        <span className="text-sm">
                                                            {org.city},{" "}
                                                            {org.country}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 hidden lg:table-cell">
                                                    <div className="space-y-1">
                                                        {org.email && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <Mail className="w-3 h-3" />
                                                                <span className="truncate">
                                                                    {org.email}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {org.phone && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <Phone className="w-3 h-3" />
                                                                <span>
                                                                    {org.phone}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                            org.status
                                                        )}`}
                                                    >
                                                        {getStatusIcon(
                                                            org.status
                                                        )}
                                                        {org.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-1.5 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteOrg(
                                                                    org.id
                                                                )
                                                            }
                                                            className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                            <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No organizations found
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                {searchQuery || statusFilter !== "all"
                                    ? "Try adjusting your search or filter criteria"
                                    : "Get started by adding a new organization"}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition-colors">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Organization
                                </button>
                                {(searchQuery || statusFilter !== "all") && (
                                    <button
                                        onClick={() => {
                                            setSearchQuery("");
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

                {/* Organization Details Modal */}
                {selectedOrg && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6 overflow-auto">
                        <div className="bg-white rounded-xl w-full max-w-lg sm:max-w-3xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Organization Details
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="flex flex-col sm:flex-row gap-6">
                                    <div className="w-full sm:w-1/3">
                                        <div className="rounded-lg overflow-hidden mb-4">
                                            <img
                                                src={
                                                    selectedOrg.logo
                                                        ? `/storage/${selectedOrg.logo}`
                                                        : "/images/default-org.jpg"
                                                }
                                                alt={selectedOrg.name}
                                                className="w-full h-48 object-cover"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(
                                                        selectedOrg.status
                                                    )}`}
                                                >
                                                    {getStatusIcon(
                                                        selectedOrg.status
                                                    )}
                                                    {selectedOrg.status}
                                                </span>
                                                <div className="text-sm text-gray-500">
                                                    Created{" "}
                                                    {new Date(
                                                        selectedOrg.created_at
                                                    ).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full sm:w-2/3">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                            {selectedOrg.name}
                                        </h2>
                                        <p className="text-gray-600 mb-6 leading-relaxed">
                                            {selectedOrg.description ||
                                                "No description available."}
                                        </p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <MapPin className="h-5 w-5 text-gray-500" />
                                                    <div>
                                                        <h3 className="text-sm font-medium text-gray-500">
                                                            Location
                                                        </h3>
                                                        <p className="text-gray-900 font-medium">
                                                            {selectedOrg.city},{" "}
                                                            {
                                                                selectedOrg.country
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <Calendar className="h-5 w-5 text-gray-500" />
                                                    <div>
                                                        <h3 className="text-sm font-medium text-gray-500">
                                                            Founded
                                                        </h3>
                                                        <p className="text-gray-900 font-medium">
                                                            {selectedOrg.foundedYear ||
                                                                "Not specified"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <Phone className="h-5 w-5 text-gray-500" />
                                                    <div>
                                                        <h3 className="text-sm font-medium text-gray-500">
                                                            Phone
                                                        </h3>
                                                        <p className="text-gray-900 font-medium">
                                                            {selectedOrg.phone ||
                                                                "Not provided"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <Mail className="h-5 w-5 text-gray-500" />
                                                    <div>
                                                        <h3 className="text-sm font-medium text-gray-500">
                                                            Email
                                                        </h3>
                                                        <p className="text-gray-900 font-medium">
                                                            {selectedOrg.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {selectedOrg.website && (
                                                <div className="sm:col-span-2 bg-gray-50 rounded-lg p-4">
                                                    <div className="flex items-center gap-3">
                                                        <ExternalLink className="h-5 w-5 text-gray-500" />
                                                        <div>
                                                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                                                                Website
                                                            </h3>
                                                            <a
                                                                href={
                                                                    selectedOrg.website.startsWith(
                                                                        "http"
                                                                    )
                                                                        ? selectedOrg.website
                                                                        : `https://${selectedOrg.website}`
                                                                }
                                                                className="text-blue-600 hover:underline font-medium"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                {
                                                                    selectedOrg.website
                                                                }
                                                                <ExternalLink className="w-3 h-3 inline ml-1" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {sortedOrgs.length > 0 && (
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-600">
                            Showing{" "}
                            <span className="font-medium">
                                1-{Math.min(12, sortedOrgs.length)}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium">
                                {sortedOrgs.length}
                            </span>{" "}
                            organizations
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
