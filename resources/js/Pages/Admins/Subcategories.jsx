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
    ChevronDown,
    ChevronUp,
    Download,
    FolderOpen,
    Hash,
} from "lucide-react";

export default function Subcategories({ subcategories = [], categories = [] }) {
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [editingSubcategory, setEditingSubcategory] = useState(null);
    const [editData, setEditData] = useState({ name: "", category_id: "" });

    const { data, setData, post, processing, reset } = useForm({
        name: "",
        category_id: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (data.name.trim() && data.category_id) {
            post(route("admin.subcategories.store"), {
                onSuccess: () => {
                    reset();
                    setShowForm(false);
                },
            });
        }
    };

    const handleEditSubmit = (subcategoryId) => {
        if (editData.name.trim() && editData.category_id) {
            const form = useForm({
                name: editData.name,
                category_id: editData.category_id,
            });
            form.put(route("admin.subcategories.update", subcategoryId), {
                onSuccess: () => {
                    setEditingSubcategory(null);
                    setEditData({ name: "", category_id: "" });
                },
            });
        }
    };

    const handleDelete = (subcategoryId) => {
        if (
            confirm(
                "Are you sure you want to delete this subcategory? This action cannot be undone."
            )
        ) {
            const form = useForm();
            form.delete(route("admin.subcategories.destroy", subcategoryId));
        }
    };

    const startEditing = (subcategory) => {
        setEditingSubcategory(subcategory.id);
        setEditData({
            name: subcategory.name,
            category_id: subcategory.category_id,
        });
    };

    const cancelEditing = () => {
        setEditingSubcategory(null);
        setEditData({ name: "", category_id: "" });
    };

    // Filter subcategories
    const filteredSubcategories = subcategories.filter((sub) => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            sub.name.toLowerCase().includes(searchLower) ||
            sub.category?.name.toLowerCase().includes(searchLower);

        const matchesCategory =
            categoryFilter === "all" || sub.category_id == categoryFilter;

        return matchesSearch && matchesCategory;
    });

    // Sort subcategories
    const sortedSubcategories = [...filteredSubcategories].sort((a, b) => {
        if (sortBy === "newest") {
            return new Date(b.created_at) - new Date(a.created_at);
        } else if (sortBy === "oldest") {
            return new Date(a.created_at) - new Date(b.created_at);
        } else if (sortBy === "name-asc") {
            return a.name.localeCompare(b.name);
        } else if (sortBy === "name-desc") {
            return b.name.localeCompare(a.name);
        } else if (sortBy === "category") {
            return a.category?.name?.localeCompare(b.category?.name);
        }
        return 0;
    });

    // Statistics
    const stats = {
        total: subcategories.length,
        withProjects: subcategories.filter((s) => s.projects_count > 0).length,
        recent: subcategories.filter(
            (s) =>
                new Date(s.created_at) >
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
                                Subcategories Management
                            </h1>
                            <p className="text-sm md:text-base text-gray-600 mt-1">
                                Organize and manage project subcategories
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
                                    Total Subcategories
                                </p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {stats.total}
                                </p>
                            </div>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <FolderOpen className="h-5 w-5 text-blue-600" />
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
                                    placeholder="Search subcategories by name or category..."
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
                                    value={categoryFilter}
                                    onChange={(e) =>
                                        setCategoryFilter(e.target.value)
                                    }
                                    className="w-full sm:w-auto pl-10 pr-8 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            </div>
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
                                    <option value="category">
                                        By Category
                                    </option>
                                </select>
                                <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Create Subcategory Form */}
                {showForm ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Create New Subcategory
                            </h3>
                            <button
                                onClick={() => setShowForm(false)}
                                className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subcategory Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        placeholder="Enter subcategory name"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Parent Category
                                    </label>
                                    <select
                                        value={data.category_id}
                                        onChange={(e) =>
                                            setData(
                                                "category_id",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
                                    >
                                        <option value="">
                                            Select a category
                                        </option>
                                        {categories.map((category) => (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        !data.name.trim() ||
                                        !data.category_id
                                    }
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
                                            Create Subcategory
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
                            Create New Subcategory
                        </button>
                    </div>
                )}

                {/* Subcategories List */}
                {sortedSubcategories.length > 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                            Subcategory
                                        </th>
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
                                    {sortedSubcategories.map((subcategory) => (
                                        <tr
                                            key={subcategory.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-4 py-4">
                                                {editingSubcategory ===
                                                subcategory.id ? (
                                                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                                                        <div className="flex-1">
                                                            <input
                                                                type="text"
                                                                value={
                                                                    editData.name
                                                                }
                                                                onChange={(e) =>
                                                                    setEditData(
                                                                        {
                                                                            ...editData,
                                                                            name: e
                                                                                .target
                                                                                .value,
                                                                        }
                                                                    )
                                                                }
                                                                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                                autoFocus
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <select
                                                                value={
                                                                    editData.category_id
                                                                }
                                                                onChange={(e) =>
                                                                    setEditData(
                                                                        {
                                                                            ...editData,
                                                                            category_id:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        }
                                                                    )
                                                                }
                                                                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
                                                            >
                                                                <option value="">
                                                                    Select
                                                                    category
                                                                </option>
                                                                {categories.map(
                                                                    (
                                                                        category
                                                                    ) => (
                                                                        <option
                                                                            key={
                                                                                category.id
                                                                            }
                                                                            value={
                                                                                category.id
                                                                            }
                                                                        >
                                                                            {
                                                                                category.name
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() =>
                                                                    handleEditSubmit(
                                                                        subcategory.id
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
                                                        <div className="h-10 w-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                                                            <Hash className="h-5 w-5 text-indigo-600" />
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-900">
                                                                {
                                                                    subcategory.name
                                                                }
                                                            </span>
                                                            <p className="text-xs text-gray-500">
                                                                ID:{" "}
                                                                {subcategory.id}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <FolderTree className="w-4 h-4 text-gray-400" />
                                                    <span className="font-medium text-gray-900">
                                                        {subcategory.category
                                                            ?.name ||
                                                            "Uncategorized"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 hidden md:table-cell">
                                                <div className="flex items-center gap-2">
                                                    <Layers className="w-4 h-4 text-gray-400" />
                                                    <span className="font-medium text-gray-900">
                                                        {subcategory.projects_count ||
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
                                                        subcategory.created_at
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
                                                    {editingSubcategory !==
                                                        subcategory.id && (
                                                        <>
                                                            <button
                                                                onClick={() =>
                                                                    startEditing(
                                                                        subcategory
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
                                                                        subcategory.id
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
                            <FolderOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No subcategories found
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                {searchTerm || categoryFilter !== "all"
                                    ? "Try adjusting your search or filter criteria"
                                    : "Get started by creating your first subcategory"}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition-colors"
                                >
                                    <Plus className="h-4 w-4" />
                                    Create Subcategory
                                </button>
                                {(searchTerm || categoryFilter !== "all") && (
                                    <button
                                        onClick={() => {
                                            setSearchTerm("");
                                            setCategoryFilter("all");
                                        }}
                                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg shadow-sm transition-colors"
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {sortedSubcategories.length > 0 && (
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-600">
                            Showing{" "}
                            <span className="font-medium">
                                1-{Math.min(10, sortedSubcategories.length)}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium">
                                {sortedSubcategories.length}
                            </span>{" "}
                            subcategories
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
