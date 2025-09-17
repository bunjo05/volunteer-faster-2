import React, { useState } from "react";
import { Head, Link, usePage, useForm, router } from "@inertiajs/react";
import OrganizationLayout from "@/Layouts/OrganizationLayout";
import {
    CalendarDays,
    Users,
    MapPin,
    Clock,
    ChevronRight,
    Badge,
    Mail,
    User,
    DollarSign,
    Check,
    X,
    Ban,
    RotateCcw,
    ArrowBigRight,
} from "lucide-react";

import { Dialog } from "@headlessui/react";
import VerifiedBadge from "@/Components/VerifiedBadge";

export default function Bookings({ bookings: initialBookings, auth }) {
    const [bookings, setBookings] = useState(initialBookings);
    const [activeBooking, setActiveBooking] = useState(bookings[0] || null);
    const { flash } = usePage().props;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [statusChanges, setStatusChanges] = useState({});

    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedBookingId, setSelectedBookingId] = useState(null);

    const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);

    const openVolunteerModal = (volunteer) => {
        setSelectedVolunteer(volunteer);
        setIsVolunteerModalOpen(true);
    };

    const closeVolunteerModal = () => {
        setIsVolunteerModalOpen(false);
        setSelectedVolunteer(null);
    };
    const statusColors = {
        Pending: "bg-amber-100 text-amber-800",
        Approved: "bg-emerald-100 text-emerald-800",
        Cancelled: "bg-rose-100 text-rose-800",
        Completed: "bg-indigo-100 text-indigo-800",
        Rejected: "bg-red-100 text-red-800",
    };

    const openConfirmationDialog = (bookingId, newStatus) => {
        setSelectedBookingId(bookingId);
        setSelectedStatus(newStatus);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setSelectedStatus(null);
        setSelectedBookingId(null);
    };

    const confirmStatusUpdate = () => {
        if (!selectedBookingId || !selectedStatus) return;

        const data = {
            booking_status: selectedStatus,
            // Include a flag to trigger email when status is Completed
            send_completion_email: selectedStatus === "Completed",
        };

        router.put(
            `/organization/bookings/${selectedBookingId}/update-status`,
            data,
            {
                preserveScroll: true,
                onSuccess: () => {
                    const updatedBookings = bookings.map((booking) =>
                        booking.public_id === selectedBookingId
                            ? { ...booking, booking_status: selectedStatus }
                            : booking
                    );
                    setBookings(updatedBookings);

                    if (activeBooking?.public_id === selectedBookingId) {
                        setActiveBooking((prev) => ({
                            ...prev,
                            booking_status: selectedStatus,
                        }));
                    }

                    closeDialog();
                },
                onError: (errors) => {
                    console.error("Error updating status:", errors);
                    closeDialog();
                },
            }
        );
    };

    const handleUpdateStatus = (bookingId, newStatus) => {
        openConfirmationDialog(bookingId, newStatus);
    };

    const calculateDuration = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    };

    const calculateTotalAmount = (startDate, endDate, fees, travellers) => {
        const duration = calculateDuration(startDate, endDate);
        return duration * fees * travellers;
    };

    const calculateTotalPaid = () => {
        if (!activeBooking?.payments || activeBooking.payments.length === 0)
            return 0;
        return activeBooking.payments.reduce((total, payment) => {
            return total + parseFloat(payment.amount || 0);
        }, 0);
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

    const hasDepositPaid = () => {
        if (!activeBooking?.payments) return false;
        return activeBooking.payments.some(
            (payment) => payment.status === "deposit_paid"
        );
    };

    const calculateDepositAmount = () => {
        const totalAmount = calculateTotalAmount(
            activeBooking.start_date,
            activeBooking.end_date,
            activeBooking.project?.fees || 0,
            activeBooking.number_of_travellers
        );
        return totalAmount * 0.2; // 20% deposit
    };

    const [contactRequestStatus, setContactRequestStatus] = useState({
        loading: false,
        requested: false,
        message: "",
    });

    // Add this function to handle contact requests
    const handleContactRequest = async (volunteerPublicId, projectPublicId) => {
        setContactRequestStatus({ ...contactRequestStatus, loading: true });

        try {
            const response = await axios.post(
                route("organization.contact.request"),
                {
                    volunteer_public_id: volunteerPublicId,
                    project_public_id: projectPublicId,
                    message: `I would like to contact you regarding your application for ${activeBooking.project.title}`,
                }
            );

            if (response.data.success) {
                setContactRequestStatus({
                    loading: false,
                    requested: true,
                    message:
                        "Contact request sent successfully! The volunteer will be notified.",
                });
            }
        } catch (error) {
            console.error("Contact request error:", error);

            // More detailed error handling
            let errorMessage = "Failed to send contact request.";
            if (error.response?.data?.errors) {
                // Laravel validation errors
                errorMessage = Object.values(error.response.data.errors)
                    .flat()
                    .join(", ");
            } else if (error.response?.data?.message) {
                // Custom error message from backend
                errorMessage = error.response.data.message;
            }

            setContactRequestStatus({
                loading: false,
                requested: false,
                message: errorMessage,
            });
        }
    };

    return (
        <OrganizationLayout auth={auth}>
            <section className="bg-gray-50 min-h-screen">
                <Head title="Volunteer Bookings" />

                {/* Confirmation Dialog */}
                <Dialog
                    open={isDialogOpen}
                    onClose={closeDialog}
                    className="relative z-50"
                >
                    <div
                        className="fixed inset-0 bg-black/30"
                        aria-hidden="true"
                    />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                            <Dialog.Title className="text-lg font-medium text-gray-900">
                                Confirm Status Update
                            </Dialog.Title>
                            <Dialog.Description className="mt-2 text-sm text-gray-600">
                                Are you sure you want to change the booking
                                status to{" "}
                                <span className="font-semibold">
                                    {selectedStatus}
                                </span>
                                ?
                            </Dialog.Description>

                            <div className="mt-4 flex justify-end space-x-3">
                                <button
                                    onClick={closeDialog}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmStatusUpdate}
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Confirm
                                </button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </Dialog>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Volunteer Bookings
                        </h1>
                        <p className="mt-2 text-gray-600">
                            View and manage all volunteer bookings for your
                            projects
                        </p>
                    </div>

                    {bookings.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                                <CalendarDays className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                No bookings yet
                            </h3>
                            <p className="text-gray-500 mb-6">
                                No volunteers have booked your projects yet.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Left sidebar - Volunteers list */}
                            <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-md border border-gray-200 flex flex-col">
                                <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                                    <h3 className="font-semibold text-lg text-gray-800">
                                        Volunteers ({bookings.length})
                                    </h3>
                                </div>
                                <div className="flex-1 overflow-y-auto">
                                    {bookings.map((booking) => (
                                        <div
                                            key={booking.public_id}
                                            className={`p-4 border-b border-gray-100 cursor-pointer transition-colors group ${
                                                activeBooking?.public_id ===
                                                booking.public_id
                                                    ? "bg-blue-50 border-l-4 border-blue-500"
                                                    : "hover:bg-gray-50"
                                            }`}
                                            onClick={() =>
                                                setActiveBooking(booking)
                                            }
                                        >
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                                                        <User className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center">
                                                            <h4 className="font-medium text-gray-900 group-hover:text-blue-600">
                                                                {
                                                                    booking
                                                                        .volunteer
                                                                        .name
                                                                }
                                                            </h4>
                                                            {booking.has_points_payment && (
                                                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                                    <DollarSign className="w-3 h-3 mr-1" />
                                                                    {
                                                                        booking.points_amount
                                                                    }{" "}
                                                                    Points
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-sm text-gray-500">
                                                                {
                                                                    booking
                                                                        .project
                                                                        .title
                                                                }
                                                            </span>
                                                            <span
                                                                className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                                                                    statusColors[
                                                                        booking
                                                                            .booking_status
                                                                    ] ||
                                                                    "bg-gray-100 text-gray-800"
                                                                }`}
                                                            >
                                                                {
                                                                    booking.booking_status
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <ChevronRight
                                                    className={`w-5 h-5 text-gray-400 group-hover:text-blue-500 ${
                                                        activeBooking?.public_id ===
                                                        booking.public_id
                                                            ? "text-blue-500"
                                                            : ""
                                                    }`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right side - Booking details */}
                            <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-md border border-gray-200 flex flex-col">
                                {activeBooking ? (
                                    <>
                                        <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl flex gap-2 items-center">
                                            <h2 className="text-xl font-bold text-gray-800">
                                                Booking Details
                                            </h2>
                                            <ArrowBigRight className="text-gray-400" />
                                            <div>
                                                <Link
                                                    href={`/volunteer-programs/${activeBooking.project.slug}`}
                                                    className="text-blue-600 font-bold text-xl hover:text-blue-800 hover:underline"
                                                >
                                                    {
                                                        activeBooking.project
                                                            .title
                                                    }
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-6">
                                            <div className="grid grid-cols-1 gap-3">
                                                {/* Volunteer Details */}
                                                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                                                    <div className="flex items-center mb-4">
                                                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-50 text-blue-600 mr-3">
                                                            <User className="w-5 h-5" />
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-gray-800">
                                                            Volunteer
                                                            Information
                                                        </h3>
                                                    </div>

                                                    <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex-shrink-0">
                                                            <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-blue-100 text-blue-600">
                                                                <User className="w-6 h-6" />
                                                            </div>
                                                        </div>

                                                        <div className="flex-1 min-w-0 space-y-2">
                                                            <div className="flex items-center flex-wrap gap-2">
                                                                <h4 className="text-lg font-medium text-gray-900">
                                                                    {
                                                                        activeBooking
                                                                            .volunteer
                                                                            .name
                                                                    }
                                                                </h4>

                                                                {activeBooking
                                                                    .volunteer
                                                                    .volunteer_profile
                                                                    ?.verification_status ===
                                                                    "Approved" && (
                                                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full px-3 py-1 border border-emerald-100">
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            className="h-3.5 w-3.5 flex-shrink-0"
                                                                            viewBox="0 0 20 20"
                                                                            fill="currentColor"
                                                                        >
                                                                            <path
                                                                                fillRule="evenodd"
                                                                                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                                                clipRule="evenodd"
                                                                            />
                                                                        </svg>
                                                                        Verified
                                                                        Volunteer
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {hasDepositPaid() && (
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center text-gray-600">
                                                                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                                                        <span className="truncate">
                                                                            {
                                                                                activeBooking
                                                                                    .volunteer
                                                                                    .email
                                                                            }
                                                                        </span>
                                                                    </div>

                                                                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                                        <h3 className="text-lg font-semibold text-blue-800 mb-2">
                                                                            Contact
                                                                            Volunteer
                                                                        </h3>
                                                                        <p className="text-sm text-blue-600 mb-3">
                                                                            Request
                                                                            access
                                                                            to
                                                                            this
                                                                            volunteer's
                                                                            contact
                                                                            information
                                                                        </p>

                                                                        {contactRequestStatus.requested ? (
                                                                            <div className="bg-green-50 p-3 rounded-md">
                                                                                <p className="text-green-700 text-sm">
                                                                                    ✓{" "}
                                                                                    {
                                                                                        contactRequestStatus.message
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        ) : (
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleContactRequest(
                                                                                        activeBooking
                                                                                            .volunteer
                                                                                            .public_id,
                                                                                        activeBooking
                                                                                            .project
                                                                                            .public_id
                                                                                    )
                                                                                }
                                                                                disabled={
                                                                                    contactRequestStatus.loading
                                                                                }
                                                                                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                                                            >
                                                                                {contactRequestStatus.loading ? (
                                                                                    <span className="loading loading-spinner"></span>
                                                                                ) : (
                                                                                    <>
                                                                                        <Mail className="w-4 h-4 mr-2" />
                                                                                        Request
                                                                                        Contact
                                                                                        Details
                                                                                    </>
                                                                                )}
                                                                            </button>
                                                                        )}

                                                                        {contactRequestStatus.message &&
                                                                            !contactRequestStatus.requested && (
                                                                                <p className="text-red-600 text-sm mt-2">
                                                                                    {
                                                                                        contactRequestStatus.message
                                                                                    }
                                                                                </p>
                                                                            )}
                                                                    </div>
                                                                    {/* {activeBooking
                                                                        .volunteer
                                                                        .volunteer_profile
                                                                        ?.phone && (
                                                                        <div className="flex items-center text-gray-600">
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                className="h-4 w-4 mr-2 text-gray-400"
                                                                                viewBox="0 0 20 20"
                                                                                fill="currentColor"
                                                                            >
                                                                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                                                            </svg>
                                                                            <span>
                                                                                {
                                                                                    activeBooking
                                                                                        .volunteer
                                                                                        .volunteer_profile
                                                                                        .phone
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    )} */}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {activeBooking.volunteer
                                                        .volunteer_profile && (
                                                        <button
                                                            onClick={() =>
                                                                openVolunteerModal(
                                                                    activeBooking.volunteer
                                                                )
                                                            }
                                                            className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                                        >
                                                            <User className="h-4 w-4 mr-2" />
                                                            View Full Volunteer
                                                            Profile
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Booking Details */}
                                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center">
                                                        <CalendarDays className="w-4 h-4 mr-2" />
                                                        Booking Details
                                                    </h3>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                        {/* Dates */}
                                                        <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                                            <div className="flex-shrink-0 flex items-center justify-center h-11 w-11 rounded-xl bg-blue-100 text-blue-600">
                                                                <CalendarDays className="w-5 h-5" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-medium text-gray-700 mb-1">
                                                                    Dates
                                                                </h4>
                                                                <p className="text-gray-600 truncate">
                                                                    {new Date(
                                                                        activeBooking.start_date
                                                                    ).toLocaleDateString(
                                                                        "en-US",
                                                                        {
                                                                            month: "short",
                                                                            day: "numeric",
                                                                            year: "numeric",
                                                                        }
                                                                    )}{" "}
                                                                    to{" "}
                                                                    {new Date(
                                                                        activeBooking.end_date
                                                                    ).toLocaleDateString(
                                                                        "en-US",
                                                                        {
                                                                            month: "short",
                                                                            day: "numeric",
                                                                            year: "numeric",
                                                                        }
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Duration */}
                                                        <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                                            <div className="flex-shrink-0 flex items-center justify-center h-11 w-11 rounded-xl bg-blue-100 text-blue-600">
                                                                <Clock className="w-5 h-5" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="font-medium text-gray-700 mb-1">
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

                                                        {/* Number of Volunteers */}
                                                        <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                                            <div className="flex-shrink-0 flex items-center justify-center h-11 w-11 rounded-xl bg-blue-100 text-blue-600">
                                                                <Users className="w-5 h-5" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="font-medium text-gray-700 mb-1">
                                                                    Number of
                                                                    Volunteers
                                                                </h4>
                                                                <p className="text-gray-600">
                                                                    {
                                                                        activeBooking.number_of_travellers
                                                                    }{" "}
                                                                    {activeBooking.number_of_travellers ===
                                                                    1
                                                                        ? "Person"
                                                                        : "People"}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Status */}
                                                        <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                                            <div className="flex-shrink-0 flex items-center justify-center h-11 w-11 rounded-xl bg-blue-100 text-blue-600">
                                                                <Badge className="w-5 h-5" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="font-medium text-gray-700 mb-1">
                                                                    Status
                                                                </h4>
                                                                <span
                                                                    className={`px-3 py-1.5 inline-flex items-center text-xs font-semibold rounded-full ${
                                                                        statusColors[
                                                                            activeBooking
                                                                                .booking_status
                                                                        ] ||
                                                                        "bg-gray-100 text-gray-800"
                                                                    }`}
                                                                >
                                                                    {
                                                                        activeBooking.booking_status
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Payment Information */}
                                                {activeBooking.type_of_project ===
                                                    "Paid" && (
                                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                                            Payment Information
                                                        </h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                            {/* Total Amount */}
                                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                                                                        <DollarSign className="w-4 h-4" />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="text-sm font-medium text-gray-500">
                                                                            Total
                                                                            Amount
                                                                        </h4>
                                                                        <p className="text-lg font-semibold text-gray-800">
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
                                                            </div>

                                                            {/* Amount Paid / Deposit Due */}
                                                            <div
                                                                className={`p-4 rounded-lg ${
                                                                    hasDepositPaid()
                                                                        ? "bg-gray-50"
                                                                        : "bg-red-50"
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div
                                                                        className={`flex items-center justify-center h-10 w-10 rounded-full ${
                                                                            hasDepositPaid()
                                                                                ? "bg-blue-100 text-blue-600"
                                                                                : "bg-red-100 text-red-600"
                                                                        } flex-shrink-0`}
                                                                    >
                                                                        <DollarSign className="w-4 h-4" />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="text-sm font-medium text-gray-500">
                                                                            {hasDepositPaid()
                                                                                ? "Amount Paid"
                                                                                : "Deposit Amount to be paid"}
                                                                        </h4>
                                                                        <p
                                                                            className={`text-lg font-semibold ${
                                                                                hasDepositPaid()
                                                                                    ? "text-gray-800"
                                                                                    : "text-red-800"
                                                                            }`}
                                                                        >
                                                                            $
                                                                            {hasDepositPaid()
                                                                                ? calculateTotalPaid().toLocaleString()
                                                                                : calculateDepositAmount().toLocaleString()}
                                                                        </p>
                                                                        {!hasDepositPaid() && (
                                                                            <p className="text-xs text-red-600 mt-1">
                                                                                Deposit
                                                                                payment
                                                                                is
                                                                                required
                                                                                to
                                                                                confirm
                                                                                booking
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Balance Due */}
                                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                                                                        <DollarSign className="w-4 h-4" />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="text-sm font-medium text-gray-500">
                                                                            Balance
                                                                            Due
                                                                        </h4>
                                                                        <p className="text-lg font-semibold text-gray-800">
                                                                            $
                                                                            {calculateRemainingBalance().toLocaleString()}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Deposit Status */}
                                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                                                                        <DollarSign className="w-4 h-4" />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="text-sm font-medium text-gray-500">
                                                                            Deposit
                                                                            Status
                                                                        </h4>
                                                                        <p className="text-gray-600">
                                                                            {hasDepositPaid() ? (
                                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                                    <Check className="w-3 h-3 mr-1" />
                                                                                    Deposit
                                                                                    Paid
                                                                                </span>
                                                                            ) : (
                                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                                    <X className="w-3 h-3 mr-1" />
                                                                                    Deposit
                                                                                    Pending
                                                                                </span>
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Point Payment Status - Only shown if paid with points */}
                                                        {activeBooking.has_points_payment && (
                                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex-shrink-0">
                                                                        <DollarSign className="w-4 h-4" />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="text-sm font-medium text-gray-500">
                                                                            Point
                                                                            Payment
                                                                        </h4>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                                                <Check className="w-3 h-3 mr-1" />
                                                                                Paid
                                                                                with
                                                                                Points
                                                                            </span>
                                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                                {
                                                                                    activeBooking.points_amount
                                                                                }{" "}
                                                                                Points
                                                                                Earned
                                                                            </span>
                                                                        </div>
                                                                        <p className="mt-1 text-xs text-purple-600">
                                                                            This
                                                                            booking
                                                                            was
                                                                            fully
                                                                            paid
                                                                            using
                                                                            volunteer
                                                                            points.
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Payment History */}
                                                        {activeBooking?.payments
                                                            ?.length > 0 && (
                                                            <div>
                                                                <h4 className="font-medium text-gray-700 mb-3">
                                                                    Payment
                                                                    History
                                                                </h4>
                                                                <div className="space-y-3">
                                                                    {activeBooking.payments.map(
                                                                        (
                                                                            payment
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    payment.id ||
                                                                                    payment.public_id ||
                                                                                    `payment-${index}`
                                                                                }
                                                                                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                                                                            >
                                                                                <div className="flex justify-between items-center">
                                                                                    <div>
                                                                                        <p className="font-semibold text-gray-800">
                                                                                            $
                                                                                            {
                                                                                                payment.amount
                                                                                            }
                                                                                        </p>
                                                                                        <p className="text-xs text-gray-500 mt-1">
                                                                                            {new Date(
                                                                                                payment.created_at
                                                                                            ).toLocaleDateString(
                                                                                                "en-US",
                                                                                                {
                                                                                                    year: "numeric",
                                                                                                    month: "short",
                                                                                                    day: "numeric",
                                                                                                    hour: "2-digit",
                                                                                                    minute: "2-digit",
                                                                                                }
                                                                                            )}
                                                                                        </p>
                                                                                    </div>
                                                                                    <span
                                                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                                                                                            ? "Deposit"
                                                                                            : payment.status
                                                                                                  .charAt(
                                                                                                      0
                                                                                                  )
                                                                                                  .toUpperCase() +
                                                                                              payment.status.slice(
                                                                                                  1
                                                                                              )}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {activeBooking.booking_status !==
                                                    "Completed" && (
                                                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                                            Update Booking
                                                            Status
                                                        </h3>

                                                        <div className="flex flex-wrap gap-2">
                                                            {[
                                                                // Always show Approved
                                                                {
                                                                    value: "Approved",
                                                                    icon: (
                                                                        <Check className="w-4 h-4 mr-1" />
                                                                    ),
                                                                },
                                                                // Only show Rejected when status is Pending
                                                                ...(activeBooking.booking_status ===
                                                                "Pending"
                                                                    ? [
                                                                          {
                                                                              value: "Rejected",
                                                                              icon: (
                                                                                  <X className="w-4 h-4 mr-1" />
                                                                              ),
                                                                          },
                                                                      ]
                                                                    : []),
                                                                // Only show Cancelled and Completed if status is Approved
                                                                ...(activeBooking.booking_status ===
                                                                "Approved"
                                                                    ? [
                                                                          {
                                                                              value: "Cancelled",
                                                                              icon: (
                                                                                  <Ban className="w-4 h-4 mr-1" />
                                                                              ),
                                                                          },
                                                                          {
                                                                              value: "Completed",
                                                                              icon: (
                                                                                  <Check className="w-4 h-4 mr-1" />
                                                                              ),
                                                                          },
                                                                      ]
                                                                    : []),
                                                                // Show Pending if current status is Pending
                                                                ...(activeBooking.booking_status ===
                                                                    "Pending" ||
                                                                (statusChanges[
                                                                    activeBooking
                                                                        .public_id
                                                                ] &&
                                                                    statusChanges[
                                                                        activeBooking
                                                                            .public_id
                                                                    ] ===
                                                                        "Pending")
                                                                    ? [
                                                                          {
                                                                              value: "Pending",
                                                                              icon: (
                                                                                  <Clock className="w-4 h-4 mr-1" />
                                                                              ),
                                                                          },
                                                                      ]
                                                                    : []),
                                                            ].map(
                                                                ({
                                                                    value,
                                                                    icon,
                                                                }) => {
                                                                    const isActive =
                                                                        (statusChanges[
                                                                            activeBooking
                                                                                .public_id
                                                                        ] ||
                                                                            activeBooking.booking_status) ===
                                                                        value;
                                                                    return (
                                                                        <button
                                                                            key={
                                                                                value
                                                                            }
                                                                            onClick={() =>
                                                                                !isActive &&
                                                                                handleUpdateStatus(
                                                                                    activeBooking.public_id,
                                                                                    value
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                isActive
                                                                            }
                                                                            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors flex items-center ${
                                                                                isActive
                                                                                    ? `${statusColors[value]} border border-blue-300 cursor-not-allowed opacity-75`
                                                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                                            }`}
                                                                        >
                                                                            {
                                                                                icon
                                                                            }
                                                                            {
                                                                                value
                                                                            }
                                                                        </button>
                                                                    );
                                                                }
                                                            )}
                                                        </div>

                                                        {/* Enhanced Confirmation Dialog */}
                                                        <Dialog
                                                            open={isDialogOpen}
                                                            onClose={
                                                                closeDialog
                                                            }
                                                            className="relative z-50"
                                                        >
                                                            <div
                                                                className="fixed inset-0 bg-black/30"
                                                                aria-hidden="true"
                                                            />
                                                            <div className="fixed inset-0 flex items-center justify-center p-4">
                                                                <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                                                                    <div className="flex items-center gap-3 mb-4">
                                                                        {selectedStatus ===
                                                                            "Pending" && (
                                                                            <Clock className="w-8 h-8 text-amber-500" />
                                                                        )}
                                                                        {selectedStatus ===
                                                                            "Approved" && (
                                                                            <Check className="w-8 h-8 text-emerald-500" />
                                                                        )}
                                                                        {selectedStatus ===
                                                                            "Cancelled" && (
                                                                            <Ban className="w-8 h-8 text-rose-500" />
                                                                        )}
                                                                        {selectedStatus ===
                                                                            "Completed" && (
                                                                            <Check className="w-8 h-8 text-indigo-500" />
                                                                        )}
                                                                        {selectedStatus ===
                                                                            "Rejected" && (
                                                                            <X className="w-8 h-8 text-red-500" />
                                                                        )}

                                                                        <Dialog.Title className="text-lg font-medium text-gray-900">
                                                                            Confirm
                                                                            Status
                                                                            Update
                                                                        </Dialog.Title>
                                                                    </div>

                                                                    <Dialog.Description className="mt-2 text-sm text-gray-600">
                                                                        Are you
                                                                        sure you
                                                                        want to
                                                                        change
                                                                        the
                                                                        booking
                                                                        status
                                                                        to{" "}
                                                                        <span className="font-semibold">
                                                                            {
                                                                                selectedStatus
                                                                            }
                                                                        </span>
                                                                        ?
                                                                        {[
                                                                            "Cancelled",
                                                                            "Rejected",
                                                                        ].includes(
                                                                            selectedStatus
                                                                        ) && (
                                                                            <p className="mt-2 text-sm text-rose-600">
                                                                                This
                                                                                action
                                                                                cannot
                                                                                be
                                                                                undone.
                                                                            </p>
                                                                        )}
                                                                    </Dialog.Description>

                                                                    <div className="mt-6 flex justify-end space-x-3">
                                                                        <button
                                                                            onClick={
                                                                                closeDialog
                                                                            }
                                                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                        <button
                                                                            onClick={
                                                                                confirmStatusUpdate
                                                                            }
                                                                            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                                                                selectedStatus ===
                                                                                "Approved"
                                                                                    ? "bg-emerald-600 hover:bg-emerald-700"
                                                                                    : selectedStatus ===
                                                                                      "Cancelled"
                                                                                    ? "bg-rose-600 hover:bg-rose-700"
                                                                                    : selectedStatus ===
                                                                                      "Completed"
                                                                                    ? "bg-indigo-600 hover:bg-indigo-700"
                                                                                    : selectedStatus ===
                                                                                      "Rejected"
                                                                                    ? "bg-red-600 hover:bg-red-700"
                                                                                    : "bg-amber-600 hover:bg-amber-700"
                                                                            }`}
                                                                        >
                                                                            Confirm
                                                                            Update
                                                                        </button>
                                                                    </div>
                                                                </Dialog.Panel>
                                                            </div>
                                                        </Dialog>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-full flex items-center justify-center p-12">
                                        <div className="text-center">
                                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 mb-4">
                                                <User className="h-6 w-6" />
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                                Select a volunteer
                                            </h3>
                                            <p className="text-gray-500">
                                                Choose a volunteer from the list
                                                to view details
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>
            <Dialog
                open={isVolunteerModalOpen}
                onClose={closeVolunteerModal}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-2xl rounded-xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
                        {selectedVolunteer && (
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <Dialog.Title className="text-2xl font-bold text-gray-900">
                                        Volunteer Details
                                    </Dialog.Title>
                                    <button
                                        onClick={closeVolunteerModal}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Left Column */}
                                    <div className="md:w-1/3">
                                        <div className="flex flex-col items-center relative">
                                            <img
                                                src={
                                                    selectedVolunteer
                                                        .volunteer_profile
                                                        ?.profile_picture
                                                        ? `/storage/${selectedVolunteer.volunteer_profile.profile_picture}`
                                                        : "/images/default-profile.jpg"
                                                }
                                                alt={selectedVolunteer.name}
                                                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow mb-4"
                                            />
                                            {selectedVolunteer.volunteer_profile
                                                ?.verification_status ===
                                                "Approved" && (
                                                <div className="absolute top-0 right-[155px] md:right-10 bg-white rounded-full p-1 shadow-md">
                                                    <VerifiedBadge className="h-5 w-5" />
                                                </div>
                                            )}
                                            <h3 className="text-xl font-semibold text-gray-900 mt-2">
                                                {selectedVolunteer.name}
                                            </h3>
                                        </div>

                                        <div className="mt-6 space-y-4">
                                            {selectedVolunteer.volunteer_profile
                                                ?.gender && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">
                                                        Gender
                                                    </h4>
                                                    <p className="text-gray-900">
                                                        {
                                                            selectedVolunteer
                                                                .volunteer_profile
                                                                .gender
                                                        }
                                                    </p>
                                                </div>
                                            )}

                                            {selectedVolunteer.volunteer_profile
                                                ?.dob && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">
                                                        Date of Birth
                                                    </h4>
                                                    <p className="text-gray-900">
                                                        {new Date(
                                                            selectedVolunteer.volunteer_profile.dob
                                                        ).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            )}

                                            {selectedVolunteer.volunteer_profile
                                                ?.city && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">
                                                        Location
                                                    </h4>
                                                    <p className="text-gray-900">
                                                        {
                                                            selectedVolunteer
                                                                .volunteer_profile
                                                                .city
                                                        }
                                                        ,{" "}
                                                        {
                                                            selectedVolunteer
                                                                .volunteer_profile
                                                                .country
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="md:w-2/3">
                                        {/* Skills */}
                                        {selectedVolunteer.volunteer_profile
                                            ?.skills?.length > 0 && (
                                            <div className="mb-6">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                    Skills
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedVolunteer.volunteer_profile.skills.map(
                                                        (skill, index) => (
                                                            <span
                                                                key={index}
                                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                            >
                                                                {skill}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Education */}
                                        {selectedVolunteer.volunteer_profile
                                            ?.education_status && (
                                            <div className="mb-6">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                    Education
                                                </h4>
                                                <p className="text-gray-900">
                                                    {
                                                        selectedVolunteer
                                                            .volunteer_profile
                                                            .education_status
                                                    }
                                                </p>
                                            </div>
                                        )}

                                        {/* Hobbies */}
                                        {selectedVolunteer.volunteer_profile
                                            ?.hobbies?.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                    Hobbies & Interests
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedVolunteer.volunteer_profile.hobbies.map(
                                                        (hobby, index) => (
                                                            <span
                                                                key={index}
                                                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                                            >
                                                                {hobby}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Dialog.Panel>
                </div>
            </Dialog>
        </OrganizationLayout>
    );
}
