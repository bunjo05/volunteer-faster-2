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
    ArrowLeft,
    Grid3X3,
    ArrowLeftCircle,
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
    const { bookings = [], flash } = usePage().props.props || usePage().props;
    const [activeBooking, setActiveBooking] = useState(bookings[0] || null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [stripePromise, setStripePromise] = useState(null);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);
    const [mobileView, setMobileView] = useState("list"); // 'list' or 'details'

    // Function to handle project selection (will show details on mobile)
    const handleProjectSelect = (booking) => {
        setActiveBooking(booking);
        setPointsPaymentSuccess(false);
        setShowPointsPaymentModal(false);
        setShowMobileSidebar(false);

        // On mobile, switch to details view
        if (window.innerWidth < 1024) {
            setMobileView("details");
        }
    };

    // Function to go back to list view on mobile
    const handleBackToList = () => {
        setMobileView("list");
        setActiveBooking(null);
    };

    const { post, setData, errors, data, processing } = useForm({
        message: "",
        sender_id: "",
        receiver_id: "",
        project_public_id: "",
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
                { booking_public_id: booking.public_id },
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
            activeBooking.project.user.public_id === auth.user.public_id
        ) {
            return alert("Cannot send message - invalid recipient");
        }

        const messageData = {
            message: messageContent,
            sender_id: auth.user.public_id,
            receiver_id: activeBooking.project.user.public_id,
            project_public_id: activeBooking.project.public_id,
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
                    booking: activeBooking.public_id,
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

    // Check if we're on mobile view
    const [isMobileView, setIsMobileView] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobileView(window.innerWidth < 1024);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => window.removeEventListener("resize", checkMobile);
    }, []);

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

            <div className="">
                {bookings.length === 0 ? (
                    <div className="card bg-base-200 max-w-2xl mx-auto shadow-lg">
                        <div className="card-body items-center text-center py-4">
                            <div className="rounded-full bg-primary/10 p-4 mb-4">
                                <CalendarDays className="h-8 w-8 text-primary" />
                            </div>
                            <h2 className="card-title text-lg mb-2">
                                No projects booked yet
                            </h2>
                            <p className="text-base-content/70 mb-6">
                                You haven't booked any volunteer projects.
                                Browse available opportunities to get started.
                            </p>
                            <div className="card-actions">
                                <Link
                                    href="/projects"
                                    className="btn btn-primary btn-lg"
                                >
                                    Browse Volunteer Projects
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-4 lg:max-h-[calc(100vh-120px)]">
                        {/* Mobile Back Button (only shown in details view on mobile) */}
                        {isMobileView && mobileView === "details" && (
                            <div className="lg:hidden fixed py-[2px] rounded-full bg-base-100 shadow-md z-40 mb-4">
                                {/* <div className="container mx-auto px-2"> */}
                                <button
                                    onClick={handleBackToList}
                                    className="btn btn-ghost btn-sm gap-2 text-primary hover:bg-primary/10"
                                >
                                    <ArrowLeftCircle className="w-5 h-5" />
                                    <span className="font-medium">Back</span>
                                </button>
                                {/* </div> */}
                            </div>
                        )}

                        {/* Projects List Sidebar */}
                        <div
                            className={`
                            w-full lg:w-1/3

                            ${
                                isMobileView && mobileView === "details"
                                    ? "hidden"
                                    : "block"
                            }
                        `}
                        >
                            <div className="card bg-base-100 shadow-md border border-base-300 h-fit lg:sticky lg:top-0">
                                <div className="card-title p-4 border-b border-base-300 flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">
                                        My Projects
                                    </h3>
                                    <span className="badge badge-primary badge-lg">
                                        {bookings.length}
                                    </span>
                                </div>
                                <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
                                    {bookings.map((booking) => {
                                        const StatusIcon =
                                            statusIcons[
                                                booking.booking_status
                                            ] || AlertCircle;
                                        return (
                                            <div
                                                key={booking.public_id}
                                                className={`p-4 border-b border-base-200 cursor-pointer transition-all duration-200 hover:bg-primary/5 group ${
                                                    activeBooking?.public_id ===
                                                    booking.public_id
                                                        ? "bg-primary/10 border-l-4 border-l-primary"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    handleProjectSelect(booking)
                                                }
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-md truncate group-hover:text-primary transition-colors">
                                                            {
                                                                booking.project
                                                                    ?.title
                                                            }
                                                        </h4>
                                                        <div className="flex items-center mt-2 text-[12px] text-base-content/70">
                                                            <CalendarDays className="w-4 h-4 mr-2 flex-shrink-0" />
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
                                                    <div className="flex items-center ml-4">
                                                        <div
                                                            className={`badge text-[12px] badge-sm gap-1 ${
                                                                statusColors[
                                                                    booking
                                                                        .booking_status
                                                                ]
                                                            }`}
                                                        >
                                                            <StatusIcon className="w-4 h-4" />
                                                            {
                                                                booking.booking_status
                                                            }
                                                        </div>
                                                        <ChevronRight className="w-5 h-5 ml-2 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Project Details Panel */}
                        <div
                            className={`
                            w-full lg:w-2/3
                            ${
                                isMobileView && mobileView === "list"
                                    ? "hidden"
                                    : "block"
                            }
                        `}
                        >
                            <div className="card bg-base-100 shadow-md border border-base-300 overflow-y-auto lg:max-h-[calc(100vh-120px)]">
                                {activeBooking ? (
                                    <>
                                        {/* Desktop Back Button */}
                                        {/* {!isMobileView && (
                                            <div className="p-4 border-b border-base-300 bg-base-200/50">
                                                <button
                                                    onClick={() =>
                                                        setActiveBooking(null)
                                                    }
                                                    className="btn btn-ghost btn-sm gap-2 text-base-content/70 hover:text-primary hover:bg-primary/10 transition-colors"
                                                >
                                                    <Grid3X3 className="w-4 h-4" />
                                                    <span className="font-medium">
                                                        View All Projects
                                                    </span>
                                                </button>
                                            </div>
                                        )} */}

                                        <div className="bg-primary p-4 lg:pt-[20px] pt-[40px]">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h2 className="text-2xl font-bold text-primary-content mb-2">
                                                        {
                                                            activeBooking
                                                                .project?.title
                                                        }
                                                    </h2>
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`badge badge-lg ${
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
                                                                <div className="badge badge-info badge-lg gap-2">
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

                                        <div className="p-4">
                                            <div className="grid grid-cols-1 gap-4">
                                                {/* Project Summary Card */}
                                                <div className="card bg-base-200 shadow-sm border border-base-300">
                                                    <div className="card-body p-4">
                                                        <h3 className="card-title text-xl font-semibold mb-4">
                                                            Project Summary
                                                        </h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="flex items-start gap-4">
                                                                <div className="bg-primary/15 p-3 rounded-xl">
                                                                    <MapPin className="h-6 w-6 text-primary" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-semibold mb-1">
                                                                        Location
                                                                    </h4>
                                                                    <p className="text-base-content/80">
                                                                        {activeBooking
                                                                            .project
                                                                            ?.country ||
                                                                            "Not specified"}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-start gap-4">
                                                                <div className="bg-primary/15 p-3 rounded-xl">
                                                                    <CalendarDays className="h-6 w-6 text-primary" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-semibold mb-1">
                                                                        Dates
                                                                    </h4>
                                                                    <p className="text-base-content/80">
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
                                                            <div className="flex items-start gap-4">
                                                                <div className="bg-primary/15 p-3 rounded-xl">
                                                                    <Users className="h-6 w-6 text-primary" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-semibold mb-1">
                                                                        Group
                                                                        Size
                                                                    </h4>
                                                                    <p className="text-base-content/80">
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
                                                            <div className="flex items-start gap-4">
                                                                <div className="bg-primary/15 p-3 rounded-xl">
                                                                    <Clock className="h-6 w-6 text-primary" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-semibold mb-1">
                                                                        Duration
                                                                    </h4>
                                                                    <p className="text-base-content/80">
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

                                                {/* Payment Information Card */}
                                                {activeBooking.project
                                                    .type_of_project ===
                                                    "Paid" && (
                                                    <div className="card bg-base-200 shadow-sm border border-base-300">
                                                        <div className="card-body p-4">
                                                            <h3 className="card-title text-xl font-semibold mb-6">
                                                                Payment
                                                                Information
                                                            </h3>
                                                            <div className="space-y-6">
                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                    <div className="card bg-base-100 shadow-sm border border-base-300">
                                                                        <div className="card-body p-4 text-center">
                                                                            <h4 className="text-sm font-medium text-base-content/70 mb-2">
                                                                                Total
                                                                                Amount
                                                                            </h4>
                                                                            <p className="text-2xl font-bold text-primary">
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
                                                                        className={`card shadow-sm border border-base-300 ${
                                                                            !hasPaidDeposit()
                                                                                ? "bg-warning/20 border-warning/30"
                                                                                : "bg-base-100"
                                                                        }`}
                                                                    >
                                                                        <div className="card-body p-4 text-center">
                                                                            <h4 className="text-sm font-medium text-base-content/70 mb-2">
                                                                                Deposit
                                                                                Fee{" "}
                                                                                {hasPaidDeposit() &&
                                                                                    "(Paid)"}
                                                                            </h4>
                                                                            <p
                                                                                className={`text-2xl font-bold ${
                                                                                    !hasPaidDeposit()
                                                                                        ? "text-warning"
                                                                                        : "text-success"
                                                                                }`}
                                                                            >
                                                                                $
                                                                                {calculateDepositAmount().toLocaleString()}
                                                                            </p>
                                                                            {!hasPaidDeposit() && (
                                                                                <p className="text-xs text-warning mt-2">
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
                                                                        <div className="card bg-base-100 shadow-sm border border-base-300">
                                                                            <div className="card-body p-4 text-center">
                                                                                <h4 className="text-sm font-medium text-base-content/70 mb-2">
                                                                                    {hasPaidDeposit()
                                                                                        ? "Remaining Balance"
                                                                                        : "Amount Paid"}
                                                                                </h4>
                                                                                <p
                                                                                    className={`text-2xl font-bold ${
                                                                                        hasPaidDeposit() &&
                                                                                        calculateRemainingBalance() >
                                                                                            0
                                                                                            ? "text-warning"
                                                                                            : "text-success"
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
                                                                                        <p className="text-xs text-warning mt-2">
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
                                                                                            payment.public_id
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
                                                <div className="card bg-base-200 shadow-sm border border-base-300">
                                                    <div className="card-body p-4">
                                                        <h3 className="card-title text-xl font-semibold mb-4">
                                                            Project Details
                                                        </h3>
                                                        <p className="text-base-content/80 mb-6 leading-relaxed">
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
                                                                                        activeBooking.public_id,
                                                                                }
                                                                            )
                                                                        )
                                                                    }
                                                                    className="btn btn-outline btn-primary"
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

                                                            {activeBooking.booking_status ===
                                                                "Completed" && (
                                                                <Review
                                                                    activeBooking={
                                                                        activeBooking
                                                                    }
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center p-12 min-h-[400px]">
                                        <div className="text-center">
                                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-base-200 mb-4">
                                                <CalendarDays className="h-8 w-8 opacity-70" />
                                            </div>
                                            <h3 className="text-xl font-medium mb-2">
                                                Select a project
                                            </h3>
                                            <p className="text-base-content/70">
                                                Choose a project from the list
                                                to view details
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Message Modal */}
                {showMessageModal && activeBooking && (
                    <div className="modal modal-open">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg mb-4">
                                Message Project Owner
                            </h3>
                            <form onSubmit={handleSendMessage}>
                                <textarea
                                    className="textarea textarea-bordered w-full h-32 mb-4"
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
                            <h3 className="font-bold text-lg mb-4">
                                Pay with Points
                            </h3>
                            <p className="mb-4">
                                You're about to pay $
                                {calculateRemainingBalance().toLocaleString()}
                                using your points. This will use{" "}
                                {Math.ceil(
                                    calculateRemainingBalance() / 0.5
                                )}{" "}
                                points.
                            </p>
                            <p className="text-sm text-base-content/70 mb-4">
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
