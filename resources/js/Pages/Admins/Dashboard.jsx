import AdminLayout from "@/Layouts/AdminLayout";
import { Card, CardContent } from "@/Components/Card";
import { User, Folder, CreditCard, Mail } from "lucide-react";

export default function Dashboard({ stats, recentActivities }) {
    const statCards = [
        {
            title: "Total Users",
            value: stats.users.total,
            icon: <User className="text-blue-600 w-6 h-6" />,
        },
        {
            title: "Total Projects",
            value: stats.projects.total,
            icon: <Folder className="text-green-600 w-6 h-6" />,
        },
        {
            title: "Total Payments",
            value: `USD ${stats.payments.total.toLocaleString()}`,
            icon: <CreditCard className="text-yellow-600 w-6 h-6" />,
        },
        {
            title: "Messages",
            value: stats.messages.total,
            icon: <Mail className="text-purple-600 w-6 h-6" />,
        },
    ];

    return (
        <AdminLayout>
            <div className="px-6 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Admin Dashboard
                </h1>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {statCards.map((card, i) => (
                        <Card key={i} className="shadow-md">
                            <CardContent className="flex items-center gap-4 py-6">
                                {card.icon}
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-700">
                                        {card.title}
                                    </h2>
                                    <p className="text-xl font-bold text-gray-900">
                                        {card.value}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Recent Activities */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <RecentList
                        title="Recent Users"
                        items={recentActivities.users}
                        type="user"
                    />
                    <RecentList
                        title="Recent Projects"
                        items={recentActivities.projects}
                        type="project"
                    />
                    <RecentList
                        title="Recent Payments"
                        items={recentActivities.payments}
                        type="payment"
                    />
                    <RecentList
                        title="Recent Messages"
                        items={recentActivities.messages}
                        type="message"
                    />
                </div>
            </div>
        </AdminLayout>
    );
}

function RecentList({ title, items, type }) {
    return (
        <Card className="shadow-sm">
            <CardContent className="py-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                    {title}
                </h3>
                <ul className="divide-y divide-gray-200">
                    {items.length === 0 && (
                        <li className="text-sm text-gray-500 italic py-2">
                            No records yet.
                        </li>
                    )}
                    {items.map((item, i) => (
                        <li key={i} className="py-2 text-sm text-gray-800">
                            {type === "user" && (
                                <span>
                                    {item.name} ({item.email})
                                </span>
                            )}
                            {type === "project" && (
                                <span>
                                    {item.title} -{" "}
                                    <span className="text-gray-500">
                                        {item.user?.name}
                                    </span>
                                </span>
                            )}
                            {type === "payment" && (
                                <span>
                                    {item.user?.name} paid USD {item.amount} (
                                    {item.status})
                                </span>
                            )}
                            {type === "message" && (
                                <span>
                                    {item.name}:{" "}
                                    <span className="text-gray-500 truncate">
                                        {item.message.slice(0, 50)}
                                    </span>
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
