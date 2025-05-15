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

    const [step, setStep] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        // console.log(errors);
        // alert(errors);

        Object.keys(data).forEach((key) => {
            if (
                key === "gallery_images" &&
                Array.isArray(data.gallery_images)
            ) {
                data.gallery_images.forEach((file, index) => {
                    formData.append(`gallery_images[${index}]`, file);
                });
            } else if (
                key === "featured_image" &&
                data.featured_image instanceof File
            ) {
                formData.append("featured_image", data.featured_image);
            } else if (Array.isArray(data[key])) {
                data[key].forEach((value, index) => {
                    formData.append(`${key}[${index}]`, value);
                });
            } else {
                formData.append(key, data[key]);
            }
        });

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
    const inputClass =
        "w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300";
    const labelClass = "block text-sm font-medium text-gray-700";

    return (
        <OrganizationLayout>
            <Head title="Create Project" />
            <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow">
                <h1 className="text-2xl font-bold mb-4">Create New Project</h1>

                <form
                    onSubmit={handleSubmit}
                    encType="multipart/form-data"
                    className="space-y-6"
                >
                    {/* Step 1: Basic Information */}
                    {step === 1 && (
                        <>
                            <div>
                                <label className={labelClass}>Title</label>
                                {/* {isEditing ? ( */}
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => {
                                        const titleValue = e.target.value;
                                        setData("title", titleValue);
                                        setData(
                                            "slug",
                                            titleValue
                                                .toLowerCase()
                                                .trim()
                                                .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
                                                .replace(/\s+/g, "-") // collapse whitespace and replace by -
                                                .replace(/-+/g, "-")
                                        );
                                    }}
                                    className={inputClass}
                                />

                                {errors.title && (
                                    <div className="text-red-500">
                                        {errors.title}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>Slug</label>
                                <input
                                    type="text"
                                    name="slug"
                                    readOnly
                                    value={data.slug}
                                    onChange={(e) =>
                                        setData("slug", e.target.value)
                                    }
                                    className={inputClass}
                                />
                                {errors.slug && (
                                    <div className="text-red-500">
                                        {errors.slug}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Featured Image
                                </label>
                                <input
                                    type="file"
                                    onChange={(e) =>
                                        setData(
                                            "featured_image",
                                            e.target.files[0]
                                        )
                                    }
                                    className={inputClass}
                                />
                                {errors.featured_image && (
                                    <div className="text-red-500">
                                        {errors.featured_image}
                                    </div>
                                )}
                            </div>

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
                                <label className={labelClass}>
                                    Subcategory
                                </label>
                                <select
                                    value={data.subcategory_id}
                                    onChange={(e) =>
                                        setData(
                                            "subcategory_id",
                                            e.target.value
                                        )
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
                        </>
                    )}

                    {/* Step 2: Category & Subcategory, Address, Descriptions */}
                    {step === 2 && (
                        <>
                            <div>
                                <label className={labelClass}>Address</label>
                                <input
                                    type="text"
                                    value={data.address}
                                    onChange={(e) =>
                                        setData("address", e.target.value)
                                    }
                                    className={inputClass}
                                />
                                {errors.address && (
                                    <div className="text-red-500">
                                        {errors.address}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Short Description
                                </label>
                                <textarea
                                    value={data.short_description}
                                    onChange={(e) =>
                                        setData(
                                            "short_description",
                                            e.target.value
                                        )
                                    }
                                    maxLength={500}
                                    className={inputClass}
                                />
                                {errors.short_description && (
                                    <div className="text-red-500">
                                        {errors.short_description}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Detailed Description
                                </label>
                                <textarea
                                    value={data.detailed_description}
                                    onChange={(e) =>
                                        setData(
                                            "detailed_description",
                                            e.target.value
                                        )
                                    }
                                    className={inputClass}
                                />
                                {errors.detailed_description && (
                                    <div className="text-red-500">
                                        {errors.detailed_description}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <div>
                                <label className={labelClass}>Duration</label>
                                <input
                                    type="text"
                                    value={data.duration}
                                    onChange={(e) =>
                                        setData("duration", e.target.value)
                                    }
                                    className={inputClass}
                                />
                                {errors.duration && (
                                    <div className="text-red-500">
                                        {errors.duration}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Duration Type
                                </label>
                                <select
                                    value={data.duration_type}
                                    onChange={(e) =>
                                        setData("duration_type", e.target.value)
                                    }
                                    className={inputClass}
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
                                <label className={labelClass}>
                                    Daily Routine
                                </label>
                                <textarea
                                    value={data.daily_routine}
                                    onChange={(e) =>
                                        setData("daily_routine", e.target.value)
                                    }
                                    className={inputClass}
                                />
                                {errors.daily_routine && (
                                    <div className="text-red-500">
                                        {errors.daily_routine}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Step 4: Suitable For, Availability Months, Gallery */}
                    {step === 4 && (
                        <>
                            <div>
                                <label className={labelClass}>Fees</label>
                                <input
                                    type="number"
                                    value={data.fees}
                                    onChange={(e) =>
                                        setData("fees", e.target.value)
                                    }
                                    className={inputClass}
                                />
                                {errors.fees && (
                                    <div className="text-red-500">
                                        {errors.fees}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>Currency</label>
                                <input
                                    type="text"
                                    value={data.currency}
                                    onChange={(e) =>
                                        setData("currency", e.target.value)
                                    }
                                    className={inputClass}
                                />
                                {errors.currency && (
                                    <div className="text-red-500">
                                        {errors.currency}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>Activities</label>
                                <textarea
                                    value={data.activities}
                                    onChange={(e) =>
                                        setData("activities", e.target.value)
                                    }
                                    className={inputClass}
                                />
                                {errors.activities && (
                                    <div className="text-red-500">
                                        {errors.activities}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Suitable For
                                </label>
                                {suitableOptions.map((option) => (
                                    <label key={option} className="block">
                                        <input
                                            type="checkbox"
                                            value={option}
                                            checked={data.suitable.includes(
                                                option
                                            )}
                                            onChange={(e) =>
                                                setData(
                                                    "suitable",
                                                    e.target.checked
                                                        ? [
                                                              ...data.suitable,
                                                              option,
                                                          ]
                                                        : data.suitable.filter(
                                                              (s) =>
                                                                  s !== option
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
                                <label className={labelClass}>
                                    Availability Months
                                </label>
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
                        </>
                    )}

                    {step === 5 && (
                        <>
                            <div>
                                <label className={labelClass}>
                                    Gallery Images
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
                                />
                                {errors.gallery_images && (
                                    <div className="text-red-500">
                                        {errors.gallery_images}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>Start Date</label>
                                <input
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) =>
                                        setData("start_date", e.target.value)
                                    }
                                    className={inputClass}
                                />
                                {errors.start_date && (
                                    <div className="text-red-500">
                                        {errors.start_date}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    <div className="flex items-center justify-between">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={() => setStep(step - 1)}
                                className="bg-gray-500 text-white py-2 px-4 rounded"
                            >
                                Back
                            </button>
                        )}
                        {step < 5 && (
                            <button
                                type="button"
                                onClick={() => setStep(step + 1)}
                                className="bg-blue-600 text-white py-2 px-4 rounded"
                            >
                                Next
                            </button>
                        )}
                        {step === 5 && (
                            <button
                                type="submit"
                                className="bg-green-600 text-white py-2 px-4 rounded"
                                disabled={processing}
                            >
                                {processing ? "Submitting..." : "Submit"}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </OrganizationLayout>
    );
}
