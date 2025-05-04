import { useForm } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Plus, Search } from "lucide-react";

export default function Categories({ categories = [] }) {
    const { data, setData, post, processing, reset } = useForm({
        name: "",
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);

    const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    return (
        <AdminLayout>
            <div className="min-h-screen py-10 px-4 sm:px-8 bg-gray-100">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-2 sm:mb-0">
                                Manage Categories
                            </h1>
                            <p className="text-gray-600">
                                Create and search through your categories in one
                                place.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-150"
                        >
                            <Plus size={18} />
                            {showForm ? "Cancel" : "Create Category"}
                        </button>
                    </div>

                    {showForm && (
                        <form
                            onSubmit={handleSubmit}
                            className="bg-white rounded-xl shadow p-6 mb-6 flex flex-col sm:flex-row items-center gap-4"
                        >
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                placeholder="Enter new category name"
                                className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-150"
                            >
                                <Plus size={18} /> Add Category
                            </button>
                        </form>
                    )}

                    {/* Search Bar */}
                    <div className="mb-4 relative">
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-1/2 pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Categories Table */}
                    <div className="overflow-x-auto bg-white rounded-xl shadow">
                        <table className="min-w-full text-sm text-left text-gray-700">
                            <thead className="bg-gray-100 uppercase text-gray-600 text-xs">
                                <tr>
                                    <th className="px-6 py-4">Category Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCategories.length > 0 ? (
                                    filteredCategories.map((category, idx) => (
                                        <tr
                                            key={category.id}
                                            className={
                                                idx % 2 === 0
                                                    ? "bg-white"
                                                    : "bg-gray-50"
                                            }
                                        >
                                            <td className="px-6 py-4 font-medium">
                                                {category.name}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="px-6 py-6 text-center text-gray-400 italic">
                                            No categories found.
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
