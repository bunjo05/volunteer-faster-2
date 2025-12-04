import VolunteerLayout from "@/Layouts/VolunteerLayout";
import { usePage, Link, useForm, router } from "@inertiajs/react";
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
    Check,
    X,
    Clock as ClockIcon,
    XCircle,
    ArrowLeft,
    Grid3X3,
    ArrowLeftCircle,
    Shield,
    UserCheck,
    Mail,
    Phone,
    Menu,
    X as XIcon,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@headlessui/react";
import Review from "@/Components/Review";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";

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
    const [mobileView, setMobileView] = useState("list");
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const [contactRequests, setContactRequests] = useState([]);
    const [sharedContacts, setSharedContacts] = useState([]);

    const [paypalLoaded, setPaypalLoaded] = useState(false);

    // Professional Success Modal State
    const [showProfessionalSuccess, setShowProfessionalSuccess] =
        useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Payment Loading State
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // Get PayPal client ID from environment or use a fallback
    const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || "test";

    // Check screen size on mount and resize
    useEffect(() => {
        const checkScreenSize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
            setIsTablet(width >= 768 && width < 1024);

            // Auto-switch to list view on mobile when screen resizes
            if (width >= 1024 && mobileView === "details") {
                setMobileView("list");
            }
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);

        return () => window.removeEventListener("resize", checkScreenSize);
    }, [mobileView]);

    // Professional Success Modal Handler
    const showProfessionalSuccessModal = (message) => {
        setSuccessMessage(message);
        setShowProfessionalSuccess(true);

        setTimeout(() => {
            setShowProfessionalSuccess(false);
        }, 3000);
    };

    const createOrder = async (data, actions) => {
        try {
            const response = await axios.post(route("paypal.create-order"), {
                booking_public_id: activeBooking.public_id,
            });

            return response.data.orderID;
        } catch (error) {
            console.error("PayPal order creation error:", error);
            throw error;
        }
    };

    const onApprove = async (data, actions) => {
        try {
            console.log("=== PAYPAL APPROVE START ===");
            console.log("Order ID:", data.orderID);
            console.log("Active Booking:", activeBooking);

            setPaymentLoading(true);

            const response = await axios.post(route("paypal.capture-order"), {
                orderID: data.orderID,
            });

            console.log("Capture response:", response.data);

            if (response.data.success) {
                setPaymentSuccess(true);

                setTimeout(() => {
                    router.reload({
                        only: ["bookings", "payments", "points", "totalPoints"],
                        onSuccess: () => {
                            setPaymentLoading(false);
                            const updatedBooking = bookings.find(
                                (booking) =>
                                    booking.public_id ===
                                    activeBooking.public_id
                            );

                            if (
                                updatedBooking &&
                                hasPaidDeposit(updatedBooking)
                            ) {
                                showProfessionalSuccessModal(
                                    "Payment completed successfully!"
                                );
                            } else {
                                showProfessionalSuccessModal(
                                    "Payment processing completed! Please check your payment status."
                                );
                            }
                        },
                        onError: () => {
                            setPaymentLoading(false);
                            alert(
                                "Payment completed but there was an issue refreshing the page. Please refresh manually."
                            );
                        },
                    });
                }, 1000);
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

            setPaymentLoading(false);

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

            if (actions && actions.restart) {
                console.log("Restarting PayPal payment flow...");
                actions.restart();
            } else {
                console.log("Actions restart not available");
            }
        }
    };

    // Debug function to check why PayPal button might not show
    const debugPaymentConditions = () => {
        if (!activeBooking) {
            console.log("No active booking");
            return false;
        }

        console.log("Active Booking:", activeBooking);
        console.log("Booking Status:", activeBooking.booking_status);
        console.log("Project Type:", activeBooking.project?.type_of_project);
        console.log("Has Paid Deposit:", hasPaidDeposit());
        console.log("Remaining Balance:", calculateRemainingBalance());
        console.log("Should Hide Pay Button:", shouldHidePayButton());

        return (
            !shouldHidePayButton() &&
            calculateRemainingBalance() > 0 &&
            !hasPaidDeposit() &&
            activeBooking.project?.type_of_project === "Paid"
        );
    };

    // Add to your existing state declarations
    const [processingContactRequest, setProcessingContactRequest] =
        useState(false);

    // Check if active booking has any share contacts (pending or approved)
    const hasShareContacts =
        activeBooking &&
        ((activeBooking.contact_requests &&
            activeBooking.contact_requests.length > 0) ||
            (activeBooking.shared_contacts &&
                activeBooking.shared_contacts.length > 0));

    // Add this function to handle contact request responses
    const handleContactRequestResponse = async (requestId, status) => {
        setProcessingContactRequest(true);

        try {
            const response = await axios.post(
                route("volunteer.contact.respond", { requestId }),
                { status },
                {
                    headers: {
                        "X-CSRF-TOKEN": document.querySelector(
                            'meta[name="csrf-token"]'
                        ).content,
                    },
                }
            );

            if (response.data.success) {
                // Update the local state for the active booking
                if (activeBooking) {
                    const updatedBooking = { ...activeBooking };

                    // Update contact requests
                    if (updatedBooking.contact_requests) {
                        updatedBooking.contact_requests =
                            updatedBooking.contact_requests.map((request) =>
                                request.public_id === requestId
                                    ? {
                                          ...request,
                                          status: status,
                                          approved_at:
                                              status === "approved"
                                                  ? new Date().toISOString()
                                                  : null,
                                      }
                                    : request
                            );
                    }

                    // If approved, move from contact_requests to shared_contacts
                    if (status === "approved") {
                        const approvedRequest =
                            updatedBooking.contact_requests?.find(
                                (req) => req.public_id === requestId
                            );
                        if (approvedRequest) {
                            updatedBooking.shared_contacts = [
                                ...(updatedBooking.shared_contacts || []),
                                approvedRequest,
                            ];
                            // Remove from contact_requests
                            updatedBooking.contact_requests =
                                updatedBooking.contact_requests.filter(
                                    (req) => req.public_id !== requestId
                                );
                        }
                    } else if (status === "rejected") {
                        // Remove from contact_requests if rejected
                        updatedBooking.contact_requests =
                            updatedBooking.contact_requests.filter(
                                (req) => req.public_id !== requestId
                            );
                    }

                    setActiveBooking(updatedBooking);
                }

                const actionMessage =
                    status === "approved"
                        ? "Contact request approved successfully!"
                        : "Contact request rejected successfully!";
                showProfessionalSuccessModal(actionMessage);
            }
        } catch (error) {
            console.error("Error responding to contact request:", error);
            alert("Failed to process request. Please try again.");
        } finally {
            setProcessingContactRequest(false);
        }
    };

    // Add useEffect to fetch contact requests when activeBooking changes
    useEffect(() => {
        if (activeBooking) {
            fetchContactData();
            console.log("Payment conditions check:", debugPaymentConditions());
        }
    }, [activeBooking]);

    const fetchContactData = async () => {
        try {
            const response = await axios.get(
                route("volunteer.contact.requests")
            );
            setContactRequests(response.data.requests);
            setSharedContacts(response.data.shared_contacts || []);
        } catch (error) {
            console.error("Error fetching contact data:", error);
        }
    };

    // Function to handle project selection
    const handleProjectSelect = (booking) => {
        setActiveBooking(booking);
        setPointsPaymentSuccess(false);
        setShowPointsPaymentModal(false);

        if (isMobile) {
            setMobileView("details");
            setShowMobileMenu(false);
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
        if (activeBooking.project?.type_of_project !== "Paid") return true;
        return false;
    };

    const hasPaidDeposit = (booking = activeBooking) => {
        return booking?.payments?.some((p) => p.status === "deposit_paid");
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
                showProfessionalSuccessModal("Message sent successfully!");
            },
            onError: (errors) => {
                console.error("Error sending message:", errors);
                alert("Failed to send message. Please try again.");
            },
        });
    };

    useEffect(() => {
        if (flash?.success) {
            showProfessionalSuccessModal(flash.success);
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

            // Refresh page to get updated data
            router.reload({
                only: ["bookings", "payments", "points", "totalPoints"],
                onSuccess: () => {
                    showProfessionalSuccessModal(
                        "Points payment completed successfully!"
                    );
                },
            });

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

    // Check if PayPal button should render
    const shouldShowPayPalButton =
        !shouldHidePayButton() &&
        calculateRemainingBalance() > 0 &&
        !hasPaidDeposit() &&
        activeBooking?.project?.type_of_project === "Paid";

    return (
        <VolunteerLayout auth={auth}>
            {/* Payment Loading Modal */}
            {paymentLoading && (
                <div className="modal modal-open modal-middle">
                    <div className="modal-box bg-base-100 shadow-2xl border-0 max-w-md mx-4">
                        <div className="flex flex-col items-center text-center p-6 md:p-8">
                            <div className="mb-4 md:mb-6">
                                <div className="loading loading-spinner loading-lg text-primary"></div>
                            </div>
                            <h3 className="text-lg md:text-xl font-bold mb-3 text-base-content">
                                Processing Payment
                            </h3>
                            <p className="text-base-content/70 mb-4 text-sm md:text-base leading-relaxed">
                                Please wait while we process your payment...
                            </p>
                            <div className="w-full bg-base-300 rounded-full h-2 mb-2">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all duration-1000 ease-in-out animate-pulse"
                                    style={{ width: "60%" }}
                                ></div>
                            </div>
                            <p className="text-base-content/50 text-xs md:text-sm">
                                Do not close this window
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Professional Success Modal */}
            {showProfessionalSuccess && (
                <div className="modal modal-open modal-middle">
                    <div className="modal-box bg-gradient-to-br from-success to-success/90 text-success-content shadow-2xl border-0 mx-4 max-w-sm md:max-w-md">
                        <div className="flex flex-col items-center text-center p-4 md:p-6">
                            <div className="mb-4 transform transition-all duration-500 scale-110">
                                <div className="rounded-full bg-white/20 p-3 md:p-4">
                                    <CheckCircle2 className="h-12 w-12 md:h-16 md:w-16 text-white animate-pulse" />
                                </div>
                            </div>
                            <h3 className="text-lg md:text-2xl font-bold mb-3 text-white">
                                Success!
                            </h3>
                            <p className="text-base md:text-lg text-white/90 mb-6 leading-relaxed">
                                {successMessage}
                            </p>
                            <div className="w-full bg-white/30 rounded-full h-2 mb-4">
                                <div
                                    className="bg-white h-2 rounded-full transition-all duration-3000 ease-linear"
                                    style={{ width: "100%" }}
                                ></div>
                            </div>
                            <p className="text-white/70 text-xs md:text-sm">
                                Modal will close automatically...
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Original Success Notification */}
            {showSuccess && (
                <div className="toast toast-top toast-end z-50">
                    <div className="alert alert-success">
                        <CheckCircle2 className="h-5 w-5" />
                        <span>{flash.success}</span>
                    </div>
                </div>
            )}

            {/* Mobile Header Controls */}
            <div className="lg:hidden mb-4">
                <div className="flex items-center justify-between p-4 bg-base-100 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="w-5 h-5 text-primary" />
                        <h1 className="text-lg font-semibold">My Projects</h1>
                        <span className="badge badge-primary badge-sm">
                            {bookings.length}
                        </span>
                    </div>

                    {/* Mobile View Toggle Buttons */}
                    <div className="flex items-center gap-2">
                        {mobileView === "details" && (
                            <button
                                onClick={handleBackToList}
                                className="btn btn-ghost btn-sm gap-2 text-primary"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="hidden xs:inline">Back</span>
                            </button>
                        )}

                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="btn btn-ghost btn-sm"
                        >
                            {showMobileMenu ? (
                                <XIcon className="w-5 h-5" />
                            ) : (
                                ""
                                // <Menu className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="">
                {bookings.length === 0 ? (
                    <div className="card bg-base-200 max-w-2xl mx-auto shadow-lg">
                        <div className="card-body items-center text-center py-6 md:py-8 px-4">
                            <div className="rounded-full bg-primary/10 p-4 mb-4">
                                <CalendarDays className="h-8 w-8 text-primary" />
                            </div>
                            <h2 className="card-title text-lg md:text-xl mb-2">
                                No projects booked yet
                            </h2>
                            <p className="text-base-content/70 mb-6 text-sm md:text-base">
                                You haven't booked any volunteer projects.
                                Browse available opportunities to get started.
                            </p>
                            <div className="card-actions">
                                <Link
                                    href="/projects"
                                    className="btn btn-primary btn-md md:btn-lg w-full sm:w-auto"
                                >
                                    Browse Volunteer Projects
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                        {/* Projects List Sidebar */}
                        <div
                            className={`
                                w-full lg:w-1/3 xl:w-1/4
                                ${
                                    (isMobile || isTablet) &&
                                    mobileView === "details"
                                        ? "hidden"
                                        : "block"
                                }
                                ${showMobileMenu ? "block" : ""}
                            `}
                        >
                            <div className="card bg-base-100 shadow-md border border-base-300 lg:sticky lg:top-4 max-h-[calc(100vh-200px)] lg:max-h-[calc(100vh-120px)] overflow-hidden">
                                <div className="card-title p-4 border-b border-base-300 flex items-center justify-between sticky top-0 bg-base-100 z-10">
                                    <h3 className="text-lg font-semibold">
                                        My Projects
                                    </h3>
                                    <span className="badge badge-primary badge-lg">
                                        {bookings.length}
                                    </span>
                                </div>
                                <div className="overflow-y-auto flex-1">
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
                                                    <div className="flex-1 min-w-0 pr-2">
                                                        <h4 className="font-semibold text-sm sm:text-md truncate group-hover:text-primary transition-colors">
                                                            {
                                                                booking.project
                                                                    ?.title
                                                            }
                                                        </h4>
                                                        <div className="flex items-center mt-2 text-xs sm:text-[12px] text-base-content/70">
                                                            <CalendarDays className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                                                            <span className="truncate">
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
                                                    <div className="flex items-center ml-2">
                                                        <div
                                                            className={`badge text-xs sm:text-[12px] badge-sm gap-1 ${
                                                                statusColors[
                                                                    booking
                                                                        .booking_status
                                                                ]
                                                            }`}
                                                        >
                                                            <StatusIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                                                            <span className="hidden xs:inline">
                                                                {
                                                                    booking.booking_status
                                                                }
                                                            </span>
                                                            <span className="xs:hidden">
                                                                {booking.booking_status.slice(
                                                                    0,
                                                                    3
                                                                )}
                                                            </span>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
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
                                w-full lg:w-2/3 xl:w-3/4
                                ${
                                    (isMobile || isTablet) &&
                                    mobileView === "list"
                                        ? "hidden"
                                        : "block"
                                }
                            `}
                        >
                            <div className="card bg-base-100 shadow-md border border-base-300 overflow-hidden">
                                {activeBooking ? (
                                    <>
                                        {/* Header */}
                                        <div className="bg-primary p-4 lg:p-6">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <h2 className="text-xl sm:text-2xl font-bold text-primary-content mb-2 truncate">
                                                        {
                                                            activeBooking
                                                                .project?.title
                                                        }
                                                    </h2>
                                                    <div className="flex flex-wrap gap-2">
                                                        <div
                                                            className={`badge ${
                                                                isMobile
                                                                    ? "badge-md"
                                                                    : "badge-lg"
                                                            } ${
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
                                                                <div className="badge badge-info gap-2 text-xs sm:text-sm">
                                                                    <Star className="w-3 h-3 sm:w-4 sm:h-4" />
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

                                        <div className="p-4 sm:p-6">
                                            <div className="space-y-4 sm:space-y-6">
                                                {/* Enhanced Contact Access Section */}
                                                {hasShareContacts && (
                                                    <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg border border-blue-200">
                                                        <div className="card-body p-4 sm:p-6">
                                                            {/* Header Section */}
                                                            <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                                                                <div className="bg-blue-100 p-2 sm:p-3 rounded-xl sm:rounded-2xl flex-shrink-0">
                                                                    <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h3 className="card-title text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                                                                        Contact
                                                                        Access
                                                                    </h3>
                                                                    <p className="text-gray-600 mt-1 text-sm sm:text-base">
                                                                        Manage
                                                                        contact
                                                                        access
                                                                        requests
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Contact Requests Section */}
                                                            {activeBooking.contact_requests &&
                                                                activeBooking
                                                                    .contact_requests
                                                                    .length >
                                                                    0 && (
                                                                    <div className="mb-6 sm:mb-8">
                                                                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                                                            <div className="bg-amber-100 p-1.5 sm:p-2 rounded-lg">
                                                                                <ClockIcon className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                                                                            </div>
                                                                            <h4 className="text-base sm:text-lg font-semibold text-gray-800">
                                                                                Pending
                                                                                Requests
                                                                            </h4>
                                                                            <span className="badge badge-warning">
                                                                                {
                                                                                    activeBooking
                                                                                        .contact_requests
                                                                                        .length
                                                                                }
                                                                            </span>
                                                                        </div>

                                                                        <div className="space-y-3 sm:space-y-4">
                                                                            {activeBooking.contact_requests.map(
                                                                                (
                                                                                    request
                                                                                ) => (
                                                                                    <div
                                                                                        key={
                                                                                            request.public_id
                                                                                        }
                                                                                        className="bg-white rounded-lg sm:rounded-xl border border-amber-200 p-3 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
                                                                                    >
                                                                                        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                                                                                            {/* Organization Info */}
                                                                                            <div className="flex items-start gap-3 sm:gap-4 flex-1">
                                                                                                <div className="flex-shrink-0">
                                                                                                    {request
                                                                                                        .organization
                                                                                                        ?.organization_profile
                                                                                                        ?.logo ? (
                                                                                                        <img
                                                                                                            src={`/storage/${request.organization.organization_profile.logo}`}
                                                                                                            alt={
                                                                                                                request
                                                                                                                    .organization
                                                                                                                    ?.name
                                                                                                            }
                                                                                                            className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl object-cover border-2 border-amber-200"
                                                                                                        />
                                                                                                    ) : (
                                                                                                        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-amber-100 border-2 border-amber-200 flex items-center justify-center">
                                                                                                            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
                                                                                                        </div>
                                                                                                    )}
                                                                                                </div>
                                                                                                <div className="flex-1 min-w-0">
                                                                                                    <h5 className="font-bold text-gray-900 text-sm sm:text-lg truncate">
                                                                                                        {request
                                                                                                            .organization
                                                                                                            ?.name ||
                                                                                                            "Organization"}
                                                                                                    </h5>
                                                                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">
                                                                                                        <div className="flex items-center gap-1">
                                                                                                            <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4" />
                                                                                                            {new Date(
                                                                                                                request.requested_at
                                                                                                            ).toLocaleDateString()}
                                                                                                        </div>
                                                                                                        <div className="badge badge-warning badge-outline text-xs">
                                                                                                            Awaiting
                                                                                                            Approval
                                                                                                        </div>
                                                                                                    </div>

                                                                                                    {/* Request Message */}
                                                                                                    {request.message && (
                                                                                                        <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-amber-50 rounded-lg border border-amber-100">
                                                                                                            <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">
                                                                                                                <span className="font-semibold text-amber-700">
                                                                                                                    Message:
                                                                                                                </span>{" "}
                                                                                                                "
                                                                                                                {
                                                                                                                    request.message
                                                                                                                }

                                                                                                                "
                                                                                                            </p>
                                                                                                        </div>
                                                                                                    )}
                                                                                                </div>
                                                                                            </div>

                                                                                            {/* Action Buttons */}
                                                                                            <div className="flex sm:flex-col gap-2 sm:ml-auto">
                                                                                                <button
                                                                                                    onClick={() =>
                                                                                                        handleContactRequestResponse(
                                                                                                            request.public_id,
                                                                                                            "approved"
                                                                                                        )
                                                                                                    }
                                                                                                    className="btn btn-success btn-xs sm:btn-sm md:btn-md gap-1 sm:gap-2 flex-1 sm:flex-none"
                                                                                                    disabled={
                                                                                                        processingContactRequest
                                                                                                    }
                                                                                                >
                                                                                                    {processingContactRequest ? (
                                                                                                        <span className="loading loading-spinner loading-xs sm:loading-sm"></span>
                                                                                                    ) : (
                                                                                                        <>
                                                                                                            <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                                                            <span className="hidden xs:inline">
                                                                                                                Approve
                                                                                                            </span>
                                                                                                            <span className="xs:hidden">
                                                                                                                OK
                                                                                                            </span>
                                                                                                        </>
                                                                                                    )}
                                                                                                </button>
                                                                                                <button
                                                                                                    onClick={() =>
                                                                                                        handleContactRequestResponse(
                                                                                                            request.public_id,
                                                                                                            "rejected"
                                                                                                        )
                                                                                                    }
                                                                                                    className="btn btn-outline btn-error btn-xs sm:btn-sm md:btn-md gap-1 sm:gap-2 flex-1 sm:flex-none"
                                                                                                    disabled={
                                                                                                        processingContactRequest
                                                                                                    }
                                                                                                >
                                                                                                    {processingContactRequest ? (
                                                                                                        <span className="loading loading-spinner loading-xs sm:loading-sm"></span>
                                                                                                    ) : (
                                                                                                        <>
                                                                                                            <X className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                                                            <span className="hidden xs:inline">
                                                                                                                Decline
                                                                                                            </span>
                                                                                                            <span className="xs:hidden">
                                                                                                                No
                                                                                                            </span>
                                                                                                        </>
                                                                                                    )}
                                                                                                </button>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                            {/* Privacy Notice */}
                                                            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-200">
                                                                <div className="flex items-start gap-2 sm:gap-3">
                                                                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                                    <div>
                                                                        <h5 className="font-semibold text-blue-800 text-xs sm:text-sm mb-1">
                                                                            Privacy
                                                                            &
                                                                            Data
                                                                            Protection
                                                                        </h5>
                                                                        <p className="text-blue-700 text-xs sm:text-sm leading-relaxed">
                                                                            Your
                                                                            contact
                                                                            details
                                                                            are
                                                                            protected
                                                                            under
                                                                            our
                                                                            privacy
                                                                            policy.
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Project Summary Card */}
                                                <div className="card bg-base-200 shadow-sm border border-base-300">
                                                    <div className="card-body p-4 sm:p-6">
                                                        <h3 className="card-title text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                                                            Project Summary
                                                        </h3>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                            {[
                                                                {
                                                                    icon: MapPin,
                                                                    label: "Location",
                                                                    value:
                                                                        activeBooking
                                                                            .project
                                                                            ?.country ||
                                                                        "Not specified",
                                                                },
                                                                {
                                                                    icon: CalendarDays,
                                                                    label: "Dates",
                                                                    value: `${new Date(
                                                                        activeBooking.start_date
                                                                    ).toLocaleDateString()} - ${new Date(
                                                                        activeBooking.end_date
                                                                    ).toLocaleDateString()}`,
                                                                },
                                                                {
                                                                    icon: Users,
                                                                    label: "Group Size",
                                                                    value: `${
                                                                        activeBooking.number_of_travellers
                                                                    } volunteer${
                                                                        activeBooking.number_of_travellers !==
                                                                        1
                                                                            ? "s"
                                                                            : ""
                                                                    }`,
                                                                },
                                                                {
                                                                    icon: Clock,
                                                                    label: "Duration",
                                                                    value: `${calculateDuration(
                                                                        activeBooking.start_date,
                                                                        activeBooking.end_date
                                                                    )} days`,
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
                                                                        className="flex items-start gap-3"
                                                                    >
                                                                        <div className="bg-primary/15 p-2 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0">
                                                                            <item.icon className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <h4 className="font-semibold text-sm sm:text-base mb-1">
                                                                                {
                                                                                    item.label
                                                                                }
                                                                            </h4>
                                                                            <p className="text-base-content/80 text-sm sm:text-base truncate">
                                                                                {
                                                                                    item.value
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Payment Information Card */}
                                                {activeBooking.project
                                                    .type_of_project ===
                                                    "Paid" && (
                                                    <div className="card bg-base-200 shadow-sm border border-base-300">
                                                        <div className="card-body p-4 sm:p-6">
                                                            <h3 className="card-title text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
                                                                Payment
                                                                Information
                                                            </h3>
                                                            <div className="space-y-4 sm:space-y-6">
                                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                                                                    <div className="card bg-base-100 shadow-sm border border-base-300">
                                                                        <div className="card-body p-3 sm:p-4 text-center">
                                                                            <h4 className="text-xs sm:text-sm font-medium text-base-content/70 mb-1 sm:mb-2">
                                                                                Total
                                                                                Amount
                                                                            </h4>
                                                                            <p className="text-lg sm:text-2xl font-bold text-primary">
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
                                                                        <div className="card-body p-3 sm:p-4 text-center">
                                                                            <h4 className="text-xs sm:text-sm font-medium text-base-content/70 mb-1 sm:mb-2">
                                                                                Deposit
                                                                                Fee{" "}
                                                                                {hasPaidDeposit() &&
                                                                                    "(Paid)"}
                                                                            </h4>
                                                                            <p
                                                                                className={`text-lg sm:text-2xl font-bold ${
                                                                                    !hasPaidDeposit()
                                                                                        ? "text-warning"
                                                                                        : "text-success"
                                                                                }`}
                                                                            >
                                                                                $
                                                                                {calculateDepositAmount().toLocaleString()}
                                                                            </p>
                                                                            {!hasPaidDeposit() && (
                                                                                <p className="text-xs text-warning mt-1 sm:mt-2">
                                                                                    20%
                                                                                    deposit
                                                                                    required
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {activeBooking
                                                                        ?.payments
                                                                        ?.length >
                                                                        0 && (
                                                                        <div className="card bg-base-100 shadow-sm border border-base-300">
                                                                            <div className="card-body p-3 sm:p-4 text-center">
                                                                                <h4 className="text-xs sm:text-sm font-medium text-base-content/70 mb-1 sm:mb-2">
                                                                                    {hasPaidDeposit()
                                                                                        ? "Remaining Balance"
                                                                                        : "Amount Paid"}
                                                                                </h4>
                                                                                <p
                                                                                    className={`text-lg sm:text-2xl font-bold ${
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
                                                                                        <p className="text-xs text-warning mt-1 sm:mt-2">
                                                                                            Balance
                                                                                            due
                                                                                            before
                                                                                            start
                                                                                        </p>
                                                                                    )}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Payment Options */}
                                                                {shouldShowPayPalButton && (
                                                                    <div className="border-t pt-4 sm:pt-6">
                                                                        <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-center">
                                                                            Complete
                                                                            Your
                                                                            Payment
                                                                        </h4>
                                                                        <div className="space-y-3 sm:space-y-4">
                                                                            {/* PayPal Button */}
                                                                            <div className="paypal-button-container">
                                                                                <PayPalScriptProvider
                                                                                    options={{
                                                                                        "client-id":
                                                                                            paypalClientId,
                                                                                        currency:
                                                                                            "USD",
                                                                                        components:
                                                                                            "buttons",
                                                                                        intent: "capture",
                                                                                        "enable-funding":
                                                                                            "card,venmo",
                                                                                        "disable-funding":
                                                                                            "",
                                                                                    }}
                                                                                >
                                                                                    <PayPalButtons
                                                                                        style={{
                                                                                            layout: "vertical",
                                                                                            height: isMobile
                                                                                                ? 40
                                                                                                : 48,
                                                                                            color: "blue",
                                                                                            shape: "rect",
                                                                                            label: "checkout",
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
                                                                                    />
                                                                                </PayPalScriptProvider>
                                                                            </div>

                                                                            {/* Points Payment Option */}
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
                                                                                                className="btn btn-primary w-full h-10 sm:h-12 text-sm sm:text-base"
                                                                                            >
                                                                                                💎
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
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Project Description Card */}
                                                <div className="card bg-base-200 shadow-sm border border-base-300">
                                                    <div className="card-body p-4 sm:p-6">
                                                        <h3 className="card-title text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                                                            Project Details
                                                        </h3>
                                                        <p className="text-base-content/80 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                                                            {activeBooking
                                                                .project
                                                                ?.short_description ||
                                                                "No description available."}
                                                        </p>
                                                        <div className="flex flex-wrap gap-2 sm:gap-3">
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
                                                                    className="btn btn-outline btn-primary btn-sm sm:btn-md"
                                                                >
                                                                    Send{" "}
                                                                    {
                                                                        activeBooking.reminder_stage
                                                                    }{" "}
                                                                    Reminder
                                                                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                                                                </button>
                                                            )}
                                                            <Link
                                                                href={`/volunteer-programs/${activeBooking.project?.slug}`}
                                                                className="btn btn-primary btn-sm sm:btn-md"
                                                            >
                                                                View Full
                                                                Details
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
                                    <div className="flex items-center justify-center p-8 sm:p-12 min-h-[300px] sm:min-h-[400px]">
                                        <div className="text-center">
                                            <div className="mx-auto flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-base-200 mb-4">
                                                <CalendarDays className="h-6 w-6 sm:h-8 sm:w-8 opacity-70" />
                                            </div>
                                            <h3 className="text-lg sm:text-xl font-medium mb-2">
                                                Select a project
                                            </h3>
                                            <p className="text-base-content/70 text-sm sm:text-base">
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
                        <div className="modal-box mx-4 max-w-full sm:max-w-lg">
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
                                <div className="modal-action flex-col sm:flex-row gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowMessageModal(false)
                                        }
                                        className="btn btn-ghost w-full sm:w-auto"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-full sm:w-auto"
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
                        <div className="modal-box mx-4 max-w-full sm:max-w-md">
                            <h3 className="font-bold text-lg mb-4">
                                Pay with Points
                            </h3>
                            <p className="mb-4 text-sm sm:text-base">
                                You're about to pay $
                                {calculateRemainingBalance().toLocaleString()}{" "}
                                using your points.
                            </p>
                            <p className="text-sm text-base-content/70 mb-4">
                                Current points balance: {pointsState.balance}
                            </p>
                            {pointsState.error && (
                                <p className="text-error text-sm mb-4">
                                    {pointsState.error}
                                </p>
                            )}
                            <div className="modal-action flex-col sm:flex-row gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPointsPaymentModal(false)
                                    }
                                    className="btn btn-ghost w-full sm:w-auto"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handlePayWithPoints}
                                    className="btn btn-primary w-full sm:w-auto"
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
