import AdminLayout from "@/Layouts/AdminLayout";
import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import {
    CheckCircle,
    X,
    Clock,
    User,
    Mail,
    Phone,
    MapPin,
    Search,
    ShieldCheck,
    Eye,
    Edit,
    ChevronDown,
    ChevronUp,
    Filter,
    TrendingUp,
    Users,
    UserCheck,
    UserX,
    Calendar,
    Globe,
    Award,
    ExternalLink,
    MoreVertical,
    Download,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Volunteers({ volunteers, verifications }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedVolunteer, setExpandedVolunteer] = useState(null);
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [viewMode, setViewMode] = useState("grid");

    // Combine volunteers with their verification status
    const volunteersWithVerification = volunteers.map((volunteer) => {
        const verification = verifications.find(
            (v) => v.volunteer_public_id === volunteer.public_id
        );
        return { ...volunteer, verification };
    });

    // Filter volunteers based on search term and filters
    const filteredVolunteers = volunteersWithVerification.filter(
        (volunteer) => {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                volunteer.user?.name?.toLowerCase().includes(searchLower) ||
                volunteer.user?.email?.toLowerCase().includes(searchLower) ||
                volunteer.phone?.toLowerCase().includes(searchLower) ||
                volunteer.city?.toLowerCase().includes(searchLower) ||
                volunteer.verification?.status
                    .toLowerCase()
                    .includes(searchLower);

            const matchesStatus =
                statusFilter === "all" ||
                volunteer.verification?.status?.toLowerCase() ===
                    statusFilter.toLowerCase() ||
                (!volunteer.verification && statusFilter === "unverified");

            return matchesSearch && matchesStatus;
        }
    );

    // Sort volunteers
    const sortedVolunteers = [...filteredVolunteers].sort((a, b) => {
        if (sortBy === "newest") {
            return new Date(b.created_at) - new Date(a.created_at);
        } else if (sortBy === "oldest") {
            return new Date(a.created_at) - new Date(b.created_at);
        } else if (sortBy === "name-asc") {
            return a.user?.name?.localeCompare(b.user?.name);
        } else if (sortBy === "name-desc") {
            return b.user?.name?.localeCompare(a.user?.name);
        }
        return 0;
    });

    const toggleExpand = (volunteerId) => {
        setExpandedVolunteer(
            expandedVolunteer === volunteerId ? null : volunteerId
        );
    };

    const openModal = (volunteer) => {
        setSelectedVolunteer(volunteer);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedVolunteer(null);
    };

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
        total: volunteers.length,
        approved: verifications.filter((v) => v.status === "Approved").length,
        pending: verifications.filter((v) => v.status === "Pending").length,
        unverified: volunteers.length - verifications.length,
    };

    return (
        <AdminLayout>
            <Head title="Volunteers Management" />

            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                Volunteer Management
                            </h1>
                            <p className="text-sm md:text-base text-gray-600 mt-1">
                                Manage volunteer profiles and verification
                                requests
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition-colors">
                                <Download className="h-4 w-4" />
                                <span className="hidden sm:inline">Export</span>
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
                                    Total Volunteers
                                </p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {stats.total}
                                </p>
                            </div>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Users className="h-5 w-5 text-blue-600" />
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
                                <UserCheck className="h-5 w-5 text-green-600" />
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
                                    Unverified
                                </p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {stats.unverified}
                                </p>
                            </div>
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <UserX className="h-5 w-5 text-purple-600" />
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
                                    placeholder="Search volunteers by name, email, or location..."
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
                                    <option value="approved">Approved</option>
                                    <option value="pending">Pending</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="unverified">
                                        Unverified
                                    </option>
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

                {/* Volunteers Grid/List View */}
                {sortedVolunteers.length > 0 ? (
                    viewMode === "grid" ? (
                        /* Grid View */
                        <div className="grid gap-4 md:gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                            {sortedVolunteers.map((volunteer) => (
                                <div
                                    key={volunteer.id}
                                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col"
                                >
                                    {/* Volunteer Header */}
                                    <div className="p-4 flex items-start justify-between border-b border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                {volunteer.profile_picture ? (
                                                    <img
                                                        className="h-12 w-12 rounded-full object-cover"
                                                        src={`/storage/${volunteer.profile_picture}`}
                                                        alt="Profile"
                                                    />
                                                ) : (
                                                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <User className="h-6 w-6 text-blue-600" />
                                                    </div>
                                                )}
                                                {volunteer.verification && (
                                                    <div className="absolute -bottom-1 -right-1">
                                                        <span
                                                            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs border ${getStatusColor(
                                                                volunteer
                                                                    .verification
                                                                    .status
                                                            )}`}
                                                        >
                                                            {getStatusIcon(
                                                                volunteer
                                                                    .verification
                                                                    .status
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">
                                                    {volunteer.user?.name ||
                                                        "N/A"}
                                                </h3>
                                                <p className="text-sm text-gray-500 truncate">
                                                    {volunteer.user?.email ||
                                                        "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() =>
                                                toggleExpand(volunteer.id)
                                            }
                                            className="p-1 text-gray-400 hover:text-gray-600"
                                        >
                                            {expandedVolunteer ===
                                            volunteer.id ? (
                                                <ChevronUp className="h-5 w-5" />
                                            ) : (
                                                <ChevronDown className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Volunteer Details (Collapsible) */}
                                    {expandedVolunteer === volunteer.id && (
                                        <div className="px-4 pb-4">
                                            <div className="space-y-3 pt-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Phone className="w-4 h-4" />
                                                    <span>
                                                        {volunteer.phone ||
                                                            "Not provided"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>
                                                        {[
                                                            volunteer.city,
                                                            volunteer.country,
                                                        ]
                                                            .filter(Boolean)
                                                            .join(", ") ||
                                                            "Not specified"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>
                                                        Joined{" "}
                                                        {new Date(
                                                            volunteer.created_at
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                {/* Status Badge */}
                                                <div className="pt-2">
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                            volunteer
                                                                .verification
                                                                ?.status ||
                                                                "unverified"
                                                        )}`}
                                                    >
                                                        {getStatusIcon(
                                                            volunteer
                                                                .verification
                                                                ?.status ||
                                                                "unverified"
                                                        )}
                                                        {volunteer.verification
                                                            ?.status ||
                                                            "Unverified"}
                                                    </span>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                                                    <Link
                                                        href={route(
                                                            "admin.volunteers.verifications",
                                                            volunteer.public_id
                                                        )}
                                                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <ShieldCheck className="w-4 h-4" />
                                                        Verify
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            openModal(volunteer)
                                                        }
                                                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        View
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
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
                                                Volunteer
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden md:table-cell">
                                                Contact
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
                                        {sortedVolunteers.map((volunteer) => (
                                            <tr
                                                key={volunteer.id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative">
                                                            {volunteer.profile_picture ? (
                                                                <img
                                                                    className="h-10 w-10 rounded-full object-cover"
                                                                    src={`/storage/${volunteer.profile_picture}`}
                                                                    alt="Profile"
                                                                />
                                                            ) : (
                                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                                    <User className="h-5 w-5 text-blue-600" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {volunteer.user
                                                                    ?.name ||
                                                                    "N/A"}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                Joined{" "}
                                                                {new Date(
                                                                    volunteer.created_at
                                                                ).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 hidden md:table-cell">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Mail className="w-3 h-3" />
                                                            <span className="truncate">
                                                                {volunteer.user
                                                                    ?.email ||
                                                                    "N/A"}
                                                            </span>
                                                        </div>
                                                        {volunteer.phone && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                                <Phone className="w-3 h-3" />
                                                                <span>
                                                                    {
                                                                        volunteer.phone
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 hidden lg:table-cell">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <MapPin className="w-3 h-3" />
                                                        <span>
                                                            {[
                                                                volunteer.city,
                                                                volunteer.country,
                                                            ]
                                                                .filter(Boolean)
                                                                .join(", ") ||
                                                                "Not specified"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                            volunteer
                                                                .verification
                                                                ?.status ||
                                                                "unverified"
                                                        )}`}
                                                    >
                                                        {getStatusIcon(
                                                            volunteer
                                                                .verification
                                                                ?.status ||
                                                                "unverified"
                                                        )}
                                                        {volunteer.verification
                                                            ?.status ||
                                                            "Unverified"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Link
                                                            href={route(
                                                                "admin.volunteers.verifications",
                                                                volunteer.public_id
                                                            )}
                                                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Verify"
                                                        >
                                                            <ShieldCheck className="w-4 h-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                openModal(
                                                                    volunteer
                                                                )
                                                            }
                                                            className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            className="p-1.5 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit className="w-4 h-4" />
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
                            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No volunteers found
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                {searchTerm || statusFilter !== "all"
                                    ? "Try adjusting your search or filter criteria"
                                    : "No volunteers have registered yet"}
                            </p>
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
                )}

                {/* Volunteer Details Modal */}
                {isModalOpen && selectedVolunteer && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Volunteer Details
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="w-full md:w-1/3 flex flex-col items-center">
                                        <div className="relative mb-4">
                                            {selectedVolunteer.profile_picture ? (
                                                <img
                                                    className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md"
                                                    src={`/storage/${selectedVolunteer.profile_picture}`}
                                                    alt="Profile"
                                                />
                                            ) : (
                                                <div className="h-32 w-32 rounded-full bg-blue-100 border-4 border-white shadow-md flex items-center justify-center">
                                                    <User className="h-16 w-16 text-blue-600" />
                                                </div>
                                            )}
                                            {selectedVolunteer.verification && (
                                                <div className="absolute -bottom-2 -right-2">
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(
                                                            selectedVolunteer
                                                                .verification
                                                                .status
                                                        )}`}
                                                    >
                                                        {getStatusIcon(
                                                            selectedVolunteer
                                                                .verification
                                                                .status
                                                        )}
                                                        {
                                                            selectedVolunteer
                                                                .verification
                                                                .status
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 text-center">
                                            {selectedVolunteer.user?.name ||
                                                "N/A"}
                                        </h3>
                                        <p className="text-sm text-gray-500 text-center mt-1">
                                            {selectedVolunteer.user?.email ||
                                                "N/A"}
                                        </p>
                                    </div>

                                    <div className="w-full md:w-2/3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <Phone className="h-5 w-5 text-gray-500" />
                                                    <div>
                                                        <h3 className="text-sm font-medium text-gray-500">
                                                            Phone
                                                        </h3>
                                                        <p className="text-gray-900 font-medium">
                                                            {selectedVolunteer.phone ||
                                                                "Not provided"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <MapPin className="h-5 w-5 text-gray-500" />
                                                    <div>
                                                        <h3 className="text-sm font-medium text-gray-500">
                                                            Location
                                                        </h3>
                                                        <p className="text-gray-900 font-medium">
                                                            {[
                                                                selectedVolunteer.city,
                                                                selectedVolunteer.country,
                                                            ]
                                                                .filter(Boolean)
                                                                .join(", ") ||
                                                                "Not specified"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <User className="h-5 w-5 text-gray-500" />
                                                    <div>
                                                        <h3 className="text-sm font-medium text-gray-500">
                                                            Gender
                                                        </h3>
                                                        <p className="text-gray-900 font-medium">
                                                            {selectedVolunteer.gender ||
                                                                "Not specified"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <Calendar className="h-5 w-5 text-gray-500" />
                                                    <div>
                                                        <h3 className="text-sm font-medium text-gray-500">
                                                            Date of Birth
                                                        </h3>
                                                        <p className="text-gray-900 font-medium">
                                                            {selectedVolunteer.dob
                                                                ? new Date(
                                                                      selectedVolunteer.dob
                                                                  ).toLocaleDateString()
                                                                : "Not specified"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Verification Details */}
                                        {selectedVolunteer.verification && (
                                            <div className="mt-6 bg-gray-50 rounded-lg p-4">
                                                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                                    Verification Details
                                                </h4>
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-600">
                                                            Status
                                                        </span>
                                                        <span
                                                            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                                                                selectedVolunteer
                                                                    .verification
                                                                    .status
                                                            )}`}
                                                        >
                                                            {getStatusIcon(
                                                                selectedVolunteer
                                                                    .verification
                                                                    .status
                                                            )}
                                                            {
                                                                selectedVolunteer
                                                                    .verification
                                                                    .status
                                                            }
                                                        </span>
                                                    </div>
                                                    {selectedVolunteer
                                                        .verification
                                                        .comments && (
                                                        <div>
                                                            <span className="text-sm text-gray-600 block mb-1">
                                                                Comments
                                                            </span>
                                                            <p className="text-sm text-gray-900 bg-white p-3 rounded border border-gray-200">
                                                                {
                                                                    selectedVolunteer
                                                                        .verification
                                                                        .comments
                                                                }
                                                            </p>
                                                        </div>
                                                    )}
                                                    {selectedVolunteer
                                                        .verification
                                                        .verified_at && (
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-gray-600">
                                                                Verified On
                                                            </span>
                                                            <span className="text-sm text-gray-900">
                                                                {new Date(
                                                                    selectedVolunteer.verification.verified_at
                                                                ).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                    <Link
                                        href={route(
                                            "admin.volunteers.verifications",
                                            selectedVolunteer.public_id
                                        )}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition-colors"
                                    >
                                        <ShieldCheck className="w-4 h-4" />
                                        Manage Verification
                                    </Link>
                                    <button
                                        onClick={closeModal}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg shadow-sm transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {sortedVolunteers.length > 0 && (
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-600">
                            Showing{" "}
                            <span className="font-medium">
                                1-{Math.min(12, sortedVolunteers.length)}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium">
                                {sortedVolunteers.length}
                            </span>{" "}
                            volunteers
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
