import GeneralPages from "@/Layouts/GeneralPages";
import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";

export default function ViewIndividual({ sponsorship, relatedSponsorships }) {
    const [selectedItems, setSelectedItems] = useState({});
    const [customAmount, setCustomAmount] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [is_anonymous, setIsAnonymous] = useState(false);

    const progress =
        sponsorship.total_amount && sponsorship.funded_amount
            ? Math.min(
                  (sponsorship.funded_amount / sponsorship.total_amount) * 100,
                  100
              )
            : 0;

    if (!sponsorship) {
        return (
            <GeneralPages>
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center px-4">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Sponsorship Not Found
                        </h1>
                        <p className="text-gray-500 mt-2">
                            The sponsorship you're looking for doesn't exist.
                        </p>
                        <Link
                            href="/corporate-impact-sponsorship"
                            className="text-blue-600 hover:text-blue-800 mt-4 inline-block font-medium"
                        >
                            ← Back to all sponsorships
                        </Link>
                    </div>
                </div>
            </GeneralPages>
        );
    }

    const formatName = (fullName) => fullName || "Volunteer";
    const getInitials = (fullName) => {
        if (!fullName) return "V";
        const parts = fullName.trim().split(/\s+/);
        return parts.length === 1
            ? parts[0].charAt(0)
            : parts[0].charAt(0) + parts[parts.length - 1].charAt(0);
    };

    const fundingOptions = [
        { key: "travel", label: "Travel", amount: sponsorship.travel || 0 },
        {
            key: "accommodation",
            label: "Accommodation",
            amount: sponsorship.accommodation || 0,
        },
        { key: "meals", label: "Meals", amount: sponsorship.meals || 0 },
        {
            key: "living_expenses",
            label: "Living Expenses",
            amount: sponsorship.living_expenses || 0,
        },
        {
            key: "visa_fees",
            label: "Visa Fees",
            amount: sponsorship.visa_fees || 0,
        },
        {
            key: "project_fees_amount",
            label: "Project Fees",
            amount: sponsorship.project_fees_amount || 0,
        },
    ];

    const selectedAmount = fundingOptions.reduce(
        (total, option) =>
            total + (selectedItems[option.key] ? Number(option.amount) : 0),
        0
    );

    const totalAmount =
        customAmount.trim() !== "" && !isNaN(parseFloat(customAmount))
            ? parseFloat(customAmount)
            : selectedAmount;

    const handleCheckboxChange = (key) =>
        setSelectedItems((prev) => ({ ...prev, [key]: !prev[key] }));
    const handleCustomAmountChange = (e) => {
        const value = e.target.value;
        if (value === "" || (!isNaN(value) && parseFloat(value) >= 0)) {
            setCustomAmount(value);
            if (value !== "") setSelectedItems({});
        }
    };

    const initiatePayment = async () => {
        if (totalAmount <= 0) {
            alert(
                "Please select at least one funding option or enter a custom amount"
            );
            return;
        }
        setIsProcessing(true);
        try {
            const response = await fetch("/sponsorship/payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]'
                    ).content,
                },
                body: JSON.stringify({
                    sponsorship_public_id: sponsorship.public_id,
                    amount: totalAmount,
                    funding_allocation: selectedItems,
                    custom_amount: customAmount,
                    is_anonymous: is_anonymous,
                }),
            });
            const data = await response.json();
            if (!response.ok)
                throw new Error(
                    data.error || `HTTP error! status: ${response.status}`
                );
            if (data.sessionId) {
                const stripe = await loadStripe(
                    import.meta.env.VITE_STRIPE_KEY
                );
                const { error } = await stripe.redirectToCheckout({
                    sessionId: data.sessionId,
                });
                if (error)
                    alert("Payment initialization failed. Please try again.");
            }
        } catch (error) {
            alert(`Payment initialization failed: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const formatCurrency = (amount) => {
        if (isNaN(amount) || amount === null || amount === undefined)
            return "0.00";
        return amount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    return (
        <GeneralPages>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav
                        className="flex mb-6 text-sm text-gray-500"
                        aria-label="Breadcrumb"
                    >
                        <Link href="/" className="hover:text-gray-700">
                            Home
                        </Link>
                        <span className="mx-2">/</span>
                        <Link
                            href="/corporate-impact-sponsorship"
                            className="hover:text-gray-700"
                        >
                            Sponsorships
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-800 font-medium">
                            {formatName(sponsorship.user?.name)}
                        </span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Card */}
                        <div className="lg:col-span-2 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-3xl shadow-xl overflow-hidden"
                            >
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex items-center gap-4 text-white">
                                    {sponsorship.volunteer_profile
                                        ?.profile_picture ? (
                                        <img
                                            src={`/storage/${sponsorship.volunteer_profile.profile_picture}`}
                                            alt={formatName(
                                                sponsorship.user?.name
                                            )}
                                            className="w-16 h-16 rounded-full border-4 border-white/25 object-cover"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                            <span className="text-2xl font-bold">
                                                {getInitials(
                                                    sponsorship.user?.name
                                                )}
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        <h1 className="text-2xl font-semibold">
                                            {formatName(sponsorship.user?.name)}
                                        </h1>
                                        <p className="text-blue-100 font-medium">
                                            {sponsorship.booking?.project
                                                ?.title || "Volunteer Project"}
                                        </p>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-6">
                                    {/* Funding Progress */}
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-700 font-medium">
                                                Funding Progress
                                            </span>
                                            <span className="font-semibold text-blue-600">
                                                $
                                                {formatCurrency(
                                                    sponsorship.funded_amount ||
                                                        0
                                                )}{" "}
                                                / $
                                                {formatCurrency(
                                                    sponsorship.total_amount ||
                                                        0
                                                )}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{
                                                    width: `${progress}%`,
                                                }}
                                                transition={{ duration: 1 }}
                                                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full"
                                            />
                                        </div>
                                        <div className="text-right text-xs text-gray-400 mt-1">
                                            {Math.round(progress)}% funded
                                        </div>
                                    </div>

                                    {/* Skills */}
                                    <div className="mb-3">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                            Skills to be Offered
                                        </h2>
                                        <div className="flex flex-wrap gap-1.5">
                                            {sponsorship.skills &&
                                            sponsorship.skills.length > 0 ? (
                                                sponsorship.skills.map(
                                                    (skill, i) => (
                                                        <span
                                                            key={i}
                                                            className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-sm rounded-full"
                                                        >
                                                            {skill}
                                                        </span>
                                                    )
                                                )
                                            ) : (
                                                <span className="text-gray-400 text-xs italic">
                                                    No skills listed
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* About */}
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                            About{" "}
                                            {formatName(sponsorship.user?.name)}
                                        </h2>
                                        <p className="text-gray-700 whitespace-pre-line">
                                            {sponsorship.self_introduction}
                                        </p>
                                    </div>

                                    {/* Impact */}
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                            Impact to the Project{" "}
                                        </h2>
                                        <p>{sponsorship.impact}</p>
                                    </div>

                                    {/* Funding Button */}
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
                                    >
                                        Select Funding Options
                                    </button>
                                </div>
                            </motion.div>
                        </div>

                        {/* Sidebar */}
                        <div className="flex flex-col gap-6">
                            {/* Related Volunteers */}
                            {relatedSponsorships.length > 0 && (
                                <div className="bg-white rounded-2xl shadow-lg p-5 space-y-4">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Other Volunteers
                                    </h2>
                                    <div className="space-y-3">
                                        {relatedSponsorships.map((related) => (
                                            <Link
                                                key={related.public_id}
                                                href={route(
                                                    "volunteer.guest.sponsorship.page.with.volunteer",
                                                    related.public_id
                                                )}
                                                className="block flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all"
                                            >
                                                {related.volunteer_profile
                                                    ?.profile_picture ? (
                                                    <img
                                                        src={`/storage/${related.volunteer_profile.profile_picture}`}
                                                        alt={formatName(
                                                            related.user?.name
                                                        )}
                                                        className="w-12 h-12 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <span className="text-blue-600 font-semibold">
                                                            {getInitials(
                                                                related.user
                                                                    ?.name
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-medium text-gray-900 truncate">
                                                        {formatName(
                                                            related.user?.name
                                                        )}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {
                                                            related.booking
                                                                ?.project?.title
                                                        }
                                                    </p>
                                                    <p className="text-sm font-semibold text-blue-600">
                                                        $
                                                        {formatCurrency(
                                                            related.total_amount
                                                        )}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Donors */}
                            <div className="bg-white rounded-2xl shadow-lg p-5">
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                                    Donors
                                </h2>
                                {sponsorship.sponsorships?.filter(
                                    (d) => d.status === "completed"
                                ).length > 0 ? (
                                    <ul className="space-y-2">
                                        {sponsorship.sponsorships
                                            .filter(
                                                (d) => d.status === "completed"
                                            )
                                            .map((donation) => (
                                                <li
                                                    key={donation.id}
                                                    className="flex justify-between border-b border-gray-100 pb-2"
                                                >
                                                    <span className="text-gray-800 text-sm">
                                                        {donation.is_anonymous
                                                            ? "Anonymous"
                                                            : donation.user
                                                                  ?.name ||
                                                              "Anonymous"}
                                                    </span>

                                                    <span className="text-blue-600 text-sm font-semibold">
                                                        $
                                                        {Number(
                                                            donation.amount || 0
                                                        ).toLocaleString()}
                                                    </span>
                                                </li>
                                            ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 text-sm">
                                        No donors yet — be the first!
                                    </p>
                                )}
                            </div>

                            {/* Info Card */}
                            <div className="bg-white rounded-2xl shadow-lg p-5 space-y-3">
                                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                                    Why Sponsor?
                                </h2>
                                <div className="space-y-2">
                                    {[
                                        "Make a direct impact on communities in need",
                                        "Support passionate volunteers in their mission",
                                        "Receive updates and impact reports",
                                    ].map((text, i) => (
                                        <div
                                            key={i}
                                            className="flex items-start gap-3"
                                        >
                                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                                                <span className="text-blue-600 font-bold text-sm">
                                                    ✓
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-sm">
                                                {text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-white rounded-3xl p-6 w-full max-w-lg relative shadow-xl"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
                            >
                                &times;
                            </button>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Select Funding Options
                            </h2>

                            <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
                                {fundingOptions.map(
                                    (option) =>
                                        option.amount > 0 && (
                                            <label
                                                key={option.key}
                                                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        !!selectedItems[
                                                            option.key
                                                        ]
                                                    }
                                                    onChange={() =>
                                                        handleCheckboxChange(
                                                            option.key
                                                        )
                                                    }
                                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                />
                                                <span className="ml-3 flex-1">
                                                    <span className="block text-sm font-medium text-gray-900">
                                                        {option.label}
                                                    </span>
                                                    <span className="block text-sm text-gray-500">
                                                        $
                                                        {formatCurrency(
                                                            option.amount
                                                        )}
                                                    </span>
                                                </span>
                                            </label>
                                        )
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Or enter custom amount
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                                        $
                                    </span>
                                    <input
                                        type="number"
                                        value={customAmount}
                                        onChange={handleCustomAmountChange}
                                        placeholder="Enter amount"
                                        className="pl-8 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-xl mb-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-900">
                                        Total Amount:
                                    </span>
                                    <span className="text-2xl font-bold text-blue-600">
                                        ${formatCurrency(totalAmount)}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={is_anonymous}
                                        onChange={(e) =>
                                            setIsAnonymous(e.target.checked)
                                        }
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-gray-700">
                                        Do you want to stay Anonymous
                                    </span>
                                </label>
                            </div>

                            <motion.button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    initiatePayment();
                                }}
                                disabled={isProcessing || totalAmount <= 0}
                                whileHover={{
                                    scale:
                                        totalAmount > 0 && !isProcessing
                                            ? 1.02
                                            : 1,
                                }}
                                whileTap={{
                                    scale:
                                        totalAmount > 0 && !isProcessing
                                            ? 0.98
                                            : 1,
                                }}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessing
                                    ? "Processing..."
                                    : `Support $${formatCurrency(totalAmount)}`}
                            </motion.button>
                        </motion.div>
                    </div>
                )}
            </div>
        </GeneralPages>
    );
}
