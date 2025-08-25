import VolunteerLayout from "@/Layouts/VolunteerLayout";
import { useState, useEffect } from "react";
import { usePage, useForm, Head, router } from "@inertiajs/react";
import LocationDropdown from "@/Components/LocationDropdown";
import {
    CheckCircle,
    Copy,
    Check,
    Edit,
    X,
    Trash2,
    Upload,
    Calendar,
    MapPin,
    Phone,
    Mail,
    Globe,
    ChevronDown,
    User,
    Users, // Add this import
    AlertCircle,
} from "lucide-react";
import VerifiedBadge from "@/Components/VerifiedBadge";
import VolunteerSkillsDropdown from "@/Components/VolunteerSkillsDropdown";

// Enhanced reusable form components
const FormInput = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    error,
    className = "",
    as = "input",
    children,
    icon,
    ...props
}) => (
    <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
        </label>
        <div className="relative">
            {icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {icon}
                </div>
            )}
            {as === "select" ? (
                <select
                    name={name}
                    value={value || ""}
                    onChange={onChange}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        icon ? "pl-10" : ""
                    } ${className}`}
                    {...props}
                >
                    {children}
                </select>
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value || ""}
                    onChange={onChange}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        icon ? "pl-10" : ""
                    } ${className}`}
                    {...props}
                />
            )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
);

const FormTextarea = ({
    label,
    name,
    value,
    onChange,
    error,
    rows = 4,
    ...props
}) => (
    <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
        </label>
        <textarea
            name={name}
            value={value || ""}
            onChange={onChange}
            rows={rows}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
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
    <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
            <div className="space-y-1 text-center">
                <div className="flex text-sm text-gray-600">
                    <label
                        htmlFor={name}
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                    >
                        <span>Upload a file</span>
                        <input
                            id={name}
                            type="file"
                            name={name}
                            onChange={onChange}
                            accept={accept}
                            multiple={multiple}
                            className="sr-only"
                        />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
            </div>
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
);

