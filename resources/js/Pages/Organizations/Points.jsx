import OrganizationLayout from "@/Layouts/OrganizationLayout";
import { Head } from "@inertiajs/react";
import { format } from "date-fns";

export default function Points({ auth, totalPoints, pointsHistory }) {
    return (
        <OrganizationLayout auth={auth}>
            <Head title="Organization Points" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Organization Points
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Track points credited to your organization
                        </p>
                    </div>

                    <div className="px-6 py-4">
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                            <h3 className="text-lg font-medium text-blue-800 mb-2">
                                Total Points: {totalPoints}
                            </h3>
                            <p className="text-sm text-blue-700">
                                {pointsHistory.length > 0
                                    ? `You've received points from ${pointsHistory.length} transactions.`
                                    : "You haven't received any points yet."}
                            </p>
                        </div>

                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Date
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Points
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            From Volunteer
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Project
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Description
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {pointsHistory.length > 0 ? (
                                        pointsHistory.map((transaction) => (
                                            <tr key={transaction.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {format(
                                                        new Date(
                                                            transaction.created_at
                                                        ),
                                                        "MMM d, yyyy"
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                                    +{transaction.points}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {transaction.user?.name ||
                                                        "N/A"}
                                                    {transaction.user
                                                        ?.email && (
                                                        <div className="text-xs text-gray-400">
                                                            {
                                                                transaction.user
                                                                    .email
                                                            }
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {transaction.booking
                                                        ?.project?.title ||
                                                        "N/A"}
                                                    {transaction.booking && (
                                                        <div className="text-xs text-gray-400">
                                                            {format(
                                                                new Date(
                                                                    transaction.booking.start_date
                                                                ),
                                                                "MMM d, yyyy"
                                                            )}{" "}
                                                            -{" "}
                                                            {format(
                                                                new Date(
                                                                    transaction.booking.end_date
                                                                ),
                                                                "MMM d, yyyy"
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {transaction.description}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="px-6 py-4 text-center text-sm text-gray-500"
                                            >
                                                No point transactions yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </OrganizationLayout>
    );
}
