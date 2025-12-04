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

// NEW: Enhanced dropdown component for includes/excludes matching VolunteerSkillsDropdown
const EnhancedIncludesExcludesDropdown = ({
    label,
    name,
    value = [],
    onChange,
    options,
    error,
    placeholder = "Select options...",
    required = false,
    multiple = true,
    maxHeight = "60vh",
    minHeight = "200px",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleOption = (optionValue) => {
        let newValue;
        if (multiple) {
            newValue = value.includes(optionValue)
                ? value.filter((v) => v !== optionValue)
                : [...value, optionValue];
        } else {
            newValue = value.includes(optionValue) ? [] : [optionValue];
        }

        onChange(name, newValue);
    };

    const removeOption = (optionValue) => {
        const newValue = value.filter((v) => v !== optionValue);
        onChange(name, newValue);
    };

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="mb-6" ref={dropdownRef}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                <button
                    type="button"
                    className={`relative w-full bg-white border ${
                        isOpen
                            ? "border-blue-500 ring-2 ring-blue-200"
                            : "border-gray-300"
                    } rounded-lg shadow-sm pl-3 pr-10 py-3 text-left cursor-default focus:outline-none transition-all duration-150 ${
                        error ? "border-red-500" : ""
                    }`}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                >
                    <div className="flex flex-wrap gap-2 min-h-[40px] items-center">
                        {value.length > 0 ? (
                            value.map((selectedValue) => {
                                const option = options.find(
                                    (opt) => opt.value === selectedValue
                                );
                                return (
                                    <span
                                        key={selectedValue}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                    >
                                        {option?.label}
                                        <button
                                            type="button"
                                            className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeOption(selectedValue);
                                            }}
                                            aria-label={`Remove ${option?.label}`}
                                        >
                                            ×
                                        </button>
                                    </span>
                                );
                            })
                        ) : (
                            <span className="text-gray-500">{placeholder}</span>
                        )}
                    </div>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg
                            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                                isOpen ? "transform rotate-180" : ""
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </span>
                </button>

                {isOpen && (
                    <div
                        className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                        style={{
                            maxHeight: maxHeight,
                            minHeight: minHeight,
                        }}
                    >
                        <div className="p-3">
                            {value.length > 0 && (
                                <div className="w-full mb-3">
                                    <span className="text-xs font-medium text-gray-500">
                                        Selected options:
                                    </span>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {value.map((selectedValue) => {
                                            const option = options.find(
                                                (opt) =>
                                                    opt.value === selectedValue
                                            );
                                            return (
                                                <span
                                                    key={selectedValue}
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                >
                                                    {option?.label}
                                                    <button
                                                        type="button"
                                                        className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeOption(
                                                                selectedValue
                                                            );
                                                        }}
                                                        aria-label={`Remove ${option?.label}`}
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="w-full">
                                <input
                                    type="text"
                                    placeholder="Search options..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
                                    onClick={(e) => e.stopPropagation()}
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />

                                <div
                                    className="overflow-y-auto"
                                    style={{
                                        maxHeight: `calc(${maxHeight} - 150px)`,
                                    }}
                                >
                                    {filteredOptions.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {filteredOptions.map((option) => (
                                                <div
                                                    key={option.value}
                                                    className={`px-3 py-2 text-sm cursor-default select-none rounded-md transition-colors duration-100 flex items-center ${
                                                        value.includes(
                                                            option.value
                                                        )
                                                            ? "bg-blue-50 text-blue-800"
                                                            : "hover:bg-gray-50 text-gray-700"
                                                    }`}
                                                    onClick={() =>
                                                        toggleOption(
                                                            option.value
                                                        )
                                                    }
                                                >
                                                    <input
                                                        type={
                                                            multiple
                                                                ? "checkbox"
                                                                : "radio"
                                                        }
                                                        checked={value.includes(
                                                            option.value
                                                        )}
                                                        readOnly
                                                        className={`h-4 w-4 ${
                                                            multiple
                                                                ? "rounded text-blue-600 focus:ring-blue-500"
                                                                : "rounded-full text-blue-600 focus:ring-blue-500"
                                                        } border-gray-300`}
                                                    />
                                                    <span className="ml-2 truncate">
                                                        {option.label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 text-gray-500">
                                            No options found matching your
                                            search
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
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

    // Helper function to parse includes/excludes data
    const parseIncludesExcludes = (value) => {
        if (Array.isArray(value)) return value;
        if (typeof value === "string") {
            try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                return [];
            }
        }
        return [];
    };

    const {
        data,
        setData,
        post,
        put,
        errors,
        processing,
        setError,
        clearErrors,
        recentlySuccessful,
        isDirty,
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
        includes: project?.includes || [],
        excludes: project?.excludes || [],
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

    // NEW: State to store account/profiled-related errors
    const [accountErrors, setAccountErrors] = useState([]);

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

    // NEW: Options for includes and excludes
    const includesOptions = [
        { value: "Accommodation", label: "Accommodation" },
        { value: "Meals", label: "Meals" },
        { value: "Airport Pickup", label: "Airport Pickup" },
        { value: "Orientation", label: "Orientation" },
        { value: "Training", label: "Training" },
        { value: "Support", label: "24/7 Support" },
        { value: "Certificate", label: "Certificate" },
        { value: "Wifi", label: "WiFi" },
        { value: "Laundry", label: "Laundry" },
        { value: "Transportation", label: "Local Transportation" },
    ];

    const excludesOptions = [
        { value: "Flights", label: "Flights" },
        { value: "Visa", label: "Visa Fees" },
        { value: "Travel Insurance", label: "Travel Insurance" },
        { value: "Vaccinations", label: "Vaccinations" },
        { value: "Personal Expenses", label: "Personal Expenses" },
        { value: "Extra Tours", label: "Extra Tours" },
        { value: "Airport Dropoff", label: "Airport Dropoff" },
        { value: "Souvenirs", label: "Souvenirs" },
    ];

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

    // NEW: Function to extract account/profile related errors from errors object
    const extractAccountErrors = (errorsObj) => {
        const accountErrorKeys = ["account", "profile"];
        return Object.keys(errorsObj)
            .filter((key) => accountErrorKeys.includes(key))
            .map((key) => errorsObj[key]);
    };

    useEffect(() => {
        const currentStepFields = steps[step - 1].fields;
        const hasCurrentStepErrors = currentStepFields.some(
            (field) => errors[field]
        );

        if (!hasCurrentStepErrors) {
            setStepsWithErrors((prev) => prev.filter((s) => s !== step));
        }
    }, [data, step, errors]);

    // NEW: Update account errors when errors change
    useEffect(() => {
        const accountErrs = extractAccountErrors(errors);
        if (accountErrs.length > 0) {
            setAccountErrors(accountErrs);
        } else {
            setAccountErrors([]);
        }
    }, [errors]);

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

        // Append each include and exclude item individually for proper array handling
        data.includes.forEach((item, index) => {
            formData.append(`includes[${index}]`, item);
        });

        data.excludes.forEach((item, index) => {
            formData.append(`excludes[${index}]`, item);
        });

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
            formData.append("point_exchange", data.point_exchange ? "1" : "0");
        }

        if (data.start_date) {
            formData.append("start_date", data.start_date);
        }

        if (isEdit) {
            if (data.remove_featured_image) {
                formData.append("remove_featured_image", "1");
            }

            post(route("organization.projects.store", project.slug), {
                data: formData,
                forceFormData: true,
                preserveScroll: true,
                onError: (errors) => {
                    // Account errors will be handled by the useEffect above
                    console.log("Form errors:", errors);
                },
                onSuccess: () => {
                    // Clear any existing account errors on success
                    setAccountErrors([]);
                },
            });
        } else {
            post(route("organization.projects.store"), {
                data: formData,
                forceFormData: true,
                onError: (errors) => {
                    // Account errors will be handled by the useEffect above
                    console.log("Form errors:", errors);
                },
                onSuccess: () => {
                    // Clear any existing account errors on success
                    setAccountErrors([]);
                },
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
            if (Array.isArray(data[field])) {
                if (data[field].length === 0 && field !== "skills") {
                    // skills might be optional
                    isValid = false;
                    setError(field, "At least one option must be selected");
                }
            }
            // Handle string validation
            else if (!data[field]) {
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

                {/* NEW: Account/Profile Error Alert */}
                {accountErrors.length > 0 && (
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
                        <div className="w-full">
                            <h3 className="font-bold">Account Error</h3>
                            <ul className="list-disc list-inside">
                                {accountErrors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                            <div className="mt-4">
                                {errors.account &&
                                    errors.account.includes("deactivated") && (
                                        <a
                                            href={route(
                                                "organization.settings"
                                            )}
                                            className="btn btn-sm btn-outline btn-error"
                                        >
                                            Go to Settings to Reactivate Account
                                        </a>
                                    )}
                                {errors.profile &&
                                    errors.profile.includes(
                                        "complete your organization profile"
                                    ) && (
                                        <a
                                            href={route("organization.profile")}
                                            className="btn btn-sm btn-outline btn-error"
                                        >
                                            Go to Profile
                                        </a>
                                    )}
                            </div>
                        </div>
                    </div>
                )}

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

                {stepsWithErrors.length > 0 && !accountErrors.length > 0 && (
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

                {/* Only show form if there are no account errors */}
                {accountErrors.length === 0 ? (
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
                                        setData(
                                            "subcategory_id",
                                            e.target.value
                                        )
                                    }
                                    options={[
                                        {
                                            value: "",
                                            label: "Select Subcategory",
                                        },
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
                                            setData(
                                                "min_duration",
                                                e.target.value
                                            )
                                        }
                                        error={errors.min_duration}
                                    />

                                    <FormInput
                                        label="Maximum Stay"
                                        name="max_duration"
                                        type="number"
                                        value={data.max_duration}
                                        onChange={(e) =>
                                            setData(
                                                "max_duration",
                                                e.target.value
                                            )
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
                                        setData(
                                            "type_of_project",
                                            e.target.value
                                        );
                                        if (e.target.value === "Free") {
                                            setData("fees", "");
                                            setData("includes", []);
                                            setData("excludes", []);
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
                                                    setData(
                                                        "fees",
                                                        e.target.value
                                                    )
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
                                                error={
                                                    errors.category_of_charge
                                                }
                                            />
                                        </div>
                                        {/* NEW: Multi-select for includes */}
                                        <EnhancedIncludesExcludesDropdown
                                            label="Fees Includes"
                                            name="includes"
                                            value={data.includes}
                                            onChange={(field, value) =>
                                                setData(field, value)
                                            }
                                            options={includesOptions}
                                            error={errors.includes}
                                            placeholder="Select what's included..."
                                            required={
                                                data.type_of_project === "Paid"
                                            }
                                        />

                                        <EnhancedIncludesExcludesDropdown
                                            label="Fees Excludes"
                                            name="excludes"
                                            value={data.excludes}
                                            onChange={(field, value) =>
                                                setData(field, value)
                                            }
                                            options={excludesOptions}
                                            error={errors.excludes}
                                            placeholder="Select what's not included..."
                                            required={
                                                data.type_of_project === "Paid"
                                            }
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
                                                                      s !==
                                                                      option
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
                                                                  (m) =>
                                                                      m !==
                                                                      month
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
                ) : (
                    // Show message when account errors prevent form submission
                    <div className="text-center py-8">
                        <div className="alert alert-error mb-4">
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
                                <h3 className="font-bold">Unable to Proceed</h3>
                                <p>
                                    Please resolve the account issues before
                                    creating or editing projects.
                                </p>
                            </div>
                        </div>
                        <div className="space-x-4">
                            {errors.account &&
                                errors.account.includes("deactivated") && (
                                    <a
                                        href={route("organization.settings")}
                                        className="btn btn-error"
                                    >
                                        Go to Settings
                                    </a>
                                )}
                            {errors.profile &&
                                errors.profile.includes(
                                    "complete your organization profile"
                                ) && (
                                    <a
                                        href={route("organization.profile")}
                                        className="btn btn-error"
                                    >
                                        Complete Profile
                                    </a>
                                )}
                            <a
                                href={route("organization.projects")}
                                className="btn btn-ghost"
                            >
                                Back to Projects
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </OrganizationLayout>
    );
}
