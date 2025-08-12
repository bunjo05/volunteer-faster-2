import { useState } from "react";
import { router, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Plus, Users as UsersIcon } from "lucide-react";

export default function Users({ users = [] }) {
    const [statusChanges, setStatusChanges] = useState({});
    const [search, setSearch] = useState("");

    const handleStatusChange = (userId, newStatus) => {
        setStatusChanges((prev) => ({ ...prev, [userId]: newStatus }));
        router.put(`/admin/users/${userId}/status`, { status: newStatus });
    };

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="min-h-screen py-8 px-4 sm:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <UsersIcon className="h-6 w-6 text-blue-600" />
                            <h1 className="text-3xl font-semibold text-gray-800">
                                Users
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href={route("admin.referrals.index")}
                                className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-100"
                            >
                                View Referrals
                            </Link>
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow">
                                <Plus className="h-4 w-4" /> Add User
                            </button>
                        </div>
                    </div>

                    {/* Search */}
                    <div>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search users by name or email..."
                            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-100">
                        <table className="min-w-full text-sm text-left text-gray-700">
                            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">Role</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user, idx) => (
                                        <tr
                                            key={user.id}
                                            className="border-t hover:bg-gray-50 transition-colors"
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
                                                        statusChanges[
                                                            user.id
                                                        ] ||
                                                        user.status ||
                                                        "Active"
                                                    }
                                                    onChange={(e) =>
                                                        handleStatusChange(
                                                            user.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-6 py-6 text-center text-gray-500"
                                        >
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
