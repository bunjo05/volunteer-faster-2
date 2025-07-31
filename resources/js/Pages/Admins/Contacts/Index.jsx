import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function ContactMessagesIndex({ messages }) {
    // const { post } = useForm({
    //     sus,
    // });
    const toggleSuspension = (messageId, currentStatus) => {
        if (
            confirm(
                `Are you sure you want to ${
                    currentStatus ? "unsuspend" : "suspend"
                } this message?`
            )
        ) {
            Inertia.post(route("admin.contacts.toggle-suspension", messageId), {
                preserveScroll: true,
            });
        }
    };

    const suspendUser = (userId) => {
        if (confirm("Are you sure you want to suspend this user?")) {
            Inertia.post(route("admin.users.suspend", userId), {
                preserveScroll: true,
            });
        }
    };

    const handleSuspensionToggle = (e) => {
        e.preventDefault();
        post(route("admin.contacts.toggle-suspension", message.id));
    };

    return (
        <AdminLayout>
            <Head title="Contact Messages" />

            <div className="py-4 md:py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-4 md:p-6 bg-white border-b border-gray-200">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                                <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-0">
                                    Contact Messages
                                </h1>
                                <div className="text-sm text-gray-500">
                                    {messages.total} total messages
                                </div>
                            </div>

                            {/* Mobile cards view */}
                            <div className="md:hidden space-y-4">
                                {messages.data.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`p-4 rounded-lg border ${
                                            message.is_suspended
                                                ? "border-red-200 bg-red-50"
                                                : message.is_read
                                                ? "border-gray-200"
                                                : "border-blue-200 bg-blue-50"
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3
                                                className={`font-medium ${
                                                    message.is_suspended
                                                        ? "text-gray-500 line-through"
                                                        : "text-gray-900"
                                                }`}
                                            >
                                                {message.name}
                                            </h3>
                                            <span className="text-xs text-gray-500">
                                                {new Date(
                                                    message.created_at
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p
                                            className={`text-sm mb-1 ${
                                                message.is_suspended
                                                    ? "text-gray-400 line-through"
                                                    : "text-gray-600"
                                            }`}
                                        >
                                            {message.subject}
                                        </p>
                                        <p
                                            className={`text-sm mb-3 ${
                                                message.is_suspended
                                                    ? "text-gray-400 line-through"
                                                    : "text-blue-600"
                                            }`}
                                        >
                                            {message.email}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${
                                                    message.is_suspended
                                                        ? "bg-gray-100 text-gray-800"
                                                        : message.is_replied
                                                        ? "bg-green-100 text-green-800"
                                                        : message.is_read
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                }`}
                                            >
                                                {message.is_suspended
                                                    ? "Suspended"
                                                    : message.is_replied
                                                    ? "Replied"
                                                    : message.is_read
                                                    ? "Read"
                                                    : "New"}
                                            </span>
                                            <div className="flex space-x-2">
                                                <Link
                                                    href={route(
                                                        "admin.contacts.show",
                                                        message.id
                                                    )}
                                                    className="text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    View
                                                </Link>
                                                {/* <button
                                                    onClick={() =>
                                                        toggleSuspension(
                                                            message.id,
                                                            message.is_suspended
                                                        )
                                                    }
                                                    className={`text-sm ${
                                                        message.is_suspended
                                                            ? "text-green-600 hover:text-green-800"
                                                            : "text-red-600 hover:text-red-800"
                                                    }`}
                                                >
                                                    {message.is_suspended
                                                        ? "Unsuspend"
                                                        : "Suspend"}
                                                </button> */}
                                                {/* {message.user_id && (
                                                    <button
                                                        onClick={() =>
                                                            suspendUser(
                                                                message.user_id
                                                            )
                                                        }
                                                        className="text-sm text-red-600 hover:text-red-800"
                                                    >
                                                        Suspend User
                                                    </button>
                                                )} */}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop table view */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Subject
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {messages.data.map((message) => (
                                            <tr
                                                key={message.id}
                                                className={
                                                    message.is_suspended
                                                        ? "bg-red-50 hover:bg-red-100"
                                                        : message.is_read
                                                        ? "bg-white hover:bg-gray-50"
                                                        : "bg-blue-50 hover:bg-blue-100"
                                                }
                                            >
                                                <td
                                                    className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                                                        message.is_suspended
                                                            ? "text-gray-500 line-through"
                                                            : "text-gray-900"
                                                    }`}
                                                >
                                                    {message.name}
                                                </td>
                                                <td
                                                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                                                        message.is_suspended
                                                            ? "text-gray-500 line-through"
                                                            : "text-gray-600"
                                                    }`}
                                                >
                                                    {message.email}
                                                </td>
                                                <td
                                                    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate ${
                                                        message.is_suspended
                                                            ? "line-through"
                                                            : ""
                                                    }`}
                                                >
                                                    {message.subject}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {message.is_suspended ? (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                            Suspended
                                                        </span>
                                                    ) : message.is_replied ? (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            Replied
                                                        </span>
                                                    ) : message.is_read ? (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                            Read
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                            New
                                                        </span>
                                                    )}
                                                </td>
                                                <td
                                                    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${
                                                        message.is_suspended
                                                            ? "line-through"
                                                            : ""
                                                    }`}
                                                >
                                                    {new Date(
                                                        message.created_at
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                                    <Link
                                                        href={route(
                                                            "admin.contacts.show",
                                                            message.id
                                                        )}
                                                        className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                                                    >
                                                        View
                                                    </Link>
                                                    {/* <button
                                                        onClick={() =>
                                                            toggleSuspension(
                                                                message.id,
                                                                message.is_suspended
                                                            )
                                                        }
                                                        className={`${
                                                            message.is_suspended
                                                                ? "text-green-600 hover:text-green-900"
                                                                : "text-red-600 hover:text-red-900"
                                                        } transition-colors duration-200`}
                                                    >
                                                        {message.is_suspended
                                                            ? "Unsuspend"
                                                            : "Suspend"}
                                                    </button> */}
                                                    {/* {message.user_id && (
                                                        <button
                                                            onClick={() =>
                                                                suspendUser(
                                                                    message.user_id
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                                                        >
                                                            Suspend User
                                                        </button>
                                                    )} */}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {messages.links && (
                                <div className="mt-6">
                                    <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                                        <div className="text-sm text-gray-600">
                                            Showing{" "}
                                            <span className="font-medium">
                                                {messages.from}
                                            </span>{" "}
                                            to{" "}
                                            <span className="font-medium">
                                                {messages.to}
                                            </span>{" "}
                                            of{" "}
                                            <span className="font-medium">
                                                {messages.total}
                                            </span>{" "}
                                            messages
                                        </div>
                                        <div className="flex flex-wrap justify-center gap-1">
                                            {messages.links.map(
                                                (link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url || "#"}
                                                        preserveScroll
                                                        className={`px-3 py-1 rounded-md text-sm ${
                                                            link.active
                                                                ? "bg-blue-500 text-white"
                                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                        } ${
                                                            !link.url
                                                                ? "opacity-50 cursor-not-allowed"
                                                                : ""
                                                        }`}
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                    />
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
