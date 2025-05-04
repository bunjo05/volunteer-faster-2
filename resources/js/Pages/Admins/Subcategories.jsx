import { useForm } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Plus } from "lucide-react";

export default function Subcategories({ subcategories = [], categories = [] }) {
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

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

    const filteredSubcategories = subcategories.filter((sub) =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="min-h-screen py-8 px-4 sm:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-semibold text-gray-800">
                            Subcategories
                        </h1>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow"
                        >
                            <Plus size={18} />
                            {showForm ? "Close" : "Add Subcategory"}
                        </button>
                    </div>

                    {showForm && (
                        <form
                            onSubmit={handleSubmit}
                            className="bg-white rounded-lg shadow p-6 mb-6 space-y-4"
                        >
                            <div className="grid sm:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    placeholder="Subcategory name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <select
                                    value={data.category_id}
                                    onChange={(e) =>
                                        setData("category_id", e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select category</option>
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
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                            >
                                Save Subcategory
                            </button>
                        </form>
                    )}

                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Search subcategories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg shadow-sm">
                            <thead className="bg-gray-100 text-gray-700 text-sm uppercase text-left">
                                <tr>
                                    <th className="px-6 py-4">
                                        Subcategory Name
                                    </th>
                                    <th className="px-6 py-4">Category</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-700">
                                {filteredSubcategories.map(
                                    (subcategory, idx) => (
                                        <tr
                                            key={subcategory.id}
                                            className={
                                                idx % 2 === 0
                                                    ? "bg-white"
                                                    : "bg-gray-50"
                                            }
                                        >
                                            <td className="px-6 py-4 font-medium">
                                                {subcategory.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {subcategory.category?.name ||
                                                    "N/A"}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
