import React, { useState, useEffect, useRef } from "react";
import { useForm, Head } from "@inertiajs/react";
import OrganizationLayout from "@/Layouts/OrganizationLayout";
import LocationDropdown from "@/Components/LocationDropdown";
import VolunteerSkillsDropdown from "@/Components/VolunteerSkillsDropdown";

// Reusable form components with Daisy UI classes
const FormInput = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    error,
    validate,
    className = "",
    ...props
}) => {
    return (
        <div className="form-control w-full mb-4">
            <label className="label">
                <span className="label-text">{label}</span>
            </label>
            <input
                type={type}
                name={name}
                value={value || ""}
                onChange={onChange}
                className={`input input-bordered w-full ${
                    error ? "input-error" : ""
                } ${className}`}
                {...props}
            />
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error}</span>
                </label>
            )}
        </div>
    );
};

const FormTextarea = ({
    label,
    name,
    value,
    onChange,
    error,
    rows = 3,
    validate,
    ...props
}) => {
    return (
        <div className="form-control w-full mb-4">
            <label className="label">
                <span className="label-text">{label}</span>
            </label>
            <textarea
                name={name}
                value={value || ""}
                onChange={onChange}
                rows={rows}
                className={`textarea textarea-bordered w-full ${
                    error ? "textarea-error" : ""
                }`}
                {...props}
            />
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error}</span>
                </label>
            )}
        </div>
    );
};

const FormSelect = ({
    label,
    name,
    value,
    onChange,
    options,
    error,
    validate,
    ...props
}) => {
    return (
        <div className="form-control w-full mb-4">
            <label className="label">
                <span className="label-text">{label}</span>
            </label>
            <select
                name={name}
                value={value || ""}
                onChange={onChange}
                className={`select select-bordered w-full ${
                    error ? "select-error" : ""
                }`}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error}</span>
                </label>
            )}
        </div>
    );
};

const FormCheckbox = ({ label, name, checked, onChange, error, ...props }) => {
    return (
        <div className="form-control mb-4">
            <label className="label cursor-pointer justify-start gap-2">
                <input
                    type="checkbox"
                    name={name}
                    checked={checked || false}
                    onChange={onChange}
                    className={`checkbox ${error ? "checkbox-error" : ""}`}
                    {...props}
                />
                <span className="label-text">{label}</span>
            </label>
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error}</span>
                </label>
            )}
        </div>
    );
};

const FormFileInput = ({
    label,
    name,
    onChange,
    error,
    accept,
    multiple = false,
}) => (
    <div className="form-control w-full mb-4">
        <label className="label">
            <span className="label-text">{label}</span>
        </label>
        <input
            type="file"
            name={name}
            onChange={onChange}
            accept={accept}
            multiple={multiple}
            className={`file-input file-input-bordered w-full ${
                error ? "file-input-error" : ""
            }`}
        />
        {error && (
            <label className="label">
                <span className="label-text-alt text-error">{error}</span>
            </label>
        )}
    </div>
);

