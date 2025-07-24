// resources/js/Pages/Volunteers/Points.jsx

import VolunteerLayout from "@/Layouts/VolunteerLayout";
import { Head } from "@inertiajs/react";
import { format } from "date-fns";

export default function Points({ auth, points }) {
    return (
        <VolunteerLayout auth={auth}>
            <Head title="My Points" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">
                            My Volunteer Points
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Track your earned points from completed projects
                        </p>
                    </div>

                    <div className="px-6 py-4">
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                            <h3 className="text-lg font-medium text-blue-800 mb-2">
                                Total Points: {points.total}
                            </h3>
                            <p className="text-sm text-blue-700">
                                You've earned {points.total} points from{" "}
                                {points.history.length} completed projects.
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
                                            Project
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Dates
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
                                            Awarded On
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {points.history.length > 0 ? (
                                        points.history.map((point) => (
                                            <tr key={point.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {
                                                        point.booking.project
                                                            .title
                                                    }
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {format(
                                                        new Date(
                                                            point.booking.start_date
                                                        ),
                                                        "MMM d, yyyy"
                                                    )}{" "}
                                                    -{" "}
                                                    {format(
                                                        new Date(
                                                            point.booking.end_date
                                                        ),
                                                        "MMM d, yyyy"
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {point.points_earned}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {format(
                                                        new Date(
                                                            point.created_at
                                                        ),
                                                        "MMM d, yyyy"
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="px-6 py-4 text-center text-sm text-gray-500"
                                            >
                                                No points earned yet. Complete
                                                projects to earn points!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </VolunteerLayout>
    );
}
