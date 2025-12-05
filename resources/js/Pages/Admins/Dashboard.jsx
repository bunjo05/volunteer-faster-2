import AdminLayout from "@/Layouts/AdminLayout";
import { Card, CardContent } from "@/Components/Card";
import {
    User,
    Folder,
    CreditCard,
    Mail,
    TrendingUp,
    Users,
    FileText,
    MessageSquare,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";

export default function Dashboard({ stats, recentActivities }) {
    const statCards = [
        {
            title: "Total Users",
            value: stats.users.total,
            icon: <Users className="text-blue-500 w-5 h-5" />,
            change: stats.users.change,
            trend: stats.users.change >= 0 ? "up" : "down",
            color: "blue",
        },
        {
            title: "Active Projects",
            value: stats.projects.active,
            icon: <Folder className="text-green-500 w-5 h-5" />,
            change: stats.projects.change,
            trend: stats.projects.change >= 0 ? "up" : "down",
            color: "green",
        },
        {
            title: "Total Revenue",
            value: `$${stats.payments.total.toLocaleString()}`,
            icon: <CreditCard className="text-purple-500 w-5 h-5" />,
            change: stats.payments.change,
            trend: stats.payments.change >= 0 ? "up" : "down",
            color: "purple",
        },
        {
            title: "Unread Messages",
            value: stats.messages.unread,
            icon: <Mail className="text-amber-500 w-5 h-5" />,
            change: stats.messages.change,
            trend: stats.messages.change >= 0 ? "up" : "down",
            color: "amber",
        },
    ];

    return (
        <AdminLayout>
            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                Dashboard Overview
                            </h1>
                            <p className="text-sm md:text-base text-gray-600 mt-1">
                                Welcome back! Here's what's happening today.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>
                                {new Date().toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
                    {statCards.map((card, i) => (
                        <Card
                            key={i}
                            className="shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                            <CardContent className="p-4 md:p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div
                                        className={`p-2 rounded-lg bg-${card.color}-50`}
                                    >
                                        {card.icon}
                                    </div>
                                    <div
                                        className={`flex items-center text-xs font-medium ${
                                            card.trend === "up"
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {card.trend === "up" ? (
                                            <ArrowUpRight className="w-3 h-3 mr-1" />
                                        ) : (
                                            <ArrowDownRight className="w-3 h-3 mr-1" />
                                        )}
                                        {Math.abs(card.change)}%
                                    </div>
                                </div>
                                <h2 className="text-sm font-medium text-gray-600 mb-1">
                                    {card.title}
                                </h2>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                    {card.value}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {card.trend === "up"
                                        ? "Increased"
                                        : "Decreased"}{" "}
                                    from last month
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Recent Activities Grid */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 md:mb-6">
                        Recent Activities
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                        <ActivitySection
                            title="Recent Users"
                            items={recentActivities.users}
                            type="user"
                            icon={<Users className="w-5 h-5 text-blue-500" />}
                        />
                        <ActivitySection
                            title="Active Projects"
                            items={recentActivities.projects}
                            type="project"
                            icon={<Folder className="w-5 h-5 text-green-500" />}
                        />
                        <ActivitySection
                            title="Recent Payments"
                            items={recentActivities.payments}
                            type="payment"
                            icon={
                                <CreditCard className="w-5 h-5 text-purple-500" />
                            }
                        />
                        <ActivitySection
                            title="Recent Messages"
                            items={recentActivities.messages}
                            type="message"
                            icon={
                                <MessageSquare className="w-5 h-5 text-amber-500" />
                            }
                        />
                    </div>
                </div>

                {/* Quick Stats Summary */}
                <Card className="shadow-sm">
                    <CardContent className="p-4 md:p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Quick Summary
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-sm font-medium text-blue-700 mb-1">
                                    Total Projects
                                </div>
                                <div className="text-2xl font-bold text-blue-900">
                                    {stats.projects.total}
                                </div>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-sm font-medium text-green-700 mb-1">
                                    Completed
                                </div>
                                <div className="text-2xl font-bold text-green-900">
                                    {stats.projects.completed || 0}
                                </div>
                            </div>
                            <div className="text-center p-4 bg-amber-50 rounded-lg">
                                <div className="text-sm font-medium text-amber-700 mb-1">
                                    Pending
                                </div>
                                <div className="text-2xl font-bold text-amber-900">
                                    {stats.projects.pending || 0}
                                </div>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <div className="text-sm font-medium text-purple-700 mb-1">
                                    Messages
                                </div>
                                <div className="text-2xl font-bold text-purple-900">
                                    {stats.messages.total}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}

function ActivitySection({ title, items, type, icon }) {
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "completed":
            case "active":
            case "success":
                return "text-green-600 bg-green-50";
            case "pending":
            case "processing":
                return "text-amber-600 bg-amber-50";
            case "failed":
            case "cancelled":
                return "text-red-600 bg-red-50";
            default:
                return "text-gray-600 bg-gray-50";
        }
    };

    return (
        <Card className="shadow-sm">
            <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        {icon}
                        {title}
                    </h3>
                    <span className="text-xs font-medium text-gray-500">
                        {items.length} items
                    </span>
                </div>
                <div className="space-y-3">
                    {items.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <FileText className="w-12 h-12 mx-auto mb-2 opacity-40" />
                            <p className="text-sm">No records yet</p>
                        </div>
                    ) : (
                        items.slice(0, 4).map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="min-w-0 flex-1">
                                    {type === "user" && (
                                        <div>
                                            <p className="font-medium text-gray-900 truncate">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {item.email}
                                            </p>
                                        </div>
                                    )}
                                    {type === "project" && (
                                        <div>
                                            <p className="font-medium text-gray-900 truncate">
                                                {item.title}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-gray-500">
                                                    {item.user?.name}
                                                </span>
                                                {item.status && (
                                                    <span
                                                        className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(
                                                            item.status
                                                        )}`}
                                                    >
                                                        {item.status}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {type === "payment" && (
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                ${item.amount}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-gray-500">
                                                    {item.user?.name}
                                                </span>
                                                {item.status && (
                                                    <span
                                                        className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(
                                                            item.status
                                                        )}`}
                                                    >
                                                        {item.status}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {type === "message" && (
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate mt-1">
                                                {item.message.slice(0, 60)}...
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="ml-4 text-xs text-gray-500 whitespace-nowrap">
                                    {item.created_at &&
                                        new Date(
                                            item.created_at
                                        ).toLocaleDateString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {items.length > 4 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <button className="w-full text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1">
                            View all {items.length} items
                            <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
