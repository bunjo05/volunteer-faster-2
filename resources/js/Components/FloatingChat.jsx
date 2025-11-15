import React, { useState, useEffect, useRef } from "react";
import { useForm, usePage, router } from "@inertiajs/react";
import { X, MessageSquare, Send, Plus, ChevronLeft } from "lucide-react";
import axios from "axios";

export default function FloatingChat() {
    const { auth } = usePage().props;
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [chat, setChat] = useState(null);
    const [chats, setChats] = useState([]);
    const [showChatList, setShowChatList] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [chatLimitError, setChatLimitError] = useState(null);
    const messagesEndRef = useRef(null);
    const echoChannel = useRef(null);
    const pollingInterval = useRef(null);

    // Add this state to track success message
    const [successMessage, setSuccessMessage] = useState(null);

    const { data, setData, post, processing, reset } = useForm({
        content: "",
        chat_id: null,
    });

    // Sort chats by updated_at in descending order
    const sortedChats = [...chats].sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
    );

    // Check if current chat is ended - make sure this is properly calculated
    const isChatEnded = chat?.status === "ended";

    // Check if user has active or pending chats
    const hasActiveOrPendingChat = chats.some(
        (c) => c.status === "active" || c.status === "pending"
    );

    // Get the first active or pending chat
    const getActiveOrPendingChat = () => {
        return chats.find(
            (c) => c.status === "active" || c.status === "pending"
        );
    };

    // Silent polling function
    const pollForUpdates = async () => {
        if (!isOpen) return;

        try {
            const response = await axios.get("/chats/list");
            const updatedChats = response.data.chats || [];

            // Update chats state if there are changes
            setChats((prevChats) => {
                if (
                    JSON.stringify(prevChats) !== JSON.stringify(updatedChats)
                ) {
                    return updatedChats;
                }
                return prevChats;
            });

            // If we're in a chat, check for new messages and update chat status
            if (chat?.id && !showChatList) {
                const messagesResponse = await axios.get(
                    `/chats/${chat.id}/messages`
                );
                const updatedMessages = messagesResponse.data.messages || [];

                setMessages((prevMessages) => {
                    if (
                        JSON.stringify(prevMessages) !==
                        JSON.stringify(updatedMessages)
                    ) {
                        return updatedMessages;
                    }
                    return prevMessages;
                });

                // Also update the current chat status from the updated chats list
                const updatedCurrentChat = updatedChats.find(
                    (c) => c.id === chat.id
                );
                if (
                    updatedCurrentChat &&
                    updatedCurrentChat.status !== chat.status
                ) {
                    setChat(updatedCurrentChat);
                }
            }
        } catch (error) {
            console.error("Polling error:", error);
            // Don't show error to user for silent polling
        }
    };

    // Start/stop polling based on chat state
    useEffect(() => {
        if (isOpen) {
            // Start polling immediately
            pollForUpdates();

            // Set up interval for polling (every 5 seconds)
            pollingInterval.current = setInterval(pollForUpdates, 5000);
        } else {
            // Clean up
            if (pollingInterval.current) {
                clearInterval(pollingInterval.current);
                pollingInterval.current = null;
            }
        }

        return () => {
            if (pollingInterval.current) {
                clearInterval(pollingInterval.current);
            }
        };
    }, [isOpen, chat?.id, showChatList]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            fetchChats();
        }
    }, [isOpen]);

    const handleCloseChat = () => {
        setIsOpen(false);
        setShowChatList(true);
        setChatLimitError(null);
    };

    const fetchChats = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("/chats/list");
            const sorted =
                response.data.chats?.sort(
                    (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
                ) || [];

            setChats(sorted);

            // Auto-select the first active or pending chat if available
            const activeChat = getActiveOrPendingChat();
            if (activeChat && !chat) {
                setChat(activeChat);
                setData("chat_id", activeChat.id);
                // Auto-open the chat if there's an active/pending one
                if (activeChat.status !== "ended") {
                    fetchMessages(activeChat.id);
                }
            }
        } catch (error) {
            console.error("Fetch chats error:", error);
            setError(
                error.response?.data?.message ||
                    error.message ||
                    "Failed to load chats"
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (chatId) => {
        try {
            const response = await axios.get(`/chats/${chatId}/messages`);
            setMessages(response.data.messages || []);
            setData("chat_id", chatId);
            setShowChatList(false);

            // Update the current chat with the latest data
            const currentChat = chats.find((c) => c.id === chatId);
            if (currentChat) {
                setChat(currentChat);
            }

            // Mark messages as read when opening chat
            if (chatId) {
                await axios.post(`/chats/${chatId}/read`);

                // Update local state immediately
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.sender_type === "App\\Models\\Admin" && !msg.read_at
                            ? {
                                  ...msg,
                                  read_at: new Date().toISOString(),
                                  status: "Read",
                              }
                            : msg
                    )
                );

                // Update unread count in chat list
                setChats((prev) =>
                    prev.map((c) =>
                        c.id === chatId ? { ...c, unread_count: 0 } : c
                    )
                );
            }
        } catch (error) {
            console.error("Fetch messages error:", error);
            setError(
                error.response?.data?.message ||
                    error.message ||
                    "Failed to load messages"
            );
        }
    };

    const startNewChat = async () => {
        setLoading(true);
        setChatLimitError(null);
        try {
            // Use the correct endpoint for starting new chat
            const response = await axios.post("/chats/new");

            if (response.data.error) {
                if (response.data.existing_chat) {
                    setChat(response.data.existing_chat);
                    setChats((prev) => [response.data.existing_chat, ...prev]);
                    fetchMessages(response.data.existing_chat.id);
                    setError(null);
                    setChatLimitError(
                        "You already have a pending chat. Please complete it before starting a new one."
                    );
                } else {
                    setError(response.data.error);
                    setChatLimitError(response.data.error);
                }
                return;
            }

            const newChat = response.data.chat;
            setChat(newChat);
            setChats([newChat, ...chats]);
            setMessages([]);
            setData("chat_id", newChat.id);
            setShowChatList(false);
        } catch (error) {
            console.error("New chat error:", error);
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Failed to start new chat";
            setError(errorMessage);
            setChatLimitError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent sending messages if chat is ended - same logic as admin chat
        if (!data.content.trim() || isChatEnded) return;

        // If no chat exists but user has content to send, auto-create a chat
        if (!chat && data.content.trim()) {
            await startNewChatAndSendMessage(data.content);
            return;
        }

        const tempId = Date.now();
        const optimisticMessage = {
            id: tempId,
            content: data.content,
            sender_id: auth.user.id,
            sender_type: "App\\Models\\User",
            created_at: new Date().toISOString(),
            status: "Sending",
            sender: {
                id: auth.user.id,
                name: auth.user.name,
                email: auth.user.email,
            },
            temp_id: tempId,
        };

        // Optimistic update
        setMessages((prev) => [...prev, optimisticMessage]);
        const messageContent = data.content;
        setData("content", "");
        scrollToBottom();

        try {
            const chatId = data.chat_id || (chat?.id ?? null);
            if (!chatId) throw new Error("No chat session available");

            // Use the correct endpoint for sending messages
            const response = await axios.post("/chats/store", {
                content: messageContent,
                chat_id: chatId,
                temp_id: tempId,
            });

            if (response.data.message) {
                setSuccessMessage("Message sent successfully");
                setTimeout(() => setSuccessMessage(null), 3000);

                // Replace optimistic message with actual message
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.temp_id === tempId ? response.data.message : msg
                    )
                );

                setTimeout(pollForUpdates, 1000);
            }
        } catch (error) {
            console.error("Message send error:", error);

            // Enhanced error logging
            if (error.response) {
                console.error("Server error response:", error.response.data);
                console.error("Status code:", error.response.status);
                setError(
                    error.response.data.message ||
                        `Server error: ${error.response.status}`
                );
            } else if (error.request) {
                console.error("No response received:", error.request);
                setError(
                    "No response from server. Please check your connection."
                );
            } else {
                console.error("Error:", error.message);
                setError(error.message || "Failed to send message");
            }

            // Remove the optimistic message if sending failed
            setMessages((prev) =>
                prev.filter(
                    (msg) => msg.id !== tempId && msg.temp_id !== tempId
                )
            );
        }
    };

    // Helper function to create chat and send message
    const startNewChatAndSendMessage = async (content) => {
        setLoading(true);
        try {
            // First create a new chat
            const chatResponse = await axios.post("/chats/new");

            if (chatResponse.data.error && chatResponse.data.existing_chat) {
                // Use existing chat
                const existingChat = chatResponse.data.existing_chat;
                setChat(existingChat);
                setChats((prev) => [existingChat, ...prev]);
                setData("chat_id", existingChat.id);
                setShowChatList(false);

                // Now send the message
                await sendMessageToChat(existingChat.id, content);
            } else if (chatResponse.data.chat) {
                // New chat created
                const newChat = chatResponse.data.chat;
                setChat(newChat);
                setChats([newChat, ...chats]);
                setData("chat_id", newChat.id);
                setShowChatList(false);

                // Now send the message
                await sendMessageToChat(newChat.id, content);
            }
        } catch (error) {
            console.error("Error creating chat and sending message:", error);
            setError("Failed to start chat and send message");
        } finally {
            setLoading(false);
        }
    };

    // Helper function to send message to specific chat
    const sendMessageToChat = async (chatId, content) => {
        const tempId = Date.now();
        const optimisticMessage = {
            id: tempId,
            content: content,
            sender_id: auth.user.id,
            sender_type: "App\\Models\\User",
            created_at: new Date().toISOString(),
            status: "Sending",
            sender: {
                id: auth.user.id,
                name: auth.user.name,
                email: auth.user.email,
            },
            temp_id: tempId,
        };

        setMessages([optimisticMessage]);
        scrollToBottom();

        try {
            const response = await axios.post("/chats/store", {
                content: content,
                chat_id: chatId,
                temp_id: tempId,
            });

            if (response.data.message) {
                setSuccessMessage("Message sent successfully");
                setTimeout(() => setSuccessMessage(null), 3000);

                setMessages([response.data.message]);
                setTimeout(pollForUpdates, 1000);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setError("Failed to send message");
            setMessages([]);
        }
    };

    // Function to get admin name from chat
    const getAdminName = (chat) => {
        if (!chat) return "Support Team";

        // If chat has admin data directly
        if (chat.admin) {
            return chat.admin.name;
        }

        // If chat has participants with admin
        if (chat.participants) {
            const adminParticipant = chat.participants.find((p) => p.admin_id);
            if (adminParticipant?.admin) {
                return adminParticipant.admin.name;
            }
        }

        // Fallback based on chat status
        if (chat.status === "pending") {
            return "Waiting for admin...";
        }

        return "Support Team";
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <div className="w-96 bg-white rounded-xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-indigo-600 text-white p-4 rounded-t-xl flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            {!showChatList ? (
                                <button
                                    onClick={() => setShowChatList(true)}
                                    className="hover:text-indigo-200 transition-colors"
                                    aria-label="Back to chats"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                            ) : (
                                <MessageSquare className="w-5 h-5" />
                            )}
                            <h3 className="font-semibold text-lg">
                                Live Support
                            </h3>
                        </div>
                        <button
                            onClick={handleCloseChat}
                            className="text-white hover:text-indigo-200 transition-colors"
                            aria-label="Close chat"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Chat List */}
                    {showChatList ? (
                        <div className="flex flex-col h-[28rem]">
                            <div className="p-4 border-b">
                                <button
                                    onClick={startNewChat}
                                    className="w-full flex items-center justify-center space-x-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                                    disabled={loading || hasActiveOrPendingChat}
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>
                                        {hasActiveOrPendingChat
                                            ? "You already have an active chat"
                                            : "New Conversation"}
                                    </span>
                                </button>
                                {chatLimitError && (
                                    <div className="mt-2 p-2 bg-red-50 text-red-600 text-sm rounded">
                                        {chatLimitError}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {sortedChats.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500">
                                        <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                        <p>No chats yet</p>
                                        <p className="text-sm">
                                            Start a new conversation to get help
                                        </p>
                                    </div>
                                ) : (
                                    sortedChats.map((c) => (
                                        <div
                                            key={c.id}
                                            onClick={() => {
                                                setChat(c);
                                                fetchMessages(c.id);
                                            }}
                                            className={`p-4 cursor-pointer transition-colors ${
                                                chat?.id === c.id
                                                    ? "bg-indigo-50 border-l-4 border-indigo-500"
                                                    : c.status === "ended"
                                                    ? "bg-gray-50 opacity-75"
                                                    : "hover:bg-gray-50"
                                            }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between">
                                                        <p
                                                            className={`font-medium truncate ${
                                                                c.status ===
                                                                "ended"
                                                                    ? "text-gray-500"
                                                                    : "text-gray-900"
                                                            }`}
                                                        >
                                                            {getAdminName(c)}
                                                        </p>
                                                        <div className="flex items-center space-x-2 mt-1">
                                                            {c.status ===
                                                                "pending" && (
                                                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                                                                    Pending
                                                                </span>
                                                            )}
                                                            {c.status ===
                                                                "active" && (
                                                                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                                                    Active
                                                                </span>
                                                            )}
                                                            {c.status ===
                                                                "ended" && (
                                                                <span className="text-xs bg-red-300 text-gray-500 px-2 py-0.5 rounded-full">
                                                                    Ended
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p
                                                        className={`text-sm mt-1 ${
                                                            c.status === "ended"
                                                                ? "text-gray-400"
                                                                : "text-gray-500"
                                                        } truncate`}
                                                    >
                                                        {c.latest_message
                                                            ?.content ||
                                                            "No messages yet"}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {new Date(
                                                            c.updated_at
                                                        ).toLocaleString([], {
                                                            month: "short",
                                                            day: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </p>
                                                </div>
                                                {c.unread_count > 0 && (
                                                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2 flex-shrink-0">
                                                        {c.unread_count}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Chat Messages */
                        <div className="flex flex-col h-[28rem]">
                            <div className="flex-1 p-4 overflow-y-auto">
                                {loading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-gray-500">
                                            Loading conversation...
                                        </p>
                                    </div>
                                ) : error ? (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-red-500">{error}</p>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center">
                                        <MessageSquare className="w-10 h-10 text-gray-400 mb-2" />
                                        <p className="text-gray-500 font-medium">
                                            No messages yet
                                        </p>
                                        <p className="text-gray-400 text-sm mt-1">
                                            Start the conversation!
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {messages.map((message) => (
                                            <div
                                                key={
                                                    message.id ||
                                                    message.temp_id
                                                }
                                                className={`flex ${
                                                    message.sender_type ===
                                                    "App\\Models\\User"
                                                        ? "justify-end"
                                                        : "justify-start"
                                                }`}
                                            >
                                                <div
                                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                        message.sender_type ===
                                                        "App\\Models\\User"
                                                            ? "bg-indigo-600 text-white"
                                                            : "bg-gray-100 text-gray-800"
                                                    } ${
                                                        message.status ===
                                                        "Sending"
                                                            ? "opacity-75"
                                                            : ""
                                                    }`}
                                                >
                                                    <p>{message.content}</p>
                                                    {message.status ===
                                                        "Sending" && (
                                                        <p className="text-xs italic mt-1">
                                                            Sending...
                                                        </p>
                                                    )}
                                                    <p className="text-[10px] text-end mt-1 opacity-80">
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
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>
                                )}
                            </div>

                            {/* IMPLEMENTATION: Same logic as admin chat - show ended message instead of form */}
                            {isChatEnded ? (
                                // Show ended message when chat is ended (same as admin chat)
                                <div className="p-4 border-t bg-gray-50">
                                    <div className="text-center text-gray-500 text-sm">
                                        <p className="font-medium">
                                            Chat Ended
                                        </p>
                                        <p className="mt-1">
                                            This chat has been ended. No further
                                            messages can be sent.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                // Show message input when chat is active
                                <div className="p-4 border-t">
                                    {successMessage && (
                                        <div className="absolute bottom-16 left-4 right-4">
                                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded relative">
                                                <span className="block sm:inline">
                                                    {successMessage}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    <form
                                        onSubmit={handleSubmit}
                                        className="flex items-center"
                                    >
                                        <input
                                            type="text"
                                            value={data.content}
                                            onChange={(e) =>
                                                setData(
                                                    "content",
                                                    e.target.value
                                                )
                                            }
                                            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            placeholder={
                                                !chat
                                                    ? "Type a message to start a new chat..."
                                                    : "Type your message..."
                                            }
                                            required
                                            disabled={processing || loading}
                                        />
                                        <button
                                            type="submit"
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-lg transition-colors disabled:opacity-50"
                                            disabled={
                                                processing ||
                                                loading ||
                                                !data.content.trim()
                                            }
                                        >
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                /* Floating Button */
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-xl transition-all transform hover:scale-105"
                    aria-label="Open chat"
                >
                    <div className="relative">
                        <MessageSquare className="w-6 h-6" />
                        {chats.some((c) => c.unread_count > 0) && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {chats.reduce(
                                    (sum, c) => sum + (c.unread_count || 0),
                                    0
                                )}
                            </span>
                        )}
                    </div>
                </button>
            )}
        </div>
    );
}
