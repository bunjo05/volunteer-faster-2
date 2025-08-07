import OrganizationLayout from "@/Layouts/OrganizationLayout";
import React, { useState } from "react";
import { router, useForm, usePage } from "@inertiajs/react";

export default function Verification() {
    const { organization_profile } = usePage().props; // Get the organization profile from props

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
            <div className="max-w-xl p-6 mx-auto bg-white rounded shadow">
                <h2 className="mb-4 text-xl font-bold">Account Verification</h2>
                <form
                    onSubmit={handleSubmit}
                    encType="multipart/form-data"
                    className="space-y-4"
                >
                    {/* Primary Document Type */}
                    <div>
                        <label className="block font-medium">
                            Primary Document Type{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={data.type_of_document}
                            onChange={(e) =>
                                setData("type_of_document", e.target.value)
                            }
                            className="w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded"
                            required
                        >
                            <option value="">Select document type</option>
                            <option value="Certificate">Certificate</option>
                            <option value="License">License</option>
                            <option value="Permit">Permit</option>
                            <option value="Other">Other</option>
                        </select>
                        {errors.type_of_document && (
                            <p className="text-sm text-red-500">
                                {errors.type_of_document}
                            </p>
                        )}
                    </div>

                    {/* Primary Document File Upload */}
                    <div>
                        <label className="block font-medium">
                            Upload Document{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="file"
                            onChange={(e) =>
                                setData("certificate", e.target.files[0])
                            }
                            accept=".pdf,.jpg,.png"
                            className="w-full mt-1"
                            required
                        />
                        {errors.certificate && (
                            <p className="text-sm text-red-500">
                                {errors.certificate}
                            </p>
                        )}
                    </div>

                    {/* Secondary Document Type (Optional) */}
                    <div>
                        <label className="block font-medium">
                            Additional Document Type
                        </label>
                        <select
                            value={data.type_of_document_2}
                            onChange={(e) =>
                                setData("type_of_document_2", e.target.value)
                            }
                            className="w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded"
                        >
                            <option value="">None</option>
                            <option value="Certificate">Certificate</option>
                            <option value="License">License</option>
                            <option value="Permit">Permit</option>
                            <option value="Other">Other</option>
                        </select>
                        {errors.type_of_document_2 && (
                            <p className="text-sm text-red-500">
                                {errors.type_of_document_2}
                            </p>
                        )}
                    </div>

                    {/* Secondary Document File Upload (Optional) */}
                    <div>
                        <label className="block font-medium">
                            Upload Additional Document
                        </label>
                        <input
                            type="file"
                            onChange={(e) =>
                                setData("another_document", e.target.files[0])
                            }
                            accept=".pdf,.jpg,.png"
                            className="w-full mt-1"
                        />
                        {errors.another_document && (
                            <p className="text-sm text-red-500">
                                {errors.another_document}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
                        >
                            {processing
                                ? "Submitting..."
                                : "Submit for Verification"}
                        </button>
                    </div>
                </form>
            </div>
        </OrganizationLayout>
    );
}