const ImagePreview = ({ src, onRemove, alt = "Preview" }) => (
    <div className="relative inline-block mt-2">
        <img
            src={src}
            alt={alt}
            className="h-32 w-full object-cover rounded-lg"
        />
        <button
            type="button"
            onClick={onRemove}
            className="absolute top-1 right-1 bg-error text-white rounded-full p-1 hover:bg-error/90"
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

const MAX_VALUES = 250;
const SHORT_DESCRIPTION = 500;

export default function ProjectForm({
    categories,
    project = null,
    isEdit = false,
    auth,
}) {
    const featuredImageInputRef = useRef(null);
    const {
        data,
        setData,
        post,
        put,
        errors,
        processing,
        setError,
        clearErrors,
    } = useForm({
        title: project?.title || "",
        slug: project?.slug || "",
        featured_image:
            isEdit && project?.featured_image ? project.featured_image : null,
        category_id: project?.category_id || "",
        subcategory_id: project?.subcategory_id || "",
        country: project?.country || null,
        city: project?.city || null,
        state: project?.state || null,
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
        skills: project?.skills || [],
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
    const [isEditing, setIsEditing] = useState(isEdit);

    const showError = (field) =>
        errors[field] ? (
            <label className="label">
                <span className="label-text-alt text-error">
                    {errors[field]}
                </span>
            </label>
        ) : null;

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
            ],
        },
        { label: "Media & Dates", fields: ["gallery_images", "start_date"] },
    ];

    useEffect(() => {
        const currentStepFields = steps[step - 1].fields;
        const hasCurrentStepErrors = currentStepFields.some(
            (field) => errors[field]
        );

        if (!hasCurrentStepErrors) {
            setStepsWithErrors((prev) => prev.filter((s) => s !== step));
        }
    }, [data, step, errors]);

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
            setData(
                "existing_gallery_images",
                data.existing_gallery_images.filter(
                    (id) => id !== removedImage.id
                )
            );
        } else {
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

        formData.append("title", data.title);

        if (!isEdit || data.slug !== project.slug) {
            formData.append("slug", data.slug);
        }

        formData.append("category_id", data.category_id);
        formData.append("subcategory_id", data.subcategory_id);
        formData.append("country", data.country);
        formData.append("state", data.state);
        formData.append("city", data.city);
        formData.append("skills", data.skills);
        formData.append("short_description", data.short_description);
        formData.append("detailed_description", data.detailed_description);
        formData.append("min_duration", data.min_duration);
        formData.append("max_duration", data.max_duration);
        formData.append("duration_type", data.duration_type);
        formData.append("daily_routine", data.daily_routine);
        formData.append("type_of_project", data.type_of_project);
        formData.append("activities", data.activities);

        data.availability_months.forEach((month, index) => {
            formData.append(`availability_months[${index}]`, month);
        });

        data.suitable.forEach((item, index) => {
            formData.append(`suitable[${index}]`, item);
        });

        if (data.featured_image instanceof File) {
            formData.append("featured_image", data.featured_image);
        } else if (isEdit && typeof data.featured_image === "string") {
            formData.append("existing_featured_image", data.featured_image);
        }

        if (isEdit) {
            data.existing_gallery_images.forEach((id, index) => {
                formData.append(`existing_gallery_images[${index}]`, id);
            });

            data.gallery_images.forEach((file, index) => {
                formData.append(`gallery_images[${index}]`, file);
            });
        } else {
            data.gallery_images.forEach((file, index) => {
                formData.append(`gallery_images[${index}]`, file);
            });
        }

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
        e.preventDefault();

        const currentStepFields = steps[step - 1].fields;
        let isValid = true;

        currentStepFields.forEach((field) => {
            if (
                data.type_of_project === "Free" &&
                ["fees", "includes", "excludes", "category_of_charge"].includes(
                    field
                )
            ) {
                clearErrors(field);
                return;
            }

            if (
                !data[field] ||
                (Array.isArray(data[field]) && data[field].length === 0)
            ) {
                isValid = false;
                setError(field, "This field is required");
            } else {
                clearErrors(field);
            }
        });

        if (step === 1) {
            if (!data.title) {
                isValid = false;
                setError("title", "Title is required");
            }
            if (!data.category_id) {
                isValid = false;
                setError("category_id", "Category is required");
            }
        }

        if (step === 2) {
            if (!data.short_description || data.short_description.length < 50) {
                isValid = false;
                setError(
                    "short_description",
                    "Short description must be at least 50 characters"
                );
            }
        }

        if (step === 3) {
            if (
                data.min_duration &&
                data.max_duration &&
                parseInt(data.min_duration) > parseInt(data.max_duration)
            ) {
                isValid = false;
                setError(
                    "max_duration",
                    "Maximum duration must be greater than minimum duration"
                );
            }
        }

        if (!isValid) {
            setStepsWithErrors([...new Set([...stepsWithErrors, step])]);
            return;
        }

        if (step === 4) {
            setStep(5);
            return;
        }

        setStep((prev) => Math.min(prev + 1, steps.length));
    };

    const handlePrevStep = () => {
        setStep((prev) => Math.max(prev - 1, 1));
    };

    return (
        <OrganizationLayout auth={auth}>
            <Head title={isEdit ? "Edit Project" : "Create Project"} />
            <div className="max-w-5xl mx-auto bg-base-100 p-8 rounded-box shadow-lg">
                <h1 className="text-2xl font-bold mb-6">
                    {isEdit ? "Edit Project" : "Create New Project"}
                </h1>

                {/* Daisy UI Breadcrumb for Steps */}
                <div className="mb-8">
                    <div className="text-sm breadcrumbs">
                        <ul>
                            {steps.map((stepItem, index) => {
                                const stepNumber = index + 1;
                                const isActive = step === stepNumber;
                                const hasError =
                                    stepsWithErrors.includes(stepNumber);

                                return (
                                    <li key={stepNumber}>
                                        <button
                                            type="button"
                                            onClick={() => setStep(stepNumber)}
                                            className={`${
                                                isActive ? "font-bold" : ""
                                            } ${hasError ? "text-error" : ""}`}
                                        >
                                            {stepItem.label}
                                            {hasError && !isActive && (
                                                <span className="ml-1 text-error">
                                                    !
                                                </span>
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <progress
                        className="progress progress-primary w-full mt-2"
                        value={(step / steps.length) * 100}
                        max="100"
                    ></progress>
                </div>

                {stepsWithErrors.length > 0 && (
                    <div className="alert alert-error mb-6">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="stroke-current shrink-0 h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <div>
                            <h3 className="font-bold">
                                Please fix the following errors:
                            </h3>
                            <ul className="list-disc list-inside">
                                {steps[step - 1].fields
                                    .filter((field) => errors[field])
                                    .map((field) => (
                                        <li key={field}>{errors[field]}</li>
                                    ))}
                            </ul>
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
                                    <label className="label">
                                        <span className="label-text">
                                            Preview:
                                        </span>
                                    </label>
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
                                selectedCountry={data.country || null}
                                selectedState={data.state || null}
                                selectedCity={data.city || null}
                                onCountryChange={(value) => {
                                    setData("country", value);
                                    setData("state", "");
                                    setData("city", "");
                                    clearErrors("country");
                                }}
                                onStateChange={(value) => {
                                    setData("state", value);
                                    setData("city", "");
                                    clearErrors("state");
                                }}
                                onCityChange={(value) => {
                                    setData("city", value);
                                    clearErrors("city");
                                }}
                                isEditing={isEditing}
                                errors={errors}
                            />
                            {showError("country")}
                            {showError("state")}
                            {showError("city")}

                            <VolunteerSkillsDropdown
                                label="Required Skills"
                                multiple={true}
                                onSkillsChange={(skills) =>
                                    setData("skills", skills)
                                }
                                initialSelectedSkills={data.skills || []}
                                required={false}
                                maxHeight="300px"
                            />

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
                                        ? "text-error"
                                        : "text-base-content/70"
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
                                maxLength={MAX_VALUES}
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
                                maxLength={SHORT_DESCRIPTION}
                                onChange={(e) =>
                                    setData("activities", e.target.value)
                                }
                                error={errors.activities}
                            />

                            <div className="mb-4">
                                <label className="label">
                                    <span className="label-text">
                                        Suitable For
                                    </span>
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
                                    <label className="label">
                                        <span className="label-text-alt text-error">
                                            {errors.suitable}
                                        </span>
                                    </label>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="label">
                                    <span className="label-text">
                                        Availability Months
                                    </span>
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
                                    <label className="label">
                                        <span className="label-text-alt text-error">
                                            {errors.availability_months}
                                        </span>
                                    </label>
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
                                    <label className="label">
                                        <span className="label-text">
                                            Gallery Previews:
                                        </span>
                                    </label>
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
                                className="btn btn-ghost"
                            >
                                Back
                            </button>
                        )}

                        <div className="ml-auto">
                            {step === 5 ? (
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`btn btn-primary ${
                                        processing ? "loading" : ""
                                    }`}
                                >
                                    {processing ? "" : "Submit Project"}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={(e) => handleNextStep(e)}
                                    className="btn btn-primary"
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
