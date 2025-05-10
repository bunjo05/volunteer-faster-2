import React, { useState } from "react";
import { useForm, Head } from "@inertiajs/react";
import OrganizationLayout from "@/Layouts/OrganizationLayout";

export default function Edit({
    project,
    categories,
    subcategories,
    gallery_images,
    projectRemarks,
}) {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const suitableOptions = ["Adults", "Students", "Families", "Retirees"];

    const { data, setData, post, errors, processing } = useForm({
        title: project.title || "",
        slug: project.slug || "",
        featured_image: project.featured_image || "",
        category_id: project.category_id || "",
        subcategory_id: project.subcategory_id || "",
        address: project.address || "",
        short_description: project.short_description || "",
        detailed_description: project.detailed_description || "",
        duration: project.duration || "",
        duration_type: project.duration_type || "Days",
        daily_routine: project.daily_routine || "",
        fees: project.fees || "",
        currency: project.currency || "",
        activities: project.activities || "",
        suitable: project.suitable || [], // make sure this defaults to an array
        availability_months: project.availability_months || [],
        gallery_images: project.gallery_images || [],
        start_date: project.start_date || "",
        status: "Pending", // Always reset to Pending on update
        request_for_approval: false,
    });

    console.log(errors);

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        // Loop through all form data
        Object.entries(data).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                if (key === "gallery_images" && value.length > 0) {
                    value.forEach((file) => {
                        if (file instanceof File) {
                            formData.append("gallery_images[]", file);
                        }
                    });
                } else {
                    value.forEach((v, i) => {
                        formData.append(`${key}[${i}]`, v);
                    });
                }
            } else if (key === "featured_image" && value instanceof File) {
                formData.append("featured_image", value); // Append new image if selected
            } else if (
                key === "featured_image_existing" &&
                !data.featured_image
            ) {
                // If no new image is uploaded, append the existing image URL
                formData.append(
                    "featured_image_existing",
                    project.featured_image
                );
            } else {
                formData.append(key, value); // For other fields
            }
        });

        // Make the POST request
        post(route("organization.projects.update", project.slug), {
            data: formData,
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const toggleCheckboxArray = (key, value) => {
        if (data[key].includes(value)) {
            setData(
                key,
                data[key].filter((v) => v !== value)
            );
        } else {
            setData(key, [...data[key], value]);
        }
    };

    const [selectedCategory, setSelectedCategory] = useState("");

    const selected = categories.find(
        (cat) => String(cat.id) === String(selectedCategory)
    );

    const inputClass =
        "w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300";
    const labelClass = "block text-sm font-medium text-gray-700";

    return (
        <OrganizationLayout>
            <div className="mx-auto px-10 py-10 bg-[#fff] rounded-lg">
                {project.status === "Rejected" && projectRemarks.length > 0 && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        <p className="font-semibold mb-2">
                            Remarks from Admin:
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                            {projectRemarks.map((remark) => (
                                <li className="text-sm" key={remark.id}>
                                    {remark.remark}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <h1 className="text-3xl font-bold mb-6 text-gray-800">
                    Edit Project
                </h1>

                <form
                    onSubmit={handleSubmit}
                    encType="multipart/form-data"
                    className="space-y-6 bg-white p-6 rounded shadow"
                >
                    {/* Text Inputs */}
                    {[
                        ["Title", "title"],
                        ["Slug", "slug"],
                        ["Address", "address"],
                        ["Duration", "duration"],
                        ["Fees", "fees"],
                        ["Currency", "currency"],
                        ["Activities", "activities"],
                    ].map(([label, field]) => (
                        <div key={field}>
                            <label className="block font-semibold text-sm text-gray-700">
                                {label}
                            </label>
                            <input
                                type="text"
                                value={data[field]}
                                onChange={(e) => setData(field, e.target.value)}
                                className="w-full mt-1 p-2 border rounded"
                            />
                            {errors[field] && (
                                <p className="text-red-500 text-sm">
                                    {errors[field]}
                                </p>
                            )}
                        </div>
                    ))}

                    {/* Select: Duration Type */}
                    <div>
                        <label className="block font-semibold text-sm text-gray-700">
                            Duration Type
                        </label>
                        <select
                            value={data.duration_type}
                            onChange={(e) =>
                                setData("duration_type", e.target.value)
                            }
                            className="w-full mt-1 p-2 border rounded"
                        >
                            <option value="Days">Days</option>
                            <option value="Weeks">Weeks</option>
                            <option value="Months">Months</option>
                        </select>
                        {errors.duration_type && (
                            <p className="text-red-500 text-sm">
                                {errors.duration_type}
                            </p>
                        )}
                    </div>

                    {/* Selects: Category + Subcategory */}
                    <div>
                        <label className={labelClass}>Category</label>
                        <select
                            value={data.category_id}
                            onChange={(e) => {
                                setData("category_id", e.target.value);
                                setSelectedCategory(e.target.value);
                            }}
                            className={inputClass}
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {errors.category_id && (
                            <div className="text-red-500">
                                {errors.category_id}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className={labelClass}>Subcategory</label>
                        <select
                            value={data.subcategory_id}
                            onChange={(e) =>
                                setData("subcategory_id", e.target.value)
                            }
                            className={inputClass}
                        >
                            <option value="">Select Subcategory</option>
                            {Array.isArray(selected?.subcategories) &&
                                selected.subcategories.map((sub) => (
                                    <option key={sub.id} value={sub.id}>
                                        {sub.name}
                                    </option>
                                ))}
                        </select>
                        {errors.subcategory_id && (
                            <div className="text-red-500">
                                {errors.subcategory_id}
                            </div>
                        )}
                    </div>

                    {/* Textareas */}
                    {[
                        ["Short Description", "short_description"],
                        ["Detailed Description", "detailed_description"],
                        ["Daily Routine", "daily_routine"],
                    ].map(([label, field]) => (
                        <div key={field}>
                            <label className="block font-semibold text-sm text-gray-700">
                                {label}
                            </label>
                            <textarea
                                value={data[field]}
                                onChange={(e) => setData(field, e.target.value)}
                                className="w-full mt-1 p-2 border rounded"
                                rows={4}
                            />
                            {errors[field] && (
                                <p className="text-red-500 text-sm">
                                    {errors[field]}
                                </p>
                            )}
                        </div>
                    ))}

                    {/* Date Picker */}
                    <div>
                        <label className="block font-semibold text-sm text-gray-700">
                            Start Date
                        </label>
                        <input
                            type="date"
                            value={data.start_date}
                            onChange={(e) =>
                                setData("start_date", e.target.value)
                            }
                            className="w-full mt-1 p-2 border rounded"
                        />
                        {errors.start_date && (
                            <p className="text-red-500 text-sm">
                                {errors.start_date}
                            </p>
                        )}
                    </div>

                    {/* Featured Image Display */}
                    {data.featured_image || project.featured_image_url ? (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Featured Image
                            </label>
                            <img
                                src={
                                    project.featured_image
                                        ? `/storage/${project.featured_image}`
                                        : "/images/placeholder.jpg"
                                }
                                alt={project.title}
                                className="object-cover w-[200px] h-full rounded-lg"
                            />
                        </div>
                    ) : null}

                    {/* File Upload for Featured Image */}
                    <div>
                        <label className="block font-semibold text-sm text-gray-700">
                            Featured Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setData("featured_image", file);
                                    setData("featured_image_existing", ""); // Clear the existing image URL if a new one is selected
                                }
                            }}
                            className="w-full mt-1 p-2 border rounded"
                        />
                        {errors.featured_image && (
                            <p className="text-red-500 text-sm">
                                {errors.featured_image}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block font-semibold text-sm text-gray-700">
                            Gallery Images
                        </label>
                        {/* Display existing gallery images */}
                        {project.gallery_images &&
                            project.gallery_images.length > 0 && (
                                <div>
                                    <label className="block font-semibold text-sm text-gray-700 mb-1">
                                        Existing Gallery Images
                                    </label>
                                    <div className="flex flex-wrap gap-4">
                                        {project.gallery_images.map((img) => (
                                            <img
                                                key={img.id}
                                                src={img.url} // or whatever your controller/resource returns
                                                alt="Gallery"
                                                className="w-32 h-32 object-cover rounded border"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                        <div>
                            <label className="block font-semibold text-sm text-gray-700">
                                Add More Gallery Images
                            </label>
                            <input
                                type="file"
                                multiple
                                onChange={(e) =>
                                    setData(
                                        "gallery_images",
                                        Array.from(e.target.files)
                                    )
                                }
                                className="mt-1"
                            />
                            {errors.gallery_images && (
                                <div className="text-red-500">
                                    {errors.gallery_images}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Checkboxes: Suitable */}
                    <div>
                        <label className="block font-semibold text-sm text-gray-700">
                            Suitable For
                        </label>
                        <div className="flex flex-wrap gap-4 mt-2">
                            {suitableOptions.map((option) => (
                                <label
                                    key={option}
                                    className="flex items-center space-x-2"
                                >
                                    <input
                                        type="checkbox"
                                        checked={data.suitable.includes(option)}
                                        onChange={() =>
                                            toggleCheckboxArray(
                                                "suitable",
                                                option
                                            )
                                        }
                                    />
                                    <span>{option}</span>
                                </label>
                            ))}
                        </div>
                        {errors.suitable && (
                            <p className="text-red-500 text-sm">
                                {errors.suitable}
                            </p>
                        )}
                    </div>

                    {/* Checkboxes: Availability Months */}
                    <div>
                        <label className="block font-semibold text-sm text-gray-700">
                            Available Months
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                            {months.map((month) => (
                                <label
                                    key={month}
                                    className="flex items-center space-x-2"
                                >
                                    <input
                                        type="checkbox"
                                        checked={data.availability_months.includes(
                                            month
                                        )}
                                        onChange={() =>
                                            toggleCheckboxArray(
                                                "availability_months",
                                                month
                                            )
                                        }
                                    />
                                    <span>{month}</span>
                                </label>
                            ))}
                        </div>
                        {errors.availability_months && (
                            <p className="text-red-500 text-sm">
                                {errors.availability_months}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            {processing ? "Saving..." : "Update Project"}
                        </button>
                    </div>
                </form>
            </div>
        </OrganizationLayout>
    );
}
