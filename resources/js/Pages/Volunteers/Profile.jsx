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
    Upload,
    Calendar,
    MapPin,
    Phone,
    Mail,
    Globe,
    User,
    Users,
    AlertCircle,
    Save,
    Camera,
    XCircle,
    Shield,
    Award,
    Briefcase,
    GraduationCap,
    Heart,
    Star,
    BookOpen,
    Zap,
    Music,
    Palette,
    Utensils,
    Code,
    Tag,
    BadgeCheck,
    Clock,
    TrendingUp,
    Building,
    Navigation,
    Flag,
    Compass,
    Coffee,
    Sun,
    Moon,
    Cloud,
    Thermometer,
    Sparkles,
    ThumbsUp,
    ThumbsDown,
    Smile,
    Meh,
    Crown,
    Trophy,
    ChevronRight,
    Filter,
    Search,
    ArrowLeft,
    ArrowRight,
    ChevronLeft,
    Plus,
    Minus,
    DollarSign,
    BarChart,
    LineChart,
    TrendingDown,
    CloudRain,
    Wind,
    Eye,
    EyeOff,
    Lock,
    Settings,
    HelpCircle,
    Info,
    ExternalLink,
    Share2,
    Download,
    Printer,
    Bell,
    QrCode,
    Key,
    LogOut,
    Gift,
    CreditCard,
    ShieldCheck,
    Activity,
    Percent,
    PieChart,
    Medal,
    Coffee as CoffeeIcon,
    Sunrise,
    Sunset,
    CloudSnow,
    Umbrella,
    Droplets,
    CloudDrizzle,
    CloudLightning,
    CloudFog,
    MoonStar,
    Heart as HeartIcon,
    Frown,
    Laugh,
    Angry,
    Eye as EyeIcon,
    EyeOff as EyeOffIcon,
} from "lucide-react";
import VerifiedBadge from "@/Components/VerifiedBadge";
import VolunteerSkillsDropdown from "@/Components/VolunteerSkillsDropdown";

// Enhanced reusable form components with mobile support
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
    required = false,
    disabled = false,
    ...props
}) => (
    <div className="form-control w-full">
        <label className="label">
            <span className="label-text">
                {label}
                {required && <span className="text-error ml-1">*</span>}
            </span>
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
                    disabled={disabled}
                    className={`select select-bordered w-full ${
                        icon ? "pl-10" : ""
                    } ${className} ${error ? "select-error" : ""}`}
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
                    disabled={disabled}
                    className={`input input-bordered w-full ${
                        icon ? "pl-10" : ""
                    } ${className} ${error ? "input-error" : ""}`}
                    {...props}
                />
            )}
        </div>
        {error && (
            <label className="label">
                <span className="label-text-alt text-error">{error}</span>
            </label>
        )}
    </div>
);

