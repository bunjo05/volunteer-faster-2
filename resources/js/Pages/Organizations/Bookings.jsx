import React, { useState } from "react";
import { Head, Link, usePage, useForm } from "@inertiajs/react";
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

export default function Bookings({ bookings }) {
    const [activeBooking, setActiveBooking] = useState(bookings[0] || null);
    const { flash } = usePage().props;
    const { post, processing } = useForm();
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

    const updateStatus = (booking_status) => {
        if (!activeBooking) return;

        post(
            route("bookings.update-status", activeBooking.id),
            {
                booking_status,
            },
            {
                onError: (errors) => {
                    console.error("Error updating status:", errors);
                },
                onSuccess: () => {
                    // Optionally refresh the data or show a success message
                },
            }
        );
    };

    return (
        <OrganizationLayout>
            <section className="bg-[#fff] min-h-screen rounded-lg shadow-sm">
                <Head title="Volunteer Bookings" />
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
                                                                                    .status
                                                                            ] ||
                                                                            "bg-gray-100 text-gray-800"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            activeBooking.status
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Project Details */}
                                                {/* <div className="space-y-6">
                                                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center">
                                                            <MapPin className="w-4 h-4 mr-2" />
                                                            Project Information
                                                        </h3>
                                                        <div className="space-y-4">
                                                            <div className="flex items-start gap-4">
                                                                <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-blue-100 text-blue-600 flex-shrink-0">
                                                                    <Badge className="w-5 h-5" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-medium text-gray-700 mb-1">
                                                                        Project
                                                                        Title
                                                                    </h4>
                                                                    <Link
                                                                        href={`/projects/${activeBooking.project.slug}`}
                                                                        className="text-blue-600 hover:text-blue-800"
                                                                    >
                                                                        {
                                                                            activeBooking
                                                                                .project
                                                                                .title
                                                                        }
                                                                    </Link>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-start gap-4">
                                                                <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-blue-100 text-blue-600 flex-shrink-0">
                                                                    <MapPin className="w-5 h-5" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-medium text-gray-700 mb-1">
                                                                        Location
                                                                    </h4>
                                                                    <p className="text-gray-600">
                                                                        {
                                                                            activeBooking
                                                                                .project
                                                                                .location
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {activeBooking.message && (
                                                                <div className="flex items-start gap-4">
                                                                    <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-blue-100 text-blue-600 flex-shrink-0">
                                                                        <Mail className="w-5 h-5" />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-medium text-gray-700 mb-1">
                                                                            Volunteer's
                                                                            Message
                                                                        </h4>
                                                                        <p className="text-gray-600 whitespace-pre-line bg-white p-3 rounded-lg border border-gray-200">
                                                                            {
                                                                                activeBooking.message
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div> */}
                                                {activeBooking && (
                                                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                                            Update Booking
                                                            Status
                                                        </h3>
                                                        <div className="flex flex-wrap gap-3">
                                                            {activeBooking.booking_status !==
                                                                "Approved" && (
                                                                <button
                                                                    onClick={() =>
                                                                        updateStatus(
                                                                            "Approved"
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        processing
                                                                    }
                                                                    className="inline-flex items-center px-2 py-2 bg-emerald-600 border border-transparent rounded-md font-semibold text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-50"
                                                                >
                                                                    <Check className="w-4 h-4 mr-2" />
                                                                    Approve
                                                                </button>
                                                            )}

                                                            {activeBooking.booking_status !==
                                                                "Rejected" && (
                                                                <button
                                                                    onClick={() =>
                                                                        updateStatus(
                                                                            "Rejected"
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        processing
                                                                    }
                                                                    className="inline-flex items-center px-2 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50"
                                                                >
                                                                    <X className="w-4 h-4 mr-2" />
                                                                    Reject
                                                                </button>
                                                            )}

                                                            {activeBooking.booking_status !==
                                                                "Cancelled" && (
                                                                <button
                                                                    onClick={() =>
                                                                        updateStatus(
                                                                            "Cancelled"
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        processing
                                                                    }
                                                                    className="inline-flex items-center px-2 py-2 bg-rose-600 border border-transparent rounded-md font-semibold text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors disabled:opacity-50"
                                                                >
                                                                    <Ban className="w-4 h-4 mr-2" />
                                                                    Cancel
                                                                </button>
                                                            )}

                                                            {activeBooking.booking_status !==
                                                                "Completed" && (
                                                                <button
                                                                    onClick={() =>
                                                                        updateStatus(
                                                                            "Completed"
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        processing
                                                                    }
                                                                    className="inline-flex items-center px-2 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
                                                                >
                                                                    <Check className="w-4 h-4 mr-2" />
                                                                    Mark as
                                                                    Completed
                                                                </button>
                                                            )}

                                                            {activeBooking.booking_status !==
                                                                "Pending" && (
                                                                <button
                                                                    onClick={() =>
                                                                        updateStatus(
                                                                            "Pending"
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        processing
                                                                    }
                                                                    className="inline-flex items-center px-4 py-2 bg-amber-600 border border-transparent rounded-md font-semibold text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors disabled:opacity-50"
                                                                >
                                                                    <RotateCcw className="w-4 h-4 mr-2" />
                                                                    Reset to
                                                                    Pending
                                                                </button>
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
