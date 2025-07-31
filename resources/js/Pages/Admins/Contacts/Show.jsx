import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function ContactMessageShow({ message }) {
    const { data, setData, post, processing, errors } = useForm({
        reply_subject: `Re: ${message.subject}`,
        reply_message: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.contacts.reply", message.id));
    };

    return (
        <AdminLayout>
            <Head title={`Message from ${message.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Message from {message.name}
                                    </h1>
                                    <p className="text-gray-600">
                                        {message.email}
                                    </p>
                                    <p className="text-gray-500 text-sm mt-1">
                                        Received on{" "}
                                        {new Date(
                                            message.created_at
                                        ).toLocaleString()}
                                    </p>
                                </div>
                                <Link
                                    href={route("admin.contacts.index")}
                                    className="text-blue-600 hover:text-blue-900"
                                >
                                    Back to Messages
                                </Link>
                            </div>

                            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                                    {message.subject}
                                </h2>
                                <p className="text-gray-700 whitespace-pre-line">
                                    {message.message}
                                </p>
                            </div>

                            {message.is_replied ? (
                                <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            Your Reply
                                        </h2>
                                        <span className="text-sm text-gray-500">
                                            Replied on{" "}
                                            {new Date(
                                                message.replied_at
                                            ).toLocaleString()}{" "}
                                            by {message.admin?.name}
                                        </span>
                                    </div>
                                    <h3 className="text-md font-medium text-gray-800 mb-1">
                                        {message.reply_subject}
                                    </h3>
                                    <p className="text-gray-700 whitespace-pre-line">
                                        {message.reply_message}
                                    </p>
                                </div>
                            ) : (
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label
                                            htmlFor="reply_subject"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            id="reply_subject"
                                            value={data.reply_subject}
                                            onChange={(e) =>
                                                setData(
                                                    "reply_subject",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.reply_subject && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.reply_subject}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="reply_message"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Your Reply
                                        </label>
                                        <textarea
                                            id="reply_message"
                                            rows="6"
                                            value={data.reply_message}
                                            onChange={(e) =>
                                                setData(
                                                    "reply_message",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        ></textarea>
                                        {errors.reply_message && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.reply_message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                        >
                                            {processing
                                                ? "Sending..."
                                                : "Send Reply"}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
