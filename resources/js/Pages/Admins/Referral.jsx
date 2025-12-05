import AdminLayout from "@/Layouts/AdminLayout";
import {
    Check,
    X,
    Search,
    Filter,
    TrendingUp,
    Users,
    UserCheck,
    Gift,
    Calendar,
    Mail,
    Eye,
    MoreVertical,
    ChevronDown,
    ChevronUp,
    Download,
    UserPlus,
    Award,
    Clock,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { router, Link } from "@inertiajs/react";
import { useState } from "react";

export default function Referral({ referrals }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [expandedReferral, setExpandedReferral] = useState(null);
    const [viewMode, setViewMode] = useState("grid");

    const handleAction = (id, action) => {
        router.post(
            route(`admin.referrals.${action}`, { referral: id }),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Optional: Show a success message
                    window.toast?.show({
                        title: "Success",
                        message: `Referral ${action}d successfully`,
                        type: "success",
                    });
                },
                onError: () => {
                    // Optional: Show an error message
                    window.toast?.show({
                        title: "Error",
                        message: `Failed to ${action} referral`,
                        type: "error",
                    });
                },
            }
        );
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "approved":
                return "text-green-700 bg-green-50 border-green-200";
            case "rejected":
                return "text-red-700 bg-red-50 border-red-200";
            case "pending":
                return "text-amber-700 bg-amber-50 border-amber-200";
            default:
                return "text-gray-700 bg-gray-50 border-gray-200";
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "approved":
                return <CheckCircle className="w-4 h-4" />;
            case "rejected":
                return <XCircle className="w-4 h-4" />;
            case "pending":
                return <Clock className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    // Filter referrals
    const filteredReferrals = referrals.data.filter((referral) => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            referral.referrer?.name?.toLowerCase().includes(searchLower) ||
            referral.referrer?.email?.toLowerCase().includes(searchLower) ||
            referral.referee?.name?.toLowerCase().includes(searchLower) ||
            referral.referee?.email?.toLowerCase().includes(searchLower);

        const matchesStatus =
            statusFilter === "all" || referral.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Sort referrals
    const sortedReferrals = [...filteredReferrals].sort((a, b) => {
        if (sortBy === "newest") {
            return new Date(b.created_at) - new Date(a.created_at);
        } else if (sortBy === "oldest") {
            return new Date(a.created_at) - new Date(b.created_at);
        } else if (sortBy === "referrer") {
            return a.referrer?.name?.localeCompare(b.referrer?.name);
        } else if (sortBy === "referee") {
            return a.referee?.name?.localeCompare(b.referee?.name);
        }
        return 0;
    });

    // Statistics
    const stats = {
        total: referrals.meta?.total || referrals.data.length,
        pending: referrals.data.filter((r) => r.status === "pending").length,
        approved: referrals.data.filter((r) => r.status === "approved").length,
        rejected: referrals.data.filter((r) => r.status === "rejected").length,
    };

    return (
        <AdminLayout>
            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                Referral Management
                            </h1>
                            <p className="text-sm md:text-base text-gray-600 mt-1">
                                Manage and review user referral requests
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
                                    Total Referrals
                                </p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {stats.total}
                                </p>
                            </div>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <UserPlus className="h-5 w-5 text-blue-600" />
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
                                <p className="text-sm text-gray-600">
                                    Rejected
                                </p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {stats.rejected}
                                </p>
                            </div>
                            <div className="p-2 bg-red-50 rounded-lg">
                                <XCircle className="h-5 w-5 text-red-600" />
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
                                    placeholder="Search referrals by referrer, referee, or email..."
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
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
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
                                    <option value="referrer">
                                        Referrer (A-Z)
                                    </option>
                                    <option value="referee">
                                        Referee (A-Z)
                                    </option>
                                </select>
                                <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Referrals Grid/List View */}
                {sortedReferrals.length > 0 ? (
                    viewMode === "grid" ? (
                        /* Grid View */
                        <div className="grid gap-4 md:gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                            {sortedReferrals.map((referral) => (
                                <div
                                    key={referral.id}
                                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col"
                                >
                                    {/* Header */}
                                    <div className="p-4 border-b border-gray-100">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                                                    <UserPlus className="h-5 w-5 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                            referral.status
                                                        )}`}
                                                    >
                                                        {getStatusIcon(
                                                            referral.status
                                                        )}
                                                        {referral.status
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            referral.status.slice(
                                                                1
                                                            )}
                                                    </span>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {new Date(
                                                            referral.created_at
                                                        ).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    setExpandedReferral(
                                                        expandedReferral ===
                                                            referral.id
                                                            ? null
                                                            : referral.id
                                                    )
                                                }
                                                className="p-1 text-gray-400 hover:text-gray-600"
                                            >
                                                {expandedReferral ===
                                                referral.id ? (
                                                    <ChevronUp className="h-5 w-5" />
                                                ) : (
                                                    <ChevronDown className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 flex-1 flex flex-col">
                                        {/* Referrer */}
                                        <div className="mb-4">
                                            <p className="text-xs font-medium text-gray-500 mb-2">
                                                Referrer
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
                                                    {referral.referrer?.name
                                                        ?.charAt(0)
                                                        .toUpperCase() || "?"}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {referral.referrer
                                                            ?.name || "N/A"}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {referral.referrer
                                                            ?.email || "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Referee */}
                                        <div className="mb-4">
                                            <p className="text-xs font-medium text-gray-500 mb-2">
                                                Referee
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium text-sm">
                                                    {referral.referee?.name
                                                        ?.charAt(0)
                                                        .toUpperCase() || "?"}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {referral.referee
                                                            ?.name || "N/A"}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {referral.referee
                                                            ?.email || "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded Details */}
                                        {expandedReferral === referral.id && (
                                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-500">
                                                            Referral Date
                                                        </p>
                                                        <p className="text-sm text-gray-700">
                                                            {new Date(
                                                                referral.created_at
                                                            ).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    {referral.reward && (
                                                        <div>
                                                            <p className="text-xs font-medium text-gray-500">
                                                                Reward
                                                            </p>
                                                            <p className="text-sm text-gray-700 flex items-center gap-1">
                                                                <Gift className="w-3 h-3" />
                                                                {
                                                                    referral.reward
                                                                }
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="mt-auto pt-4 border-t border-gray-100">
                                            {referral.status === "pending" ? (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleAction(
                                                                referral.id,
                                                                "approve"
                                                            )
                                                        }
                                                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleAction(
                                                                referral.id,
                                                                "reject"
                                                            )
                                                        }
                                                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <span className="text-sm text-gray-500">
                                                        Action taken
                                                    </span>
                                                </div>
                                            )}
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
                                                Referrer
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                                Referee
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden lg:table-cell">
                                                Date
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {sortedReferrals.map((referral) => (
                                            <tr
                                                key={referral.id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                                                            {referral.referrer?.name
                                                                ?.charAt(0)
                                                                .toUpperCase() ||
                                                                "?"}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {referral
                                                                    .referrer
                                                                    ?.name ||
                                                                    "N/A"}
                                                            </p>
                                                            <p className="text-xs text-gray-500 truncate">
                                                                {referral
                                                                    .referrer
                                                                    ?.email ||
                                                                    "N/A"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium">
                                                            {referral.referee?.name
                                                                ?.charAt(0)
                                                                .toUpperCase() ||
                                                                "?"}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {referral
                                                                    .referee
                                                                    ?.name ||
                                                                    "N/A"}
                                                            </p>
                                                            <p className="text-xs text-gray-500 truncate">
                                                                {referral
                                                                    .referee
                                                                    ?.email ||
                                                                    "N/A"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                            referral.status
                                                        )}`}
                                                    >
                                                        {getStatusIcon(
                                                            referral.status
                                                        )}
                                                        {referral.status
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            referral.status.slice(
                                                                1
                                                            )}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 hidden lg:table-cell">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>
                                                            {new Date(
                                                                referral.created_at
                                                            ).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    {referral.status ===
                                                    "pending" ? (
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleAction(
                                                                        referral.id,
                                                                        "approve"
                                                                    )
                                                                }
                                                                className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                                                                title="Approve"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleAction(
                                                                        referral.id,
                                                                        "reject"
                                                                    )
                                                                }
                                                                className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Reject"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-gray-500">
                                                            Action taken
                                                        </span>
                                                    )}
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
                            <UserPlus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No referrals found
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                {searchTerm || statusFilter !== "all"
                                    ? "Try adjusting your search or filter criteria"
                                    : "No referral requests have been submitted yet"}
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

                {/* Pagination - Only show if we have pagination data */}
                {referrals.meta && referrals.data.length > 0 && (
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-600">
                            Showing {referrals.meta.from} to {referrals.meta.to}{" "}
                            of {referrals.meta.total} entries
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {referrals.meta.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || "#"}
                                    preserveScroll
                                    className={`px-3 py-1.5 text-sm rounded-lg ${
                                        link.active
                                            ? "bg-blue-600 text-white font-medium"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    } ${
                                        !link.url
                                            ? "opacity-50 cursor-not-allowed pointer-events-none"
                                            : ""
                                    } transition-colors`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Simple Pagination for filtered results without meta */}
                {!referrals.meta && filteredReferrals.length > 0 && (
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-600">
                            Showing{" "}
                            <span className="font-medium">
                                1-{Math.min(10, filteredReferrals.length)}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium">
                                {filteredReferrals.length}
                            </span>{" "}
                            referrals
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
