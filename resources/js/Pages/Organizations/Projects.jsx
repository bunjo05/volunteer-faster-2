import React, { useState, useEffect, useRef } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import {
    Plus,
    CheckCircle,
    AlertCircle,
    X,
    Clock,
    Star,
    Zap,
    Crown,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { Eye, Users, Shield, Lock, CreditCard } from "lucide-react";
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
    const [activeTab, setActiveTab] = useState("all"); // "all", "featured", "pending", "expired"
    const [showSuccessBadge, setShowSuccessBadge] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [projectsData, setProjectsData] = useState(projects);

    // Get stripeKey from shared props
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
        setSelectedPlan(null);
        setShowFeatureModal(true);
    };

    const handleCloseModal = () => {
        setShowFeatureModal(false);
        setSelectedProject(null);
        setSelectedPlan(null);
    };

    const projectsWithFeaturedStatus = projectsData.map((project) => {
        const featuredProjects = project.featured_projects || [];

        const hasPendingFeature = featuredProjects.some(
            (fp) => fp.status === "pending"
        );

        const hasActiveFeature = featuredProjects.some(
            (fp) => fp.is_active && fp.status === "approved"
        );

        const hasExpiredFeature = featuredProjects.some(
            (fp) =>
                fp.status === "expired" ||
                (fp.end_date && new Date(fp.end_date) < new Date())
        );

        const activeFeaturedProject = featuredProjects.find(
            (fp) => fp.is_active && fp.status === "approved"
        );

        const expiredFeaturedProjects = featuredProjects.filter(
            (fp) =>
                fp.status === "expired" ||
                (fp.end_date && new Date(fp.end_date) < new Date())
        );

        return {
            ...project,
            is_featured: hasActiveFeature,
            has_pending_feature: hasPendingFeature,
            has_expired_feature: hasExpiredFeature,
            active_featured_project: activeFeaturedProject,
            expired_featured_projects: expiredFeaturedProjects,
            featured_projects: featuredProjects, // Keep original array
        };
    });

    // Filter projects based on active tab
    const filteredProjects = projectsWithFeaturedStatus.filter((project) => {
        switch (activeTab) {
            case "featured":
                return project.is_featured;
            case "pending":
                return project.status === "Pending";
            case "expired":
                return project.has_expired_feature;
            default:
                return true; // "all" tab
        }
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

            const csrfToken = document.querySelector(
                'meta[name="csrf-token"]'
            )?.content;

            if (!csrfToken) {
                throw new Error("CSRF token not found");
            }

            axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;
            axios.defaults.headers.common["X-Requested-With"] =
                "XMLHttpRequest";
            axios.defaults.headers.common["Accept"] = "application/json";

            const response = await axios.post(route("featured.checkout"), {
                project_public_id: selectedProject.public_id,
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
                errorMessage =
                    error.response.data?.error ||
                    error.response.data?.message ||
                    errorMessage;
            } else if (error.request) {
                errorMessage =
                    "No response from server. Please check your connection.";
            } else {
                errorMessage = error.message || errorMessage;
            }

            alert(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRequestReview = (projectPublicId) => {
        post(route("projects.requestReview", projectPublicId), {
            preserveScroll: true,
            onSuccess: () => {
                setShowSuccessBadge(true);
                setSuccessMessage("Review request submitted successfully!");

                // Update local state
                setProjectsData((prevProjects) =>
                    prevProjects.map((project) =>
                        project.public_id === projectPublicId
                            ? { ...project, request_for_approval: 1 }
                            : project
                    )
                );

                setTimeout(() => setShowSuccessBadge(false), 5000);
            },
            onError: (errors) => {
                console.error("Review request error:", errors);

                if (errors.response?.status === 409) {
                    alert(
                        "A review request has already been submitted for this project."
                    );
                } else {
                    alert("Failed to submit review request. Please try again.");
                }
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

    const getFeatureStatusBadge = (project) => {
        if (project.is_featured) {
            const activeFeature = project.active_featured_project;
            const daysLeft = activeFeature?.end_date
                ? Math.ceil(
                      (new Date(activeFeature.end_date) - new Date()) /
                          (1000 * 60 * 60 * 24)
                  )
                : null;

            return (
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Featured
                    </span>
                    {daysLeft !== null && daysLeft > 0 && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            {daysLeft} day{daysLeft !== 1 ? "s" : ""} left
                        </span>
                    )}
                </div>
            );
        }

        if (project.has_pending_feature) {
            return (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Pending Approval
                </span>
            );
        }

        if (project.has_expired_feature) {
            return (
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Feature Expired
                </span>
            );
        }

        return null;
    };

    const renderFeaturedProjectInfo = (project) => {
        // Only show featured project details in the Featured tab
        if (activeTab !== "featured") return null;

        if (!project.is_featured && !project.has_expired_feature) return null;

        const activeFeature = project.active_featured_project;
        const expiredFeatures = project.expired_featured_projects;

        return (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Crown className="w-4 h-4 text-purple-500" />
                    Featured Project Details
                </h4>

                {activeFeature && (
                    <div className="mb-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-green-600 font-medium">
                                Active Feature
                            </span>
                            {activeFeature.end_date && (
                                <span className="text-gray-500">
                                    Expires:{" "}
                                    {new Date(
                                        activeFeature.end_date
                                    ).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            Plan: {activeFeature.plan_type?.replace("_", " ")} •
                            Started:{" "}
                            {new Date(
                                activeFeature.start_date
                            ).toLocaleDateString()}
                        </div>
                    </div>
                )}

                {expiredFeatures.length > 0 && (
                    <div>
                        <span className="text-red-600 text-sm font-medium">
                            Expired Features:
                        </span>
                        <div className="mt-1 space-y-1">
                            {expiredFeatures.map((feature, index) => (
                                <div
                                    key={index}
                                    className="text-xs text-gray-500"
                                >
                                    {feature.plan_type?.replace("_", " ")} •
                                    Ended:{" "}
                                    {new Date(
                                        feature.end_date
                                    ).toLocaleDateString()}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
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

    // Count projects for each tab
    const projectCounts = {
        all: projects.length,
        featured: projectsWithFeaturedStatus.filter((p) => p.is_featured)
            .length,
        pending: projectsWithFeaturedStatus.filter(
            (p) => p.status === "Pending"
        ).length,
        expired: projectsWithFeaturedStatus.filter((p) => p.has_expired_feature)
            .length,
    };

    const tabs = [
        {
            id: "all",
            label: "All Projects",
            color: "blue",
            icon: null,
        },
        {
            id: "featured",
            label: "Featured",
            color: "purple",
            icon: <Star className="w-4 h-4" />,
        },
        {
            id: "pending",
            label: "Pending",
            color: "yellow",
            icon: <Clock className="w-4 h-4" />,
        },
        {
            id: "expired",
            label: "Expired",
            color: "gray",
            icon: <Clock className="w-4 h-4" />,
        },
    ];

    const getTabIcon = (tabId) => {
        switch (tabId) {
            case "featured":
                return <Star className="w-4 h-4" />;
            case "pending":
                return <Clock className="w-4 h-4" />;
            case "expired":
                return <Clock className="w-4 h-4" />;
            default:
                return null;
        }
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
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0 zM9 9a1 1 0 000 2v3a1 1 0 001 1 h1a1 1 0 100-2h-1V9z"
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

                    {/* Mobile Tabs Dropdown */}
                    <div className="mb-6 lg:hidden">
                        <button
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <div className="flex items-center gap-2">
                                {getTabIcon(activeTab)}
                                <span className="font-medium text-gray-700">
                                    {
                                        tabs.find((tab) => tab.id === activeTab)
                                            ?.label
                                    }
                                </span>
                                <span
                                    className={`ml-2 bg-${
                                        tabs.find((tab) => tab.id === activeTab)
                                            ?.color
                                    }-100 text-${
                                        tabs.find((tab) => tab.id === activeTab)
                                            ?.color
                                    }-700 text-xs font-medium px-2 py-0.5 rounded-full`}
                                >
                                    {projectCounts[activeTab]}
                                </span>
                            </div>
                            {isMobileMenuOpen ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                        </button>

                        {isMobileMenuOpen && (
                            <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => {
                                            setActiveTab(tab.id);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                                            activeTab === tab.id
                                                ? `bg-${tab.color}-50 text-${tab.color}-700`
                                                : "text-gray-700"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {tab.icon}
                                            <span className="font-medium">
                                                {tab.label}
                                            </span>
                                        </div>
                                        <span
                                            className={`bg-${tab.color}-100 text-${tab.color}-700 text-xs font-medium px-2 py-0.5 rounded-full`}
                                        >
                                            {projectCounts[tab.id]}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Desktop Tabs Navigation */}
                    <div className="hidden lg:block mb-6 border-b border-gray-200">
                        <nav className="flex space-x-8">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`group py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                                        activeTab === tab.id
                                            ? `border-${tab.color}-500 text-${tab.color}-600`
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        {tab.icon}
                                        <span>{tab.label}</span>
                                        <span
                                            className={`ml-2 bg-${tab.color}-100 text-${tab.color}-700 text-xs font-medium px-2 py-0.5 rounded-full transition-colors group-hover:bg-${tab.color}-200`}
                                        >
                                            {projectCounts[tab.id]}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="mb-8">
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className="w-full lg:w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-6">
                        {filteredProjects.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-4">
                                    <svg
                                        className="w-16 h-16 mx-auto"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1}
                                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-gray-500 text-lg font-medium">
                                    {activeTab === "featured"
                                        ? "No featured projects found."
                                        : activeTab === "pending"
                                        ? "No pending projects found."
                                        : activeTab === "expired"
                                        ? "No expired featured projects found."
                                        : "No projects found."}
                                </p>
                                <p className="text-gray-400 mt-2">
                                    {activeTab === "featured"
                                        ? "Feature your projects to make them appear here."
                                        : activeTab === "pending"
                                        ? "All your projects are currently approved or active."
                                        : activeTab === "expired"
                                        ? "Your featured projects are all currently active."
                                        : "Create your first project to get started."}
                                </p>
                            </div>
                        ) : (
                            filteredProjects.map((project) => (
                                <div
                                    key={project.public_id}
                                    className="bg-white rounded-lg shadow hover:shadow-md transition duration-300 overflow-hidden"
                                >
                                    <div className="p-6 flex flex-col md:flex-row gap-6">
                                        {/* Project Image */}
                                        <div className="relative w-full md:w-48 h-48 rounded-xl overflow-hidden shadow-lg border border-gray-200 flex-shrink-0">
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
                                                    project.status ===
                                                    "Rejected"
                                                        ? "brightness-75 grayscale"
                                                        : ""
                                                }`}
                                            />
                                        </div>

                                        {/* Project Details */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-2 flex-wrap">
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
                                                    {getFeatureStatusBadge(
                                                        project
                                                    )}
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-500 mb-3">
                                                <span className="font-medium">
                                                    Category:
                                                </span>{" "}
                                                {project.category?.name} /{" "}
                                                {project.subcategory?.name}
                                            </p>

                                            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                                                {project.short_description}
                                            </p>

                                            {/* Project Metadata */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-500 mb-4">
                                                {project.start_date && (
                                                    <div>
                                                        <span className="font-medium">
                                                            Start:
                                                        </span>{" "}
                                                        {new Date(
                                                            project.start_date
                                                        ).toLocaleDateString()}
                                                    </div>
                                                )}
                                                <div>
                                                    <span className="font-medium">
                                                        Duration:
                                                    </span>{" "}
                                                    {project.max_duration}{" "}
                                                    {project.duration_type}
                                                </div>
                                                {project.fees && (
                                                    <div>
                                                        <span className="font-medium">
                                                            Fees:
                                                        </span>{" "}
                                                        {project.currency}{" "}
                                                        {project.fees}
                                                    </div>
                                                )}
                                                {project.suitable?.length >
                                                    0 && (
                                                    <div>
                                                        <span className="font-medium">
                                                            Suitable for:
                                                        </span>{" "}
                                                        {project.suitable.join(
                                                            ", "
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Availability Months */}
                                            {project.availability_months
                                                ?.length > 0 && (
                                                <div className="mb-4">
                                                    <span className="font-medium text-sm text-gray-500">
                                                        Available:
                                                    </span>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {project.availability_months.map(
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
                                            )}

                                            {/* Featured Project Details */}
                                            {renderFeaturedProjectInfo(project)}

                                            {/* Action Buttons */}
                                            <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-gray-100">
                                                {project.status ===
                                                    "Pending" && (
                                                    <button
                                                        onClick={() =>
                                                            handleRequestReview(
                                                                project.public_id
                                                            )
                                                        }
                                                        disabled={
                                                            project.request_for_approval ===
                                                            1
                                                        }
                                                        className={`px-4 py-2 text-sm font-medium rounded-md transition duration-200 ${
                                                            project.request_for_approval ===
                                                            1
                                                                ? "bg-gray-400 text-white cursor-not-allowed"
                                                                : "bg-green-600 hover:bg-green-700 text-white"
                                                        }`}
                                                    >
                                                        {project.request_for_approval ===
                                                        1
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
                                                            className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-md transition duration-200 flex items-center gap-2"
                                                        >
                                                            <Zap className="w-4 h-4" />
                                                            Feature This Project
                                                        </button>
                                                    )}

                                                {project.has_pending_feature && (
                                                    <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md text-sm">
                                                        Feature Request Pending
                                                    </span>
                                                )}

                                                {project.has_expired_feature &&
                                                    !project.is_featured && (
                                                        <button
                                                            onClick={() =>
                                                                handleFeatureClick(
                                                                    project
                                                                )
                                                            }
                                                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-md transition duration-200 flex items-center gap-2"
                                                        >
                                                            <Zap className="w-4 h-4" />
                                                            Renew Feature
                                                        </button>
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

                                                {project.status ===
                                                    "Rejected" && (
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
                                                <p className=" text-sm text-blue-600">
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