const ImagePreview = ({ src, onRemove, alt = "Preview" }) => (
    <div className="relative group">
        <img
            src={src}
            alt={alt}
            className="h-40 w-40 rounded-lg object-cover border-2 border-gray-200 shadow-sm"
        />
        <button
            type="button"
            onClick={onRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
            title="Remove image"
        >
            <X className="h-4 w-4" />
        </button>
    </div>
);

const FormMultiSelect = ({
    label,
    name,
    options,
    selectedValues = [],
    onChange,
    error,
}) => {
    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        let newValues = [...selectedValues];

        if (checked) {
            newValues.push(value);
        } else {
            newValues = newValues.filter((item) => item !== value);
        }

        onChange({ target: { name, value: newValues } });
    };

    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
                {label}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {options.map((option) => (
                    <div key={option.value} className="flex items-center">
                        <input
                            type="checkbox"
                            id={`${name}-${option.value}`}
                            name={name}
                            value={option.value}
                            checked={selectedValues.includes(option.value)}
                            onChange={handleCheckboxChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                            htmlFor={`${name}-${option.value}`}
                            className="ml-3 block text-sm text-gray-700"
                        >
                            {option.label}
                        </label>
                    </div>
                ))}
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

const ProfileSection = ({ title, children, className = "" }) => (
    <div
        className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}
    >
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <div className="p-6">{children}</div>
    </div>
);

const InfoItem = ({ icon, label, value, className = "" }) => (
    <div className={`flex items-start ${className}`}>
        <div className="flex-shrink-0 mt-0.5">{icon}</div>
        <div className="ml-3">
            {label && (
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {label}
                </p>
            )}
            <p className="text-sm text-gray-700">{value || "Not specified"}</p>
        </div>
    </div>
);

export default function Profile({ volunteer, auth, verification }) {
    const [isEditing, setIsEditing] = useState(false);
    const [image, setImage] = useState(null);
    const [newProfilePicture, setNewProfilePicture] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showProfileIncomplete, setShowProfileIncomplete] = useState(false); // Added state for notification

    const { errors } = usePage().props;
    const { data, setData, post, processing, reset } = useForm({
        gender: volunteer?.gender || "",
        dob: volunteer?.dob || "",
        city: volunteer?.city || "",
        country: volunteer?.country || "",
        state: volunteer?.state || "",
        postal: volunteer?.postal || "",
        phone: volunteer?.phone || "",
        facebook: volunteer?.facebook || "",
        twitter: volunteer?.twitter || "",
        instagram: volunteer?.instagram || "",
        linkedin: volunteer?.linkedin || "",
        hobbies: volunteer?.hobbies || [],
        education_status: volunteer?.education_status || "",
        skills: volunteer?.skills || [],
        nok: volunteer?.nok || "",
        nok_phone: volunteer?.nok_phone || "",
        nok_relation: volunteer?.nok_relation || "",
        profile_picture: null,
        current_profile_picture: volunteer?.profile_picture || null,
        remove_profile_picture: false,
    });

    // Check if profile is incomplete on component mount
    useEffect(() => {
        if (!volunteer) {
            setShowProfileIncomplete(true);
        }
    }, [volunteer]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setShowSuccess(false);
        setShowProfileIncomplete(false); // Hide notification when editing
    };

    const handleVerifyClick = () => {
        // Check if volunteer profile exists before proceeding
        if (!volunteer) {
            setShowProfileIncomplete(true);
            return;
        }

        router.visit(
            route("volunteer.verification", {
                volunteer: volunteer.id,
            })
        );
    };

    const handleSaveSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        Object.keys(data).forEach((key) => {
            if (
                key !== "profile_picture" &&
                key !== "current_profile_picture" &&
                key !== "remove_profile_picture"
            ) {
                formData.append(key, data[key]);
            }
        });

        if (data.remove_profile_picture) {
            formData.append("profile_picture", "");
        } else if (newProfilePicture && data.profile_picture instanceof File) {
            formData.append("profile_picture", data.profile_picture);
        } else if (data.current_profile_picture) {
            formData.append(
                "current_profile_picture",
                data.current_profile_picture
            );
        }

        try {
            await post(route("volunteer.profile.update"), {
                data: formData,
                preserveScroll: true,
                forceFormData: true,
                onSuccess: () => {
                    setIsEditing(false);
                    setImage(null);
                    setNewProfilePicture(false);
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 5000);
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

    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(auth.user.referral_code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // hide after 2s
        });
    };

    const volunteerVerified = verification?.status === "Approved";

    return (
        <VolunteerLayout>
            <Head title="Volunteer Profile" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            My Profile
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Manage your volunteer profile information
                        </p>
                    </div>

                    {!isEditing && (
                        <div className="flex flex-wrap gap-3">
                            {!volunteerVerified && (
                                <button
                                    onClick={handleVerifyClick}
                                    disabled={
                                        verification?.status === "Pending"
                                    }
                                    className={`inline-flex items-center px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all ${
                                        verification?.status === "Pending"
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
                                    {verification?.status === "Pending"
                                        ? "Verification Submitted"
                                        : "Verify Account"}
                                </button>
                            )}
                            <button
                                onClick={handleEditClick}
                                className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Profile
                            </button>
                        </div>
                    )}
                </div>

                {/* Profile Incomplete Notification */}
                {showProfileIncomplete && (
                    <div className="mb-6 rounded-md bg-yellow-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <AlertCircle className="h-5 w-5 text-yellow-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-yellow-800">
                                    Please complete your profile information
                                    before verifying your account.
                                </p>
                            </div>
                            <div className="ml-auto pl-3">
                                <div className="-mx-1.5 -my-1.5">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowProfileIncomplete(false)
                                        }
                                        className="inline-flex rounded-md bg-yellow-50 p-1.5 text-yellow-500 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50"
                                    >
                                        <span className="sr-only">Dismiss</span>
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success and error messages */}
                {showSuccess && (
                    <div className="mb-6 rounded-md bg-green-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <CheckCircle className="h-5 w-5 text-green-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">
                                    Your profile has been updated successfully.
                                </p>
                            </div>
                            <div className="ml-auto pl-3">
                                <div className="-mx-1.5 -my-1.5">
                                    <button
                                        type="button"
                                        onClick={() => setShowSuccess(false)}
                                        className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                                    >
                                        <span className="sr-only">Dismiss</span>
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {Object.keys(errors).length > 0 && (
                    <div className="mb-6 rounded-md bg-red-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <X className="h-5 w-5 text-red-400" />
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
                    <form onSubmit={handleSaveSubmit} className="space-y-8">
                        <ProfileSection title="Personal Information">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Profile Picture
                                        </label>
                                        <div className="flex items-center space-x-6">
                                            <div className="flex-shrink-0">
                                                {image ? (
                                                    <ImagePreview
                                                        src={image}
                                                        onRemove={() => {
                                                            setImage(null);
                                                            setNewProfilePicture(
                                                                false
                                                            );
                                                            setData(
                                                                "profile_picture",
                                                                null
                                                            );
                                                            setData(
                                                                "remove_profile_picture",
                                                                true
                                                            );
                                                        }}
                                                    />
                                                ) : volunteer?.profile_picture &&
                                                  !data.remove_profile_picture ? (
                                                    <ImagePreview
                                                        src={`/storage/${volunteer.profile_picture}`}
                                                        onRemove={() => {
                                                            setData(
                                                                "remove_profile_picture",
                                                                true
                                                            );
                                                            setData(
                                                                "profile_picture",
                                                                null
                                                            );
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="h-40 w-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                                                        <Upload className="h-10 w-10" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <FormFileInput
                                                    label="Upload new photo"
                                                    name="profile_picture"
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
                                                        setData(
                                                            "profile_picture",
                                                            file
                                                        );
                                                        setData(
                                                            "remove_profile_picture",
                                                            false
                                                        );
                                                        setImage(
                                                            URL.createObjectURL(
                                                                file
                                                            )
                                                        );
                                                        setNewProfilePicture(
                                                            true
                                                        );
                                                    }}
                                                    accept=".jpg,.jpeg,.png"
                                                    error={
                                                        errors.profile_picture
                                                    }
                                                />
                                                <p className="mt-1 text-xs text-gray-500">
                                                    Recommended size: 400x400px,
                                                    max 2MB
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <FormInput
                                        label="Gender"
                                        name="gender"
                                        value={data.gender}
                                        onChange={handleInputChange}
                                        error={errors.gender}
                                        as="select"
                                        icon={
                                            <ChevronDown className="h-4 w-4 text-gray-400" />
                                        }
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </FormInput>
                                </div>

                                <div>
                                    <FormInput
                                        label="Date of Birth"
                                        name="dob"
                                        type="date"
                                        value={data.dob}
                                        onChange={handleInputChange}
                                        error={errors.dob}
                                        max={
                                            new Date(
                                                new Date().setFullYear(
                                                    new Date().getFullYear() -
                                                        18
                                                )
                                            )
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        icon={
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                        }
                                    />

                                    <FormInput
                                        label="Phone Number"
                                        name="phone"
                                        type="tel"
                                        value={data.phone}
                                        onChange={handleInputChange}
                                        error={errors.phone}
                                        placeholder="+1 (123) 456-7890"
                                        icon={
                                            <Phone className="h-4 w-4 text-gray-400" />
                                        }
                                    />
                                </div>
                            </div>
                        </ProfileSection>

                        <ProfileSection title="Location Information">
                            <LocationDropdown
                                selectedCountry={data.country}
                                selectedState={data.state}
                                selectedCity={data.city}
                                onCountryChange={(value) => {
                                    setData("country", value);
                                    setData("state", "");
                                    setData("city", "");
                                }}
                                onStateChange={(value) => {
                                    setData("state", value);
                                    setData("city", "");
                                }}
                                onCityChange={(value) => {
                                    setData("city", value);
                                }}
                                isEditing={true}
                                errors={errors}
                            />

                            <FormInput
                                label="Postal Code"
                                name="postal"
                                value={data.postal}
                                onChange={handleInputChange}
                                error={errors.postal}
                                icon={
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                }
                            />
                        </ProfileSection>

                        <ProfileSection title="Social Media">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput
                                    label="Facebook"
                                    name="facebook"
                                    value={data.facebook}
                                    onChange={handleInputChange}
                                    error={errors.facebook}
                                    placeholder="facebook.com/username"
                                    icon={
                                        <Globe className="h-4 w-4 text-gray-400" />
                                    }
                                />

                                <FormInput
                                    label="Twitter"
                                    name="twitter"
                                    value={data.twitter}
                                    onChange={handleInputChange}
                                    error={errors.twitter}
                                    placeholder="twitter.com/username"
                                    icon={
                                        <Globe className="h-4 w-4 text-gray-400" />
                                    }
                                />

                                <FormInput
                                    label="Instagram"
                                    name="instagram"
                                    value={data.instagram}
                                    onChange={handleInputChange}
                                    error={errors.instagram}
                                    placeholder="instagram.com/username"
                                    icon={
                                        <Globe className="h-4 w-4 text-gray-400" />
                                    }
                                />

                                <FormInput
                                    label="LinkedIn"
                                    name="linkedin"
                                    value={data.linkedin}
                                    onChange={handleInputChange}
                                    error={errors.linkedin}
                                    placeholder="linkedin.com/in/username"
                                    icon={
                                        <Globe className="h-4 w-4 text-gray-400" />
                                    }
                                />
                            </div>
                        </ProfileSection>

                        <ProfileSection title="Education & Skills">
                            <div className="md:col-span-1">
                                <VolunteerSkillsDropdown
                                    label="Skills"
                                    multiple={true}
                                    onSkillsChange={(skills) =>
                                        setData("skills", skills)
                                    }
                                    initialSelectedSkills={data.skills || []}
                                    required={false}
                                />
                            </div>

                            {/* <FormMultiSelect
                                label="Skills"
                                name="skills"
                                options={[
                                    {
                                        value: "Communication",
                                        label: "Communication",
                                    },
                                    {
                                        value: "Leadership",
                                        label: "Leadership",
                                    },
                                    {
                                        value: "Teaching/Tutoring",
                                        label: "Teaching/Tutoring",
                                    },
                                    {
                                        value: "Event Planning",
                                        label: "Event Planning",
                                    },
                                    {
                                        value: "Fundraising",
                                        label: "Fundraising",
                                    },
                                    {
                                        value: "First Aid/CPR",
                                        label: "First Aid/CPR",
                                    },
                                    {
                                        value: "Social Media & Digital Marketing",
                                        label: "Social Media & Digital Marketing",
                                    },
                                    { value: "Languages", label: "Languages" },
                                    {
                                        value: "Technical/IT Skills",
                                        label: "Technical/IT Skills",
                                    },
                                    {
                                        value: "Driving/Transportation",
                                        label: "Driving/Transportation",
                                    },
                                    {
                                        value: "Mentoring & Coaching",
                                        label: "Mentoring & Coaching",
                                    },
                                    {
                                        value: "Administrative Skills",
                                        label: "Administrative Skills",
                                    },
                                ]}
                                selectedValues={data.skills || []}
                                onChange={(e) =>
                                    setData("skills", e.target.value)
                                }
                                error={errors.skills}
                            /> */}

                            <FormInput
                                label="Education Status"
                                name="education_status"
                                value={data.education_status}
                                onChange={handleInputChange}
                                error={errors.education_status}
                                placeholder="High School, College, University, other"
                            />

                            <FormMultiSelect
                                label="Hobbies & Interests"
                                name="hobbies"
                                options={[
                                    { value: "Reading", label: "Reading" },
                                    { value: "Sports", label: "Sports" },
                                    { value: "Music", label: "Music" },
                                    { value: "Travel", label: "Travel" },
                                    { value: "Cooking", label: "Cooking" },
                                    {
                                        value: "Photography",
                                        label: "Photography",
                                    },
                                    { value: "Gardening", label: "Gardening" },
                                    { value: "Painting", label: "Painting" },
                                    { value: "Hiking", label: "Hiking" },
                                    { value: "Dancing", label: "Dancing" },
                                ]}
                                selectedValues={data.hobbies || []}
                                onChange={(e) =>
                                    setData("hobbies", e.target.value)
                                }
                                error={errors.hobbies}
                            />
                        </ProfileSection>

                        <ProfileSection title="Next of Kin">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput
                                    label="Name of Next of Kin"
                                    name="nok"
                                    value={data.nok}
                                    onChange={handleInputChange}
                                    error={errors.nok}
                                    placeholder="John Doe"
                                />

                                <FormInput
                                    label="Next of Kin Phone"
                                    name="nok_phone"
                                    value={data.nok_phone}
                                    onChange={handleInputChange}
                                    error={errors.nok_phone}
                                    placeholder="+1 (123) 456-7890"
                                    icon={
                                        <Phone className="h-4 w-4 text-gray-400" />
                                    }
                                />

                                <FormInput
                                    label="Relationship with Next of Kin"
                                    name="nok_relation"
                                    value={data.nok_relation}
                                    onChange={handleInputChange}
                                    error={errors.nok_relation}
                                    placeholder="Sister, Brother, Spouse, Friend, Others"
                                />
                            </div>
                        </ProfileSection>

                        <div className="flex justify-end space-x-4 pt-6">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75"
                            >
                                {processing ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        {/* Profile Overview */}
                        <ProfileSection>
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Profile Picture Section */}
                                <div className="flex-shrink-0">
                                    {volunteer?.profile_picture ? (
                                        <div className="relative group">
                                            <img
                                                src={`/storage/${volunteer.profile_picture}`}
                                                alt="Profile"
                                                className="h-40 w-40 rounded-box object-cover border border-base-200 shadow-sm transition-transform duration-300 group-hover:scale-105"
                                            />
                                            {volunteerVerified && (
                                                <div className="absolute -top-2 -right-2">
                                                    <VerifiedBadge />
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="h-40 w-40 bg-base-200 rounded-box border-2 border-dashed border-base-300 flex flex-col items-center justify-center text-gray-400 hover:bg-base-300 transition-colors cursor-pointer">
                                            <Upload className="h-10 w-10" />
                                            <span className="text-xs mt-2">
                                                Upload Photo
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Profile Details Section */}
                                <div className="flex-1 space-y-4">
                                    {/* Name & Referral */}
                                    <div>
                                        <h2 className="text-2xl font-semibold">
                                            {auth.user.name}
                                        </h2>

                                        <div className="mt-3">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-sm font-medium text-gray-500">
                                                    Referral Code:
                                                </span>
                                                <div className="badge badge-outline font-mono">
                                                    {auth.user.referral_code}
                                                    <button
                                                        onClick={handleCopy}
                                                        className="ml-2"
                                                        aria-label="Copy referral code"
                                                    >
                                                        {copied ? (
                                                            <Check className="h-4 w-4 text-success" />
                                                        ) : (
                                                            <Copy className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>
                                                {copied && (
                                                    <span className="text-xs text-success">
                                                        Copied!
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Profile Information Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InfoItem
                                            icon={
                                                <Calendar className="h-5 w-5 text-gray-400" />
                                            }
                                            label="Date of Birth"
                                            value={
                                                volunteer?.dob &&
                                                new Date(
                                                    volunteer.dob
                                                ).toLocaleDateString()
                                            }
                                        />
                                        <InfoItem
                                            icon={
                                                <Phone className="h-5 w-5 text-gray-400" />
                                            }
                                            label="Phone"
                                            value={
                                                volunteer?.phone ||
                                                "Not provided"
                                            }
                                        />
                                        <InfoItem
                                            icon={
                                                <Mail className="h-5 w-5 text-gray-400" />
                                            }
                                            label="Email"
                                            value={auth.user.email}
                                        />
                                        <InfoItem
                                            icon={
                                                <MapPin className="h-5 w-5 text-gray-400" />
                                            }
                                            label="Location"
                                            value={
                                                [
                                                    volunteer?.city,
                                                    volunteer?.state,
                                                    volunteer?.country,
                                                ]
                                                    .filter(Boolean)
                                                    .join(", ") ||
                                                "Not specified"
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </ProfileSection>

                        {/* Hobbies & Skills */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {volunteer?.hobbies?.length > 0 && (
                                <ProfileSection title="Hobbies & Interests">
                                    <div className="flex flex-wrap gap-2">
                                        {volunteer.hobbies.map((hobby) => (
                                            <span
                                                key={hobby}
                                                className="badge badge-primary"
                                            >
                                                {hobby}
                                            </span>
                                        ))}
                                    </div>
                                </ProfileSection>
                            )}

                            {volunteer?.skills?.length > 0 && (
                                <ProfileSection title="Skills">
                                    <div className="flex flex-wrap gap-2">
                                        {volunteer.skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="badge badge-secondary"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </ProfileSection>
                            )}
                        </div>

                        {/* Social Media */}
                        {(volunteer?.facebook ||
                            volunteer?.twitter ||
                            volunteer?.instagram ||
                            volunteer?.linkedin) && (
                            <ProfileSection title="Social Media">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {volunteer?.facebook && (
                                        <a
                                            href={
                                                volunteer.facebook.startsWith(
                                                    "http"
                                                )
                                                    ? volunteer.facebook
                                                    : `https://${volunteer.facebook}`
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-colors"
                                        >
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                <svg
                                                    className="h-5 w-5 text-blue-600"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">
                                                    Facebook
                                                </p>
                                                <p className="text-sm text-gray-500 truncate">
                                                    {volunteer.facebook.replace(
                                                        /(^\w+:|^)\/\//,
                                                        ""
                                                    )}
                                                </p>
                                            </div>
                                        </a>
                                    )}

                                    {volunteer?.twitter && (
                                        <a
                                            href={
                                                volunteer.twitter.startsWith(
                                                    "http"
                                                )
                                                    ? volunteer.twitter
                                                    : `https://${volunteer.twitter}`
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-colors"
                                        >
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                <svg
                                                    className="h-5 w-5 text-blue-400"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">
                                                    Twitter
                                                </p>
                                                <p className="text-sm text-gray-500 truncate">
                                                    {volunteer.twitter.replace(
                                                        /(^\w+:|^)\/\//,
                                                        ""
                                                    )}
                                                </p>
                                            </div>
                                        </a>
                                    )}

                                    {volunteer?.instagram && (
                                        <a
                                            href={
                                                volunteer.instagram.startsWith(
                                                    "http"
                                                )
                                                    ? volunteer.instagram
                                                    : `https://${volunteer.instagram}`
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-pink-200 hover:bg-pink-50 transition-colors"
                                        >
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                                                <svg
                                                    className="h-5 w-5 text-pink-600"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">
                                                    Instagram
                                                </p>
                                                <p className="text-sm text-gray-500 truncate">
                                                    {volunteer.instagram.replace(
                                                        /(^\w+:|^)\/\//,
                                                        ""
                                                    )}
                                                </p>
                                            </div>
                                        </a>
                                    )}

                                    {volunteer?.linkedin && (
                                        <a
                                            href={
                                                volunteer.linkedin.startsWith(
                                                    "http"
                                                )
                                                    ? volunteer.linkedin
                                                    : `https://${volunteer.linkedin}`
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-colors"
                                        >
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                <svg
                                                    className="h-5 w-5 text-blue-700"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">
                                                    LinkedIn
                                                </p>
                                                <p className="text-sm text-gray-500 truncate">
                                                    {volunteer.linkedin.replace(
                                                        /(^\w+:|^)\/\//,
                                                        ""
                                                    )}
                                                </p>
                                            </div>
                                        </a>
                                    )}
                                </div>
                            </ProfileSection>
                        )}

                        {/* Next of Kin */}
                        {(volunteer?.nok ||
                            volunteer?.nok_phone ||
                            volunteer?.nok_relation) && (
                            <ProfileSection title="Next of Kin">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <InfoItem
                                        icon={
                                            <User className="h-5 w-5 text-gray-400" />
                                        }
                                        label="Name"
                                        value={volunteer.nok}
                                    />
                                    <InfoItem
                                        icon={
                                            <Phone className="h-5 w-5 text-gray-400" />
                                        }
                                        label="Phone"
                                        value={volunteer.nok_phone}
                                    />
                                    <InfoItem
                                        icon={
                                            <Users className="h-5 w-5 text-gray-400" />
                                        }
                                        label="Relationship"
                                        value={volunteer.nok_relation}
                                    />
                                </div>
                            </ProfileSection>
                        )}
                    </div>
                )}
            </div>
        </VolunteerLayout>
    );
}
