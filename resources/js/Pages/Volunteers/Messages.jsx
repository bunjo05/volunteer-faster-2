import VolunteerLayout from "@/Layouts/VolunteerLayout";
import { usePage, Link } from "@inertiajs/react";

export default function Messages() {
    const { messages = [] } = usePage().props;

    return (
        <VolunteerLayout>
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Inbox</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Messages List */}
                    <div className="col-span-1 bg-white rounded-xl shadow p-4">
                        <h2 className="text-lg font-semibold mb-4">Messages</h2>
                        <ul className="divide-y divide-gray-200 max-h-[70vh] overflow-y-auto">
                            {messages.length > 0 ? (
                                messages.map((msg) => (
                                    <li
                                        key={msg.id}
                                        className="py-3 px-2 hover:bg-gray-100 rounded cursor-pointer"
                                    >
                                        <Link
                                            href={`/organization/messages/${msg.id}`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <p className="text-sm font-medium text-gray-800">
                                                    {msg.subject}
                                                </p>
                                                <span
                                                    className={`text-xs px-2 py-1 rounded-full ${
                                                        msg.status === "Unread"
                                                            ? "bg-red-100 text-red-600"
                                                            : "bg-green-100 text-green-600"
                                                    }`}
                                                >
                                                    {msg.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 truncate mt-1">
                                                {msg.body}
                                            </p>
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">
                                    No messages found.
                                </p>
                            )}
                        </ul>
                    </div>

                    {/* Message Preview Placeholder */}
                    <div className="col-span-2 bg-white rounded-xl shadow p-6 hidden md:block">
                        <div className="text-center text-gray-500">
                            <p>Select a message to view details.</p>
                        </div>
                    </div>
                </div>
            </div>
        </VolunteerLayout>
    );
}
