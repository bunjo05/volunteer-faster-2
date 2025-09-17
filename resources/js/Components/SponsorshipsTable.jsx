import React, { useState } from "react";
// import { Inertia } from "@inertiajs/inertia";

const SponsorshipsTable = ({ sponsorships, filters }) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
            completed: "bg-blue-50 text-blue-700 border border-blue-200",
            pending: "bg-amber-50 text-amber-700 border border-amber-200",
            cancelled: "bg-rose-50 text-rose-700 border border-rose-200",
            failed: "bg-red-50 text-red-700 border border-red-200",
            refunded: "bg-slate-100 text-slate-700 border border-slate-200",
        };

        return (
            <span
                className={`px-3 py-1.5 text-xs font-medium rounded-full inline-flex items-center transition-colors ${
                    statusClasses[status] || statusClasses.pending
                }`}
            >
                <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getOrganizationName = (sponsorship) => {
        if (sponsorship.organizationProfile?.name) {
            return sponsorship.organizationProfile.name;
        }
        if (sponsorship.organization?.name) {
            return sponsorship.organization.name;
        }
        if (sponsorship.booking?.project?.organization_name) {
            return sponsorship.booking.project.organization_name;
        }
        return "Unknown Organization";
    };

    const getOrganizationLogo = (sponsorship) => {
        if (sponsorship.booking?.project?.organizationProfile?.logo) {
            return sponsorship.booking.project.organizationProfile.logo;
        }
        if (sponsorship.organization?.logo) {
            return sponsorship.organization.logo;
        }
        return null;
    };

    const CardView = ({ sponsorship }) => {
        const orgName = getOrganizationName(sponsorship);
        const orgLogo = getOrganizationLogo(sponsorship);

        return (
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:border-gray-200">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start space-x-3">
                        {orgLogo ? (
                            <img
                                src={orgLogo}
                                alt={orgName}
                                className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                            />
                        ) : (
                            <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 flex items-center justify-center">
                                <svg
                                    className="h-6 w-6 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m2 0H5m2 0H3m2 0h2M7 7h10M7 11h10M7 15h10"
                                    />
                                </svg>
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
                                {sponsorship.booking?.project?.title ||
                                    "Unknown Project"}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                                {orgName}
                            </p>
                        </div>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                        {getStatusBadge(sponsorship.status)}
                    </div>
                </div>

                <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">
                            Amount
                        </span>
                        <span className="font-semibold text-gray-900 bg-gray-50 px-2 py-1 rounded-md">
                            {formatCurrency(sponsorship.amount)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Date</span>
                        <span className="text-gray-700 bg-gray-50 px-2 py-1 rounded-md">
                            {formatDate(sponsorship.created_at)}
                        </span>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                                Reference ID
                            </span>
                            <span className="text-xs font-mono text-gray-600">
                                {sponsorship.public_id.slice(-8)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-6 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-gray-50">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 font-display">
                            Sponsorship Portfolio
                        </h2>
                        <p className="text-sm text-gray-600 mt-2">
                            Track and manage your charitable contributions and
                            impact
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center group">
                            <svg
                                className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                            </svg>
                            New Sponsorship
                        </button>

                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="border border-gray-300 text-gray-700 px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all duration-300 flex items-center justify-center sm:hidden"
                        >
                            <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
                                />
                            </svg>
                            Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="px-6 py-4 border-b border-gray-100 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <label className="text-sm font-medium text-gray-700">
                            Show:
                        </label>
                        <select
                            value={filters.perPage || 10}
                            onChange={(e) => {
                                Inertia.get(route("sponsors.dashboard"), {
                                    perPage: e.target.value,
                                });
                            }}
                            className="border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-offset-1 transition-colors"
                        >
                            <option value="5">5 per page</option>
                            <option value="10">10 per page</option>
                            <option value="25">25 per page</option>
                            <option value="50">50 per page</option>
                        </select>
                    </div>
                    <div className="text-sm text-gray-600">
                        Total:{" "}
                        <span className="font-semibold text-gray-900">
                            {sponsorships.total}
                        </span>{" "}
                        sponsorships
                    </div>
                </div>
            </div>

            {/* Mobile View - Cards */}
            <div className="sm:hidden p-6 space-y-4 bg-gray-50">
                {sponsorships.data.map((sponsorship) => (
                    <CardView
                        key={sponsorship.public_id}
                        sponsorship={sponsorship}
                    />
                ))}
            </div>

            {/* Desktop View - Table */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Project & Organization
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Amount
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sponsorships.data.map((sponsorship) => {
                            const orgName = getOrganizationName(sponsorship);
                            const orgLogo = getOrganizationLogo(sponsorship);

                            return (
                                <tr
                                    key={sponsorship.public_id}
                                    className="hover:bg-gray-50 transition-colors duration-300 group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-4">
                                            {orgLogo ? (
                                                <img
                                                    src={orgLogo}
                                                    alt={orgName}
                                                    className="h-12 w-12 rounded-xl object-cover border border-gray-200"
                                                />
                                            ) : (
                                                <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 flex items-center justify-center">
                                                    <svg
                                                        className="h-6 w-6 text-blue-600"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m2 0H5m2 0H3m2 0h2M7 7h10M7 11h10M7 15h10"
                                                        />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    {sponsorship.booking
                                                        ?.project?.title ||
                                                        "Unknown Project"}
                                                </div>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {orgName}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1 font-mono">
                                                    ID:{" "}
                                                    {sponsorship.public_id.slice(
                                                        -8
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 bg-gray-50 px-3 py-1.5 rounded-lg inline-block">
                                            {formatDate(sponsorship.created_at)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold text-gray-900 bg-blue-50 px-3 py-1.5 rounded-lg">
                                            {formatCurrency(sponsorship.amount)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(sponsorship.status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-lg hover:bg-blue-50">
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
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
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {sponsorships.links && sponsorships.links.length > 3 && (
                <div className="px-6 py-5 bg-gray-50 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                        <div className="text-sm text-gray-700">
                            Showing{" "}
                            <span className="font-semibold text-gray-900">
                                {sponsorships.from}
                            </span>{" "}
                            to{" "}
                            <span className="font-semibold text-gray-900">
                                {sponsorships.to}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-gray-900">
                                {sponsorships.total}
                            </span>{" "}
                            sponsorships
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {sponsorships.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        if (link.url) {
                                            Inertia.visit(link.url);
                                        }
                                    }}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                                        link.active
                                            ? "bg-blue-600 text-white shadow-sm"
                                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                                    } ${
                                        !link.url
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:shadow-md"
                                    } min-w-[44px] h-[44px] flex items-center justify-center`}
                                    disabled={!link.url}
                                >
                                    {link.label
                                        .replace("&laquo;", "←")
                                        .replace("&raquo;", "→")}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SponsorshipsTable;
