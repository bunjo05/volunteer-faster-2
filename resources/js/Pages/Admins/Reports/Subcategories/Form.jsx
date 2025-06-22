// resources/js/Pages/Admin/Reports/SubcategoryForm.jsx
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
// import Link from "@inertiajs/react";

export default function ReportSubcategoryForm({
    reportSubcategory = null,
    reportCategories,
}) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        report_category_id: reportSubcategory?.report_category_id || "",
        name: reportSubcategory?.name || "",
        // description: reportSubcategory?.description || "",
        // is_active: reportSubcategory?.is_active ?? true,
    });

    const { flash } = usePage().props;
    const [filteredCategories, setFilteredCategories] =
        useState(reportCategories);

    useEffect(() => {
        if (reportSubcategory) {
            setData({
                report_category_id: reportSubcategory.report_category_id,
                name: reportSubcategory.name,
                // description: reportSubcategory.description,
                // is_active: reportSubcategory.is_active,
            });
        }
    }, [reportSubcategory]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (reportSubcategory) {
            put(
                route(
                    "admin.report-subcategories.update",
                    reportSubcategory.id
                ),
                {
                    onSuccess: () => reset(),
                }
            );
        } else {
            post(route("admin.report-subcategories.store"), {
                onSuccess: () => reset(),
            });
        }
    };

    return (
        <AdminLayout>
            <Head
                title={
                    reportSubcategory
                        ? "Edit Report Subcategory"
                        : "Create Report Subcategory"
                }
            />

            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">
                        {reportSubcategory
                            ? "Edit Report Subcategory"
                            : "Create New Report Subcategory"}
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
                                htmlFor="report_category_id"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Parent Category *
                            </label>
                            <select
                                id="report_category_id"
                                value={data.report_category_id}
                                onChange={(e) =>
                                    setData(
                                        "report_category_id",
                                        e.target.value
                                    )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select a category</option>
                                {filteredCategories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {errors.report_category_id && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.report_category_id}
                                </p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Subcategory Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Equipment Safety"
                                required
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* <div className="mb-4">
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                                placeholder="Brief description of this subcategory"
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.description}
                                </p>
                            )}
                        </div> */}

                        {/* <div className="mb-6">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) =>
                                        setData("is_active", e.target.checked)
                                    }
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                />
                                <span className="ml-2 text-sm text-gray-600">
                                    Active (visible to volunteers)
                                </span>
                            </label>
                        </div> */}

                        <div className="flex justify-end space-x-3">
                            <Link
                                href={route("admin.report-subcategories.index")}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </Link>
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
                                ) : reportSubcategory ? (
                                    "Update Subcategory"
                                ) : (
                                    "Create Subcategory"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
