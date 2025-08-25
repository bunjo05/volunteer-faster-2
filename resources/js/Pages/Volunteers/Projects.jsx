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
import { Button } from "@headlessui/react";
import Review from "@/Components/Review";

const statusIcons = {
    Approved: CheckCircle2,
    Pending: ClockIcon,
    Rejected: XCircle,
    Completed: CheckCircle2,
    Cancelled: XCircle,
};

const statusColors = {
    Approved: "bg-success text-success-content",
    Pending: "bg-warning text-warning-content",
    Rejected: "bg-error text-error-content",
    Completed: "bg-info text-info-content",
    Cancelled: "bg-neutral text-neutral-content",
};

export default function Projects({ auth, payments, points, totalPoints }) {
    const [messageContent, setMessageContent] = useState("");
    const { bookings = [], flash } = usePage().props;
    const [activeBooking, setActiveBooking] = useState(bookings[0] || null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [stripePromise, setStripePromise] = useState(null);
    const [showMessageModal, setShowMessageModal] = useState(false);

    const [showMobileSidebar, setShowMobileSidebar] = useState(false);

    // Function to handle project selection (will close mobile sidebar)
    const handleProjectSelect = (booking) => {
        setActiveBooking(booking);
        setPointsPaymentSuccess(false);
        setShowPointsPaymentModal(false);
        setShowMobileSidebar(false); // Close sidebar when project is selected
    };

    const { post, setData, errors, data, processing } = useForm({
        message: "",
        sender_id: "",
        receiver_id: "",
        project_id: "",
        status: "",
    });

    const [pointsPaymentSuccess, setPointsPaymentSuccess] = useState(false);
    const [showPointsPaymentModal, setShowPointsPaymentModal] = useState(false);
    const [pointsState, setPointsState] = useState({
        balance: totalPoints || 0,
        isLoading: false,
        error: null,
    });

    const hasPointsTransaction = (booking) => {
        return booking?.has_points_transaction || false;
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

        if (!messageContent.trim()) {
            return alert("Message cannot be empty");
        }

        if (
            !activeBooking?.project?.user ||
            activeBooking.project.user.id === auth.user.id
        ) {
            return alert("Cannot send message - invalid recipient");
        }

        const messageData = {
            message: messageContent,
            sender_id: auth.user.id,
            receiver_id: activeBooking.project.user.id,
            project_id: activeBooking.project.id,
            status: "Unread",
        };

        post(route("volunteer.messages.store"), messageData, {
            onSuccess: () => {
                setShowMessageModal(false);
                setMessageContent("");
                setShowSuccess(true);
            },
            onError: (errors) => {
                console.error("Error sending message:", errors);
                alert("Failed to send message. Please try again.");
            },
        });
    };

    useEffect(() => {
        if (flash?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    useEffect(() => {
        setPointsState((prev) => ({
            ...prev,
            balance: totalPoints || 0,
            error: null,
        }));
    }, [totalPoints]);

    const handlePayWithPoints = async () => {
        const pointsNeeded = Math.ceil(calculateRemainingBalance() / 0.5);
        if (pointsState.balance < pointsNeeded) {
            setPointsState((prev) => ({
                ...prev,
                error: `You don't have enough points (needed: ${pointsNeeded}, available: ${pointsState.balance})`,
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
            setPointsPaymentSuccess(true);
            setShowSuccess(true);
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

    const calculateDepositAmount = () => {
        const totalAmount = calculateTotalAmount(
            activeBooking.start_date,
            activeBooking.end_date,
            activeBooking.project?.fees || 0,
            activeBooking.number_of_travellers
        );
        return totalAmount * 0.2;
    };

    return (
        <VolunteerLayout auth={auth}>
            {/* Success Notification */}
            {showSuccess && (
                <div className="toast toast-top toast-end z-50">
                    <div className="alert alert-success">
                        <CheckCircle2 className="h-5 w-5" />
                        <span>{flash.success}</span>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">
                        My Volunteer Projects
                    </h1>
                    <p className="text-opacity-80 max-w-2xl mx-auto">
                        Manage your upcoming volunteer commitments and track
                        your contributions
                    </p>
                </div>

                {bookings.length === 0 ? (
                    <div className="card bg-base-200 max-w-2xl mx-auto">
                        <div className="card-body items-center text-center">
                            <div className="rounded-full bg-primary/10 p-4 mb-4">
                                <CalendarDays className="h-8 w-8 text-primary" />
                            </div>
                            <h2 className="card-title">
                                No projects booked yet
                            </h2>
                            <p>
                                You haven't booked any volunteer projects.
                                Browse available opportunities to get started.
                            </p>
                            <div className="card-actions mt-4">
                                <Link
                                    href="/projects"
                                    className="btn btn-primary"
                                >
                                    Browse Volunteer Projects
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Projects List Sidebar */}
                        {/* Mobile Burger Button - Only shows on small screens */}
                        <div className="lg:hidden mb-4">
                            <button
                                onClick={() =>
                                    setShowMobileSidebar(!showMobileSidebar)
                                }
                                className="btn btn-primary"
                            >
                                {showMobileSidebar ? (
                                    <span>Hide Projects</span>
                                ) : (
                                    <span>
                                        Show Projects ({bookings.length})
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Projects List Sidebar - Modified for mobile responsiveness */}
                        <div
                            className={`card bg-base-100 w-full lg:w-1/3 ${
                                showMobileSidebar ? "block" : "hidden lg:block"
                            }`}
                        >
                            <div className="card-title p-4 border-b">
                                <h3>
                                    My Projects{" "}
                                    <span className="text-opacity-70">
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
                                            className={`p-4 border-b cursor-pointer transition-colors hover:bg-base-200 ${
                                                activeBooking?.id === booking.id
                                                    ? "bg-primary/10"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleProjectSelect(booking)
                                            }
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium truncate">
                                                        {booking.project?.title}
                                                    </h4>
                                                    <div className="flex items-center mt-1 text-sm opacity-70">
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
                                                        className={`badge gap-1 ${
                                                            statusColors[
                                                                booking
                                                                    .booking_status
                                                            ]
                                                        }`}
                                                    >
                                                        <StatusIcon className="w-3 h-3" />
                                                        {booking.booking_status}
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 ml-2 opacity-50" />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Project Details Panel */}
                        <div className="card bg-base-100 w-full lg:w-2/3">
                            {activeBooking ? (
                                <>
                                    <div className="card-body p-0">
                                        <div className="bg-gradient-to-r from-primary to-primary-focus p-6 rounded-t-box">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h2 className="text-2xl font-bold text-primary-content">
                                                        {
                                                            activeBooking
                                                                .project?.title
                                                        }
                                                    </h2>
                                                    <div className="flex items-center mt-2 gap-2">
                                                        <div
                                                            className={`badge ${
                                                                statusColors[
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
                                                                <div className="badge badge-info gap-1">
                                                                    <Star className="w-4 h-4" />
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
                                                <div className="card bg-base-200">
                                                    <div className="card-body">
                                                        <h3 className="card-title">
                                                            Project Summary
                                                        </h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="flex items-start gap-3">
                                                                <div className="bg-primary/10 p-2 rounded-lg">
                                                                    <MapPin className="h-5 w-5 text-primary" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-medium">
                                                                        Location
                                                                    </h4>
                                                                    <p className="text-sm opacity-80">
                                                                        {activeBooking
                                                                            .project
                                                                            ?.location ||
                                                                            "Not specified"}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-start gap-3">
                                                                <div className="bg-primary/10 p-2 rounded-lg">
                                                                    <CalendarDays className="h-5 w-5 text-primary" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-medium">
                                                                        Dates
                                                                    </h4>
                                                                    <p className="text-sm opacity-80">
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
                                                            <div className="flex items-start gap-3">
                                                                <div className="bg-primary/10 p-2 rounded-lg">
                                                                    <Users className="h-5 w-5 text-primary" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-medium">
                                                                        Group
                                                                        Size
                                                                    </h4>
                                                                    <p className="text-sm opacity-80">
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
                                                            <div className="flex items-start gap-3">
                                                                <div className="bg-primary/10 p-2 rounded-lg">
                                                                    <Clock className="h-5 w-5 text-primary" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-medium">
                                                                        Duration
                                                                    </h4>
                                                                    <p className="text-sm opacity-80">
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
                                                </div>

                                                {activeBooking.project
                                                    .point_exchange === 1 && (
                                                    <div>
                                                        {pointsPaymentSuccess && (
                                                            <div className="alert alert-success">
                                                                <CheckCircle2 className="h-5 w-5" />
                                                                <span>
                                                                    Balance
                                                                    successfully
                                                                    paid with
                                                                    points!
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Payment Information Card */}
                                                {activeBooking.project
                                                    .type_of_project ===
                                                    "Paid" && (
                                                    <div className="card bg-base-200">
                                                        <div className="card-body">
                                                            <h3 className="card-title">
                                                                Payment
                                                                Information
                                                            </h3>
                                                            <div className="space-y-4">
                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                    <div className="card bg-base-100">
                                                                        <div className="card-body p-4">
                                                                            <h4 className="text-sm font-medium opacity-70">
                                                                                Total
                                                                                Amount
                                                                            </h4>
                                                                            <p className="text-xl font-semibold">
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

                                                                    <div
                                                                        className={`card ${
                                                                            !hasPaidDeposit()
                                                                                ? "bg-warning/10"
                                                                                : "bg-base-100"
                                                                        }`}
                                                                    >
                                                                        <div className="card-body p-4">
                                                                            <h4 className="text-sm font-medium opacity-70">
                                                                                Deposit
                                                                                Fee{" "}
                                                                                {hasPaidDeposit() &&
                                                                                    "(Paid)"}
                                                                            </h4>
                                                                            <p
                                                                                className={`text-xl font-semibold ${
                                                                                    !hasPaidDeposit()
                                                                                        ? "text-warning"
                                                                                        : ""
                                                                                }`}
                                                                            >
                                                                                $
                                                                                {calculateDepositAmount().toLocaleString()}
                                                                            </p>
                                                                            {!hasPaidDeposit() && (
                                                                                <p className="text-xs text-warning mt-1">
                                                                                    20%
                                                                                    deposit
                                                                                    required
                                                                                    to
                                                                                    confirm
                                                                                    booking
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {activeBooking
                                                                        ?.payments
                                                                        ?.length >
                                                                        0 && (
                                                                        <div className="card bg-base-100">
                                                                            <div className="card-body p-4">
                                                                                <h4 className="text-sm font-medium opacity-70">
                                                                                    {hasPaidDeposit()
                                                                                        ? "Remaining Balance"
                                                                                        : "Amount Paid"}
                                                                                </h4>
                                                                                <p
                                                                                    className={`text-xl font-semibold ${
                                                                                        hasPaidDeposit() &&
                                                                                        calculateRemainingBalance() >
                                                                                            0
                                                                                            ? "text-warning"
                                                                                            : ""
                                                                                    }`}
                                                                                >
                                                                                    $
                                                                                    {hasPaidDeposit()
                                                                                        ? calculateRemainingBalance().toLocaleString()
                                                                                        : calculateTotalPaid().toLocaleString()}
                                                                                </p>
                                                                                {hasPaidDeposit() &&
                                                                                    calculateRemainingBalance() >
                                                                                        0 && (
                                                                                        <p className="text-xs text-warning mt-1">
                                                                                            Balance
                                                                                            must
                                                                                            be
                                                                                            paid
                                                                                            before
                                                                                            project
                                                                                            start
                                                                                            date
                                                                                        </p>
                                                                                    )}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {activeBooking
                                                                    ?.payments
                                                                    ?.length >
                                                                    0 && (
                                                                    <div>
                                                                        <h4 className="font-medium opacity-70 mb-2">
                                                                            Payment
                                                                            History
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
                                                                                        className="card bg-base-100"
                                                                                    >
                                                                                        <div className="card-body p-3">
                                                                                            <div className="flex justify-between items-center">
                                                                                                <div>
                                                                                                    <p className="font-medium">
                                                                                                        $
                                                                                                        {
                                                                                                            payment.amount
                                                                                                        }
                                                                                                    </p>
                                                                                                    <p className="text-xs opacity-60 mt-1">
                                                                                                        {new Date(
                                                                                                            payment.created_at
                                                                                                        ).toLocaleDateString()}
                                                                                                    </p>
                                                                                                </div>
                                                                                                <span
                                                                                                    className={`badge ${
                                                                                                        payment.status ===
                                                                                                        "succeeded"
                                                                                                            ? "badge-success"
                                                                                                            : payment.status ===
                                                                                                              "pending"
                                                                                                            ? "badge-warning"
                                                                                                            : payment.status ===
                                                                                                              "deposit_paid"
                                                                                                            ? "badge-primary"
                                                                                                            : "badge-error"
                                                                                                    }`}
                                                                                                >
                                                                                                    {payment.status ===
                                                                                                    "deposit_paid"
                                                                                                        ? "Deposit Paid"
                                                                                                        : payment.status}
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {!shouldHidePayButton() &&
                                                                    calculateRemainingBalance() >
                                                                        0 && (
                                                                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                                                            {!hasPaidDeposit() && (
                                                                                <button
                                                                                    onClick={() =>
                                                                                        handlePayment(
                                                                                            activeBooking
                                                                                        )
                                                                                    }
                                                                                    className="btn btn-success"
                                                                                >
                                                                                    Pay
                                                                                    Deposit
                                                                                    Fee
                                                                                    ($
                                                                                    {calculateDepositAmount().toLocaleString()}

                                                                                    )
                                                                                </button>
                                                                            )}

                                                                            {activeBooking
                                                                                .project
                                                                                .point_exchange ===
                                                                                1 && (
                                                                                <div>
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
                                                                                                className="btn btn-primary"
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
                                                                        </div>
                                                                    )}

                                                                {hasPointsTransaction(
                                                                    activeBooking
                                                                ) && (
                                                                    <div className="alert alert-info">
                                                                        <CheckCircle2 className="h-5 w-5" />
                                                                        <span>
                                                                            This
                                                                            booking
                                                                            has
                                                                            been
                                                                            paid
                                                                            with
                                                                            points
                                                                            exchange
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Project Description Card */}
                                                <div className="card bg-base-200">
                                                    <div className="card-body">
                                                        <h3 className="card-title">
                                                            Project Details
                                                        </h3>
                                                        <p className="opacity-80 mb-6">
                                                            {activeBooking
                                                                .project
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
                                                                    className="btn btn-outline"
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
                                                                className="btn btn-primary"
                                                            >
                                                                View Full
                                                                Project Details
                                                            </Link>

                                                            <Review
                                                                activeBooking={
                                                                    activeBooking
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="h-full flex items-center justify-center p-12">
                                    <div className="text-center">
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-base-200 mb-4">
                                            <CalendarDays className="h-5 w-5 opacity-70" />
                                        </div>
                                        <h3 className="text-lg font-medium">
                                            Select a project
                                        </h3>
                                        <p className="opacity-70">
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
                    <div className="modal modal-open">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">
                                Message Project Owner
                            </h3>
                            <form onSubmit={handleSendMessage}>
                                <textarea
                                    className="textarea textarea-bordered w-full h-32 mt-4"
                                    placeholder="Type your message here..."
                                    value={messageContent}
                                    onChange={(e) =>
                                        setMessageContent(e.target.value)
                                    }
                                />
                                <div className="modal-action">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowMessageModal(false)
                                        }
                                        className="btn btn-ghost"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? "Sending..."
                                            : "Send Message"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Points Payment Modal */}
                {showPointsPaymentModal && (
                    <div className="modal modal-open">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">
                                Pay with Points
                            </h3>
                            <p className="py-4">
                                You're about to pay $
                                {calculateRemainingBalance().toLocaleString()}
                                using your points. This will use{" "}
                                {Math.ceil(
                                    calculateRemainingBalance() / 0.5
                                )}{" "}
                                points.
                            </p>
                            <p className="text-sm opacity-70 mb-4">
                                Current points balance: {pointsState.balance}
                            </p>
                            {pointsState.error && (
                                <p className="text-error text-sm mb-4">
                                    {pointsState.error}
                                </p>
                            )}
                            <div className="modal-action">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPointsPaymentModal(false)
                                    }
                                    className="btn btn-ghost"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handlePayWithPoints}
                                    className="btn btn-primary"
                                    disabled={pointsState.isLoading}
                                >
                                    {pointsState.isLoading
                                        ? "Processing..."
                                        : "Confirm Payment"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </VolunteerLayout>
    );
}
