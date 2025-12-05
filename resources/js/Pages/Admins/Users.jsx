import { useState } from "react";
import { router, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Plus,
    Users as UsersIcon,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    Mail,
    Phone,
    Calendar,
    Shield,
    CheckCircle,
    XCircle,
    Clock,
} from "lucide-react";

export default function Users({ users = [] }) {
    const [statusChanges, setStatusChanges] = useState({});
    const [search, setSearch] = useState("");
    const [selectedRole, setSelectedRole] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");

    const handleStatusChange = (userId, newStatus) => {
        setStatusChanges((prev) => ({ ...prev, [userId]: newStatus }));
        router.put(`/admin/users/${userId}/status`, { status: newStatus });
    };

    const handleDeleteUser = (userId) => {
        if (confirm("Are you sure you want to delete this user?")) {
            router.delete(`/admin/users/${userId}`);
        }
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase());

        const matchesRole =
            selectedRole === "all" || user.role === selectedRole;
        const matchesStatus =
            selectedStatus === "all" || user.status === selectedStatus;

        return matchesSearch && matchesRole && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "active":
                return "text-green-700 bg-green-50 border-green-200";
            case "pending":
                return "text-amber-700 bg-amber-50 border-amber-200";
            case "suspended":
                return "text-red-700 bg-red-50 border-red-200";
            case "inactive":
                return "text-gray-700 bg-gray-50 border-gray-200";
            default:
                return "text-blue-700 bg-blue-50 border-blue-200";
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "active":
                return <CheckCircle className="w-4 h-4" />;
            case "pending":
                return <Clock className="w-4 h-4" />;
            case "suspended":
                return <XCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const getRoleColor = (role) => {
        switch (role?.toLowerCase()) {
            case "admin":
                return "text-purple-700 bg-purple-50";
            case "user":
                return "text-blue-700 bg-blue-50";
            case "moderator":
                return "text-emerald-700 bg-emerald-50";
            case "super_admin":
                return "text-red-700 bg-red-50";
            default:
                return "text-gray-700 bg-gray-50";
        }
    };

    // Statistics
    const stats = {
        total: users.length,
        active: users.filter((u) => u.status === "Active").length,
        pending: users.filter((u) => u.status === "Pending").length,
        admins: users.filter(
            (u) => u.role === "Admin" || u.role === "Super Admin"
        ).length,
    };

    return (
        <AdminLayout>
            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                User Management
                            </h1>
                            <p className="text-sm md:text-base text-gray-600 mt-1">
                                Manage and monitor all user accounts
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href={route("admin.referrals.index")}
                                className="px-3 py-2 md:px-4 md:py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
                            >
                                <Shield className="w-4 h-4" />
                                <span className="hidden sm:inline">
                                    View Referrals
                                </span>
                                <span className="sm:hidden">Referrals</span>
                            </Link>
                            <button className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition-colors">
                                <Plus className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                    Add User
                                </span>
                                <span className="sm:hidden">Add</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Total Users
                                </p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {stats.total}
                                </p>
                            </div>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <UsersIcon className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Active</p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {stats.active}
                                </p>
                            </div>
                            <div className="p-2 bg-green-50 rounded-lg">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {stats.pending}
                                </p>
                            </div>
                            <div className="p-2 bg-amber-50 rounded-lg">
                                <Clock className="h-5 w-5 text-amber-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Admins</p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {stats.admins}
                                </p>
                            </div>
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <Shield className="h-5 w-5 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search users by name or email..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <select
                                    value={selectedRole}
                                    onChange={(e) =>
                                        setSelectedRole(e.target.value)
                                    }
                                    className="w-full sm:w-auto pl-10 pr-8 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
                                >
                                    <option value="all">All Roles</option>
                                    <option value="Admin">Admin</option>
                                    <option value="User">User</option>
                                    <option value="Moderator">Moderator</option>
                                </select>
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            </div>
                            <div className="relative">
                                <select
                                    value={selectedStatus}
                                    onChange={(e) =>
                                        setSelectedStatus(e.target.value)
                                    }
                                    className="w-full sm:w-auto pl-10 pr-8 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
                                >
                                    <option value="all">All Status</option>
                                    <option value="Active">Active</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Suspended">Suspended</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users List / Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Desktop Table */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-700">
                                        User
                                    </th>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-700">
                                        Contact
                                    </th>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-700">
                                        Role
                                    </th>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-700">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-700">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                                                        {user.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {user.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Joined{" "}
                                                            {new Date(
                                                                user.created_at
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-gray-700">
                                                        <Mail className="w-4 h-4" />
                                                        <span className="text-sm">
                                                            {user.email}
                                                        </span>
                                                    </div>
                                                    {user.phone && (
                                                        <div className="flex items-center gap-2 text-gray-500">
                                                            <Phone className="w-4 h-4" />
                                                            <span className="text-sm">
                                                                {user.phone}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(
                                                        user.role
                                                    )}`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
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
                                                        className={`border rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(
                                                            statusChanges[
                                                                user.id
                                                            ] || user.status
                                                        )}`}
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
                                                        <option value="Inactive">
                                                            Inactive
                                                        </option>
                                                    </select>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-1.5 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteUser(
                                                                user.id
                                                            )
                                                        }
                                                        className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <UsersIcon className="w-16 h-16 mb-4 opacity-40" />
                                                <p className="text-lg font-medium mb-2">
                                                    No users found
                                                </p>
                                                <p className="text-sm">
                                                    Try adjusting your search or
                                                    filters
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="lg:hidden">
                        {filteredUsers.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {filteredUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className="p-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
                                                    {user.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {user.name}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span
                                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                                                                user.role
                                                            )}`}
                                                        >
                                                            {user.role}
                                                        </span>
                                                        <span
                                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                                                                user.status
                                                            )}`}
                                                        >
                                                            {getStatusIcon(
                                                                user.status
                                                            )}
                                                            {user.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="p-1 text-gray-400 hover:text-gray-600">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail className="w-4 h-4" />
                                                <span>{user.email}</span>
                                            </div>
                                            {user.phone && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Phone className="w-4 h-4" />
                                                    <span>{user.phone}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    Joined{" "}
                                                    {new Date(
                                                        user.created_at
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
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
                                                className={`w-full max-w-[150px] border rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(
                                                    statusChanges[user.id] ||
                                                        user.status
                                                )}`}
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
                                                <option value="Inactive">
                                                    Inactive
                                                </option>
                                            </select>
                                            <div className="flex items-center gap-1">
                                                <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteUser(
                                                            user.id
                                                        )
                                                    }
                                                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <div className="flex flex-col items-center justify-center text-gray-500">
                                    <UsersIcon className="w-16 h-16 mb-4 opacity-40" />
                                    <p className="text-lg font-medium mb-2">
                                        No users found
                                    </p>
                                    <p className="text-sm">
                                        Try adjusting your search or filters
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pagination */}
                {filteredUsers.length > 0 && (
                    <div className="mt-6 flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Showing{" "}
                            <span className="font-medium">
                                1-{Math.min(10, filteredUsers.length)}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium">
                                {filteredUsers.length}
                            </span>{" "}
                            users
                        </p>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                Previous
                            </button>
                            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
