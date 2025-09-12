import AdminLayout from "@/Layouts/AdminLayout";
import React, { useState } from "react";
import { router } from "@inertiajs/react";
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
} from "@heroicons/react/24/outline";

export default function Index({ sponsorships }) {
    const [selectedSponsorship, setSelectedSponsorship] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [statusToUpdate, setStatusToUpdate] = useState("");

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
                bg: "bg-yellow-100",
                text: "text-yellow-800",
                icon: "⏳",
            },
            Approved: {
                bg: "bg-green-100",
                text: "text-green-800",
                icon: "✅",
            },
            Rejected: {
                bg: "bg-red-100",
                text: "text-red-800",
                icon: "❌",
            },
        };

        const config = statusConfig[status] || statusConfig.Pending;

        return (
            <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
            >
                <span className="mr-1">{config.icon}</span>
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

    return (
        <AdminLayout>
            <div className="px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="sm:flex-auto">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Sponsorship Requests
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Manage and review all volunteer sponsorship
                            applications
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">
                                {sponsorships.length} request
                                {sponsorships.length !== 1 ? "s" : ""}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                            >
                                                Volunteer
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Project
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Amount
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Status
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Created
                                            </th>
                                            <th
                                                scope="col"
                                                className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                                            >
                                                <span className="sr-only">
                                                    Actions
                                                </span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {sponsorships.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan="6"
                                                    className="px-3 py-12 text-center"
                                                >
                                                    <div className="text-gray-400">
                                                        <UserCircleIcon className="mx-auto h-12 w-12" />
                                                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                                                            No sponsorship
                                                            requests
                                                        </h3>
                                                        <p className="mt-1 text-sm text-gray-500">
                                                            Get started by
                                                            promoting your
                                                            projects to
                                                            volunteers.
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            sponsorships.map((sponsorship) => (
                                                <tr
                                                    key={sponsorship.id}
                                                    className="hover:bg-gray-50 transition-colors duration-150"
                                                >
                                                    <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-6">
                                                        <div className="flex items-center">
                                                            <div className="h-11 w-11 flex-shrink-0">
                                                                <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                                                    <span className="text-indigo-600 font-semibold text-lg">
                                                                        {sponsorship.user_name
                                                                            .charAt(
                                                                                0
                                                                            )
                                                                            .toUpperCase()}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="font-medium text-gray-900">
                                                                    {
                                                                        sponsorship.user_name
                                                                    }
                                                                </div>
                                                                <div className="text-gray-500 text-sm">
                                                                    {
                                                                        sponsorship.user_email
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                                        <div className="max-w-xs truncate">
                                                            {
                                                                sponsorship.project_title
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-900">
                                                        <div className="flex items-center">
                                                            <CurrencyDollarIcon className="h-4 w-4 text-gray-400 mr-1" />
                                                            {formatCurrency(
                                                                sponsorship.total_amount
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-5 text-sm">
                                                        {getStatusBadge(
                                                            sponsorship.status
                                                        )}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                                                            {formatDate(
                                                                sponsorship.created_at
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                        <div className="flex items-center justify-end space-x-2">
                                                            <button
                                                                onClick={() =>
                                                                    openDetails(
                                                                        sponsorship
                                                                    )
                                                                }
                                                                className="text-indigo-600 hover:text-indigo-900 p-1 rounded-md hover:bg-indigo-50 transition-colors"
                                                                title="View details"
                                                            >
                                                                <EyeIcon className="h-5 w-5" />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    openStatusModal(
                                                                        sponsorship,
                                                                        "Approved"
                                                                    )
                                                                }
                                                                className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50 transition-colors"
                                                                title="Approve"
                                                            >
                                                                <CheckCircleIcon className="h-5 w-5" />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    openStatusModal(
                                                                        sponsorship,
                                                                        "Rejected"
                                                                    )
                                                                }
                                                                className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
                                                                title="Reject"
                                                            >
                                                                <XCircleIcon className="h-5 w-5" />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    deleteSponsorship(
                                                                        sponsorship.id
                                                                    )
                                                                }
                                                                className="text-gray-600 hover:text-gray-900 p-1 rounded-md hover:bg-gray-50 transition-colors"
                                                                title="Delete"
                                                            >
                                                                <TrashIcon className="h-5 w-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detail Modal */}
                {showDetailModal && selectedSponsorship && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <div
                                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                                onClick={() => setShowDetailModal(false)}
                            ></div>

                            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                                <div className="bg-white px-6 py-4">
                                    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                                        <div className="flex items-center">
                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mr-4">
                                                <span className="text-indigo-600 font-semibold text-xl">
                                                    {selectedSponsorship.user_name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900">
                                                    Sponsorship Application
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {
                                                        selectedSponsorship.user_name
                                                    }{" "}
                                                    •{" "}
                                                    {formatDate(
                                                        selectedSponsorship.created_at
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() =>
                                                setShowDetailModal(false)
                                            }
                                            className="rounded-md bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <span className="sr-only">
                                                Close
                                            </span>
                                            <XCircleIcon className="h-6 w-6" />
                                        </button>
                                    </div>

                                    <div className="mt-6 space-y-6">
                                        {/* Volunteer & Project Info */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                    <UserCircleIcon className="h-5 w-5 mr-2 text-indigo-600" />
                                                    Volunteer Information
                                                </h4>
                                                <div className="space-y-2 text-sm">
                                                    <p>
                                                        <span className="font-medium">
                                                            Name:
                                                        </span>{" "}
                                                        {
                                                            selectedSponsorship.user_name
                                                        }
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">
                                                            Email:
                                                        </span>{" "}
                                                        {
                                                            selectedSponsorship.user_email
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                    <DocumentTextIcon className="h-5 w-5 mr-2 text-indigo-600" />
                                                    Project Details
                                                </h4>
                                                <div className="space-y-2 text-sm">
                                                    <p>
                                                        <span className="font-medium">
                                                            Project:
                                                        </span>{" "}
                                                        {
                                                            selectedSponsorship.project_title
                                                        }
                                                    </p>
                                                    {selectedSponsorship.start_date &&
                                                        selectedSponsorship.end_date && (
                                                            <p className="flex items-center">
                                                                <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                                                                <span className="font-medium">
                                                                    Dates:
                                                                </span>{" "}
                                                                {formatDate(
                                                                    selectedSponsorship.start_date
                                                                )}{" "}
                                                                -{" "}
                                                                {formatDate(
                                                                    selectedSponsorship.end_date
                                                                )}
                                                            </p>
                                                        )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Funding Breakdown */}
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                                                <CurrencyDollarIcon className="h-5 w-5 mr-2 text-indigo-600" />
                                                Funding Breakdown
                                            </h4>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                                                                className="bg-white rounded-lg p-3 shadow-sm"
                                                            >
                                                                <p className="text-sm font-medium text-gray-600">
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
                                                    <span className="text-2xl font-bold text-indigo-600">
                                                        {formatCurrency(
                                                            selectedSponsorship.total_amount
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Personal Statement */}
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                <DocumentTextIcon className="h-5 w-5 mr-2 text-indigo-600" />
                                                Personal Statement
                                            </h4>
                                            <p className="text-gray-700 leading-relaxed">
                                                {
                                                    selectedSponsorship.self_introduction
                                                }
                                            </p>
                                        </div>

                                        {/* Skills */}
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                <AcademicCapIcon className="h-5 w-5 mr-2 text-indigo-600" />
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

                                        {/* Expected Impact */}
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                <LightBulbIcon className="h-5 w-5 mr-2 text-indigo-600" />
                                                Expected Impact
                                            </h4>
                                            <p className="text-gray-700 leading-relaxed">
                                                {selectedSponsorship.impact}
                                            </p>
                                        </div>

                                        {/* Commitments */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h4 className="font-semibold text-gray-900 mb-2">
                                                    Commitment
                                                </h4>
                                                <div
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                        selectedSponsorship.commitment
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}
                                                >
                                                    {selectedSponsorship.commitment
                                                        ? "✓ Committed to updates"
                                                        : "No commitment"}
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h4 className="font-semibold text-gray-900 mb-2">
                                                    Agreement
                                                </h4>
                                                <div
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                        selectedSponsorship.agreement
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {selectedSponsorship.agreement
                                                        ? "✓ Terms accepted"
                                                        : "Terms not accepted"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end space-x-3 border-t border-gray-200 pt-4">
                                        <button
                                            onClick={() =>
                                                setShowDetailModal(false)
                                            }
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
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
                                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                                        >
                                            Approve Request
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Status Update Modal */}
                {showStatusModal && selectedSponsorship && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <div
                                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                                onClick={() => setShowStatusModal(false)}
                            ></div>

                            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
                                <div className="bg-white px-6 py-4">
                                    <div className="flex items-center">
                                        <div
                                            className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${
                                                statusToUpdate === "Approved"
                                                    ? "bg-green-100"
                                                    : "bg-red-100"
                                            }`}
                                        >
                                            {statusToUpdate === "Approved" ? (
                                                <CheckCircleIcon className="h-6 w-6 text-green-600" />
                                            ) : (
                                                <XCircleIcon className="h-6 w-6 text-red-600" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-5">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Update Sponsorship Status
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to{" "}
                                                {statusToUpdate.toLowerCase()}{" "}
                                                the sponsorship request from{" "}
                                                <span className="font-medium">
                                                    {
                                                        selectedSponsorship.user_name
                                                    }
                                                </span>
                                                ?
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse">
                                    <button
                                        onClick={updateStatus}
                                        className={`inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm sm:ml-3 sm:w-auto ${
                                            statusToUpdate === "Approved"
                                                ? "bg-green-600 hover:bg-green-700"
                                                : "bg-red-600 hover:bg-red-700"
                                        }`}
                                    >
                                        Confirm {statusToUpdate}
                                    </button>
                                    <button
                                        onClick={() =>
                                            setShowStatusModal(false)
                                        }
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                    >
                                        Cancel
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
