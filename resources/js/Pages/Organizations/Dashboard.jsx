import OrganizationLayout from "@/Layouts/OrganizationLayout";
import { Link, usePage } from "@inertiajs/react";
import {
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
    FolderOpenIcon,
    PlusCircleIcon,
    CheckBadgeIcon,
    ArrowRightIcon,
    UserGroupIcon,
    ChartBarIcon,
} from "@heroicons/react/24/solid";
import {
    ExclamationCircleIcon,
    UserIcon,
    PowerIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard({ auth }) {
    const {
        projectsCount,
        projectStatusCount,
        organizationProfile,
        organizationVerification,
    } = usePage().props;

    // Calculate total projects from status counts to ensure accuracy
    const calculatedTotal = Object.values(projectStatusCount).reduce(
        (sum, count) => sum + count,
        0
    );
    const displayCount = projectsCount > 0 ? projectsCount : calculatedTotal;

    // Function to check if organization profile is complete
    const isProfileComplete = () => {
        if (!organizationProfile) return false;

        // Check for essential fields that should be filled
        const essentialFields = ["name", "country", "phone", "description"];
        return essentialFields.every(
            (field) =>
                organizationProfile[field] &&
                organizationProfile[field].trim() !== ""
        );
    };

    const getVerificationStatus = () => {
        // Double-check with optional chaining
        const status = organizationVerification?.status;

        if (!status) {
            return {
                status: "Not Provided",
                color: "text-gray-600",
                bgColor: "bg-gray-100",
                description: "Verification documents not submitted",
                icon: (
                    <ExclamationCircleIcon className="w-5 h-5 text-gray-500" />
                ),
            };
        }

        switch (
            status
            // ... rest of the switch cases remain the same
        ) {
        }
    };

    // Function to get account status based on is_active
    const getAccountStatus = () => {
        // Check if user is active (is_active === 1)
        const isActive =
            auth?.user?.is_active === 1 || auth?.user?.is_active === true;

        if (isActive) {
            return {
                status: "Active",
                color: "text-green-600",
                icon: <PowerIcon className="w-5 h-5 text-green-500" />,
                description: "Your account is active and ready to use",
                bgColor: "bg-green-100",
            };
        } else {
            return {
                status: "Deactivated",
                color: "text-red-600",
                icon: <PowerIcon className="w-5 h-5 text-red-500" />,
                description: "Your account has been deactivated",
                bgColor: "bg-red-100",
            };
        }
    };

    const verificationInfo = getVerificationStatus();
    const accountStatus = getAccountStatus();

    return (
        <OrganizationLayout auth={auth}>
            <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Welcome Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                                Dashboard Overview
                            </h1>
                            <p className="mt-2 text-sm sm:text-base text-gray-600">
                                Welcome back,{" "}
                                <span className="font-semibold text-blue-600">
                                    {auth?.user?.name}
                                </span>
                                <span
                                    className={`ml-2 text-xs font-medium px-2 py-1 rounded-full ${accountStatus.bgColor} ${accountStatus.color}`}
                                >
                                    {accountStatus.status}
                                </span>
                            </p>
                        </div>
                        {/* <Link
                            href="/organization/projects/create"
                            className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg w-full sm:w-auto"
                        >
                            <PlusCircleIcon className="w-5 h-5" />
                            <span>Create Project</span>
                        </Link> */}
                    </div>
                </div>

                {/* Stats Overview - Mobile Optimized */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                    <StatCard
                        title="Total Projects"
                        value={displayCount}
                        icon={<FolderOpenIcon className="w-6 h-6" />}
                        color="bg-gradient-to-br from-blue-50 to-blue-100"
                        iconColor="text-blue-600"
                        trend={displayCount > 0 ? "+12%" : null}
                        href="/organization/projects"
                    />
                    <StatCard
                        title="Active"
                        value={projectStatusCount.approved || 0}
                        icon={<CheckCircleIcon className="w-6 h-6" />}
                        color="bg-gradient-to-br from-green-50 to-emerald-100"
                        iconColor="text-green-600"
                        href="/organization/projects?status=approved"
                    />
                    <StatCard
                        title="Pending"
                        value={projectStatusCount.pending || 0}
                        icon={<ClockIcon className="w-6 h-6" />}
                        color="bg-gradient-to-br from-amber-50 to-yellow-100"
                        iconColor="text-amber-600"
                        href="/organization/projects?status=pending"
                    />
                    <StatCard
                        title="Rejected"
                        value={projectStatusCount.rejected || 0}
                        icon={<XCircleIcon className="w-6 h-6" />}
                        color="bg-gradient-to-br from-red-50 to-pink-100"
                        iconColor="text-red-600"
                        href="/organization/projects?status=rejected"
                    />
                    <StatCard
                        title="Completed"
                        value={projectStatusCount.completed || 0}
                        icon={<CheckBadgeIcon className="w-6 h-6" />}
                        color="bg-gradient-to-br from-purple-50 to-violet-100"
                        iconColor="text-purple-600"
                        href="/organization/projects?status=completed"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Stats & Messages */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Project Status Summary */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <ChartBarIcon className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Project Status Distribution
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Overview of all your projects
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        href="/organization/projects"
                                        className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                    >
                                        View all
                                        <ArrowRightIcon className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {Object.entries(projectStatusCount).map(
                                        ([status, count]) => {
                                            const percentage =
                                                displayCount > 0
                                                    ? (count / displayCount) *
                                                      100
                                                    : 0;
                                            const statusColors = {
                                                approved: {
                                                    bg: "bg-green-500",
                                                    text: "text-green-700",
                                                },
                                                pending: {
                                                    bg: "bg-yellow-500",
                                                    text: "text-yellow-700",
                                                },
                                                rejected: {
                                                    bg: "bg-red-500",
                                                    text: "text-red-700",
                                                },
                                                completed: {
                                                    bg: "bg-purple-500",
                                                    text: "text-purple-700",
                                                },
                                                cancelled: {
                                                    bg: "bg-gray-500",
                                                    text: "text-gray-700",
                                                },
                                            };

                                            const color = statusColors[
                                                status
                                            ] || {
                                                bg: "bg-gray-500",
                                                text: "text-gray-700",
                                            };

                                            return (
                                                <div
                                                    key={status}
                                                    className="space-y-2"
                                                >
                                                    <div className="flex justify-between text-sm">
                                                        <span className="font-medium text-gray-700 capitalize">
                                                            {status}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-gray-900">
                                                                {count}
                                                            </span>
                                                            <span className="text-gray-500">
                                                                (
                                                                {percentage.toFixed(
                                                                    0
                                                                )}
                                                                %)
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${color.bg}`}
                                                            style={{
                                                                width: `${percentage}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Quick Actions & Info */}
                    <div className="space-y-6">
                        {/* Quick Actions Card */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
                            <div className="px-6 py-5 border-b border-blue-200">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Quick Actions
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Manage your organization
                                </p>
                            </div>
                            <div className="p-6 space-y-3">
                                <ActionButton
                                    href="/organization/projects/create"
                                    icon={
                                        <PlusCircleIcon className="w-5 h-5" />
                                    }
                                    title="Create Project"
                                    description="Start a new volunteer project"
                                    color="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                />
                                <ActionButton
                                    href="/organization/projects"
                                    icon={
                                        <FolderOpenIcon className="w-5 h-5" />
                                    }
                                    title="View Projects"
                                    description="See all your projects"
                                    color="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                />
                                <ActionButton
                                    href="/organization/bookings"
                                    icon={<UserGroupIcon className="w-5 h-5" />}
                                    title="Manage Bookings"
                                    description="View volunteer applications"
                                    color="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                                />
                                {/* Profile Action Button - Conditionally shown */}
                                {!isProfileComplete() &&
                                    accountStatus.status === "Active" && (
                                        <ActionButton
                                            href="/organization/profile"
                                            icon={
                                                <UserIcon className="w-5 h-5" />
                                            }
                                            title="Complete Profile"
                                            description="Finish setting up your organization"
                                            color="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                                        />
                                    )}
                            </div>
                        </div>

                        {/* System Status */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Account Status
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Your organization's verification and account
                                    status
                                </p>
                            </div>
                            <div className="p-6">
                                <ul className="space-y-4">
                                    {/* Account Status */}
                                    <StatusItem
                                        icon={accountStatus.icon}
                                        title="Account Status"
                                        status={accountStatus.status}
                                        statusColor={accountStatus.color}
                                        description={accountStatus.description}
                                        actionLink={
                                            accountStatus.status ===
                                            "Deactivated"
                                                ? "/organization/settings"
                                                : null
                                        }
                                        actionText={
                                            accountStatus.status ===
                                            "Deactivated"
                                                ? "Reactivate Account"
                                                : null
                                        }
                                    />
                                    {/* Profile Status */}
                                    <StatusItem
                                        icon={
                                            organizationProfile ? (
                                                <CheckCircleIcon className="w-5 h-5" />
                                            ) : (
                                                <ExclamationCircleIcon className="w-5 h-5" />
                                            )
                                        }
                                        title="Profile Status"
                                        status={
                                            isProfileComplete()
                                                ? "Complete"
                                                : organizationProfile
                                                ? "Incomplete"
                                                : "Not Started"
                                        }
                                        statusColor={
                                            isProfileComplete()
                                                ? "text-green-600"
                                                : organizationProfile
                                                ? "text-yellow-600"
                                                : "text-red-600"
                                        }
                                        description={
                                            isProfileComplete()
                                                ? "Organization profile is complete"
                                                : organizationProfile
                                                ? "Some profile information missing"
                                                : "Organization profile not created"
                                        }
                                        actionLink={
                                            !isProfileComplete() &&
                                            accountStatus.status === "Active"
                                                ? "/organization/profile"
                                                : null
                                        }
                                        actionText={
                                            !isProfileComplete() &&
                                            accountStatus.status === "Active"
                                                ? organizationProfile
                                                    ? "Update Profile"
                                                    : "Create Profile"
                                                : null
                                        }
                                    />
                                    {/* Verification Status */}
                                    <StatusItem
                                        icon={verificationInfo.icon}
                                        title="Verification"
                                        status={verificationInfo.status}
                                        statusColor={verificationInfo.color}
                                        description={
                                            verificationInfo.description
                                        }
                                        actionLink={
                                            (!organizationVerification ||
                                                organizationVerification?.status ===
                                                    "Rejected") &&
                                            accountStatus.status === "Active"
                                                ? "/organization/profile"
                                                : null
                                        }
                                        actionText={
                                            !organizationVerification &&
                                            accountStatus.status === "Active"
                                                ? "Submit Documents"
                                                : organizationVerification?.status ===
                                                      "Rejected" &&
                                                  accountStatus.status ===
                                                      "Active"
                                                ? "Resubmit"
                                                : null
                                        }
                                    />
                                </ul>
                            </div>
                        </div>

                        {/* Help & Support */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Need Help?
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Get support or learn how to use features
                            </p>
                            <div className="space-y-3">
                                <Link
                                    href="/organization/tutorials"
                                    className="block text-sm font-medium text-blue-600 hover:text-blue-800"
                                >
                                    🎥 Video Tutorials
                                </Link>
                                {/* Add verification help link */}
                                {!organizationVerification &&
                                    accountStatus.status === "Active" && (
                                        <Link
                                            href="/help/verification-process"
                                            className="block text-sm font-medium text-blue-600 hover:text-blue-800"
                                        >
                                            🔒 Verification Process
                                        </Link>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </OrganizationLayout>
    );
}

// Enhanced Stat Card Component
function StatCard({ title, value, icon, color, iconColor, trend, href }) {
    const Content = () => (
        <div
            className={`${color} p-4 sm:p-5 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md`}
        >
            <div className="flex items-center justify-between mb-3">
                <div
                    className={`p-2.5 rounded-lg bg-white/80 backdrop-blur-sm ${iconColor}`}
                >
                    {icon}
                </div>
                {trend && (
                    <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {trend}
                    </span>
                )}
            </div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                {title}
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {value.toLocaleString()}
            </p>
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="block">
                <Content />
            </Link>
        );
    }

    return <Content />;
}

// Action Button Component
function ActionButton({ href, icon, title, description, color }) {
    return (
        <Link
            href={href}
            className={`${color} text-white p-4 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-3 group`}
        >
            <div className="p-2 bg-white/20 rounded-lg">{icon}</div>
            <div className="flex-1 text-left">
                <div className="font-medium">{title}</div>
                <div className="text-sm opacity-90">{description}</div>
            </div>
            <ArrowRightIcon className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
    );
}

// Status Item Component with Action Support
function StatusItem({
    icon,
    title,
    status,
    statusColor,
    description,
    actionLink,
    actionText,
}) {
    return (
        <li className="flex items-start gap-3">
            <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <span className="text-sm font-medium text-gray-700">
                        {title}
                    </span>
                    <span className={`text-sm font-semibold ${statusColor}`}>
                        {status}
                    </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{description}</p>
                {actionLink && actionText && (
                    <Link
                        href={actionLink}
                        className="inline-block mt-2 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                    >
                        {actionText} →
                    </Link>
                )}
            </div>
        </li>
    );
}
