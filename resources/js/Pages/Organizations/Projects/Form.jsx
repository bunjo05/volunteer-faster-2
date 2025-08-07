import React, { useState, useEffect, useRef } from "react";
import { useForm, Head } from "@inertiajs/react";
import OrganizationLayout from "@/Layouts/OrganizationLayout";
import LocationDropdown from "@/Components/LocationDropdown";

// Reusable form components
const FormInput = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    error,
    className = "",
    ...props
}) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <input
            type={type}
            name={name}
            value={value || ""}
            onChange={onChange}
            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 ${className}`}
            {...props}
        />
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
);

const FormTextarea = ({
    label,
    name,
    value,
    onChange,
    error,
    rows = 3,
    ...props
}) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <textarea
            name={name}
            value={value || ""}
            onChange={onChange}
            rows={rows}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            {...props}
        />
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
);

const FormSelect = ({
    label,
    name,
    value,
    onChange,
    options,
    error,
    ...props
}) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <select
            name={name}
            value={value || ""}
            onChange={onChange}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            {...props}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
);

const FormCheckbox = ({ label, name, checked, onChange, error, ...props }) => (
    <div className="mb-4 flex items-center">
        <input
            type="checkbox"
            name={name}
            checked={checked || false}
            onChange={onChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            {...props}
        />
        <label className="ml-2 block text-sm text-gray-700">{label}</label>
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
);

const FormFileInput = ({
    label,
    name,
    onChange,
    error,
    accept,
    multiple = false,
}) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <input
            type="file"
            name={name}
            onChange={onChange}
            accept={accept}
            multiple={multiple}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
);

const ImagePreview = ({ src, onRemove, alt = "Preview" }) => (
    <div className="relative inline-block mt-2">
        <img src={src} alt={alt} className="h-32 object-cover rounded" />
        <button
            type="button"
            onClick={onRemove}
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
);

const StepIndicator = ({ steps, currentStep, errorSteps, onStepClick }) => {
    return (
        <div className="mb-8">
            <div className="flex justify-between relative">
                <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10">
                    <div
                        className="h-1 bg-blue-600 transition-all duration-300"
                        style={{
                            width: `${
                                ((currentStep - 1) / (steps.length - 1)) * 100
                            }%`,
                        }}
                    ></div>
                </div>

                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isActive = currentStep === stepNumber;
                    const hasError = errorSteps.includes(stepNumber);

                    return (
                        <div
                            key={stepNumber}
                            className="flex flex-col items-center"
                        >
                            <button
                                type="button"
                                onClick={() => onStepClick(stepNumber)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${
                      isActive
                          ? "bg-blue-600 text-white"
                          : hasError
                          ? "bg-red-500 text-white"
                          : "bg-gray-200 text-gray-600"
                  }
                  ${currentStep > stepNumber ? "bg-green-500 text-white" : ""}
                  transition-colors duration-200`}
                            >
                                {stepNumber}
                            </button>
                            <span
                                className={`text-xs mt-2 ${
                                    isActive ? "font-bold text-blue-600" : ""
                                }`}
                            >
                                {step.label}
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
    );
};

