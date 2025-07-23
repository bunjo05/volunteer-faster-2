import VolunteerLayout from "@/Layouts/VolunteerLayout";
import { usePage, Link, useForm } from "@inertiajs/react";
import {
    CalendarDays,
    Users,
    MessageCircle,
    MapPin,
    Mail,
    Clock,
    ArrowRight,
    ChevronRight,
    ArrowUpRight,
    DollarSign,
} from "lucide-react";
import { useState, useEffect } from "react";

import { loadStripe } from "@stripe/stripe-js";
import { router } from "@inertiajs/react";

export default function Projects({ auth, payments }) {
    const [messageContent, setMessageContent] = useState("");
    const { post } = useForm();

    const { bookings = [], flash } = usePage().props;
    const [activeBooking, setActiveBooking] = useState(bookings[0] || null);
    const [showSuccess, setShowSuccess] = useState(false);
    // Inside your component
    const [stripePromise, setStripePromise] = useState(null);

    const [showMessageModal, setShowMessageModal] = useState(false);
    // const [messageContent, setMessageContent] = useState("");

    // Add this function to find payments for the active booking
    const getPaymentsForActiveBooking = () => {
        if (!activeBooking || !activeBooking.payments) return [];
        return activeBooking.payments;
    };

    useEffect(() => {
        const initializeStripe = async () => {
            try {
                const stripe = await loadStripe(
                    import.meta.env.VITE_STRIPE_KEY
                );
                setStripePromise(stripe);
            } catch (error) {
                console.error("Failed to load Stripe:", error);
            }
        };

        initializeStripe();
    }, []);

    // Inside your component, add a payment handler function:
    const handlePayment = async (booking) => {
        if (!stripePromise) {
            console.error("Stripe not initialized");
            return;
        }

        try {
            const response = await axios.post(
                route("payment.checkout"),
                { booking_id: booking.id },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document.querySelector(
                            'meta[name="csrf-token"]'
                        ).content,
                    },
                }
            );

            const result = await stripePromise.redirectToCheckout({
                sessionId: response.data.sessionId,
            });

            if (result.error) {
                console.error(result.error.message);
            }
        } catch (error) {
            console.error("Payment error:", error);
            // Add more detailed error handling here
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
            }
        }
    };

    useEffect(() => {
        if (flash?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => {
                setShowSuccess(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    // Calculate total amount paid for the active booking
    const calculateTotalPaid = () => {
        if (!activeBooking?.payments) return 0;
        return activeBooking.payments.reduce((total, payment) => {
            return total + parseFloat(payment.amount);
        }, 0);
    };

    // Calculate remaining balance
    const calculateRemainingBalance = () => {
        const totalAmount = calculateTotalAmount(
            activeBooking.start_date,
            activeBooking.end_date,
            activeBooking.project?.fees || 0,
            activeBooking.number_of_travellers
        );
        return totalAmount - calculateTotalPaid();
    };

    const hasDepositPaid = () => {
        if (!activeBooking?.payments) return false;
        return activeBooking.payments.some(
            (payment) => payment.status === "deposit_paid"
        );
    };

    const shouldHidePayButton = () => {
        if (!activeBooking) return true;

        // Hide if booking status is not "Approved"
        if (activeBooking.booking_status !== "Approved") {
            return true;
        }

        // Hide if any payment has status 'deposit_paid'
        if (
            activeBooking.payments?.some(
                (payment) => payment.status === "deposit_paid"
            )
        ) {
            return true;
        }

        return false;
    };

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (!messageContent.trim()) {
            alert("Message cannot be empty");
            return;
        }

        // Check if we have all required data
        if (
            !activeBooking ||
            !activeBooking.project ||
            !activeBooking.project.user
        ) {
            console.error("Missing booking or project information");
            alert("Cannot send message - project information is incomplete");
            return;
        }

        // Verify the receiver is not the current user
        if (activeBooking.project.user.id === auth.user.id) {
            console.error("Cannot send message to yourself");
            alert("Cannot send message to yourself");
            return;
        }

        post(
            route("volunteer.panel.messages.store"),
            {
                message: messageContent,
                sender_id: auth.user.id,
                receiver_id: activeBooking.project.user.id,
                project_id: activeBooking.project.id,
            },
            {
                onSuccess: () => {
                    setShowMessageModal(false);
                    setMessageContent("");
                    // Show success message
                    flash.success = "Message sent successfully!";
                    setShowSuccess(true);
                },
                onError: (errors) => {
                    console.error("Error sending message:", errors);
                    alert("Failed to send message. Please try again.");
                },
            }
        );
    };

    return (
        <VolunteerLayout auth={auth}>
            {showSuccess && (
                <div className="fixed top-4 right-4 z-50">
                    <div className="bg-green-500 text-white px-3 py-1.5 rounded-md shadow flex items-center text-sm animate-fade-in-up">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1.5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        {flash.success}
                    </div>
                </div>
            )}

            <div className="mx-auto bg-white max-w-7xl p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="text-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        My Volunteer Projects
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Manage your upcoming volunteer commitments
                    </p>
                </div>

                {Array.isArray(bookings) && bookings.length === 0 ? (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 text-center max-w-2xl mx-auto">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-3">
                            <CalendarDays className="h-5 w-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No projects booked yet
                        </h3>
                        <p className="text-gray-600 mb-4">
                            You haven't booked any volunteer projects.
                        </p>
                        <Link
                            href="/projects"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm"
                        >
                            Browse Projects
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                        {/* Left sidebar - Projects list */}
                        <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-3 sm:p-4 border-b border-gray-100 bg-gray-50">
                                <h3 className="font-semibold text-gray-800">
                                    My Projects ({bookings.length})
                                </h3>
                            </div>
                            <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
                                {bookings.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className={`p-3 sm:p-4 border-b border-gray-100 cursor-pointer transition-colors group ${
                                            activeBooking?.id === booking.id
                                                ? "bg-blue-50 border-l-2 border-blue-500"
                                                : "hover:bg-gray-50"
                                        }`}
                                        onClick={() =>
                                            setActiveBooking(booking)
                                        }
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium text-gray-900 group-hover:text-blue-600 text-sm sm:text-base">
                                                    {booking.project?.title}
                                                </h4>
                                                <div className="flex items-center mt-1 text-xs sm:text-sm text-gray-500">
                                                    <CalendarDays className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                                                    <span>
                                                        {new Date(
                                                            booking.start_date
                                                        ).toLocaleDateString()}{" "}
                                                        -{" "}
                                                        {new Date(
                                                            booking.end_date
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="mt-1">
                                                    <span
                                                        className={`px-2 py-0.5 text-xs rounded-full ${
                                                            booking.booking_status ===
                                                            "Approved"
                                                                ? "bg-green-100 text-green-800"
                                                                : booking.booking_status ===
                                                                  "Pending"
                                                                ? "bg-yellow-100 text-yellow-800"
                                                                : "bg-red-100 text-red-800"
                                                        }`}
                                                    >
                                                        {booking.booking_status}
                                                    </span>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-500" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right side - Project details */}
                        <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                            {activeBooking ? (
                                <div>
                                    {/* Header */}
                                    <div className="h-24 sm:h-28 flex items-center bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-6">
                                        <div>
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <h2 className="text-xl sm:text-2xl font-bold text-white">
                                                    {
                                                        activeBooking.project
                                                            ?.title
                                                    }
                                                </h2>
                                                <span
                                                    className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full ${
                                                        activeBooking.booking_status ===
                                                        "Approved"
                                                            ? "bg-green-100/20 text-green-100"
                                                            : activeBooking.booking_status ===
                                                              "Pending"
                                                            ? "bg-yellow-100/20 text-yellow-100"
                                                            : "bg-red-100/20 text-red-100"
                                                    }`}
                                                >
                                                    {
                                                        activeBooking.booking_status
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 sm:p-6">
                                        <div className="space-y-4 sm:space-y-6">
                                            {/* Project Overview */}
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <h3 className="font-semibold text-gray-800 mb-3">
                                                    Project Overview
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {/* Location */}
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                                                            <MapPin className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-gray-700">
                                                                Location
                                                            </h4>
                                                            <p className="text-gray-600 text-sm">
                                                                {activeBooking
                                                                    .project
                                                                    ?.location ||
                                                                    "Location not specified"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Dates */}
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                                                            <CalendarDays className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-gray-700">
                                                                Dates
                                                            </h4>
                                                            <p className="text-gray-600 text-sm">
                                                                {new Date(
                                                                    activeBooking.start_date
                                                                ).toLocaleDateString()}{" "}
                                                                to{" "}
                                                                {new Date(
                                                                    activeBooking.end_date
                                                                ).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Group Size */}
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                                                            <Users className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-gray-700">
                                                                Group Size
                                                            </h4>
                                                            <p className="text-gray-600 text-sm">
                                                                {
                                                                    activeBooking.number_of_travellers
                                                                }{" "}
                                                                volunteer
                                                                {activeBooking.number_of_travellers !==
                                                                1
                                                                    ? "s"
                                                                    : ""}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Duration */}
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                                                            <Clock className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-gray-700">
                                                                Duration
                                                            </h4>
                                                            <p className="text-gray-600 text-sm">
                                                                {calculateDuration(
                                                                    activeBooking.start_date,
                                                                    activeBooking.end_date
                                                                )}{" "}
                                                                days
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Payment Information */}
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <h3 className="font-semibold text-gray-800 mb-3">
                                                    Payment Information
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                                    {/* Total Amount */}
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                                                            <DollarSign className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-gray-700">
                                                                Total Amount
                                                            </h4>
                                                            <p className="text-gray-600 font-semibold">
                                                                $
                                                                {calculateTotalAmount(
                                                                    activeBooking.start_date,
                                                                    activeBooking.end_date,
                                                                    activeBooking
                                                                        .project
                                                                        ?.fees ||
                                                                        0,
                                                                    activeBooking.number_of_travellers
                                                                ).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Amount Paid */}
                                                    {activeBooking?.payments
                                                        ?.length > 0 && (
                                                        <div className="flex items-start gap-3">
                                                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                                                                <DollarSign className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium text-gray-700">
                                                                    Amount Paid
                                                                </h4>
                                                                <p className="text-gray-600 font-semibold">
                                                                    $
                                                                    {calculateTotalPaid().toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Payment History */}
                                                {activeBooking?.payments
                                                    ?.length > 0 && (
                                                    <div className="mb-4">
                                                        <h4 className="font-medium text-gray-700 mb-2">
                                                            Payment History
                                                        </h4>
                                                        <div className="space-y-2">
                                                            {activeBooking.payments.map(
                                                                (payment) => (
                                                                    <div
                                                                        key={
                                                                            payment.id
                                                                        }
                                                                        className="bg-white p-3 rounded border border-gray-200 text-sm"
                                                                    >
                                                                        <div className="flex justify-between items-center">
                                                                            <div>
                                                                                <p className="font-medium">
                                                                                    $
                                                                                    {
                                                                                        payment.amount
                                                                                    }
                                                                                </p>
                                                                                {/* {payment.stripe_payment_id && (
                                                                                    <p className="text-gray-500 text-xs">
                                                                                        ID:{" "}
                                                                                        {
                                                                                            payment.stripe_payment_id
                                                                                        }
                                                                                    </p>
                                                                                )} */}
                                                                            </div>
                                                                            <span
                                                                                className={`px-2 py-0.5 rounded-full text-xs ${
                                                                                    payment.status ===
                                                                                    "succeeded"
                                                                                        ? "bg-green-100 text-green-800"
                                                                                        : payment.status ===
                                                                                          "pending"
                                                                                        ? "bg-yellow-100 text-yellow-800"
                                                                                        : payment.status ===
                                                                                          "deposit_paid"
                                                                                        ? "bg-blue-100 text-blue-800"
                                                                                        : "bg-red-100 text-red-800"
                                                                                }`}
                                                                            >
                                                                                Deposit
                                                                                Payment
                                                                                Made
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Pay Now Button */}
                                                <div>
                                                    {!shouldHidePayButton() &&
                                                    calculateRemainingBalance() >
                                                        0 ? (
                                                        <button
                                                            onClick={() =>
                                                                handlePayment(
                                                                    activeBooking
                                                                )
                                                            }
                                                            className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                        >
                                                            Pay Now ($
                                                            {calculateRemainingBalance().toLocaleString()}
                                                            )
                                                        </button>
                                                    ) : (
                                                        <div
                                                            className={`p-3 rounded ${
                                                                activeBooking?.booking_status !==
                                                                "Approved"
                                                                    ? "bg-yellow-50 text-yellow-800"
                                                                    : "bg-blue-50 text-blue-800"
                                                            } text-sm`}
                                                        >
                                                            {activeBooking?.booking_status !==
                                                            "Approved"
                                                                ? "Your booking is pending approval"
                                                                : "Deposit payment already completed"}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Project Information */}
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <h3 className="font-semibold text-gray-800 mb-3">
                                                    Project Information
                                                </h3>
                                                <p className="text-gray-600 mb-4 text-sm">
                                                    {activeBooking.project
                                                        ?.short_description ||
                                                        "No additional description available."}
                                                </p>
                                                <div className="flex flex-col sm:flex-row justify-between gap-3">
                                                    {activeBooking.can_send_reminder && (
                                                        <button
                                                            onClick={() =>
                                                                post(
                                                                    route(
                                                                        "volunteer.send-reminder",
                                                                        {
                                                                            bookingId:
                                                                                activeBooking.id,
                                                                        }
                                                                    )
                                                                )
                                                            }
                                                            className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                        >
                                                            Send{" "}
                                                            {
                                                                activeBooking.reminder_stage
                                                            }{" "}
                                                            Reminder
                                                            <ArrowRight className="w-3 h-3 ml-1.5" />
                                                        </button>
                                                    )}
                                                    <Link
                                                        href={`/volunteer-programs/${activeBooking.project?.slug}`}
                                                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        View Full Details
                                                    </Link>

                                                    {/* Message Modal */}
                                                    {showMessageModal &&
                                                        activeBooking && (
                                                            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                                                                <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                                                                    <div className="p-6">
                                                                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                                                                            Message
                                                                            Project
                                                                            Owner
                                                                        </h3>

                                                                        <form
                                                                            onSubmit={
                                                                                handleSendMessage
                                                                            }
                                                                        >
                                                                            <textarea
                                                                                className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                                                placeholder="Type your message here..."
                                                                                value={
                                                                                    messageContent
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    setMessageContent(
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    )
                                                                                }
                                                                            />
                                                                            <div className="mt-4 flex justify-end space-x-3">
                                                                                <button
                                                                                    onClick={() =>
                                                                                        setShowMessageModal(
                                                                                            false
                                                                                        )
                                                                                    }
                                                                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                                                                >
                                                                                    Cancel
                                                                                </button>
                                                                                <button
                                                                                    type="submit"
                                                                                    className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
                                                                                >
                                                                                    Send
                                                                                    Message
                                                                                </button>
                                                                            </div>
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                    <button
                                                        onClick={() =>
                                                            setShowMessageModal(
                                                                true
                                                            )
                                                        }
                                                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        <MessageCircle className="w-4 h-4 mr-2" />
                                                        Message Project Owner
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center p-8">
                                    <div className="text-center">
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 mb-3">
                                            <CalendarDays className="h-5 w-5" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                                            Select a project
                                        </h3>
                                        <p className="text-gray-500 text-sm">
                                            Choose a project from the list
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </VolunteerLayout>
    );
}

// Helper function to calculate duration between dates
function calculateDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

// New function to calculate total fees
function calculateTotalAmount(startDate, endDate, fees, travellers) {
    const duration = calculateDuration(startDate, endDate);
    return duration * fees * travellers;
}
