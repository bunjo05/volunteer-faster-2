import VolunteerLayout from "@/Layouts/VolunteerLayout";
import { usePage, Link, useForm } from "@inertiajs/react";
import {
    CalendarDays,
    Users,
    MessageCircle,
    MapPin,
    Clock,
    ArrowRight,
    ChevronRight,
    DollarSign,
    Star,
    AlertCircle,
    CheckCircle2,
    Clock as ClockIcon,
    XCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";

const statusIcons = {
    Approved: CheckCircle2,
    Pending: ClockIcon,
    Rejected: XCircle,
    Completed: CheckCircle2,
    Cancelled: XCircle,
};

const statusColors = {
    Approved: "text-green-600 bg-green-50",
    Pending: "text-yellow-600 bg-yellow-50",
    Rejected: "text-red-600 bg-red-50",
    Completed: "text-purple-600 bg-purple-50",
    Cancelled: "text-gray-600 bg-gray-50",
};

export default function Projects({ auth, payments, points, totalPoints }) {
    const [messageContent, setMessageContent] = useState("");
    const { post } = useForm();
    const { bookings = [], flash } = usePage().props;
    const [activeBooking, setActiveBooking] = useState(bookings[0] || null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [stripePromise, setStripePromise] = useState(null);
    const [showMessageModal, setShowMessageModal] = useState(false);

    // Add this state
    const [pointsPaymentSuccess, setPointsPaymentSuccess] = useState(false);

    // Add this helper function to check if points were used for the booking
    const hasPointsTransaction = (booking) => {
        return booking?.has_points_transaction || false;
    };

    // Add this state

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

    // Helper functions
    const calculateDuration = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    };

    const calculateTotalAmount = (startDate, endDate, fees, travellers) => {
        return calculateDuration(startDate, endDate) * fees * travellers;
    };

    const calculateTotalPaid = () => {
        if (!activeBooking?.payments) return 0;
        return activeBooking.payments.reduce(
            (total, payment) => total + parseFloat(payment.amount),
            0
        );
    };

    const calculateRemainingBalance = () => {
        const totalAmount = calculateTotalAmount(
            activeBooking.start_date,
            activeBooking.end_date,
            activeBooking.project?.fees || 0,
            activeBooking.number_of_travellers
        );
        return totalAmount - calculateTotalPaid();
    };

    const shouldHidePayButton = () => {
        if (!activeBooking) return true;
        if (activeBooking.booking_status !== "Approved") return true;
        return false;
    };

    const hasPaidDeposit = () => {
        return activeBooking?.payments?.some(
            (p) => p.status === "deposit_paid"
        );
    };

    const handlePayment = async (booking) => {
        if (!stripePromise) return;

        try {
            const response = await axios.post(
                route("payment.checkout"),
                { booking_id: booking.id },
                {
                    headers: {
                        "X-CSRF-TOKEN": document.querySelector(
                            'meta[name="csrf-token"]'
                        ).content,
                    },
                }
            );

            const result = await stripePromise.redirectToCheckout({
                sessionId: response.data.sessionId,
            });

            if (result.error) console.error(result.error.message);
        } catch (error) {
            console.error("Payment error:", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
            }
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageContent.trim()) return alert("Message cannot be empty");
        if (
            !activeBooking?.project?.user ||
            activeBooking.project.user.id === auth.user.id
        ) {
            return alert("Cannot send message - invalid recipient");
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
                    setShowSuccess(true);
                },
                onError: (errors) => {
                    console.error("Error sending message:", errors);
                    alert("Failed to send message. Please try again.");
                },
            }
        );
    };

    useEffect(() => {
        if (flash?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    // Add this state
    const [showPointsPaymentModal, setShowPointsPaymentModal] = useState(false);
    // const [userPoints, setUserPoints] = useState(initialPoints || 0);
    // Simplify points state management
    const [userPoints, setUserPoints] = useState(points || 0);
    const [isProcessingPoints, setIsProcessingPoints] = useState(false);
    const [pointsError, setPointsError] = useState(null);

    const [pointsState, setPointsState] = useState({
        balance: points || 0, // Changed from initialPoints to points
        isLoading: false,
        error: null,
    });

    // Update points when the points prop changes
    useEffect(() => {
        setPointsState((prev) => ({
            ...prev,
            balance: points || 0,
            error: null,
        }));
    }, [points]);

    // Clear error after 5 seconds
    useEffect(() => {
        if (pointsError) {
            const timer = setTimeout(() => setPointsError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [pointsError]);

    const handlePayWithPoints = async () => {
        const pointsNeeded = Math.ceil(calculateRemainingBalance() / 1);
        if (totalPoints < pointsNeeded) {
            setPointsState((prev) => ({
                ...prev,
                error: "You don't have enough points",
            }));
            return;
        }
        setPointsState((prev) => ({
            ...prev,
            isLoading: true,
            error: null,
        }));
        try {
            const response = await axios.post(
                route("volunteer.pay-with-points", {
                    booking: activeBooking.id,
                }),
                {},
                {
                    headers: {
                        "X-CSRF-TOKEN": document.querySelector(
                            'meta[name="csrf-token"]'
                        ).content,
                    },
                }
            );
            if (!response.data.success) {
                setPointsState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: response.data.message || "Payment failed",
                }));
                return;
            }
            setShowPointsPaymentModal(false);
            setPointsPaymentSuccess(true); // Add this line
            setShowSuccess(true);
            // Update points balance optimistically
            setPointsState((prev) => ({
                balance: prev.balance - pointsNeeded,
                isLoading: false,
                error: null,
            }));
        } catch (error) {
            console.error("Points payment error:", error);
            setPointsState((prev) => ({
                ...prev,
                isLoading: false,
                error:
                    error.response?.data?.message ||
                    "Failed to process points payment",
            }));
        }
    };

    return (
        <VolunteerLayout auth={auth}>
            {/* Success Notification */}
            {showSuccess && (
                <div className="fixed top-4 right-4 z-50 animate-fade-in-up">
                    <div className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md shadow">
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        <span className="text-sm">{flash.success}</span>
                    </div>
                </div>
            )}

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        My Volunteer Projects
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Manage your upcoming volunteer commitments and track
                        your contributions
                    </p>
                </div>

                {bookings.length === 0 ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center max-w-2xl mx-auto">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                            <CalendarDays className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No projects booked yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                            You haven't booked any volunteer projects. Browse
                            available opportunities to get started.
                        </p>
                        <Link
                            href="/projects"
                            className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                        >
                            Browse Volunteer Projects
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Projects List Sidebar */}
                        <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                                <h3 className="font-semibold text-gray-800">
                                    My Projects{" "}
                                    <span className="text-gray-500">
                                        ({bookings.length})
                                    </span>
                                </h3>
                            </div>
                            <div className="overflow-y-auto max-h-[calc(100vh-220px)]">
                                {bookings.map((booking) => {
                                    const StatusIcon =
                                        statusIcons[booking.booking_status] ||
                                        AlertCircle;
                                    return (
                                        <div
                                            key={booking.id}
                                            className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                                                activeBooking?.id === booking.id
                                                    ? "bg-blue-50 border-l-4 border-blue-500"
                                                    : "hover:bg-gray-50"
                                            }`}
                                            onClick={() => {
                                                setActiveBooking(booking);
                                                setPointsPaymentSuccess(false);
                                            }}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-base font-medium text-gray-900 truncate">
                                                        {booking.project?.title}
                                                    </h4>
                                                    <div className="flex items-center mt-1 text-sm text-gray-500">
                                                        <CalendarDays className="w-4 h-4 mr-1.5 flex-shrink-0" />
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
                                                </div>
                                                <div className="flex items-center ml-3">
                                                    <div
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            statusColors[
                                                                booking
                                                                    .booking_status
                                                            ]
                                                        }`}
                                                    >
                                                        <StatusIcon className="w-3 h-3 mr-1" />
                                                        {booking.booking_status}
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 ml-2 text-gray-400" />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Project Details Panel */}
                        <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-sm border border-gray-200">
                            {activeBooking ? (
                                <>
                                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-xl">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h2 className="text-2xl font-bold text-white">
                                                    {
                                                        activeBooking.project
                                                            ?.title
                                                    }
                                                </h2>
                                                <div className="flex items-center mt-2">
                                                    <div
                                                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                            activeBooking.booking_status ===
                                                            "Completed"
                                                                ? "bg-purple-100 text-purple-800"
                                                                : statusColors[
                                                                      activeBooking
                                                                          .booking_status
                                                                  ]
                                                        }`}
                                                    >
                                                        {
                                                            activeBooking.booking_status
                                                        }
                                                    </div>
                                                    {activeBooking.booking_status ===
                                                        "Completed" &&
                                                        activeBooking.days_spent && (
                                                            <div className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                                                <Star className="w-4 h-4 mr-1" />
                                                                Earned{" "}
                                                                {
                                                                    activeBooking.days_spent
                                                                }{" "}
                                                                points
                                                            </div>
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="grid grid-cols-1 gap-6">
                                            {/* Project Summary Card */}
                                            <div className="bg-gray-50 p-5 rounded-xl">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                                    Project Summary
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="flex items-start">
                                                        <div className="flex-shrink-0 bg-blue-100 p-2 rounded-lg">
                                                            <MapPin className="h-5 w-5 text-blue-600" />
                                                        </div>
                                                        <div className="ml-3">
                                                            <h4 className="text-sm font-medium text-gray-700">
                                                                Location
                                                            </h4>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                {activeBooking
                                                                    .project
                                                                    ?.location ||
                                                                    "Not specified"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start">
                                                        <div className="flex-shrink-0 bg-blue-100 p-2 rounded-lg">
                                                            <CalendarDays className="h-5 w-5 text-blue-600" />
                                                        </div>
                                                        <div className="ml-3">
                                                            <h4 className="text-sm font-medium text-gray-700">
                                                                Dates
                                                            </h4>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                {new Date(
                                                                    activeBooking.start_date
                                                                ).toLocaleDateString()}{" "}
                                                                -{" "}
                                                                {new Date(
                                                                    activeBooking.end_date
                                                                ).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start">
                                                        <div className="flex-shrink-0 bg-blue-100 p-2 rounded-lg">
                                                            <Users className="h-5 w-5 text-blue-600" />
                                                        </div>
                                                        <div className="ml-3">
                                                            <h4 className="text-sm font-medium text-gray-700">
                                                                Group Size
                                                            </h4>
                                                            <p className="text-sm text-gray-600 mt-1">
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
                                                    <div className="flex items-start">
                                                        <div className="flex-shrink-0 bg-blue-100 p-2 rounded-lg">
                                                            <Clock className="h-5 w-5 text-blue-600" />
                                                        </div>
                                                        <div className="ml-3">
                                                            <h4 className="text-sm font-medium text-gray-700">
                                                                Duration
                                                            </h4>
                                                            <p className="text-sm text-gray-600 mt-1">
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
                                            {pointsPaymentSuccess && (
                                                <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg">
                                                    <CheckCircle2 className="inline h-5 w-5 mr-2" />
                                                    Balance successfully paid
                                                    with points!
                                                </div>
                                            )}

                                            {/* Payment Information Card */}
                                            <div className="bg-gray-50 p-5 rounded-xl">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                                    Payment Information
                                                </h3>
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                                                            <h4 className="text-sm font-medium text-gray-700 mb-1">
                                                                Total Amount
                                                            </h4>
                                                            <p className="text-xl font-semibold text-gray-900">
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
                                                        {activeBooking?.payments
                                                            ?.length > 0 && (
                                                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                                                <h4 className="text-sm font-medium text-gray-700 mb-1">
                                                                    Amount Paid
                                                                </h4>
                                                                <p className="text-xl font-semibold text-gray-900">
                                                                    $
                                                                    {calculateTotalPaid().toLocaleString()}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {activeBooking?.payments
                                                        ?.length > 0 && (
                                                        <div>
                                                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                                Payment History
                                                            </h4>
                                                            <div className="space-y-2">
                                                                {activeBooking.payments.map(
                                                                    (
                                                                        payment
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                payment.id
                                                                            }
                                                                            className="bg-white p-3 rounded-lg border border-gray-200"
                                                                        >
                                                                            <div className="flex justify-between items-center">
                                                                                <div>
                                                                                    <p className="font-medium">
                                                                                        $
                                                                                        {
                                                                                            payment.amount
                                                                                        }
                                                                                    </p>
                                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                                        {new Date(
                                                                                            payment.created_at
                                                                                        ).toLocaleDateString()}
                                                                                    </p>
                                                                                </div>
                                                                                <span
                                                                                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
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
                                                                                    {payment.status ===
                                                                                    "deposit_paid"
                                                                                        ? "Deposit Paid"
                                                                                        : payment.status}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {/* <div className="pt-2">
                                                        {!shouldHidePayButton() &&
                                                        calculateRemainingBalance() >
                                                            0 ? (
                                                            <button
                                                                onClick={() =>
                                                                    handlePayment(
                                                                        activeBooking
                                                                    )
                                                                }
                                                                className="w-full md:w-auto px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                                                            >
                                                                Pay Now ($
                                                                {calculateRemainingBalance().toLocaleString()}
                                                                )
                                                            </button>
                                                        ) : (
                                                            <div
                                                                className={`p-3 rounded-lg ${
                                                                    activeBooking?.booking_status ===
                                                                        "Approved" ||
                                                                    activeBooking?.booking_status ===
                                                                        "Completed"
                                                                        ? "bg-blue-50 text-blue-800"
                                                                        : "bg-yellow-50 text-yellow-800"
                                                                }`}
                                                            >
                                                                <p className="text-sm">
                                                                    {activeBooking?.booking_status ===
                                                                        "Approved" ||
                                                                    activeBooking?.booking_status ===
                                                                        "Completed"
                                                                        ? "Deposit payment already completed"
                                                                        : "Your booking is pending approval"}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div> */}
                                                    {!shouldHidePayButton() &&
                                                        calculateRemainingBalance() >
                                                            0 && (
                                                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                                                {/* Show Pay Deposit Fee button only if deposit hasn't been paid */}
                                                                {!hasPaidDeposit() && (
                                                                    <button
                                                                        onClick={() =>
                                                                            handlePayment(
                                                                                activeBooking
                                                                            )
                                                                        }
                                                                        className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                                                                    >
                                                                        Pay
                                                                        Deposit
                                                                        Fee ($
                                                                        {Math.round(
                                                                            calculateTotalAmount(
                                                                                activeBooking.start_date,
                                                                                activeBooking.end_date,
                                                                                activeBooking
                                                                                    .project
                                                                                    ?.fees ||
                                                                                    0,
                                                                                activeBooking.number_of_travellers
                                                                            ) *
                                                                                0.2
                                                                        )}
                                                                        )
                                                                    </button>
                                                                )}

                                                                {/* Show Pay with Points button only if:
                - deposit has been paid
                - points payment hasn't succeeded
                - no existing points transaction for this booking */}
                                                                {hasPaidDeposit() &&
                                                                    !pointsPaymentSuccess &&
                                                                    !hasPointsTransaction(
                                                                        activeBooking
                                                                    ) && (
                                                                        <button
                                                                            onClick={() =>
                                                                                setShowPointsPaymentModal(
                                                                                    true
                                                                                )
                                                                            }
                                                                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                                                                        >
                                                                            Pay
                                                                            Balance
                                                                            with
                                                                            Points
                                                                            ($
                                                                            {calculateRemainingBalance().toLocaleString()}
                                                                            )
                                                                        </button>
                                                                    )}
                                                            </div>
                                                        )}
                                                    {hasPointsTransaction(
                                                        activeBooking
                                                    ) && (
                                                        <div className="mt-4 p-3 bg-purple-100 text-purple-800 rounded-lg flex items-center">
                                                            <CheckCircle2 className="h-5 w-5 mr-2 text-purple-600" />
                                                            <span>
                                                                This booking has
                                                                been paid with
                                                                points exchange
                                                            </span>
                                                        </div>
                                                    )}
                                                    {/* Success Notification */}
                                                    {showSuccess &&
                                                        flash?.success && (
                                                            <div className="fixed top-4 right-4 z-50 animate-fade-in-up">
                                                                <div className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md shadow">
                                                                    <CheckCircle2 className="h-5 w-5 mr-2" />
                                                                    <span className="text-sm">
                                                                        {
                                                                            flash.success
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    {/* Points Payment Modal */}
                                                    {showPointsPaymentModal && (
                                                        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                                                            <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
                                                                <div className="p-6">
                                                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                                                        Pay with
                                                                        Points
                                                                    </h3>

                                                                    {/* Error message display */}
                                                                    {pointsState.error && (
                                                                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                                                                            {
                                                                                pointsState.error
                                                                            }
                                                                        </div>
                                                                    )}

                                                                    <div className="mb-4">
                                                                        <p className="text-gray-700 mb-2">
                                                                            Remaining
                                                                            Balance:{" "}
                                                                            <span className="font-semibold">
                                                                                $
                                                                                {calculateRemainingBalance().toLocaleString()}
                                                                            </span>
                                                                        </p>
                                                                        <p className="text-gray-700 mb-2">
                                                                            Your
                                                                            Points:{" "}
                                                                            <span className="font-semibold">
                                                                                {
                                                                                    totalPoints
                                                                                }
                                                                            </span>
                                                                        </p>
                                                                        <p className="text-gray-700">
                                                                            Points
                                                                            Needed:{" "}
                                                                            <span className="font-semibold">
                                                                                {Math.ceil(
                                                                                    calculateRemainingBalance() /
                                                                                        1
                                                                                )}{" "}
                                                                                (1
                                                                                point
                                                                                =
                                                                                $1)
                                                                            </span>
                                                                        </p>
                                                                    </div>
                                                                    <div className="mt-4 flex justify-end space-x-3">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setShowPointsPaymentModal(
                                                                                    false
                                                                                );
                                                                                setPointsState(
                                                                                    (
                                                                                        prev
                                                                                    ) => ({
                                                                                        ...prev,
                                                                                        error: null,
                                                                                    })
                                                                                );
                                                                            }}
                                                                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                                                                            disabled={
                                                                                pointsState.isLoading
                                                                            }
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                        <button
                                                                            onClick={
                                                                                handlePayWithPoints
                                                                            }
                                                                            className={`px-4 py-2 text-white font-medium rounded-lg flex items-center justify-center ${
                                                                                pointsState.isLoading
                                                                                    ? "bg-indigo-400"
                                                                                    : "bg-indigo-600 hover:bg-indigo-700"
                                                                            }`}
                                                                            disabled={
                                                                                pointsState.isLoading ||
                                                                                pointsState.balance <
                                                                                    Math.ceil(
                                                                                        calculateRemainingBalance() /
                                                                                            1
                                                                                    )
                                                                            }
                                                                        >
                                                                            {pointsState.isLoading ? (
                                                                                <>
                                                                                    <svg
                                                                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                        fill="none"
                                                                                        viewBox="0 0 24 24"
                                                                                    >
                                                                                        <circle
                                                                                            className="opacity-25"
                                                                                            cx="12"
                                                                                            cy="12"
                                                                                            r="10"
                                                                                            stroke="currentColor"
                                                                                            strokeWidth="4"
                                                                                        ></circle>
                                                                                        <path
                                                                                            className="opacity-75"
                                                                                            fill="currentColor"
                                                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                                        ></path>
                                                                                    </svg>
                                                                                    Processing...
                                                                                </>
                                                                            ) : (
                                                                                "Confirm Payment"
                                                                            )}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Project Description Card */}
                                            <div className="bg-gray-50 p-5 rounded-xl">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                                    Project Details
                                                </h3>
                                                <p className="text-gray-600 mb-6">
                                                    {activeBooking.project
                                                        ?.short_description ||
                                                        "No description available."}
                                                </p>
                                                <div className="flex flex-wrap gap-3">
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
                                                            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                                                        >
                                                            Send{" "}
                                                            {
                                                                activeBooking.reminder_stage
                                                            }{" "}
                                                            Reminder
                                                            <ArrowRight className="w-4 h-4 ml-2" />
                                                        </button>
                                                    )}
                                                    <Link
                                                        href={`/volunteer-programs/${activeBooking.project?.slug}`}
                                                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                                                    >
                                                        View Full Project
                                                        Details
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            setShowMessageModal(
                                                                true
                                                            )
                                                        }
                                                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                                                    >
                                                        <MessageCircle className="w-4 h-4 mr-2" />
                                                        Message Project Owner
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="h-full flex items-center justify-center p-12">
                                    <div className="text-center">
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
                                            <CalendarDays className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                                            Select a project
                                        </h3>
                                        <p className="text-gray-500">
                                            Choose a project from the list to
                                            view details
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Message Modal */}
                {showMessageModal && activeBooking && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Message Project Owner
                                </h3>
                                <form onSubmit={handleSendMessage}>
                                    <textarea
                                        className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Type your message here..."
                                        value={messageContent}
                                        onChange={(e) =>
                                            setMessageContent(e.target.value)
                                        }
                                    />
                                    <div className="mt-4 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowMessageModal(false)
                                            }
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                                        >
                                            Send Message
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </VolunteerLayout>
    );
}
