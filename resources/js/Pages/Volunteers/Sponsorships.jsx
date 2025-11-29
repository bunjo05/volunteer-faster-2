import React, { useState, useEffect } from "react";
import VolunteerLayout from "@/Layouts/VolunteerLayout";
import { Head, useForm, router } from "@inertiajs/react";

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
    const [activeTab, setActiveTab] = useState("received"); // 'received' or 'applications'
    const [originalApplicationData, setOriginalApplicationData] =
        useState(null);
    const [hasChanges, setHasChanges] = useState(false);

    const { data, setData, post, errors, reset } = useForm({
        message: "",
        sponsorship_public_id: "",
    });

    // Form for editing applications
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
        }
    }, [success, show_success_modal]);

    // Track changes in edit form
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
        }).format(amount);

    const canResubmitApplication = (application) => {
        return application.status === "Rejected";
    };

    const handleResubmitApplication = (applicationId) => {
        if (
            !confirm(
                "Are you sure you want to resubmit this application? It will be sent for review again and the status will be changed to Pending."
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
        const statusStyles = {
            completed: "bg-green-100 text-green-700 border border-green-300",
            pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",
            failed: "bg-red-100 text-red-700 border border-red-300",
            refunded: "bg-gray-100 text-gray-700 border border-gray-300",
            submitted: "bg-blue-100 text-blue-700 border border-blue-300",
            under_review:
                "bg-purple-100 text-purple-700 border border-purple-300",
            approved: "bg-green-100 text-green-700 border border-green-300",
            rejected: "bg-red-100 text-red-700 border border-red-300",
            draft: "bg-gray-100 text-gray-700 border border-gray-300",
            Pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",
        };

        return (
            <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    statusStyles[status] ?? statusStyles.pending
                }`}
            >
                {status.charAt(0).toUpperCase() +
                    status.slice(1).replace("_", " ")}
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

    // Edit Application Functions
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

        // Calculate total amount
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
                "Are you sure you want to submit this application for review? The status will be changed to Pending and you won't be able to edit it after submission."
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

    const AppreciationModal = () =>
        showAppreciationModal && selectedSponsorship ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm overflow-y-auto">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 animate-scale-in my-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                        Send Appreciation
                    </h3>
                    <p className="mt-2 text-gray-600 text-sm">
                        Write a thank‑you message to{" "}
                        {getDonorName(selectedSponsorship)} for supporting your
                        project "{selectedSponsorship.project}".
                    </p>

                    <form
                        onSubmit={submitAppreciation}
                        className="mt-4 space-y-4"
                    >
                        <textarea
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-3 resize-y min-h-[120px]"
                            rows={5}
                            placeholder="Write your appreciation message..."
                            value={data.message}
                            onChange={(e) => setData("message", e.target.value)}
                            disabled={isSubmitting}
                            required
                        ></textarea>
                        {errors.message && (
                            <p className="text-red-600 text-sm">
                                {errors.message}
                            </p>
                        )}

                        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAppreciationModal(false);
                                    setSelectedSponsorship(null);
                                    reset();
                                }}
                                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50 transition-colors"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting || !data.message.trim()}
                                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow transition disabled:opacity-50"
                            >
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        ) : null;

    const EditApplicationModal = () =>
        showEditModal && selectedApplication ? (
            <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl p-4 sm:p-6 lg:p-8 animate-scale-in my-4 max-h-[95vh] overflow-y-auto">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-6 border-b border-gray-200">
                        <div className="mb-4 sm:mb-0">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                                Edit Sponsorship Application
                            </h3>
                            <p className="text-gray-600 mt-2 text-sm sm:text-base">
                                Update your sponsorship request for{" "}
                                <span className="font-semibold text-blue-600">
                                    {selectedApplication.booking?.project
                                        ?.title || "Unknown Project"}
                                </span>
                            </p>
                            {hasChanges && (
                                <div className="flex items-center gap-2 mt-2 text-amber-600 text-sm">
                                    <svg
                                        className="w-4 h-4"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span>You have unsaved changes</span>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => {
                                if (
                                    hasChanges &&
                                    !confirm(
                                        "You have unsaved changes. Are you sure you want to cancel?"
                                    )
                                ) {
                                    return;
                                }
                                setShowEditModal(false);
                                setSelectedApplication(null);
                                resetEditForm();
                                setOriginalApplicationData(null);
                                setHasChanges(false);
                            }}
                            className="self-end sm:self-auto p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <svg
                                className="w-6 h-6 text-gray-500"
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

                    <form
                        onSubmit={handleUpdateApplication}
                        className="space-y-6 lg:space-y-8"
                    >
                        {/* Funding Breakdown Section */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl border border-blue-100">
                            <div className="flex items-center gap-3 mb-4 sm:mb-6">
                                <div className="bg-blue-600 p-2 rounded-lg">
                                    <svg
                                        className="w-5 h-5 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                        />
                                    </svg>
                                </div>
                                <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                                    Funding Requirements
                                </h4>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                    {
                                        label: "Travel Expenses",
                                        name: "travel",
                                        description:
                                            "Flights, local transportation, etc.",
                                        icon: "✈️",
                                    },
                                    {
                                        label: "Accommodation",
                                        name: "accommodation",
                                        description:
                                            "Housing costs during the project",
                                        icon: "🏠",
                                    },
                                    {
                                        label: "Meals & Food",
                                        name: "meals",
                                        description:
                                            "Daily food and nutrition expenses",
                                        icon: "🍽️",
                                    },
                                    {
                                        label: "Living Expenses",
                                        name: "living_expenses",
                                        description:
                                            "Daily necessities and miscellaneous",
                                        icon: "💰",
                                    },
                                    {
                                        label: "Visa & Documentation",
                                        name: "visa_fees",
                                        description:
                                            "Visa fees and required documents",
                                        icon: "📋",
                                    },
                                    {
                                        label: "Project Contribution",
                                        name: "project_fees_amount",
                                        description:
                                            "Direct project support fees",
                                        icon: "🤝",
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.name}
                                        className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">
                                                    {item.icon}
                                                </span>
                                                <label className="block text-sm font-semibold text-gray-800">
                                                    {item.label}
                                                </label>
                                            </div>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2 text-gray-500 text-sm">
                                                    $
                                                </span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    className="w-full sm:w-32 pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                                                    value={
                                                        editFormData[item.name]
                                                    }
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
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            {item.description}
                                        </p>
                                        {editErrors[item.name] && (
                                            <p className="text-red-600 text-xs mt-1">
                                                {editErrors[item.name]}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Total Amount Summary */}
                            <div className="mt-4 sm:mt-6 p-4 bg-white rounded-lg border-2 border-blue-200 shadow-sm">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Total Funding Request
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            This amount will be shown to
                                            potential sponsors
                                        </p>
                                    </div>
                                    <div className="text-right mt-2 sm:mt-0">
                                        <p className="text-xl sm:text-2xl font-bold text-blue-600">
                                            {formatCurrency(calculateTotal())}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Auto-calculated total
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Application Details Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                            {/* Self Introduction */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-600 p-2 rounded-lg">
                                        <svg
                                            className="w-5 h-5 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                    </div>
                                    <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                                        Personal Introduction
                                    </h4>
                                </div>

                                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Tell us about yourself
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </label>
                                    <textarea
                                        className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm p-3 min-h-[120px] resize-y transition-all"
                                        placeholder="Share your background, experience, and what motivates you to participate in this project. This helps sponsors understand your passion and commitment..."
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
                                            /2000 characters
                                        </p>
                                        {editFormData.self_introduction.length >
                                            0 && (
                                            <p
                                                className={`text-xs ${
                                                    editFormData
                                                        .self_introduction
                                                        .length > 1800
                                                        ? "text-orange-500"
                                                        : "text-green-500"
                                                }`}
                                            >
                                                {editFormData.self_introduction
                                                    .length > 1800
                                                    ? "Getting long"
                                                    : "Good length"}
                                            </p>
                                        )}
                                    </div>
                                    {editErrors.self_introduction && (
                                        <p className="text-red-600 text-sm mt-2">
                                            {editErrors.self_introduction}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Impact Statement */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-purple-600 p-2 rounded-lg">
                                        <svg
                                            className="w-5 h-5 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                            />
                                        </svg>
                                    </div>
                                    <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                                        Expected Impact
                                    </h4>
                                </div>

                                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Describe your potential impact
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </label>
                                    <textarea
                                        className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm p-3 min-h-[120px] resize-y transition-all"
                                        placeholder="Explain how your participation will benefit the project, community, or cause. What specific outcomes do you hope to achieve? This helps sponsors see the value of their investment..."
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
                                            characters
                                        </p>
                                        {editFormData.impact.length > 0 && (
                                            <p
                                                className={`text-xs ${
                                                    editFormData.impact.length >
                                                    1800
                                                        ? "text-orange-500"
                                                        : "text-green-500"
                                                }`}
                                            >
                                                {editFormData.impact.length >
                                                1800
                                                    ? "Getting long"
                                                    : "Good length"}
                                            </p>
                                        )}
                                    </div>
                                    {editErrors.impact && (
                                        <p className="text-red-600 text-sm mt-2">
                                            {editErrors.impact}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Skills and Funding Priorities */}
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 sm:p-6 rounded-xl border border-orange-100">
                            <div className="flex items-center gap-3 mb-4 sm:mb-6">
                                <div className="bg-orange-600 p-2 rounded-lg">
                                    <svg
                                        className="w-5 h-5 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                        />
                                    </svg>
                                </div>
                                <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                                    Additional Information
                                </h4>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                {/* Skills */}
                                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Relevant Skills & Expertise
                                    </label>
                                    <textarea
                                        className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm p-3 min-h-[80px] resize-y transition-all"
                                        placeholder="List any skills, qualifications, or experiences that make you well-suited for this project..."
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
                                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Funding Priority Areas
                                    </label>
                                    <textarea
                                        className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm p-3 min-h-[80px] resize-y transition-all"
                                        placeholder="Which aspects of your funding request are most critical? (e.g., travel, accommodation, project fees)..."
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
                        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200 gap-4">
                            <div className="text-sm text-gray-500 text-center sm:text-left">
                                <p>
                                    Review all information carefully before
                                    submitting
                                </p>
                                {hasChanges && (
                                    <p className="text-amber-600 font-medium mt-1">
                                        You have unsaved changes
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (
                                            hasChanges &&
                                            !confirm(
                                                "You have unsaved changes. Are you sure you want to cancel?"
                                            )
                                        ) {
                                            return;
                                        }
                                        setShowEditModal(false);
                                        setSelectedApplication(null);
                                        resetEditForm();
                                        setOriginalApplicationData(null);
                                        setHasChanges(false);
                                    }}
                                    className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200"
                                    disabled={editProcessing}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={editProcessing || !hasChanges}
                                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {editProcessing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
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
        ) : null;

    const SuccessModal = () =>
        showSuccessModal ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm overflow-y-auto">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center animate-scale-in mx-4 my-4">
                    <div className="flex justify-center mb-3">
                        <div className="bg-green-100 p-3 rounded-full">
                            <svg
                                className="w-7 h-7 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                        Success!
                    </h3>
                    <p className="mt-2 text-gray-600 text-sm">
                        {selectedApplication
                            ? "Application updated successfully!"
                            : "Your appreciation message has been delivered successfully."}
                    </p>
                    <button
                        onClick={() => setShowSuccessModal(false)}
                        className="mt-5 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow w-full sm:w-auto"
                    >
                        Continue
                    </button>
                </div>
            </div>
        ) : null;

    return (
        <VolunteerLayout auth={auth}>
            <Head title="My Sponsorships" />

            <AppreciationModal />
            <EditApplicationModal />
            <SuccessModal />

            <div className="max-w-7xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
                <div className="mb-8 sm:mb-10">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        My Sponsorships
                    </h1>
                    <p className="text-gray-600 mt-2 text-sm sm:text-base">
                        Manage your sponsorship applications and received
                        sponsorships.
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="mb-6 sm:mb-8 border-b border-gray-200 overflow-x-auto">
                    <nav className="flex space-x-8 min-w-max">
                        <button
                            onClick={() => setActiveTab("received")}
                            className={`whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === "received"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            Received Sponsorships
                            {sponsorships.length > 0 && (
                                <span className="ml-2 bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-xs">
                                    {sponsorships.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab("applications")}
                            className={`whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === "applications"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            My Applications
                            {volunteer_sponsorships.length > 0 && (
                                <span className="ml-2 bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-xs">
                                    {volunteer_sponsorships.length}
                                </span>
                            )}
                        </button>
                    </nav>
                </div>

                {/* Stats - Only show for received sponsorships */}
                {activeTab === "received" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
                        {[
                            {
                                label: "Total Sponsored",
                                value: formatCurrency(stats.total_sponsored),
                                iconColor: "text-blue-600",
                            },
                            {
                                label: "Completed Sponsorships",
                                value: stats.completed_sponsorships,
                                iconColor: "text-green-600",
                            },
                            {
                                label: "Total Sponsorships",
                                value: stats.total_sponsorships,
                                iconColor: "text-purple-600",
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-xl sm:rounded-2xl shadow p-4 sm:p-6 flex items-center space-x-4"
                            >
                                <div
                                    className={`rounded-full bg-gray-100 p-3 ${item.iconColor}`}
                                >
                                    ★
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">
                                        {item.label}
                                    </p>
                                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                                        {item.value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Received Sponsorships Tab */}
                {activeTab === "received" && (
                    <div className="bg-white shadow rounded-xl sm:rounded-2xl overflow-hidden">
                        {sponsorships.length ? (
                            <div className="max-h-[600px] overflow-y-auto">
                                {sponsorships.map((s) => (
                                    <div
                                        key={s.id}
                                        className="px-4 sm:px-6 py-4 sm:py-5 border-b last:border-0 hover:bg-gray-50 transition"
                                    >
                                        <div className="flex flex-col lg:flex-row justify-between">
                                            <div className="flex-1">
                                                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                                                    {getStatusBadge(s.status)}
                                                    <h3 className="text-lg font-semibold text-gray-900 break-words">
                                                        {s.project}
                                                    </h3>
                                                </div>
                                                <div className="mt-2 text-sm text-gray-600 space-y-1">
                                                    <p>
                                                        <b>Donor:</b>{" "}
                                                        {getDonorName(s)}
                                                    </p>
                                                    <p>
                                                        <b>Organization:</b>{" "}
                                                        {s.organization}
                                                    </p>
                                                    <p>
                                                        <b>Date:</b> {s.date}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4 lg:mt-0 text-left lg:text-right">
                                                <p className="text-xl sm:text-2xl font-bold text-green-600">
                                                    {formatCurrency(s.amount)}
                                                </p>
                                                {s.processed_amount !==
                                                    s.amount && (
                                                    <p className="text-gray-500 text-sm">
                                                        Processed:{" "}
                                                        {formatCurrency(
                                                            s.processed_amount
                                                        )}
                                                    </p>
                                                )}

                                                {/* Appreciation Button */}
                                                {s.status === "completed" &&
                                                    !s.is_anonymous &&
                                                    (hasSentAppreciation(s) ? (
                                                        <div className="mt-3 inline-flex items-center text-green-700 bg-green-100 px-3 py-1 rounded-lg text-sm border border-green-300">
                                                            ✓ Appreciation Sent
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                handleSendAppreciation(
                                                                    s
                                                                )
                                                            }
                                                            className="mt-3 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 w-full lg:w-auto"
                                                        >
                                                            Send Appreciation
                                                        </button>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 sm:py-14 text-gray-500 px-4">
                                <div className="mb-4">
                                    <svg
                                        className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1}
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No Sponsorships Yet
                                </h3>
                                <p className="text-gray-500 text-sm sm:text-base">
                                    You haven't received any sponsorships yet.
                                    Start by applying for sponsorship for your
                                    volunteer projects.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Volunteer Sponsorship Applications Tab */}
                {activeTab === "applications" && (
                    <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
                        {volunteer_sponsorships.length ? (
                            <div className="max-h-[600px] overflow-y-auto">
                                {volunteer_sponsorships.map((application) => (
                                    <div
                                        key={application.public_id}
                                        className="px-6 py-6 border-b border-gray-100 last:border-0 hover:bg-gray-50/80 transition-all duration-200 group"
                                    >
                                        <div className="flex flex-col lg:flex-row justify-between gap-6">
                                            <div className="flex-1 space-y-4">
                                                {/* Header Section */}
                                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                                        {getStatusBadge(
                                                            application.status ||
                                                                "submitted"
                                                        )}
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                                                                {application
                                                                    .booking
                                                                    ?.project
                                                                    ?.title ||
                                                                    "Unknown Project"}
                                                            </h3>
                                                            <p className="text-sm text-gray-500 mt-1">
                                                                Applied on{" "}
                                                                {new Date(
                                                                    application.created_at
                                                                ).toLocaleDateString(
                                                                    "en-US",
                                                                    {
                                                                        year: "numeric",
                                                                        month: "long",
                                                                        day: "numeric",
                                                                    }
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex flex-wrap gap-2">
                                                        {canEditApplication(
                                                            application
                                                        ) && (
                                                            <button
                                                                onClick={() =>
                                                                    handleEditApplication(
                                                                        application
                                                                    )
                                                                }
                                                                className="px-4 py-2 text-sm bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center gap-2"
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
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                                    />
                                                                </svg>
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
                                                                className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center gap-2"
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
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                    />
                                                                </svg>
                                                                Submit for
                                                                Review
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Content Grid */}
                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                    {/* Funding Breakdown */}
                                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                            <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                                                                Funding
                                                                Breakdown
                                                            </h4>
                                                        </div>
                                                        <div className="space-y-3">
                                                            {[
                                                                {
                                                                    label: "Travel",
                                                                    value:
                                                                        application.travel ||
                                                                        0,
                                                                },
                                                                {
                                                                    label: "Accommodation",
                                                                    value:
                                                                        application.accommodation ||
                                                                        0,
                                                                },
                                                                {
                                                                    label: "Meals",
                                                                    value:
                                                                        application.meals ||
                                                                        0,
                                                                },
                                                                {
                                                                    label: "Living Expenses",
                                                                    value:
                                                                        application.living_expenses ||
                                                                        0,
                                                                },
                                                                {
                                                                    label: "Visa Fees",
                                                                    value:
                                                                        application.visa_fees ||
                                                                        0,
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
                                                                        className="flex justify-between items-center"
                                                                    >
                                                                        <span className="text-sm text-gray-600">
                                                                            {
                                                                                item.label
                                                                            }
                                                                        </span>
                                                                        <span className="font-medium text-gray-900 text-sm">
                                                                            {formatCurrency(
                                                                                item.value
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                )
                                                            )}
                                                            <div className="border-t border-gray-300 pt-3 mt-2">
                                                                <div className="flex justify-between items-center">
                                                                    <span className="font-semibold text-gray-900">
                                                                        Total
                                                                        Requested
                                                                    </span>
                                                                    <span className="font-bold text-green-600 text-lg">
                                                                        {formatCurrency(
                                                                            application.total_amount ||
                                                                                0
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Application Details */}
                                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                                            <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                                                                Application
                                                                Details
                                                            </h4>
                                                        </div>
                                                        <div className="space-y-3">
                                                            <div>
                                                                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                                                                    Project
                                                                </p>
                                                                <p className="text-sm font-medium text-gray-900 mt-1">
                                                                    {application
                                                                        .booking
                                                                        ?.project
                                                                        ?.title ||
                                                                        "N/A"}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                                                                    Funded
                                                                    Amount
                                                                </p>
                                                                <p className="text-lg font-bold text-emerald-600 mt-1">
                                                                    {formatCurrency(
                                                                        application.funded_amount ||
                                                                            0
                                                                    )}
                                                                </p>
                                                            </div>
                                                            {application.aspect_needs_funding &&
                                                                application
                                                                    .aspect_needs_funding
                                                                    .length >
                                                                    0 && (
                                                                    <div>
                                                                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                                                                            Priority
                                                                            Areas
                                                                        </p>
                                                                        <div className="flex flex-wrap gap-1 mt-2">
                                                                            {application.aspect_needs_funding.map(
                                                                                (
                                                                                    aspect,
                                                                                    index
                                                                                ) => (
                                                                                    <span
                                                                                        key={
                                                                                            index
                                                                                        }
                                                                                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium"
                                                                                    >
                                                                                        {
                                                                                            aspect
                                                                                        }
                                                                                    </span>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </div>

                                                    {/* Progress & Skills */}
                                                    <div className="space-y-4">
                                                        {/* Funding Progress */}
                                                        {application.total_amount >
                                                            0 && (
                                                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                                <div className="flex items-center justify-between mb-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                                        <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                                                                            Funding
                                                                            Progress
                                                                        </h4>
                                                                    </div>
                                                                    <span className="text-sm font-semibold text-gray-700">
                                                                        {Math.round(
                                                                            (application.funded_amount /
                                                                                application.total_amount) *
                                                                                100
                                                                        )}
                                                                        %
                                                                    </span>
                                                                </div>
                                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                                    <div
                                                                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-2.5 rounded-full transition-all duration-500"
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
                                                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                                                    <span>
                                                                        Funded:{" "}
                                                                        {formatCurrency(
                                                                            application.funded_amount ||
                                                                                0
                                                                        )}
                                                                    </span>
                                                                    <span>
                                                                        Goal:{" "}
                                                                        {formatCurrency(
                                                                            application.total_amount ||
                                                                                0
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Skills */}
                                                        {application.skills &&
                                                            application.skills
                                                                .length > 0 && (
                                                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                                    <div className="flex items-center gap-2 mb-3">
                                                                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                                                        <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                                                                            Skills
                                                                            &
                                                                            Expertise
                                                                        </h4>
                                                                    </div>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {application.skills
                                                                            .slice(
                                                                                0,
                                                                                4
                                                                            )
                                                                            .map(
                                                                                (
                                                                                    skill,
                                                                                    index
                                                                                ) => (
                                                                                    <span
                                                                                        key={
                                                                                            index
                                                                                        }
                                                                                        className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded font-medium"
                                                                                    >
                                                                                        {
                                                                                            skill
                                                                                        }
                                                                                    </span>
                                                                                )
                                                                            )}
                                                                        {application
                                                                            .skills
                                                                            .length >
                                                                            4 && (
                                                                            <span className="inline-block bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded font-medium">
                                                                                +
                                                                                {application
                                                                                    .skills
                                                                                    .length -
                                                                                    4}{" "}
                                                                                more
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                    </div>
                                                </div>

                                                {/* Introduction & Impact */}
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                    {application.self_introduction && (
                                                        <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
                                                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                                <svg
                                                                    className="w-4 h-4 text-blue-600"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                                    />
                                                                </svg>
                                                                Self
                                                                Introduction
                                                            </h4>
                                                            <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                                                                {
                                                                    application.self_introduction
                                                                }
                                                            </p>
                                                        </div>
                                                    )}

                                                    {application.impact && (
                                                        <div className="bg-purple-50/50 rounded-lg p-4 border border-purple-100">
                                                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                                <svg
                                                                    className="w-4 h-4 text-purple-600"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                                                    />
                                                                </svg>
                                                                Expected Impact
                                                            </h4>
                                                            <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                                                                {
                                                                    application.impact
                                                                }
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 px-6">
                                <div className="max-w-md mx-auto">
                                    <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                        <svg
                                            className="w-10 h-10 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                        No Applications Yet
                                    </h3>
                                    <p className="text-gray-600 mb-8 leading-relaxed">
                                        You haven't submitted any sponsorship
                                        applications yet. Start your journey by
                                        creating your first application.
                                    </p>
                                    <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                                        Start Your First Application
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Information Section */}
                <div className="mt-8 sm:mt-10 bg-blue-50 p-4 sm:p-6 rounded-xl border border-blue-100">
                    <h3 className="text-blue-800 font-semibold text-sm sm:text-base">
                        About Sponsorships
                    </h3>
                    <p className="mt-2 text-blue-700 text-xs sm:text-sm">
                        {activeTab === "received"
                            ? "Sponsorships help support your volunteer work. Amounts displayed are what you receive after processing fees."
                            : "Track your sponsorship applications and funding progress. Update your applications as needed to increase your chances of getting sponsored."}
                    </p>
                </div>
            </div>
        </VolunteerLayout>
    );
}
