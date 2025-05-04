import React, { useState } from "react";
import { useForm, Head } from "@inertiajs/react";
import OrganizationLayout from "@/Layouts/OrganizationLayout";

export default function Create({ categories }) {
    const { data, setData, post, errors, processing } = useForm({
        title: "",
        slug: "",
        featured_image: null,
        category_id: "",
        subcategory_id: "",
        address: "",
        short_description: "",
        detailed_description: "",
        duration: "",
        duration_type: "Days",
        daily_routine: "",
        fees: "",
        currency: "",
        activities: "",
        suitable: [],
        availability_months: [],
        gallery_images: [],
        start_date: "",
        status: "Pending",
    });

    const [selectedCategory, setSelectedCategory] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        Object.keys(data).forEach((key) => {
            if (
                key === "gallery_images" &&
                Array.isArray(data.gallery_images)
            ) {
                data.gallery_images.forEach((file, index) => {
                    formData.append(`gallery_images[${index}]`, file);
                });
            } else if (Array.isArray(data[key])) {
                data[key].forEach((value, index) => {
                    formData.append(`${key}[${index}]`, value);
                });
            } else {
                formData.append(key, data[key]);
            }
        });

        // For gallery_images: append files separately
        if (data.gallery_images.length) {
            data.gallery_images.forEach((file, index) => {
                formData.append(`gallery_images[${index}]`, file);
            });
        }

        post(route("organization.projects.store"), {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                console.log("Project created successfully");
            },
        });
    };

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

    const selected = categories.find(
        (cat) => String(cat.id) === String(selectedCategory)
    );

    const suitableOptions = ["Adults", "Students", "Families", "Retirees"];

    return (
        <OrganizationLayout>
            <Head title="Create Project" />
            <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded">
                <h1 className="text-2xl font-bold mb-4">Create New Project</h1>

                <form
                    onSubmit={handleSubmit}
                    encType="multipart/form-data"
                    className="space-y-4"
                >
                    <div>
                        <label>Title</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            className="input"
                        />
                        {errors.title && (
                            <div className="text-red-500">{errors.title}</div>
                        )}
                    </div>

                    <div>
                        <label>Slug</label>
                        <input
                            type="text"
                            value={data.slug}
                            onChange={(e) => setData("slug", e.target.value)}
                            className="input"
                        />
                        {errors.slug && (
                            <div className="text-red-500">{errors.slug}</div>
                        )}
                    </div>

                    <div>
                        <label>Featured Image</label>
                        <input
                            type="file"
                            onChange={(e) =>
                                setData("featured_image", e.target.files[0])
                            }
                        />
                        {errors.featured_image && (
                            <div className="text-red-500">
                                {errors.featured_image}
                            </div>
                        )}
                    </div>

                    <div>
                        <label>Category</label>
                        <select
                            value={data.category_id}
                            onChange={(e) => {
                                setData("category_id", e.target.value);
                                setSelectedCategory(e.target.value);
                            }}
                            className="input"
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
                        <label>Subcategory</label>
                        <select
                            value={data.subcategory_id}
                            onChange={(e) =>
                                setData("subcategory_id", e.target.value)
                            }
                            className="input"
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

                    <div>
                        <label>Address</label>
                        <input
                            type="text"
                            value={data.address}
                            onChange={(e) => setData("address", e.target.value)}
                            className="input"
                        />
                        {errors.address && (
                            <div className="text-red-500">{errors.address}</div>
                        )}
                    </div>

                    <div>
                        <label>Short Description</label>
                        <textarea
                            value={data.short_description}
                            onChange={(e) =>
                                setData("short_description", e.target.value)
                            }
                            maxLength={500}
                            className="input"
                        />
                        {errors.short_description && (
                            <div className="text-red-500">
                                {errors.short_description}
                            </div>
                        )}
                    </div>

                    <div>
                        <label>Detailed Description</label>
                        <textarea
                            value={data.detailed_description}
                            onChange={(e) =>
                                setData("detailed_description", e.target.value)
                            }
                            className="input"
                        />
                        {errors.detailed_description && (
                            <div className="text-red-500">
                                {errors.detailed_description}
                            </div>
                        )}
                    </div>

                    <div>
                        <label>Duration</label>
                        <input
                            type="text"
                            value={data.duration}
                            onChange={(e) =>
                                setData("duration", e.target.value)
                            }
                            className="input"
                        />
                        {errors.duration && (
                            <div className="text-red-500">
                                {errors.duration}
                            </div>
                        )}
                    </div>

                    <div>
                        <label>Duration Type</label>
                        <select
                            value={data.duration_type}
                            onChange={(e) =>
                                setData("duration_type", e.target.value)
                            }
                            className="input"
                        >
                            <option value="Days">Days</option>
                            <option value="Weeks">Weeks</option>
                            <option value="Months">Months</option>
                            <option value="Years">Years</option>
                        </select>
                        {errors.duration_type && (
                            <div className="text-red-500">
                                {errors.duration_type}
                            </div>
                        )}
                    </div>

                    <div>
                        <label>Daily Routine</label>
                        <textarea
                            value={data.daily_routine}
                            onChange={(e) =>
                                setData("daily_routine", e.target.value)
                            }
                            className="input"
                        />
                        {errors.daily_routine && (
                            <div className="text-red-500">
                                {errors.daily_routine}
                            </div>
                        )}
                    </div>

                    <div>
                        <label>Fees</label>
                        <input
                            type="number"
                            value={data.fees}
                            onChange={(e) => setData("fees", e.target.value)}
                            className="input"
                        />
                        {errors.fees && (
                            <div className="text-red-500">{errors.fees}</div>
                        )}
                    </div>

                    <div>
                        <label>Currency</label>
                        <input
                            type="text"
                            value={data.currency}
                            onChange={(e) =>
                                setData("currency", e.target.value)
                            }
                            className="input"
                        />
                        {errors.currency && (
                            <div className="text-red-500">
                                {errors.currency}
                            </div>
                        )}
                    </div>

                    <div>
                        <label>Activities</label>
                        <textarea
                            value={data.activities}
                            onChange={(e) =>
                                setData("activities", e.target.value)
                            }
                            className="input"
                        />
                        {errors.activities && (
                            <div className="text-red-500">
                                {errors.activities}
                            </div>
                        )}
                    </div>

                    <div>
                        <label>Suitable For</label>
                        {suitableOptions.map((option) => (
                            <label key={option} className="block">
                                <input
                                    type="checkbox"
                                    value={option}
                                    checked={data.suitable.includes(option)}
                                    onChange={(e) =>
                                        setData(
                                            "suitable",
                                            e.target.checked
                                                ? [...data.suitable, option]
                                                : data.suitable.filter(
                                                      (s) => s !== option
                                                  )
                                        )
                                    }
                                />{" "}
                                {option}
                            </label>
                        ))}
                        {errors.suitable && (
                            <div className="text-red-500">
                                {errors.suitable}
                            </div>
                        )}
                    </div>

                    <div>
                        <label>Availability Months</label>
                        {months.map((month) => (
                            <label key={month} className="block">
                                <input
                                    type="checkbox"
                                    value={month}
                                    checked={data.availability_months.includes(
                                        month
                                    )}
                                    onChange={(e) =>
                                        setData(
                                            "availability_months",
                                            e.target.checked
                                                ? [
                                                      ...data.availability_months,
                                                      month,
                                                  ]
                                                : data.availability_months.filter(
                                                      (m) => m !== month
                                                  )
                                        )
                                    }
                                />{" "}
                                {month}
                            </label>
                        ))}
                        {errors.availability_months && (
                            <div className="text-red-500">
                                {errors.availability_months}
                            </div>
                        )}
                    </div>

                    <div>
                        <label>Gallery Images</label>
                        <input
                            type="file"
                            multiple
                            onChange={(e) =>
                                setData(
                                    "gallery_images",
                                    Array.from(e.target.files)
                                )
                            }
                        />
                        {errors.gallery_images && (
                            <div className="text-red-500">
                                {errors.gallery_images}
                            </div>
                        )}
                    </div>

                    <div>
                        <label>Start Date</label>
                        <input
                            type="date"
                            value={data.start_date}
                            onChange={(e) =>
                                setData("start_date", e.target.value)
                            }
                            className="input"
                        />
                        {errors.start_date && (
                            <div className="text-red-500">
                                {errors.start_date}
                            </div>
                        )}
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            disabled={processing}
                        >
                            {processing ? "Creating..." : "Create Project"}
                        </button>
                    </div>
                </form>
            </div>
        </OrganizationLayout>
    );
}
