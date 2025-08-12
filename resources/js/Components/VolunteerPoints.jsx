import { Link } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function VolunteerPoints({ initialPoints = 0, totalPoints }) {
    const [points, setPoints] = useState(initialPoints);
    const [isLoading, setIsLoading] = useState(false);

    // Optionally fetch updated points periodically
    useEffect(() => {
        const interval = setInterval(() => {
            setIsLoading(true);
            axios
                .get(route("volunteer.points.total"))
                .then((response) => {
                    setPoints(response.data.totalPoints);
                })
                .finally(() => setIsLoading(false));
        }, 300000); // Refresh every 5 minutes

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center space-x-2">
            <div className="relative group">
                <div className="flex items-center bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                    {isLoading ? (
                        <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    )}
                    <span>{points.totalPoints}</span>
                </div>

                {/* Tooltip on hover */}
                <div className="absolute z-10 hidden group-hover:block w-48 bg-white p-2 rounded-md shadow-lg border border-gray-200 text-sm text-gray-600">
                    Your available points balance
                    <Link
                        href={route("volunteer.points")}
                        className="block mt-1 text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        View details →
                    </Link>
                </div>
            </div>
        </div>
    );
}
