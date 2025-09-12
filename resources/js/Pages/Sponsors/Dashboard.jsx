import SponsorLayout from "@/Layouts/SponsorLayout";
import { Head } from "@inertiajs/react";
import React, { useState } from "react";

export default function Dashboard({ auth, sponsorData, flash }) {
    const [activeTab, setActiveTab] = useState("overview");

    // Sample data - replace with actual data from backend
    const dashboardData = sponsorData || {
        totalSponsored: 125000,
        activeProjects: 8,
        impactMetrics: {
            volunteersSupported: 342,
            communitiesReached: 18,
            carbonOffset: 1250, // tons
            socialMediaReach: 245000,
        },
        recentSponsorships: [
            {
                id: 1,
                project: "Ocean Cleanup Initiative",
                amount: 25000,
                date: "2023-10-15",
                status: "active",
            },
            {
                id: 2,
                project: "Education for All",
                amount: 40000,
                date: "2023-09-22",
                status: "active",
            },
            {
                id: 3,
                project: "Reforestation Project",
                amount: 35000,
                date: "2023-08-05",
                status: "completed",
            },
            {
                id: 4,
                project: "Clean Water Access",
                amount: 25000,
                date: "2023-07-18",
                status: "active",
            },
        ],
        upcomingRenewals: [
            {
                id: 5,
                project: "Ocean Cleanup Initiative",
                renewalDate: "2023-12-15",
                amount: 25000,
            },
            {
                id: 6,
                project: "Education for All",
                renewalDate: "2023-11-22",
                amount: 40000,
            },
        ],
        performanceMetrics: {
            roi: 4.2, // For every $1 spent, $4.2 in social value
            employeeEngagement: 78, // Percentage
            brandMentions: 245,
            mediaCoverage: 12,
        },
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            active: "bg-green-100 text-green-800",
            completed: "bg-blue-100 text-blue-800",
            pending: "bg-yellow-100 text-yellow-800",
            cancelled: "bg-red-100 text-red-800",
        };

        return (
            <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                    statusClasses[status] || statusClasses.pending
                }`}
            >
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <SponsorLayout auth={auth}>
            <div>
                {flash?.success && (
                    <div className="alert alert-success">{flash.success}</div>
                )}
                {flash?.error && (
                    <div className="alert alert-danger">{flash.error}</div>
                )}
            </div>

            <Head title="Corporate Sponsor Dashboard" />

            <div className="container mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Corporate Impact Dashboard
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Track your sponsorship impact and manage your corporate
                        social responsibility initiatives
                    </p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="rounded-full bg-indigo-100 p-3 mr-4">
                                <svg
                                    className="w-6 h-6 text-indigo-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Total Sponsored
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(
                                        dashboardData.totalSponsored
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="rounded-full bg-green-100 p-3 mr-4">
                                <svg
                                    className="w-6 h-6 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
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
                                <p className="text-sm font-medium text-gray-600">
                                    Active Projects
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {dashboardData.activeProjects}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="rounded-full bg-purple-100 p-3 mr-4">
                                <svg
                                    className="w-6 h-6 text-purple-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Volunteers Supported
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {
                                        dashboardData.impactMetrics
                                            .volunteersSupported
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="rounded-full bg-blue-100 p-3 mr-4">
                                <svg
                                    className="w-6 h-6 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Social ROI
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {dashboardData.performanceMetrics.roi}x
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab("overview")}
                            className={`py-4 px-1 text-sm font-medium border-b-2 ${
                                activeTab === "overview"
                                    ? "border-indigo-500 text-indigo-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab("sponsorships")}
                            className={`py-4 px-1 text-sm font-medium border-b-2 ${
                                activeTab === "sponsorships"
                                    ? "border-indigo-500 text-indigo-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            My Sponsorships
                        </button>
                        <button
                            onClick={() => setActiveTab("impact")}
                            className={`py-4 px-1 text-sm font-medium border-b-2 ${
                                activeTab === "impact"
                                    ? "border-indigo-500 text-indigo-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            Impact Analytics
                        </button>
                        <button
                            onClick={() => setActiveTab("reports")}
                            className={`py-4 px-1 text-sm font-medium border-b-2 ${
                                activeTab === "reports"
                                    ? "border-indigo-500 text-indigo-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            Reports
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                {activeTab === "overview" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Sponsorships */}
                        <div className="lg:col-span-2">
                            <div className="bg-white shadow rounded-lg overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Recent Sponsorships
                                    </h3>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    {dashboardData.recentSponsorships.map(
                                        (sponsorship) => (
                                            <div
                                                key={sponsorship.id}
                                                className="px-6 py-4"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-900">
                                                            {
                                                                sponsorship.project
                                                            }
                                                        </h4>
                                                        <p className="text-sm text-gray-500">
                                                            {new Date(
                                                                sponsorship.date
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center space-x-4">
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {formatCurrency(
                                                                sponsorship.amount
                                                            )}
                                                        </span>
                                                        {getStatusBadge(
                                                            sponsorship.status
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                                <div className="px-6 py-4 bg-gray-50">
                                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                        View all sponsorships →
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Renewals */}
                        <div>
                            <div className="bg-white shadow rounded-lg overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Upcoming Renewals
                                    </h3>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    {dashboardData.upcomingRenewals.map(
                                        (renewal) => (
                                            <div
                                                key={renewal.id}
                                                className="px-6 py-4"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-900">
                                                            {renewal.project}
                                                        </h4>
                                                        <p className="text-sm text-gray-500">
                                                            Due{" "}
                                                            {new Date(
                                                                renewal.renewalDate
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {formatCurrency(
                                                            renewal.amount
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                                <div className="px-6 py-4 bg-gray-50">
                                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                        Manage renewals →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "sponsorships" && (
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">
                                My Sponsorships
                            </h3>
                            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                                New Sponsorship
                            </button>
                        </div>
                        <div className="px-6 py-4">
                            <p className="text-gray-600">
                                Detailed sponsorship management view would go
                                here.
                            </p>
                            {/* This would include a full table with filtering, sorting, etc. */}
                        </div>
                    </div>
                )}

                {activeTab === "impact" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Impact Metrics
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Communities Reached
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {
                                            dashboardData.impactMetrics
                                                .communitiesReached
                                        }
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Carbon Offset (tons)
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {dashboardData.impactMetrics.carbonOffset.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Social Media Reach
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {dashboardData.impactMetrics.socialMediaReach.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Performance Metrics
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Employee Engagement
                                    </p>
                                    <div className="flex items-center">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className="bg-green-600 h-2.5 rounded-full"
                                                style={{
                                                    width: `${dashboardData.performanceMetrics.employeeEngagement}%`,
                                                }}
                                            ></div>
                                        </div>
                                        <span className="ml-2 text-sm font-medium">
                                            {
                                                dashboardData.performanceMetrics
                                                    .employeeEngagement
                                            }
                                            %
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Brand Mentions
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {
                                            dashboardData.performanceMetrics
                                                .brandMentions
                                        }
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Media Coverage
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {
                                            dashboardData.performanceMetrics
                                                .mediaCoverage
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "reports" && (
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Reports & Analytics
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                                <div className="bg-blue-100 p-3 rounded-lg inline-block mb-3">
                                    <svg
                                        className="w-6 h-6 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
                                    </svg>
                                </div>
                                <h4 className="font-medium text-gray-900">
                                    Financial Report
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    Quarterly sponsorship financials
                                </p>
                            </div>
                            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                                <div className="bg-green-100 p-3 rounded-lg inline-block mb-3">
                                    <svg
                                        className="w-6 h-6 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                        />
                                    </svg>
                                </div>
                                <h4 className="font-medium text-gray-900">
                                    Impact Report
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    Measure your social impact
                                </p>
                            </div>
                            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                                <div className="bg-purple-100 p-3 rounded-lg inline-block mb-3">
                                    <svg
                                        className="w-6 h-6 text-purple-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                        />
                                    </svg>
                                </div>
                                <h4 className="font-medium text-gray-900">
                                    ESG Compliance
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    Environmental, Social, Governance
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </SponsorLayout>
    );
}
