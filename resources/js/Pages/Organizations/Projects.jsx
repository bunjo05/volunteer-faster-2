import React, { useState, useEffect, useRef } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Plus, CheckCircle } from "lucide-react";
import OrganizationLayout from "@/Layouts/OrganizationLayout";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

export default function Projects({
    userStatus,
    projects,
    stripeKey,
    organizationProfile,
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

    const [showSuccessBadge, setShowSuccessBadge] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Stripe initialization state
    const stripePromiseRef = useRef(null);
    const stripeInitialized = useRef(false);
    const stripeError = useRef(null);

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
        // console.log("Initializing Stripe with key:", stripeKey);
        setStripeLoading(true);

        const initializeStripe = async () => {
            try {
                if (!stripeKey) {
                    throw new Error("Stripe key is missing");
                }

                // Clear any existing Stripe instance
                stripePromiseRef.current = null;
                stripeInitialized.current = false;
                stripeError.current = null;

                // Load Stripe and wait for it to be ready
                stripePromiseRef.current = loadStripe(stripeKey);
                const stripe = await stripePromiseRef.current;

                if (!stripe) {
                    throw new Error("Stripe failed to initialize");
                }

                stripeInitialized.current = true;
                // console.log("Stripe initialized successfully");
            } catch (error) {
                // console.error("Failed to initialize Stripe:", error);
                stripeError.current = error;
                stripeInitialized.current = false;
            } finally {
                setStripeLoading(false);
            }
        };

        if (stripeKey) {
            initializeStripe();
        } else {
            setStripeLoading(false);
            stripeError.current = new Error("Stripe key is missing");
        }

        return () => {
            // Cleanup if needed
        };
    }, [stripeKey]);

    useEffect(() => {
        // Safely access flash from props
        const flash = props?.flash;

        if (flash?.success) {
            setSuccessMessage(flash.success);
            setShowSuccessBadge(true);

            // Hide after 10 seconds
            const timer = setTimeout(() => {
                setShowSuccessBadge(false);
                setSuccessMessage("");
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [props?.flash]); // Optional chaining here as well

    const handleFeatureClick = (project) => {
        setSelectedProject(project);
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

        return {
            ...project,
            is_featured: project.featured_projects?.some((fp) => fp.is_active),
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

        if (!stripeInitialized.current) {
            alert(
                stripeError.current?.message ||
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

            // Add CSRF token to headers
            axios.defaults.headers.common["X-CSRF-TOKEN"] =
                document.querySelector('meta[name="csrf-token"]').content;

            const response = await axios.post(route("featured.checkout"), {
                project_id: selectedProject.id,
                plan_type: selectedPlan,
            });

            // console.log("Checkout response:", response.data);

            if (!response.data.sessionId) {
                throw new Error("No session ID returned from server");
            }

            const result = await stripe.redirectToCheckout({
                sessionId: response.data.sessionId,
            });

            if (result.error) {
                // console.error("Stripe redirect error:", result.error);
                alert("Payment processing failed: " + result.error.message);
            }
        } catch (error) {
            // console.error("Checkout error:", error);
            alert(
                "An error occurred: " +
                    (error.response?.data?.error || error.message)
            );
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRequestReview = (projectId) => {
        post(route("projects.requestReview", projectId), {
            preserveScroll: true,
            onSuccess: () => {},
            onError: (errors) => {},
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

    // Pricing plans configuration
    const pricingPlans = {
        "1_month": {
            price: 50.0,
            label: "1 Month Featured",
            duration_days: 30,
        },
        "3_months": {
            price: 120.0,
            label: "3 Months Featured",
            duration_days: 90,
        },
        "6_months": {
            price: 200.0,
            label: "6 Months Featured",
            duration_days: 180,
        },
        "1_year": {
            price: 350.0,
            label: "1 Year Featured",
            duration_days: 365,
        },
    };

    return (
        <OrganizationLayout>
            <div className="min-h-screen py-10 px-4 sm:px-8 bg-gray-100">
                {/* Header and Search - unchanged from your original code */}
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
                {/* Status Notification */}
                {isPending && (
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
                                    Your account is currently being reviewed by
                                    an admin. You won't be able to create new
                                    projects until your account is approved.
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

                {!hasProfile && isActive && (
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

                    {/* Project Cards */}
                    <div className="space-y-6">
                        {projectsWithFeaturedStatus.length === 0 ? (
                            <p className="text-gray-500">No projects found.</p>
                        ) : (
                            projectsWithFeaturedStatus.map((project) => (
                                <div
                                    key={project.id}
                                    className="bg-white rounded-lg px-[10px] shadow hover:shadow-md flex items-center transition duration-300 overflow-hidden"
                                >
                                    {/* Project card content - unchanged from your original code */}
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
                                                <span className="font-medium">
                                                    Start:
                                                </span>{" "}
                                                {new Date(
                                                    project.start_date
                                                ).toLocaleDateString()}{" "}
                                                &middot;{" "}
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
                                                !project.is_featured && (
                                                    <button
                                                        onClick={() =>
                                                            handleFeatureClick(
                                                                project
                                                            )
                                                        }
                                                        disabled={
                                                            project.has_pending_feature
                                                        }
                                                        className={`px-4 py-2 rounded-md ${
                                                            project.has_pending_feature
                                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                                : "bg-green-600 hover:bg-green-700 text-white"
                                                        }`}
                                                    >
                                                        {project.has_pending_feature
                                                            ? "Feature Request Pending"
                                                            : "Feature This Project"}
                                                    </button>
                                                )}

                                            {project.is_featured && (
                                                <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-md">
                                                    Featured Project
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

                {/* Integrated Feature Modal */}
                {showFeatureModal && selectedProject && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full">
                            <h2 className="text-xl font-bold mb-4">
                                Feature This Project
                            </h2>
                            <p className="mb-4">
                                Make your project stand out by featuring it on
                                our platform.
                            </p>

                            <div className="space-y-4 mb-6">
                                {Object.entries(pricingPlans).map(
                                    ([key, plan]) => (
                                        <div
                                            key={key}
                                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                                selectedPlan === key
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-gray-200 hover:bg-gray-50"
                                            }`}
                                            onClick={() => setSelectedPlan(key)}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="font-medium">
                                                        {plan.label}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        {plan.duration_days /
                                                            30}{" "}
                                                        month
                                                        {plan.duration_days /
                                                            30 >
                                                        1
                                                            ? "s"
                                                            : ""}{" "}
                                                        featured
                                                    </p>
                                                </div>
                                                <div className="text-lg font-bold">
                                                    ${plan.price.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    className="px-4 py-2 text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50"
                                    onClick={handleCloseModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCheckout}
                                    disabled={!selectedPlan || isProcessing}
                                    className={`px-4 py-2 text-white rounded-md ${
                                        !selectedPlan
                                            ? "bg-blue-300 cursor-not-allowed"
                                            : isProcessing
                                            ? "bg-blue-400"
                                            : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                                >
                                    {isProcessing
                                        ? "Processing..."
                                        : "Continue to Payment"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </OrganizationLayout>
    );
}
