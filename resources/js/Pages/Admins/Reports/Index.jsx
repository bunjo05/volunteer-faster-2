import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import React, { useState } from "react";

export default function Index({ reports }) {
    const [selectedReport, setSelectedReport] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (report) => {
        setSelectedReport(report);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedReport(null);
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

        const minute = 60;
        const hour = minute * 60;
        const day = hour * 24;
        const month = day * 30;
        const year = day * 365;

        if (seconds < minute) return "Just now";
        if (seconds < hour)
            return rtf.format(-Math.floor(seconds / minute), "minute");
        if (seconds < day)
            return rtf.format(-Math.floor(seconds / hour), "hour");
        if (seconds < month)
            return rtf.format(-Math.floor(seconds / day), "day");
        if (seconds < year)
            return rtf.format(-Math.floor(seconds / month), "month");

        return rtf.format(-Math.floor(seconds / year), "year");
    };

    return (
        <AdminLayout>
            <Head title="Reports Management" />

            <div className="py-4 sm:py-6 px-2 sm:px-4 lg:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-4">
                        <div>
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                                Volunteer Reports
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                                Review and manage all submitted volunteer
                                reports
                            </p>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                            <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs sm:text-sm font-medium">
                                {reports.length}{" "}
                                {reports.length === 1 ? "Report" : "Reports"}
                            </span>
                        </div>
                    </div>

                    <div className="bg-white shadow-md sm:shadow-lg rounded-lg sm:rounded-xl overflow-hidden border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Project
                                        </th>
                                        <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Reported By
                                        </th>
                                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reports.map((report) => (
                                        <tr
                                            key={report.id}
                                            className="hover:bg-gray-50 transition-colors duration-150"
                                        >
                                            <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="hidden sm:flex flex-shrink-0 h-8 sm:h-10 w-8 sm:w-10 bg-indigo-50 rounded-lg items-center justify-center mr-2 sm:mr-3">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 sm:h-5 w-4 sm:w-5 text-indigo-600"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm sm:text-base font-medium text-gray-900">
                                                            {report.project
                                                                ?.title ||
                                                                "N/A"}
                                                        </div>
                                                        <div className="text-xs sm:text-sm text-gray-500">
                                                            {report
                                                                .report_subcategory
                                                                ?.name || "N/A"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {report.report_category
                                                        ?.name || "N/A"}
                                                </span>
                                            </td> */}
                                            <td className="hidden sm:table-cell px-4 py-3 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                                        <span className="text-gray-600 text-sm font-medium">
                                                            {report.user?.name?.charAt(
                                                                0
                                                            ) || "?"}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {report.user
                                                                ?.name ||
                                                                "Anonymous"}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {report.user
                                                                ?.email || ""}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                                                <div className="text-xs sm:text-sm text-gray-900">
                                                    {new Date(
                                                        report.created_at
                                                    ).toLocaleDateString()}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {formatTimeAgo(
                                                        report.created_at
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                                                <button
                                                    onClick={() =>
                                                        openModal(report)
                                                    }
                                                    className="text-indigo-600 hover:text-indigo-900 flex items-center"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4 sm:h-5 sm:w-5 mr-1"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                        />
                                                    </svg>
                                                    <span className="hidden sm:inline">
                                                        View
                                                    </span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {reports.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="px-4 py-8 sm:py-12 text-center"
                                            >
                                                <svg
                                                    className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-gray-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1}
                                                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                <h3 className="mt-2 text-base sm:text-lg font-medium text-gray-900">
                                                    No reports found
                                                </h3>
                                                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                                                    There are currently no
                                                    volunteer reports to
                                                    display.
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Report Details Modal */}
                {isModalOpen && selectedReport && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                            {/* Modal Header */}
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            Report Details
                                        </h2>
                                        <div className="flex items-center mt-2">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                                                {selectedReport.report_category
                                                    ?.name || "N/A"}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {new Date(
                                                    selectedReport.created_at
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={closeModal}
                                        className="text-gray-400 hover:text-gray-500 p-1 rounded-md hover:bg-gray-100"
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
                            </div>

                            {/* Scrollable Content Area */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">
                                                Project
                                            </h3>
                                            <p className="mt-1 text-sm font-medium text-gray-900">
                                                {selectedReport.project
                                                    ?.title || "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">
                                                Subcategory
                                            </h3>
                                            <p className="mt-1 text-sm font-medium text-gray-900">
                                                {selectedReport
                                                    .report_subcategory?.name ||
                                                    "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">
                                                Reported By
                                            </h3>
                                            <p className="mt-1 text-sm font-medium text-gray-900">
                                                {selectedReport.user?.name ||
                                                    "Anonymous"}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">
                                                Contact Email
                                            </h3>
                                            <p className="mt-1 text-sm font-medium text-gray-900">
                                                {selectedReport.user?.email ||
                                                    "N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4">
                                        <h3 className="text-sm font-medium text-gray-500">
                                            Description
                                        </h3>
                                        <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-gray-700 whitespace-pre-line">
                                                {selectedReport.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="border-t border-gray-200 p-6">
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={closeModal}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => {
                                            // Add action for resolving report
                                            closeModal();
                                        }}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        Mark as Resolved
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
