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

        router.put(
            `/organization/bookings/${selectedBookingId}/update-status`,
            {
                booking_status: selectedStatus,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Update local state
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

    // const updateStatus = (booking_status) => {
    //     if (!activeBooking) return;

    //     post(route("bookings.update-status", activeBooking.id), {
    //         booking_status, // Send the status directly in the request body
    //         preserveScroll: true,
    //         onSuccess: () => {
    //             // Update local state
    //             const updatedBookings = bookings.map((booking) =>
    //                 booking.id === activeBooking.id
    //                     ? { ...booking, booking_status }
    //                     : booking
    //             );
    //             setBookings(updatedBookings);
    //             setActiveBooking((prev) => ({ ...prev, booking_status }));
    //         },
    //         onError: (errors) => {
    //             console.error("Error updating status:", errors);
    //         },
    //     });
    // };

    const statusColors = {
        Pending: "bg-amber-100 text-amber-800",
        Approved: "bg-emerald-100 text-emerald-800",
        Cancelled: "bg-rose-100 text-rose-800",
        Completed: "bg-indigo-100 text-indigo-800",
        Rejected: "bg-red-100 text-red-800",
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

    return (
        <OrganizationLayout>
            <section className="bg-[#fff] min-h-screen rounded-lg shadow-sm">
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
                        <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6">
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
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 mb-4">
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
                        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-150px)]">
                            {/* Left sidebar - Volunteers list */}
                            <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
                                <div className="p-4 border-b border-gray-200 bg-gray-50">
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
                                                        <h4 className="font-medium text-gray-900 group-hover:text-blue-600">
                                                            {
                                                                booking
                                                                    .volunteer
                                                                    .name
                                                            }
                                                        </h4>
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
                            <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
                                {activeBooking ? (
                                    <>
                                        <div className="p-4 border-b border-gray-200 flex gap-2 items-center">
                                            <h2 className="text-xl font-bold text-gray-800">
                                                Booking Details
                                            </h2>
                                            <span>
                                                {" "}
                                                <ArrowBigRight />
                                            </span>
                                            <div>
                                                <Link
                                                    href={`/volunteer-programs/${activeBooking.project.slug}`}
                                                    className="text-blue-600 font-bold text-xl hover:text-blue-800 hover:text-underline"
                                                >
                                                    {
                                                        activeBooking.project
                                                            .title
                                                    }
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                                {/* Volunteer Details */}
                                                <div className="space-y-6">
                                                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center">
                                                            <User className="w-4 h-4 mr-2" />
                                                            Volunteer
                                                            Information
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

                                                            <div className="flex items-start gap-4">
                                                                {/* <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-blue-100 text-blue-600 flex-shrink-0">
                                                                    <Mail className="w-5 h-5" />
                                                                </div> */}
                                                                <div>
                                                                    {/* <h4 className="font-medium text-gray-700 mb-1">
                                                                        Email
                                                                    </h4>
                                                                    <p className="text-gray-600">
                                                                        {
                                                                            activeBooking
                                                                                .volunteer
                                                                                .email
                                                                        }
                                                                    </p> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Booking Details */}
                                                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center">
                                                            <CalendarDays className="w-4 h-4 mr-2" />
                                                            Booking Details
                                                        </h3>

                                                        <div className="space-y-4">
                                                            <div className="flex items-start gap-4">
                                                                <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-blue-100 text-blue-600 flex-shrink-0">
                                                                    <CalendarDays className="w-5 h-5" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-medium text-gray-700 mb-1">
                                                                        Dates
                                                                    </h4>
                                                                    <p className="text-gray-600">
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

                                                            <div className="flex items-start gap-4">
                                                                <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-blue-100 text-blue-600 flex-shrink-0">
                                                                    <Clock className="w-5 h-5" />
                                                                </div>
                                                                <div>
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

                                                            <div className="flex items-start gap-4">
                                                                <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-blue-100 text-blue-600 flex-shrink-0">
                                                                    <DollarSign className="w-5 h-5" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-medium text-gray-700 mb-1">
                                                                        Total
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

                                                            <div className="flex items-start gap-4">
                                                                <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-blue-100 text-blue-600 flex-shrink-0">
                                                                    <Users className="w-5 h-5" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-medium text-gray-700 mb-1">
                                                                        Number
                                                                        of
                                                                        Volunteers
                                                                    </h4>
                                                                    <p className="text-gray-600">
                                                                        {
                                                                            activeBooking.number_of_travellers
                                                                        }{" "}
                                                                        {activeBooking.number_of_travellers ===
                                                                        1
                                                                            ? "People"
                                                                            : "Person"}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-start gap-4">
                                                                <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-blue-100 text-blue-600 flex-shrink-0">
                                                                    <Badge className="w-5 h-5" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-medium text-gray-700 mb-1">
                                                                        Status
                                                                    </h4>
                                                                    <span
                                                                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                                                </div>

                                                {activeBooking && (
                                                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                                                        <div className="flex flex-wrap gap-3">
                                                            {activeBooking && (
                                                                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                                                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                                                        Update
                                                                        Booking
                                                                        Status
                                                                    </h3>
                                                                    <div className="w-64">
                                                                        <select
                                                                            value={
                                                                                statusChanges[
                                                                                    activeBooking
                                                                                        .id
                                                                                ] ||
                                                                                activeBooking.booking_status ||
                                                                                "Pending"
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                handleUpdateStatus(
                                                                                    activeBooking.id,
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus"
                                                                        >
                                                                            {/* <option value="">
                                                                                Select
                                                                                Status
                                                                            </option> */}
                                                                            <option value="Approved">
                                                                                Approved
                                                                            </option>
                                                                            <option value="Cancelled">
                                                                                Cancelled
                                                                            </option>
                                                                            <option value="Completed">
                                                                                Completed
                                                                            </option>
                                                                            <option value="Rejected">
                                                                                Rejected
                                                                            </option>
                                                                            <option value="Pending">
                                                                                Pending
                                                                            </option>
                                                                        </select>

                                                                        {/* <select
                                                                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
                                                                            value={
                                                                                activeBooking.booking_status
                                                                            }
                                                                            disabled={
                                                                                processing
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                if (
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                ) {
                                                                                    updateStatus(
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    );
                                                                                }
                                                                            }}
                                                                        >
                                                                            <option
                                                                                value=""
                                                                                disabled
                                                                            >
                                                                                Select
                                                                                a
                                                                                new
                                                                                status
                                                                            </option>
                                                                            {[
                                                                                "Approved",
                                                                                "Rejected",
                                                                                "Cancelled",
                                                                                "Completed",
                                                                                "Pending",
                                                                            ]
                                                                                .filter(
                                                                                    (
                                                                                        status
                                                                                    ) =>
                                                                                        status !==
                                                                                        activeBooking.booking_status
                                                                                )
                                                                                .map(
                                                                                    (
                                                                                        status
                                                                                    ) => (
                                                                                        <option
                                                                                            key={
                                                                                                status
                                                                                            }
                                                                                            value={
                                                                                                status
                                                                                            }
                                                                                        >
                                                                                            {
                                                                                                status
                                                                                            }
                                                                                        </option>
                                                                                    )
                                                                                )}
                                                                        </select> */}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
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
