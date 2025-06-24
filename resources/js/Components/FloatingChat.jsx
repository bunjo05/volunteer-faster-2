import React, { useState, useEffect, useRef } from "react";
import { useForm } from "@inertiajs/react";
import { X, MessageSquare, Send } from "lucide-react";
import axios from "axios";

export default function FloatingChat() {
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

    useEffect(() => {
        if (isOpen) {
            fetchChat();
        }
    }, [isOpen]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchChat = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("/chat");

            if (response.data.error) {
                setError(response.data.error);
                return;
            }

            setChat(response.data.chat);
            // No need to reverse here since backend sends in oldest order
            setMessages(response.data.messages);
            setData("chat_id", response.data.chat.id);

            // Set up Echo listener
            if (window.Echo) {
                window.Echo.private(`chat.${response.data.chat.id}`).listen(
                    "NewChatMessage",
                    (e) => {
                        // Add new message to the end of the array
                        setMessages((prev) => [...prev, e.message]);
                        if (e.message.sender_type === "App\\Models\\Admin") {
                            axios.post(`/chat/${response.data.chat.id}/read`);
                        }
                        // Scroll to bottom when new message arrives
                        setTimeout(scrollToBottom, 100);
                    }
                );
            }
        } catch (error) {
            console.error("Error fetching chat:", error);
            setError("Failed to load chat. Please try again.");
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.content.trim()) return;

        post("/chat", {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                // Scroll to bottom after sending
                setTimeout(scrollToBottom, 100);
            },
            onError: (errors) => {
                setError("Failed to send message. Please try again.");
            },
        });
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
                            // Messages will naturally appear in order with newest at bottom
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
                                        }`}
                                    >
                                        {message.content}
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
                                disabled={processing || !chat}
                            />
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white px-3 py-2 rounded-r-lg hover:bg-indigo-700 disabled:opacity-50"
                                disabled={processing || !chat}
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
