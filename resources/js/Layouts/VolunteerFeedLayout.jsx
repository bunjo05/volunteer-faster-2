import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import VolunteerLayout from "@/Layouts/VolunteerLayout";

export default function VolunteerFeedLayout({ children }) {
    const [activeFilter, setActiveFilter] = useState("all");

    const filters = [
        { id: "all", label: "All Activities" },
        { id: "upcoming", label: "Upcoming Events" },
        { id: "urgent", label: "Urgent Needs" },
        { id: "stories", label: "Success Stories" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Header Section */}
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <h1 className="text-3xl font-bold text-indigo-700 mb-4 md:mb-0">
                            Volunteer Feed
                        </h1>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-64">
                            <input
                                type="text"
                                placeholder="Search opportunities..."
                                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            <svg
                                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="mt-6 flex flex-wrap gap-2">
                        {filters.map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setActiveFilter(filter.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    activeFilter === filter.id
                                        ? "bg-indigo-600 text-white shadow-md"
                                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Feed Content */}
                    <div className="lg:col-span-2">
                        {children}

                        {/* Sample Feed Items */}
                        <div className="space-y-6">
                            {/* Feed Item 1 */}
                            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg">
                                <div className="p-6">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-6 w-6 text-indigo-600"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                Community Cleanup Day
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Posted by Green City Initiative
                                                • 2 hours ago
                                            </p>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-gray-600">
                                        Join us this Saturday for a community
                                        cleanup at Riverside Park. We'll be
                                        planting trees, picking up litter, and
                                        creating a better environment for
                                        everyone.
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                            Environment
                                        </span>
                                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                            Outdoors
                                        </span>
                                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                                            Family Friendly
                                        </span>
                                    </div>
                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-indigo-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                            <span className="ml-2 text-sm text-gray-600">
                                                Riverside Park, Downtown
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-indigo-500"
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
                                            <span className="ml-2 text-sm text-gray-600">
                                                Sat, Jun 12 • 9:00 AM
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex justify-between items-center">
                                        <div className="flex items-center">
                                            <div className="avatar-group -space-x-4">
                                                <div className="avatar">
                                                    <div className="w-8">
                                                        <img
                                                            src="https://i.pravatar.cc/150?img=1"
                                                            alt="Volunteer"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="avatar">
                                                    <div className="w-8">
                                                        <img
                                                            src="https://i.pravatar.cc/150?img=2"
                                                            alt="Volunteer"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="avatar">
                                                    <div className="w-8">
                                                        <img
                                                            src="https://i.pravatar.cc/150?img=3"
                                                            alt="Volunteer"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="ml-2 text-sm text-gray-500">
                                                12 volunteers joined
                                            </span>
                                        </div>
                                        <button className="btn btn-primary btn-sm rounded-full">
                                            Join Event
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Feed Item 2 */}
                            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg">
                                <div className="p-6">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-6 w-6 text-red-600"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                Urgent: Food Bank Assistance
                                                Needed
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Posted by Community Food Share •
                                                5 hours ago
                                            </p>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-gray-600">
                                        We're experiencing a shortage of
                                        volunteers for our weekend food
                                        distribution. If you have a few hours to
                                        spare, we urgently need your help to
                                        pack and distribute food packages to
                                        families in need.
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                            Urgent
                                        </span>
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                                            Food Service
                                        </span>
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                            Indoors
                                        </span>
                                    </div>
                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-indigo-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                            <span className="ml-2 text-sm text-gray-600">
                                                123 Main St, Community Center
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-indigo-500"
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
                                            <span className="ml-2 text-sm text-gray-600">
                                                Sat, Jun 12 • 8:00 AM - 2:00 PM
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex justify-between items-center">
                                        <div className="flex items-center">
                                            <div className="avatar-group -space-x-4">
                                                <div className="avatar">
                                                    <div className="w-8">
                                                        <img
                                                            src="https://i.pravatar.cc/150?img=4"
                                                            alt="Volunteer"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="avatar">
                                                    <div className="w-8">
                                                        <img
                                                            src="https://i.pravatar.cc/150?img=5"
                                                            alt="Volunteer"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="ml-2 text-sm text-gray-500">
                                                2 volunteers joined
                                            </span>
                                        </div>
                                        <button className="btn btn-primary btn-sm rounded-full">
                                            Help Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Upcoming Events */}
                        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                Upcoming Events
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <span className="text-indigo-600 font-bold">
                                            12
                                        </span>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-sm font-medium text-gray-800">
                                            Community Cleanup
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            Sat, Jun 12 • 9:00 AM
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <span className="text-green-600 font-bold">
                                            13
                                        </span>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-sm font-medium text-gray-800">
                                            Food Distribution
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            Sun, Jun 13 • 10:00 AM
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <span className="text-purple-600 font-bold">
                                            15
                                        </span>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-sm font-medium text-gray-800">
                                            Youth Mentoring
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            Tue, Jun 15 • 4:00 PM
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button className="btn btn-ghost btn-sm w-full mt-4 text-indigo-600">
                                View All Events
                            </button>
                        </div>

                        {/* Recent Achievements */}
                        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                Community Impact
                            </h2>
                            <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
                                <div className="stat">
                                    <div className="stat-title">
                                        Volunteers This Month
                                    </div>
                                    <div className="stat-value">248</div>
                                    <div className="stat-desc">
                                        21% more than last month
                                    </div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title">
                                        Hours Contributed
                                    </div>
                                    <div className="stat-value">1,240</div>
                                    <div className="stat-desc">
                                        ↗︎ 400 (22%)
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Organizations */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                Featured Organizations
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <div className="avatar">
                                        <div className="w-12 h-12 rounded-full">
                                            <img
                                                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                                                alt="Organization"
                                            />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-sm font-medium text-gray-800">
                                            Green City Initiative
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            Environmental • 15 events
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="avatar">
                                        <div className="w-12 h-12 rounded-full">
                                            <img
                                                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                                                alt="Organization"
                                            />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-sm font-medium text-gray-800">
                                            Community Food Share
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            Hunger Relief • 28 events
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="avatar">
                                        <div className="w-12 h-12 rounded-full">
                                            <img
                                                src="https://images.unsplash.com/photo-1560264418-c4445382edbc?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                                                alt="Organization"
                                            />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-sm font-medium text-gray-800">
                                            Youth Empowerment
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            Education • 12 events
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button className="btn btn-ghost btn-sm w-full mt-4 text-indigo-600">
                                Discover More
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
