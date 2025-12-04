import React, { useState, useEffect } from "react";
import VolunteerLayout from "@/Layouts/VolunteerLayout";
import { Head, useForm, router } from "@inertiajs/react";
import {
    Heart,
    Edit,
    Send,
    CheckCircle,
    XCircle,
    AlertCircle,
    DollarSign,
    Calendar,
    User,
    Building,
    TrendingUp,
    FileText,
    Target,
    Award,
    ChevronRight,
    Filter,
    RefreshCw,
    Download,
    Share2,
    MoreVertical,
    Info,
    Clock,
    Check,
    X,
    Plus,
    Users,
    Globe,
    MapPin,
    CreditCard,
    BarChart3,
    Sparkles,
    Lightbulb,
    Briefcase,
    GraduationCap,
} from "lucide-react";

export default function Sponsorships({
    sponsorships,
    volunteer_sponsorships,
    stats,
    auth,
    success,
    show_success_modal,
}) {
    const [showAppreciationModal, setShowAppreciationModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedSponsorship, setSelectedSponsorship] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState("received");
    const [originalApplicationData, setOriginalApplicationData] =
        useState(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [statusFilter, setStatusFilter] = useState("all");

    // Check screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const { data, setData, post, errors, reset } = useForm({
        message: "",
        sponsorship_public_id: "",
    });

    const {
        data: editFormData,
        setData: setEditFormData,
        post: postEdit,
        errors: editErrors,
        processing: editProcessing,
        reset: resetEditForm,
    } = useForm({
        public_id: "",
        travel: 0,
        accommodation: 0,
        meals: 0,
        living_expenses: 0,
        visa_fees: 0,
        project_fees_amount: 0,
        total_amount: 0,
        self_introduction: "",
        impact: "",
        aspect_needs_funding: [],
        skills: [],
        commitment: false,
        agreement: false,
    });

    useEffect(() => {
        if (success || show_success_modal) {
            setShowSuccessModal(true);
            setTimeout(() => setShowSuccessModal(false), 3000);
        }
    }, [success, show_success_modal]);

    useEffect(() => {
        if (showEditModal && originalApplicationData) {
            const currentData = {
                travel: parseFloat(editFormData.travel || 0),
                accommodation: parseFloat(editFormData.accommodation || 0),
                meals: parseFloat(editFormData.meals || 0),
                living_expenses: parseFloat(editFormData.living_expenses || 0),
                visa_fees: parseFloat(editFormData.visa_fees || 0),
                project_fees_amount: parseFloat(
                    editFormData.project_fees_amount || 0
                ),
                self_introduction: editFormData.self_introduction || "",
                impact: editFormData.impact || "",
                aspect_needs_funding: editFormData.aspect_needs_funding || [],
                skills: editFormData.skills || [],
            };

            const changesDetected =
                currentData.travel !==
                    parseFloat(originalApplicationData.travel || 0) ||
                currentData.accommodation !==
                    parseFloat(originalApplicationData.accommodation || 0) ||
                currentData.meals !==
                    parseFloat(originalApplicationData.meals || 0) ||
                currentData.living_expenses !==
                    parseFloat(originalApplicationData.living_expenses || 0) ||
                currentData.visa_fees !==
                    parseFloat(originalApplicationData.visa_fees || 0) ||
                currentData.project_fees_amount !==
                    parseFloat(
                        originalApplicationData.project_fees_amount || 0
                    ) ||
                currentData.self_introduction !==
                    (originalApplicationData.self_introduction || "") ||
                currentData.impact !== (originalApplicationData.impact || "") ||
                JSON.stringify(currentData.aspect_needs_funding) !==
                    JSON.stringify(
                        originalApplicationData.aspect_needs_funding || []
                    ) ||
                JSON.stringify(currentData.skills) !==
                    JSON.stringify(originalApplicationData.skills || []);

            setHasChanges(changesDetected);
        }
    }, [editFormData, originalApplicationData, showEditModal]);

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(amount || 0);

    const canResubmitApplication = (application) => {
        return application.status === "Rejected";
    };

    const handleResubmitApplication = (applicationId) => {
        if (
            !confirm(
                "Are you sure you want to resubmit this application? It will be sent for review again."
            )
        ) {
            return;
        }

        router.post(
            route("volunteer.sponsorship-applications.resubmit", applicationId),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowSuccessModal(true);
                    setTimeout(() => window.location.reload(), 1000);
                },
            }
        );
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            completed: {
                color: "bg-green-100 text-green-800 border-green-200",
                icon: CheckCircle,
            },
            pending: {
                color: "bg-yellow-100 text-yellow-800 border-yellow-200",
                icon: Clock,
            },
            failed: {
                color: "bg-red-100 text-red-800 border-red-200",
                icon: XCircle,
            },
            refunded: {
                color: "bg-gray-100 text-gray-800 border-gray-200",
                icon: RefreshCw,
            },
            submitted: {
                color: "bg-blue-100 text-blue-800 border-blue-200",
                icon: FileText,
            },
            under_review: {
                color: "bg-purple-100 text-purple-800 border-purple-200",
                icon: AlertCircle,
            },
            approved: {
                color: "bg-green-100 text-green-800 border-green-200",
                icon: CheckCircle,
            },
            rejected: {
                color: "bg-red-100 text-red-800 border-red-200",
                icon: XCircle,
            },
            draft: {
                color: "bg-gray-100 text-gray-800 border-gray-200",
                icon: Edit,
            },
            Pending: {
                color: "bg-yellow-100 text-yellow-800 border-yellow-200",
                icon: Clock,
            },
        };

        const config =
            statusConfig[status?.toLowerCase()] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${config.color}`}
            >
                <Icon className="w-3 h-3" />
                {status?.charAt(0).toUpperCase() +
                    status?.slice(1).replace("_", " ") || "Unknown"}
            </span>
        );
    };

    const getDonorName = (s) =>
        s.is_anonymous ? "Anonymous Donor" : s.donor?.name ?? "Unknown Donor";

    const hasSentAppreciation = (s) => s.appreciation_sent === true;

    const handleSendAppreciation = (s) => {
        if (s.is_anonymous)
            return alert("Cannot send appreciation to anonymous donors.");
        if (hasSentAppreciation(s)) return alert("Appreciation already sent.");
        setSelectedSponsorship(s);
        setData("sponsorship_public_id", s.id);
        setShowAppreciationModal(true);
    };

    const submitAppreciation = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        post(route("volunteer.appreciation.send"), {
            preserveScroll: true,
            onSuccess: () => {
                setShowAppreciationModal(false);
                setShowSuccessModal(true);
                setTimeout(() => window.location.reload(), 900);
            },
            onError: () => setIsSubmitting(false),
            onFinish: () => setIsSubmitting(false),
        });
    };

    const handleEditApplication = (application) => {
        setSelectedApplication(application);
        const applicationData = {
            public_id: application.public_id,
            travel: application.travel || 0,
            accommodation: application.accommodation || 0,
            meals: application.meals || 0,
            living_expenses: application.living_expenses || 0,
            visa_fees: application.visa_fees || 0,
            project_fees_amount: application.project_fees_amount || 0,
            total_amount: application.total_amount || 0,
            self_introduction: application.self_introduction || "",
            impact: application.impact || "",
            aspect_needs_funding: application.aspect_needs_funding || [],
            skills: application.skills || [],
            commitment: true,
            agreement: true,
        };

        setEditFormData(applicationData);
        setOriginalApplicationData(applicationData);
        setHasChanges(false);
        setShowEditModal(true);
    };

    const handleUpdateApplication = (e) => {
        e.preventDefault();
        const total =
            parseFloat(editFormData.travel || 0) +
            parseFloat(editFormData.accommodation || 0) +
            parseFloat(editFormData.meals || 0) +
            parseFloat(editFormData.living_expenses || 0) +
            parseFloat(editFormData.visa_fees || 0) +
            parseFloat(editFormData.project_fees_amount || 0);

        setEditFormData("total_amount", total);

        postEdit(route("volunteer.sponsorship-applications.update"), {
            preserveScroll: true,
            onSuccess: () => {
                setShowEditModal(false);
                setShowSuccessModal(true);
                resetEditForm();
                setOriginalApplicationData(null);
                setHasChanges(false);
                setTimeout(() => window.location.reload(), 1000);
            },
        });
    };

    const handleSubmitForReview = (applicationId) => {
        if (
            !confirm(
                "Are you sure you want to submit this application for review?"
            )
        ) {
            return;
        }

        router.post(
            route("volunteer.sponsorship-applications.submit", applicationId),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowSuccessModal(true);
                    setTimeout(() => window.location.reload(), 1000);
                },
            }
        );
    };

    const calculateTotal = () => {
        return (
            parseFloat(editFormData.travel || 0) +
            parseFloat(editFormData.accommodation || 0) +
            parseFloat(editFormData.meals || 0) +
            parseFloat(editFormData.living_expenses || 0) +
            parseFloat(editFormData.visa_fees || 0) +
            parseFloat(editFormData.project_fees_amount || 0)
        );
    };

    const canEditApplication = (application) => {
        return application.status === "Rejected";
    };

    const canSubmitApplication = (application) => {
        return application.status === "Rejected";
    };

    const filteredSponsorships = sponsorships.filter((s) => {
        if (statusFilter === "all") return true;
        return s.status === statusFilter;
    });

    const filteredApplications = volunteer_sponsorships.filter((app) => {
        if (statusFilter === "all") return true;
        return app.status === statusFilter;
    });

    // Mobile-friendly modals
    const AppreciationModal = () => {
        if (!showAppreciationModal || !selectedSponsorship) return null;

        return (
            <div className="modal modal-open modal-bottom sm:modal-middle">
                <div className="modal-box bg-white p-4 sm:p-6 mx-4 sm:mx-0 max-w-md sm:max-w-lg w-full">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Heart className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                                Send Appreciation
                            </h3>
                        </div>
                        <button
                            onClick={() => {
                                setShowAppreciationModal(false);
                                setSelectedSponsorship(null);
                                reset();
                            }}
                            className="btn btn-ghost btn-sm"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <p className="text-gray-600 mb-4 text-sm sm:text-base">
                        Thank{" "}
                        <span className="font-semibold">
                            {getDonorName(selectedSponsorship)}
                        </span>{" "}
                        for supporting{" "}
                        <span className="font-semibold">
                            "{selectedSponsorship.project}"
                        </span>
                    </p>

                    <form onSubmit={submitAppreciation} className="space-y-4">
                        <div>
                            <label className="label">
                                <span className="label-text">Your Message</span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered w-full min-h-[120px] resize-y"
                                placeholder="Write your heartfelt appreciation message..."
                                value={data.message}
                                onChange={(e) =>
                                    setData("message", e.target.value)
                                }
                                disabled={isSubmitting}
                                required
                            />
                            {errors.message && (
                                <p className="text-error text-sm mt-1">
                                    {errors.message}
                                </p>
                            )}
                        </div>

                        <div className="modal-action flex-col sm:flex-row gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAppreciationModal(false);
                                    setSelectedSponsorship(null);
                                    reset();
                                }}
                                className="btn btn-ghost w-full sm:w-auto"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || !data.message.trim()}
                                className="btn btn-primary w-full sm:w-auto"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const EditApplicationModal = () => {
        if (!showEditModal || !selectedApplication) return null;

        return (
            <div className="modal modal-open modal-bottom sm:modal-middle">
                <div className="modal-box bg-white p-4 sm:p-6 mx-4 sm:mx-0 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Edit className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                                    Edit Sponsorship Application
                                </h3>
                                <p className="text-gray-600 text-sm mt-1">
                                    {selectedApplication.booking?.project
                                        ?.title || "Unknown Project"}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                if (
                                    hasChanges &&
                                    !confirm(
                                        "You have unsaved changes. Are you sure you want to cancel?"
                                    )
                                )
                                    return;
                                setShowEditModal(false);
                                setSelectedApplication(null);
                                resetEditForm();
                                setOriginalApplicationData(null);
                                setHasChanges(false);
                            }}
                            className="btn btn-ghost btn-sm"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {hasChanges && (
                        <div className="alert alert-warning mb-4">
                            <AlertCircle className="w-4 h-4" />
                            <span>You have unsaved changes</span>
                        </div>
                    )}

                    <form
                        onSubmit={handleUpdateApplication}
                        className="space-y-6"
                    >
                        {/* Funding Requirements - Responsive Grid */}
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <div className="flex items-center gap-3 mb-4">
                                <CreditCard className="w-5 h-5 text-blue-600" />
                                <h4 className="font-semibold text-gray-900">
                                    Funding Requirements
                                </h4>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {[
                                    {
                                        label: "Travel Expenses",
                                        name: "travel",
                                        icon: "✈️",
                                    },
                                    {
                                        label: "Accommodation",
                                        name: "accommodation",
                                        icon: "🏠",
                                    },
                                    {
                                        label: "Meals & Food",
                                        name: "meals",
                                        icon: "🍽️",
                                    },
                                    {
                                        label: "Living Expenses",
                                        name: "living_expenses",
                                        icon: "💰",
                                    },
                                    {
                                        label: "Visa & Documents",
                                        name: "visa_fees",
                                        icon: "📋",
                                    },
                                    {
                                        label: "Project Contribution",
                                        name: "project_fees_amount",
                                        icon: "🤝",
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.name}
                                        className="bg-white p-3 rounded-lg border border-gray-200"
                                    >
                                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                                            <span className="mr-1">
                                                {item.icon}
                                            </span>
                                            {item.label}
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-gray-500 text-sm">
                                                $
                                            </span>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                className="input input-bordered w-full pl-8"
                                                value={editFormData[item.name]}
                                                onChange={(e) =>
                                                    setEditFormData(
                                                        item.name,
                                                        parseFloat(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                }
                                            />
                                        </div>
                                        {editErrors[item.name] && (
                                            <p className="text-error text-xs mt-1">
                                                {editErrors[item.name]}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Total Summary */}
                            <div className="mt-4 p-3 bg-white rounded-lg border-2 border-blue-200">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Total Funding Request
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            This amount will be shown to
                                            sponsors
                                        </p>
                                    </div>
                                    <div className="text-right mt-2 sm:mt-0">
                                        <p className="text-xl font-bold text-blue-600">
                                            {formatCurrency(calculateTotal())}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Auto-calculated total
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Application Details - Responsive Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Self Introduction */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <User className="w-5 h-5 text-green-600" />
                                    <h4 className="font-semibold text-gray-900">
                                        Personal Introduction
                                    </h4>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                    <textarea
                                        className="textarea textarea-bordered w-full min-h-[120px] resize-y"
                                        placeholder="Share your background, experience, and motivation..."
                                        value={editFormData.self_introduction}
                                        onChange={(e) =>
                                            setEditFormData(
                                                "self_introduction",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-xs text-gray-500">
                                            {
                                                editFormData.self_introduction
                                                    .length
                                            }
                                            /2000
                                        </p>
                                        {editFormData.self_introduction.length >
                                            1800 && (
                                            <p className="text-xs text-warning">
                                                Getting long
                                            </p>
                                        )}
                                    </div>
                                    {editErrors.self_introduction && (
                                        <p className="text-error text-sm mt-2">
                                            {editErrors.self_introduction}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Impact Statement */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Target className="w-5 h-5 text-purple-600" />
                                    <h4 className="font-semibold text-gray-900">
                                        Expected Impact
                                    </h4>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                    <textarea
                                        className="textarea textarea-bordered w-full min-h-[120px] resize-y"
                                        placeholder="Explain how your participation will benefit the project..."
                                        value={editFormData.impact}
                                        onChange={(e) =>
                                            setEditFormData(
                                                "impact",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-xs text-gray-500">
                                            {editFormData.impact.length}/2000
                                        </p>
                                        {editFormData.impact.length > 1800 && (
                                            <p className="text-xs text-warning">
                                                Getting long
                                            </p>
                                        )}
                                    </div>
                                    {editErrors.impact && (
                                        <p className="text-error text-sm mt-2">
                                            {editErrors.impact}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Skills and Funding Priorities */}
                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                            <div className="flex items-center gap-3 mb-4">
                                <Award className="w-5 h-5 text-orange-600" />
                                <h4 className="font-semibold text-gray-900">
                                    Additional Information
                                </h4>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {/* Skills */}
                                <div className="bg-white p-3 rounded-lg border border-gray-200">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Relevant Skills & Expertise
                                    </label>
                                    <textarea
                                        className="textarea textarea-bordered w-full min-h-[80px] resize-y"
                                        placeholder="List skills, qualifications, or experiences..."
                                        value={
                                            editFormData.skills?.join(", ") ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            setEditFormData(
                                                "skills",
                                                e.target.value
                                                    .split(",")
                                                    .map((skill) =>
                                                        skill.trim()
                                                    )
                                                    .filter((skill) => skill)
                                            )
                                        }
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        Separate skills with commas
                                    </p>
                                </div>

                                {/* Funding Priorities */}
                                <div className="bg-white p-3 rounded-lg border border-gray-200">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Funding Priority Areas
                                    </label>
                                    <textarea
                                        className="textarea textarea-bordered w-full min-h-[80px] resize-y"
                                        placeholder="Which aspects are most critical? (e.g., travel, accommodation)..."
                                        value={
                                            editFormData.aspect_needs_funding?.join(
                                                ", "
                                            ) || ""
                                        }
                                        onChange={(e) =>
                                            setEditFormData(
                                                "aspect_needs_funding",
                                                e.target.value
                                                    .split(",")
                                                    .map((item) => item.trim())
                                                    .filter((item) => item)
                                            )
                                        }
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        Separate areas with commas
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-gray-200 gap-3">
                            <div className="text-sm text-gray-500 text-center sm:text-left">
                                {hasChanges && (
                                    <p className="text-warning font-medium">
                                        You have unsaved changes
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (
                                            hasChanges &&
                                            !confirm(
                                                "You have unsaved changes. Are you sure you want to cancel?"
                                            )
                                        )
                                            return;
                                        setShowEditModal(false);
                                        setSelectedApplication(null);
                                        resetEditForm();
                                        setOriginalApplicationData(null);
                                        setHasChanges(false);
                                    }}
                                    className="btn btn-ghost btn-sm sm:btn-md"
                                    disabled={editProcessing}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editProcessing || !hasChanges}
                                    className="btn btn-primary btn-sm sm:btn-md"
                                >
                                    {editProcessing ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4 mr-2" />
                                            {hasChanges
                                                ? "Update Application"
                                                : "No Changes Made"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const SuccessModal = () => {
        if (!showSuccessModal) return null;

        return (
            <div className="modal modal-open modal-bottom sm:modal-middle">
                <div className="modal-box bg-gradient-to-br from-green-100 to-green-50 border border-green-200 max-w-sm mx-4 sm:mx-0">
                    <div className="flex flex-col items-center text-center">
                        <div className="bg-green-100 p-3 rounded-full mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Success!
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                            {selectedApplication
                                ? "Application updated successfully!"
                                : "Your appreciation message has been delivered successfully."}
                        </p>
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="btn btn-success btn-sm w-full"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <VolunteerLayout auth={auth}>
            <Head title="My Sponsorships" />

            <AppreciationModal />
            <EditApplicationModal />
            <SuccessModal />

            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-8">
                {/* Page Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                My Sponsorships
                            </h1>
                            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                                Manage your sponsorship applications and
                                received sponsorships
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                        </div>
                    </div>
                </div>

                {/* Mobile Filter Toggle */}
                {isMobile && (
                    <div className="mb-4">
                        <button
                            onClick={() =>
                                setShowMobileFilters(!showMobileFilters)
                            }
                            className="btn btn-outline btn-sm w-full justify-between"
                        >
                            <span className="flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                Filters
                            </span>
                            <ChevronRight
                                className={`w-4 h-4 transition-transform ${
                                    showMobileFilters ? "rotate-90" : ""
                                }`}
                            />
                        </button>
                        {showMobileFilters && (
                            <div className="mt-2 p-3 bg-base-100 rounded-lg border border-base-300 shadow-sm">
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        "all",
                                        "completed",
                                        "pending",
                                        "rejected",
                                    ].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() =>
                                                setStatusFilter(status)
                                            }
                                            className={`btn btn-xs ${
                                                statusFilter === status
                                                    ? "btn-primary"
                                                    : "btn-ghost"
                                            }`}
                                        >
                                            {status.charAt(0).toUpperCase() +
                                                status.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="tabs tabs-boxed bg-base-200 p-1 mb-6 sm:mb-8">
                    <button
                        onClick={() => setActiveTab("received")}
                        className={`tab tab-lg flex-1 ${
                            activeTab === "received" ? "tab-active" : ""
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <Heart className="w-4 h-4" />
                            Received
                            <span className="badge badge-sm badge-primary">
                                {filteredSponsorships.length}
                            </span>
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab("applications")}
                        className={`tab tab-lg flex-1 ${
                            activeTab === "applications" ? "tab-active" : ""
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Applications
                            <span className="badge badge-sm badge-primary">
                                {filteredApplications.length}
                            </span>
                        </span>
                    </button>
                </div>

                {/* Stats Cards - Only for received tab */}
                {activeTab === "received" && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                        {[
                            {
                                label: "Total Sponsored",
                                value: formatCurrency(
                                    stats?.total_sponsored || 0
                                ),
                                icon: DollarSign,
                                color: "bg-blue-100 text-blue-600",
                            },
                            {
                                label: "Completed",
                                value: stats?.completed_sponsorships || 0,
                                icon: CheckCircle,
                                color: "bg-green-100 text-green-600",
                            },
                            {
                                label: "Total Sponsorships",
                                value: stats?.total_sponsorships || 0,
                                icon: BarChart3,
                                color: "bg-purple-100 text-purple-600",
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="card bg-base-100 shadow-sm border border-base-300"
                            >
                                <div className="card-body p-4 sm:p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs sm:text-sm font-medium text-base-content/70 mb-1">
                                                {item.label}
                                            </p>
                                            <p className="text-xl sm:text-2xl font-bold">
                                                {item.value}
                                            </p>
                                        </div>
                                        <div
                                            className={`p-2 sm:p-3 rounded-full ${item.color}`}
                                        >
                                            <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Desktop Filter Bar */}
                {!isMobile && (
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">
                                Filter by status:
                            </span>
                            <div className="flex gap-1">
                                {[
                                    "all",
                                    "completed",
                                    "pending",
                                    "rejected",
                                ].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setStatusFilter(status)}
                                        className={`btn btn-xs ${
                                            statusFilter === status
                                                ? "btn-primary"
                                                : "btn-ghost"
                                        }`}
                                    >
                                        {status.charAt(0).toUpperCase() +
                                            status.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Received Sponsorships Tab */}
                {activeTab === "received" && (
                    <div className="card bg-base-100 shadow-sm border border-base-300">
                        <div className="card-body p-0">
                            {filteredSponsorships.length > 0 ? (
                                <div className="divide-y divide-base-300">
                                    {filteredSponsorships.map((s) => (
                                        <div
                                            key={s.id}
                                            className="p-4 sm:p-6 hover:bg-base-100/50 transition-colors"
                                        >
                                            <div className="flex flex-col lg:flex-row gap-4">
                                                <div className="flex-1">
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                                                        {getStatusBadge(
                                                            s.status
                                                        )}
                                                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                                                            {s.project}
                                                        </h3>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                                        <div className="flex items-center gap-2 text-base-content/70">
                                                            <User className="w-4 h-4" />
                                                            <span>
                                                                <strong>
                                                                    Donor:
                                                                </strong>{" "}
                                                                {getDonorName(
                                                                    s
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-base-content/70">
                                                            <Building className="w-4 h-4" />
                                                            <span>
                                                                <strong>
                                                                    Organization:
                                                                </strong>{" "}
                                                                {s.organization}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-base-content/70">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>
                                                                <strong>
                                                                    Date:
                                                                </strong>{" "}
                                                                {s.date}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-base-content/70">
                                                            <DollarSign className="w-4 h-4" />
                                                            <span>
                                                                <strong>
                                                                    Amount:
                                                                </strong>{" "}
                                                                {formatCurrency(
                                                                    s.amount
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {s.processed_amount !==
                                                        s.amount && (
                                                        <div className="mt-3 text-sm text-warning">
                                                            Processed:{" "}
                                                            {formatCurrency(
                                                                s.processed_amount
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col items-start lg:items-end gap-3">
                                                    <div className="text-right">
                                                        <p className="text-xl sm:text-2xl font-bold text-success">
                                                            {formatCurrency(
                                                                s.amount
                                                            )}
                                                        </p>
                                                    </div>

                                                    {s.status === "completed" &&
                                                        !s.is_anonymous &&
                                                        (hasSentAppreciation(
                                                            s
                                                        ) ? (
                                                            <div className="badge badge-success badge-outline gap-1">
                                                                <Check className="w-3 h-3" />
                                                                Appreciation
                                                                Sent
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() =>
                                                                    handleSendAppreciation(
                                                                        s
                                                                    )
                                                                }
                                                                className="btn btn-primary btn-sm sm:btn-md gap-2"
                                                            >
                                                                <Send className="w-4 h-4" />
                                                                Send
                                                                Appreciation
                                                            </button>
                                                        ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 sm:p-12 text-center">
                                    <div className="max-w-md mx-auto">
                                        <div className="bg-base-200 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                            <Heart className="w-8 h-8 text-base-content/40" />
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-700 mb-2">
                                            No Sponsorships Yet
                                        </h4>
                                        <p className="text-base-content/70 mb-6 text-sm">
                                            You haven't received any
                                            sponsorships yet. Start by applying
                                            for sponsorship for your volunteer
                                            projects.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Volunteer Sponsorship Applications Tab */}
                {activeTab === "applications" && (
                    <div className="card bg-base-100 shadow-sm border border-base-300">
                        <div className="card-body p-0">
                            {filteredApplications.length > 0 ? (
                                <div className="divide-y divide-base-300">
                                    {filteredApplications.map((application) => (
                                        <div
                                            key={application.public_id}
                                            className="p-4 sm:p-6 hover:bg-base-100/50"
                                        >
                                            <div className="space-y-4">
                                                {/* Header */}
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        {getStatusBadge(
                                                            application.status
                                                        )}
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900">
                                                                {application
                                                                    .booking
                                                                    ?.project
                                                                    ?.title ||
                                                                    "Unknown Project"}
                                                            </h3>
                                                            <p className="text-sm text-gray-500">
                                                                Applied{" "}
                                                                {new Date(
                                                                    application.created_at
                                                                ).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex gap-2">
                                                        {canEditApplication(
                                                            application
                                                        ) && (
                                                            <button
                                                                onClick={() =>
                                                                    handleEditApplication(
                                                                        application
                                                                    )
                                                                }
                                                                className="btn btn-outline btn-sm gap-2"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                                Edit
                                                            </button>
                                                        )}
                                                        {canSubmitApplication(
                                                            application
                                                        ) && (
                                                            <button
                                                                onClick={() =>
                                                                    handleSubmitForReview(
                                                                        application.public_id
                                                                    )
                                                                }
                                                                className="btn btn-success btn-sm gap-2"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                                Submit for
                                                                Review
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Funding Overview */}
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                    <div className="bg-base-200 p-4 rounded-lg">
                                                        <h4 className="font-semibold text-sm mb-3 text-base-content/70">
                                                            Funding Breakdown
                                                        </h4>
                                                        <div className="space-y-2">
                                                            {[
                                                                {
                                                                    label: "Travel",
                                                                    value: application.travel,
                                                                },
                                                                {
                                                                    label: "Accommodation",
                                                                    value: application.accommodation,
                                                                },
                                                                {
                                                                    label: "Meals",
                                                                    value: application.meals,
                                                                },
                                                                {
                                                                    label: "Living Expenses",
                                                                    value: application.living_expenses,
                                                                },
                                                                {
                                                                    label: "Visa Fees",
                                                                    value: application.visa_fees,
                                                                },
                                                            ].map(
                                                                (
                                                                    item,
                                                                    index
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="flex justify-between text-sm"
                                                                    >
                                                                        <span className="text-base-content/70">
                                                                            {
                                                                                item.label
                                                                            }
                                                                        </span>
                                                                        <span className="font-medium">
                                                                            {formatCurrency(
                                                                                item.value
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                )
                                                            )}
                                                            <div className="border-t border-base-300 pt-2 mt-2">
                                                                <div className="flex justify-between font-semibold">
                                                                    <span>
                                                                        Total
                                                                    </span>
                                                                    <span className="text-success">
                                                                        {formatCurrency(
                                                                            application.total_amount
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-base-200 p-4 rounded-lg">
                                                        <h4 className="font-semibold text-sm mb-3 text-base-content/70">
                                                            Funding Progress
                                                        </h4>
                                                        <div className="space-y-3">
                                                            <div>
                                                                <div className="flex justify-between text-sm mb-1">
                                                                    <span>
                                                                        Funded
                                                                    </span>
                                                                    <span className="font-semibold">
                                                                        {formatCurrency(
                                                                            application.funded_amount
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                <div className="w-full bg-base-300 rounded-full h-2">
                                                                    <div
                                                                        className="bg-success h-2 rounded-full transition-all duration-500"
                                                                        style={{
                                                                            width: `${Math.min(
                                                                                (application.funded_amount /
                                                                                    application.total_amount) *
                                                                                    100,
                                                                                100
                                                                            )}%`,
                                                                        }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                            <div className="text-center">
                                                                <p className="text-2xl font-bold text-success">
                                                                    {Math.round(
                                                                        (application.funded_amount /
                                                                            application.total_amount) *
                                                                            100
                                                                    )}
                                                                    %
                                                                </p>
                                                                <p className="text-xs text-base-content/70">
                                                                    Funding
                                                                    Progress
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-base-200 p-4 rounded-lg">
                                                        <h4 className="font-semibold text-sm mb-3 text-base-content/70">
                                                            Details
                                                        </h4>
                                                        <div className="space-y-3">
                                                            {application
                                                                .aspect_needs_funding
                                                                ?.length >
                                                                0 && (
                                                                <div>
                                                                    <p className="text-sm font-medium mb-2">
                                                                        Priority
                                                                        Areas
                                                                    </p>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {application.aspect_needs_funding
                                                                            .slice(
                                                                                0,
                                                                                3
                                                                            )
                                                                            .map(
                                                                                (
                                                                                    aspect,
                                                                                    index
                                                                                ) => (
                                                                                    <span
                                                                                        key={
                                                                                            index
                                                                                        }
                                                                                        className="badge badge-sm badge-outline"
                                                                                    >
                                                                                        {
                                                                                            aspect
                                                                                        }
                                                                                    </span>
                                                                                )
                                                                            )}
                                                                        {application
                                                                            .aspect_needs_funding
                                                                            .length >
                                                                            3 && (
                                                                            <span className="badge badge-sm badge-ghost">
                                                                                +
                                                                                {application
                                                                                    .aspect_needs_funding
                                                                                    .length -
                                                                                    3}{" "}
                                                                                more
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Introduction & Impact */}
                                                {(application.self_introduction ||
                                                    application.impact) && (
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                        {application.self_introduction && (
                                                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                                    <User className="w-4 h-4 text-blue-600" />
                                                                    Self
                                                                    Introduction
                                                                </h4>
                                                                <p className="text-sm text-gray-700 line-clamp-3">
                                                                    {
                                                                        application.self_introduction
                                                                    }
                                                                </p>
                                                            </div>
                                                        )}
                                                        {application.impact && (
                                                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                                    <Target className="w-4 h-4 text-purple-600" />
                                                                    Expected
                                                                    Impact
                                                                </h4>
                                                                <p className="text-sm text-gray-700 line-clamp-3">
                                                                    {
                                                                        application.impact
                                                                    }
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 sm:p-12 text-center">
                                    <div className="max-w-md mx-auto">
                                        <div className="bg-base-200 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                            <FileText className="w-8 h-8 text-base-content/40" />
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-700 mb-2">
                                            No Applications Yet
                                        </h4>
                                        <p className="text-base-content/70 mb-6 text-sm">
                                            You haven't submitted any
                                            sponsorship applications yet.
                                        </p>
                                        {/* <button className="btn btn-primary gap-2">
                                            <Plus className="w-4 h-4" />
                                            Start Your First Application
                                        </button> */}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Information Panel */}
                <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="card bg-info/5 border border-info/20">
                        <div className="card-body p-4 sm:p-6">
                            <h4 className="card-title text-lg font-semibold mb-3 flex items-center gap-2">
                                <Info className="w-5 h-5 text-info" />
                                How Sponsorships Work
                            </h4>
                            <ul className="space-y-2 text-sm sm:text-base">
                                <li className="flex items-start gap-2">
                                    <div className="badge badge-info badge-xs mt-1">
                                        ✓
                                    </div>
                                    <span>
                                        <strong>Apply for sponsorship</strong>{" "}
                                        to fund your volunteer projects
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="badge badge-info badge-xs mt-1">
                                        ✓
                                    </div>
                                    <span>
                                        <strong>Get sponsored</strong> by
                                        individuals or organizations
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="badge badge-info badge-xs mt-1">
                                        ✓
                                    </div>
                                    <span>
                                        <strong>Show appreciation</strong> to
                                        your sponsors with thank-you messages
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="card bg-success/5 border border-success/20">
                        <div className="card-body p-4 sm:p-6">
                            <h4 className="card-title text-lg font-semibold mb-3 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-success" />
                                Tips for Success
                            </h4>
                            <div className="space-y-3 text-sm sm:text-base">
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2">
                                        <Check className="w-4 h-4 text-success mt-0.5" />
                                        <span>
                                            Be specific about how funds will be
                                            used
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="w-4 h-4 text-success mt-0.5" />
                                        <span>
                                            Share your passion and expected
                                            impact
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="w-4 h-4 text-success mt-0.5" />
                                        <span>
                                            Always thank your sponsors promptly
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </VolunteerLayout>
    );
}
