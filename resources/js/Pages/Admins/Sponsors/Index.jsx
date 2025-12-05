import AdminLayout from "@/Layouts/AdminLayout";
import React, { useState } from "react";
import { router, Link } from "@inertiajs/react";
import {
    EyeIcon,
    CheckCircleIcon,
    XCircleIcon,
    TrashIcon,
    UserCircleIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    DocumentTextIcon,
    LightBulbIcon,
    AcademicCapIcon,
    ClockIcon,
    CheckIcon,
    ArrowUpRightIcon,
} from "@heroicons/react/24/outline";
import { Download } from "lucide-react";
import { ExternalLink } from "lucide-react";
import { Filter } from "lucide-react";
import { MapPin } from "lucide-react";
import { Plus } from "lucide-react";
import { Search } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { XIcon } from "lucide-react";
import {
    EyeIcon as EyeIconSolid,
    CheckCircleIcon as CheckCircleIconSolid,
    XCircleIcon as XCircleIconSolid,
} from "@heroicons/react/24/solid";

export default function Index({ sponsorships }) {
    const [selectedSponsorship, setSelectedSponsorship] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [statusToUpdate, setStatusToUpdate] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [viewMode, setViewMode] = useState("grid");

    const openDetails = (sponsorship) => {
        setSelectedSponsorship(sponsorship);
        setShowDetailModal(true);
    };

    const openStatusModal = (sponsorship, status = "") => {
        setSelectedSponsorship(sponsorship);
        setStatusToUpdate(status);
        setShowStatusModal(true);
    };

    const updateStatus = () => {
        router.post(
            route("admin.sponsors.updateStatus", selectedSponsorship.id),
            { status: statusToUpdate },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowStatusModal(false);
                    setSelectedSponsorship(null);
                    setStatusToUpdate("");
                },
            }
        );
    };

    const deleteSponsorship = (id) => {
        if (
            confirm("Are you sure you want to delete this sponsorship request?")
        ) {
            router.delete(route("admin.sponsors.destroy", id), {
                preserveScroll: true,
            });
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            Pending: {
                bg: "bg-amber-50",
                text: "text-amber-700",
                border: "border-amber-200",
                icon: <ClockIcon className="h-4 w-4" />,
            },
            Approved: {
                bg: "bg-green-50",
                text: "text-green-700",
                border: "border-green-200",
                icon: <CheckIcon className="h-4 w-4" />,
            },
            Rejected: {
                bg: "bg-red-50",
                text: "text-red-700",
                border: "border-red-200",
                icon: <XIcon className="h-4 w-4" />,
            },
        };

        const config = statusConfig[status] || statusConfig.Pending;

        return (
            <span
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}
            >
                {config.icon}
                {status}
            </span>
        );
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Filter sponsorships
    const filteredSponsorships = sponsorships.filter((sponsorship) => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            sponsorship.user_name.toLowerCase().includes(searchLower) ||
            sponsorship.user_email.toLowerCase().includes(searchLower) ||
            sponsorship.project_title.toLowerCase().includes(searchLower);

        const matchesStatus =
            statusFilter === "all" || sponsorship.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Sort sponsorships
    const sortedSponsorships = [...filteredSponsorships].sort((a, b) => {
        if (sortBy === "newest") {
            return new Date(b.created_at) - new Date(a.created_at);
        } else if (sortBy === "oldest") {
            return new Date(a.created_at) - new Date(b.created_at);
        } else if (sortBy === "amount-high") {
            return b.total_amount - a.total_amount;
        } else if (sortBy === "amount-low") {
            return a.total_amount - b.total_amount;
        } else if (sortBy === "name-asc") {
            return a.user_name.localeCompare(b.user_name);
        }
        return 0;
    });

    // Statistics
    const stats = {
        total: sponsorships.length,
        pending: sponsorships.filter((s) => s.status === "Pending").length,
        approved: sponsorships.filter((s) => s.status === "Approved").length,
        rejected: sponsorships.filter((s) => s.status === "Rejected").length,
        totalAmount: sponsorships.reduce((sum, s) => sum + s.total_amount, 0),
    };

    return (
        <AdminLayout>
            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                Sponsorship Requests
                            </h1>
                            <p className="text-sm md:text-base text-gray-600 mt-1">
                                Manage and review all volunteer sponsorship
                                applications
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
                                    Total Requests
                                </p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {stats.total}
                                </p>
                            </div>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <DocumentTextIcon className="h-5 w-5 text-blue-600" />
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
                                <ClockIcon className="h-5 w-5 text-amber-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Total Value
                                </p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {formatCurrency(stats.totalAmount)}
                                </p>
                            </div>
                            <div className="p-2 bg-green-50 rounded-lg">
                                <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
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
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <CheckCircleIcon className="h-5 w-5 text-purple-600" />
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
                                    placeholder="Search sponsorships by volunteer, email, or project..."
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
                                    <option value="Pending">Pending</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
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
                                    <option value="amount-high">
                                        Amount (High to Low)
                                    </option>
                                    <option value="amount-low">
                                        Amount (Low to High)
                                    </option>
                                    <option value="name-asc">Name (A-Z)</option>
                                </select>
                                <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sponsorships Grid/List View */}
                {sortedSponsorships.length > 0 ? (
                    viewMode === "grid" ? (
                        /* Grid View */
                        <div className="grid gap-4 md:gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                            {sortedSponsorships.map((sponsorship) => (
                                <div
                                    key={sponsorship.id}
                                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col"
                                >
                                    {/* Header */}
                                    <div className="p-4 border-b border-gray-100">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                                    <span className="text-indigo-600 font-semibold text-lg">
                                                        {sponsorship.user_name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900 line-clamp-1">
                                                        {sponsorship.user_name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 truncate">
                                                        {sponsorship.user_email}
                                                    </p>
                                                </div>
                                            </div>
                                            {getStatusBadge(sponsorship.status)}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 flex-1 flex flex-col">
                                        <div className="mb-4">
                                            <h4 className="text-sm font-medium text-gray-900 mb-1">
                                                {sponsorship.project_title}
                                            </h4>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                                <CalendarIcon className="w-4 h-4" />
                                                <span>
                                                    {formatDate(
                                                        sponsorship.created_at
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-auto">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <p className="text-xs text-gray-500">
                                                        Total Amount
                                                    </p>
                                                    <p className="text-xl font-bold text-gray-900">
                                                        {formatCurrency(
                                                            sponsorship.total_amount
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500">
                                                        Duration
                                                    </p>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {sponsorship.start_date &&
                                                        sponsorship.end_date
                                                            ? `${formatDate(
                                                                  sponsorship.start_date
                                                              )} - ${formatDate(
                                                                  sponsorship.end_date
                                                              )}`
                                                            : "Not specified"}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                                                <button
                                                    onClick={() =>
                                                        openDetails(sponsorship)
                                                    }
                                                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <EyeIcon className="w-4 h-4" />
                                                    View Details
                                                </button>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() =>
                                                            openStatusModal(
                                                                sponsorship,
                                                                "Approved"
                                                            )
                                                        }
                                                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Approve"
                                                    >
                                                        <CheckCircleIcon className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            deleteSponsorship(
                                                                sponsorship.id
                                                            )
                                                        }
                                                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
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
                                                Volunteer
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden md:table-cell">
                                                Project
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                                Amount
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden lg:table-cell">
                                                Created
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {sortedSponsorships.map(
                                            (sponsorship) => (
                                                <tr
                                                    key={sponsorship.id}
                                                    className="hover:bg-gray-50 transition-colors"
                                                >
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                                                <span className="text-indigo-600 font-semibold text-lg">
                                                                    {sponsorship.user_name
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">
                                                                    {
                                                                        sponsorship.user_name
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-gray-500 truncate max-w-[150px]">
                                                                    {
                                                                        sponsorship.user_email
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 hidden md:table-cell">
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {
                                                                    sponsorship.project_title
                                                                }
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {sponsorship.start_date &&
                                                                sponsorship.end_date
                                                                    ? `${formatDate(
                                                                          sponsorship.start_date
                                                                      )} - ${formatDate(
                                                                          sponsorship.end_date
                                                                      )}`
                                                                    : "Dates not specified"}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <CurrencyDollarIcon className="w-4 h-4 text-gray-400" />
                                                            <span className="font-medium text-gray-900">
                                                                {formatCurrency(
                                                                    sponsorship.total_amount
                                                                )}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        {getStatusBadge(
                                                            sponsorship.status
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4 hidden lg:table-cell">
                                                        <div className="flex items-center gap-2 text-gray-600">
                                                            <CalendarIcon className="w-4 h-4" />
                                                            <span>
                                                                {formatDate(
                                                                    sponsorship.created_at
                                                                )}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    openDetails(
                                                                        sponsorship
                                                                    )
                                                                }
                                                                className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="View Details"
                                                            >
                                                                <EyeIcon className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    openStatusModal(
                                                                        sponsorship,
                                                                        "Approved"
                                                                    )
                                                                }
                                                                className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                                                                title="Approve"
                                                            >
                                                                <CheckCircleIcon className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    openStatusModal(
                                                                        sponsorship,
                                                                        "Rejected"
                                                                    )
                                                                }
                                                                className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Reject"
                                                            >
                                                                <XCircleIcon className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    deleteSponsorship(
                                                                        sponsorship.id
                                                                    )
                                                                }
                                                                className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                                                                title="Delete"
                                                            >
                                                                <TrashIcon className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                ) : (
                    /* Empty State */
                    <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 text-center">
                        <div className="mx-auto max-w-md">
                            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No sponsorship requests
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                {searchTerm || statusFilter !== "all"
                                    ? "Try adjusting your search or filter criteria"
                                    : "No sponsorship requests have been submitted yet"}
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

                {/* Detail Modal */}
                {showDetailModal && selectedSponsorship && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                        <span className="text-indigo-600 font-semibold text-xl">
                                            {selectedSponsorship.user_name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Sponsorship Application
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            {selectedSponsorship.user_name} •{" "}
                                            {formatDate(
                                                selectedSponsorship.created_at
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {getStatusBadge(selectedSponsorship.status)}
                                    <button
                                        onClick={() =>
                                            setShowDetailModal(false)
                                        }
                                        className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <XIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Volunteer Info */}
                                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                <UserCircleIcon className="h-5 w-5 text-blue-600" />
                                                Volunteer Information
                                            </h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-600">
                                                        Name
                                                    </span>
                                                    <span className="font-medium text-gray-900">
                                                        {
                                                            selectedSponsorship.user_name
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-600">
                                                        Email
                                                    </span>
                                                    <span className="font-medium text-gray-900">
                                                        {
                                                            selectedSponsorship.user_email
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                                                Project Details
                                            </h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-600">
                                                        Project
                                                    </span>
                                                    <span className="font-medium text-gray-900 text-right">
                                                        {
                                                            selectedSponsorship.project_title
                                                        }
                                                    </span>
                                                </div>
                                                {selectedSponsorship.start_date &&
                                                    selectedSponsorship.end_date && (
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-gray-600">
                                                                Duration
                                                            </span>
                                                            <span className="font-medium text-gray-900">
                                                                {formatDate(
                                                                    selectedSponsorship.start_date
                                                                )}{" "}
                                                                -{" "}
                                                                {formatDate(
                                                                    selectedSponsorship.end_date
                                                                )}
                                                            </span>
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Funding Breakdown */}
                                    <div className="lg:col-span-2">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <CurrencyDollarIcon className="h-5 w-5 text-blue-600" />
                                                Funding Breakdown
                                            </h4>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                {[
                                                    {
                                                        key: "travel",
                                                        label: "Travel",
                                                        value: selectedSponsorship.travel,
                                                    },
                                                    {
                                                        key: "accommodation",
                                                        label: "Accommodation",
                                                        value: selectedSponsorship.accommodation,
                                                    },
                                                    {
                                                        key: "meals",
                                                        label: "Meals",
                                                        value: selectedSponsorship.meals,
                                                    },
                                                    {
                                                        key: "living_expenses",
                                                        label: "Living Expenses",
                                                        value: selectedSponsorship.living_expenses,
                                                    },
                                                    {
                                                        key: "visa_fees",
                                                        label: "Visa Fees",
                                                        value: selectedSponsorship.visa_fees,
                                                    },
                                                    {
                                                        key: "project_fees_amount",
                                                        label: "Project Fees",
                                                        value: selectedSponsorship.project_fees_amount,
                                                    },
                                                ].map(
                                                    (item) =>
                                                        item.value > 0 && (
                                                            <div
                                                                key={item.key}
                                                                className="bg-white rounded-lg p-3"
                                                            >
                                                                <p className="text-xs font-medium text-gray-600">
                                                                    {item.label}
                                                                </p>
                                                                <p className="text-lg font-semibold text-gray-900">
                                                                    {formatCurrency(
                                                                        item.value
                                                                    )}
                                                                </p>
                                                            </div>
                                                        )
                                                )}
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-lg font-semibold text-gray-900">
                                                        Total Amount
                                                    </span>
                                                    <span className="text-2xl font-bold text-blue-600">
                                                        {formatCurrency(
                                                            selectedSponsorship.total_amount
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Personal Statement */}
                                    <div>
                                        <div className="bg-gray-50 rounded-lg p-4 h-full">
                                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                                                Personal Statement
                                            </h4>
                                            <p className="text-gray-700 text-sm leading-relaxed">
                                                {
                                                    selectedSponsorship.self_introduction
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    {/* Skills */}
                                    <div>
                                        <div className="bg-gray-50 rounded-lg p-4 h-full">
                                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                <AcademicCapIcon className="h-5 w-5 text-blue-600" />
                                                Skills & Expertise
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {Array.isArray(
                                                    selectedSponsorship.skills
                                                ) &&
                                                    selectedSponsorship.skills.map(
                                                        (skill, index) => (
                                                            <span
                                                                key={index}
                                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                            >
                                                                {skill}
                                                            </span>
                                                        )
                                                    )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expected Impact */}
                                    <div className="lg:col-span-2">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                <LightBulbIcon className="h-5 w-5 text-blue-600" />
                                                Expected Impact
                                            </h4>
                                            <p className="text-gray-700 leading-relaxed">
                                                {selectedSponsorship.impact}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={() =>
                                            setShowDetailModal(false)
                                        }
                                        className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() =>
                                            openStatusModal(
                                                selectedSponsorship,
                                                "Approved"
                                            )
                                        }
                                        className="flex-1 px-4 py-3 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                                    >
                                        Approve Request
                                    </button>
                                    <button
                                        onClick={() =>
                                            openStatusModal(
                                                selectedSponsorship,
                                                "Rejected"
                                            )
                                        }
                                        className="flex-1 px-4 py-3 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                    >
                                        Reject Request
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Status Update Modal */}
                {showStatusModal && selectedSponsorship && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                            <div className="p-6">
                                <div className="flex items-center justify-center mb-4">
                                    <div
                                        className={`h-12 w-12 rounded-full flex items-center justify-center ${
                                            statusToUpdate === "Approved"
                                                ? "bg-green-100"
                                                : "bg-red-100"
                                        }`}
                                    >
                                        {statusToUpdate === "Approved" ? (
                                            <CheckIcon className="h-6 w-6 text-green-600" />
                                        ) : (
                                            <XIcon className="h-6 w-6 text-red-600" />
                                        )}
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                                    Update Sponsorship Status
                                </h3>
                                <p className="text-sm text-gray-500 text-center mb-6">
                                    Are you sure you want to{" "}
                                    {statusToUpdate.toLowerCase()} the
                                    sponsorship request from{" "}
                                    <span className="font-medium text-gray-900">
                                        {selectedSponsorship.user_name}
                                    </span>
                                    ?
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={() =>
                                            setShowStatusModal(false)
                                        }
                                        className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={updateStatus}
                                        className={`flex-1 px-4 py-3 text-sm font-medium text-white rounded-lg transition-colors ${
                                            statusToUpdate === "Approved"
                                                ? "bg-green-600 hover:bg-green-700"
                                                : "bg-red-600 hover:bg-red-700"
                                        }`}
                                    >
                                        Confirm {statusToUpdate}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {sortedSponsorships.length > 0 && (
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-600">
                            Showing{" "}
                            <span className="font-medium">
                                1-{Math.min(12, sortedSponsorships.length)}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium">
                                {sortedSponsorships.length}
                            </span>{" "}
                            requests
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
