import VolunteerLayout from "@/Layouts/VolunteerLayout";
import { usePage } from "@inertiajs/react";
import { CalendarDays, Users, MessageCircle } from "lucide-react";

export default function Projects() {
    const { bookings = [] } = usePage().props;

    return (
        <VolunteerLayout>
            <div className="max-w-5xl mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    My Booked Projects
                </h2>

                {Array.isArray(bookings) && bookings.length === 0 ? (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded shadow text-gray-700 text-center">
                        <p>You haven't booked any projects yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {bookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow duration-300 border"
                            >
                                <h3 className="text-xl font-semibold text-blue-700 mb-2">
                                    {booking.project?.title}
                                </h3>

                                <div className="text-gray-600 space-y-2">
                                    <p className="flex items-center gap-2">
                                        <CalendarDays className="w-5 h-5 text-gray-500" />
                                        <span>
                                            <strong>Dates:</strong>{" "}
                                            {booking.start_date} →{" "}
                                            {booking.end_date}
                                        </span>
                                    </p>

                                    <p className="flex items-center gap-2">
                                        <Users className="w-5 h-5 text-gray-500" />
                                        <span>
                                            <strong>Travellers:</strong>{" "}
                                            {booking.number_of_travellers}
                                        </span>
                                    </p>

                                    {booking.message && (
                                        <p className="flex items-start gap-2">
                                            <MessageCircle className="w-5 h-5 text-gray-500 mt-1" />
                                            <span>
                                                <strong>Message:</strong>{" "}
                                                {booking.message}
                                            </span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </VolunteerLayout>
    );
}
