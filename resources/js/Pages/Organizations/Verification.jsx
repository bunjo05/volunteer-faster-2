import OrganizationLayout from "@/Layouts/OrganizationLayout";
import React, { useState } from "react";
import { router, useForm, usePage } from "@inertiajs/react";

export default function Verification() {
    const { organization_profile } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        type_of_document: "",
        certificate: null,
        type_of_document_2: "",
        another_document: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(
            route("organization.verification.store", { organization_profile }),
            {
                data: data,
                forceFormData: true,
                onSuccess: () => reset(),
            }
        );
    };

    return (
        <OrganizationLayout>
            <div className="max-w-2xl p-8 mx-auto bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Account Verification
                    </h2>
                    <p className="mt-2 text-gray-600">
                        Upload your documents to verify your organization's
                        identity
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    encType="multipart/form-data"
                    className="space-y-6"
                >
                    {/* Primary Document Section */}
                    <div className="p-6 bg-gray-50 rounded-lg">
                        <h3 className="mb-4 text-lg font-semibold text-gray-700">
                            Primary Verification Document
                            <span className="ml-1 text-red-500">*</span>
                        </h3>

                        {/* Primary Document Type */}
                        <div className="mb-4">
                            <label className="block mb-2 font-medium text-gray-700">
                                Document Type
                            </label>
                            <select
                                value={data.type_of_document}
                                onChange={(e) =>
                                    setData("type_of_document", e.target.value)
                                }
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Select document type</option>
                                <option value="Certificate">Certificate</option>
                                <option value="License">License</option>
                                <option value="Permit">Permit</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.type_of_document && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.type_of_document}
                                </p>
                            )}
                        </div>

                        {/* Primary Document Upload */}
                        <div>
                            <label className="block mb-2 font-medium text-gray-700">
                                Upload Document
                            </label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col w-full border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100 border-gray-300 hover:border-gray-400">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg
                                            className="w-8 h-8 mb-4 text-gray-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                            ></path>
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">
                                                Click to upload
                                            </span>{" "}
                                            or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            PDF, JPG, or PNG (MAX. 5MB)
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        onChange={(e) =>
                                            setData(
                                                "certificate",
                                                e.target.files[0]
                                            )
                                        }
                                        accept=".pdf,.jpg,.png"
                                        className="hidden"
                                        required
                                    />
                                </label>
                            </div>
                            {errors.certificate && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.certificate}
                                </p>
                            )}
                            {data.certificate && (
                                <p className="mt-2 text-sm text-green-600">
                                    Selected file: {data.certificate.name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Secondary Document Section */}
                    <div className="p-6 bg-gray-50 rounded-lg">
                        <h3 className="mb-4 text-lg font-semibold text-gray-700">
                            Additional Document (Optional)
                        </h3>

                        {/* Secondary Document Type */}
                        <div className="mb-4">
                            <label className="block mb-2 font-medium text-gray-700">
                                Document Type
                            </label>
                            <select
                                value={data.type_of_document_2}
                                onChange={(e) =>
                                    setData(
                                        "type_of_document_2",
                                        e.target.value
                                    )
                                }
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">None</option>
                                <option value="Certificate">Certificate</option>
                                <option value="License">License</option>
                                <option value="Permit">Permit</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.type_of_document_2 && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.type_of_document_2}
                                </p>
                            )}
                        </div>

                        {/* Secondary Document Upload */}
                        <div>
                            <label className="block mb-2 font-medium text-gray-700">
                                Upload Document
                            </label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col w-full border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100 border-gray-300 hover:border-gray-400">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg
                                            className="w-8 h-8 mb-4 text-gray-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                            ></path>
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">
                                                Click to upload
                                            </span>{" "}
                                            or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            PDF, JPG, or PNG (MAX. 5MB)
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        onChange={(e) =>
                                            setData(
                                                "another_document",
                                                e.target.files[0]
                                            )
                                        }
                                        accept=".pdf,.jpg,.png"
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            {errors.another_document && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.another_document}
                                </p>
                            )}
                            {data.another_document && (
                                <p className="mt-2 text-sm text-green-600">
                                    Selected file: {data.another_document.name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className={`px-6 py-3 font-medium text-white rounded-md transition-colors ${
                                processing
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {processing ? (
                                <span className="flex items-center">
                                    <svg
                                        className="w-4 h-4 mr-2 animate-spin"
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
                            ) : (
                                "Submit for Verification"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </OrganizationLayout>
    );
}
