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

export default function Projects({ auth }) {
    const { bookings = [], flash } = usePage().props;
    const [activeBooking, setActiveBooking] = useState(bookings[0] || null);
    const [showSuccess, setShowSuccess] = useState(false);
    // Inside your component
    const [stripePromise, setStripePromise] = useState(null);

    // const stripePromise = loadStripe(process.env.VITE_STRIPE_KEY);
    // const stripePromise = loadStripe(process.env.VITE_STRIPE_KEY).catch(
    //     (error) => {
    //         console.error("Failed to load Stripe:", error);
    //         return null;
    //     }
    // );

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

    const { post } = useForm();

    return (
        <VolunteerLayout auth={auth}>
            {showSuccess && (
                <div className="fixed top-4 right-4 z-50">
                    <div className="bg-green-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center animate-fade-in-up">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
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
            <div className="mx-auto bg-white max-w-7xl p-6 lg:p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="text-center mb-5">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        My Volunteer Projects
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Manage your upcoming volunteer commitments and view
                        important details
                    </p>
                </div>

                {Array.isArray(bookings) && bookings.length === 0 ? (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center max-w-2xl mx-auto">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                            <CalendarDays className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No projects booked yet
                        </h3>
                        <p className="text-gray-600 mb-4">
                            You haven't booked any volunteer projects. Explore
                            available opportunities to get started.
                        </p>
                        <Link
                            href="/projects"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            Browse Projects
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Left sidebar - Projects list */}
                        <div className="w-full lg:w-1/4 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4 border-b border-gray-200 bg-gray-50">
                                <h3 className="font-semibold text-lg text-gray-800">
                                    My Projects ({bookings.length})
                                </h3>
                            </div>
                            <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
                                {bookings.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className={`p-4 border-b border-gray-100 cursor-pointer transition-colors group ${
                                            activeBooking?.id === booking.id
                                                ? "bg-blue-50 border-l-4 border-blue-500"
                                                : "hover:bg-gray-50"
                                        }`}
                                        onClick={() =>
                                            setActiveBooking(booking)
                                        }
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium text-gray-900 group-hover:text-blue-600">
                                                    {booking.project?.title}
                                                </h4>
                                                <div className="flex items-center mt-1 text-sm text-gray-500">
                                                    <CalendarDays className="w-4 h-4 mr-1.5" />
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
                                            <ChevronRight
                                                className={`w-5 h-5 text-gray-400 group-hover:text-blue-500 ${
                                                    activeBooking?.id ===
                                                    booking.id
                                                        ? "text-blue-500"
                                                        : ""
                                                }`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right side - Project details */}
                        <div className="w-full lg:w-3/4 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {activeBooking ? (
                                <div>
                                    {/* Header with image placeholder */}
                                    <div className="h-25 flex items-center bg-gradient-to-r from-blue-500 to-blue-600  p-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h2 className="text-2xl font-bold text-white">
                                                    {
                                                        activeBooking.project
                                                            ?.title
                                                    }
                                                </h2>
                                                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                                                    {
                                                        activeBooking.booking_status
                                                    }
                                                </span>
                                            </div>
                                            {/* <p className="text-blue-100">
                                                Organized by{" "}
                                                <span className="font-medium">
                                                    {
                                                        activeBooking.project
                                                            ?.organization?.name
                                                    }
                                                </span>
                                            </p> */}
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className=" gap-8">
                                            <div className="space-y-6">
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <div className="space-x-2 space-y-2 grid grid-cols-3">
                                                        <div className="flex items-start gap-3">
                                                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                                                                <MapPin className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium text-gray-700">
                                                                    Project
                                                                    Location
                                                                </h4>
                                                                <p className="text-gray-600">
                                                                    {activeBooking
                                                                        .project
                                                                        ?.location ||
                                                                        "Location not specified"}
                                                                </p>
                                                                {activeBooking
                                                                    .project
                                                                    ?.location && (
                                                                    <Link
                                                                        href="#"
                                                                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mt-1"
                                                                    >
                                                                        View on
                                                                        map{" "}
                                                                        <ArrowUpRight className="w-4 h-4 ml-1" />
                                                                    </Link>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                                                                <CalendarDays className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium text-gray-700">
                                                                    Dates
                                                                </h4>
                                                                <p className="text-gray-600">
                                                                    {new Date(
                                                                        activeBooking.start_date
                                                                    ).toLocaleDateString(
                                                                        "en-US",
                                                                        {
                                                                            year: "numeric",
                                                                            month: "long",
                                                                            day: "numeric",
                                                                        }
                                                                    )}{" "}
                                                                    to{" "}
                                                                    {new Date(
                                                                        activeBooking.end_date
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
                                                        <div className="flex items-start gap-3">
                                                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                                                                <Users className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium text-gray-700">
                                                                    Group Size
                                                                </h4>
                                                                <p className="text-gray-600">
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
                                                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                                                                <Clock className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium text-gray-700">
                                                                    Duration
                                                                </h4>
                                                                <p className="text-gray-600">
                                                                    {calculateDuration(
                                                                        activeBooking.start_date,
                                                                        activeBooking.end_date
                                                                    )}{" "}
                                                                    days
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                                                                <DollarSign className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium text-gray-700">
                                                                    Amount
                                                                </h4>
                                                                <p className="text-gray-600">
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

                                                        <div className="flex items-start gap-3">
                                                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                                                                <DollarSign className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium text-gray-700">
                                                                    Payment Due
                                                                    (10%
                                                                    Deposit)
                                                                </h4>
                                                                <p className="text-gray-600">
                                                                    $
                                                                    {(
                                                                        calculateTotalAmount(
                                                                            activeBooking.start_date,
                                                                            activeBooking.end_date,
                                                                            activeBooking
                                                                                .project
                                                                                ?.fees ||
                                                                                0,
                                                                            activeBooking.number_of_travellers
                                                                        ) * 0.1
                                                                    ).toLocaleString()}
                                                                    <span className="text-xs text-gray-500 ml-1">
                                                                        (of $
                                                                        {calculateTotalAmount(
                                                                            activeBooking.start_date,
                                                                            activeBooking.end_date,
                                                                            activeBooking
                                                                                .project
                                                                                ?.fees ||
                                                                                0,
                                                                            activeBooking.number_of_travellers
                                                                        ).toLocaleString()}
                                                                        )
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {activeBooking.payment_status !==
                                                            "paid" && (
                                                            <button
                                                                onClick={() =>
                                                                    handlePayment(
                                                                        activeBooking
                                                                    )
                                                                }
                                                                className="mt-4 w-full lg:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                                            >
                                                                Pay Now
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg mt-4">
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                                Project Information
                                            </h3>
                                            <p className="text-gray-600 mb-4">
                                                {activeBooking.project
                                                    ?.short_description ||
                                                    "No additional description available."}
                                            </p>
                                            <div className="flex justify-between">
                                                {activeBooking.can_send_reminder && (
                                                    <div className="flex items-center gap-2">
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
                                                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mt-1 group relative"
                                                        >
                                                            Send{" "}
                                                            {
                                                                activeBooking.reminder_stage
                                                            }{" "}
                                                            Reminder{" "}
                                                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                                                            {/* Tooltip remains the same */}
                                                        </button>
                                                        <span className="text-xs text-gray-500">
                                                            {activeBooking.reminder_stage ===
                                                                "first" &&
                                                                "7+ days pending"}
                                                            {activeBooking.reminder_stage ===
                                                                "second" &&
                                                                "14+ days pending"}
                                                            {activeBooking.reminder_stage ===
                                                                "final" &&
                                                                "30+ days pending"}
                                                        </span>
                                                    </div>
                                                )}
                                                <Link
                                                    href={`/volunteer-programs/${activeBooking.project?.slug}`}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                                >
                                                    View Full Project Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center p-12">
                                    <div className="text-center">
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 mb-4">
                                            <CalendarDays className="h-6 w-6" />
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
