// resources/js/Components/Pagination.jsx
import React from "react";
import { Link } from "@inertiajs/react";

export default function Pagination({ links, className = "" }) {
    return (
        <div className={`flex items-center space-x-1 ${className}`}>
            {links.map((link, index) => (
                <Link
                    key={index}
                    href={link.url || "#"}
                    className={`px-4 py-2 rounded-md ${
                        link.active
                            ? "bg-indigo-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    } ${
                        !link.url
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
}
