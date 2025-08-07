import OrganizationLayout from "@/Layouts/OrganizationLayout";
import { useState } from "react";
import { usePage, useForm, Head, router } from "@inertiajs/react";
import LocationDropdown from "@/Components/LocationDropdown";

export default function Profile({ organization, auth }) {
    const { verification } = usePage().props;

    const [org, setOrg] = useState(organization ?? {});
    const [isEditing, setIsEditing] = useState(false);
    const [image, setImage] = useState(null);
    const [newLogo, setNewLogo] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
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
        email: auth.user.email,
        description: org.description || "",
        mission_statement: org.mission_statement || "",
        vision_statement: org.vision_statement || "",
        values: org.values || "",
        address: org.address || "",
        postal: org.postal || "",
        logo: org.logo,
    });

    const MAX_MISSION_VISION_VALUES = 200;
    const MAX_DESCRIPTION = 1000;

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

        // Add all form data to FormData object
        Object.keys(data).forEach((key) => {
            if (key !== "logo" || newLogo) {
                // Only include logo if it's new
                formData.append(key, data[key]);
            }
        });

        // If no new logo, make sure we keep the existing one
        if (!newLogo && org.logo) {
            formData.append("current_logo", org.logo);
        }

        post(route("organization.profile.update"), {
            data: formData,
            preserveScroll: true,
            onSuccess: () => {
                setIsEditing(false);
                setImage(null);
                setNewLogo(false);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 5000);
            },
        });
    };

    const showError = (field) =>
        errors[field] ? (
            <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
        ) : null;

    const FieldWrapper = ({
        label,
        children,
        className = "",
        required = false,
    }) => (
        <div className={`space-y-1 ${className}`}>
            <label className="block text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {children}
        </div>
    );

    const SocialLink = ({ href, children }) => {
        if (!href) return <p className="text-gray-500 italic">Not provided</p>;

        return (
            <a
                href={href.startsWith("http") ? href : `https://${href}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors inline-flex items-center"
            >
                {children}
                <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                </svg>
            </a>
        );
    };

    const SectionHeader = ({ children }) => (
        <div className="md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-6">
                {children}
            </h2>
        </div>
    );

    return (
        <OrganizationLayout>
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
                                <button
                                    onClick={handleVerifyClick}
                                    disabled={verification}
                                    className={`inline-flex items-center px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all ${
                                        verification
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
                                    {verification
                                        ? "Verification Submitted"
                                        : "Verify Account"}
                                </button>
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

                    {/* Profile form */}
                    <form onSubmit={handleSaveSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <SectionHeader>Basic Information</SectionHeader>

                            <FieldWrapper label="Organization Name" required>
                                {isEditing ? (
                                    <>
                                        <input
                                            type="text"
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
                                            className={`block w-full rounded-lg shadow-sm border ${
                                                errors.name
                                                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                            } sm:text-sm p-3`}
                                            placeholder="Enter organization name"
                                        />
                                        {showError("name")}
                                    </>
                                ) : (
                                    <p className="text-gray-900 text-lg font-medium">
                                        {org.name}
                                    </p>
                                )}
                            </FieldWrapper>

                            <FieldWrapper label="Profile URL">
                                {isEditing ? (
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                            {window.location.host}/
                                        </div>
                                        <input
                                            type="text"
                                            name="slug"
                                            value={data.slug}
                                            readOnly
                                            className={`block w-full rounded-lg shadow-sm border pl-32 ${
                                                errors.slug
                                                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                            } sm:text-sm p-3 bg-gray-50`}
                                        />
                                        {showError("slug")}
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <a
                                            href={`${window.location.origin}/${org.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors inline-flex items-center"
                                        >
                                            {window.location.host}/{org.slug}
                                            <svg
                                                className="w-4 h-4 ml-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
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
                                )}
                            </FieldWrapper>

                            <div className="md:col-span-2">
                                <FieldWrapper label="Location" required>
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
                                </FieldWrapper>
                            </div>

                            <FieldWrapper label="Founded Year">
                                {isEditing ? (
                                    <>
                                        <input
                                            type="number"
                                            name="foundedYear"
                                            value={data.foundedYear}
                                            onChange={(e) =>
                                                setData(
                                                    "foundedYear",
                                                    e.target.value
                                                )
                                            }
                                            min="1900"
                                            max={new Date().getFullYear()}
                                            className={`block w-full rounded-lg shadow-sm border ${
                                                errors.foundedYear
                                                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                            } sm:text-sm p-3`}
                                            placeholder="YYYY"
                                        />
                                        {showError("foundedYear")}
                                    </>
                                ) : (
                                    <p className="text-gray-900">
                                        {org.foundedYear || "Not specified"}
                                    </p>
                                )}
                            </FieldWrapper>

                            <FieldWrapper label="Phone">
                                {isEditing ? (
                                    <>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData("phone", e.target.value)
                                            }
                                            className={`block w-full rounded-lg shadow-sm border ${
                                                errors.phone
                                                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                            } sm:text-sm p-3`}
                                            placeholder="+1 (123) 456-7890"
                                        />
                                        {showError("phone")}
                                    </>
                                ) : (
                                    <p className="text-gray-900">
                                        {org.phone || "Not provided"}
                                    </p>
                                )}
                            </FieldWrapper>

                            <FieldWrapper label="Email">
                                <p className="text-gray-900 flex items-center">
                                    {auth.user.email}
                                    {auth.user.email_verified_at ? (
                                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Verified
                                        </span>
                                    ) : (
                                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            Unverified
                                        </span>
                                    )}
                                </p>
                            </FieldWrapper>

                            <FieldWrapper label="Address">
                                {isEditing ? (
                                    <>
                                        <input
                                            type="text"
                                            name="address"
                                            value={data.address}
                                            onChange={(e) =>
                                                setData(
                                                    "address",
                                                    e.target.value
                                                )
                                            }
                                            className={`block w-full rounded-lg shadow-sm border ${
                                                errors.address
                                                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                            } sm:text-sm p-3`}
                                            placeholder="Street address"
                                        />
                                        {showError("address")}
                                    </>
                                ) : (
                                    <p className="text-gray-900">
                                        {org.address || "Not provided"}
                                    </p>
                                )}
                            </FieldWrapper>

                            <FieldWrapper label="Postal Code">
                                {isEditing ? (
                                    <>
                                        <input
                                            type="text"
                                            name="postal"
                                            value={data.postal}
                                            onChange={(e) =>
                                                setData(
                                                    "postal",
                                                    e.target.value
                                                )
                                            }
                                            className={`block w-full rounded-lg shadow-sm border ${
                                                errors.postal
                                                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                            } sm:text-sm p-3`}
                                            placeholder="Postal or ZIP code"
                                        />
                                        {showError("postal")}
                                    </>
                                ) : (
                                    <p className="text-gray-900">
                                        {org.postal || "Not provided"}
                                    </p>
                                )}
                            </FieldWrapper>

                            <SectionHeader>Contact Information</SectionHeader>

                            <FieldWrapper label="Website">
                                {isEditing ? (
                                    <>
                                        <div className="relative rounded-lg shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">
                                                    https://
                                                </span>
                                            </div>
                                            <input
                                                type="text"
                                                name="website"
                                                value={data.website
                                                    ?.replace("https://", "")
                                                    .replace("http://", "")}
                                                onChange={(e) =>
                                                    setData(
                                                        "website",
                                                        e.target.value
                                                    )
                                                }
                                                className={`block w-full rounded-lg border pl-16 ${
                                                    errors.website
                                                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                                } sm:text-sm p-3`}
                                                placeholder="yourdomain.com"
                                            />
                                        </div>
                                        {showError("website")}
                                    </>
                                ) : (
                                    <SocialLink href={org.website}>
                                        {org.website || "Not provided"}
                                    </SocialLink>
                                )}
                            </FieldWrapper>

                            <FieldWrapper label="Facebook">
                                {isEditing ? (
                                    <div className="relative rounded-lg shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">
                                                facebook.com/
                                            </span>
                                        </div>
                                        <input
                                            type="text"
                                            name="facebook"
                                            value={data.facebook?.replace(
                                                "facebook.com/",
                                                ""
                                            )}
                                            onChange={(e) =>
                                                setData(
                                                    "facebook",
                                                    e.target.value
                                                )
                                            }
                                            className="block w-full rounded-lg border pl-28 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3"
                                            placeholder="username"
                                        />
                                    </div>
                                ) : (
                                    <SocialLink href={org.facebook}>
                                        {org.facebook || "Not provided"}
                                    </SocialLink>
                                )}
                            </FieldWrapper>

                            <FieldWrapper label="Twitter">
                                {isEditing ? (
                                    <div className="relative rounded-lg shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">
                                                twitter.com/
                                            </span>
                                        </div>
                                        <input
                                            type="text"
                                            name="twitter"
                                            value={data.twitter?.replace(
                                                "twitter.com/",
                                                ""
                                            )}
                                            onChange={(e) =>
                                                setData(
                                                    "twitter",
                                                    e.target.value
                                                )
                                            }
                                            className="block w-full rounded-lg border pl-24 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3"
                                            placeholder="username"
                                        />
                                    </div>
                                ) : (
                                    <SocialLink href={org.twitter}>
                                        {org.twitter || "Not provided"}
                                    </SocialLink>
                                )}
                            </FieldWrapper>

                            <FieldWrapper label="Instagram">
                                {isEditing ? (
                                    <div className="relative rounded-lg shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">
                                                instagram.com/
                                            </span>
                                        </div>
                                        <input
                                            type="text"
                                            name="instagram"
                                            value={data.instagram?.replace(
                                                "instagram.com/",
                                                ""
                                            )}
                                            onChange={(e) =>
                                                setData(
                                                    "instagram",
                                                    e.target.value
                                                )
                                            }
                                            className="block w-full rounded-lg border pl-28 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3"
                                            placeholder="username"
                                        />
                                    </div>
                                ) : (
                                    <SocialLink href={org.instagram}>
                                        {org.instagram || "Not provided"}
                                    </SocialLink>
                                )}
                            </FieldWrapper>

                            <FieldWrapper label="LinkedIn">
                                {isEditing ? (
                                    <div className="relative rounded-lg shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">
                                                linkedin.com/
                                            </span>
                                        </div>
                                        <input
                                            type="text"
                                            name="linkedin"
                                            value={data.linkedin?.replace(
                                                "linkedin.com/",
                                                ""
                                            )}
                                            onChange={(e) =>
                                                setData(
                                                    "linkedin",
                                                    e.target.value
                                                )
                                            }
                                            className="block w-full rounded-lg border pl-26 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3"
                                            placeholder="company/username"
                                        />
                                    </div>
                                ) : (
                                    <SocialLink href={org.linkedin}>
                                        {org.linkedin || "Not provided"}
                                    </SocialLink>
                                )}
                            </FieldWrapper>

                            <FieldWrapper label="YouTube">
                                {isEditing ? (
                                    <div className="relative rounded-lg shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">
                                                youtube.com/
                                            </span>
                                        </div>
                                        <input
                                            type="text"
                                            name="youtube"
                                            value={data.youtube?.replace(
                                                "youtube.com/",
                                                ""
                                            )}
                                            onChange={(e) =>
                                                setData(
                                                    "youtube",
                                                    e.target.value
                                                )
                                            }
                                            className="block w-full rounded-lg border pl-24 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3"
                                            placeholder="channel"
                                        />
                                    </div>
                                ) : (
                                    <SocialLink href={org.youtube}>
                                        {org.youtube || "Not provided"}
                                    </SocialLink>
                                )}
                            </FieldWrapper>

                            <SectionHeader>
                                About the Organization
                            </SectionHeader>

                            <div className="md:col-span-2">
                                <FieldWrapper label="Description">
                                    {isEditing ? (
                                        <>
                                            <div className="relative">
                                                <textarea
                                                    name="description"
                                                    value={data.description}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            e,
                                                            MAX_DESCRIPTION
                                                        )
                                                    }
                                                    maxLength={MAX_DESCRIPTION}
                                                    rows={5}
                                                    className={`block w-full rounded-lg shadow-sm border ${
                                                        errors.description
                                                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                                            : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                                    } sm:text-sm p-3`}
                                                    placeholder="Tell us about your organization..."
                                                />
                                                <div className="absolute bottom-3 right-3 text-xs text-gray-500 bg-white px-2 py-1 rounded-full shadow-sm">
                                                    {data.description.length}/
                                                    {MAX_DESCRIPTION}
                                                </div>
                                            </div>
                                            {showError("description")}
                                        </>
                                    ) : (
                                        <p className="text-gray-900 whitespace-pre-line">
                                            {org.description ||
                                                "No description provided"}
                                        </p>
                                    )}
                                </FieldWrapper>
                            </div>

                            <div className="md:col-span-2">
                                <FieldWrapper label="Mission Statement">
                                    {isEditing ? (
                                        <>
                                            <div className="relative">
                                                <textarea
                                                    name="mission_statement"
                                                    value={
                                                        data.mission_statement
                                                    }
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            e,
                                                            MAX_MISSION_VISION_VALUES
                                                        )
                                                    }
                                                    maxLength={
                                                        MAX_MISSION_VISION_VALUES
                                                    }
                                                    rows={3}
                                                    className={`block w-full rounded-lg shadow-sm border ${
                                                        errors.mission_statement
                                                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                                            : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                                    } sm:text-sm p-3`}
                                                    placeholder="What is your organization's mission?"
                                                />
                                                <div className="absolute bottom-3 right-3 text-xs text-gray-500 bg-white px-2 py-1 rounded-full shadow-sm">
                                                    {
                                                        data.mission_statement
                                                            .length
                                                    }
                                                    /{MAX_MISSION_VISION_VALUES}
                                                </div>
                                            </div>
                                            {showError("mission_statement")}
                                        </>
                                    ) : (
                                        <p className="text-gray-900 whitespace-pre-line">
                                            {org.mission_statement ||
                                                "No mission statement provided"}
                                        </p>
                                    )}
                                </FieldWrapper>
                            </div>

                            <div className="md:col-span-2">
                                <FieldWrapper label="Vision Statement">
                                    {isEditing ? (
                                        <>
                                            <div className="relative">
                                                <textarea
                                                    name="vision_statement"
                                                    value={
                                                        data.vision_statement
                                                    }
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            e,
                                                            MAX_MISSION_VISION_VALUES
                                                        )
                                                    }
                                                    maxLength={
                                                        MAX_MISSION_VISION_VALUES
                                                    }
                                                    rows={3}
                                                    className={`block w-full rounded-lg shadow-sm border ${
                                                        errors.vision_statement
                                                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                                            : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                                    } sm:text-sm p-3`}
                                                    placeholder="What is your organization's vision for the future?"
                                                />
                                                <div className="absolute bottom-3 right-3 text-xs text-gray-500 bg-white px-2 py-1 rounded-full shadow-sm">
                                                    {
                                                        data.vision_statement
                                                            .length
                                                    }
                                                    /{MAX_MISSION_VISION_VALUES}
                                                </div>
                                            </div>
                                            {showError("vision_statement")}
                                        </>
                                    ) : (
                                        <p className="text-gray-900 whitespace-pre-line">
                                            {org.vision_statement ||
                                                "No vision statement provided"}
                                        </p>
                                    )}
                                </FieldWrapper>
                            </div>

                            <div className="md:col-span-2">
                                <FieldWrapper label="Core Values">
                                    {isEditing ? (
                                        <>
                                            <div className="relative">
                                                <textarea
                                                    name="values"
                                                    value={data.values}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            e,
                                                            MAX_MISSION_VISION_VALUES
                                                        )
                                                    }
                                                    maxLength={
                                                        MAX_MISSION_VISION_VALUES
                                                    }
                                                    rows={3}
                                                    className={`block w-full rounded-lg shadow-sm border ${
                                                        errors.values
                                                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                                            : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                                    } sm:text-sm p-3`}
                                                    placeholder="What values guide your organization?"
                                                />
                                                <div className="absolute bottom-3 right-3 text-xs text-gray-500 bg-white px-2 py-1 rounded-full shadow-sm">
                                                    {data.values.length}/
                                                    {MAX_MISSION_VISION_VALUES}
                                                </div>
                                            </div>
                                            {showError("values")}
                                        </>
                                    ) : (
                                        <p className="text-gray-900 whitespace-pre-line">
                                            {org.values ||
                                                "No core values provided"}
                                        </p>
                                    )}
                                </FieldWrapper>
                            </div>

                            <SectionHeader>Organization Logo</SectionHeader>

                            <div className="md:col-span-2">
                                <FieldWrapper label="">
                                    {isEditing ? (
                                        <>
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                                <div className="flex-shrink-0">
                                                    {image ? (
                                                        <img
                                                            src={image}
                                                            alt="Selected Logo Preview"
                                                            className="w-40 h-40 object-contain rounded-xl border-2 border-gray-200"
                                                        />
                                                    ) : org.logo ? (
                                                        <img
                                                            src={`/storage/${org.logo}`}
                                                            alt="Current Logo"
                                                            className="w-40 h-40 object-contain rounded-xl border-2 border-gray-200"
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
                                                                    strokeWidth={
                                                                        1
                                                                    }
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
                                                    <div className="flex items-center justify-center w-full">
                                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                <svg
                                                                    className="w-8 h-8 mb-4 text-gray-500"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                                    />
                                                                </svg>
                                                                <p className="mb-2 text-sm text-gray-500">
                                                                    <span className="font-semibold">
                                                                        Click to
                                                                        upload
                                                                    </span>{" "}
                                                                    or drag and
                                                                    drop
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    PNG, JPG up
                                                                    to 2MB
                                                                </p>
                                                            </div>
                                                            <input
                                                                type="file"
                                                                accept="image/jpeg,image/jpg,image/png"
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const file =
                                                                        e.target
                                                                            .files[0];
                                                                    if (!file)
                                                                        return;
                                                                    const validTypes =
                                                                        [
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
                                                                        2 *
                                                                        1024 *
                                                                        1024;
                                                                    if (
                                                                        file.size >
                                                                        maxSize
                                                                    ) {
                                                                        alert(
                                                                            "File size should be less than 2MB."
                                                                        );
                                                                        return;
                                                                    }
                                                                    setData(
                                                                        "logo",
                                                                        file
                                                                    );
                                                                    setImage(
                                                                        URL.createObjectURL(
                                                                            file
                                                                        )
                                                                    );
                                                                    setNewLogo(
                                                                        true
                                                                    );
                                                                }}
                                                                className="hidden"
                                                            />
                                                        </label>
                                                    </div>
                                                    {showError("logo")}
                                                </div>
                                            </div>
                                        </>
                                    ) : org.logo ? (
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={`/storage/${org.logo}`}
                                                alt="Organization Logo"
                                                className="w-32 h-32 object-contain rounded-lg border border-gray-200"
                                            />
                                            <div className="text-sm text-gray-500">
                                                Logo will be displayed on your
                                                organization's public profile
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-4">
                                            <div className="w-32 h-32 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400">
                                                No logo uploaded
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Add a logo to personalize your
                                                organization's profile
                                            </div>
                                        </div>
                                    )}
                                </FieldWrapper>
                            </div>

                            {isEditing && (
                                <div className="md:col-span-2 flex justify-end space-x-3 pt-6 border-t mt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setImage(null);
                                            setNewLogo(false);
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <svg
                                            className="-ml-1 mr-2 h-5 w-5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </section>
        </OrganizationLayout>
    );
}
