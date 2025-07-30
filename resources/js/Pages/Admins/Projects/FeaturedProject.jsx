import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { format } from "date-fns";
import AdminLayout from "@/Layouts/AdminLayout";

export default function FeaturedProject({ featuredProjects }) {
    const [rejectionReason, setRejectionReason] = useState("");
    const [selectedProject, setSelectedProject] = useState(null);

    const handleStatusChange = (projectId, status) => {
        if (status === "rejected") {
            setSelectedProject(projectId);
            return;
        }

        router.put(route("admin.featured-projects.update-status", projectId), {
            status,
            rejection_reason: null,
        });
    };

    const submitRejection = () => {
        if (!rejectionReason.trim()) {
            alert("Please provide a reason for rejection");
            return;
        }

        router.put(
            route("admin.featured-projects.update-status", selectedProject),
            {
                status: "rejected",
                rejection_reason: rejectionReason,
            },
            {
                onSuccess: () => {
                    setSelectedProject(null);
                    setRejectionReason("");
                },
            }
        );
    };

    const getPlanDuration = (planType) => {
        switch (planType) {
            case "1_month":
                return "1 Month";
            case "3_months":
                return "3 Months";
            case "6_months":
                return "6 Months";
            case "1_year":
                return "1 Year";
            default:
                return planType;
        }
    };

    const formatAmount = (amount) => {
        const num = parseFloat(amount);
        return isNaN(num) ? "$0.00" : `$${num.toFixed(2)}`;
    };

    return (
        <AdminLayout
            header={
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800 leading-tight">
                        Featured Projects Management
                    </h2>
                    <div className="text-sm text-gray-500">
                        {featuredProjects.length}{" "}
                        {featuredProjects.length === 1 ? "project" : "projects"}
                    </div>
                </div>
            }
        >
            <Head title="Featured Projects" />

            <div className="py-4">
                <div className="mx-auto px-2 sm:px-4 lg:px-6">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div className="p-4 sm:p-6 bg-white">
                            <div className="mb-4">
                                <p className="text-sm sm:text-base text-gray-600">
                                    Review and manage featured project
                                    submissions. Approve or reject requests with
                                    feedback.
                                </p>
                            </div>

                            {/* Mobile Cards View */}
                            <div className="md:hidden space-y-4">
                                {featuredProjects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="border border-gray-200 rounded-lg p-4"
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 text-blue-600"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    href={route(
                                                        "admin.projects.view",
                                                        project.project.slug
                                                    )}
                                                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline truncate"
                                                >
                                                    {project.project.title}
                                                </Link>
                                                <p className="text-xs text-gray-500">
                                                    Submitted:{" "}
                                                    {format(
                                                        new Date(
                                                            project.created_at
                                                        ),
                                                        "MMM d, yyyy"
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-3 grid grid-cols-2 gap-2">
                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    User
                                                </p>
                                                <p className="text-sm font-medium">
                                                    {project.user.name}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Plan
                                                </p>
                                                <p className="text-sm font-medium">
                                                    {getPlanDuration(
                                                        project.plan_type
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Amount
                                                </p>
                                                <p className="text-sm font-medium">
                                                    {formatAmount(
                                                        project.amount
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Status
                                                </p>
                                                <span
                                                    className={`px-2 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full
                                                    ${
                                                        project.status ===
                                                        "approved"
                                                            ? "bg-green-100 text-green-800"
                                                            : project.status ===
                                                              "rejected"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                                >
                                                    {project.status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        project.status.slice(1)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <p className="text-xs text-gray-500">
                                                Dates
                                            </p>
                                            {project.start_date ? (
                                                <div className="text-sm">
                                                    <div className="flex items-center">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-3 w-3 text-gray-500 mr-1"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                            />
                                                        </svg>
                                                        {format(
                                                            new Date(
                                                                project.start_date
                                                            ),
                                                            "MMM d, yyyy"
                                                        )}
                                                    </div>
                                                    {project.end_date && (
                                                        <div className="flex items-center mt-1">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-3 w-3 text-gray-500 mr-1"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                />
                                                            </svg>
                                                            {format(
                                                                new Date(
                                                                    project.end_date
                                                                ),
                                                                "MMM d, yyyy"
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-500 italic">
                                                    Not started
                                                </span>
                                            )}
                                        </div>

                                        {project.rejection_reason && (
                                            <div className="mt-2">
                                                <p className="text-xs text-gray-500">
                                                    Rejection Reason
                                                </p>
                                                <p className="text-xs text-gray-700">
                                                    {project.rejection_reason}
                                                </p>
                                            </div>
                                        )}

                                        {project.status === "pending" && (
                                            <div className="mt-4 flex space-x-2">
                                                <button
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            project.id,
                                                            "approved"
                                                        )
                                                    }
                                                    className="flex-1 inline-flex justify-center items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            project.id,
                                                            "rejected"
                                                        )
                                                    }
                                                    className="flex-1 inline-flex justify-center items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Project
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Plan
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Dates
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {featuredProjects.map((project) => (
                                            <tr
                                                key={project.id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-5 w-5 text-blue-600"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </div>
                                                        <div className="ml-4">
                                                            <Link
                                                                href={route(
                                                                    "admin.projects.view",
                                                                    project
                                                                        .project
                                                                        .slug
                                                                )}
                                                                className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                                            >
                                                                {
                                                                    project
                                                                        .project
                                                                        .title
                                                                }
                                                            </Link>
                                                            <div className="text-xs text-gray-500">
                                                                Submitted:{" "}
                                                                {format(
                                                                    new Date(
                                                                        project.created_at
                                                                    ),
                                                                    "MMM d, yyyy"
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 font-medium">
                                                        {project.user.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {project.user.email}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                        {getPlanDuration(
                                                            project.plan_type
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {formatAmount(
                                                        project.amount
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    {project.start_date ? (
                                                        <div className="text-sm text-gray-900">
                                                            <div className="flex items-center">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-4 w-4 text-gray-500 mr-1"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                    />
                                                                </svg>
                                                                {format(
                                                                    new Date(
                                                                        project.start_date
                                                                    ),
                                                                    "MMM d, yyyy"
                                                                )}
                                                            </div>
                                                            {project.end_date && (
                                                                <div className="flex items-center mt-1">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-4 w-4 text-gray-500 mr-1"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={
                                                                                2
                                                                            }
                                                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                        />
                                                                    </svg>
                                                                    {format(
                                                                        new Date(
                                                                            project.end_date
                                                                        ),
                                                                        "MMM d, yyyy"
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-gray-500 italic">
                                                            Not started
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span
                                                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                                                            ${
                                                                project.status ===
                                                                "approved"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : project.status ===
                                                                      "rejected"
                                                                    ? "bg-red-100 text-red-800"
                                                                    : "bg-yellow-100 text-yellow-800"
                                                            }`}
                                                        >
                                                            {project.status
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                project.status.slice(
                                                                    1
                                                                )}
                                                        </span>
                                                        {project.rejection_reason && (
                                                            <div className="mt-1 text-xs text-gray-500 max-w-xs">
                                                                <span className="font-medium">
                                                                    Note:
                                                                </span>{" "}
                                                                <div className="w-1/2">
                                                                    {
                                                                        project.rejection_reason
                                                                    }
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {project.status ===
                                                        "pending" && (
                                                        <div className="flex justify-end space-x-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        project.id,
                                                                        "approved"
                                                                    )
                                                                }
                                                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        project.id,
                                                                        "rejected"
                                                                    )
                                                                }
                                                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    )}
                                                    {project.status !==
                                                        "pending" && (
                                                        <span className="text-xs text-gray-500">
                                                            Action completed
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rejection Reason Modal */}
            {selectedProject && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-2">
                        <div className="p-4 sm:p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Reason for Rejection
                                </h3>
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="rejection-reason"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Please explain why this submission is being
                                    rejected
                                </label>
                                <textarea
                                    id="rejection-reason"
                                    value={rejectionReason}
                                    onChange={(e) =>
                                        setRejectionReason(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    rows="4"
                                    placeholder="Provide specific feedback..."
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitRejection}
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Confirm Rejection
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
