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

export default function Bookings({ bookings: initialBookings }) {
    const [bookings, setBookings] = useState(initialBookings);
    const [activeBooking, setActiveBooking] = useState(bookings[0] || null);
    const { flash } = usePage().props;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [statusChanges, setStatusChanges] = useState({});

    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedBookingId, setSelectedBookingId] = useState(null);

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
                        booking.id === selectedBookingId
                            ? { ...booking, booking_status: selectedStatus }
                            : booking
                    );
                    setBookings(updatedBookings);

                    if (activeBooking?.id === selectedBookingId) {
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

    const statusColors = {
        Pending: "bg-amber-100 text-amber-800",
        Approved: "bg-emerald-100 text-emerald-800",
        Cancelled: "bg-rose-100 text-rose-800",
        Completed: "bg-indigo-100 text-indigo-800",
        Rejected: "bg-red-100 text-red-800",
    };

    return (
        <OrganizationLayout>
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
                                                        <span className="text-sm text-gray-500">
                                                            {
                                                                booking.project
                                                                    .title
                                                            }
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
                                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center">
                                                        <User className="w-4 h-4 mr-2" />
                                                        Volunteer Information
                                                    </h3>
                                                    <div className="space-y-4">
                                                        <div className="flex items-start gap-4">
                                                            <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-blue-100 text-blue-600 flex-shrink-0">
                                                                <User className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium text-gray-700 mb-1">
                                                                    Name
                                                                </h4>
                                                                <p className="text-gray-600">
                                                                    {
                                                                        activeBooking
                                                                            .volunteer
                                                                            .name
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
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

                                                        {/* Amount Paid */}
                                                        <div className="bg-gray-50 p-4 rounded-lg">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                                                                    <DollarSign className="w-4 h-4" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-sm font-medium text-gray-500">
                                                                        Amount
                                                                        Paid
                                                                    </h4>
                                                                    <p className="text-lg font-semibold text-gray-800">
                                                                        $
                                                                        {calculateTotalPaid().toLocaleString()}
                                                                    </p>
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
                                                                Payment History
                                                            </h4>
                                                            <div className="space-y-3">
                                                                {activeBooking.payments.map(
                                                                    (
                                                                        payment
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                payment.id
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

                                                {activeBooking.booking_status !==
                                                    "Completed" && (
                                                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                                            Update Booking
                                                            Status
                                                        </h3>

                                                        <div className="flex flex-wrap gap-2">
                                                            {[
                                                                {
                                                                    value: "Approved",
                                                                    icon: (
                                                                        <Check className="w-4 h-4 mr-1" />
                                                                    ),
                                                                },
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
                                                                {
                                                                    value: "Rejected",
                                                                    icon: (
                                                                        <X className="w-4 h-4 mr-1" />
                                                                    ),
                                                                },
                                                                ...(activeBooking.booking_status ===
                                                                    "Pending" ||
                                                                (statusChanges[
                                                                    activeBooking
                                                                        .id
                                                                ] &&
                                                                    statusChanges[
                                                                        activeBooking
                                                                            .id
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
                                                                                .id
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
                                                                                    activeBooking.id,
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
                                                                        {selectedStatus ===
                                                                            "Pending" && (
                                                                            <Clock className="w-8 h-8 text-amber-500" />
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
        </OrganizationLayout>
    );
}
