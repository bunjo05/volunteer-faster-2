import VolunteerLayout from "@/Layouts/VolunteerLayout";
import {
    StarIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    TrophyIcon,
    CalendarIcon,
} from "@heroicons/react/24/outline";

const statusCards = [
    {
        title: "Pending",
        icon: ClockIcon,
        color: "bg-yellow-100 text-yellow-800",
    },
    {
        title: "Approved",
        icon: CheckCircleIcon,
        color: "bg-green-100 text-green-800",
    },
    {
        title: "Rejected",
        icon: XCircleIcon,
        color: "bg-red-100 text-red-800",
    },
    {
        title: "Completed",
        icon: TrophyIcon,
        color: "bg-blue-100 text-blue-800",
    },
];

export default function Dashboard({ auth, stats, recent_activities }) {
    const progressPercent = Math.min((stats.total_points / 100) * 100, 100);

    return (
        <VolunteerLayout auth={auth}>
            <div className="px-4 py-6 sm:px-6 lg:px-8 space-y-8">
                {/* Welcome Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, {auth.user.name}!
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Here's what’s happening with your volunteer journey.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {/* Total Points */}
                    <StatCard
                        title="Total Points"
                        value={stats.total_points}
                        icon={StarIcon}
                        iconBg="bg-indigo-500"
                    />

                    {/* Total Projects */}
                    <StatCard
                        title="Total Projects"
                        value={stats.bookings.total}
                        icon={CalendarIcon}
                        iconBg="bg-purple-500"
                    />

                    {/* Status Cards */}
                    {statusCards.map((card) => (
                        <StatCard
                            key={card.title}
                            title={`${card.title} Projects`}
                            value={stats.bookings[card.title.toLowerCase()]}
                            icon={card.icon}
                            iconBg={card.color}
                        />
                    ))}
                </div>

                {/* Recent Activities */}
                <div className="bg-white shadow rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Recent Activities
                        </h3>
                        <p className="text-sm text-gray-500">
                            Your latest points earned from completed projects
                        </p>
                    </div>
                    <ul className="divide-y divide-gray-100">
                        {recent_activities.length > 0 ? (
                            recent_activities.map((activity, index) => (
                                <li
                                    key={index}
                                    className="px-6 py-4 flex items-center"
                                >
                                    <div className="bg-green-100 rounded-full p-2">
                                        <StarIcon className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <p className="text-sm font-medium text-gray-800">
                                            Earned {activity.points} points
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            From project: {activity.project}
                                        </p>
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        {activity.date}
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="px-6 py-6 text-center text-gray-500 text-sm">
                                No recent activities found
                            </li>
                        )}
                    </ul>
                </div>

                {/* Quick Actions + Progress */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Quick Actions */}
                    <div className="bg-white shadow rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Quick Actions
                        </h3>
                        <div className="space-y-3">
                            <a
                                href={route("volunteer.projects")}
                                className="flex items-center px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 transition"
                            >
                                <span className="text-sm font-medium text-gray-700 hover:text-gray-900">
                                    View My Projects
                                </span>
                            </a>
                            <a
                                href={route("volunteer.points")}
                                className="flex items-center px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 transition"
                            >
                                <StarIcon className="h-5 w-5 text-yellow-400 mr-2" />
                                <span className="text-sm font-medium text-gray-700 hover:text-gray-900">
                                    View Points History
                                </span>
                            </a>
                        </div>
                    </div>

                    {/* Progress Tracker */}
                    <div className="bg-white shadow rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Your Progress
                        </h3>
                        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-indigo-600 rounded-full transition-all duration-700"
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                            {stats.total_points} points earned (goal: 100)
                        </p>
                    </div>
                </div>
            </div>
        </VolunteerLayout>
    );
}

// Reusable stat card component
function StatCard({ title, value, icon: Icon, iconBg }) {
    return (
        <div className="bg-white shadow rounded-xl p-5 flex items-center">
            <div className={`flex-shrink-0 ${iconBg} rounded-md p-3`}>
                <Icon className="h-6 w-6" />
            </div>
            <div className="ml-4">
                <dt className="text-sm font-medium text-gray-500">{title}</dt>
                <dd className="text-xl font-semibold text-gray-900">{value}</dd>
            </div>
        </div>
    );
}
