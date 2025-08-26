import AdminLayout from "@/Layouts/AdminLayout";
import React, { useState } from "react";
import { useForm, router } from "@inertiajs/react";
import {
    Star,
    Search,
    Filter,
    MoreVertical,
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    MessageCircle,
    User,
    Calendar,
    Shield,
    ThumbsUp,
    ThumbsDown,
} from "lucide-react";

export default function PlatformReviews({ reviews, filters }) {
    const [selectedReview, setSelectedReview] = useState(null);
    const [statusFilter, setStatusFilter] = useState(filters?.status || "all");
    const [ratingFilter, setRatingFilter] = useState(filters?.rating || "all");
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const { processing } = useForm();

    const statusOptions = [
        { value: "all", label: "All Status", icon: Filter },
        {
            value: "pending",
            label: "Pending",
            icon: Clock,
            color: "text-yellow-600",
        },
        {
            value: "approved",
            label: "Approved",
            icon: CheckCircle,
            color: "text-green-600",
        },
        {
            value: "rejected",
            label: "Rejected",
            icon: XCircle,
            color: "text-red-600",
        },
    ];

    const ratingOptions = [
        { value: "all", label: "All Ratings" },
        { value: "5", label: "5 Stars" },
        { value: "4", label: "4 Stars" },
        { value: "3", label: "3 Stars" },
        { value: "2", label: "2 Stars" },
        { value: "1", label: "1 Star" },
    ];

    const handleStatusChange = (reviewId, newStatus) => {
        if (processing) return;

        router.post(
            route("admin.platform-reviews.update-status", reviewId),
            {
                status: newStatus,
            },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setSelectedReview(null);
                },
                onError: (errors) => {
                    console.error("Error updating status:", errors);
                    alert("Failed to update review status. Please try again.");
                },
            }
        );
    };

    const handleFilter = () => {
        const params = {};
        if (statusFilter !== "all") params.status = statusFilter;
        if (ratingFilter !== "all") params.rating = ratingFilter;
        if (searchTerm) params.search = searchTerm;

        router.get(route("admin.platform.reviews"), params, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setStatusFilter("all");
        setRatingFilter("all");
        setSearchTerm("");
        router.get(
            route("admin.platform.reviews"),
            {},
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
            approved: {
                color: "bg-green-100 text-green-800",
                icon: CheckCircle,
            },
            rejected: { color: "bg-red-100 text-red-800", icon: XCircle },
        };

        const config = statusConfig[status];

        // Handle undefined status gracefully
        if (!config) {
            return (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 flex items-center gap-1 w-fit">
                    <Shield className="w-3 h-3" />
                    {status || "Unknown"}
                </span>
            );
        }

        const Icon = config.icon;

        return (
            <span
                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${config.color}`}
            >
                <Icon className="w-3 h-3" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const renderStars = (rating) => {
        const numericRating = Number(rating);
        if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
            return (
                <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-400">No rating</span>
                </div>
            );
        }

        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${
                            star <= numericRating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                        }`}
                    />
                ))}
                <span className="text-sm text-gray-600 ml-1">
                    ({numericRating})
                </span>
            </div>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Unknown date";

        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch (error) {
            return "Invalid date";
        }
    };

    // Safely handle reviews data
    const filteredReviews = reviews?.data || reviews || [];
    const reviewsTotal = reviews?.total || filteredReviews.length;
    const pendingCount =
        reviews?.pending_count ||
        filteredReviews.filter((r) => r?.status === "pending").length;
    const approvedCount =
        reviews?.approved_count ||
        filteredReviews.filter((r) => r?.status === "approved").length;

    // Calculate average rating safely
    const calculateAverageRating = () => {
        if (!filteredReviews.length) return 0;
        const validRatings = filteredReviews
            .map((r) => Number(r?.rating))
            .filter((rating) => !isNaN(rating) && rating >= 1 && rating <= 5);

        if (!validRatings.length) return 0;
        return (
            validRatings.reduce((sum, rating) => sum + rating, 0) /
            validRatings.length
        ).toFixed(1);
    };

    const averageRating = reviews?.average_rating || calculateAverageRating();

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Platform Reviews
                    </h1>
                    <p className="text-gray-600">
                        Manage and moderate user reviews of the platform
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Total Reviews
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {reviewsTotal}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <MessageCircle className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Pending
                                </p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {pendingCount}
                                </p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Approved
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    {approvedCount}
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Average Rating
                                </p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {averageRating}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Star className="w-6 h-6 text-purple-600 fill-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow mb-8">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            Filters
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Search Reviews
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search by user or message..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {statusOptions.map((option) => {
                                        const Icon = option.icon;
                                        return (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            {/* Rating Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rating
                                </label>
                                <select
                                    value={ratingFilter}
                                    onChange={(e) =>
                                        setRatingFilter(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {ratingOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Clear Filters
                            </button>
                            <button
                                onClick={handleFilter}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Reviews Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User & Rating
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Review
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredReviews.length > 0 ? (
                                    filteredReviews.map((review) => (
                                        <tr
                                            key={review?.id || Math.random()}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <User className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {review?.user
                                                                ?.name ||
                                                                "Unknown User"}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {review?.user
                                                                ?.email ||
                                                                "No email"}
                                                        </div>
                                                        {renderStars(
                                                            review?.rating
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 max-w-md">
                                                    {review?.message ? (
                                                        <p className="line-clamp-2">
                                                            {review.message}
                                                        </p>
                                                    ) : (
                                                        <span className="text-gray-400 italic">
                                                            No message provided
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(review?.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(review?.created_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            setSelectedReview(
                                                                review
                                                            )
                                                        }
                                                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    {review?.status ===
                                                        "pending" && (
                                                        <>
                                                            <button
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        review.id,
                                                                        "approved"
                                                                    )
                                                                }
                                                                disabled={
                                                                    processing
                                                                }
                                                                className="p-2 text-green-600 hover:text-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                title="Approve Review"
                                                            >
                                                                <ThumbsUp className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        review.id,
                                                                        "rejected"
                                                                    )
                                                                }
                                                                disabled={
                                                                    processing
                                                                }
                                                                className="p-2 text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                title="Reject Review"
                                                            >
                                                                <ThumbsDown className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                    {/* Show action buttons for approved/rejected reviews to allow changing status back */}
                                                    {review?.status !==
                                                        "pending" && (
                                                        <div className="flex items-center space-x-1">
                                                            <button
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        review.id,
                                                                        "pending"
                                                                    )
                                                                }
                                                                disabled={
                                                                    processing
                                                                }
                                                                className="p-2 text-yellow-600 hover:text-yellow-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                title="Set to Pending"
                                                            >
                                                                <Clock className="w-4 h-4" />
                                                            </button>
                                                            {review?.status ===
                                                                "approved" && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleStatusChange(
                                                                            review.id,
                                                                            "rejected"
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        processing
                                                                    }
                                                                    className="p-2 text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    title="Reject Review"
                                                                >
                                                                    <ThumbsDown className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                            {review?.status ===
                                                                "rejected" && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleStatusChange(
                                                                            review.id,
                                                                            "approved"
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        processing
                                                                    }
                                                                    className="p-2 text-green-600 hover:text-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    title="Approve Review"
                                                                >
                                                                    <ThumbsUp className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-8 text-center"
                                        >
                                            <div className="text-gray-500">
                                                <MessageCircle className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                                                <p className="text-lg font-medium">
                                                    No reviews found
                                                </p>
                                                <p className="text-sm">
                                                    Try adjusting your filters
                                                    or check back later.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination - Safely handle reviews.meta */}
                    {reviews?.meta && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Showing {reviews.meta.from} to{" "}
                                    {reviews.meta.to} of {reviews.meta.total}{" "}
                                    results
                                </div>
                                <div className="flex space-x-2">
                                    {reviews.meta.links.map((link, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                visit(link.url);
                                            }}
                                            disabled={!link.url || processing}
                                            className={`px-3 py-1 rounded-md ${
                                                link.active
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                            } ${
                                                !link.url || processing
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Review Detail Modal */}
                {selectedReview && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Review Details
                                    </h3>
                                    <button
                                        onClick={() => setSelectedReview(null)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <XCircle className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* User Info */}
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">
                                            {selectedReview.user?.name ||
                                                "Unknown User"}
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            {selectedReview.user?.email ||
                                                "No email"}
                                        </p>
                                        <div className="mt-1">
                                            {renderStars(selectedReview.rating)}
                                        </div>
                                    </div>
                                </div>

                                {/* Review Content */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                                        Review Message
                                    </h4>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        {selectedReview.message ? (
                                            <p className="text-gray-800">
                                                {selectedReview.message}
                                            </p>
                                        ) : (
                                            <p className="text-gray-400 italic">
                                                No message provided
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Metadata */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                                            Status
                                        </h4>
                                        {getStatusBadge(selectedReview.status)}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                                            Submitted
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {formatDate(
                                                selectedReview.created_at
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={() => {
                                            handleStatusChange(
                                                selectedReview.id,
                                                "pending"
                                            );
                                        }}
                                        disabled={processing}
                                        className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                    >
                                        <Clock className="w-4 h-4" />
                                        <span>Set to Pending</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleStatusChange(
                                                selectedReview.id,
                                                "approved"
                                            );
                                        }}
                                        disabled={processing}
                                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                    >
                                        <ThumbsUp className="w-4 h-4" />
                                        <span>Approve Review</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleStatusChange(
                                                selectedReview.id,
                                                "rejected"
                                            );
                                        }}
                                        disabled={processing}
                                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                    >
                                        <ThumbsDown className="w-4 h-4" />
                                        <span>Reject Review</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
