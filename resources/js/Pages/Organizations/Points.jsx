import OrganizationLayout from "@/Layouts/OrganizationLayout";
import { Head, Link } from "@inertiajs/react";
import { format } from "date-fns";
import {
    TrophyIcon,
    ArrowTrendingUpIcon,
    CalendarDaysIcon,
    UserIcon,
    DocumentTextIcon,
    ArrowRightIcon,
    CurrencyDollarIcon,
    ChartBarIcon,
    ClockIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon, StarIcon, GiftIcon } from "@heroicons/react/24/solid";

// Helper function to partially mask emails in text
const maskEmails = (text) => {
    if (!text) return text;

    // Regular expression to match email addresses
    const emailRegex = /([a-zA-Z0-9._-]+)@([a-zA-Z0-9._-]+\.[a-zA-Z]{2,})/g;

    return text.replace(emailRegex, (match, username, domain) => {
        // Keep first 2 characters and last character before @
        const keepChars = 2;
        const visibleStart = username.substring(0, keepChars);
        const visibleEnd =
            username.length > keepChars + 1
                ? username.substring(username.length - 1)
                : "";

        // Mask the middle part with **
        const maskedMiddle =
            username.length > keepChars + 1
                ? "**"
                : username.length > keepChars
                ? "*"
                : "";

        return `${visibleStart}${maskedMiddle}${visibleEnd}@${domain}`;
    });
};

