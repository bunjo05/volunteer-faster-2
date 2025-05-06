import OrganizationLayout from "@/Layouts/OrganizationLayout";
import { Link, usePage } from "@inertiajs/react";
import {
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
    FolderOpenIcon,
    ChatBubbleBottomCenterTextIcon,
    PlusCircleIcon,
} from "@heroicons/react/24/solid";

export default function Dashboard() {
    const { projectsCount, projectStatusCount, messagesCount, recentMessages } =
        usePage().props;

    return (
        <OrganizationLayout>
            <div className="p-6 space-y-8 max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-800">
                    👋 Welcome to Your Organization Dashboard
                </h1>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Projects"
                        value={projectsCount}
                        icon={
                            <FolderOpenIcon className="w-8 h-8 text-blue-500" />
                        }
                        color="text-blue-600"
                    />
                    <StatCard
                        title="Approved"
                        value={projectStatusCount.approved}
                        icon={
                            <CheckCircleIcon className="w-8 h-8 text-green-500" />
                        }
                        color="text-green-600"
                    />
                    <StatCard
                        title="Pending"
                        value={projectStatusCount.pending}
                        icon={<ClockIcon className="w-8 h-8 text-yellow-500" />}
                        color="text-yellow-500"
                    />
                    <StatCard
                        title="Rejected"
                        value={projectStatusCount.rejected}
                        icon={<XCircleIcon className="w-8 h-8 text-red-500" />}
                        color="text-red-600"
                    />
                </div>

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
