import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Organizations({ organizations }) {
    const [selectedOrg, setSelectedOrg] = useState(null);

    const closeModal = () => setSelectedOrg(null);

    return (
        <AdminLayout>
            <div className="min-h-screen py-8 px-4 sm:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-semibold text-gray-800">
                            Organizations
                        </h1>
                    </div>

                    {/* Search */}
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Search organizations..."
                            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Organizations Grid */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.isArray(organizations) &&
                        organizations.length > 0 ? (
                            organizations.map((org) => (
                                <div
                                    key={org.id}
                                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
                                >
                                    <img
                                        src={
                                            org.logo
                                                ? `/storage/${org.logo}`
                                                : "/images/default-org.jpg"
                                        }
                                        alt={org.name}
                                        className="h-40 w-full object-cover"
                                    />
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <h2 className="text-lg font-bold text-gray-800">
                                                {org.name}
                                            </h2>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${
                                                    org.status === "Approved"
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-yellow-100 text-yellow-600"
                                                }`}
                                            >
                                                {org.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">
                                            {org.description?.slice(0, 100) ??
                                                "No description provided."}
                                        </p>

                                        <div className="flex justify-between text-sm text-blue-600 font-medium">
                                            <button
                                                className="hover:underline"
                                                onClick={() =>
                                                    setSelectedOrg(org)
                                                }
                                            >
                                                View
                                            </button>
                                            {/* <button className="hover:underline text-yellow-600">
                                                Edit
                                            </button> */}
                                            <button className="hover:underline text-red-600">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center text-gray-500">
                                No organizations found.
                            </div>
                        )}
                    </div>

                    {/* Modal */}
                    {selectedOrg && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6 overflow-auto">
                            <div className="bg-white rounded-lg w-full max-w-lg sm:max-w-3xl shadow-xl relative">
                                <button
                                    onClick={closeModal}
                                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                                >
                                    ✕
                                </button>
                                <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6">
                                    <img
                                        src={
                                            selectedOrg.logo
                                                ? `/storage/${selectedOrg.logo}`
                                                : "/images/default-org.jpg"
                                        }
                                        alt={selectedOrg.name}
                                        className="w-full sm:w-48 h-48 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <h2 className="text-xl sm:text-2xl font-bold mb-2">
                                            {selectedOrg.name}
                                        </h2>
                                        <p className="text-sm text-gray-700 mb-4">
                                            {selectedOrg.description ||
                                                "No description available."}
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                                            <p>
                                                <strong>Slug:</strong>{" "}
                                                {selectedOrg.slug}
                                            </p>
                                            <p>
                                                <strong>City:</strong>{" "}
                                                {selectedOrg.city}
                                            </p>
                                            <p>
                                                <strong>Country:</strong>{" "}
                                                {selectedOrg.country}
                                            </p>
                                            <p>
                                                <strong>Founded:</strong>{" "}
                                                {selectedOrg.foundedYear}
                                            </p>
                                            <p>
                                                <strong>Phone:</strong>{" "}
                                                {selectedOrg.phone}
                                            </p>
                                            <p>
                                                <strong>Email:</strong>{" "}
                                                {selectedOrg.email}
                                            </p>
                                            <p className="col-span-full">
                                                <strong>Website:</strong>{" "}
                                                <a
                                                    href={selectedOrg.website}
                                                    className="text-blue-600 hover:underline"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {selectedOrg.website}
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
