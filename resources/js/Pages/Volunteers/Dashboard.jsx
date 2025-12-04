import VolunteerLayout from "@/Layouts/VolunteerLayout";
import {
    StarIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    TrophyIcon,
    CalendarIcon,
    ChevronRightIcon,
    ArrowRightIcon,
    FireIcon,
    ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

const statusCards = [
    {
        title: "Pending",
        icon: ClockIcon,
        color: "bg-yellow-50 border-yellow-100",
        iconColor: "text-yellow-600",
        textColor: "text-yellow-700",
    },
    {
        title: "Approved",
        icon: CheckCircleIcon,
        color: "bg-green-50 border-green-100",
        iconColor: "text-green-600",
        textColor: "text-green-700",
    },
    {
        title: "Rejected",
        icon: XCircleIcon,
        color: "bg-red-50 border-red-100",
        iconColor: "text-red-600",
        textColor: "text-red-700",
    },
    {
        title: "Completed",
        icon: TrophyIcon,
        color: "bg-blue-50 border-blue-100",
        iconColor: "text-blue-600",
        textColor: "text-blue-700",
    },
];

export default function Dashboard({ auth, stats, recent_activities }) {
    const progressPercent = Math.min((stats.total_points / 100) * 100, 100);
    const nextMilestone = 100;
    const pointsToNext = Math.max(0, nextMilestone - stats.total_points);

    return (
        <VolunteerLayout auth={auth}>
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
                {/* Welcome Header with improved mobile spacing */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                                Welcome back,{" "}
                                <span className="text-indigo-600">
                                    {auth.user.name}
                                </span>
                                !
                            </h1>
                            <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-2xl">
                                Track your volunteer journey, earn points, and
                                make a difference
                            </p>
                        </div>
                        {stats.total_points >= 50 && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
                                <FireIcon className="h-5 w-5 text-orange-500" />
                                <span className="text-sm font-medium text-orange-700">
                                    {stats.total_points >= 75
                                        ? "🔥 Elite Volunteer"
                                        : "🔥 Active Contributor"}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Stats & Activities */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Stats Grid with improved mobile layout */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                            {/* Total Points Card - Highlighted */}
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg overflow-hidden col-span-2 sm:col-span-1">
                                <div className="p-4 sm:p-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-indigo-100">
                                                Total Points
                                            </p>
                                            <p className="mt-2 text-2xl sm:text-3xl font-bold text-white">
                                                {stats.total_points}
                                            </p>
                                        </div>
                                        <div className="bg-white/20 p-3 rounded-xl">
                                            <StarIcon className="h-7 w-7 text-white" />
                                        </div>
                                    </div>
                                    <div className="mt-3 flex items-center gap-1">
                                        <ArrowTrendingUpIcon className="h-4 w-4 text-green-300" />
                                        <span className="text-xs text-indigo-100">
                                            Keep going! {pointsToNext} points to
                                            next milestone
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Total Projects Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Total Projects
                                        </p>
                                        <p className="mt-2 text-xl sm:text-2xl font-bold text-gray-900">
                                            {stats.bookings.total}
                                        </p>
                                    </div>
                                    <div className="bg-purple-50 p-3 rounded-xl">
                                        <CalendarIcon className="h-6 w-6 text-purple-600" />
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <span className="text-xs text-gray-500">
                                        {stats.bookings.approved} active •{" "}
                                        {stats.bookings.pending} pending
                                    </span>
                                </div>
                            </div>

                            {/* Status Cards - Compact on mobile */}
                            {statusCards.map((card) => (
                                <div
                                    key={card.title}
                                    className={`bg-white rounded-2xl shadow-sm border ${card.color} p-4 sm:p-5`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs sm:text-sm font-medium text-gray-600">
                                                {card.title}
                                            </p>
                                            <p
                                                className={`mt-2 text-xl sm:text-2xl font-bold ${card.textColor}`}
                                            >
                                                {
                                                    stats.bookings[
                                                        card.title.toLowerCase()
                                                    ]
                                                }
                                            </p>
                                        </div>
                                        <div
                                            className={`p-2.5 rounded-lg ${card.color}`}
                                        >
                                            <card.icon
                                                className={`h-5 w-5 sm:h-6 sm:w-6 ${card.iconColor}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Activities - Improved mobile card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Recent Activities
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Your latest achievements and points
                                        </p>
                                    </div>
                                    <a
                                        href={route("volunteer.points")}
                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                                    >
                                        View all
                                        <ChevronRightIcon className="h-4 w-4" />
                                    </a>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {recent_activities.length > 0 ? (
                                    recent_activities.map((activity, index) => (
                                        <div
                                            key={index}
                                            className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-3">
                                                    <StarIcon className="h-5 w-5 text-green-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-800 truncate">
                                                        Earned{" "}
                                                        <span className="text-green-600 font-bold">
                                                            {activity.points}
                                                        </span>{" "}
                                                        points
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-1 truncate">
                                                        {activity.project}
                                                    </p>
                                                </div>
                                                <div className="text-sm text-gray-400 whitespace-nowrap">
                                                    {activity.date}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 sm:px-6 py-8 text-center">
                                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                            <ClockIcon className="h-7 w-7 text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 font-medium">
                                            No recent activities
                                        </p>
                                        <p className="text-sm text-gray-400 mt-1">
                                            Complete projects to earn points
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Progress & Quick Actions */}
                    <div className="space-y-6">
                        {/* Progress Tracker - Improved design */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Points Progress
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Milestone: {nextMilestone} points
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-gray-900">
                                        {stats.total_points}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        / {nextMilestone}
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-700 relative"
                                        style={{ width: `${progressPercent}%` }}
                                    >
                                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>0</span>
                                    <span>{nextMilestone / 2}</span>
                                    <span>{nextMilestone}</span>
                                </div>
                            </div>

                            {pointsToNext > 0 ? (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <p className="text-sm text-blue-800 font-medium">
                                        {pointsToNext} points needed for next
                                        milestone
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                                    <div className="flex items-center gap-2">
                                        <TrophyIcon className="h-5 w-5 text-green-600" />
                                        <p className="text-sm text-green-800 font-medium">
                                            🎉 Milestone reached! Keep going!
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Actions - Enhanced buttons */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-5">
                                Quick Actions
                            </h3>
                            <div className="space-y-3">
                                <a
                                    href={route("volunteer.projects")}
                                    className="group flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl hover:from-indigo-100 hover:to-purple-100 transition-all duration-200 hover:shadow-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="bg-indigo-100 p-2.5 rounded-lg group-hover:bg-indigo-200 transition-colors">
                                            <CalendarIcon className="h-5 w-5 text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                Browse Projects
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Find new opportunities
                                            </p>
                                        </div>
                                    </div>
                                    <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                                </a>

                                <a
                                    href={route("volunteer.points")}
                                    className="group flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl hover:from-amber-100 hover:to-orange-100 transition-all duration-200 hover:shadow-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="bg-amber-100 p-2.5 rounded-lg group-hover:bg-amber-200 transition-colors">
                                            <StarIcon className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                Points History
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                View all your achievements
                                            </p>
                                        </div>
                                    </div>
                                    <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-amber-600 transition-colors" />
                                </a>

                                <a
                                    href={route("volunteer.projects")}
                                    className="group flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-200 hover:shadow-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="bg-green-100 p-2.5 rounded-lg group-hover:bg-green-200 transition-colors">
                                            <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                My Bookings
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Manage your applications
                                            </p>
                                        </div>
                                    </div>
                                    <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                                </a>
                            </div>
                        </div>

                        {/* Stats Summary */}
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg p-5 sm:p-6 text-white">
                            <h3 className="text-lg font-semibold mb-4">
                                Volunteer Stats
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300">
                                        Projects Completed
                                    </span>
                                    <span className="text-xl font-bold">
                                        {stats.bookings.completed}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300">
                                        Active Projects
                                    </span>
                                    <span className="text-xl font-bold">
                                        {stats.bookings.approved}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300">
                                        Total Impact
                                    </span>
                                    <span className="text-xl font-bold">
                                        {stats.total_points} pts
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section - Only show on larger screens */}
                <div className="hidden lg:block mt-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Tips for Success
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-blue-50 rounded-xl">
                                <h4 className="font-medium text-blue-900 mb-2">
                                    Complete Projects
                                </h4>
                                <p className="text-sm text-blue-700">
                                    Finish projects to earn maximum points and
                                    build your reputation
                                </p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-xl">
                                <h4 className="font-medium text-green-900 mb-2">
                                    Apply Early
                                </h4>
                                <p className="text-sm text-green-700">
                                    Popular projects fill up fast. Apply early
                                    to secure your spot
                                </p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-xl">
                                <h4 className="font-medium text-purple-900 mb-2">
                                    Build Profile
                                </h4>
                                <p className="text-sm text-purple-700">
                                    Complete your profile to increase chances of
                                    project approval
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </VolunteerLayout>
    );
}

// Removed the separate StatCard component as it's now integrated into the main grid
