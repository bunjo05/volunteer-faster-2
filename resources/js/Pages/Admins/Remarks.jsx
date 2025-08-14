import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import {
    PencilIcon,
    CheckIcon,
    XMarkIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function Remarks({ reviews = [] }) {
    // Ensure reviews is always an array
    const safeReviews = Array.isArray(reviews) ? reviews : [];

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [editingId, setEditingId] = useState(null);
    const [editedStatus, setEditedStatus] = useState("");

    const filteredReviews = safeReviews.filter((review) => {
        const matchesSearch =
            review.project?.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            review.user?.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            review.comment.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            selectedStatus === "all" ||
            (selectedStatus === "pending" && !review.status) ||
            review.status?.toLowerCase() === selectedStatus.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    const handleStatusUpdate = (reviewId) => {
        router.put(
            route("admin.reviews.update-status", reviewId),
            {
                status: editedStatus,
            },
            {
                onSuccess: () => {
                    setEditingId(null);
                },
            }
        );
    };

    const statusBadge = (status) => {
        const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";

        switch (status) {
            case "Rejected":
                return (
                    <span className={`${baseClasses} bg-red-100 text-red-800`}>
                        Rejected
                    </span>
                );
            case "Resolved":
                return (
                    <span
                        className={`${baseClasses} bg-green-100 text-green-800`}
                    >
                        Resolved
                    </span>
                );
            case "Pending":
                return (
                    <span
                        className={`${baseClasses} bg-yellow-100 text-yellow-800`}
                    >
                        Pending
                    </span>
                );
            default:
                return (
                    <span
                        className={`${baseClasses} bg-gray-100 text-gray-800`}
                    >
                        Pending
                    </span>
                );
        }
    };

    return (
        <AdminLayout>
            <Head title="Project Reviews" />

            <div className="px-4 sm:px-6 lg:px-8 py-8">
                <div className="sm:flex sm:items-center mb-8">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Project Reviews
                        </h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Manage and respond to volunteer reviews of projects
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Search reviews..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <select
                        className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="resolved">Resolved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                {/* Reviews Table */}
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                    >
                                        Project
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Volunteer
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Rating
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Comment
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Status
                                    </th>
                                    <th
                                        scope="col"
                                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                                    >
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {filteredReviews.length > 0 ? (
                                    filteredReviews.map((review) => (
                                        <tr key={review.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                <Link
                                                    href={route(
                                                        "admin.projects.view",
                                                        review.project?.slug
                                                    )}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    {review.project?.title ||
                                                        "Deleted Project"}
                                                </Link>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {review.user?.name ||
                                                    "Anonymous"}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    {[...Array(5)].map(
                                                        (_, i) => (
                                                            <svg
                                                                key={i}
                                                                className={`h-5 w-5 ${
                                                                    i <
                                                                    review.rating
                                                                        ? "text-yellow-400"
                                                                        : "text-gray-300"
                                                                }`}
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                            >
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        )
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">
                                                {review.comment}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {editingId === review.id ? (
                                                    <select
                                                        className="block w-full rounded-md border-gray-300 py-1 pl-2 pr-8 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                        value={
                                                            editedStatus ||
                                                            review.status ||
                                                            "Pending"
                                                        }
                                                        onChange={(e) =>
                                                            setEditedStatus(
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option value="Pending">
                                                            Pending
                                                        </option>
                                                        <option value="Resolved">
                                                            Resolved
                                                        </option>
                                                        <option value="Rejected">
                                                            Rejected
                                                        </option>
                                                    </select>
                                                ) : (
                                                    statusBadge(
                                                        review.status ||
                                                            "Pending"
                                                    )
                                                )}
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                {editingId === review.id ? (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() =>
                                                                handleStatusUpdate(
                                                                    review.id
                                                                )
                                                            }
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            <CheckIcon className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                setEditingId(
                                                                    null
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            <XMarkIcon className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            setEditingId(
                                                                review.id
                                                            );
                                                            setEditedStatus(
                                                                review.status ||
                                                                    "Pending"
                                                            );
                                                        }}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        <PencilIcon className="h-5 w-5" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-6 py-4 text-center text-sm text-gray-500"
                                        >
                                            No reviews found matching your
                                            criteria
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile View */}
                <div className="sm:hidden mt-4 space-y-4">
                    {filteredReviews.length > 0 ? (
                        filteredReviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-white p-4 rounded-lg shadow"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-sm font-medium text-indigo-600">
                                            <Link
                                                href={route(
                                                    "admin.projects.view",
                                                    review.project?.slug
                                                )}
                                            >
                                                {review.project?.title ||
                                                    "Deleted Project"}
                                            </Link>
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            By{" "}
                                            {review.user?.name || "Anonymous"}
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`h-4 w-4 ${
                                                    i < review.rating
                                                        ? "text-yellow-400"
                                                        : "text-gray-300"
                                                }`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>

                                <p className="mt-2 text-sm text-gray-600">
                                    {review.comment}
                                </p>

                                <div className="mt-3 flex justify-between items-center">
                                    <div>
                                        {editingId === review.id ? (
                                            <select
                                                className="block w-full rounded-md border-gray-300 py-1 pl-2 pr-8 text-xs focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                                value={
                                                    editedStatus ||
                                                    review.status ||
                                                    "Pending"
                                                }
                                                onChange={(e) =>
                                                    setEditedStatus(
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="Pending">
                                                    Pending
                                                </option>
                                                <option value="Resolved">
                                                    Resolved
                                                </option>
                                                <option value="Rejected">
                                                    Rejected
                                                </option>
                                            </select>
                                        ) : (
                                            statusBadge(
                                                review.status || "Pending"
                                            )
                                        )}
                                    </div>

                                    {editingId === review.id ? (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() =>
                                                    handleStatusUpdate(
                                                        review.id
                                                    )
                                                }
                                                className="text-green-600 hover:text-green-900"
                                            >
                                                <CheckIcon className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setEditingId(null)
                                                }
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <XMarkIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setEditingId(review.id);
                                                setEditedStatus(
                                                    review.status || "Pending"
                                                );
                                            }}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white p-4 rounded-lg shadow text-center text-sm text-gray-500">
                            No reviews found matching your criteria
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
