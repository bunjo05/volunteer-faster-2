import React from "react";
import { Link, useForm } from "@inertiajs/react";
import { Plus } from "lucide-react";

import OrganizationLayout from "@/Layouts/OrganizationLayout";

export default function Projects({ userStatus, projects }) {
    const isActive = userStatus === "Active";
    const isPending = userStatus === "Pending";
    const isSuspended = userStatus === "Suspended";

    const { post } = useForm();

    let tooltipMessage = "";
    if (isPending) {
        tooltipMessage =
            "You can't create a project until your account is Approved.";
    } else if (isSuspended) {
        tooltipMessage =
            "You can't create a project because your account is Suspended.";
    }

    const handleRequestReview = (projectId) => {
        // e.preventDefault();
        post(route("projects.requestReview", projectId), {
            preserveScroll: true,
            onSuccess: () => {
                // console.log("Review requested successfully");
            },
            onError: (errors) => {
                // console.error("Failed to request review:", errors);
            },
        });
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "Active":
                return "bg-green-100 text-green-800";
            case "Pending":
                return "bg-yellow-100 text-yellow-800";
            case "Rejected":
                return "bg-red-100 text-red-800";
            case "Approved":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-200 text-gray-700";
        }
    };

    return (
        <OrganizationLayout>
            <div className="min-h-screen py-10 px-4 sm:px-8 bg-gray-100">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">
                            Projects
                        </h1>
                        <div title={isActive ? "" : tooltipMessage}>
                            <Link
                                disabled={!isActive}
                                href={route("organization.projects.create")}
                                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-md shadow transition duration-200
                                ${
                                    isActive
                                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                            >
                                <Plus className="w-4 h-4" />
                                New Project
                            </Link>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="mb-8">
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Project Cards */}
                    <div className="space-y-6">
                        {projects.length === 0 ? (
                            <p className="text-gray-500">No projects found.</p>
                        ) : (
                            projects.map((project) => (
                                <div
                                    key={project.id}
                                    className="bg-white rounded-lg px-[10px] shadow hover:shadow-md flex items-center transition duration-300 overflow-hidden"
                                >
                                    <div className="relative w-[200px] h-[200px] rounded-xl overflow-hidden shadow-lg border border-gray-200">
                                        {/* Rejected Badge */}
                                        {project.status === "Rejected" && (
                                            <span className="absolute top-2 left-2 flex items-center gap-1 bg-red-500/90 text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
                                                <svg
                                                    className="w-3.5 h-3.5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                                Rejected
                                            </span>
                                        )}

                                        {/* Image */}
                                        <img
                                            src={
                                                project.featured_image
                                                    ? `/storage/${project.featured_image}`
                                                    : "/images/placeholder.jpg"
                                            }
                                            alt={project.title}
                                            className={`object-cover w-full h-full transition-transform duration-300 ease-in-out ${
                                                project.status === "Rejected"
                                                    ? "brightness-75 grayscale"
                                                    : ""
                                            }`}
                                        />
                                    </div>

                                    <div className="w-full p-4 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <h2 className="text-xl font-bold text-gray-900">
                                                    {project.title}
                                                </h2>
                                                <span
                                                    className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusBadgeClass(
                                                        project.status
                                                    )}`}
                                                >
                                                    {project.status}
                                                </span>
                                            </div>

                                            <p className="text-sm text-gray-500 mb-1">
                                                <span className="font-medium">
                                                    Category:
                                                </span>{" "}
                                                {project.category?.name} /{" "}
                                                {project.subcategory?.name}
                                            </p>
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                                                {project.short_description}
                                            </p>

                                            <div className="text-sm text-gray-500 mb-1">
                                                <span className="font-medium">
                                                    Start:
                                                </span>{" "}
                                                {new Date(
                                                    project.start_date
                                                ).toLocaleDateString()}{" "}
                                                &middot;{" "}
                                                <span className="font-medium">
                                                    Duration:
                                                </span>{" "}
                                                {project.duration}{" "}
                                                {project.duration_type}
                                            </div>

                                            {project.fees && (
                                                <div className="text-sm text-gray-500 mb-1">
                                                    <span className="font-medium">
                                                        Fees:
                                                    </span>{" "}
                                                    {project.currency}{" "}
                                                    {project.fees}
                                                </div>
                                            )}

                                            {project.suitable?.length > 0 && (
                                                <div className="text-sm text-gray-500 mb-1">
                                                    <span className="font-medium">
                                                        Suitable for:
                                                    </span>{" "}
                                                    {project.suitable.join(
                                                        ", "
                                                    )}
                                                </div>
                                            )}

                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {project.availability_months?.map(
                                                    (month) => (
                                                        <span
                                                            key={month}
                                                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full"
                                                        >
                                                            {month}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-4">
                                            {/* Request for Review Button */}
                                            {project.status === "Pending" &&
                                                project.request_for_approval ===
                                                    1 && (
                                                    <button
                                                        onClick={() =>
                                                            handleRequestReview(
                                                                project.id
                                                            )
                                                        }
                                                        disabled={
                                                            project.request_for_approval
                                                        }
                                                        className={`px-4 py-2 text-sm font-medium rounded-md transition duration-200 ${
                                                            project.request_for_approval
                                                                ? "bg-gray-400 text-white cursor-not-allowed"
                                                                : "bg-green-600 hover:bg-green-700 text-white"
                                                        }`}
                                                    >
                                                        {project.request_for_approval
                                                            ? "Review Requested"
                                                            : "Request for Review"}
                                                    </button>
                                                )}

                                            {/* Edit Button - Hidden if review is requested */}
                                            {!project.request_for_approval ||
                                                (project.status ===
                                                    "Active" && (
                                                    <Link
                                                        href={route(
                                                            "organization.projects.edit",
                                                            project.slug
                                                        )}
                                                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-md transition duration-200"
                                                    >
                                                        Edit
                                                    </Link>
                                                ))}

                                            {project.status === "Rejected" && (
                                                <Link
                                                    href={route(
                                                        "organization.projects.edit",
                                                        project.slug
                                                    )}
                                                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-md transition duration-200"
                                                >
                                                    Edit
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </OrganizationLayout>
    );
}
