import GeneralPages from "@/Layouts/GeneralPages";
import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import VerifiedBadge from "@/Components/VerifiedBadge";

export default function ViewIndividual({
    sponsorship,
    relatedSponsorships,
    fundedAllocations = {},
}) {
    const { props } = usePage();
    const { auth } = props;
    const isLoggedIn = auth && auth.user;

    const [selectedItems, setSelectedItems] = useState({});
    const [customAmount, setCustomAmount] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [is_anonymous, setIsAnonymous] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState("idle"); // 'idle', 'processing', 'success', 'error'
    const [paypalError, setPaypalError] = useState(null);
    const [includeProcessingFee, setIncludeProcessingFee] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showDonorTypeModal, setShowDonorTypeModal] = useState(false);

    const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || "test";

    // Calculate total amount needed and remaining
    const totalAmountNeeded = sponsorship.total_amount || 0;
    const totalAmountRaised = sponsorship.funded_amount || 0;
    const amountLeft = Math.max(0, totalAmountNeeded - totalAmountRaised);

    // Calculate progress
    const progress =
        totalAmountNeeded && totalAmountRaised
            ? Math.min((totalAmountRaised / totalAmountNeeded) * 100, 100)
            : 0;

    // Get all funding options
    const getAllFundingOptions = () => {
        return [
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
        ].filter((option) => option.amount > 0);
    };

    const allFundingOptions = getAllFundingOptions();

    // Filter fundedAllocations to only include data for this specific sponsorship
    const getFilteredFundedAllocations = () => {
        return fundedAllocations || {};
    };

    // Calculate remaining amounts for each category and determine which are fully/partially funded
    const calculateFundingStatus = () => {
        const filteredFundedAllocations = getFilteredFundedAllocations();
        const fundingStatus = {};
        const availableOptions = [];

        // Calculate total funded amount from filtered allocations for consistency
        const totalFundedFromAllocations = Object.values(
            filteredFundedAllocations || {}
        ).reduce((sum, amount) => sum + (parseFloat(amount) || 0), 0);

        // Calculate unallocated amount (total raised minus allocated amounts)
        const unallocatedAmount = Math.max(
            0,
            totalAmountRaised - totalFundedFromAllocations
        );

        // First pass: calculate remaining for each category based on actual funded allocations
        allFundingOptions.forEach((option) => {
            const fundedAmount =
                parseFloat(filteredFundedAllocations[option.key]) || 0;
            let remaining = Math.max(0, option.amount - fundedAmount);

            // Determine status based on funding allocation
            let status = "needs-funding";
            if (remaining === 0 && fundedAmount > 0) {
                status = "fully-funded"; // Completed - green
            } else if (fundedAmount > 0 && remaining > 0) {
                status = "partially-funded"; // Partially funded - yellow
            }

            fundingStatus[option.key] = {
                ...option,
                status: status,
                remaining: remaining,
                originalAmount: option.amount,
                fundedAmount: fundedAmount,
                isCompleted: remaining === 0 && fundedAmount > 0, // Mark as completed
            };

            if (status !== "fully-funded") {
                availableOptions.push(option);
            }
        });

        // Second pass: distribute unallocated amount to categories that haven't received specific allocations
        if (unallocatedAmount > 0) {
            // Get categories that have no specific funding allocation (fundedAmount === 0)
            const unallocatedCategories = availableOptions.filter(
                (option) => fundingStatus[option.key].fundedAmount === 0
            );

            if (unallocatedCategories.length > 0) {
                // Sort by amount (smallest first to maximize completion)
                const sortedCategories = [...unallocatedCategories].sort(
                    (a, b) => a.amount - b.amount
                );

                let remainingUnallocated = unallocatedAmount;

                for (const category of sortedCategories) {
                    if (remainingUnallocated <= 0) break;

                    const categoryStatus = fundingStatus[category.key];
                    const amountThatCanBeCovered = Math.min(
                        categoryStatus.remaining,
                        remainingUnallocated
                    );

                    if (amountThatCanBeCovered > 0) {
                        categoryStatus.remaining -= amountThatCanBeCovered;
                        remainingUnallocated -= amountThatCanBeCovered;

                        // Update status based on new remaining amount
                        if (categoryStatus.remaining === 0) {
                            categoryStatus.status = "fully-funded";
                            categoryStatus.isCompleted = true;
                        } else {
                            categoryStatus.status = "partially-funded";
                        }
                    }
                }
            }
        }

        return {
            fundingStatus,
            availableOptions: availableOptions.filter(
                (opt) => fundingStatus[opt.key].status !== "fully-funded"
            ),
        };
    };

    const { fundingStatus, availableOptions } = calculateFundingStatus();

    // Filter out already funded categories from available options
    const getAvailableFundingOptions = () => {
        return availableOptions.map((option) => ({
            ...option,
            remaining: fundingStatus[option.key].remaining,
            fundedAmount: fundingStatus[option.key].fundedAmount,
            status: fundingStatus[option.key].status,
            originalAmount: fundingStatus[option.key].originalAmount,
            isCompleted: fundingStatus[option.key].isCompleted,
        }));
    };

    const availableFundingOptions = getAvailableFundingOptions();

    // Calculate selected amount based on remaining amounts for partially funded categories
    const selectedAmount = availableFundingOptions.reduce((total, option) => {
        if (selectedItems[option.key]) {
            // For partially funded items, only add the remaining amount needed
            return total + (option.remaining || option.amount);
        }
        return total;
    }, 0);

    const baseAmount =
        customAmount.trim() !== "" && !isNaN(parseFloat(customAmount))
            ? parseFloat(customAmount)
            : selectedAmount;

    // Calculate processing fee (6% of base amount)
    const processingFee = baseAmount * 0.06;

    // Calculate total amount including processing fee if selected
    const totalAmount = includeProcessingFee
        ? baseAmount + processingFee
        : baseAmount;

    const handleCheckboxChange = (key) => {
        setSelectedItems((prev) => {
            const newSelection = { ...prev, [key]: !prev[key] };

            // If custom amount is set and user selects a category, clear custom amount
            if (customAmount && !prev[key]) {
                setCustomAmount("");
            }

            return newSelection;
        });
    };

    const handleCustomAmountChange = (e) => {
        const value = e.target.value;
        if (value === "" || (!isNaN(value) && parseFloat(value) >= 0)) {
            setCustomAmount(value);
            if (value !== "") {
                // Clear all category selections when custom amount is entered
                setSelectedItems({});
            }
        }
    };

    // Handle funding button click
    const handleFundingButtonClick = () => {
        if (isLoggedIn) {
            // User is logged in, go directly to funding options
            setIsModalOpen(true);
        } else {
            // User is not logged in, show donor type modal
            setShowDonorTypeModal(true);
        }
    };

    // Handle donor type selection
    const handleDonorTypeSelect = (type) => {
        setShowDonorTypeModal(false);
        if (type === "guest") {
            // Guest donor - go directly to funding options
            setIsModalOpen(true);
        } else {
            // Returning donor - show auth modal
            setShowAuthModal(true);
        }
    };

    // Reset states when modal closes
    useEffect(() => {
        if (!isModalOpen) {
            setPaymentStatus("idle");
            setPaypalError(null);
            setIncludeProcessingFee(false);
        }
    }, [isModalOpen]);

    // PayPal create order function
    const createOrder = async (data, actions) => {
        try {
            setPaypalError(null);

            console.log("Creating order with amount:", totalAmount);
            console.log("Sponsorship Public ID:", sponsorship.public_id);
            console.log("Booking Public ID:", sponsorship.booking_public_id);

            const response = await axios.post(
                "/sponsorship/paypal/create-order",
                {
                    sponsorship_public_id: sponsorship.public_id,
                    booking_public_id: sponsorship.booking_public_id, // Add booking_public_id
                    amount: totalAmount,
                    funding_allocation: selectedItems,
                    custom_amount: customAmount,
                    is_anonymous: is_anonymous,
                    include_processing_fee: includeProcessingFee,
                }
            );

            console.log("Order created:", response.data);
            return response.data.orderID;
        } catch (error) {
            console.error("PayPal order creation error:", error);
            setPaypalError("Failed to create payment order. Please try again.");
            throw error;
        }
    };

    // PayPal onApprove function
    const onApprove = async (data, actions) => {
        try {
            setPaymentStatus("processing");
            setPaypalError(null);
            console.log("=== PAYPAL APPROVE START ===");
            console.log("Order ID:", data.orderID);
            console.log("Sponsorship Public ID:", sponsorship.public_id);
            console.log("Booking Public ID:", sponsorship.booking_public_id);

            const response = await axios.post(
                "/sponsorship/paypal/capture-order",
                {
                    orderID: data.orderID,
                    sponsorship_public_id: sponsorship.public_id, // Add sponsorship_public_id
                    booking_public_id: sponsorship.booking_public_id, // Add booking_public_id
                }
            );

            console.log("Capture response:", response.data);

            if (response.data.success) {
                setPaymentStatus("success");
                // Don't reload immediately, show success message first
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } else {
                setPaymentStatus("error");
                throw new Error(
                    response.data.error || "Payment capture failed"
                );
            }
        } catch (error) {
            console.error("=== PAYPAL CAPTURE ERROR ===");
            console.error("Error:", error);
            console.error("Response data:", error.response?.data);

            setPaymentStatus("error");
            let errorMessage = "Payment processing failed. Please try again.";

            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
                if (error.response.data.debug_id) {
                    errorMessage += ` (Debug ID: ${error.response.data.debug_id})`;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            setPaypalError(errorMessage);
        }
    };

    // PayPal onError function
    const onError = (err) => {
        console.error("PayPal error:", err);
        setPaypalError("Payment failed. Please try again.");
    };

    // PayPal onCancel function
    const onCancel = (data) => {
        console.log("Payment cancelled by user");
        setPaypalError(null);
    };

    const formatCurrency = (amount) => {
        if (isNaN(amount) || amount === null || amount === undefined)
            return "0.00";
        return amount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const formatName = (fullName) => fullName || "Volunteer";
    const getInitials = (fullName) => {
        if (!fullName) return "V";
        const parts = fullName.trim().split(/\s+/);
        return parts.length === 1
            ? parts[0].charAt(0)
            : parts[0].charAt(0) + parts[parts.length - 1].charAt(0);
    };

    // Loading spinner component
    const LoadingSpinner = ({ size = "medium" }) => {
        const sizeClasses = {
            small: "w-4 h-4",
            medium: "w-8 h-8",
            large: "w-12 h-12",
        };

        return (
            <div className="flex items-center justify-center">
                <div
                    className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}
                ></div>
            </div>
        );
    };

    // Payment processing overlay
    const PaymentProcessingOverlay = () => {
        if (paymentStatus !== "processing") return null;

        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl max-w-sm w-full mx-4"
                >
                    <div className="text-center">
                        <LoadingSpinner size="large" />
                        <h3 className="text-lg font-semibold text-gray-900 mt-4">
                            Processing Payment
                        </h3>
                        <p className="text-gray-600 mt-2 text-sm">
                            Please wait while we process your payment...
                        </p>
                        <div className="mt-4 flex justify-center space-x-2">
                            <div
                                className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                                style={{ animationDelay: "0ms" }}
                            ></div>
                            <div
                                className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                                style={{ animationDelay: "150ms" }}
                            ></div>
                            <div
                                className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                                style={{ animationDelay: "300ms" }}
                            ></div>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    };

    // Success message overlay
    const SuccessMessageOverlay = () => {
        if (paymentStatus !== "success") return null;

        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl max-w-md w-full mx-4"
                >
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                className="w-8 h-8 text-green-600"
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
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Payment Successful!
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Thank you for your generous sponsorship of{" "}
                            <span className="font-semibold text-blue-600">
                                {formatName(sponsorship.user?.name)}
                            </span>
                            . Your contribution will make a meaningful impact on
                            their volunteer journey.
                        </p>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                            <p className="text-green-800 font-medium">
                                Amount: ${formatCurrency(totalAmount)}
                            </p>
                            {includeProcessingFee && (
                                <p className="text-green-600 text-sm mt-1">
                                    Includes ${formatCurrency(processingFee)}{" "}
                                    processing fee
                                </p>
                            )}
                        </div>
                        <p className="text-gray-500 text-sm">
                            You will be redirected shortly...
                        </p>
                        <div className="mt-4 flex justify-center">
                            <LoadingSpinner size="small" />
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    };

    // Donor Type Selection Modal
    const DonorTypeModal = () => {
        if (!showDonorTypeModal) return null;

        return (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl max-w-md w-full mx-4"
                >
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                className="w-8 h-8 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            How would you like to donate?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Choose your donation method to continue supporting{" "}
                            {formatName(sponsorship.user?.name)}'s volunteer
                            journey.
                        </p>

                        <div className="space-y-4">
                            <button
                                onClick={() => handleDonorTypeSelect("guest")}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-3"
                            >
                                <svg
                                    className="w-6 h-6"
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
                                <span>Continue as Guest Donor</span>
                            </button>

                            <button
                                onClick={() =>
                                    handleDonorTypeSelect("returning")
                                }
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-3"
                            >
                                <svg
                                    className="w-6 h-6"
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
                                <span>I'm a Returning Donor</span>
                            </button>
                        </div>

                        <button
                            onClick={() => setShowDonorTypeModal(false)}
                            className="w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    };

    // Authentication Modal
    const AuthModal = () => {
        if (!showAuthModal) return null;

        return (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl max-w-md w-full mx-4"
                >
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                className="w-8 h-8 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            Welcome Back!
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Sign in to your account to continue your donation
                            and track your impact.
                        </p>

                        <div className="space-y-4">
                            <Link
                                href={route("login", {
                                    redirect_to: window.location.href,
                                })}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-3"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                    />
                                </svg>
                                <span>Sign In</span>
                            </Link>

                            <Link
                                href={route("register", {
                                    redirect_to: window.location.href,
                                })}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-3"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                    />
                                </svg>
                                <span>Create Account</span>
                            </Link>
                        </div>

                        <button
                            onClick={() => setShowAuthModal(false)}
                            className="w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    };

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

    return (
        <GeneralPages title="Sponsorship Details">
            <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
                {/* Payment Processing Overlay */}
                <PaymentProcessingOverlay />

                {/* Success Message Overlay */}
                <SuccessMessageOverlay />

                {/* Donor Type Selection Modal */}
                <DonorTypeModal />

                {/* Authentication Modal */}
                <AuthModal />

                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    {/* Breadcrumb */}
                    <nav
                        className="flex mb-4 sm:mb-6 text-xs sm:text-sm text-gray-500 flex-wrap"
                        aria-label="Breadcrumb"
                    >
                        <Link href="/" className="hover:text-gray-700">
                            Home
                        </Link>
                        <span className="mx-1 sm:mx-2">/</span>
                        <Link
                            href="/corporate-impact-sponsorship"
                            className="hover:text-gray-700"
                        >
                            Sponsorships
                        </Link>
                        <span className="mx-1 sm:mx-2">/</span>
                        <span className="text-gray-800 font-medium truncate max-w-[120px] sm:max-w-none">
                            {formatName(sponsorship.user?.name)}
                        </span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                        {/* Main Card */}
                        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl overflow-hidden"
                            >
                                {/* Header Section */}
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-white">
                                    <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                                        {sponsorship.volunteer_profile
                                            ?.profile_picture ? (
                                            <img
                                                src={`/storage/${sponsorship.volunteer_profile.profile_picture}`}
                                                alt={formatName(
                                                    sponsorship.user?.name
                                                )}
                                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 sm:border-4 border-white/25 object-cover"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center">
                                                <span className="text-xl sm:text-2xl font-bold">
                                                    {getInitials(
                                                        sponsorship.user?.name
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h1 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
                                                <span className="truncate">
                                                    {formatName(
                                                        sponsorship.user?.name
                                                    )}
                                                </span>
                                                {sponsorship.volunteer_profile
                                                    ?.verification?.status ===
                                                    "Approved" && (
                                                    <div className="flex-shrink-0">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 bg-white rounded-full"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                )}
                                            </h1>
                                            <p className="text-blue-100 font-medium text-sm sm:text-base truncate">
                                                {sponsorship.booking?.project
                                                    ?.title ||
                                                    "Volunteer Project"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                                    {/* Funding Progress */}
                                    <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm sm:text-base text-gray-700 font-medium">
                                                Funding Progress
                                            </span>
                                            <span className="font-semibold text-blue-600 text-sm sm:text-base">
                                                $
                                                {formatCurrency(
                                                    totalAmountRaised
                                                )}{" "}
                                                / $
                                                {formatCurrency(
                                                    totalAmountNeeded
                                                )}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{
                                                    width: `${progress}%`,
                                                }}
                                                transition={{ duration: 1 }}
                                                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 sm:h-3 rounded-full"
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                                            <span>
                                                {Math.round(progress)}% funded
                                            </span>
                                            <span>
                                                ${formatCurrency(amountLeft)}{" "}
                                                left
                                            </span>
                                        </div>
                                    </div>

                                    {/* Funding Categories */}
                                    <div className="mb-2 sm:mb-3">
                                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                                            Funding Categories
                                        </h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                            {allFundingOptions.map((option) => {
                                                const status =
                                                    fundingStatus[option.key];
                                                const isCompleted =
                                                    status.isCompleted;
                                                const isPartiallyFunded =
                                                    status.status ===
                                                    "partially-funded";

                                                return (
                                                    <div
                                                        key={option.key}
                                                        className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border ${
                                                            isCompleted
                                                                ? "bg-green-50 border-green-200"
                                                                : isPartiallyFunded
                                                                ? "bg-yellow-50 border-yellow-200"
                                                                : "bg-blue-50 border-blue-200"
                                                        }`}
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h3
                                                                    className={`font-medium text-sm sm:text-base ${
                                                                        isCompleted
                                                                            ? "text-green-800"
                                                                            : isPartiallyFunded
                                                                            ? "text-yellow-800"
                                                                            : "text-blue-800"
                                                                    }`}
                                                                >
                                                                    {
                                                                        option.label
                                                                    }
                                                                </h3>
                                                                <p
                                                                    className={`text-xs sm:text-sm ${
                                                                        isCompleted
                                                                            ? "text-green-600"
                                                                            : isPartiallyFunded
                                                                            ? "text-yellow-600"
                                                                            : "text-blue-600"
                                                                    } font-semibold mt-1`}
                                                                >
                                                                    {isCompleted ? (
                                                                        <>
                                                                            $
                                                                            {formatCurrency(
                                                                                option.amount
                                                                            )}{" "}
                                                                            -
                                                                            Completed
                                                                        </>
                                                                    ) : isPartiallyFunded ? (
                                                                        <>
                                                                            $
                                                                            {formatCurrency(
                                                                                status.remaining
                                                                            )}{" "}
                                                                            of $
                                                                            {formatCurrency(
                                                                                option.amount
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            $
                                                                            {formatCurrency(
                                                                                option.amount
                                                                            )}{" "}
                                                                            needed
                                                                        </>
                                                                    )}
                                                                </p>
                                                            </div>
                                                            {isCompleted && (
                                                                <div className="flex-shrink-0">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-5 w-5 text-green-500"
                                                                        viewBox="0 0 20 20"
                                                                        fill="currentColor"
                                                                    >
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                            clipRule="evenodd"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {isCompleted && (
                                                            <p className="text-green-600 text-xs mt-2 font-medium">
                                                                ✓ Completed
                                                            </p>
                                                        )}
                                                        {isPartiallyFunded && (
                                                            <p className="text-yellow-600 text-xs mt-2 font-medium">
                                                                ⚡ Partially
                                                                funded - $
                                                                {formatCurrency(
                                                                    status.remaining
                                                                )}{" "}
                                                                needed
                                                                {status.fundedAmount >
                                                                    0 && (
                                                                    <>
                                                                        {" "}
                                                                        ($
                                                                        {formatCurrency(
                                                                            status.fundedAmount
                                                                        )}{" "}
                                                                        already
                                                                        donated)
                                                                    </>
                                                                )}
                                                            </p>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Skills */}
                                    <div className="mb-2 sm:mb-3">
                                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                                            Skills to be Offered
                                        </h2>
                                        <div className="flex flex-wrap gap-1.5">
                                            {sponsorship.skills &&
                                            sponsorship.skills.length > 0 ? (
                                                sponsorship.skills.map(
                                                    (skill, i) => (
                                                        <span
                                                            key={i}
                                                            className="px-2 py-1 sm:px-2.5 sm:py-0.5 bg-blue-100 text-blue-800 text-xs sm:text-sm rounded-full"
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
                                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                                            About{" "}
                                            {formatName(sponsorship.user?.name)}
                                        </h2>
                                        <p className="text-gray-700 whitespace-pre-line text-sm sm:text-base leading-relaxed">
                                            {sponsorship.self_introduction}
                                        </p>
                                    </div>

                                    {/* Impact */}
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                                            Impact to the Project
                                        </h2>
                                        <p className="text-sm sm:text-base text-gray-700">
                                            {sponsorship.impact}
                                        </p>
                                    </div>

                                    {/* Funding Button */}
                                    {availableFundingOptions.length > 0 && (
                                        <button
                                            onClick={handleFundingButtonClick}
                                            disabled={
                                                paymentStatus ===
                                                    "processing" ||
                                                paymentStatus === "success"
                                            }
                                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Select Funding Options
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {/* Sidebar */}
                        <div className="flex flex-col gap-4 sm:gap-6">
                            {/* Related Volunteers */}
                            {relatedSponsorships.length > 0 && (
                                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 space-y-3 sm:space-y-4">
                                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                                        Other Volunteers
                                    </h2>
                                    <div className="space-y-2 sm:space-y-3">
                                        {relatedSponsorships.map((related) => (
                                            <Link
                                                key={related.public_id}
                                                href={route(
                                                    "volunteer.guest.sponsorship.page.with.volunteer",
                                                    related.public_id
                                                )}
                                                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border border-gray-200 rounded-lg sm:rounded-xl hover:border-blue-300 hover:shadow-md transition-all"
                                            >
                                                {related.volunteer_profile
                                                    ?.profile_picture ? (
                                                    <img
                                                        src={`/storage/${related.volunteer_profile.profile_picture}`}
                                                        alt={formatName(
                                                            related.user?.name
                                                        )}
                                                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <span className="text-blue-600 font-semibold text-sm">
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
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5">
                                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                                    Donors
                                </h2>
                                {sponsorship.sponsorships?.filter(
                                    (d) => d.status === "completed"
                                ).length > 0 ? (
                                    <ul className="space-y-1 sm:space-y-2">
                                        {sponsorship.sponsorships
                                            .filter(
                                                (d) => d.status === "completed"
                                            )
                                            .map((donation) => (
                                                <li
                                                    key={donation.id}
                                                    className="flex justify-between border-b border-gray-100 pb-1 sm:pb-2"
                                                >
                                                    <span className="text-gray-800 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">
                                                        {donation.is_anonymous
                                                            ? "Anonymous"
                                                            : donation.user
                                                                  ?.name ||
                                                              "Anonymous"}
                                                    </span>
                                                    <span className="text-blue-600 text-xs sm:text-sm font-semibold flex-shrink-0">
                                                        $
                                                        {Number(
                                                            donation.amount || 0
                                                        ).toLocaleString()}
                                                    </span>
                                                </li>
                                            ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 text-xs sm:text-sm">
                                        No donors yet — be the first!
                                    </p>
                                )}
                            </div>

                            {/* Info Card */}
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 space-y-2 sm:space-y-3">
                                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                                    Why Sponsor?
                                </h2>
                                <div className="space-y-1 sm:space-y-2">
                                    {[
                                        "Make a direct impact on communities in need",
                                        "Support passionate volunteers in their mission",
                                        "Receive updates and impact reports",
                                    ].map((text, i) => (
                                        <div
                                            key={i}
                                            className="flex items-start gap-2 sm:gap-3"
                                        >
                                            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                                <span className="text-blue-600 font-bold text-xs sm:text-sm">
                                                    ✓
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                                                {text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* </div> */}

                {/* Enhanced Responsive Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50">
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0"
                            onClick={() => {
                                if (
                                    paymentStatus !== "processing" &&
                                    paymentStatus !== "success"
                                ) {
                                    setIsModalOpen(false);
                                }
                            }}
                        ></div>

                        {/* Modal Container */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md lg:max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col mx-2 sm:mx-0"
                        >
                            {/* Header */}
                            <div className="flex-shrink-0 p-4 sm:p-6 border-b border-gray-200 bg-white rounded-t-2xl sm:rounded-t-3xl">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                                        Select Funding Options
                                    </h2>
                                    <button
                                        onClick={() => {
                                            if (
                                                paymentStatus !==
                                                    "processing" &&
                                                paymentStatus !== "success"
                                            ) {
                                                setIsModalOpen(false);
                                            }
                                        }}
                                        disabled={
                                            paymentStatus === "processing" ||
                                            paymentStatus === "success"
                                        }
                                        className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg
                                            className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 hover:text-gray-700"
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

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto">
                                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                                    {/* Error Display */}
                                    {paypalError && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                            <div className="flex items-center">
                                                <svg
                                                    className="w-5 h-5 text-red-400 mr-2"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <span className="text-red-800 text-sm">
                                                    {paypalError}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Funding Options */}
                                    <div>
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                                            Available Funding Categories
                                        </h3>
                                        {availableFundingOptions.length > 0 ? (
                                            <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-60 overflow-y-auto pr-1 sm:pr-2">
                                                {availableFundingOptions.map(
                                                    (option) => (
                                                        <label
                                                            key={option.key}
                                                            className="flex items-center p-3 sm:p-4 border border-gray-200 rounded-lg sm:rounded-xl hover:bg-blue-50 cursor-pointer transition-all duration-200"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    !!selectedItems[
                                                                        option
                                                                            .key
                                                                    ]
                                                                }
                                                                onChange={() =>
                                                                    handleCheckboxChange(
                                                                        option.key
                                                                    )
                                                                }
                                                                disabled={
                                                                    paymentStatus ===
                                                                        "processing" ||
                                                                    paymentStatus ===
                                                                        "success"
                                                                }
                                                                className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            />
                                                            <span className="ml-3 sm:ml-4 flex-1">
                                                                <span className="block text-sm sm:text-base font-medium text-gray-900">
                                                                    {
                                                                        option.label
                                                                    }
                                                                </span>
                                                                <span className="block text-xs sm:text-sm text-gray-600 mt-1">
                                                                    {option.status ===
                                                                    "partially-funded" ? (
                                                                        <>
                                                                            $
                                                                            {formatCurrency(
                                                                                option.remaining
                                                                            )}{" "}
                                                                            needed
                                                                            ($
                                                                            {formatCurrency(
                                                                                option.fundedAmount
                                                                            )}{" "}
                                                                            already
                                                                            funded
                                                                            of $
                                                                            {formatCurrency(
                                                                                option.originalAmount
                                                                            )}
                                                                            )
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            $
                                                                            {formatCurrency(
                                                                                option.amount
                                                                            )}{" "}
                                                                            needed
                                                                        </>
                                                                    )}
                                                                </span>
                                                            </span>
                                                        </label>
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <p className="text-gray-500 text-sm sm:text-base">
                                                    All funding categories have
                                                    been fully funded!
                                                </p>
                                                <p className="text-gray-400 text-xs sm:text-sm mt-2">
                                                    You can still contribute
                                                    using the custom amount
                                                    option below.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Custom Amount */}
                                    <div>
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                                            Custom Amount
                                        </h3>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center text-gray-500 text-base sm:text-lg">
                                                $
                                            </span>
                                            <input
                                                type="number"
                                                value={customAmount}
                                                onChange={
                                                    handleCustomAmountChange
                                                }
                                                placeholder="Enter custom amount"
                                                disabled={
                                                    paymentStatus ===
                                                        "processing" ||
                                                    paymentStatus === "success"
                                                }
                                                className="pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            ${formatCurrency(amountLeft)} still
                                            needed to complete all funding
                                        </p>
                                    </div>

                                    {/* Processing Fee Option */}
                                    {baseAmount > 0 && (
                                        <div className="bg-yellow-50 border border-yellow-200 p-4 sm:p-5 rounded-lg sm:rounded-xl">
                                            <label className="flex items-start space-x-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        includeProcessingFee
                                                    }
                                                    onChange={(e) =>
                                                        setIncludeProcessingFee(
                                                            e.target.checked
                                                        )
                                                    }
                                                    disabled={
                                                        paymentStatus ===
                                                            "processing" ||
                                                        paymentStatus ===
                                                            "success"
                                                    }
                                                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed mt-0.5"
                                                />
                                                <div className="flex-1">
                                                    <span className="text-yellow-800 font-medium text-sm sm:text-base block">
                                                        Would you like to add a
                                                        processing fee?
                                                    </span>
                                                    <p className="text-yellow-700 text-xs sm:text-sm mt-1">
                                                        Help cover the 6% PayPal
                                                        processing fee so that{" "}
                                                        {formatName(
                                                            sponsorship.user
                                                                ?.name
                                                        )}{" "}
                                                        receives the full $
                                                        {formatCurrency(
                                                            baseAmount
                                                        )}{" "}
                                                        amount. Additional
                                                        amount:{" "}
                                                        <span className="font-semibold">
                                                            $
                                                            {formatCurrency(
                                                                processingFee
                                                            )}
                                                        </span>
                                                    </p>
                                                </div>
                                            </label>
                                        </div>
                                    )}

                                    {/* Total Amount Display */}
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 sm:p-5 rounded-lg sm:rounded-xl border border-blue-200">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg sm:text-xl font-bold text-gray-900">
                                                Total Amount:
                                            </span>
                                            <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">
                                                ${formatCurrency(totalAmount)}
                                            </span>
                                        </div>
                                        {includeProcessingFee && (
                                            <div className="mt-2 text-sm text-blue-600">
                                                <span className="font-medium">
                                                    Breakdown:
                                                </span>
                                                <div className="flex justify-between mt-1">
                                                    <span>Sponsorship:</span>
                                                    <span>
                                                        $
                                                        {formatCurrency(
                                                            baseAmount
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Processing Fee:</span>
                                                    <span>
                                                        + $
                                                        {formatCurrency(
                                                            processingFee
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Anonymous Option */}
                                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                                        <label className="flex items-center space-x-2 sm:space-x-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={is_anonymous}
                                                onChange={(e) =>
                                                    setIsAnonymous(
                                                        e.target.checked
                                                    )
                                                }
                                                disabled={
                                                    paymentStatus ===
                                                        "processing" ||
                                                    paymentStatus === "success"
                                                }
                                                className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                            />
                                            <span className="text-gray-700 font-medium text-sm sm:text-base">
                                                Donate anonymously
                                            </span>
                                        </label>
                                        <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 ml-6 sm:ml-8">
                                            Your name will not be displayed in
                                            the donors list
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex-shrink-0 p-4 sm:p-6 border-t border-gray-200 bg-white rounded-b-2xl sm:rounded-b-3xl space-y-3 sm:space-y-4">
                                {/* Payment Status Indicator */}
                                {paymentStatus === "processing" && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                                        <div className="flex items-center justify-center space-x-3">
                                            <LoadingSpinner size="small" />
                                            <span className="text-blue-700 font-medium text-sm sm:text-base">
                                                Processing your payment...
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* PayPal Button - Always show when not processing */}
                                {totalAmount > 0 &&
                                    paymentStatus !== "processing" &&
                                    paymentStatus !== "success" && (
                                        <div className="paypal-button-container">
                                            <PayPalScriptProvider
                                                options={{
                                                    "client-id": paypalClientId,
                                                    currency: "USD",
                                                    components: "buttons",
                                                    intent: "capture",
                                                }}
                                            >
                                                <PayPalButtons
                                                    style={{
                                                        layout: "vertical",
                                                        height: 48,
                                                        color: "blue",
                                                        shape: "rect",
                                                        label: "checkout",
                                                    }}
                                                    createOrder={createOrder}
                                                    onApprove={onApprove}
                                                    onError={onError}
                                                    onCancel={onCancel}
                                                    forceReRender={[
                                                        totalAmount,
                                                        selectedItems,
                                                        is_anonymous,
                                                        includeProcessingFee,
                                                    ]}
                                                />
                                            </PayPalScriptProvider>
                                        </div>
                                    )}

                                {/* Cancel Button */}
                                <motion.button
                                    onClick={() => {
                                        if (
                                            paymentStatus !== "processing" &&
                                            paymentStatus !== "success"
                                        ) {
                                            setIsModalOpen(false);
                                        }
                                    }}
                                    disabled={
                                        paymentStatus === "processing" ||
                                        paymentStatus === "success"
                                    }
                                    whileHover={{
                                        scale:
                                            paymentStatus !== "processing" &&
                                            paymentStatus !== "success"
                                                ? 1.02
                                                : 1,
                                    }}
                                    whileTap={{
                                        scale:
                                            paymentStatus !== "processing" &&
                                            paymentStatus !== "success"
                                                ? 0.98
                                                : 1,
                                    }}
                                    className="w-full bg-gray-500 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base shadow-lg hover:bg-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {paymentStatus === "processing" ? (
                                        <div className="flex items-center justify-center">
                                            <LoadingSpinner size="small" />
                                            <span className="ml-2">
                                                Processing...
                                            </span>
                                        </div>
                                    ) : paymentStatus === "success" ? (
                                        "Closing..."
                                    ) : (
                                        "Cancel"
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </GeneralPages>
    );
}
