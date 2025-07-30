import React, { useState, useEffect } from "react";
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
        min_duration: "",
        max_duration: "",
        duration_type: "Days",
        daily_routine: "",
        type_of_project: "Free",
        fees: "",
        currency: "USD",
        category_of_charge: "Day",
        includes: "",
        excludes: "",
        activities: "",
        suitable: [],
        availability_months: [],
        gallery_images: [],
        start_date: "",
        status: "Pending",
    });

    // Define allowed image extensions
    const ALLOWED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp"];
    const MAX_FILE_SIZE_MB = 5; // 5MB maximum file size

    const [selectedCategory, setSelectedCategory] = useState("");
    const [step, setStep] = useState(1);
    const [charCount, setCharCount] = useState(0);
    const [previewImage, setPreviewImage] = useState(null);
    const [galleryPreviews, setGalleryPreviews] = useState([]);

    // Initialize previews from existing data if editing
    useEffect(() => {
        if (data.featured_image && typeof data.featured_image === "string") {
            setPreviewImage(data.featured_image);
        }
        // Initialize gallery previews if editing existing project with images
        if (
            data.gallery_images &&
            Array.isArray(data.gallery_images) &&
            data.gallery_images.length > 0
        ) {
            const existingPreviews = data.gallery_images.map((img) => ({
                url: img instanceof File ? URL.createObjectURL(img) : img,
                file: img instanceof File ? img : null,
            }));
            setGalleryPreviews(existingPreviews);
        }
    }, []);

    const handleShortDescriptionChange = (e) => {
        const value = e.target.value;
        const trimmedValue = value.trim();
        const visibleCharCount = trimmedValue.length;

        if (visibleCharCount <= 499) {
            setData("short_description", trimmedValue);
            setCharCount(visibleCharCount);
        } else {
            setData("short_description", trimmedValue.substring(0, 499));
            setCharCount(500);
        }
    };

    // Function to validate image file
    const validateImageFile = (file) => {
        const extension = file.name.split(".").pop().toLowerCase();
        const isValidExtension = ALLOWED_IMAGE_EXTENSIONS.includes(extension);
        const isValidSize = file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;

        return {
            isValid: isValidExtension && isValidSize,
            error: !isValidExtension
                ? `Invalid file type. Allowed types: ${ALLOWED_IMAGE_EXTENSIONS.join(
                      ", "
                  )}`
                : !isValidSize
                ? `File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB`
                : null,
        };
    };

    const handleFeaturedImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validation = validateImageFile(file);
        if (!validation.isValid) {
            alert(validation.error);
            e.target.value = ""; // Clear the file input
            return;
        }

        setData("featured_image", file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const removeFeaturedImage = () => {
        setData("featured_image", null);
        setPreviewImage(null);
    };

    const handleGalleryImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Validate each file
        const validFiles = [];
        const invalidFiles = [];

        files.forEach((file) => {
            const validation = validateImageFile(file);
            if (validation.isValid) {
                validFiles.push(file);
            } else {
                invalidFiles.push({ name: file.name, error: validation.error });
            }
        });

        // Show errors for invalid files
        if (invalidFiles.length > 0) {
            const errorMessages = invalidFiles
                .map((f) => `${f.name}: ${f.error}`)
                .join("\n");
            alert(`Some files were rejected:\n${errorMessages}`);
        }

        // Process valid files
        if (validFiles.length > 0) {
            const newPreviews = validFiles.map((file) => ({
                url: URL.createObjectURL(file),
                file: file,
            }));
            setGalleryPreviews((prev) => [...prev, ...newPreviews]);
            setData("gallery_images", [...data.gallery_images, ...validFiles]);
        }

        // Reset input to allow selecting the same files again if some were invalid
        if (invalidFiles.length > 0) {
            e.target.value = "";
        }
    };
    const removeGalleryImage = (index) => {
        const updatedPreviews = [...galleryPreviews];
        const updatedFiles = [...data.gallery_images];

        // Clean up the object URL if it's a new file
        if (updatedPreviews[index].file) {
            URL.revokeObjectURL(updatedPreviews[index].url);
        }

        updatedPreviews.splice(index, 1);
        updatedFiles.splice(index, 1);

        setGalleryPreviews(updatedPreviews);
        setData("gallery_images", updatedFiles);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        Object.keys(data).forEach((key) => {
            if (
                key === "gallery_images" &&
                Array.isArray(data.gallery_images)
            ) {
                data.gallery_images.forEach((file, index) => {
                    if (file instanceof File) {
                        formData.append(`gallery_images[${index}]`, file);
                    }
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
            onError: (errors) => {
                console.error("Error creating project:", errors);
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

    const [stepsWithErrors, setStepsWithErrors] = useState([]);

    useEffect(() => {
        const errorSteps = [];
        if (
            errors.title ||
            errors.slug ||
            errors.featured_image ||
            errors.category_id ||
            errors.subcategory_id
        ) {
            errorSteps.push(1);
        }
        if (
            errors.address ||
            errors.short_description ||
            errors.detailed_description
        ) {
            errorSteps.push(2);
        }
        if (
            errors.min_duration ||
            errors.max_duration ||
            errors.duration_type ||
            errors.daily_routine
        ) {
            errorSteps.push(3);
        }
        if (
            errors.type_of_project ||
            errors.fees ||
            errors.includes ||
            errors.excludes ||
            errors.category_of_charge ||
            errors.activities ||
            errors.suitable ||
            errors.availability_months
        ) {
            errorSteps.push(4);
        }
        if (errors.gallery_images || errors.start_date) {
            errorSteps.push(5);
        }
        setStepsWithErrors(errorSteps);
    }, [errors]);

    const stepNames = [
        "Basic Information",
        "Project Details",
        "Duration & Routine",
        "Pricing & Availability",
        "Media & Dates",
    ];

    return (
        <OrganizationLayout>
            <Head title="Create Project" />
            <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow">
                <h1 className="text-2xl font-bold mb-4">Create New Project</h1>

                {/* Step Roadmap */}
                <div className="mb-8">
                    <div className="flex justify-between relative">
                        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10">
                            <div
                                className="h-1 bg-blue-600 transition-all duration-300"
                                style={{ width: `${((step - 1) / 4) * 100}%` }}
                            ></div>
                        </div>

                        {stepNames.map((name, index) => {
                            const stepNumber = index + 1;
                            const isActive = step === stepNumber;
                            const hasError =
                                stepsWithErrors.includes(stepNumber);

                            return (
                                <div
                                    key={stepNumber}
                                    className="flex flex-col items-center"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setStep(stepNumber)}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                                            ${
                                                isActive
                                                    ? "bg-blue-600 text-white"
                                                    : hasError
                                                    ? "bg-red-500 text-white"
                                                    : "bg-gray-200 text-gray-600"
                                            }
                                            ${
                                                step > stepNumber
                                                    ? "bg-green-500 text-white"
                                                    : ""
                                            }
                                            transition-colors duration-200`}
                                    >
                                        {stepNumber}
                                    </button>
                                    <span
                                        className={`text-xs mt-2 ${
                                            isActive
                                                ? "font-bold text-blue-600"
                                                : ""
                                        }`}
                                    >
                                        {name}
                                    </span>
                                    {hasError && !isActive && (
                                        <span className="text-xs text-red-500 mt-1">
                                            !
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {stepsWithErrors.length > 0 && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-md shadow-sm">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-5 w-5 text-red-400"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">
                                    Please fix errors in step(s):{" "}
                                    {stepsWithErrors.join(", ")}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

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
                                <input
                                    type="text"
                                    value={data.title || ""}
                                    onChange={(e) => {
                                        const titleValue = e.target.value;
                                        setData("title", titleValue);
                                        setData(
                                            "slug",
                                            titleValue
                                                .toLowerCase()
                                                .trim()
                                                .replace(/[^a-z0-9 -]/g, "")
                                                .replace(/\s+/g, "-")
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
                                    value={data.slug || ""}
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
                                    onChange={handleFeaturedImageChange}
                                    accept=".jpg,.jpeg,.png,.gif,.webp"
                                    className={inputClass}
                                />
                                {errors.featured_image && (
                                    <div className="text-red-500">
                                        {errors.featured_image}
                                    </div>
                                )}
                            </div>

                            {/* Featured Image Preview - shown on all steps */}
                            {(previewImage || data.featured_image) && (
                                <div className="mt-4">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                                        Featured Image
                                    </h3>
                                    <div className="relative inline-block">
                                        <img
                                            src={
                                                previewImage ||
                                                (data.featured_image instanceof
                                                File
                                                    ? URL.createObjectURL(
                                                          data.featured_image
                                                      )
                                                    : data.featured_image)
                                            }
                                            alt="Featured preview"
                                            className="h-32 object-cover rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeFeaturedImage}
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                            title="Remove image"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className={labelClass}>Category</label>
                                <select
                                    value={data.category_id || ""}
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
                                    value={data.subcategory_id || ""}
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

                    {/* Step 2: Project Details */}
                    {step === 2 && (
                        <>
                            <div>
                                <label className={labelClass}>Address</label>
                                <input
                                    type="text"
                                    value={data.address || ""}
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
                                    value={data.short_description || ""}
                                    onChange={handleShortDescriptionChange}
                                    maxLength={500}
                                    className={inputClass}
                                />
                                <div
                                    className={`text-sm mt-1 ${
                                        charCount === 499
                                            ? "text-red-500"
                                            : "text-gray-500"
                                    }`}
                                >
                                    {charCount}/500 characters{" "}
                                    {charCount === 499 && " - Maximum reached"}
                                </div>
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
                                    value={data.detailed_description || ""}
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
                                <label className={labelClass}>
                                    Minimum Stay
                                </label>
                                <input
                                    type="number"
                                    value={data.min_duration || ""}
                                    onChange={(e) =>
                                        setData("min_duration", e.target.value)
                                    }
                                    className={inputClass}
                                />
                                {errors.min_duration && (
                                    <div className="text-red-500">
                                        {errors.min_duration}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Maximum Stay
                                </label>
                                <input
                                    type="number"
                                    value={data.max_duration || ""}
                                    onChange={(e) =>
                                        setData("max_duration", e.target.value)
                                    }
                                    className={inputClass}
                                />
                                {errors.max_duration && (
                                    <div className="text-red-500">
                                        {errors.max_duration}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Duration Type
                                </label>
                                <select
                                    value={data.duration_type || "Days"}
                                    onChange={(e) =>
                                        setData("duration_type", e.target.value)
                                    }
                                    className={inputClass}
                                >
                                    <option value="Days">Days</option>
                                    <option value="Weeks">Weeks</option>
                                    <option value="Months">Months</option>
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
                                    value={data.daily_routine || ""}
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

                    {/* Step 4: Pricing & Availability */}
                    {step === 4 && (
                        <>
                            <div>
                                <label className={labelClass}>
                                    Is this a paid project?
                                </label>
                                <select
                                    value={data.type_of_project || "Free"}
                                    onChange={(e) => {
                                        setData(
                                            "type_of_project",
                                            e.target.value
                                        );
                                        if (e.target.value === "Free") {
                                            setData("fees", "");
                                            setData("includes", "");
                                            setData("excludes", "");
                                            setData("category_of_charge", "");
                                        }
                                    }}
                                    className={inputClass}
                                >
                                    <option value="Free">Free</option>
                                    <option value="Paid">Paid</option>
                                </select>
                                {errors.type_of_project && (
                                    <div className="text-red-500">
                                        {errors.type_of_project}
                                    </div>
                                )}
                            </div>

                            {data.type_of_project === "Paid" && (
                                <>
                                    <div>
                                        <label className={labelClass}>
                                            Fees
                                        </label>
                                        <input
                                            type="number"
                                            value={data.fees || ""}
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
                                        <label className={labelClass}>
                                            Category of Charge
                                        </label>
                                        <select
                                            value={
                                                data.category_of_charge || "Day"
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "category_of_charge",
                                                    e.target.value
                                                )
                                            }
                                            className={inputClass}
                                        >
                                            <option value="Day">Per Day</option>
                                            <option value="Week">
                                                Per Week
                                            </option>
                                            <option value="Month">
                                                Per Month
                                            </option>
                                        </select>
                                        {errors.category_of_charge && (
                                            <div className="text-red-500">
                                                {errors.category_of_charge}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Fees Includes
                                        </label>
                                        <textarea
                                            value={data.includes || ""}
                                            onChange={(e) =>
                                                setData(
                                                    "includes",
                                                    e.target.value
                                                )
                                            }
                                            className={inputClass}
                                        />
                                        {errors.includes && (
                                            <div className="text-red-500">
                                                {errors.includes}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className={labelClass}>
                                            Fees Excludes
                                        </label>
                                        <textarea
                                            value={data.excludes || ""}
                                            onChange={(e) =>
                                                setData(
                                                    "excludes",
                                                    e.target.value
                                                )
                                            }
                                            className={inputClass}
                                        />
                                        {errors.excludes && (
                                            <div className="text-red-500">
                                                {errors.excludes}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            <div>
                                <label className={labelClass}>Activities</label>
                                <textarea
                                    value={data.activities || ""}
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
                                    onChange={handleGalleryImageChange}
                                    accept=".jpg,.jpeg,.png,.gif,.webp"
                                    className={inputClass}
                                />
                                {errors.gallery_images && (
                                    <div className="text-red-500">
                                        {errors.gallery_images}
                                    </div>
                                )}
                            </div>
                            {/* Gallery Images Preview - shown on all steps */}
                            {galleryPreviews.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                                        Gallery Images
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {galleryPreviews.map(
                                            (preview, index) => (
                                                <div
                                                    key={index}
                                                    className="relative"
                                                >
                                                    <img
                                                        src={preview.url}
                                                        alt={`Gallery preview ${index}`}
                                                        className="w-full h-32 object-cover rounded"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeGalleryImage(
                                                                index
                                                            )
                                                        }
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                        title="Remove image"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M6 18L18 6M6 6l12 12"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className={labelClass}>Start Date</label>
                                <input
                                    type="date"
                                    value={data.start_date || ""}
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
