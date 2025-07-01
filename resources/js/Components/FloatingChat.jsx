import React, { useState, useEffect, useRef } from "react";
import { useForm, usePage, router } from "@inertiajs/react";
import { X, MessageSquare, Send } from "lucide-react";
import axios from "axios";

export default function FloatingChat() {
    const { auth } = usePage().props;
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [chat, setChat] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    const { data, setData, post, processing, reset } = useForm({
        content: "",
        chat_id: null,
    });

    // Fetch chat when opening
    useEffect(() => {
        if (isOpen) fetchChat();
    }, [isOpen]);

    // Setup Echo listener
    useEffect(() => {
        if (!isOpen || !window.Echo || !data.chat_id) return;

        const channel = window.Echo.private(`chat.${data.chat_id}`);

        channel.listen(".NewChatMessage", (e) => {
            setMessages((prev) => {
                if (!e.message?.id) return prev; // Guard against invalid messages

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
                axios.post(`/chat/${data.chat_id}/read`);
            }
            setTimeout(scrollToBottom, 100);
        });

        return () => channel.stopListening(".NewChatMessage");
    }, [isOpen, data.chat_id, auth.user.id]);

    // Auto-scroll
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [messages]);

    const fetchChat = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("/chat");

            // Problem likely occurs here:
            if (!response.data?.chat?.id) {
                throw new Error("Invalid chat data received");
            }

            setChat(response.data.chat);
            setMessages(response.data.messages || []);
            setData("chat_id", response.data.chat.id);
        } catch (error) {
            console.error("Fetch chat error:", error);
            setError(
                error.response?.data?.message ||
                    error.message ||
                    "Failed to load chat"
            );
            // Initialize empty chat if needed
            setChat({ id: null, messages: [] });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!data.content.trim()) return;

        // Generate a temporary ID for optimistic update
        const tempId = Date.now();

        // Create optimistic message
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
            // Ensure we have a valid chat_id
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

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <div className="w-80 bg-white rounded-lg shadow-xl flex flex-col border border-gray-200">
                    <div className="bg-indigo-600 text-white p-3 rounded-t-lg flex justify-between items-center">
                        <h3 className="font-medium">Chat with Admin</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:text-gray-200"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 p-3 overflow-y-auto max-h-96 flex flex-col">
                        {loading ? (
                            <p className="text-center py-4">Loading chat...</p>
                        ) : error ? (
                            <p className="text-red-500 text-center py-4">
                                {error}
                            </p>
                        ) : messages.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">
                                No messages yet. Start the conversation!
                            </p>
                        ) : (
                            messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`mb-3 ${
                                        message.sender_type ===
                                        "App\\Models\\User"
                                            ? "text-right"
                                            : "text-left"
                                    }`}
                                >
                                    <div
                                        className={`inline-block px-3 py-2 rounded-lg max-w-xs ${
                                            message.sender_type ===
                                            "App\\Models\\User"
                                                ? "bg-indigo-500 text-white"
                                                : "bg-gray-200"
                                        } ${
                                            message.status === "Sending"
                                                ? "opacity-75"
                                                : ""
                                        }`}
                                    >
                                        {message.content}
                                        {message.status === "Sending" && (
                                            <div className="text-xs italic mt-1">
                                                Sending...
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {message.sender?.name} -{" "}
                                        {new Date(
                                            message.created_at
                                        ).toLocaleTimeString()}
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSubmit} className="p-3 border-t">
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={data.content}
                                onChange={(e) =>
                                    setData("content", e.target.value)
                                }
                                className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="Type your message..."
                                required
                                disabled={processing || loading}
                            />
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white px-3 py-2 rounded-r-lg hover:bg-indigo-700 disabled:opacity-50"
                                disabled={processing || loading}
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
                >
                    <MessageSquare className="w-6 h-6" />
                </button>
            )}
        </div>
    );
}
