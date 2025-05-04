import { useState } from "react";
import { router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Users({ users = [] }) {
    const [statusChanges, setStatusChanges] = useState({});

    const handleStatusChange = (userId, newStatus) => {
        setStatusChanges((prev) => ({ ...prev, [userId]: newStatus }));
        router.put(`/admin/users/${userId}/status`, { status: newStatus });
    };

    return (
        <AdminLayout>
            <div className="min-h-screen py-8 px-4 sm:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-semibold text-gray-800">
                            Users
                        </h1>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow">
                            Add User
                        </button>
                    </div>

                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg shadow-sm">
                            <thead className="bg-gray-100 text-gray-700 text-sm uppercase text-left">
                                <tr>
                                    {/* <th className="px-6 py-4">Photo</th> */}
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Status</th>
                                    {/* <th className="px-6 py-4">Actions</th> */}
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-700">
                                {users.map((user, idx) => (
                                    <tr
                                        key={user.id}
                                        className={
                                            idx % 2 === 0
                                                ? "bg-white"
                                                : "bg-gray-50"
                                        }
                                    >
                                        <td className="px-6 py-4 font-medium">
                                            {user.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.role}
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={
                                                    statusChanges[user.id] ||
                                                    user.status ||
                                                    "Active"
                                                }
                                                onChange={(e) =>
                                                    handleStatusChange(
                                                        user.id,
                                                        e.target.value
                                                    )
                                                }
                                                className="border rounded px-2 py-1 text-sm bg-white"
                                            >
                                                <option value="Active">
                                                    Active
                                                </option>
                                                <option value="Pending">
                                                    Pending
                                                </option>
                                                <option value="Suspended">
                                                    Suspended
                                                </option>
                                            </select>
                                        </td>
                                        {/* <td className="px-6 py-4">
                                            <button className="text-blue-600 hover:underline text-sm">
                                                View
                                            </button>
                                        </td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