export default function Points({ auth, totalPoints = 0, pointsHistory = [] }) {
    // Calculate points earned this month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const pointsThisMonth = pointsHistory.reduce((total, transaction) => {
        const date = new Date(transaction.created_at);
        if (
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
        ) {
            return total + transaction.points;
        }
        return total;
    }, 0);

    // Get recent transactions (last 5)
    const recentTransactions = pointsHistory.slice(0, 5);

    // Calculate growth rate (placeholder logic)
    const growthRate = pointsHistory.length > 1 ? "+15%" : "0%";

    return (
        <OrganizationLayout auth={auth}>
            <Head title="Rewards & Points" />

            <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                Rewards & Points
                            </h1>
                            <p className="mt-2 text-sm text-gray-600">
                                Track points earned from volunteer projects
                            </p>
                        </div>
                        {/* <div className="flex items-center gap-3">
                            <Link
                                href="/organization/bookings"
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow"
                            >
                                <ChartBarIcon className="w-5 h-5" />
                                <span className="hidden sm:inline">
                                    Analytics
                                </span>
                            </Link>
                        </div> */}
                    </div>
                </div>

                {/* Points Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Total Points Card */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-amber-100 rounded-xl">
                                <TrophyIcon className="w-8 h-8 text-amber-600" />
                            </div>
                            <span className="text-sm font-medium text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                                {growthRate}
                            </span>
                        </div>
                        <h3 className="text-sm font-medium text-amber-800 mb-1">
                            Total Points Balance
                        </h3>
                        <p className="text-3xl font-bold text-gray-900 mb-2">
                            {totalPoints.toLocaleString()}
                        </p>
                        <p className="text-sm text-amber-700">
                            Points earned from completed projects
                        </p>
                    </div>

                    {/* This Month's Points */}
                    <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl border border-blue-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <CalendarDaysIcon className="w-8 h-8 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                                This Month
                            </span>
                        </div>
                        <h3 className="text-sm font-medium text-blue-800 mb-1">
                            Points Earned This Month
                        </h3>
                        <p className="text-3xl font-bold text-gray-900 mb-2">
                            {pointsThisMonth.toLocaleString()}
                        </p>
                        <p className="text-sm text-blue-700">
                            {pointsThisMonth > 0
                                ? "Great progress this month!"
                                : "Complete projects to earn points"}
                        </p>
                    </div>

                    {/* Transaction Stats */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-100 rounded-xl">
                                <ArrowTrendingUpIcon className="w-8 h-8 text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
                                {pointsHistory.length} total
                            </span>
                        </div>
                        <h3 className="text-sm font-medium text-green-800 mb-1">
                            Total Transactions
                        </h3>
                        <p className="text-3xl font-bold text-gray-900 mb-2">
                            {pointsHistory.length}
                        </p>
                        <p className="text-sm text-green-700">
                            From {pointsHistory.length} completed projects
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Recent Transactions */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Recent Points Transactions
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Latest points earned from
                                                volunteers
                                            </p>
                                        </div>
                                    </div>
                                    {/* <Link
                                        href="#"
                                        className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                    >
                                        View all
                                        <ArrowRightIcon className="w-4 h-4" />
                                    </Link> */}
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                {/* Mobile View (Cards) */}
                                <div className="block lg:hidden">
                                    {recentTransactions.length > 0 ? (
                                        <div className="divide-y divide-gray-200">
                                            {recentTransactions.map(
                                                (transaction) => (
                                                    <div
                                                        key={transaction.id}
                                                        className="p-4 hover:bg-gray-50/50"
                                                    >
                                                        <div className="flex items-start gap-3 mb-3">
                                                            <div className="p-2.5 bg-green-50 rounded-lg">
                                                                <GiftIcon className="w-5 h-5 text-green-600" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between">
                                                                    <h4 className="font-medium text-gray-900 truncate">
                                                                        {transaction
                                                                            .booking
                                                                            ?.project
                                                                            ?.title ||
                                                                            "Project Points"}
                                                                    </h4>
                                                                    <span className="font-bold text-green-600 ml-2">
                                                                        +
                                                                        {
                                                                            transaction.points
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                                    {maskEmails(
                                                                        transaction.description
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                                            <div className="flex items-center gap-2 text-gray-600">
                                                                <UserIcon className="w-4 h-4 text-gray-400" />
                                                                <span className="truncate">
                                                                    {transaction
                                                                        .user
                                                                        ?.name ||
                                                                        "Volunteer"}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-gray-600">
                                                                <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                                                                <span>
                                                                    {format(
                                                                        new Date(
                                                                            transaction.created_at
                                                                        ),
                                                                        "MMM d"
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <EmptyState
                                            icon={
                                                <GiftIcon className="w-12 h-12 text-gray-400" />
                                            }
                                            title="No transactions yet"
                                            description="Points will appear here when volunteers complete your projects"
                                        />
                                    )}
                                </div>

                                {/* Desktop View (Table) */}
                                <div className="hidden lg:block">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Points
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    From Volunteer
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Project
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Description
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {recentTransactions.length > 0 ? (
                                                recentTransactions.map(
                                                    (transaction) => (
                                                        <tr
                                                            key={transaction.id}
                                                            className="hover:bg-gray-50/50 transition-colors"
                                                        >
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center gap-2">
                                                                    <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                                                                    <span className="text-sm text-gray-600">
                                                                        {format(
                                                                            new Date(
                                                                                transaction.created_at
                                                                            ),
                                                                            "MMM d, yyyy"
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="p-1.5 bg-green-100 rounded-md">
                                                                        <StarIcon className="w-4 h-4 text-green-600" />
                                                                    </div>
                                                                    <span className="text-sm font-bold text-green-600">
                                                                        +
                                                                        {
                                                                            transaction.points
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-medium text-gray-900">
                                                                        {transaction
                                                                            .user
                                                                            ?.name ||
                                                                            "Volunteer"}
                                                                    </span>
                                                                    {transaction
                                                                        .user
                                                                        ?.email && (
                                                                        <span className="text-xs text-gray-500">
                                                                            {maskEmails(
                                                                                transaction
                                                                                    .user
                                                                                    .email
                                                                            )}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                                                                        {transaction
                                                                            .booking
                                                                            ?.project
                                                                            ?.title ||
                                                                            "N/A"}
                                                                    </span>
                                                                    {transaction.booking && (
                                                                        <span className="text-xs text-gray-500">
                                                                            {transaction
                                                                                .booking
                                                                                .start_date &&
                                                                                format(
                                                                                    new Date(
                                                                                        transaction.booking.start_date
                                                                                    ),
                                                                                    "MMM d"
                                                                                )}{" "}
                                                                            {transaction
                                                                                .booking
                                                                                .end_date &&
                                                                                `- ${format(
                                                                                    new Date(
                                                                                        transaction.booking.end_date
                                                                                    ),
                                                                                    "MMM d, yyyy"
                                                                                )}`}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <p className="text-sm text-gray-600 line-clamp-2 max-w-[300px]">
                                                                    {maskEmails(
                                                                        transaction.description
                                                                    )}
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="5"
                                                        className="px-6 py-12 text-center"
                                                    >
                                                        <EmptyState
                                                            icon={
                                                                <GiftIcon className="w-12 h-12 text-gray-400" />
                                                            }
                                                            title="No transactions yet"
                                                            description="Points will appear here when volunteers complete your projects"
                                                        />
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Info & Actions */}
                    <div className="space-y-6">
                        {/* How Points Work */}
                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl border border-purple-100 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <StarIcon className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900">
                                    How Points Work
                                </h3>
                            </div>
                            <ul className="space-y-3">
                                <InfoItem
                                    icon={
                                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                    }
                                    text="1 point = $0.50 value"
                                />
                                <InfoItem
                                    icon={
                                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                    }
                                    text="Earn points when volunteers pay with points"
                                />
                                <InfoItem
                                    icon={
                                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                    }
                                    text="Points can be redeemed for platform credits"
                                />
                                <InfoItem
                                    icon={
                                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                    }
                                    text="No expiration date"
                                />
                            </ul>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-200">
                                <h3 className="font-semibold text-gray-900">
                                    Points Summary
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <StatItem
                                        label="Current Value"
                                        value={`$${(totalPoints * 0.5).toFixed(
                                            2
                                        )}`}
                                        icon={
                                            <CurrencyDollarIcon className="w-5 h-5 text-green-500" />
                                        }
                                    />
                                    <StatItem
                                        label="Avg. Per Transaction"
                                        value={
                                            pointsHistory.length > 0
                                                ? Math.round(
                                                      totalPoints /
                                                          pointsHistory.length
                                                  )
                                                : 0
                                        }
                                        icon={
                                            <ChartBarIcon className="w-5 h-5 text-blue-500" />
                                        }
                                    />
                                    <StatItem
                                        label="Last Transaction"
                                        value={
                                            pointsHistory.length > 0
                                                ? format(
                                                      new Date(
                                                          pointsHistory[0].created_at
                                                      ),
                                                      "MMM d"
                                                  )
                                                : "Never"
                                        }
                                        icon={
                                            <ClockIcon className="w-5 h-5 text-amber-500" />
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-3">
                                Need Help With Points?
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Learn how to maximize your points earnings
                            </p>
                            <div className="space-y-3">
                                <Link
                                    href="/help/points-system"
                                    className="block text-sm font-medium text-blue-600 hover:text-blue-800"
                                >
                                    📖 Points System Guide
                                </Link>
                                <Link
                                    href="/organization/redemption"
                                    className="block text-sm font-medium text-blue-600 hover:text-blue-800"
                                >
                                    💰 Redeem Points
                                </Link>
                                <Link
                                    href="/contact/support"
                                    className="block text-sm font-medium text-blue-600 hover:text-blue-800"
                                >
                                    🎯 Maximize Earnings
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </OrganizationLayout>
    );
}

// Empty State Component
function EmptyState({ icon, title, description }) {
    return (
        <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                {icon}
            </div>
            <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
                {description}
            </p>
        </div>
    );
}

// Info Item Component
function InfoItem({ icon, text }) {
    return (
        <li className="flex items-center gap-3">
            {icon}
            <span className="text-sm text-gray-700">{text}</span>
        </li>
    );
}

// Stat Item Component
function StatItem({ label, value, icon }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-1.5 bg-gray-100 rounded-lg">{icon}</div>
                <span className="text-sm font-medium text-gray-700">
                    {label}
                </span>
            </div>
            <span className="font-bold text-gray-900">{value}</span>
        </div>
    );
}
