import React from "react";
import { Link } from "@inertiajs/react";
import { StarIcon } from "lucide-react";

export default function TotalPoints({ points }) {
    return (
        <Link
            href={route("volunteer.points")}
            className="fixed bottom-20 right-6 z-50 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-lg p-3 flex items-center gap-2 transition-all transform hover:scale-105"
        >
            <div className="relative">
                <StarIcon className="w-6 h-6" />
                {points > 0 && (
                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center text-yellow-800 shadow-sm">
                        {points}
                    </span>
                )}
            </div>
        </Link>
    );
}
