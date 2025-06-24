// resources/js/Pages/Admin/Chat/Show.jsx
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send } from "lucide-react";

export default function AdminChatShow({ chat, volunteer, messages }) {
    const { auth } = usePage().props;
    const [newMessages, setNewMessages] = useState([]);
    const [isReplying, setIsReplying] = useState(false);
    const [replyToMessage, setReplyToMessage] = useState(null);
    const [highlightedMessageId, setHighlightedMessageId] = useState(null);
    const [showConversations, setShowConversations] = useState(false);
    const messageRefs = useRef({});
    const messagesEndRef = useRef(null);

    const { data, setData, post, processing, reset } = useForm({
        content: "",
        reply_to: null,
    });

    useEffect(() => {
        scrollToBottom();

        // Set up Echo listener for new messages
        if (window.Echo) {
            window.Echo.private(`chat.${chat.id}`).listen(
                "NewChatMessage",
                (e) => {
                    const newMessage = {
                        ...e.message,
                        is_admin:
                            e.message.sender_type === "App\\Models\\Admin",
                        sender:
                            e.message.sender_type === "App\\Models\\Admin"
                                ? auth.user
                                : volunteer,
                    };
                    setNewMessages((prev) => [...prev, newMessage]);
                    scrollToBottom();
                }
            );
        }

        return () => {
            if (window.Echo) {
                window.Echo.private(`chat.${chat.id}`).stopListening(
                    "NewChatMessage"
                );
            }
        };
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, newMessages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleReplyClick = (message) => {
        setIsReplying(true);
        setReplyToMessage(message);
        setData("reply_to", message.id);
    };

    const handleOriginalMessageClick = (messageId) => {
        setHighlightedMessageId(messageId);
        messageRefs.current[messageId]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    };

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (!data.content.trim()) return;

        post(route("admin.chats.store", chat.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsReplying(false);
                setReplyToMessage(null);
            },
        });
    };

    const allMessages = [...messages, ...newMessages].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );

    return (
        <AdminLayout>
            <Head title={`Chat with ${volunteer.name}`} />

            <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-xl shadow overflow-hidden">
                    {/* Conversations List */}
                    <div
                        className={`${
                            showConversations
                                ? "block fixed inset-0 z-10 bg-black bg-opacity-50 md:bg-opacity-0"
                                : "hidden"
                        } md:block md:relative`}
                    >
                        <div
                            className={`absolute md:relative left-0 top-0 h-full w-80 bg-white shadow-lg md:shadow-none z-20 transform ${
                                showConversations
                                    ? "translate-x-0"
                                    : "-translate-x-full"
                            } md:translate-x-0 transition-transform duration-300 ease-in-out border-r border-gray-200`}
                        >
                            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                                <h2 className="text-lg font-semibold">
                                    Volunteer Chats
                                </h2>
                                <button
                                    onClick={() => setShowConversations(false)}
                                    className="md:hidden p-1 rounded-full hover:bg-gray-200"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <ul className="divide-y divide-gray-200 max-h-[70vh] overflow-y-auto">
                                {usePage().props.chats.map((c) => {
                                    const previewText = c.latestMessage?.message
                                        ? c.latestMessage.message.length > 30
                                            ? `${c.latestMessage.message.substring(
                                                  0,
                                                  30
                                              )}...`
                                            : c.latestMessage.message
                                        : "No messages yet";

                                    return (
                                        <li key={c.id}>
                                            <Link
                                                href={route(
                                                    "admin.chats.show",
                                                    c.id
                                                )}
                                                className={`block py-3 px-4 hover:bg-gray-50 transition-colors ${
                                                    chat.id === c.id
                                                        ? "bg-blue-50 border-l-4 border-blue-500"
                                                        : ""
                                                }`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center min-w-0">
                                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                                                            {c.user?.name?.charAt(
                                                                0
                                                            ) || "V"}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                {c.user?.name ||
                                                                    "Unknown Volunteer"}
                                                            </p>
                                                            <p className="text-xs text-gray-500 truncate">
                                                                {previewText}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {c.unreadCount > 0 && (
                                                        <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                                                            {c.unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    {/* Chat Interface */}
                    <div className="col-span-2 flex flex-col">
                        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center">
                            <button
                                onClick={() => setShowConversations(true)}
                                className="md:hidden mr-2 p-1 rounded-full hover:bg-gray-200"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                                {volunteer.name?.charAt(0) || "V"}
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {volunteer.name}
                                </h2>
                            </div>
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto max-h-[60vh]">
                            <div className="space-y-4">
                                {allMessages.map((message) => (
                                    <div
                                        key={message.id}
                                        ref={(el) =>
                                            (messageRefs.current[message.id] =
                                                el)
                                        }
                                        className={`flex ${
                                            message.is_admin
                                                ? "justify-end"
                                                : "justify-start"
                                        }`}
                                    >
                                        <div
                                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg transition-all duration-300 ${
                                                message.is_admin
                                                    ? "bg-blue-100"
                                                    : "bg-gray-100"
                                            } ${
                                                highlightedMessageId ===
                                                message.id
                                                    ? "ring-2 ring-blue-500 scale-[1.02]"
                                                    : ""
                                            }`}
                                        >
                                            {message.reply_to && (
                                                <div
                                                    className="mb-2 p-2 bg-blue-50 rounded text-xs cursor-pointer hover:bg-blue-100 transition-colors"
                                                    onClick={() =>
                                                        handleOriginalMessageClick(
                                                            message.reply_to
                                                        )
                                                    }
                                                >
                                                    <div className="flex items-start">
                                                        <svg
                                                            className="w-3 h-3 text-blue-500 mt-0.5 mr-2 flex-shrink-0"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                                            />
                                                        </svg>
                                                        <div className="flex-1">
                                                            <p className="text-xs font-medium text-blue-700 mb-1">
                                                                Replying to{" "}
                                                                {message
                                                                    .reply_to
                                                                    ?.is_admin
                                                                    ? "your message"
                                                                    : volunteer.name}
                                                            </p>
                                                            <p className="text-xs text-gray-600 line-clamp-2">
                                                                {
                                                                    message
                                                                        .reply_to
                                                                        ?.message
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <p className="text-sm text-gray-800">
                                                {message.message}
                                            </p>
                                            <div className="flex justify-between items-center mt-1">
                                                {!message.is_admin && (
                                                    <button
                                                        onClick={() =>
                                                            handleReplyClick(
                                                                message
                                                            )
                                                        }
                                                        className="text-xs text-gray-500 hover:text-blue-500"
                                                    >
                                                        Reply
                                                    </button>
                                                )}
                                                <p className="text-[9px] text-gray-500 text-right">
                                                    {new Date(
                                                        message.created_at
                                                    ).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>
                                                <p>
                                                    {message.is_admin && (
                                                        <span
                                                            className={`text-[9px] ${
                                                                message.status ===
                                                                "Read"
                                                                    ? "text-blue-500"
                                                                    : "text-gray-400"
                                                            }`}
                                                        >
                                                            {message.status ===
                                                            "Read" ? (
                                                                <span className="flex">
                                                                    <span>
                                                                        ✓
                                                                    </span>
                                                                    <span>
                                                                        ✓
                                                                    </span>
                                                                </span>
                                                            ) : (
                                                                <span>✓</span>
                                                            )}
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-200">
                            {isReplying && (
                                <div className="mb-2 p-2 bg-blue-50 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-blue-800">
                                            Replying to:{" "}
                                            {replyToMessage.is_admin
                                                ? "your message"
                                                : volunteer.name}
                                        </p>
                                        <button
                                            onClick={() => {
                                                setIsReplying(false);
                                                setReplyToMessage(null);
                                                setData("reply_to", null);
                                            }}
                                            className="text-xs text-blue-600 hover:text-blue-800"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-600 truncate">
                                        {replyToMessage.message}
                                    </p>
                                </div>
                            )}
                            <form
                                onSubmit={handleSendMessage}
                                className="flex gap-2"
                            >
                                <input
                                    type="text"
                                    value={data.content}
                                    onChange={(e) =>
                                        setData("content", e.target.value)
                                    }
                                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={
                                        isReplying
                                            ? `Reply to ${
                                                  replyToMessage.is_admin
                                                      ? "your message"
                                                      : volunteer.name
                                              }...`
                                            : "Type your message..."
                                    }
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={processing}
                                >
                                    {isReplying ? "Reply" : "Send"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
