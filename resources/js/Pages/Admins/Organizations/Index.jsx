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
} from "lucide-react";

import { usePage } from "@inertiajs/react";
import { Link } from "@inertiajs/react";

export default function Index({ organizations, verifications }) {
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    const closeModal = () => setSelectedOrg(null);

    // Filter organizations based on search and filters
    const filteredOrgs = organizations.filter((org) => {
        const matchesSearch =
            org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (org.description &&
                org.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()));

        const matchesStatus =
            statusFilter === "all" ||
            org.status.toLowerCase() === statusFilter.toLowerCase();

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
    return (
        <AdminLayout>
            <div className="min-h-screen py-8 px-4 sm:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    {/* Header with actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Organizations
                            </h1>
                            <p className="text-gray-500 mt-1">
                                {organizations.length}{" "}
                                {organizations.length === 1
                                    ? "organization"
                                    : "organizations"}{" "}
                                registered
                            </p>
                        </div>
                        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Organization
                        </button>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Search Input */}
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search organizations by name or description..."
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                            </div>

                            {/* Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Filters
                                {showFilters ? (
                                    <ChevronUp className="w-4 h-4 ml-2" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 ml-2" />
                                )}
                            </button>
                        </div>

                        {/* Expanded Filters */}
                        {showFilters && (
                            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {/* Status Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                                        value={statusFilter}
                                        onChange={(e) =>
                                            setStatusFilter(e.target.value)
                                        }
                                    >
                                        <option value="all">
                                            All Statuses
                                        </option>
                                        <option value="approved">
                                            Approved
                                        </option>
                                        <option value="pending">Pending</option>
                                        <option value="rejected">
                                            Rejected
                                        </option>
                                    </select>
                                </div>

                                {/* Sort By */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Sort By
                                    </label>
                                    <select
                                        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                                        value={sortBy}
                                        onChange={(e) =>
                                            setSortBy(e.target.value)
                                        }
                                    >
                                        <option value="newest">
                                            Newest First
                                        </option>
                                        <option value="oldest">
                                            Oldest First
                                        </option>
                                        <option value="name-asc">
                                            Name (A-Z)
                                        </option>
                                        <option value="name-desc">
                                            Name (Z-A)
                                        </option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-xl shadow-sm p-4">
                            <div className="flex items-center">
                                <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
                                    <Users className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Total Organizations
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-800">
                                        {organizations.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-4">
                            <div className="flex items-center">
                                <div className="p-3 rounded-lg bg-green-100 text-green-600 mr-4">
                                    <CheckCircle className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Verified
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-800">
                                        {
                                            verifications.filter(
                                                (o) => o.status === "Approved"
                                            ).length
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-4">
                            <div className="flex items-center">
                                <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600 mr-4">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Pending
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-800">
                                        {
                                            organizations.filter(
                                                (o) => o.status === "Pending"
                                            ).length
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-4">
                            <div className="flex items-center">
                                <div className="p-3 rounded-lg bg-red-100 text-red-600 mr-4">
                                    <X className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Rejected
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-800">
                                        {
                                            organizations.filter(
                                                (o) => o.status === "Rejected"
                                            ).length
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Organizations Grid */}
                    {sortedOrgs.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {sortedOrgs.map((org) => (
                                <div
                                    key={org.id}
                                    className="bg-white rounded-xl shadow hover:shadow-lg transition-all overflow-hidden flex flex-col border border-gray-100 hover:border-blue-100"
                                >
                                    {/* Image with status badge */}
                                    <div className="relative h-48">
                                        <img
                                            src={
                                                org.logo
                                                    ? `/storage/${org.logo}`
                                                    : "/images/default-org.jpg"
                                            }
                                            alt={org.name}
                                            className="object-cover h-full w-full"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${
                                                    org.status === "Approved"
                                                        ? "bg-green-500"
                                                        : org.status ===
                                                          "Pending"
                                                        ? "bg-yellow-500"
                                                        : "bg-red-500"
                                                }`}
                                            >
                                                {org.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col">
                                        {/* Title and basic info */}
                                        <div className="mb-3">
                                            <h2 className="text-lg font-bold text-gray-900">
                                                {org.name}
                                            </h2>
                                            <p className="text-sm text-gray-500 mt-1 flex items-center">
                                                <Globe className="w-4 h-4 mr-1" />
                                                {org.city}, {org.country}
                                            </p>
                                        </div>

                                        {/* Description */}
                                        <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
                                            {org.description ||
                                                "No description provided."}
                                        </p>

                                        {/* Footer with actions */}
                                        <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between">
                                            <Link
                                                href={route(
                                                    "admin.organizations.view",
                                                    org.slug
                                                )}
                                                className="text-blue-600 hover:underline"
                                            >
                                                View Details
                                            </Link>

                                            <div className="flex gap-3">
                                                {/* <button className="text-sm text-yellow-600 hover:underline font-medium">
                                                    Edit
                                                </button> */}
                                                <button className="text-sm text-red-600 hover:underline font-medium">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                            <div className="mx-auto max-w-md">
                                <Search className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-lg font-medium text-gray-900">
                                    No organizations found
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {searchQuery || statusFilter !== "all"
                                        ? "Try adjusting your search or filter criteria"
                                        : "Get started by adding a new organization"}
                                </p>
                                <div className="mt-6">
                                    <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        <Plus className="-ml-1 mr-2 h-5 w-5" />
                                        Add Organization
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Organization Details Modal */}
                    {selectedOrg && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6 overflow-auto">
                            <div className="bg-white rounded-lg w-full max-w-lg sm:max-w-3xl shadow-xl relative max-h-[90vh] overflow-y-auto">
                                <button
                                    onClick={closeModal}
                                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                                >
                                    ✕
                                </button>
                                <div className="flex flex-col sm:flex-row gap-6 p-6">
                                    <div className="w-full sm:w-1/3">
                                        <img
                                            src={
                                                selectedOrg.logo
                                                    ? `/storage/${selectedOrg.logo}`
                                                    : "/images/default-org.jpg"
                                            }
                                            alt={selectedOrg.name}
                                            className="w-full h-48 sm:h-full object-cover rounded-lg"
                                        />
                                        <div className="mt-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                    selectedOrg.status ===
                                                    "Approved"
                                                        ? "bg-green-100 text-green-800"
                                                        : selectedOrg.status ===
                                                          "Pending"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {selectedOrg.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full sm:w-2/3">
                                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                            {selectedOrg.name}
                                        </h2>
                                        <p className="text-gray-600 mb-6">
                                            {selectedOrg.description ||
                                                "No description available."}
                                        </p>

                                        <div className="space-y-4">
                                            <div className="flex items-start">
                                                <Globe className="flex-shrink-0 h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-500">
                                                        Location
                                                    </h3>
                                                    <p className="text-gray-900">
                                                        {selectedOrg.city},{" "}
                                                        {selectedOrg.country}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <Calendar className="flex-shrink-0 h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-500">
                                                        Founded
                                                    </h3>
                                                    <p className="text-gray-900">
                                                        {selectedOrg.foundedYear ||
                                                            "Not specified"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <Phone className="flex-shrink-0 h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-500">
                                                        Contact
                                                    </h3>
                                                    <p className="text-gray-900">
                                                        {selectedOrg.phone ||
                                                            "Not provided"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <Mail className="flex-shrink-0 h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-500">
                                                        Email
                                                    </h3>
                                                    <p className="text-gray-900">
                                                        {selectedOrg.email}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <LinkIcon className="flex-shrink-0 h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-500">
                                                        Website
                                                    </h3>
                                                    {selectedOrg.website ? (
                                                        <a
                                                            href={
                                                                selectedOrg.website.startsWith(
                                                                    "http"
                                                                )
                                                                    ? selectedOrg.website
                                                                    : `https://${selectedOrg.website}`
                                                            }
                                                            className="text-blue-600 hover:underline"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            {
                                                                selectedOrg.website
                                                            }
                                                        </a>
                                                    ) : (
                                                        <p className="text-gray-900">
                                                            Not provided
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