const FormTextarea = ({
    label,
    name,
    value,
    onChange,
    error,
    rows = 4,
    required = false,
    disabled = false,
    ...props
}) => (
    <div className="form-control w-full">
        <label className="label">
            <span className="label-text">
                {label}
                {required && <span className="text-error ml-1">*</span>}
            </span>
        </label>
        <textarea
            name={name}
            value={value || ""}
            onChange={onChange}
            rows={rows}
            disabled={disabled}
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

const FormFileInput = ({
    label,
    name,
    onChange,
    error,
    accept,
    multiple = false,
    required = false,
    disabled = false,
}) => (
    <div className="form-control w-full">
        <label className="label">
            <span className="label-text">
                {label}
                {required && <span className="text-error ml-1">*</span>}
            </span>
        </label>
        <div
            className={`relative border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-colors hover:border-primary ${
                error ? "border-error" : "border-base-300"
            }`}
        >
            <input
                id={name}
                type="file"
                name={name}
                onChange={onChange}
                accept={accept}
                multiple={multiple}
                disabled={disabled}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-2">
                <Upload className="w-8 h-8 mx-auto text-base-content/40" />
                <div>
                    <p className="text-sm font-medium">
                        <span className="text-primary">Upload a file</span> or
                        drag and drop
                    </p>
                    <p className="text-xs text-base-content/60 mt-1">
                        PNG, JPG up to 2MB
                    </p>
                </div>
            </div>
        </div>
        {error && (
            <label className="label">
                <span className="label-text-alt text-error">{error}</span>
            </label>
        )}
    </div>
);

const ImagePreview = ({ src, onRemove, alt = "Preview" }) => (
    <div className="relative group">
        <div className="avatar">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden ring-2 ring-base-300 ring-offset-2">
                <img
                    src={src}
                    alt={alt}
                    className="object-cover w-full h-full"
                />
            </div>
        </div>
        <button
            type="button"
            onClick={onRemove}
            className="absolute -top-2 -right-2 btn btn-circle btn-error btn-xs"
            title="Remove image"
        >
            <X className="h-3 w-3" />
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
    required = false,
    disabled = false,
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
        <div className="form-control w-full">
            <label className="label">
                <span className="label-text">
                    {label}
                    {required && <span className="text-error ml-1">*</span>}
                </span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {options.map((option) => (
                    <div key={option.value} className="form-control">
                        <label className="label cursor-pointer justify-start gap-2 p-2 hover:bg-base-200 rounded-lg">
                            <input
                                type="checkbox"
                                id={`${name}-${option.value}`}
                                name={name}
                                value={option.value}
                                checked={selectedValues.includes(option.value)}
                                onChange={handleCheckboxChange}
                                disabled={disabled}
                                className="checkbox checkbox-sm checkbox-primary"
                            />
                            <span className="label-text">{option.label}</span>
                        </label>
                    </div>
                ))}
            </div>
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error}</span>
                </label>
            )}
        </div>
    );
};

const ProfileSection = ({ title, children, className = "", icon }) => (
    <div
        className={`card bg-base-100 shadow-sm border border-base-300 ${className}`}
    >
        <div className="card-body p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
                {icon && <div className="text-primary">{icon}</div>}
                <h3 className="card-title text-lg sm:text-xl">{title}</h3>
            </div>
            {children}
        </div>
    </div>
);

