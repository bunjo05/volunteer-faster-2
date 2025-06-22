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
import { useState } from "react";

export default function Projects() {
    const { bookings = [] } = usePage().props;
    const [activeBooking, setActiveBooking] = useState(bookings[0] || null);

    const { post } = useForm();

    return (
        <VolunteerLayout>
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
                                                    Send Reminder{" "}
                                                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                                                    {/* Enhanced tooltip with arrow */}
                                                    <span className="absolute hidden group-hover:block -top-10 left-2/3 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap transition-opacity delay-200 opacity-0 group-hover:opacity-100">
                                                        Send a reminder to the
                                                        Project Admin
                                                        <span className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-gray-800 border-t-transparent border-r-transparent border-b-transparent border-l-transparent border-t-gray-800"></span>
                                                    </span>
                                                </button>
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
