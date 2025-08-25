import OrganizationLayout from "@/Layouts/OrganizationLayout";
import { Link, usePage } from "@inertiajs/react";
import {
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
    FolderOpenIcon,
    ChatBubbleBottomCenterTextIcon,
    PlusCircleIcon,
    CheckBadgeIcon,
    // BanIcon,
} from "@heroicons/react/24/solid";

export default function Dashboard({ auth }) {
    const {
        projectsCount,
        projectStatusCount,
        messagesCount = 0,
        recentMessages = [],
    } = usePage().props;

    // Calculate total projects from status counts to ensure accuracy
    const calculatedTotal = Object.values(projectStatusCount).reduce(
        (sum, count) => sum + count,
        0
    );
    const displayCount = projectsCount > 0 ? projectsCount : calculatedTotal;

    return (
        <OrganizationLayout auth={auth}>
            <div className="p-6 space-y-8 max-w-7xl mx-auto">
                {auth?.user?.name && (
                    <p className="text-4xl text-base-content/70 mt-1">
                        👋 Welcome back, {auth.user.name}
                    </p>
                )}

                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    <StatCard
                        title="Total Projects"
                        value={displayCount}
                        icon={
                            <FolderOpenIcon className="w-8 h-8 text-blue-500" />
                        }
                        color="text-blue-600"
                    />
                    <StatCard
                        title="Approved"
                        value={projectStatusCount.approved || 0}
                        icon={
                            <CheckCircleIcon className="w-8 h-8 text-green-500" />
                        }
                        color="text-green-600"
                    />
                    <StatCard
                        title="Pending"
                        value={projectStatusCount.pending || 0}
                        icon={<ClockIcon className="w-8 h-8 text-yellow-500" />}
                        color="text-yellow-500"
                    />
                    <StatCard
                        title="Rejected"
                        value={projectStatusCount.rejected || 0}
                        icon={<XCircleIcon className="w-8 h-8 text-red-500" />}
                        color="text-red-600"
                    />
                    <StatCard
                        title="Completed"
                        value={projectStatusCount.completed || 0}
                        icon={
                            <CheckBadgeIcon className="w-8 h-8 text-purple-500" />
                        }
                        color="text-purple-600"
                    />
                </div>

                {/* Status Summary */}
                {/* <div className="bg-white p-6 shadow rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">
                        Project Status Summary
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {Object.entries(projectStatusCount).map(
                            ([status, count]) => (
                                <div
                                    key={status}
                                    className="text-center p-4 bg-gray-50 rounded-lg"
                                >
                                    <div className="text-2xl font-bold text-gray-800">
                                        {count}
                                    </div>
                                    <div className="text-sm text-gray-600 capitalize">
                                        {status}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        {displayCount > 0
                                            ? Math.round(
                                                  (count / displayCount) * 100
                                              )
                                            : 0}
                                        %
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div> */}

                {/* Messages & Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Messages Card */}
                    <div className="bg-white p-6 shadow rounded-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-indigo-500" />
                                Messages
                            </h2>
                            <Link
                                href="/organization/messages"
                                className="text-sm text-blue-600 hover:underline"
                            >
                                View All
                            </Link>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">
                            {messagesCount}
                        </p>

                        {/* Recent Messages */}
                        <div className="mt-6">
                            <h3 className="text-md font-semibold mb-2">
                                Recent Messages
                            </h3>
                            <ul className="divide-y divide-gray-200">
                                {recentMessages && recentMessages.length > 0 ? (
                                    recentMessages.map((msg) => (
                                        <li key={msg.id} className="py-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-800">
                                                    {msg.subject}
                                                </span>
                                                <span
                                                    className={`text-xs px-2 py-1 rounded-full ${
                                                        msg.status === "Unread"
                                                            ? "bg-red-100 text-red-600"
                                                            : "bg-green-100 text-green-600"
                                                    }`}
                                                >
                                                    {msg.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 truncate">
                                                {msg.body}
                                            </p>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-sm">
                                        No recent messages.
                                    </p>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white p-6 shadow rounded-xl flex flex-col gap-4">
                        <h2 className="text-xl font-semibold mb-2">
                            Quick Actions
                        </h2>
                        <Link
                            href="/organization/projects/create"
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            <PlusCircleIcon className="w-5 h-5" />
                            Create New Project
                        </Link>
                        <Link
                            href="/organization/messages"
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
                        >
                            <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
                            Go to Messages
                        </Link>
                        <Link
                            href="/organization/projects"
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                            <FolderOpenIcon className="w-5 h-5" />
                            View All Projects
                        </Link>
                    </div>
                </div>
            </div>
        </OrganizationLayout>
    );
}

// Reusable Stat Card Component
function StatCard({ title, value, icon, color }) {
    return (
        <div className="bg-white p-5 shadow rounded-xl hover:shadow-lg transition">
            <div className="flex items-center justify-center mb-2">{icon}</div>
            <h2 className="text-sm font-medium text-gray-600 text-center">
                {title}
            </h2>
            <p className={`text-3xl font-bold text-center ${color}`}>{value}</p>
        </div>
    );
}