const InfoItem = ({ icon, label, value, className = "", copyable = false }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (copyable && value) {
            navigator.clipboard.writeText(value).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        }
    };

    return (
        <div
            className={`flex items-start gap-3 p-3 hover:bg-base-100/50 rounded-lg transition-colors ${className}`}
        >
            <div className="flex-shrink-0 mt-0.5 text-base-content/60">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                {label && (
                    <p className="text-xs font-medium text-base-content/60 mb-1">
                        {label}
                    </p>
                )}
                <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-base-content font-medium truncate">
                        {value || "Not specified"}
                    </p>
                    {copyable && value && (
                        <button
                            onClick={handleCopy}
                            className="btn btn-ghost btn-xs"
                            title="Copy to clipboard"
                        >
                            {copied ? (
                                <Check className="w-3 h-3 text-success" />
                            ) : (
                                <Copy className="w-3 h-3" />
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const ProfileCard = ({ children, className = "" }) => (
    <div
        className={`card bg-gradient-to-br from-base-100 to-base-200 shadow-lg border border-base-300 ${className}`}
    >
        {children}
    </div>
);

export default function Profile({ volunteer, auth, verification }) {
    const [isEditing, setIsEditing] = useState(false);
    const [image, setImage] = useState(null);
    const [newProfilePicture, setNewProfilePicture] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showProfileIncomplete, setShowProfileIncomplete] = useState(false);
    const [activeTab, setActiveTab] = useState("personal");
    const [isMobile, setIsMobile] = useState(false);

    // Check screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

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
        setShowProfileIncomplete(false);
    };

    const handleVerifyClick = () => {
        if (!volunteer) {
            setShowProfileIncomplete(true);
            return;
        }

        router.visit(
            route("volunteer.verification", { volunteer: volunteer.id })
        );
    };

    const handleSaveSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (
                ![
                    "profile_picture",
                    "current_profile_picture",
                    "remove_profile_picture",
                ].includes(key)
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
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const volunteerVerified = verification?.status === "Approved";

    // Tab navigation for mobile
    const tabs = [
        {
            id: "personal",
            label: "Personal",
            icon: <User className="w-4 h-4" />,
        },
        {
            id: "location",
            label: "Location",
            icon: <MapPin className="w-4 h-4" />,
        },
        { id: "social", label: "Social", icon: <Globe className="w-4 h-4" /> },
        { id: "skills", label: "Skills", icon: <Award className="w-4 h-4" /> },
        {
            id: "contact",
            label: "Contact",
            icon: <Phone className="w-4 h-4" />,
        },
    ];

    // Hobby icons mapping - using available icons
    const hobbyIcons = [
        { value: "Reading", icon: <BookOpen className="w-4 h-4" /> },
        { value: "Sports", icon: <Zap className="w-4 h-4" /> },
        { value: "Music", icon: <Music className="w-4 h-4" /> },
        { value: "Travel", icon: <Compass className="w-4 h-4" /> },
        { value: "Cooking", icon: <Utensils className="w-4 h-4" /> },
        { value: "Photography", icon: <Camera className="w-4 h-4" /> },
        { value: "Gardening", icon: <Sun className="w-4 h-4" /> },
        { value: "Painting", icon: <Palette className="w-4 h-4" /> },
        { value: "Outdoor Activities", icon: <Compass className="w-4 h-4" /> }, // Replaced Hiking
        { value: "Technology", icon: <Code className="w-4 h-4" /> },
    ];

    return (
        <VolunteerLayout auth={auth}>
            <Head title="Volunteer Profile" />

            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                My Profile
                            </h1>
                            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                                Manage your volunteer profile and information
                            </p>
                        </div>

                        {!isEditing && (
                            <div className="flex flex-wrap gap-2">
                                {!volunteerVerified && (
                                    <button
                                        onClick={handleVerifyClick}
                                        disabled={
                                            verification?.status === "Pending"
                                        }
                                        className={`btn gap-2 ${
                                            verification?.status === "Pending"
                                                ? "btn-disabled"
                                                : "btn-outline btn-primary"
                                        }`}
                                    >
                                        <Shield className="w-4 h-4" />
                                        {verification?.status === "Pending"
                                            ? "Submitted"
                                            : "Verify"}
                                    </button>
                                )}
                                <button
                                    onClick={handleEditClick}
                                    className="btn btn-primary gap-2"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit Profile
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Tab Navigation */}
                    {isMobile && !isEditing && (
                        <div className="tabs tabs-boxed bg-base-200 p-1 mb-6">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`tab flex-1 ${
                                        activeTab === tab.id ? "tab-active" : ""
                                    }`}
                                >
                                    {tab.icon}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Notifications */}
                {showProfileIncomplete && (
                    <div className="alert alert-warning mb-4 sm:mb-6">
                        <AlertCircle className="w-5 h-5" />
                        <span>
                            Please complete your profile before verifying your
                            account
                        </span>
                        <button
                            onClick={() => setShowProfileIncomplete(false)}
                            className="btn btn-ghost btn-sm"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {showSuccess && (
                    <div className="alert alert-success mb-4 sm:mb-6 animate-fade-in">
                        <CheckCircle className="w-5 h-5" />
                        <span>Profile updated successfully!</span>
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="btn btn-ghost btn-sm"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {Object.keys(errors).length > 0 && (
                    <div className="alert alert-error mb-4 sm:mb-6">
                        <XCircle className="w-5 h-5" />
                        <div>
                            <h3 className="font-medium">Submission Errors</h3>
                            <ul className="text-sm list-disc list-inside">
                                {Object.values(errors).map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {isEditing ? (
                    <form
                        onSubmit={handleSaveSubmit}
                        className="space-y-6 sm:space-y-8"
                    >
                        {/* Profile Picture Section */}
                        <ProfileCard>
                            <div className="card-body">
                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <div className="flex-shrink-0">
                                        {image ? (
                                            <ImagePreview
                                                src={image}
                                                onRemove={() => {
                                                    setImage(null);
                                                    setNewProfilePicture(false);
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
                                            <div className="avatar placeholder">
                                                <div className="w-32 h-32 sm:w-40 sm:h-40 bg-base-300 rounded-xl border-2 border-dashed border-base-400 flex flex-col items-center justify-center">
                                                    <Camera className="w-12 h-12 text-base-content/40" />
                                                    <span className="text-sm text-base-content/60 mt-2">
                                                        Upload Photo
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 w-full">
                                        <FormFileInput
                                            label="Profile Picture"
                                            name="profile_picture"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
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
                                                const maxSize = 2 * 1024 * 1024;
                                                if (file.size > maxSize) {
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
                                                    URL.createObjectURL(file)
                                                );
                                                setNewProfilePicture(true);
                                            }}
                                            accept=".jpg,.jpeg,.png"
                                            error={errors.profile_picture}
                                        />
                                    </div>
                                </div>
                            </div>
                        </ProfileCard>

                        {/* Personal Information */}
                        <ProfileSection
                            title="Personal Information"
                            icon={<User className="w-5 h-5" />}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <FormInput
                                    label="Gender"
                                    name="gender"
                                    value={data.gender}
                                    onChange={handleInputChange}
                                    error={errors.gender}
                                    as="select"
                                    icon={<User className="w-4 h-4" />}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </FormInput>

                                <FormInput
                                    label="Date of Birth"
                                    name="dob"
                                    type="date"
                                    value={data.dob}
                                    onChange={handleInputChange}
                                    error={errors.dob}
                                    icon={<Calendar className="w-4 h-4" />}
                                />

                                <FormInput
                                    label="Phone Number"
                                    name="phone"
                                    type="tel"
                                    value={data.phone}
                                    onChange={handleInputChange}
                                    error={errors.phone}
                                    placeholder="+1 (123) 456-7890"
                                    icon={<Phone className="w-4 h-4" />}
                                />

                                <FormInput
                                    label="Education Status"
                                    name="education_status"
                                    value={data.education_status}
                                    onChange={handleInputChange}
                                    error={errors.education_status}
                                    placeholder="e.g., University Student"
                                    icon={<GraduationCap className="w-4 h-4" />}
                                />
                            </div>
                        </ProfileSection>

                        {/* Location Information */}
                        <ProfileSection
                            title="Location Information"
                            icon={<MapPin className="w-5 h-5" />}
                        >
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
                                className="space-y-4"
                            />

                            <div className="mt-4">
                                <FormInput
                                    label="Postal Code"
                                    name="postal"
                                    value={data.postal}
                                    onChange={handleInputChange}
                                    error={errors.postal}
                                    icon={<Tag className="w-4 h-4" />}
                                />
                            </div>
                        </ProfileSection>

                        {/* Social Media */}
                        <ProfileSection
                            title="Social Media"
                            icon={<Globe className="w-5 h-5" />}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <FormInput
                                    label="Facebook"
                                    name="facebook"
                                    value={data.facebook}
                                    onChange={handleInputChange}
                                    error={errors.facebook}
                                    placeholder="facebook.com/username"
                                    icon={<Globe className="w-4 h-4" />}
                                />

                                <FormInput
                                    label="Twitter"
                                    name="twitter"
                                    value={data.twitter}
                                    onChange={handleInputChange}
                                    error={errors.twitter}
                                    placeholder="twitter.com/username"
                                    icon={<Globe className="w-4 h-4" />}
                                />

                                <FormInput
                                    label="Instagram"
                                    name="instagram"
                                    value={data.instagram}
                                    onChange={handleInputChange}
                                    error={errors.instagram}
                                    placeholder="instagram.com/username"
                                    icon={<Globe className="w-4 h-4" />}
                                />

                                <FormInput
                                    label="LinkedIn"
                                    name="linkedin"
                                    value={data.linkedin}
                                    onChange={handleInputChange}
                                    error={errors.linkedin}
                                    placeholder="linkedin.com/in/username"
                                    icon={<Globe className="w-4 h-4" />}
                                />
                            </div>
                        </ProfileSection>

                        {/* Education & Skills */}
                        <ProfileSection
                            title="Education & Skills"
                            icon={<Briefcase className="w-5 h-5" />}
                        >
                            <div className="space-y-6">
                                <div>
                                    <VolunteerSkillsDropdown
                                        label="Skills"
                                        multiple={true}
                                        onSkillsChange={(skills) =>
                                            setData("skills", skills)
                                        }
                                        initialSelectedSkills={
                                            data.skills || []
                                        }
                                        required={false}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="label">
                                        <span className="label-text">
                                            Hobbies & Interests
                                        </span>
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                        {hobbyIcons.map((hobby) => (
                                            <label
                                                key={hobby.value}
                                                className="label cursor-pointer justify-start gap-2 p-2 hover:bg-base-200 rounded-lg"
                                            >
                                                <input
                                                    type="checkbox"
                                                    value={hobby.value}
                                                    checked={data.hobbies?.includes(
                                                        hobby.value
                                                    )}
                                                    onChange={(e) => {
                                                        const newHobbies = e
                                                            .target.checked
                                                            ? [
                                                                  ...(data.hobbies ||
                                                                      []),
                                                                  hobby.value,
                                                              ]
                                                            : (
                                                                  data.hobbies ||
                                                                  []
                                                              ).filter(
                                                                  (h) =>
                                                                      h !==
                                                                      hobby.value
                                                              );
                                                        setData(
                                                            "hobbies",
                                                            newHobbies
                                                        );
                                                    }}
                                                    className="checkbox checkbox-sm checkbox-primary"
                                                />
                                                <span className="label-text flex items-center gap-2">
                                                    {hobby.icon}
                                                    {hobby.value}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </ProfileSection>

                        {/* Next of Kin */}
                        <ProfileSection
                            title="Next of Kin"
                            icon={<Users className="w-5 h-5" />}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <FormInput
                                    label="Name"
                                    name="nok"
                                    value={data.nok}
                                    onChange={handleInputChange}
                                    error={errors.nok}
                                    placeholder="John Doe"
                                    icon={<User className="w-4 h-4" />}
                                />

                                <FormInput
                                    label="Phone Number"
                                    name="nok_phone"
                                    value={data.nok_phone}
                                    onChange={handleInputChange}
                                    error={errors.nok_phone}
                                    placeholder="+1 (123) 456-7890"
                                    icon={<Phone className="w-4 h-4" />}
                                />

                                <FormInput
                                    label="Relationship"
                                    name="nok_relation"
                                    value={data.nok_relation}
                                    onChange={handleInputChange}
                                    error={errors.nok_relation}
                                    placeholder="e.g., Sister, Brother, Spouse"
                                    icon={<Users className="w-4 h-4" />}
                                />
                            </div>
                        </ProfileSection>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="btn btn-outline btn-lg"
                                disabled={processing}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn btn-primary btn-lg gap-2"
                            >
                                {processing ? (
                                    <>
                                        <span className="loading loading-spinner"></span>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                        {/* Left Column - Profile Overview */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Profile Card */}
                            <ProfileCard>
                                <div className="card-body items-center text-center p-6">
                                    <div className="avatar mb-4 relative">
                                        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                            {volunteer?.profile_picture ? (
                                                <img
                                                    src={`/storage/${volunteer.profile_picture}`}
                                                    alt="Profile"
                                                    className="rounded-full object-cover w-full h-full"
                                                />
                                            ) : (
                                                <div className="bg-base-300 rounded-full w-full h-full flex items-center justify-center">
                                                    <User className="w-16 h-16 text-base-content/40" />
                                                </div>
                                            )}
                                            {volunteerVerified && (
                                                <div className="absolute bottom-0 right-0">
                                                    <VerifiedBadge size="lg" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <h2 className="card-title text-xl sm:text-2xl mb-2">
                                        {auth.user.name}
                                    </h2>

                                    <div className="badge badge-primary badge-lg mb-4">
                                        <User className="w-4 h-4 mr-2" />
                                        Volunteer
                                    </div>

                                    {/* Referral Code */}
                                    <div className="w-full">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">
                                                    Referral Code
                                                </span>
                                            </label>
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    value={
                                                        auth.user.referral_code
                                                    }
                                                    readOnly
                                                    className="input input-bordered flex-1 font-mono"
                                                />
                                                <button
                                                    onClick={handleCopy}
                                                    className="btn btn-primary"
                                                >
                                                    {copied ? (
                                                        <Check className="w-4 h-4" />
                                                    ) : (
                                                        <Copy className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                            {copied && (
                                                <label className="label">
                                                    <span className="label-text-alt text-success">
                                                        Copied to clipboard!
                                                    </span>
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </ProfileCard>

                            {/* Contact Info Card */}
                            <ProfileSection
                                title="Contact Information"
                                icon={<Mail className="w-5 h-5" />}
                            >
                                <div className="space-y-2">
                                    <InfoItem
                                        icon={<Mail className="w-4 h-4" />}
                                        label="Email"
                                        value={auth.user.email}
                                        copyable
                                    />
                                    <InfoItem
                                        icon={<Phone className="w-4 h-4" />}
                                        label="Phone"
                                        value={volunteer?.phone}
                                        copyable
                                    />
                                    <InfoItem
                                        icon={<MapPin className="w-4 h-4" />}
                                        label="Location"
                                        value={[
                                            volunteer?.city,
                                            volunteer?.state,
                                            volunteer?.country,
                                        ]
                                            .filter(Boolean)
                                            .join(", ")}
                                    />
                                </div>
                            </ProfileSection>

                            {/* Verification Status */}
                            <ProfileSection
                                title="Verification Status"
                                icon={<Shield className="w-5 h-5" />}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`p-2 rounded-full ${
                                                volunteerVerified
                                                    ? "bg-success/20"
                                                    : verification?.status ===
                                                      "Pending"
                                                    ? "bg-warning/20"
                                                    : "bg-error/20"
                                            }`}
                                        >
                                            {volunteerVerified ? (
                                                <CheckCircle className="w-5 h-5 text-success" />
                                            ) : verification?.status ===
                                              "Pending" ? (
                                                <Clock className="w-5 h-5 text-warning" />
                                            ) : (
                                                <AlertCircle className="w-5 h-5 text-error" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {volunteerVerified
                                                    ? "Verified"
                                                    : verification?.status ===
                                                      "Pending"
                                                    ? "Pending Review"
                                                    : "Not Verified"}
                                            </p>
                                            <p className="text-sm text-base-content/60">
                                                Account Verification
                                            </p>
                                        </div>
                                    </div>
                                    {!volunteerVerified &&
                                        verification?.status !== "Pending" && (
                                            <button
                                                onClick={handleVerifyClick}
                                                className="btn btn-outline btn-sm"
                                            >
                                                Verify
                                            </button>
                                        )}
                                </div>
                            </ProfileSection>
                        </div>

                        {/* Right Column - Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Personal Information */}
                            {(isMobile && activeTab === "personal") ||
                            !isMobile ? (
                                <ProfileSection
                                    title="Personal Information"
                                    icon={<User className="w-5 h-5" />}
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InfoItem
                                            icon={
                                                <Calendar className="w-4 h-4" />
                                            }
                                            label="Date of Birth"
                                            value={
                                                volunteer?.dob
                                                    ? new Date(
                                                          volunteer.dob
                                                      ).toLocaleDateString()
                                                    : "Not specified"
                                            }
                                        />
                                        <InfoItem
                                            icon={<User className="w-4 h-4" />}
                                            label="Gender"
                                            value={volunteer?.gender}
                                        />
                                        <InfoItem
                                            icon={
                                                <GraduationCap className="w-4 h-4" />
                                            }
                                            label="Education Status"
                                            value={volunteer?.education_status}
                                        />
                                    </div>
                                </ProfileSection>
                            ) : null}

                            {/* Location Information */}
                            {(isMobile && activeTab === "location") ||
                            !isMobile ? (
                                <ProfileSection
                                    title="Location Information"
                                    icon={<MapPin className="w-5 h-5" />}
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InfoItem
                                            icon={
                                                <MapPin className="w-4 h-4" />
                                            }
                                            label="City"
                                            value={volunteer?.city}
                                        />
                                        <InfoItem
                                            icon={
                                                <Compass className="w-4 h-4" />
                                            }
                                            label="State/Region"
                                            value={volunteer?.state}
                                        />
                                        <InfoItem
                                            icon={<Flag className="w-4 h-4" />}
                                            label="Country"
                                            value={volunteer?.country}
                                        />
                                        <InfoItem
                                            icon={<Tag className="w-4 h-4" />}
                                            label="Postal Code"
                                            value={volunteer?.postal}
                                        />
                                    </div>
                                </ProfileSection>
                            ) : null}

                            {/* Skills & Hobbies */}
                            {(isMobile && activeTab === "skills") ||
                            !isMobile ? (
                                <>
                                    {volunteer?.skills?.length > 0 && (
                                        <ProfileSection
                                            title="Skills"
                                            icon={<Award className="w-5 h-5" />}
                                        >
                                            <div className="flex flex-wrap gap-2">
                                                {volunteer.skills.map(
                                                    (skill, index) => (
                                                        <div
                                                            key={index}
                                                            className="badge badge-primary badge-lg gap-2"
                                                        >
                                                            <Star className="w-3 h-3" />
                                                            {skill}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </ProfileSection>
                                    )}

                                    {volunteer?.hobbies?.length > 0 && (
                                        <ProfileSection
                                            title="Hobbies & Interests"
                                            icon={<Heart className="w-5 h-5" />}
                                        >
                                            <div className="flex flex-wrap gap-2">
                                                {volunteer.hobbies.map(
                                                    (hobby, index) => (
                                                        <div
                                                            key={index}
                                                            className="badge badge-outline badge-lg"
                                                        >
                                                            {hobby}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </ProfileSection>
                                    )}
                                </>
                            ) : null}

                            {/* Social Media */}
                            {(isMobile && activeTab === "social") ||
                            (!isMobile &&
                                (volunteer?.facebook ||
                                    volunteer?.twitter ||
                                    volunteer?.instagram ||
                                    volunteer?.linkedin)) ? (
                                <ProfileSection
                                    title="Social Media"
                                    icon={<Globe className="w-5 h-5" />}
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                                className="btn btn-outline justify-start gap-3"
                                            >
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <svg
                                                        className="w-4 h-4 text-blue-600"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                                    </svg>
                                                </div>
                                                <span className="truncate">
                                                    Facebook
                                                </span>
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
                                                className="btn btn-outline justify-start gap-3"
                                            >
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <svg
                                                        className="w-4 h-4 text-blue-400"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                                    </svg>
                                                </div>
                                                <span className="truncate">
                                                    Twitter
                                                </span>
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
                                                className="btn btn-outline justify-start gap-3"
                                            >
                                                <div className="p-2 bg-pink-100 rounded-lg">
                                                    <svg
                                                        className="w-4 h-4 text-pink-600"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                                    </svg>
                                                </div>
                                                <span className="truncate">
                                                    Instagram
                                                </span>
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
                                                className="btn btn-outline justify-start gap-3"
                                            >
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <svg
                                                        className="w-4 h-4 text-blue-700"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                                    </svg>
                                                </div>
                                                <span className="truncate">
                                                    LinkedIn
                                                </span>
                                            </a>
                                        )}
                                    </div>
                                </ProfileSection>
                            ) : null}

                            {/* Next of Kin */}
                            {(isMobile && activeTab === "contact") ||
                            (!isMobile &&
                                (volunteer?.nok ||
                                    volunteer?.nok_phone ||
                                    volunteer?.nok_relation)) ? (
                                <ProfileSection
                                    title="Next of Kin"
                                    icon={<Users className="w-5 h-5" />}
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <InfoItem
                                            icon={<User className="w-4 h-4" />}
                                            label="Name"
                                            value={volunteer?.nok}
                                        />
                                        <InfoItem
                                            icon={<Phone className="w-4 h-4" />}
                                            label="Phone"
                                            value={volunteer?.nok_phone}
                                            copyable
                                        />
                                        <InfoItem
                                            icon={<Users className="w-4 h-4" />}
                                            label="Relationship"
                                            value={volunteer?.nok_relation}
                                        />
                                    </div>
                                </ProfileSection>
                            ) : null}
                        </div>
                    </div>
                )}
            </div>
        </VolunteerLayout>
    );
}
