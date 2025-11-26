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
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
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
    const [showSuccessBadge, setShowSuccessBadge] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Add this missing state variable
    const [activeTab, setActiveTab] = useState("all"); // "all", "featured", "pending", "expired"

    const [projectsData, setProjectsData] = useState(projects);

    // PayPal configuration
    const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || "test";

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

    // PayPal order creation
    const createOrder = async (data, actions) => {
        try {
            if (!selectedProject || !selectedPlan) {
                throw new Error("Please select a project and plan");
            }

            const response = await axios.post(
                route("paypal.featured.create-order"),
                {
                    project_public_id: selectedProject.public_id,
                    plan_type: selectedPlan,
                }
            );

            return response.data.orderID;
        } catch (error) {
            console.error("PayPal order creation error:", error);
            throw error;
        }
    };

    // PayPal payment approval
    const onApprove = async (data, actions) => {
        try {
            console.log("=== PAYPAL FEATURED PROJECT APPROVE START ===");
            console.log("Order ID:", data.orderID);
            console.log("Selected Project:", selectedProject);
            console.log("Selected Plan:", selectedPlan);

            const response = await axios.post(
                route("paypal.featured.capture-order"),
                {
                    orderID: data.orderID,
                }
            );

            console.log("Capture response:", response.data);

            if (response.data.success) {
                setShowSuccessBadge(true);
                setSuccessMessage(
                    "Payment completed successfully! Your project will be featured after admin approval."
                );
                setShowFeatureModal(false);

                // Wait a moment before reloading to show success message
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                throw new Error(
                    response.data.error || "Payment capture failed"
                );
            }
        } catch (error) {
            console.error("=== PAYPAL CAPTURE ERROR ===");
            console.error("Full error object:", error);
            console.error("Error message:", error.message);
            console.error("Response data:", error.response?.data);
            console.error("Response status:", error.response?.status);

            let errorMessage = "Payment processing failed. Please try again.";

            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;

                if (error.response.data.debug_id) {
                    errorMessage += ` (Debug ID: ${error.response.data.debug_id})`;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            alert(`Payment Error: ${errorMessage}`);

            // Restart the payment process
            if (actions && actions.restart) {
                console.log("Restarting PayPal payment flow...");
                actions.restart();
            }
        }
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
            featured_projects: featuredProjects,
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
                        <div className="relative w-full max-w-4xl max-h-[95vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
                            {/* Enhanced Header */}
                            <div className="sticky top-0  flex items-center justify-between p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl z-10">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/20 p-3 rounded-xl">
                                        <Crown className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">
                                            Feature "{selectedProject.title}"
                                        </h2>
                                        <p className="text-blue-100 mt-1 text-lg">
                                            Boost visibility and attract more
                                            volunteers
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCloseModal}
                                    className="p-3 text-white hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-110"
                                    aria-label="Close modal"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Enhanced Content */}
                            <div className="p-8">
                                {/* Benefits Section */}
                                <div className="mb-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                                            <Zap className="w-5 h-5 text-white" />
                                        </div>
                                        Premium Benefits
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                                            <div className="bg-blue-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-3">
                                                <Eye className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <h4 className="font-semibold text-blue-900 mb-2">
                                                5x More Visibility
                                            </h4>
                                            <p className="text-blue-700 text-sm">
                                                Top placement in search results
                                            </p>
                                        </div>
                                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                                            <div className="bg-green-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-3">
                                                <Users className="w-6 h-6 text-green-600" />
                                            </div>
                                            <h4 className="font-semibold text-green-900 mb-2">
                                                3x More Applications
                                            </h4>
                                            <p className="text-green-700 text-sm">
                                                Attract quality volunteers
                                            </p>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                                            <div className="bg-purple-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-3">
                                                <Crown className="w-6 h-6 text-purple-600" />
                                            </div>
                                            <h4 className="font-semibold text-purple-900 mb-2">
                                                Premium Badge
                                            </h4>
                                            <p className="text-purple-700 text-sm">
                                                Stand out with featured status
                                            </p>
                                        </div>
                                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-100">
                                            <div className="bg-orange-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-3">
                                                <Star className="w-6 h-6 text-orange-600" />
                                            </div>
                                            <h4 className="font-semibold text-orange-900 mb-2">
                                                Priority Support
                                            </h4>
                                            <p className="text-orange-700 text-sm">
                                                Dedicated assistance
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing Plans */}
                                <div className="mb-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
                                            <CreditCard className="w-5 h-5 text-white" />
                                        </div>
                                        Choose Your Plan
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {Object.entries(pricingPlans).map(
                                            ([key, plan]) => {
                                                const isPopular =
                                                    key === "3_months";
                                                const isSelected =
                                                    selectedPlan === key;

                                                return (
                                                    <div
                                                        key={key}
                                                        className={`relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                                                            isSelected
                                                                ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl"
                                                                : "border-gray-200 bg-white hover:border-blue-300 shadow-lg hover:shadow-xl"
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
                                                            <div className="absolute -top-3 -right-3">
                                                                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg">
                                                                    MOST POPULAR
                                                                </span>
                                                            </div>
                                                        )}

                                                        <div className="flex justify-between items-start mb-4">
                                                            <div>
                                                                <h4 className="font-bold text-gray-900 text-lg">
                                                                    {plan.label}
                                                                </h4>
                                                                <p className="text-gray-600 text-sm mt-1">
                                                                    {
                                                                        plan.duration_days
                                                                    }{" "}
                                                                    days
                                                                    featured
                                                                </p>
                                                            </div>
                                                            {isSelected && (
                                                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                                                    <CheckCircle className="w-5 h-5 text-white" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex items-baseline mb-4">
                                                            <span className="text-3xl font-bold text-gray-900">
                                                                ${plan.price}
                                                            </span>
                                                            <span className="text-gray-500 ml-2 text-sm">
                                                                one-time
                                                            </span>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <div className="flex items-center text-sm">
                                                                <span
                                                                    className={`font-medium ${
                                                                        key ===
                                                                        "3_months"
                                                                            ? "text-green-600"
                                                                            : key ===
                                                                              "6_months"
                                                                            ? "text-green-600"
                                                                            : key ===
                                                                              "1_year"
                                                                            ? "text-green-600"
                                                                            : "text-gray-500"
                                                                    }`}
                                                                >
                                                                    {key ===
                                                                        "3_months" &&
                                                                        "✓ Save 20%"}
                                                                    {key ===
                                                                        "6_months" &&
                                                                        "✓ Save 33%"}
                                                                    {key ===
                                                                        "1_year" &&
                                                                        "✓ Save 42%"}
                                                                    {key ===
                                                                        "1_month" &&
                                                                        "Most flexible"}
                                                                </span>
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {
                                                                    plan.description
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>

                                {/* Selected Plan Summary */}
                                {selectedPlan && (
                                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-2xl mb-8 text-white">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-white/20 p-3 rounded-xl">
                                                    <CheckCircle className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg">
                                                        Selected Plan
                                                    </h4>
                                                    <p className="text-blue-100">
                                                        {
                                                            pricingPlans[
                                                                selectedPlan
                                                            ].label
                                                        }{" "}
                                                        •{" "}
                                                        {
                                                            pricingPlans[
                                                                selectedPlan
                                                            ].duration_days
                                                        }{" "}
                                                        days
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-3xl font-bold">
                                                    $
                                                    {
                                                        pricingPlans[
                                                            selectedPlan
                                                        ].price
                                                    }
                                                </p>
                                                <p className="text-blue-100 text-sm">
                                                    one-time payment
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Enhanced PayPal Payment Section */}
                                {selectedPlan && (
                                    <div className="mb-8">
                                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                                                <Shield className="w-5 h-5 text-white" />
                                            </div>
                                            Secure Payment
                                        </h3>

                                        <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
                                            <div className="flex flex-col lg:flex-row gap-6 items-start">
                                                {/* Payment Info */}
                                                <div className="flex-1">
                                                    <div className="bg-white p-4 rounded-xl border border-gray-200 mb-4">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-gray-600">
                                                                Plan:
                                                            </span>
                                                            <span className="font-semibold">
                                                                {
                                                                    pricingPlans[
                                                                        selectedPlan
                                                                    ].label
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-gray-600">
                                                                Duration:
                                                            </span>
                                                            <span className="font-semibold">
                                                                {
                                                                    pricingPlans[
                                                                        selectedPlan
                                                                    ]
                                                                        .duration_days
                                                                }{" "}
                                                                days
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center border-t pt-2">
                                                            <span className="text-gray-600 font-semibold">
                                                                Total:
                                                            </span>
                                                            <span className="text-xl font-bold text-blue-600">
                                                                $
                                                                {
                                                                    pricingPlans[
                                                                        selectedPlan
                                                                    ].price
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Trust Indicators */}
                                                    <div className="grid grid-cols-2 gap-3 text-center">
                                                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                                                            <Lock className="w-4 h-4 text-green-500 mx-auto mb-1" />
                                                            <span className="text-xs text-gray-600">
                                                                SSL Secure
                                                            </span>
                                                        </div>
                                                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                                                            <Shield className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                                                            <span className="text-xs text-gray-600">
                                                                PCI Compliant
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* PayPal Button Container */}
                                                <div className="flex-1 w-full min-w-0">
                                                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <span className="text-sm font-medium text-gray-700">
                                                                Pay with:
                                                            </span>
                                                            <div className="flex items-center gap-2">
                                                                <img
                                                                    src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg"
                                                                    alt="PayPal"
                                                                    className="h-6"
                                                                />
                                                                <span className="text-xs text-gray-500">
                                                                    or Credit
                                                                    Card
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <PayPalScriptProvider
                                                            options={{
                                                                "client-id":
                                                                    paypalClientId,
                                                                currency: "USD",
                                                                components:
                                                                    "buttons",
                                                                intent: "capture",
                                                                "enable-funding":
                                                                    "card,venmo",
                                                                "disable-funding":
                                                                    "",
                                                                "data-page-type":
                                                                    "checkout",
                                                            }}
                                                        >
                                                            <PayPalButtons
                                                                style={{
                                                                    layout: "vertical",
                                                                    height: 48,
                                                                    color: "blue",
                                                                    shape: "rect",
                                                                    label: "checkout",
                                                                    tagline: false,
                                                                }}
                                                                createOrder={
                                                                    createOrder
                                                                }
                                                                onApprove={
                                                                    onApprove
                                                                }
                                                                onError={(
                                                                    err
                                                                ) => {
                                                                    console.error(
                                                                        "PayPal error:",
                                                                        err
                                                                    );
                                                                    alert(
                                                                        "Payment failed. Please try again."
                                                                    );
                                                                }}
                                                                onCancel={() => {
                                                                    console.log(
                                                                        "Payment cancelled by user"
                                                                    );
                                                                }}
                                                            />
                                                        </PayPalScriptProvider>

                                                        <div className="mt-3 text-center">
                                                            <p className="text-xs text-gray-500">
                                                                By continuing,
                                                                you agree to our{" "}
                                                                <a
                                                                    href="#"
                                                                    className="text-blue-600 hover:underline"
                                                                >
                                                                    Terms
                                                                </a>{" "}
                                                                and{" "}
                                                                <a
                                                                    href="#"
                                                                    className="text-blue-600 hover:underline"
                                                                >
                                                                    Privacy
                                                                    Policy
                                                                </a>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Enhanced Payment Security */}
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-green-100 p-3 rounded-xl">
                                                <Shield className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-green-900">
                                                    Your payment is secure
                                                </h4>
                                                <p className="text-green-700 text-sm">
                                                    Encrypted and processed by
                                                    PayPal. We never store your
                                                    payment details.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <img
                                                src="https://www.paypalobjects.com/webstatic/mktg/logo/AM_SbyPP_mc_vs_dc_ae.jpg"
                                                alt="Payment Methods"
                                                className="h-8"
                                            />
                                            <div className="text-xs text-green-700 text-right">
                                                <div>
                                                    256-bit SSL encryption
                                                </div>
                                                <div>PCI DSS compliant</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Footer */}
                            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
                                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                                    <div className="text-sm text-gray-500">
                                        Need help?{" "}
                                        <a
                                            href="#"
                                            className="text-blue-600 hover:underline"
                                        >
                                            Contact support
                                        </a>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={handleCloseModal}
                                            className="px-8 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200 hover:scale-105 border border-gray-300"
                                        >
                                            Cancel
                                        </button>
                                        {!selectedPlan && (
                                            <button
                                                onClick={() => {}}
                                                className="px-8 py-3 bg-gray-400 text-white rounded-xl font-medium cursor-not-allowed"
                                                disabled
                                            >
                                                Select a Plan
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </OrganizationLayout>
    );
}
