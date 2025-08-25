import OrganizationLayout from "@/Layouts/OrganizationLayout";
import { useState, useEffect } from "react";
import { usePage, useForm, Head, router } from "@inertiajs/react";
import LocationDropdown from "@/Components/LocationDropdown";
import { CheckCircle, Users, Copy, User, Check } from "lucide-react";
import VerifiedBadge from "@/Components/VerifiedBadge";

// Reusable form components (copied from the first example)
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

export default function Profile({
    organization,
    auth,
    organization_verification,
}) {
    const { verification } = usePage().props;
    const [org, setOrg] = useState(organization ?? {});
    const [isEditing, setIsEditing] = useState(false);
    const [image, setImage] = useState(null);
    const [newLogo, setNewLogo] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [step, setStep] = useState(1);
    const [stepsWithErrors, setStepsWithErrors] = useState([]);

    const { errors } = usePage().props;
    const { data, setData, post, processing, reset } = useForm({
        name: org.name || "",
        slug: org.slug || "",
        city: org.city || "",
        country: org.country || "",
        state: org.state || "",
        foundedYear: org.foundedYear || "",
        phone: org.phone || "",
        website: org.website || "",
        facebook: org.facebook || "",
        twitter: org.twitter || "",
        instagram: org.instagram || "",
        linkedin: org.linkedin || "",
        youtube: org.youtube || "",
        description: org.description || "",
        mission_statement: org.mission_statement || "",
        vision_statement: org.vision_statement || "",
        values: org.values || "",
        address: org.address || "",
        postal: org.postal || "",

        logo: null, // Initialize as null
        current_logo: org.logo || null, // Store the current logo path separately
        remove_logo: false, // Flag to track if logo should be removed
    });

    const MAX_MISSION_VISION_VALUES = 200;
    const MAX_DESCRIPTION = 2000;

    const steps = [
        {
            label: "Basic Information",
            fields: ["name", "slug", "country", "state", "city"],
        },
        {
            label: "Contact Details",
            fields: ["phone", "address", "postal", "foundedYear"],
        },
        {
            label: "Social Media",
            fields: [
                "website",
                "facebook",
                "twitter",
                "instagram",
                "linkedin",
                "youtube",
            ],
        },
        {
            label: "About Organization",
            fields: [
                "description",
                "mission_statement",
                "vision_statement",
                "values",
            ],
        },
        {
            label: "Logo",
            fields: ["logo"],
        },
    ];

    useEffect(() => {
        const errorSteps = steps.reduce((acc, curr, index) => {
            if (curr.fields.some((field) => errors[field])) {
                acc.push(index + 1);
            }
            return acc;
        }, []);

        setStepsWithErrors([...new Set(errorSteps)]);
    }, [errors]);

    const handleInputChange = (e, maxLength) => {
        const { name, value } = e.target;
        if (value.length <= maxLength) setData(name, value);
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setShowSuccess(false);
    };

    const handleVerifyClick = () => {
        router.visit(
            route("organization.verification", {
                organization_profile: org.slug,
            })
        );
    };

    const handleSaveSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        // Add all form data to FormData
        Object.keys(data).forEach((key) => {
            if (
                key !== "logo" &&
                key !== "current_logo" &&
                key !== "remove_logo"
            ) {
                formData.append(key, data[key]);
            }
        });
        // Handle logo separately
        if (data.remove_logo) {
            // If logo is marked for removal, send null
            formData.append("logo", "");
        } else if (newLogo && data.logo instanceof File) {
            // If new logo was uploaded
            formData.append("logo", data.logo);
        } else if (data.current_logo) {
            // If no new logo but current logo exists, keep it
            formData.append("current_logo", data.current_logo);
        }

        try {
            await post(route("organization.profile.update"), {
                data: formData,
                preserveScroll: true,
                forceFormData: true,
                onSuccess: () => {
                    setIsEditing(false);
                    setImage(null);
                    setNewLogo(false);
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 5000);

                    // Refresh the page to get updated data
                    router.reload();
                },
                onError: (errors) => {
                    console.error("Error updating profile:", errors);
                },
            });
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const showError = (field) =>
        errors[field] ? (
            <div className="text-red-500 text-sm mt-1">{errors[field]}</div>
        ) : null;

    const handleNextStep = (e) => {
        e.preventDefault();
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

    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(auth.user.referral_code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // hide after 2s
        });
    };

    const organizationVerified =
        organization_verification?.status === "Approved";

    return (
        <OrganizationLayout auth={auth}>
            <Head title="Organization Profile" />

            <section className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Header with gradient background */}
                <div className="bg-gradient-to-r from-indigo-700 to-blue-700 px-8 py-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                Organization Profile
                            </h1>
                            <p className="text-indigo-100 mt-1">
                                Manage your organization's public profile
                            </p>
                        </div>

                        {!isEditing && (
                            <div className="flex flex-wrap gap-3">
                                {!organizationVerified && (
                                    <button
                                        onClick={handleVerifyClick}
                                        disabled={
                                            organization_verification?.status ===
                                            "Pending"
                                        }
                                        className={`inline-flex items-center px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all ${
                                            organization_verification?.status ===
                                            "Pending"
                                                ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                                                : "bg-white text-indigo-700 hover:bg-indigo-50 hover:shadow-md"
                                        }`}
                                    >
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                            />
                                        </svg>
                                        {organization_verification?.status ===
                                        "Pending"
                                            ? "Verification Submitted"
                                            : "Verify Account"}
                                    </button>
                                )}

                                <button
                                    onClick={handleEditClick}
                                    className="inline-flex items-center px-4 py-2 bg-white text-indigo-700 rounded-lg shadow-sm hover:bg-indigo-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all"
                                >
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        />
                                    </svg>
                                    Edit Profile
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main content */}
                <div className="px-8 py-6 space-y-6">
                    {/* Success and error messages */}
                    {showSuccess && (
                        <div className="rounded-lg bg-green-50 p-4 border border-green-200 shadow-sm">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 text-green-500"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-green-800">
                                        Profile updated successfully!
                                    </p>
                                </div>
                                <div className="ml-auto pl-3">
                                    <button
                                        onClick={() => setShowSuccess(false)}
                                        className="text-green-500 hover:text-green-600 transition-colors"
                                    >
                                        <span className="sr-only">Dismiss</span>
                                        <svg
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {Object.keys(errors).length > 0 && (
                        <div className="rounded-lg bg-red-50 p-4 border border-red-200 shadow-sm">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 text-red-500"
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
                                    <h3 className="text-sm font-medium text-red-800">
                                        There were errors with your submission
                                    </h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <ul className="list-disc pl-5 space-y-1">
                                            {Object.keys(errors).map((key) => (
                                                <li key={key}>{errors[key]}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {isEditing ? (
                        <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow">
                            <StepIndicator
                                steps={steps}
                                currentStep={step}
                                errorSteps={stepsWithErrors}
                                onStepClick={setStep}
                            />

                            <form
                                onSubmit={handleSaveSubmit}
                                className="space-y-6"
                            >
                                {/* Step 1: Basic Information */}
                                {step === 1 && (
                                    <>
                                        <FormInput
                                            label="Organization Name"
                                            name="name"
                                            value={data.name}
                                            onChange={(e) => {
                                                const nameValue =
                                                    e.target.value;
                                                setData("name", nameValue);
                                                setData(
                                                    "slug",
                                                    nameValue
                                                        .toLowerCase()
                                                        .trim()
                                                        .replace(
                                                            /[^a-z0-9 -]/g,
                                                            ""
                                                        )
                                                        .replace(/\s+/g, "-")
                                                        .replace(/-+/g, "-")
                                                );
                                            }}
                                            error={errors.name}
                                        />

                                        <FormInput
                                            label="Profile URL"
                                            name="slug"
                                            value={data.slug}
                                            onChange={(e) =>
                                                setData("slug", e.target.value)
                                            }
                                            readOnly
                                            error={errors.slug}
                                        />

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
                                    </>
                                )}

                                {/* Step 2: Contact Details */}
                                {step === 2 && (
                                    <>
                                        <FormInput
                                            label="Phone"
                                            name="phone"
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData("phone", e.target.value)
                                            }
                                            error={errors.phone}
                                            placeholder="+1 (123) 456-7890"
                                        />

                                        <FormInput
                                            label="Address"
                                            name="address"
                                            value={data.address}
                                            onChange={(e) =>
                                                setData(
                                                    "address",
                                                    e.target.value
                                                )
                                            }
                                            error={errors.address}
                                            placeholder="Street address"
                                        />

                                        <FormInput
                                            label="Postal Code"
                                            name="postal"
                                            value={data.postal}
                                            onChange={(e) =>
                                                setData(
                                                    "postal",
                                                    e.target.value
                                                )
                                            }
                                            error={errors.postal}
                                            placeholder="Postal or ZIP code"
                                        />

                                        <FormInput
                                            label="Founded Year"
                                            name="foundedYear"
                                            type="number"
                                            value={data.foundedYear}
                                            onChange={(e) =>
                                                setData(
                                                    "foundedYear",
                                                    e.target.value
                                                )
                                            }
                                            min="1900"
                                            max={new Date().getFullYear()}
                                            error={errors.foundedYear}
                                            placeholder="YYYY"
                                        />
                                    </>
                                )}

                                {/* Step 3: Social Media */}
                                {step === 3 && (
                                    <>
                                        <FormInput
                                            label="Website"
                                            name="website"
                                            value={data.website}
                                            onChange={(e) =>
                                                setData(
                                                    "website",
                                                    e.target.value
                                                )
                                            }
                                            error={errors.website}
                                            placeholder="https://yourdomain.com"
                                        />

                                        <FormInput
                                            label="Facebook"
                                            name="facebook"
                                            value={data.facebook}
                                            onChange={(e) =>
                                                setData(
                                                    "facebook",
                                                    e.target.value
                                                )
                                            }
                                            error={errors.facebook}
                                            placeholder="facebook.com/username"
                                        />

                                        <FormInput
                                            label="Twitter"
                                            name="twitter"
                                            value={data.twitter}
                                            onChange={(e) =>
                                                setData(
                                                    "twitter",
                                                    e.target.value
                                                )
                                            }
                                            error={errors.twitter}
                                            placeholder="twitter.com/username"
                                        />

                                        <FormInput
                                            label="Instagram"
                                            name="instagram"
                                            value={data.instagram}
                                            onChange={(e) =>
                                                setData(
                                                    "instagram",
                                                    e.target.value
                                                )
                                            }
                                            error={errors.instagram}
                                            placeholder="instagram.com/username"
                                        />

                                        <FormInput
                                            label="LinkedIn"
                                            name="linkedin"
                                            value={data.linkedin}
                                            onChange={(e) =>
                                                setData(
                                                    "linkedin",
                                                    e.target.value
                                                )
                                            }
                                            error={errors.linkedin}
                                            placeholder="linkedin.com/company/username"
                                        />

                                        <FormInput
                                            label="YouTube"
                                            name="youtube"
                                            value={data.youtube}
                                            onChange={(e) =>
                                                setData(
                                                    "youtube",
                                                    e.target.value
                                                )
                                            }
                                            error={errors.youtube}
                                            placeholder="youtube.com/channel"
                                        />
                                    </>
                                )}

                                {/* Step 4: About Organization */}
                                {step === 4 && (
                                    <>
                                        <FormTextarea
                                            label="Description"
                                            name="description"
                                            value={data.description}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    e,
                                                    MAX_DESCRIPTION
                                                )
                                            }
                                            error={errors.description}
                                            rows={5}
                                            maxLength={MAX_DESCRIPTION}
                                        />
                                        <div className="text-sm text-gray-500">
                                            {data.description.length}/
                                            {MAX_DESCRIPTION} characters
                                        </div>

                                        <FormTextarea
                                            label="Mission Statement"
                                            name="mission_statement"
                                            value={data.mission_statement}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    e,
                                                    MAX_MISSION_VISION_VALUES
                                                )
                                            }
                                            error={errors.mission_statement}
                                            rows={3}
                                            maxLength={
                                                MAX_MISSION_VISION_VALUES
                                            }
                                        />
                                        <div className="text-sm text-gray-500">
                                            {data.mission_statement.length}/
                                            {MAX_MISSION_VISION_VALUES}{" "}
                                            characters
                                        </div>

                                        <FormTextarea
                                            label="Vision Statement"
                                            name="vision_statement"
                                            value={data.vision_statement}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    e,
                                                    MAX_MISSION_VISION_VALUES
                                                )
                                            }
                                            error={errors.vision_statement}
                                            rows={3}
                                            maxLength={
                                                MAX_MISSION_VISION_VALUES
                                            }
                                        />
                                        <div className="text-sm text-gray-500">
                                            {data.vision_statement.length}/
                                            {MAX_MISSION_VISION_VALUES}{" "}
                                            characters
                                        </div>

                                        <FormTextarea
                                            label="Core Values"
                                            name="values"
                                            value={data.values}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    e,
                                                    MAX_MISSION_VISION_VALUES
                                                )
                                            }
                                            error={errors.values}
                                            rows={3}
                                            maxLength={
                                                MAX_MISSION_VISION_VALUES
                                            }
                                        />
                                        <div className="text-sm text-gray-500">
                                            {data.values.length}/
                                            {MAX_MISSION_VISION_VALUES}{" "}
                                            characters
                                        </div>
                                    </>
                                )}

                                {/* Step 5: Logo */}
                                {step === 5 && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Organization Logo
                                        </label>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                            <div className="flex-shrink-0">
                                                {image ? (
                                                    <ImagePreview
                                                        src={image}
                                                        onRemove={() => {
                                                            setImage(null);
                                                            setNewLogo(false);
                                                            setData(
                                                                "logo",
                                                                null
                                                            );
                                                            setData(
                                                                "remove_logo",
                                                                true
                                                            );
                                                        }}
                                                        alt="Selected Logo Preview"
                                                    />
                                                ) : org.logo &&
                                                  !data.remove_logo ? (
                                                    <ImagePreview
                                                        src={`/storage/${org.logo}`}
                                                        onRemove={() => {
                                                            setData(
                                                                "remove_logo",
                                                                true
                                                            );
                                                            setData(
                                                                "logo",
                                                                null
                                                            );
                                                        }}
                                                        alt="Current Logo"
                                                    />
                                                ) : (
                                                    <div className="w-40 h-40 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                                                        <svg
                                                            className="w-12 h-12 mb-2"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={1}
                                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                            />
                                                        </svg>
                                                        <span className="text-sm">
                                                            No logo
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 w-full">
                                                <FormFileInput
                                                    label="Upload Logo"
                                                    name="logo"
                                                    onChange={(e) => {
                                                        const file =
                                                            e.target.files[0];
                                                        if (!file) return;
                                                        const validTypes = [
                                                            "image/jpeg",
                                                            "image/jpg",
                                                            "image/png",
                                                        ];
                                                        if (
                                                            !validTypes.includes(
                                                                file.type
                                                            )
                                                        ) {
                                                            alert(
                                                                "Only JPG, JPEG, and PNG files are allowed."
                                                            );
                                                            return;
                                                        }
                                                        const maxSize =
                                                            2 * 1024 * 1024;
                                                        if (
                                                            file.size > maxSize
                                                        ) {
                                                            alert(
                                                                "File size should be less than 2MB."
                                                            );
                                                            return;
                                                        }
                                                        setData("logo", file);
                                                        setData(
                                                            "remove_logo",
                                                            false
                                                        );
                                                        setImage(
                                                            URL.createObjectURL(
                                                                file
                                                            )
                                                        );
                                                        setNewLogo(true);
                                                    }}
                                                    accept=".jpg,.jpeg,.png"
                                                    error={errors.logo}
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Recommended size: 400x400px,
                                                    max 2MB
                                                </p>
                                            </div>
                                        </div>
                                    </div>
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
                                        {step === steps.length ? (
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-75"
                                            >
                                                {processing
                                                    ? "Saving..."
                                                    : "Save Profile"}
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleNextStep}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                Next
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    ) : (
                        // View mode (non-editing) - replace the existing view mode section with this
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Organization Overview Section */}
                            <div className="md:col-span-2">
                                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                    {/* Logo */}
                                    <div className="flex-shrink-0 relative">
                                        {org.logo ? (
                                            <>
                                                <img
                                                    src={`/storage/${org.logo}`}
                                                    alt="Organization Logo"
                                                    className="w-32 h-32 md:w-40 md:h-40 rounded-lg object-cover border border-gray-200"
                                                />
                                                {organizationVerified && (
                                                    <VerifiedBadge />
                                                )}
                                            </>
                                        ) : (
                                            <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400">
                                                No logo
                                            </div>
                                        )}
                                    </div>

                                    {/* Basic Info */}
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            {org.name}
                                        </h2>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-sm font-medium text-gray-500">
                                                Referral Code:
                                            </span>
                                            <div className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 text-blue-700 font-mono text-sm shadow-sm border border-blue-100">
                                                {auth.user.referral_code}
                                                <button
                                                    onClick={handleCopy}
                                                    className="ml-2 text-blue-500 hover:text-blue-700 transition-colors"
                                                    aria-label="Copy referral code"
                                                >
                                                    {copied ? (
                                                        <Check className="h-4 w-4 text-green-500" />
                                                    ) : (
                                                        <Copy className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                            {copied && (
                                                <span className="text-xs text-green-600 font-medium">
                                                    Copied!
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-2 flex items-center">
                                            <svg
                                                className="w-5 h-5 text-gray-500 mr-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                            <span className="text-gray-600">
                                                {org.city},{" "}
                                                {org.state
                                                    ? `${org.state}, `
                                                    : ""}
                                                {org.country}
                                            </span>
                                        </div>
                                        <div className="mt-2 flex items-center">
                                            <svg
                                                className="w-5 h-5 text-gray-500 mr-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            <span className="text-gray-600">
                                                Founded in {org.foundedYear}
                                            </span>
                                        </div>

                                        {/* Profile URL */}
                                        <div className="mt-4">
                                            <p className="text-sm font-medium text-gray-700">
                                                Profile URL
                                            </p>
                                            <a
                                                href={`${window.location.origin}/${org.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-indigo-600 hover:text-indigo-800 hover:underline inline-flex items-center"
                                            >
                                                {window.location.host}/
                                                {org.slug}
                                                <svg
                                                    className="w-4 h-4 ml-1"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                    />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information Section */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Contact Information
                                </h3>

                                <div className="space-y-3">
                                    {org.phone && (
                                        <div className="flex items-start">
                                            <svg
                                                className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                />
                                            </svg>
                                            <span className="text-gray-700">
                                                {org.phone}
                                            </span>
                                        </div>
                                    )}

                                    {org.email && (
                                        <div className="flex items-start">
                                            <svg
                                                className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                />
                                            </svg>
                                            <span className="text-gray-700">
                                                {org.email}
                                            </span>
                                        </div>
                                    )}

                                    {org.address && (
                                        <div className="flex items-start">
                                            <svg
                                                className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                            <div>
                                                <p className="text-gray-700">
                                                    {org.address}
                                                </p>
                                                {org.postal && (
                                                    <p className="text-gray-700">
                                                        {org.postal}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Social Media Section */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Social Media
                                </h3>

                                <div className="space-y-3">
                                    {org.website && (
                                        <div className="flex items-center">
                                            <svg
                                                className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                                                />
                                            </svg>
                                            <a
                                                href={
                                                    org.website.startsWith(
                                                        "http"
                                                    )
                                                        ? org.website
                                                        : `https://${org.website}`
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-indigo-600 hover:text-indigo-800 hover:underline"
                                            >
                                                {org.website.replace(
                                                    /^https?:\/\//,
                                                    ""
                                                )}
                                            </a>
                                        </div>
                                    )}

                                    {org.facebook && (
                                        <div className="flex items-center">
                                            <svg
                                                className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                            </svg>
                                            <a
                                                href={
                                                    org.facebook.startsWith(
                                                        "http"
                                                    )
                                                        ? org.facebook
                                                        : `https://${org.facebook}`
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-indigo-600 hover:text-indigo-800 hover:underline"
                                            >
                                                {org.facebook.replace(
                                                    /^https?:\/\/(www\.)?facebook\.com\//,
                                                    ""
                                                )}
                                            </a>
                                        </div>
                                    )}

                                    {org.twitter && (
                                        <div className="flex items-center">
                                            <svg
                                                className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                            </svg>
                                            <a
                                                href={
                                                    org.twitter.startsWith(
                                                        "http"
                                                    )
                                                        ? org.twitter
                                                        : `https://${org.twitter}`
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-indigo-600 hover:text-indigo-800 hover:underline"
                                            >
                                                {org.twitter.replace(
                                                    /^https?:\/\/(www\.)?twitter\.com\//,
                                                    ""
                                                )}
                                            </a>
                                        </div>
                                    )}

                                    {org.instagram && (
                                        <div className="flex items-center">
                                            <svg
                                                className="w-5 h-5 text-pink-600 mr-2 flex-shrink-0"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                            </svg>
                                            <a
                                                href={
                                                    org.instagram.startsWith(
                                                        "http"
                                                    )
                                                        ? org.instagram
                                                        : `https://${org.instagram}`
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-indigo-600 hover:text-indigo-800 hover:underline"
                                            >
                                                {org.instagram.replace(
                                                    /^https?:\/\/(www\.)?instagram\.com\//,
                                                    ""
                                                )}
                                            </a>
                                        </div>
                                    )}

                                    {org.linkedin && (
                                        <div className="flex items-center">
                                            <svg
                                                className="w-5 h-5 text-blue-700 mr-2 flex-shrink-0"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                            </svg>
                                            <a
                                                href={
                                                    org.linkedin.startsWith(
                                                        "http"
                                                    )
                                                        ? org.linkedin
                                                        : `https://${org.linkedin}`
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-indigo-600 hover:text-indigo-800 hover:underline"
                                            >
                                                {org.linkedin.replace(
                                                    /^https?:\/\/(www\.)?linkedin\.com\//,
                                                    ""
                                                )}
                                            </a>
                                        </div>
                                    )}

                                    {org.youtube && (
                                        <div className="flex items-center">
                                            <svg
                                                className="w-5 h-5 text-red-600 mr-2 flex-shrink-0"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                            </svg>
                                            <a
                                                href={
                                                    org.youtube.startsWith(
                                                        "http"
                                                    )
                                                        ? org.youtube
                                                        : `https://${org.youtube}`
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-indigo-600 hover:text-indigo-800 hover:underline"
                                            >
                                                {org.youtube.replace(
                                                    /^https?:\/\/(www\.)?youtube\.com\//,
                                                    ""
                                                )}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* About Section */}
                            <div className="md:col-span-2 bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    About Us
                                </h3>

                                {org.description && (
                                    <div className="mb-6">
                                        <h4 className="text-md font-medium text-gray-800 mb-2">
                                            Description
                                        </h4>
                                        <p className="text-gray-700 whitespace-pre-line">
                                            {org.description}
                                        </p>
                                    </div>
                                )}

                                {org.mission_statement && (
                                    <div className="mb-6">
                                        <h4 className="text-md font-medium text-gray-800 mb-2">
                                            Mission Statement
                                        </h4>
                                        <p className="text-gray-700 whitespace-pre-line">
                                            {org.mission_statement}
                                        </p>
                                    </div>
                                )}

                                {org.vision_statement && (
                                    <div className="mb-6">
                                        <h4 className="text-md font-medium text-gray-800 mb-2">
                                            Vision Statement
                                        </h4>
                                        <p className="text-gray-700 whitespace-pre-line">
                                            {org.vision_statement}
                                        </p>
                                    </div>
                                )}

                                {org.values && (
                                    <div>
                                        <h4 className="text-md font-medium text-gray-800 mb-2">
                                            Core Values
                                        </h4>
                                        <p className="text-gray-700 whitespace-pre-line">
                                            {org.values}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </OrganizationLayout>
    );
}