export default function ProjectForm({
    categories,
    project = null,
    isEdit = false,
}) {
    const featuredImageInputRef = useRef(null);
    const { data, setData, post, put, errors, processing } = useForm({
        title: project?.title || "",
        slug: project?.slug || "",
        featured_image:
            isEdit && project?.featured_image ? project.featured_image : null,
        category_id: project?.category_id || "",
        subcategory_id: project?.subcategory_id || "",
        country: project?.country || "",
        city: project?.city || "",
        state: project?.state || "",
        short_description: project?.short_description || "",
        detailed_description: project?.detailed_description || "",
        min_duration: project?.min_duration || "",
        max_duration: project?.max_duration || "",
        duration_type: project?.duration_type || "Days",
        daily_routine: project?.daily_routine || "",
        type_of_project: project?.type_of_project || "Free",
        fees: project?.fees || "",
        currency: project?.currency || "USD",
        category_of_charge: project?.category_of_charge || "Day",
        includes: project?.includes || "",
        excludes: project?.excludes || "",
        activities: project?.activities || "",
        suitable: project?.suitable || [],
        availability_months: project?.availability_months || [],

        gallery_images: [],
        existing_gallery_images: isEdit
            ? project?.gallery_images?.map((img) => img.id)
            : [],

        start_date: project?.start_date || "",
        status: project?.status || "Pending",
        point_exchange: project?.point_exchange || false,
    });

    const ALLOWED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp"];
    const MAX_FILE_SIZE_MB = 5;

    const [selectedCategory, setSelectedCategory] = useState("");
    const [step, setStep] = useState(1);
    const [charCount, setCharCount] = useState(0);
    const [previewImage, setPreviewImage] = useState(
        project?.featured_image ? `/storage/${project.featured_image}` : null
    );
    const [galleryPreviews, setGalleryPreviews] = useState(
        project?.gallery_images?.map((img) => ({
            url: `/storage/${img.image_path}`,
            file: null,
            id: img.id,
        })) || []
    );
    const [stepsWithErrors, setStepsWithErrors] = useState([]);

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

    const steps = [
        {
            label: "Basic Information",
            fields: [
                "title",
                "slug",
                "featured_image",
                "category_id",
                "subcategory_id",
            ],
        },
        {
            label: "Project Details",
            fields: [
                "country",
                "city",
                "state",
                "short_description",
                "detailed_description",
            ],
        },
        {
            label: "Duration & Routine",
            fields: [
                "min_duration",
                "max_duration",
                "duration_type",
                "daily_routine",
            ],
        },
        {
            label: "Pricing & Availability",
            fields: [
                "type_of_project",
                "fees",
                "includes",
                "excludes",
                "category_of_charge",
                "activities",
                "suitable",
                "availability_months",
                "point_exchange",
            ],
        },
        { label: "Media & Dates", fields: ["gallery_images", "start_date"] },
    ];

    // Initialize form with project data if editing
    useEffect(() => {
        if (isEdit && project) {
            if (project.featured_image) {
                setData("featured_image", project.featured_image);
                setPreviewImage(`/storage/${project.featured_image}`);
            }
            if (project.gallery_images?.length > 0) {
                const existingPreviews = project.gallery_images.map((img) => ({
                    url: `/storage/${img.image_path}`,
                    file: null,
                    id: img.id,
                }));
                setGalleryPreviews(existingPreviews);
            }
            if (project.category_id) {
                setSelectedCategory(project.category_id);
            }
        }
    }, [isEdit, project]);

    useEffect(() => {
        const errorSteps = steps.reduce((acc, curr, index) => {
            if (curr.fields.some((field) => errors[field])) {
                acc.push(index + 1);
            }
            return acc;
        }, []);

        // Ensure unique step numbers
        setStepsWithErrors([...new Set(errorSteps)]);
    }, [errors]);

    const handleShortDescriptionChange = (e) => {
        const value = e.target.value.trim();
        const visibleCharCount = value.length;

        if (visibleCharCount <= 499) {
            setData("short_description", value);
            setCharCount(visibleCharCount);
        } else {
            setData("short_description", value.substring(0, 499));
            setCharCount(500);
        }
    };

    const removeFeaturedImage = () => {
        setData("featured_image", null);
        setPreviewImage(null);
        if (featuredImageInputRef.current) {
            featuredImageInputRef.current.value = "";
        }

        // If editing and there was a previous image, mark it for deletion
        if (isEdit && project?.featured_image) {
            setData("remove_featured_image", true);
        }
    };

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
            e.target.value = "";
            return;
        }

        setData("featured_image", file);
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImage(reader.result);
        reader.readAsDataURL(file);
    };

    const handleGalleryImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const { validFiles, invalidFiles } = files.reduce(
            (acc, file) => {
                const validation = validateImageFile(file);
                if (validation.isValid) {
                    acc.validFiles.push(file);
                } else {
                    acc.invalidFiles.push({
                        name: file.name,
                        error: validation.error,
                    });
                }
                return acc;
            },
            { validFiles: [], invalidFiles: [] }
        );

        if (invalidFiles.length) {
            alert(
                `Some files were rejected:\n${invalidFiles
                    .map((f) => `${f.name}: ${f.error}`)
                    .join("\n")}`
            );
        }

        if (validFiles.length) {
            const newPreviews = validFiles.map((file) => ({
                url: URL.createObjectURL(file),
                file,
                isNew: true,
            }));

            setGalleryPreviews((prev) => [...prev, ...newPreviews]);
            setData("gallery_images", [...data.gallery_images, ...validFiles]);
        }

        e.target.value = "";
    };

    const removeGalleryImage = (index) => {
        const updatedPreviews = [...galleryPreviews];
        const removedImage = updatedPreviews[index];

        if (removedImage.id) {
            // Existing image - remove from existing_gallery_images array
            setData(
                "existing_gallery_images",
                data.existing_gallery_images.filter(
                    (id) => id !== removedImage.id
                )
            );
        } else {
            // New image - remove from gallery_images array
            URL.revokeObjectURL(removedImage.url);
            setData(
                "gallery_images",
                data.gallery_images.filter(
                    (_, i) => i !== index - data.existing_gallery_images.length
                )
            );
        }

        updatedPreviews.splice(index, 1);
        setGalleryPreviews(updatedPreviews);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        // Include all required fields
        formData.append("title", data.title);

        // Only include slug if it has changed or we're creating a new project
        if (!isEdit || data.slug !== project.slug) {
            formData.append("slug", data.slug);
        }

        formData.append("category_id", data.category_id);
        formData.append("subcategory_id", data.subcategory_id);
        formData.append("country", data.country);
        formData.append("state", data.state);
        formData.append("city", data.city);
        formData.append("short_description", data.short_description);
        formData.append("detailed_description", data.detailed_description);
        formData.append("min_duration", data.min_duration);
        formData.append("max_duration", data.max_duration);
        formData.append("duration_type", data.duration_type);
        formData.append("daily_routine", data.daily_routine);
        formData.append("type_of_project", data.type_of_project);
        formData.append("activities", data.activities);

        // Handle array fields
        data.availability_months.forEach((month, index) => {
            formData.append(`availability_months[${index}]`, month);
        });

        data.suitable.forEach((item, index) => {
            formData.append(`suitable[${index}]`, item);
        });

        // Handle featured image - only include if it's a new file
        if (data.featured_image instanceof File) {
            formData.append("featured_image", data.featured_image);
        } else if (isEdit && typeof data.featured_image === "string") {
            // For existing images, send the path separately
            formData.append("existing_featured_image", data.featured_image);
        }

        // Handle gallery images
        if (isEdit) {
            // For edit: include existing image IDs that should be preserved
            data.existing_gallery_images.forEach((id, index) => {
                formData.append(`existing_gallery_images[${index}]`, id);
            });

            // Add new gallery images
            data.gallery_images.forEach((file, index) => {
                formData.append(`gallery_images[${index}]`, file);
            });
        } else {
            // For create: add all gallery images
            data.gallery_images.forEach((file, index) => {
                formData.append(`gallery_images[${index}]`, file);
            });
        }

        // Include other fields conditionally
        if (data.type_of_project === "Paid") {
            formData.append("fees", data.fees || "");
            formData.append("currency", data.currency || "USD");
            formData.append(
                "category_of_charge",
                data.category_of_charge || "Day"
            );
            formData.append("includes", data.includes || "");
            formData.append("excludes", data.excludes || "");
        }

        if (data.start_date) {
            formData.append("start_date", data.start_date);
        }

        formData.append("point_exchange", data.point_exchange ? "1" : "0");

        if (isEdit) {
            if (data.remove_featured_image) {
                formData.append("remove_featured_image", "1");
            }

            post(route("organization.projects.store", project.slug), {
                data: formData,
                forceFormData: true,
                preserveScroll: true,
            });
        } else {
            post(route("organization.projects.store"), {
                data: formData,
                forceFormData: true,
            });
        }
    };

    const selectedCategoryData = categories.find(
        (cat) => String(cat.id) === String(data.category_id)
    );

    const handleNextStep = (e) => {
        e.preventDefault(); // Add this line to prevent form submission

        // Special case: Always allow moving from step 4 to step 5
        if (step === 4) {
            setStep(5);
            return;
        }

        // Rest of the function remains the same
        const currentStepFields = steps[step - 1].fields;
        const hasErrors = currentStepFields.some((field) => errors[field]);

        if (!hasErrors) {
            setStep((prev) => Math.min(prev + 1, steps.length));
        } else {
            setStepsWithErrors([...new Set([...stepsWithErrors, step])]);
        }
    };

    const handlePrevStep = () => {
        setStep((prev) => Math.max(prev - 1, 1));
    };

    return (
        <OrganizationLayout>
            <Head title={isEdit ? "Edit Project" : "Create Project"} />
            <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow">
                <h1 className="text-2xl font-bold mb-6">
                    {isEdit ? "Edit Project" : "Create New Project"}
                </h1>
                <StepIndicator
                    steps={steps}
                    currentStep={step}
                    errorSteps={stepsWithErrors}
                    onStepClick={setStep}
                />

                {stepsWithErrors.length > 0 && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-md shadow-sm">
                        <div className="flex items-start">
                            <svg
                                className="h-5 w-5 text-red-400 mt-0.5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <p className="ml-3 text-sm text-red-700">
                                Please fix errors in step(s):{" "}
                                {stepsWithErrors.join(", ")}
                            </p>
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
                            <FormInput
                                label="Title"
                                name="title"
                                value={data.title}
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
                                error={errors.title}
                            />

                            <FormInput
                                label="Slug"
                                name="slug"
                                value={data.slug}
                                onChange={(e) =>
                                    setData("slug", e.target.value)
                                }
                                readOnly
                                error={errors.slug}
                            />

                            <FormFileInput
                                label="Featured Image"
                                name="featured_image"
                                onChange={handleFeaturedImageChange}
                                accept=".jpg,.jpeg,.png,.gif,.webp"
                                error={errors.featured_image}
                            />

                            {previewImage && (
                                <div className="mt-2">
                                    <p className="text-sm font-medium text-gray-700 mb-1">
                                        Preview:
                                    </p>
                                    <ImagePreview
                                        src={previewImage}
                                        onRemove={removeFeaturedImage}
                                    />
                                </div>
                            )}

                            <FormSelect
                                label="Category"
                                name="category_id"
                                value={data.category_id}
                                onChange={(e) => {
                                    setData("category_id", e.target.value);
                                    setSelectedCategory(e.target.value);
                                }}
                                options={[
                                    { value: "", label: "Select Category" },
                                    ...categories.map((cat) => ({
                                        value: cat.id,
                                        label: cat.name,
                                    })),
                                ]}
                                error={errors.category_id}
                            />

                            <FormSelect
                                label="Subcategory"
                                name="subcategory_id"
                                value={data.subcategory_id}
                                onChange={(e) =>
                                    setData("subcategory_id", e.target.value)
                                }
                                options={[
                                    { value: "", label: "Select Subcategory" },
                                    ...(selectedCategoryData?.subcategories?.map(
                                        (sub) => ({
                                            value: sub.id,
                                            label: sub.name,
                                        })
                                    ) || []),
                                ]}
                                error={errors.subcategory_id}
                            />
                        </>
                    )}

                    {/* Step 2: Project Details */}
                    {step === 2 && (
                        <>
                            <LocationDropdown
                                selectedCountry={data.country}
                                selectedState={data.state}
                                selectedCity={data.city}
                                onCountryChange={(value) => {
                                    setData("country", value);
                                    setData("state", "");
                                    setData("city", "");
                                }}
                                onCountryNameChange={(name) => {
                                    setData("country_name", name);
                                }}
                                onStateChange={(value) => {
                                    setData("state", value);
                                    setData("city", "");
                                }}
                                onCityChange={(value) => {
                                    setData("city", value);
                                }}
                                isEditing={isEditing}
                                errors={errors}
                            />
                            {showError("country")}
                            {showError("state")}
                            {showError("city")}

                            <FormTextarea
                                label="Short Description"
                                name="short_description"
                                value={data.short_description}
                                onChange={handleShortDescriptionChange}
                                error={errors.short_description}
                                maxLength={500}
                            />
                            <div
                                className={`text-sm mb-4 ${
                                    charCount === 499
                                        ? "text-red-500"
                                        : "text-gray-500"
                                }`}
                            >
                                {charCount}/500 characters{" "}
                                {charCount === 499 && " - Maximum reached"}
                            </div>

                            <FormTextarea
                                label="Detailed Description"
                                name="detailed_description"
                                value={data.detailed_description}
                                onChange={(e) =>
                                    setData(
                                        "detailed_description",
                                        e.target.value
                                    )
                                }
                                rows={5}
                                error={errors.detailed_description}
                            />
                        </>
                    )}

                    {/* Step 3: Duration & Routine */}
                    {step === 3 && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput
                                    label="Minimum Stay"
                                    name="min_duration"
                                    type="number"
                                    value={data.min_duration}
                                    onChange={(e) =>
                                        setData("min_duration", e.target.value)
                                    }
                                    error={errors.min_duration}
                                />

                                <FormInput
                                    label="Maximum Stay"
                                    name="max_duration"
                                    type="number"
                                    value={data.max_duration}
                                    onChange={(e) =>
                                        setData("max_duration", e.target.value)
                                    }
                                    error={errors.max_duration}
                                />
                            </div>

                            <FormSelect
                                label="Duration Type"
                                name="duration_type"
                                value={data.duration_type}
                                onChange={(e) =>
                                    setData("duration_type", e.target.value)
                                }
                                options={[
                                    { value: "Days", label: "Days" },
                                    { value: "Weeks", label: "Weeks" },
                                    { value: "Months", label: "Months" },
                                ]}
                                error={errors.duration_type}
                            />

                            <FormTextarea
                                label="Daily Routine"
                                name="daily_routine"
                                value={data.daily_routine}
                                onChange={(e) =>
                                    setData("daily_routine", e.target.value)
                                }
                                rows={4}
                                error={errors.daily_routine}
                            />
                        </>
                    )}

                    {/* Step 4: Pricing & Availability */}
                    {step === 4 && (
                        <>
                            <FormSelect
                                label="Project Type"
                                name="type_of_project"
                                value={data.type_of_project}
                                onChange={(e) => {
                                    setData("type_of_project", e.target.value);
                                    if (e.target.value === "Free") {
                                        setData("fees", "");
                                        setData("includes", "");
                                        setData("excludes", "");
                                        setData("category_of_charge", "");
                                    }
                                }}
                                options={[
                                    { value: "Free", label: "Free" },
                                    { value: "Paid", label: "Paid" },
                                ]}
                                error={errors.type_of_project}
                            />

                            {data.type_of_project === "Paid" && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormInput
                                            label="Fees"
                                            name="fees"
                                            type="number"
                                            value={data.fees}
                                            onChange={(e) =>
                                                setData("fees", e.target.value)
                                            }
                                            error={errors.fees}
                                        />

                                        <FormSelect
                                            label="Category of Charge"
                                            name="category_of_charge"
                                            value={data.category_of_charge}
                                            onChange={(e) =>
                                                setData(
                                                    "category_of_charge",
                                                    e.target.value
                                                )
                                            }
                                            options={[
                                                {
                                                    value: "Day",
                                                    label: "Per Day",
                                                },
                                                {
                                                    value: "Week",
                                                    label: "Per Week",
                                                },
                                                {
                                                    value: "Month",
                                                    label: "Per Month",
                                                },
                                            ]}
                                            error={errors.category_of_charge}
                                        />
                                    </div>

                                    <FormTextarea
                                        label="Fees Includes"
                                        name="includes"
                                        value={data.includes}
                                        onChange={(e) =>
                                            setData("includes", e.target.value)
                                        }
                                        error={errors.includes}
                                    />

                                    <FormTextarea
                                        label="Fees Excludes"
                                        name="excludes"
                                        value={data.excludes}
                                        onChange={(e) =>
                                            setData("excludes", e.target.value)
                                        }
                                        error={errors.excludes}
                                    />

                                    <FormCheckbox
                                        label="Accept Points Exchange"
                                        name="point_exchange"
                                        checked={data.point_exchange}
                                        onChange={(e) =>
                                            setData(
                                                "point_exchange",
                                                e.target.checked
                                            )
                                        }
                                    />
                                </>
                            )}

                            <FormTextarea
                                label="Activities"
                                name="activities"
                                value={data.activities}
                                onChange={(e) =>
                                    setData("activities", e.target.value)
                                }
                                error={errors.activities}
                            />

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Suitable For
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {suitableOptions.map((option) => (
                                        <FormCheckbox
                                            key={option}
                                            label={option}
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
                                        />
                                    ))}
                                </div>
                                {errors.suitable && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.suitable}
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Availability Months
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                    {months.map((month) => (
                                        <FormCheckbox
                                            key={month}
                                            label={month}
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
                                        />
                                    ))}
                                </div>
                                {errors.availability_months && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.availability_months}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Step 5: Media & Dates */}
                    {step === 5 && (
                        <>
                            <FormFileInput
                                label="Gallery Images"
                                name="gallery_images"
                                onChange={handleGalleryImageChange}
                                accept=".jpg,.jpeg,.png,.gif,.webp"
                                multiple
                                error={errors.gallery_images}
                            />

                            {galleryPreviews.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                        Gallery Previews:
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {galleryPreviews.map(
                                            (preview, index) => (
                                                <ImagePreview
                                                    key={index}
                                                    src={preview.url}
                                                    onRemove={() =>
                                                        removeGalleryImage(
                                                            index
                                                        )
                                                    }
                                                    alt={`Gallery preview ${
                                                        index + 1
                                                    }`}
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                            <FormInput
                                label="Start Date"
                                name="start_date"
                                type="date"
                                value={data.start_date}
                                onChange={(e) =>
                                    setData("start_date", e.target.value)
                                }
                                error={errors.start_date}
                            />
                        </>
                    )}

                    <div className="flex items-center justify-between pt-6">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={handlePrevStep}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Back
                            </button>
                        )}

                        <div className="ml-auto">
                            {step === 5 ? (
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-75"
                                >
                                    {processing
                                        ? "Submitting..."
                                        : "Submit Project"}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={(e) => handleNextStep(e)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </OrganizationLayout>
    );
}
