import React, { useState, useEffect, useRef } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Plus, CheckCircle, AlertCircle, X } from "lucide-react";
import { Eye, Users, Shield, Lock, CreditCard, Crown, Zap } from "lucide-react";
import OrganizationLayout from "@/Layouts/OrganizationLayout";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

export default function Projects({
    userStatus,
    projects,
    organizationProfile,
    auth,
}) {
    const { props } = usePage();
    const isActive = userStatus === "Active";
    const isPending = userStatus === "Pending";
    const isSuspended = userStatus === "Suspended";
    const hasProfile = !!organizationProfile;
    const [showFeatureModal, setShowFeatureModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [stripeLoading, setStripeLoading] = useState(true);
    const [stripeError, setStripeError] = useState(null);

    const [showSuccessBadge, setShowSuccessBadge] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Get stripeKey from shared props - FIXED: Check if props exists first
    const stripeKey = props?.stripeKey || import.meta.env.VITE_STRIPE_KEY;

    const stripePromiseRef = useRef(null);
    const stripeInitialized = useRef(false);

    const { post } = useForm();

    let tooltipMessage = "";
    if (isPending) {
        tooltipMessage =
            "You can't create a project until your account is Approved.";
    } else if (isSuspended) {
        tooltipMessage =
            "You can't create a project because your account is Suspended.";
    } else if (!hasProfile) {
        tooltipMessage =
            "Please complete your organization profile before creating projects.";
    }

    useEffect(() => {
        setStripeLoading(true);
        setStripeError(null);

        const initializeStripe = async () => {
            try {
                if (!stripeKey) {
                    throw new Error("Stripe key is missing");
                }

                stripePromiseRef.current = loadStripe(stripeKey);
                const stripe = await stripePromiseRef.current;

                if (!stripe) {
                    throw new Error("Stripe failed to initialize");
                }

                stripeInitialized.current = true;
            } catch (error) {
                console.error("Stripe initialization error:", error);
                setStripeError(error.message);
                stripeInitialized.current = false;
            } finally {
                setStripeLoading(false);
            }
        };

        if (stripeKey) {
            initializeStripe();
        } else {
            setStripeLoading(false);
            setStripeError("Stripe key is missing");
        }

        return () => {
            // Cleanup if needed
        };
    }, [stripeKey]);

    useEffect(() => {
        const flash = props?.flash;

        if (flash?.success) {
            setSuccessMessage(flash.success);
            setShowSuccessBadge(true);

            const timer = setTimeout(() => {
                setShowSuccessBadge(false);
                setSuccessMessage("");
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [props?.flash]);

    const handleFeatureClick = (project) => {
        setSelectedProject(project);
        setSelectedPlan(null); // Reset plan selection
        setShowFeatureModal(true);
    };

    const handleCloseModal = () => {
        setShowFeatureModal(false);
        setSelectedProject(null);
        setSelectedPlan(null);
    };

    const projectsWithFeaturedStatus = projects.map((project) => {
        const hasPendingFeature = project.featured_projects?.some(
            (fp) => fp.status === "pending"
        );

        const hasActiveFeature = project.featured_projects?.some(
            (fp) => fp.is_active && fp.status === "approved"
        );

        return {
            ...project,
            is_featured: hasActiveFeature,
            has_pending_feature: hasPendingFeature,
        };
    });

    const handleCheckout = async () => {
        if (!selectedPlan || !selectedProject) {
            alert("Please select a plan and project");
            return;
        }

        if (stripeLoading) {
            alert("Payment system is still initializing. Please wait...");
            return;
        }

        if (!stripeInitialized.current || stripeError) {
            alert(
                stripeError ||
                    "Payment system is not available. Please try again later."
            );
            return;
        }

        setIsProcessing(true);

        try {
            const stripe = await stripePromiseRef.current;

            if (!stripe) {
                throw new Error("Stripe is not available");
            }

            // Get CSRF token from meta tag
            const csrfToken = document.querySelector(
                'meta[name="csrf-token"]'
            )?.content;

            if (!csrfToken) {
                throw new Error("CSRF token not found");
            }

            // Set up axios defaults
            axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;
            axios.defaults.headers.common["X-Requested-With"] =
                "XMLHttpRequest";
            axios.defaults.headers.common["Accept"] = "application/json";

            const response = await axios.post(route("featured.checkout"), {
                project_id: selectedProject.id,
                plan_type: selectedPlan,
            });

            if (!response.data.sessionId) {
                throw new Error("No session ID returned from server");
            }

            const result = await stripe.redirectToCheckout({
                sessionId: response.data.sessionId,
            });

            if (result.error) {
                alert("Payment processing failed: " + result.error.message);
            }
        } catch (error) {
            console.error("Checkout error:", error);
            let errorMessage = "An error occurred during payment processing.";

            if (error.response) {
                // Server responded with error status
                errorMessage =
                    error.response.data?.error ||
                    error.response.data?.message ||
                    errorMessage;
            } else if (error.request) {
                // Request was made but no response received
                errorMessage =
                    "No response from server. Please check your connection.";
            } else {
                // Something else happened
                errorMessage = error.message || errorMessage;
            }

            alert(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRequestReview = (projectId) => {
        post(route("projects.requestReview", projectId), {
            preserveScroll: true,
            onSuccess: () => {
                setShowSuccessBadge(true);
                setSuccessMessage("Review request submitted successfully!");
                setTimeout(() => setShowSuccessBadge(false), 5000);
            },
            onError: (errors) => {
                console.error("Review request error:", errors);
                alert("Failed to submit review request. Please try again.");
            },
        });
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "Active":
                return "bg-green-100 text-green-800";
            case "Pending":
                return "bg-yellow-100 text-yellow-800";
            case "Rejected":
                return "bg-red-100 text-red-800";
            case "Approved":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-200 text-gray-700";
        }
    };

    // In your Projects component, add this to the feature status badge logic
    const getFeatureStatusBadge = (project) => {
        if (project.is_featured) {
            return (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                    Featured ✓
                </span>
            );
        }
        if (project.has_pending_feature) {
            return (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                    Feature Request Pending
                </span>
            );
        }
        // Add expired status check
        const hasExpiredFeature = project.featured_projects?.some(
            (fp) => fp.status === "expired"
        );
        if (hasExpiredFeature) {
            return (
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">
                    Feature Expired
                </span>
            );
        }
        return null;
    };

    const pricingPlans = {
        "1_month": {
            price: 50.0,
            label: "1 Month Featured",
            duration_days: 30,
            description: "30 days of featured placement",
        },
        "3_months": {
            price: 120.0,
            label: "3 Months Featured",
            duration_days: 90,
            description: "90 days of featured placement (Save 20%)",
        },
        "6_months": {
            price: 200.0,
            label: "6 Months Featured",
            duration_days: 180,
            description: "180 days of featured placement (Save 33%)",
        },
        "1_year": {
            price: 350.0,
            label: "1 Year Featured",
            duration_days: 365,
            description: "365 days of featured placement (Save 42%)",
        },
    };

    return (
        <OrganizationLayout auth={auth}>
            <div className="min-h-screen py-10 px-4 sm:px-8 bg-gray-100">
                {/* Success Notification */}
                {showSuccessBadge && (
                    <div className="fixed top-4 right-4 z-50">
                        <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-md shadow-lg animate-fade-in">
                            <CheckCircle className="w-5 h-5" />
                            <span>{successMessage}</span>
                            <button
                                onClick={() => setShowSuccessBadge(false)}
                                className="ml-2 p-1 rounded-full hover:bg-green-600 transition-colors"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
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

                {/* Stripe Error Banner */}
                {stripeError && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-md shadow-sm">
                        <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                            <div>
                                <p className="text-sm text-red-700">
                                    Payment system unavailable: {stripeError}
                                </p>
                                <p className="text-xs text-red-600 mt-1">
                                    Please contact support if this issue
                                    persists.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Organization Profile Not Filled Badge */}
                {!hasProfile && isPending && (
                    <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-md shadow-sm">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-5 w-5 text-blue-400"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-blue-700">
                                    Please complete your organization profile
                                    before creating projects.
                                </p>
                                <div className="mt-2">
                                    <Link
                                        href={route("organization.profile")}
                                        className="text-sm font-medium text-blue-700 hover:text-blue-600"
                                    >
                                        Go to Profile →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Account Under Review Badge */}
                {hasProfile && isPending && (
                    <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md shadow-sm">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-5 w-5 text-yellow-400"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    Please wait, your account is currently under
                                    review. An admin will review your profile
                                    and make a decision soon.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {isSuspended && (
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
                                    Your account has been suspended. You can no
                                    longer create projects. Please contact
                                    support if you believe this is an error.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">
                            Projects
                        </h1>
                        <div
                            title={isActive && hasProfile ? "" : tooltipMessage}
                        >
                            <Link
                                disabled={!(isActive && hasProfile)}
                                href={route("organization.projects.create")}
                                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-md shadow transition duration-200
                                ${
                                    isActive && hasProfile
                                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                            >
                                <Plus className="w-4 h-4" />
                                New Project
                            </Link>
                        </div>
                    </div>

                    <div className="mb-8">
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-6">
                        {projectsWithFeaturedStatus.length === 0 ? (
                            <p className="text-gray-500">No projects found.</p>
                        ) : (
                            projectsWithFeaturedStatus.map((project) => (
                                <div
                                    key={project.id}
                                    className="bg-white rounded-lg px-[10px] shadow hover:shadow-md flex items-center transition duration-300 overflow-hidden"
                                >
                                    <div className="relative w-[200px] h-[200px] rounded-xl overflow-hidden shadow-lg border border-gray-200">
                                        {project.status === "Rejected" && (
                                            <span className="absolute top-2 left-2 flex items-center gap-1 bg-red-500/90 text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
                                                <svg
                                                    className="w-3.5 h-3.5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                                Rejected
                                            </span>
                                        )}
                                        <img
                                            src={
                                                project.featured_image
                                                    ? `/storage/${project.featured_image}`
                                                    : "/images/placeholder.jpg"
                                            }
                                            alt={project.title}
                                            className={`object-cover w-full h-full transition-transform duration-300 ease-in-out ${
                                                project.status === "Rejected"
                                                    ? "brightness-75 grayscale"
                                                    : ""
                                            }`}
                                        />
                                    </div>

                                    <div className="w-full p-4 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <h2 className="text-xl font-bold text-gray-900">
                                                    {project.title}
                                                </h2>
                                                <span
                                                    className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusBadgeClass(
                                                        project.status
                                                    )}`}
                                                >
                                                    {project.status}
                                                </span>
                                                {getFeatureStatusBadge(project)}
                                            </div>

                                            <p className="text-sm text-gray-500 mb-1">
                                                <span className="font-medium">
                                                    Category:
                                                </span>{" "}
                                                {project.category?.name} /{" "}
                                                {project.subcategory?.name}
                                            </p>
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                                                {project.short_description}
                                            </p>

                                            <div className="text-sm text-gray-500 mb-1">
                                                {project.start_date && (
                                                    <>
                                                        <span className="font-medium">
                                                            Start:
                                                        </span>{" "}
                                                        {new Date(
                                                            project.start_date
                                                        ).toLocaleDateString()}{" "}
                                                        &middot;{" "}
                                                    </>
                                                )}
                                                <span className="font-medium">
                                                    Duration:
                                                </span>{" "}
                                                {project.max_duration}{" "}
                                                {project.duration_type}
                                            </div>

                                            {project.fees && (
                                                <div className="text-sm text-gray-500 mb-1">
                                                    <span className="font-medium">
                                                        Fees:
                                                    </span>{" "}
                                                    {project.currency}{" "}
                                                    {project.fees}
                                                </div>
                                            )}

                                            {project.suitable?.length > 0 && (
                                                <div className="text-sm text-gray-500 mb-1">
                                                    <span className="font-medium">
                                                        Suitable for:
                                                    </span>{" "}
                                                    {project.suitable.join(
                                                        ", "
                                                    )}
                                                </div>
                                            )}

                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {project.availability_months?.map(
                                                    (month) => (
                                                        <span
                                                            key={month}
                                                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full"
                                                        >
                                                            {month}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-4">
                                            {project.status === "Pending" &&
                                                project.request_for_approval ===
                                                    0 && (
                                                    <button
                                                        onClick={() =>
                                                            handleRequestReview(
                                                                project.id
                                                            )
                                                        }
                                                        disabled={
                                                            project.request_for_approval
                                                        }
                                                        className={`px-4 py-2 text-sm font-medium rounded-md transition duration-200 ${
                                                            project.request_for_approval
                                                                ? "bg-gray-400 text-white cursor-not-allowed"
                                                                : "bg-green-600 hover:bg-green-700 text-white"
                                                        }`}
                                                    >
                                                        {project.request_for_approval
                                                            ? "Review Requested"
                                                            : "Request for Review"}
                                                    </button>
                                                )}

                                            {project.status !== "Pending" &&
                                                !project.is_featured &&
                                                !project.has_pending_feature && (
                                                    <button
                                                        onClick={() =>
                                                            handleFeatureClick(
                                                                project
                                                            )
                                                        }
                                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition duration-200"
                                                    >
                                                        Feature This Project
                                                    </button>
                                                )}

                                            {project.is_featured && (
                                                <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-md">
                                                    Featured Project
                                                </span>
                                            )}

                                            {project.has_pending_feature && (
                                                <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md">
                                                    Feature Request Pending
                                                </span>
                                            )}

                                            {(!project.request_for_approval ||
                                                project.status ===
                                                    "Active") && (
                                                <Link
                                                    href={route(
                                                        "organization.projects.edit",
                                                        project.slug
                                                    )}
                                                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-md transition duration-200"
                                                >
                                                    Edit
                                                </Link>
                                            )}
                                            {project.status === "Rejected" && (
                                                <Link
                                                    href={route(
                                                        "organization.projects.edit",
                                                        project.slug
                                                    )}
                                                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-md transition duration-200"
                                                >
                                                    Edit
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {showFeatureModal && selectedProject && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70">
                        <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl">
                            {/* Header */}
                            <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-gradient-to-r from-primary to-primary-focus text-white rounded-t-xl">
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        Feature "{selectedProject.title}"
                                    </h2>
                                    <p className="text-primary-content/90 mt-1">
                                        Boost visibility and attract more
                                        volunteers
                                    </p>
                                </div>
                                <button
                                    onClick={handleCloseModal}
                                    className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                                    aria-label="Close modal"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {/* Benefits Section */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                        🚀 Featured Project Benefits
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                                            <Eye className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-medium text-blue-800">
                                                    5x More Visibility
                                                </h4>
                                                <p className="text-sm text-blue-600">
                                                    Top placement in search
                                                    results
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                                            <Users className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-medium text-green-800">
                                                    3x More Applications
                                                </h4>
                                                <p className="text-sm text-green-600">
                                                    Attract quality volunteers
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                                            <Crown className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-medium text-purple-800">
                                                    Premium Badge
                                                </h4>
                                                <p className="text-sm text-purple-600">
                                                    Stand out with featured
                                                    status
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                                            <Zap className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-medium text-orange-800">
                                                    Priority Support
                                                </h4>
                                                <p className="text-sm text-orange-600">
                                                    Dedicated assistance
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing Plans */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                        📅 Choose Your Featured Duration
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(pricingPlans).map(
                                            ([key, plan]) => {
                                                const isPopular =
                                                    key === "3_months";
                                                const isSelected =
                                                    selectedPlan === key;

                                                return (
                                                    <div
                                                        key={key}
                                                        className={`relative p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                                                            isSelected
                                                                ? "border-primary bg-primary/5 shadow-lg"
                                                                : "border-gray-200 hover:border-primary/50"
                                                        } ${
                                                            isPopular
                                                                ? "ring-2 ring-yellow-400 ring-opacity-50"
                                                                : ""
                                                        }`}
                                                        onClick={() =>
                                                            setSelectedPlan(key)
                                                        }
                                                    >
                                                        {isPopular && (
                                                            <div className="absolute -top-2 -right-2">
                                                                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                                                                    POPULAR
                                                                </span>
                                                            </div>
                                                        )}

                                                        <div className="flex justify-between items-start mb-3">
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900">
                                                                    {plan.label}
                                                                </h4>
                                                                <p className="text-sm text-gray-600 mt-1">
                                                                    {
                                                                        plan.duration_days
                                                                    }{" "}
                                                                    days
                                                                    featured
                                                                </p>
                                                            </div>
                                                            {isSelected && (
                                                                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                                                    <CheckCircle className="w-4 h-4 text-white" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex items-baseline mb-3">
                                                            <span className="text-2xl font-bold text-gray-900">
                                                                ${plan.price}
                                                            </span>
                                                            <span className="text-sm text-gray-500 ml-1">
                                                                one-time
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <span className="text-green-600 font-medium">
                                                                {key ===
                                                                    "3_months" &&
                                                                    "20% savings"}
                                                                {key ===
                                                                    "6_months" &&
                                                                    "33% savings"}
                                                                {key ===
                                                                    "1_year" &&
                                                                    "42% savings"}
                                                            </span>
                                                            {key ===
                                                                "1_month" && (
                                                                <span className="text-gray-500">
                                                                    Most
                                                                    flexible
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>

                                {/* Selected Plan Summary */}
                                {selectedPlan && (
                                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-5 rounded-xl mb-6">
                                        <h4 className="font-semibold text-primary mb-3">
                                            ✅ Selected Plan
                                        </h4>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-lg font-bold text-gray-900">
                                                    {
                                                        pricingPlans[
                                                            selectedPlan
                                                        ].label
                                                    }
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {
                                                        pricingPlans[
                                                            selectedPlan
                                                        ].duration_days
                                                    }{" "}
                                                    days of featured placement
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-primary">
                                                    $
                                                    {
                                                        pricingPlans[
                                                            selectedPlan
                                                        ].price
                                                    }
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    one-time payment
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Payment Security */}
                                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                                        <Shield className="w-4 h-4 text-green-600" />
                                        <span>
                                            Secure payment processed by Stripe
                                        </span>
                                        <Lock className="w-4 h-4 text-green-600" />
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="sticky bottom-0 bg-white border-t p-6 rounded-b-xl">
                                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                                    <button
                                        onClick={handleCloseModal}
                                        className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCheckout}
                                        disabled={!selectedPlan || isProcessing}
                                        className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                                            !selectedPlan
                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                : isProcessing
                                                ? "bg-primary/80 text-white"
                                                : "bg-primary hover:bg-primary-focus text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                                        }`}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                <span>Processing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="w-5 h-5" />
                                                <span>Continue to Payment</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </OrganizationLayout>
    );
}
