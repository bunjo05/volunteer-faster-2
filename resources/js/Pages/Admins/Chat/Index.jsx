import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { useState, useRef, useEffect, useCallback } from "react";
import {
    MessageSquare,
    User,
    ArrowLeft,
    Send,
    Search,
    MoreVertical,
    Menu,
    X,
} from "lucide-react";
import axios from "axios";

export default function AdminChatIndex({
    chats: initialChats,
    requests: initialRequests,
    endedChats: initialEndedChats,
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
    const [endedChats, setEndedChats] = useState(initialEndedChats || []);
    const [activeTab, setActiveTab] = useState("chats");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const messagesEndRef = useRef(null);
    const messageRefs = useRef({});
    const pollingInterval = useRef(null);
    const selectedChatIdRef = useRef(null);
    const isUpdatingSelectedChatRef = useRef(false);

    // Check if message is from admin
    const isAdminMessage = (message) => {
        return (
            message?.sender_type === "App\\Models\\Admin" ||
            message?.sender_type === "App\\Models\\Admin"
        );
    };

    // Check if message is from current admin user
    const isCurrentAdminMessage = (message) => {
        return isAdminMessage(message) && message?.sender_id === auth.user.id;
    };

    // Manual refresh function for sidebar
    const refreshSidebar = useCallback(async () => {
        try {
            const response = await axios.get(route("chat.index"));
            const {
                chats: updatedChats = [],
                requests: updatedRequests = [],
                endedChats: updatedEndedChats = [],
            } = response.data;

            // Update sidebar states
            setChats(updatedChats);
            setRequests(updatedRequests);
            setEndedChats(updatedEndedChats);
        } catch (error) {
            console.error("Error refreshing sidebar:", error);
        }
    }, []);

    // Silent polling function - ONLY updates selected chat messages, not sidebar
    const pollForUpdates = useCallback(async () => {
        if (!auth.user || isUpdatingSelectedChatRef.current) return;

        const currentSelectedChatId = selectedChatIdRef.current;
        if (!currentSelectedChatId) return;

        try {
            isUpdatingSelectedChatRef.current = true;

            // Fetch updated messages specifically for the selected chat
            const response = await axios.get(
                `/admin/chats/${currentSelectedChatId}/messages`
            );
            const updatedMessages = response.data.messages || [];

            setSelectedChat((prev) => {
                if (!prev) return prev;

                // Check if messages actually changed
                const prevMessages = prev.messages || [];

                const messagesChanged =
                    prevMessages.length !== updatedMessages.length ||
                    JSON.stringify(prevMessages.map((m) => m.id)) !==
                        JSON.stringify(updatedMessages.map((m) => m.id));

                if (messagesChanged) {
                    // Preserve optimistic messages that are still sending or failed
                    const optimisticMessages = prevMessages.filter(
                        (msg) =>
                            msg.status === "Sending" || msg.status === "Failed"
                    );

                    // Merge optimistic messages with new messages
                    const mergedMessages = [
                        ...updatedMessages.filter(
                            (msg) =>
                                !optimisticMessages.some(
                                    (om) =>
                                        om.temp_id && om.temp_id === msg.temp_id
                                )
                        ),
                        ...optimisticMessages,
                    ].sort(
                        (a, b) =>
                            new Date(a.created_at) - new Date(b.created_at)
                    );

                    // Return updated chat with ONLY messages changed, preserve everything else
                    return {
                        ...prev, // Keep all existing properties
                        messages: mergedMessages, // Only update messages
                    };
                }

                // If no message changes, don't update anything
                return prev;
            });
        } catch (error) {
            console.error("Silent polling error:", error);
            // Don't show error to user for silent polling
        } finally {
            isUpdatingSelectedChatRef.current = false;
        }
    }, [auth.user]);

    // Start/stop polling based on selected chat
    useEffect(() => {
        const currentSelectedChatId = selectedChatIdRef.current;

        if (currentSelectedChatId) {
            // Start polling immediately when a chat is selected
            pollForUpdates();

            // Set up interval for polling (every 3 seconds for faster updates)
            pollingInterval.current = setInterval(pollForUpdates, 3000);

            return () => {
                if (pollingInterval.current) {
                    clearInterval(pollingInterval.current);
                    pollingInterval.current = null;
                }
            };
        } else {
            // Clear polling if no chat is selected
            if (pollingInterval.current) {
                clearInterval(pollingInterval.current);
                pollingInterval.current = null;
            }
        }
    }, [selectedChat?.id, pollForUpdates]);

    // Track selected chat ID separately
    useEffect(() => {
        selectedChatIdRef.current = selectedChat?.id || null;
    }, [selectedChat]);

    // Close sidebar when chat is selected on mobile
    useEffect(() => {
        if (selectedChat && window.innerWidth < 768) {
            setShowConversations(false);
        }
    }, [selectedChat]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
        });
    }, [selectedChat?.messages]);

    // Fixed filter functions with proper null checks
    const filteredChats = (chats || []).filter(
        (chat) =>
            chat?.user?.name
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            chat?.latestMessage?.message
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase())
    );

    const filteredRequests = (requests || []).filter(
        (request) =>
            request?.user?.name
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            request?.latestMessage?.message
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase())
    );

    const filteredEndedChats = (endedChats || []).filter(
        (chat) =>
            chat?.user?.name
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            chat?.latestMessage?.message
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase())
    );

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (
            !newMessage.trim() ||
            !selectedChat ||
            selectedChat.status === "ended"
        )
            return;

        const tempId = Date.now();
        const newMsg = {
            id: tempId,
            message: newMessage,
            sender_id: auth.user.id,
            sender_type: "App\\Models\\Admin",
            created_at: new Date().toISOString(),
            status: "Sending",
            reply_to: replyToMessage?.id || null,
            original_message: replyToMessage || null,
            sender: {
                id: auth.user.id,
                name: auth.user.name,
                email: auth.user.email,
            },
            temp_id: tempId,
        };

        // Optimistic update - only update messages
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

        try {
            await router.post(
                route("admin.chat.store", selectedChat.id),
                {
                    content: newMessage,
                    reply_to: replyToMessage?.id || null,
                    temp_id: tempId,
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setSuccessMessage("Message sent successfully");
                        setTimeout(() => setSuccessMessage(null), 3000);
                        // Trigger immediate poll to get the real message
                        setTimeout(pollForUpdates, 1000);
                    },
                    onError: (errors) => {
                        // Update message status to failed
                        setSelectedChat((prev) => ({
                            ...prev,
                            messages: (prev.messages || []).map((m) =>
                                m.temp_id === tempId
                                    ? { ...m, status: "Failed" }
                                    : m
                            ),
                        }));
                        setError(errors?.message || "Failed to send message");
                    },
                }
            );
        } catch (error) {
            console.error("Error sending message:", error);
            setSelectedChat((prev) => ({
                ...prev,
                messages: (prev.messages || []).map((m) =>
                    m.temp_id === tempId ? { ...m, status: "Failed" } : m
                ),
            }));
            setError(error.message || "Failed to send message");
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
            setLoading(true);
            setError(null);

            // Use axios instead of router.post for API calls
            const response = await axios.post(
                route("admin.chat.accept", chatId)
            );

            // If we get here, it means the page will reload due to Inertia redirect
            // So we don't need to update local state manually
        } catch (error) {
            console.error("Chat acceptance error:", error);

            // Handle 409 conflict - chat already assigned
            if (error.response?.status === 409) {
                // Refresh the entire sidebar to get updated data
                await refreshSidebar();

                // Try to find and select this chat if it's now in active chats
                const existingChat = [...chats, ...requests].find(
                    (chat) => chat.id === chatId
                );
                if (existingChat) {
                    handleChatSelect(existingChat);
                }
                return;
            }

            setError(
                error.response?.data?.message ||
                    error.message ||
                    "An error occurred while accepting the chat"
            );
        } finally {
            setLoading(false);
        }
    };
    const markChatAsRead = async (chatId) => {
        try {
            await axios.post(route("admin.chats.markAsRead", chatId));
            setChats((prevChats) =>
                (prevChats || []).map((chat) =>
                    chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
                )
            );
            setRequests((prevRequests) =>
                (prevRequests || []).map((request) =>
                    request.id === chatId
                        ? { ...request, unreadCount: 0 }
                        : request
                )
            );
        } catch (error) {
            console.error("Error marking chat as read:", error);
        }
    };

    const handleChatSelect = useCallback((chat) => {
        // Prevent selection if already selecting this chat
        if (selectedChatIdRef.current === chat.id) return;

        // Ensure we have all necessary properties
        const selectedChatData = {
            ...chat,
            messages: chat.messages || [],
            user: chat.user || { name: "Unknown User", email: "" },
            status: chat.status || "active",
        };

        setSelectedChat(selectedChatData);
        selectedChatIdRef.current = chat.id;

        // Mark as read when selecting a chat
        markChatAsRead(chat.id);
    }, []);

    const endChat = async () => {
        if (confirm("Are you sure you want to end this chat?")) {
            try {
                await router.post(route("admin.chats.end", selectedChat.id));

                // Update local state
                setSelectedChat((prev) => ({
                    ...prev,
                    status: "ended",
                }));

                setChats(
                    (chats || []).map((c) =>
                        c.id === selectedChat.id ? { ...c, status: "ended" } : c
                    )
                );

                setEndedChats([
                    ...(endedChats || []),
                    {
                        ...selectedChat,
                        status: "ended",
                    },
                ]);

                setSuccessMessage("Chat ended successfully");
                setTimeout(() => setSuccessMessage(null), 3000);

                // Refresh sidebar
                setTimeout(refreshSidebar, 1000);
            } catch (error) {
                console.error("Error ending chat:", error);
                setError("Failed to end chat");
            }
        }
    };

    // Calculate total unread count for badge
    const totalUnreadCount = [...chats, ...requests].reduce(
        (sum, item) => sum + (item.unreadCount || 0),
        0
    );

    return (
        <AdminLayout>
            <Head title="User Chats" />

            <div className="max-w-7xl mx-auto py-2 px-2 sm:px-4 lg:px-8">
                {/* Success Message */}
                {successMessage && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                        {successMessage}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                        <button
                            onClick={() => setError(null)}
                            className="float-right font-bold"
                        >
                            ×
                        </button>
                    </div>
                )}

                <div className="flex flex-col md:flex-row bg-white rounded-xl shadow overflow-hidden h-[calc(100vh-100px)] md:h-[calc(100vh-150px)]">
                    {/* Conversations List - Sidebar */}
                    <div
                        className={`${
                            showConversations
                                ? "fixed inset-0 z-20 bg-black bg-opacity-50 md:bg-opacity-0"
                                : "hidden"
                        } md:block md:relative`}
                    >
                        <div
                            className={`absolute md:relative left-0 top-0 h-full w-full md:w-80 bg-white shadow-lg md:shadow-none z-30 transform ${
                                showConversations
                                    ? "translate-x-0"
                                    : "-translate-x-full"
                            } md:translate-x-0 transition-transform duration-300 ease-in-out border-r border-gray-200 flex flex-col`}
                        >
                            {/* Mobile header */}
                            <div className="md:hidden p-3 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Conversations
                                    {totalUnreadCount > 0 && (
                                        <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                            {totalUnreadCount}
                                        </span>
                                    )}
                                </h2>
                                <button
                                    onClick={() => setShowConversations(false)}
                                    className="p-1 rounded-full hover:bg-gray-200"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
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
                                    {/* Refresh button for manual sidebar updates */}
                                    <button
                                        onClick={refreshSidebar}
                                        className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm flex items-center justify-center"
                                        title="Refresh chats"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                            />
                                        </svg>
                                    </button>
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
                                    {(requests || []).length > 0 && (
                                        <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                            {(requests || []).length}
                                        </span>
                                    )}
                                </button>
                                <button
                                    className={`flex-1 py-3 px-4 text-center text-sm font-medium ${
                                        activeTab === "ended"
                                            ? "text-blue-600 border-b-2 border-blue-500"
                                            : "text-gray-500 hover:text-gray-700"
                                    }`}
                                    onClick={() => setActiveTab("ended")}
                                >
                                    Ended Chats
                                </button>
                            </div>
                            {/* Chat List */}
                            <div className="flex-1 overflow-y-auto">
                                {activeTab === "chats" ? (
                                    filteredChats?.length > 0 ? (
                                        filteredChats.map((chat) => {
                                            const previewText = chat
                                                ?.latestMessage?.message
                                                ? chat.latestMessage.message
                                                      .length > 30
                                                    ? `${chat.latestMessage.message.substring(
                                                          0,
                                                          30
                                                      )}...`
                                                    : chat.latestMessage.message
                                                : "No messages yet";

                                            return (
                                                <div
                                                    key={chat.id}
                                                    className={`py-3 px-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                                                        selectedChat?.id ===
                                                        chat.id
                                                            ? "bg-blue-50 border-l-4 border-blue-500"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        handleChatSelect(chat)
                                                    }
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center min-w-0">
                                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                                                                {chat?.user?.name?.charAt(
                                                                    0
                                                                ) || "V"}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                                    {chat?.user
                                                                        ?.name ||
                                                                        "Unknown User"}
                                                                </p>
                                                                <p className="text-xs text-gray-500 truncate">
                                                                    {
                                                                        previewText
                                                                    }
                                                                </p>
                                                                <span
                                                                    className={`text-xs ${
                                                                        chat?.status ===
                                                                        "ended"
                                                                            ? "text-red-500"
                                                                            : chat?.status ===
                                                                              "active"
                                                                            ? "text-green-500"
                                                                            : "text-yellow-500"
                                                                    }`}
                                                                >
                                                                    {
                                                                        chat?.status
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center">
                                                            {(chat?.unreadCount ||
                                                                0) > 0 && (
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
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="py-4 px-4 text-center">
                                            <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-500 text-sm">
                                                {searchQuery
                                                    ? "No matching chats found"
                                                    : "No active chats"}
                                            </p>
                                        </div>
                                    )
                                ) : activeTab === "requests" ? (
                                    filteredRequests?.length > 0 ? (
                                        filteredRequests.map((request) => {
                                            const previewText = request
                                                ?.latestMessage?.message
                                                ? request.latestMessage.message
                                                      .length > 30
                                                    ? `${request.latestMessage.message.substring(
                                                          0,
                                                          30
                                                      )}...`
                                                    : request.latestMessage
                                                          .message
                                                : "No messages yet";

                                            return (
                                                <div
                                                    key={request.id}
                                                    className={`py-3 px-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                                                        selectedChat?.id ===
                                                        request.id
                                                            ? "bg-blue-50 border-l-4 border-blue-500"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        handleChatSelect(
                                                            request
                                                        )
                                                    }
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center min-w-0">
                                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                                                                {request?.user?.name?.charAt(
                                                                    0
                                                                ) || "V"}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                                    {request
                                                                        ?.user
                                                                        ?.name ||
                                                                        "Unknown User"}
                                                                </p>
                                                                <p className="text-xs text-gray-500 truncate">
                                                                    {
                                                                        previewText
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <button
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    acceptRequest(
                                                                        request.id
                                                                    );
                                                                }}
                                                                disabled={
                                                                    loading
                                                                }
                                                                className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
                                                            >
                                                                {loading
                                                                    ? "Accepting..."
                                                                    : "Accept"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="py-4 px-4 text-center">
                                            <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-500 text-sm">
                                                {searchQuery
                                                    ? "No matching requests found"
                                                    : "No pending requests"}
                                            </p>
                                        </div>
                                    )
                                ) : activeTab === "ended" ? (
                                    filteredEndedChats?.length > 0 ? (
                                        filteredEndedChats.map((chat) => {
                                            const previewText = chat
                                                ?.latestMessage?.message
                                                ? chat.latestMessage.message
                                                      .length > 30
                                                    ? `${chat.latestMessage.message.substring(
                                                          0,
                                                          30
                                                      )}...`
                                                    : chat.latestMessage.message
                                                : "No messages yet";

                                            return (
                                                <div
                                                    key={chat.id}
                                                    className={`py-3 px-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                                                        selectedChat?.id ===
                                                        chat.id
                                                            ? "bg-blue-50 border-l-4 border-blue-500"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        handleChatSelect(chat)
                                                    }
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center min-w-0">
                                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                                                                {chat?.user?.name?.charAt(
                                                                    0
                                                                ) || "V"}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                                    {chat?.user
                                                                        ?.name ||
                                                                        "Unknown User"}
                                                                </p>
                                                                <p className="text-xs text-gray-500 truncate">
                                                                    {
                                                                        previewText
                                                                    }
                                                                </p>
                                                                <span className="text-xs text-red-500">
                                                                    Ended
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <button className="text-gray-400 hover:text-gray-600">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="py-4 px-4 text-center">
                                            <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-500 text-sm">
                                                {searchQuery
                                                    ? "No matching ended chats found"
                                                    : "No ended chats"}
                                            </p>
                                        </div>
                                    )
                                ) : null}
                            </div>
                        </div>
                    </div>

                    {/* Chat Interface - Main Content */}
                    <div className="flex-1 flex flex-col border-l border-gray-200">
                        {selectedChat ? (
                            <>
                                <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <button
                                            onClick={() =>
                                                setShowConversations(true)
                                            }
                                            className="md:hidden mr-2 p-1 rounded-full hover:bg-gray-200"
                                        >
                                            <Menu className="w-5 h-5" />
                                        </button>
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                                            {selectedChat?.user?.name?.charAt(
                                                0
                                            ) || "V"}
                                        </div>
                                        <div className="min-w-0">
                                            <h2 className="text-lg font-semibold text-gray-900 truncate">
                                                {selectedChat?.user?.name ||
                                                    "Unknown User"}
                                            </h2>
                                            <p className="text-xs text-gray-500 truncate">
                                                {selectedChat?.user?.email ||
                                                    "No email provided"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={endChat}
                                            disabled={
                                                selectedChat?.status === "ended"
                                            }
                                            className={`px-3 py-1 rounded-lg text-sm ${
                                                selectedChat?.status === "ended"
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "bg-red-500 hover:bg-red-600 text-white"
                                            }`}
                                        >
                                            {selectedChat?.status === "ended"
                                                ? "Chat Ended"
                                                : "End Chat"}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 p-3 overflow-y-auto">
                                    <div className="space-y-3">
                                        {(selectedChat?.messages || []).map(
                                            (message) => (
                                                <div
                                                    key={
                                                        message.id ||
                                                        message.temp_id
                                                    }
                                                    ref={(el) =>
                                                        (messageRefs.current[
                                                            message.id ||
                                                                message.temp_id
                                                        ] = el)
                                                    }
                                                    className={`flex ${
                                                        isCurrentAdminMessage(
                                                            message
                                                        )
                                                            ? "justify-end"
                                                            : "justify-start"
                                                    }`}
                                                >
                                                    <div
                                                        className={`max-w-[80%] lg:max-w-md px-3 py-2 rounded-lg shadow-sm ${
                                                            isCurrentAdminMessage(
                                                                message
                                                            )
                                                                ? "bg-blue-500 text-white"
                                                                : "bg-white border border-gray-200"
                                                        } ${
                                                            message?.status ===
                                                            "Sending"
                                                                ? "opacity-70"
                                                                : message?.status ===
                                                                  "Failed"
                                                                ? "bg-red-100 border-red-300"
                                                                : ""
                                                        }`}
                                                    >
                                                        {message?.original_message && (
                                                            <div
                                                                className={`mb-2 p-2 rounded text-xs cursor-pointer ${
                                                                    isCurrentAdminMessage(
                                                                        message
                                                                    )
                                                                        ? "bg-blue-600"
                                                                        : "bg-blue-50"
                                                                }`}
                                                                onClick={() =>
                                                                    handleOriginalMessageClick(
                                                                        message
                                                                            ?.original_message
                                                                            ?.id
                                                                    )
                                                                }
                                                            >
                                                                <div className="flex items-start">
                                                                    <svg
                                                                        className={`w-3 h-3 mt-0.5 mr-2 flex-shrink-0 ${
                                                                            isCurrentAdminMessage(
                                                                                message
                                                                            )
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
                                                                                isCurrentAdminMessage(
                                                                                    message
                                                                                )
                                                                                    ? "text-blue-200"
                                                                                    : "text-blue-700"
                                                                            }`}
                                                                        >
                                                                            Replying
                                                                            to{" "}
                                                                            {isAdminMessage(
                                                                                message?.original_message
                                                                            )
                                                                                ? "admin"
                                                                                : selectedChat
                                                                                      ?.user
                                                                                      ?.name}
                                                                        </p>
                                                                        <p
                                                                            className={`text-xs ${
                                                                                isCurrentAdminMessage(
                                                                                    message
                                                                                )
                                                                                    ? "text-blue-100"
                                                                                    : "text-gray-600"
                                                                            } line-clamp-2`}
                                                                        >
                                                                            {
                                                                                message
                                                                                    ?.original_message
                                                                                    ?.message
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <p
                                                            className={`text-sm ${
                                                                isCurrentAdminMessage(
                                                                    message
                                                                )
                                                                    ? "text-white"
                                                                    : "text-gray-800"
                                                            }`}
                                                        >
                                                            {message?.message}
                                                        </p>
                                                        <div
                                                            className={`flex justify-between items-center mt-1 ${
                                                                isCurrentAdminMessage(
                                                                    message
                                                                )
                                                                    ? "text-blue-100"
                                                                    : "text-gray-500"
                                                            }`}
                                                        >
                                                            {!isCurrentAdminMessage(
                                                                message
                                                            ) && (
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
                                                                    message?.created_at
                                                                ).toLocaleTimeString(
                                                                    [],
                                                                    {
                                                                        hour: "2-digit",
                                                                        minute: "2-digit",
                                                                    }
                                                                )}
                                                                {message?.status ===
                                                                    "Sending" &&
                                                                    " • Sending..."}
                                                                {message?.status ===
                                                                    "Failed" &&
                                                                    " • Failed"}
                                                                {message?.temp_id &&
                                                                    " • Sending..."}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </div>

                                <div className="p-3 border-t border-gray-200 bg-white">
                                    {selectedChat?.status === "ended" && (
                                        <div className="p-4 text-center bg-gray-50 border-t border-gray-200">
                                            <p className="text-gray-500">
                                                This chat has been ended. No
                                                further messages can be sent.
                                            </p>
                                        </div>
                                    )}
                                    {selectedChat?.status !== "ended" && (
                                        <div className="p-3 border-t border-gray-200 bg-white">
                                            {isReplying && (
                                                <div className="mb-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-sm text-blue-800 font-medium">
                                                            Replying to:{" "}
                                                            {isAdminMessage(
                                                                replyToMessage
                                                            )
                                                                ? "admin"
                                                                : selectedChat
                                                                      ?.user
                                                                      ?.name}
                                                        </p>
                                                        <button
                                                            onClick={() => {
                                                                setIsReplying(
                                                                    false
                                                                );
                                                                setReplyToMessage(
                                                                    null
                                                                );
                                                            }}
                                                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                    <p className="text-xs text-gray-600 truncate">
                                                        {
                                                            replyToMessage?.message
                                                        }
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
                                                        setNewMessage(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                                                    placeholder={
                                                        isReplying
                                                            ? `Reply to ${
                                                                  isAdminMessage(
                                                                      replyToMessage
                                                                  )
                                                                      ? "admin"
                                                                      : selectedChat
                                                                            ?.user
                                                                            ?.name
                                                              }...`
                                                            : "Type your message..."
                                                    }
                                                    disabled={
                                                        selectedChat?.status ===
                                                        "ended"
                                                    }
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={
                                                        selectedChat?.status ===
                                                            "ended" ||
                                                        !newMessage.trim()
                                                    }
                                                    className="px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Send className="w-5 h-5" />
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-4 bg-gray-50">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 w-full max-w-md text-center">
                                    <MessageSquare className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No conversation selected
                                    </h3>
                                    <p className="text-gray-500 mb-6">
                                        Choose a chat from the sidebar to start
                                        messaging or search for a User.
                                    </p>
                                    <button
                                        onClick={() =>
                                            setShowConversations(true)
                                        }
                                        className="md:hidden px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
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
