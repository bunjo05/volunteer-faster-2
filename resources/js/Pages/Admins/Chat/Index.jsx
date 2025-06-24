import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import {
    MessageSquare,
    User,
    ArrowLeft,
    Send,
    Search,
    MoreVertical,
} from "lucide-react";

export default function AdminChatIndex({
    chats: initialChats,
    requests: initialRequests,
}) {
    const { auth } = usePage().props;
    const [showConversations, setShowConversations] = useState(false);
    const [selectedChat, setSelectedChat] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [isReplying, setIsReplying] = useState(false);
    const [replyToMessage, setReplyToMessage] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [chats, setChats] = useState(initialChats || []);
    const [requests, setRequests] = useState(initialRequests || []);
    const [activeTab, setActiveTab] = useState("chats"); // 'chats' or 'requests'
    const messagesEndRef = useRef(null);
    const messageRefs = useRef({});

    useEffect(() => {
        const allConversations = [...chats, ...requests];
        if (allConversations.length > 0 && !selectedChat) {
            setSelectedChat({
                ...allConversations[0],
                messages: allConversations[0].messages || [],
            });
        }

        // Setup Echo listener for all chats
        if (window.Echo) {
            allConversations.forEach((chat) => {
                window.Echo.private(`chat.${chat.id}`).listen(
                    "NewChatMessage",
                    (e) => {
                        // Update the selected chat if it's the current one
                        if (selectedChat && selectedChat.id === e.chatId) {
                            setSelectedChat((prev) => ({
                                ...prev,
                                messages: [...(prev.messages || []), e.message],
                            }));
                        }

                        // Update the appropriate list (chats or requests)
                        const updateList = (list) =>
                            list.map((c) => {
                                if (c.id === e.chatId) {
                                    return {
                                        ...c,
                                        latestMessage: {
                                            message: e.message.content,
                                            created_at: e.message.created_at,
                                        },
                                        unreadCount:
                                            e.message.sender_type ===
                                            "App\\Models\\User"
                                                ? (c.unreadCount || 0) + 1
                                                : c.unreadCount,
                                    };
                                }
                                return c;
                            });

                        setChats(updateList(chats));
                        setRequests(updateList(requests));

                        // Scroll to bottom if this is the active chat
                        if (selectedChat && selectedChat.id === e.chatId) {
                            setTimeout(() => {
                                messagesEndRef.current?.scrollIntoView({
                                    behavior: "smooth",
                                });
                            }, 100);
                        }
                    }
                );
            });

            return () => {
                allConversations.forEach((chat) => {
                    window.Echo.private(`chat.${chat.id}`).stopListening(
                        "NewChatMessage"
                    );
                });
            };
        }
    }, [chats, requests, selectedChat]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [selectedChat?.messages]);

    const filteredChats = chats.filter(
        (chat) =>
            chat.user?.name
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            chat.latestMessage?.message
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase())
    );

    const filteredRequests = requests.filter(
        (request) =>
            request.user?.name
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            request.latestMessage?.message
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase())
    );

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat) return;

        try {
            // Optimistic update
            const tempId = Date.now();
            const newMsg = {
                id: tempId,
                message: newMessage,
                sender_id: auth.user.id,
                sender_type: "App\\Models\\Admin",
                created_at: new Date().toISOString(),
                status: "Sent",
                reply_to: replyToMessage?.id || null,
                original_message: replyToMessage || null,
                sender: {
                    id: auth.user.id,
                    name: auth.user.name,
                    email: auth.user.email,
                },
            };

            setSelectedChat((prev) => ({
                ...prev,
                messages: [...(prev.messages || []), newMsg],
                latestMessage: {
                    message: newMessage,
                    created_at: new Date().toISOString(),
                },
            }));

            setNewMessage("");
            setIsReplying(false);
            setReplyToMessage(null);

            // Send to server
            await router.post(
                route("admin.chat.store", selectedChat.id),
                {
                    content: newMessage,
                    reply_to: replyToMessage?.id || null,
                },
                {
                    preserveScroll: true,
                }
            );
        } catch (error) {
            console.error("Error sending message:", error);
            // Optionally revert optimistic update on error
        }
    };

    const handleReplyClick = (message) => {
        setIsReplying(true);
        setReplyToMessage(message);
    };

    const handleOriginalMessageClick = (messageId) => {
        messageRefs.current[messageId]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    };

    const acceptRequest = async (chatId) => {
        try {
            const response = await router.post(
                route("admin.chat.accept", chatId),
                {},
                {
                    preserveScroll: true,
                    onSuccess: (response) => {
                        const acceptedRequest = requests.find(
                            (r) => r.id === chatId
                        );
                        if (acceptedRequest) {
                            setRequests(
                                requests.filter((r) => r.id !== chatId)
                            );
                            setChats([
                                ...chats,
                                {
                                    ...acceptedRequest,
                                    status: "active",
                                },
                            ]);
                        }
                    },
                    onError: (errors) => {
                        if (errors?.response?.status === 409) {
                            // Chat already assigned - move to chats
                            const existingRequest = requests.find(
                                (r) => r.id === chatId
                            );
                            if (existingRequest) {
                                setRequests(
                                    requests.filter((r) => r.id !== chatId)
                                );
                                setChats([...chats, existingRequest]);
                            }
                            return;
                        }
                        alert(
                            errors?.message ||
                                "An error occurred while accepting the chat"
                        );
                    },
                }
            );
        } catch (error) {
            console.error("Chat acceptance error:", error);
            alert(error.message || "An unexpected error occurred");
        }
    };

    return (
        <AdminLayout>
            <Head title="Volunteer Chats" />

            <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-xl shadow overflow-hidden">
                    {/* Conversations List - Sidebar */}
                    <div
                        className={`${
                            showConversations
                                ? "block fixed inset-0 z-10 bg-black bg-opacity-50 md:bg-opacity-0"
                                : "hidden"
                        } md:block md:relative`}
                    >
                        <div
                            className={`absolute md:relative left-0 top-0 h-full w-full md:w-80 bg-white shadow-lg md:shadow-none z-20 transform ${
                                showConversations
                                    ? "translate-x-0"
                                    : "-translate-x-full"
                            } md:translate-x-0 transition-transform duration-300 ease-in-out border-r border-gray-200`}
                        >
                            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Volunteer Chats
                                </h2>
                                <div className="mt-3 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        placeholder="Search chats..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-gray-200">
                                <button
                                    className={`flex-1 py-3 px-4 text-center text-sm font-medium ${
                                        activeTab === "chats"
                                            ? "text-blue-600 border-b-2 border-blue-500"
                                            : "text-gray-500 hover:text-gray-700"
                                    }`}
                                    onClick={() => setActiveTab("chats")}
                                >
                                    Chats
                                </button>
                                <button
                                    className={`flex-1 py-3 px-4 text-center text-sm font-medium ${
                                        activeTab === "requests"
                                            ? "text-blue-600 border-b-2 border-blue-500"
                                            : "text-gray-500 hover:text-gray-700"
                                    }`}
                                    onClick={() => setActiveTab("requests")}
                                >
                                    Requests
                                    {requests.length > 0 && (
                                        <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                            {requests.length}
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* Chat List */}
                            <ul className="divide-y divide-gray-200 max-h-[70vh] overflow-y-auto">
                                {activeTab === "chats" ? (
                                    filteredChats?.length > 0 ? (
                                        filteredChats.map((chat) => {
                                            const previewText = chat
                                                .latestMessage?.message
                                                ? chat.latestMessage.message
                                                      .length > 30
                                                    ? `${chat.latestMessage.message.substring(
                                                          0,
                                                          30
                                                      )}...`
                                                    : chat.latestMessage.message
                                                : "No messages yet";

                                            return (
                                                <li
                                                    key={chat.id}
                                                    className={`py-3 px-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                                                        selectedChat?.id ===
                                                        chat.id
                                                            ? "bg-blue-50 border-l-4 border-blue-500"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        setSelectedChat({
                                                            ...chat,
                                                            messages:
                                                                chat.messages ||
                                                                [],
                                                        })
                                                    }
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center min-w-0">
                                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                                                                {chat.user?.name?.charAt(
                                                                    0
                                                                ) || "V"}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                                    {chat.user
                                                                        ?.name ||
                                                                        "Unknown Volunteer"}
                                                                </p>
                                                                <p className="text-xs text-gray-500 truncate">
                                                                    {
                                                                        previewText
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center">
                                                            {chat.unreadCount >
                                                                0 && (
                                                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full mr-2">
                                                                    {
                                                                        chat.unreadCount
                                                                    }
                                                                </span>
                                                            )}
                                                            <button className="text-gray-400 hover:text-gray-600">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })
                                    ) : (
                                        <li className="py-4 px-4 text-center">
                                            <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-500 text-sm">
                                                {searchQuery
                                                    ? "No matching chats found"
                                                    : "No active chats"}
                                            </p>
                                        </li>
                                    )
                                ) : // Requests Tab Content
                                filteredRequests?.length > 0 ? (
                                    filteredRequests.map((request) => {
                                        const previewText = request
                                            .latestMessage?.message
                                            ? request.latestMessage.message
                                                  .length > 30
                                                ? `${request.latestMessage.message.substring(
                                                      0,
                                                      30
                                                  )}...`
                                                : request.latestMessage.message
                                            : "No messages yet";

                                        return (
                                            <li
                                                key={request.id}
                                                className={`py-3 px-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                                                    selectedChat?.id ===
                                                    request.id
                                                        ? "bg-blue-50 border-l-4 border-blue-500"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    setSelectedChat({
                                                        ...request,
                                                        messages:
                                                            request.messages ||
                                                            [],
                                                    })
                                                }
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center min-w-0">
                                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                                                            {request.user?.name?.charAt(
                                                                0
                                                            ) || "V"}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                {request.user
                                                                    ?.name ||
                                                                    "Unknown Volunteer"}
                                                            </p>
                                                            <p className="text-xs text-gray-500 truncate">
                                                                {previewText}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                acceptRequest(
                                                                    request.id
                                                                );
                                                            }}
                                                            className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                                        >
                                                            Accept
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })
                                ) : (
                                    <li className="py-4 px-4 text-center">
                                        <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-500 text-sm">
                                            {searchQuery
                                                ? "No matching requests found"
                                                : "No pending requests"}
                                        </p>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Rest of the chat interface remains the same */}
                    {/* Chat Interface - Main Content */}
                    <div className="col-span-2 flex flex-col">
                        {selectedChat ? (
                            <>
                                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <button
                                            onClick={() =>
                                                setShowConversations(true)
                                            }
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
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                                            {selectedChat.user?.name?.charAt(
                                                0
                                            ) || "V"}
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">
                                                {selectedChat.user?.name ||
                                                    "Unknown Volunteer"}
                                            </h2>
                                            <p className="text-xs text-gray-500">
                                                {selectedChat.user?.email ||
                                                    "No email provided"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="p-2 rounded-full hover:bg-gray-200 text-gray-600">
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
                                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                />
                                            </svg>
                                        </button>
                                        <button className="p-2 rounded-full hover:bg-gray-200 text-gray-600">
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
                                                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </button>
                                        <button className="p-2 rounded-full hover:bg-gray-200 text-gray-600">
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
                                                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 p-4 overflow-y-auto max-h-[60vh]">
                                    <div className="space-y-4">
                                        {(selectedChat.messages || []).map(
                                            (message) => (
                                                <div
                                                    key={message.id}
                                                    ref={(el) =>
                                                        (messageRefs.current[
                                                            message.id
                                                        ] = el)
                                                    }
                                                    className={`flex ${
                                                        message.sender_id ===
                                                        auth.user.id
                                                            ? "justify-end"
                                                            : "justify-start"
                                                    }`}
                                                >
                                                    <div
                                                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                                                            message.sender_id ===
                                                            auth.user.id
                                                                ? "bg-blue-500 text-white"
                                                                : "bg-white border border-gray-200"
                                                        }`}
                                                    >
                                                        {message.original_message && (
                                                            <div
                                                                className={`mb-2 p-2 rounded text-xs cursor-pointer ${
                                                                    message.sender_id ===
                                                                    auth.user.id
                                                                        ? "bg-blue-600"
                                                                        : "bg-blue-50"
                                                                }`}
                                                                onClick={() =>
                                                                    handleOriginalMessageClick(
                                                                        message
                                                                            .original_message
                                                                            .id
                                                                    )
                                                                }
                                                            >
                                                                <div className="flex items-start">
                                                                    <svg
                                                                        className={`w-3 h-3 mt-0.5 mr-2 flex-shrink-0 ${
                                                                            message.sender_id ===
                                                                            auth
                                                                                .user
                                                                                .id
                                                                                ? "text-blue-200"
                                                                                : "text-blue-500"
                                                                        }`}
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={
                                                                                2
                                                                            }
                                                                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                                                        />
                                                                    </svg>
                                                                    <div className="flex-1">
                                                                        <p
                                                                            className={`text-xs font-medium mb-1 ${
                                                                                message.sender_id ===
                                                                                auth
                                                                                    .user
                                                                                    .id
                                                                                    ? "text-blue-200"
                                                                                    : "text-blue-700"
                                                                            }`}
                                                                        >
                                                                            Replying
                                                                            to{" "}
                                                                            {message
                                                                                .original_message
                                                                                .sender_id ===
                                                                            auth
                                                                                .user
                                                                                .id
                                                                                ? "your message"
                                                                                : selectedChat
                                                                                      .user
                                                                                      ?.name}
                                                                        </p>
                                                                        <p
                                                                            className={`text-xs ${
                                                                                message.sender_id ===
                                                                                auth
                                                                                    .user
                                                                                    .id
                                                                                    ? "text-blue-100"
                                                                                    : "text-gray-600"
                                                                            } line-clamp-2`}
                                                                        >
                                                                            {
                                                                                message
                                                                                    .original_message
                                                                                    .message
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <p
                                                            className={`text-sm ${
                                                                message.sender_id ===
                                                                auth.user.id
                                                                    ? "text-white"
                                                                    : "text-gray-800"
                                                            }`}
                                                        >
                                                            {message.message}
                                                        </p>
                                                        <div
                                                            className={`flex justify-between items-center mt-1 ${
                                                                message.sender_id ===
                                                                auth.user.id
                                                                    ? "text-blue-100"
                                                                    : "text-gray-500"
                                                            }`}
                                                        >
                                                            {message.sender_id !==
                                                                auth.user
                                                                    .id && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleReplyClick(
                                                                            message
                                                                        )
                                                                    }
                                                                    className="text-xs hover:underline"
                                                                >
                                                                    Reply
                                                                </button>
                                                            )}
                                                            <p className="text-[9px]">
                                                                {new Date(
                                                                    message.created_at
                                                                ).toLocaleTimeString(
                                                                    [],
                                                                    {
                                                                        hour: "2-digit",
                                                                        minute: "2-digit",
                                                                    }
                                                                )}
                                                            </p>
                                                            <p>
                                                                {message.sender_id ===
                                                                    auth.user
                                                                        .id && (
                                                                    <span
                                                                        className={`text-[9px] ${
                                                                            message.status ===
                                                                            "Read"
                                                                                ? "text-blue-300"
                                                                                : "text-blue-200"
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
                                                                            <span>
                                                                                ✓
                                                                            </span>
                                                                        )}
                                                                    </span>
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </div>

                                <div className="p-4 border-t border-gray-200 bg-white">
                                    {isReplying && (
                                        <div className="mb-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
                                            <div className="flex justify-between items-center">
                                                <p className="text-sm text-blue-800 font-medium">
                                                    Replying to:{" "}
                                                    {replyToMessage.sender_id ===
                                                    auth.user.id
                                                        ? "your message"
                                                        : selectedChat.user
                                                              ?.name}
                                                </p>
                                                <button
                                                    onClick={() => {
                                                        setIsReplying(false);
                                                        setReplyToMessage(null);
                                                    }}
                                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
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
                                            value={newMessage}
                                            onChange={(e) =>
                                                setNewMessage(e.target.value)
                                            }
                                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                                            placeholder={
                                                isReplying
                                                    ? `Reply to ${
                                                          replyToMessage.sender_id ===
                                                          auth.user.id
                                                              ? "your message"
                                                              : selectedChat
                                                                    .user?.name
                                                      }...`
                                                    : "Type your message..."
                                            }
                                        />
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md flex items-center justify-center"
                                        >
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-12 bg-gray-50">
                                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md text-center">
                                    <MessageSquare className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No conversation selected
                                    </h3>
                                    <p className="text-gray-500 mb-6">
                                        Choose a chat from the sidebar to start
                                        messaging or search for a volunteer.
                                    </p>
                                    <button
                                        onClick={() =>
                                            setShowConversations(true)
                                        }
                                        className="md:hidden px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                    >
                                        Browse Conversations
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
