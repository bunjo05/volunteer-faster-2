import { useForm } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Plus,
    Search,
    Filter,
    TrendingUp,
    Edit,
    Trash2,
    X,
    Check,
    FolderTree,
    Tag,
    Layers,
    MoreVertical,
    ChevronDown,
    ChevronUp,
    Download,
} from "lucide-react";

export default function Categories({ categories = [] }) {
    const { data, setData, post, processing, reset } = useForm({
        name: "",
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [sortBy, setSortBy] = useState("newest");
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editData, setEditData] = useState({ name: "" });

    // Filter categories
    const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort categories
    const sortedCategories = [...filteredCategories].sort((a, b) => {
        if (sortBy === "newest") {
            return new Date(b.created_at) - new Date(a.created_at);
        } else if (sortBy === "oldest") {
            return new Date(a.created_at) - new Date(b.created_at);
        } else if (sortBy === "name-asc") {
            return a.name.localeCompare(b.name);
        } else if (sortBy === "name-desc") {
            return b.name.localeCompare(a.name);
        }
        return 0;
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (data.name.trim() !== "") {
            post(route("admin.categories.store"), {
                onSuccess: () => {
                    reset("name");
                    setShowForm(false);
                },
            });
        }
    };

    const handleEditSubmit = (categoryId) => {
        if (editData.name.trim() !== "") {
            const form = useForm({ name: editData.name });
            form.put(route("admin.categories.update", categoryId), {
                onSuccess: () => {
                    setEditingCategory(null);
                    setEditData({ name: "" });
                },
            });
        }
    };

    const handleDelete = (categoryId) => {
        if (
            confirm(
                "Are you sure you want to delete this category? This action cannot be undone."
            )
        ) {
            const form = useForm();
            form.delete(route("admin.categories.destroy", categoryId));
        }
    };

    const startEditing = (category) => {
        setEditingCategory(category.id);
        setEditData({ name: category.name });
    };

    const cancelEditing = () => {
        setEditingCategory(null);
        setEditData({ name: "" });
    };

    // Statistics
    const stats = {
        total: categories.length,
        withProjects: categories.filter((c) => c.projects_count > 0).length,
        recent: categories.filter(
            (c) =>
                new Date(c.created_at) >
                new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
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
                                Categories Management
                            </h1>
                            <p className="text-sm md:text-base text-gray-600 mt-1">
                                Organize and manage project categories
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition-colors">
                                <Download className="h-4 w-4" />
                                <span className="hidden sm:inline">Export</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Total Categories
                                </p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {stats.total}
                                </p>
                            </div>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <FolderTree className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    With Projects
                                </p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {stats.withProjects}
                                </p>
                            </div>
                            <div className="p-2 bg-green-50 rounded-lg">
                                <Layers className="h-5 w-5 text-green-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Recent (30 days)
                                </p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {stats.recent}
                                </p>
                            </div>
                            <div className="p-2 bg-amber-50 rounded-lg">
                                <Tag className="h-5 w-5 text-amber-600" />
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
                                    placeholder="Search categories by name..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full sm:w-auto pl-10 pr-8 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="name-asc">Name (A-Z)</option>
                                    <option value="name-desc">
                                        Name (Z-A)
                                    </option>
                                </select>
                                <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Create Category Form */}
                {showForm ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Create New Category
                            </h3>
                            <button
                                onClick={() => setShowForm(false)}
                                className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    placeholder="Enter category name (e.g., Education, Healthcare)"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Choose a descriptive name that represents
                                    the type of projects
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="h-4 w-4" />
                                            Create Category
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-3 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg shadow-sm transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="mb-6">
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Create New Category
                        </button>
                    </div>
                )}

                {/* Categories List */}
                {sortedCategories.length > 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                            Category
                                        </th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden md:table-cell">
                                            Projects
                                        </th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden lg:table-cell">
                                            Created
                                        </th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {sortedCategories.map((category) => (
                                        <tr
                                            key={category.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-4 py-4">
                                                {editingCategory ===
                                                category.id ? (
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="text"
                                                            value={
                                                                editData.name
                                                            }
                                                            onChange={(e) =>
                                                                setEditData({
                                                                    name: e
                                                                        .target
                                                                        .value,
                                                                })
                                                            }
                                                            className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                            autoFocus
                                                        />
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() =>
                                                                    handleEditSubmit(
                                                                        category.id
                                                                    )
                                                                }
                                                                className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                                                                title="Save"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={
                                                                    cancelEditing
                                                                }
                                                                className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                                                                title="Cancel"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                                                            <Tag className="h-5 w-5 text-indigo-600" />
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-900">
                                                                {category.name}
                                                            </span>
                                                            <p className="text-xs text-gray-500">
                                                                ID:{" "}
                                                                {category.id}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 hidden md:table-cell">
                                                <div className="flex items-center gap-2">
                                                    <Layers className="w-4 h-4 text-gray-400" />
                                                    <span className="font-medium text-gray-900">
                                                        {category.projects_count ||
                                                            0}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        projects
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 hidden lg:table-cell">
                                                <div className="text-sm text-gray-600">
                                                    {new Date(
                                                        category.created_at
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        }
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    {editingCategory !==
                                                        category.id && (
                                                        <>
                                                            <button
                                                                onClick={() =>
                                                                    startEditing(
                                                                        category
                                                                    )
                                                                }
                                                                className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                                                                title="Edit"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        category.id
                                                                    )
                                                                }
                                                                className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    /* Empty State */
                    <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 text-center">
                        <div className="mx-auto max-w-md">
                            <FolderTree className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No categories found
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                {searchTerm
                                    ? "Try adjusting your search criteria"
                                    : "Get started by creating your first category"}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition-colors"
                                >
                                    <Plus className="h-4 w-4" />
                                    Create Category
                                </button>
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg shadow-sm transition-colors"
                                    >
                                        Clear Search
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {sortedCategories.length > 0 && (
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-600">
                            Showing{" "}
                            <span className="font-medium">
                                1-{Math.min(10, sortedCategories.length)}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium">
                                {sortedCategories.length}
                            </span>{" "}
                            categories
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
