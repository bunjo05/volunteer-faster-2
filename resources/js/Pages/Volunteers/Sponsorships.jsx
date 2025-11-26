import React, { useState, useEffect } from "react";
import VolunteerLayout from "@/Layouts/VolunteerLayout";
import { Head, useForm } from "@inertiajs/react";

export default function Sponsorships({
    sponsorships,
    stats,
    auth,
    success,
    show_success_modal,
}) {
    const [showAppreciationModal, setShowAppreciationModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedSponsorship, setSelectedSponsorship] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, post, errors, reset } = useForm({
        message: "",
        sponsorship_public_id: "",
    });

    useEffect(() => {
        if (success || show_success_modal) {
            setShowSuccessModal(true);
        }
    }, [success, show_success_modal]);

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
        }).format(amount);

    const getStatusBadge = (status) => {
        const statusStyles = {
            completed: "bg-green-100 text-green-700 border border-green-300",
            pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",
            failed: "bg-red-100 text-red-700 border border-red-300",
            refunded: "bg-gray-100 text-gray-700 border border-gray-300",
        };

        return (
            <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    statusStyles[status] ?? statusStyles.pending
                }`}
            >
                {status.charAt(0).toUpperCase() + status.slice(1)}
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

    const AppreciationModal = () =>
        showAppreciationModal && selectedSponsorship ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 animate-scale-in">
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
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-3"
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

                        <div className="flex justify-end space-x-3 pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAppreciationModal(false);
                                    setSelectedSponsorship(null);
                                    reset();
                                }}
                                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50"
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

    const SuccessModal = () =>
        showSuccessModal ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center animate-scale-in">
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
                        Message Sent!
                    </h3>
                    <p className="mt-2 text-gray-600 text-sm">
                        Your appreciation message has been delivered
                        successfully.
                    </p>
                    <button
                        onClick={() => setShowSuccessModal(false)}
                        className="mt-5 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow"
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
            <SuccessModal />

            <div className="max-w-7xl mx-auto py-10 px-4 lg:px-8">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">
                        My Sponsorships
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Track your received sponsorships in one place.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
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
                            className="bg-white rounded-2xl shadow p-6 flex items-center space-x-4"
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
                                <p className="text-2xl font-bold text-gray-900">
                                    {item.value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sponsorship List */}
                <div className="bg-white shadow rounded-2xl overflow-hidden">
                    {sponsorships.length ? (
                        sponsorships.map((s) => (
                            <div
                                key={s.id}
                                className="px-6 py-5 border-b last:border-0 hover:bg-gray-50 transition"
                            >
                                <div className="flex flex-col lg:flex-row justify-between">
                                    <div>
                                        <div className="flex items-center space-x-3">
                                            {getStatusBadge(s.status)}
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {s.project}
                                            </h3>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-600 space-y-1">
                                            <p>
                                                <b>Donor:</b> {getDonorName(s)}
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

                                    <div className="mt-4 lg:mt-0 text-right">
                                        <p className="text-2xl font-bold text-green-600">
                                            {formatCurrency(s.amount)}
                                        </p>
                                        {s.processed_amount !== s.amount && (
                                            <p className="text-gray-500 text-sm">
                                                Processed:{" "}
                                                {formatCurrency(
                                                    s.processed_amount
                                                )}
                                            </p>
                                        )}

                                        {/* Button */}
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
                                                    className="mt-3 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                                                >
                                                    Send Appreciation
                                                </button>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-14 text-gray-500">
                            No sponsorships found.
                        </div>
                    )}
                </div>

                <div className="mt-10 bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <h3 className="text-blue-800 font-semibold">
                        About Sponsorships
                    </h3>
                    <p className="mt-2 text-blue-700 text-sm">
                        Sponsorships help support your volunteer work. Amounts
                        displayed are what you receive after processing fees.
                    </p>
                </div>
            </div>
        </VolunteerLayout>
    );
}
