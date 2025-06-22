import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import React, { useEffect } from "react";

export default function ReportCategoryForm({ reportCategory = null }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: "",
    });

    const { flash } = usePage().props;

    // If editing, populate form with existing data
    useEffect(() => {
        if (reportCategory) {
            setData({
                name: reportCategory.name,
            });
        }
    }, [reportCategory]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (reportCategory) {
            // Update existing category
            put(route("admin.report-categories.update", reportCategory.id), {
                onSuccess: () => reset(),
            });
        } else {
            // Create new category
            post(route("admin.report-categories.store"), {
                onSuccess: () => reset(),
            });
        }
    };

    return (
        <AdminLayout>
            <Head
                title={
                    reportCategory
                        ? "Edit Report Category"
                        : "Create Report Category"
                }
            />

            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">
                        {reportCategory
                            ? "Edit Report Category"
                            : "Create New Report Category"}
                    </h1>

                    {/* {flash.message && (
                        <div
                            className={`mb-4 p-3 rounded ${
                                flash.type === "success"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                            }`}
                        >
                            {flash.message}
                        </div>
                    )} */}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Category Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Safety Concerns"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3">
                            <a
                                href={route("admin.report-categories")}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </a>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {processing ? (
                                    <span className="flex items-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : reportCategory ? (
                                    "Update Category"
                                ) : (
                                    "Create Category"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
