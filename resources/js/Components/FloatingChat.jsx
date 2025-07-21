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
    const [chatLimitError, setChatLimitError] = useState(null); // New state for chat limit error
    const messagesEndRef = useRef(null);

    const { data, setData, post, processing, reset } = useForm({
        content: "",
        chat_id: null,
    });

    // Sort chats by updated_at in descending order
    const sortedChats = [...chats].sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
    );

    // Fetch chats when opening
    useEffect(() => {
        if (isOpen) {
            fetchChats();
            if (chat?.id && !showChatList) {
                fetchMessages(chat.id);
            }
        }
    }, [isOpen]);

    const handleCloseChat = () => {
        setIsOpen(false);
        setShowChatList(true);
        setChatLimitError(null); // Clear error when closing chat
    };

    // Setup Echo listener
    useEffect(() => {
        if (!isOpen || !window.Echo || !data.chat_id) return;

        const channel = window.Echo.private(`chat.${data.chat_id}`);

        channel.listen(".NewChatMessage", (e) => {
            setMessages((prev) => {
                if (!e.message?.id) return prev;

                const isOwnMessage = e.message.sender_id === auth.user.id;
                const isNewMessage = !prev.some(
                    (msg) => msg.id === e.message.id
                );

                if (isNewMessage) {
                    if (isOwnMessage) {
                        return prev.map((msg) =>
                            msg.status === "Sending" &&
                            msg.sender_id === auth.user.id
                                ? e.message
                                : msg
                        );
                    }
                    return [...prev, e.message];
                }
                return prev;
            });

            if (e.message?.sender_type === "App\\Models\\Admin") {
                axios.post(`/volunteer/chat/${data.chat_id}/read`);
            }
            setTimeout(scrollToBottom, 100);
        });

        return () => channel.stopListening(".NewChatMessage");
    }, [isOpen, data.chat_id, auth.user.id]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [messages]);

    const fetchChats = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("/volunteer/chat/list");
            const sorted =
                response.data.chats?.sort(
                    (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
                ) || [];

            // Remove the default status assignment - just use the status from backend
            setChats(sorted);

            if (sorted.length > 0 && !chat) {
                setChat(sorted[0]);
                setData("chat_id", sorted[0].id);
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
            const response = await axios.get(
                `/volunteer/chat/${chatId}/messages`
            );
            setMessages(response.data.messages || []);
            setData("chat_id", chatId);
            setShowChatList(false);
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
        setChatLimitError(null); // Clear previous errors
        try {
            const response = await axios.post("/volunteer/chat/new");

            if (response.data.error) {
                if (response.data.existing_chat) {
                    // If there's an existing pending chat, open it instead
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
        if (!data.content.trim()) return;

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
        };

        // Optimistic update - add message immediately
        setMessages((prev) => [...prev, optimisticMessage]);
        setData("content", "");
        setTimeout(scrollToBottom, 100);

        try {
            const chatId = data.chat_id || (chat?.id ?? null);
            if (!chatId) {
                throw new Error("No chat session available");
            }

            await router.post(
                route("volunteer.chat.store"),
                {
                    content: data.content,
                    chat_id: chatId,
                    temp_id: tempId,
                },
                {
                    preserveScroll: true,
                    onError: (errors) => {
                        setError(errors?.message || "Failed to send message");
                        setMessages((prev) =>
                            prev.filter((msg) => msg.id !== tempId)
                        );
                    },
                }
            );
        } catch (error) {
            console.error("Message send error:", error);
            setError(error.message || "Failed to send message");
            setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
        }
    };

    // Check if user has active/pending chats
    const hasActiveOrPendingChat = chats.some(
        (c) => c.status === "active" || c.status === "pending"
    );

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
                                {chat ? `Chat #${chat.id}` : "Messages"}
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
                                {sortedChats.map((c) => (
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
                                                ? "bg-gray-50 opacity-75" // Pale color for ended chats
                                                : "hover:bg-gray-50"
                                        }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p
                                                    className={`font-medium ${
                                                        c.status === "ended"
                                                            ? "text-gray-500"
                                                            : "text-gray-900"
                                                    }`}
                                                >
                                                    Chat #{c.id}
                                                    {c.status === "pending" && (
                                                        <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                                                            Pending
                                                        </span>
                                                    )}
                                                    {c.status === "active" && (
                                                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                                            Active
                                                        </span>
                                                    )}
                                                    {c.status === "ended" && (
                                                        <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                                            Ended
                                                        </span>
                                                    )}
                                                </p>
                                                <p
                                                    className={`text-sm mt-1 ${
                                                        c.status === "ended"
                                                            ? "text-gray-400"
                                                            : "text-gray-500"
                                                    }`}
                                                >
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
                                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                                    {c.unread_count}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
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
                                                key={message.id}
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
                                                    <p className="text-xs mt-1 opacity-80">
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

                            {/* Message Input */}
                            <div className="p-4 border-t">
                                <form
                                    onSubmit={handleSubmit}
                                    className="flex items-center"
                                >
                                    <input
                                        type="text"
                                        value={data.content}
                                        onChange={(e) =>
                                            setData("content", e.target.value)
                                        }
                                        className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="Type your message..."
                                        required
                                        disabled={
                                            processing || loading || !chat
                                        }
                                    />
                                    <button
                                        type="submit"
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-lg transition-colors disabled:opacity-50"
                                        disabled={
                                            processing ||
                                            loading ||
                                            !data.content.trim() ||
                                            !chat
                                        }
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
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
