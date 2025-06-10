import OrganizationLayout from "@/Layouts/OrganizationLayout";
import { usePage, Link, router } from "@inertiajs/react";
import { useState } from "react";

export default function Messages() {
    const { messages = [] } = usePage().props;
    const [selectedMessage, setSelectedMessage] = useState(messages[0] || null);

    const handleMessageClick = (message) => {
        setSelectedMessage(message);
        // Optionally mark as read when clicked
        if (message.status === "Unread") {
            router.patch(`/organization/messages/${message.id}/mark-as-read`);
        }
    };

    return (
        <OrganizationLayout>
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Inbox</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-xl shadow overflow-hidden">
                    {/* Messages List - Senders */}
                    <div className="col-span-1 border-r border-gray-200">
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-lg font-semibold">
                                Conversations
                            </h2>
                        </div>
                        <ul className="divide-y divide-gray-200 max-h-[70vh] overflow-y-auto">
                            {messages.length > 0 ? (
                                messages.map((msg) => (
                                    <li
                                        key={msg.id}
                                        className={`py-3 px-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                                            selectedMessage?.id === msg.id
                                                ? "bg-blue-50 border-l-4 border-blue-500"
                                                : ""
                                        }`}
                                        onClick={() => handleMessageClick(msg)}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center min-w-0">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                                                    {msg.sender.name.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {msg.sender.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {msg.subject}
                                                    </p>
                                                </div>
                                            </div>
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
                                    </li>
                                ))
                            ) : (
                                <li className="py-4 px-4 text-center">
                                    <p className="text-gray-500 text-sm">
                                        No messages found.
                                    </p>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Message Details */}
                    <div className="col-span-2">
                        {selectedMessage ? (
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            {selectedMessage.subject}
                                        </h2>
                                        <div className="flex items-center mt-2">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                                                {selectedMessage.sender.name.charAt(
                                                    0
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {
                                                        selectedMessage.sender
                                                            .name
                                                    }
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {
                                                        selectedMessage.sender
                                                            .email
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {new Date(
                                            selectedMessage.created_at
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </div>
                                </div>

                                <div className="prose max-w-none text-gray-700">
                                    <p>{selectedMessage.body}</p>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Reply
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center p-12">
                                <div className="text-center text-gray-500">
                                    <p>Select a message to view details.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </OrganizationLayout>
    );
}
