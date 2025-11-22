import { useState, useEffect, useRef } from "react";
import { useForm, usePage, router } from "@inertiajs/react";
import {
    Search,
    MoreVertical,
    Video,
    Phone,
    Info,
    Send,
    X,
    Minimize2,
    Maximize2,
    MessageCircle,
} from "lucide-react";
import axios from "axios";

export default function FloatingConversation({ auth }) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeChat, setActiveChat] = useState(null);
    const [openChats, setOpenChats] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState({}); // Track loading per chat
    const [allConversations, setAllConversations] = useState([]);
    const [pollingError, setPollingError] = useState(null);
    const messagesEndRef = useRef(null);
    const pollingInterval = useRef(null);
    const continuousPollingInterval = useRef(null); // Separate interval for continuous polling
    const messageCounter = useRef(0); // Counter for unique message keys
    const lastMessageTimeRef = useRef({}); // Track last message time per chat for targeted polling
    const lastPollTimeRef = useRef(Date.now()); // Track last poll time
    const { processing } = useForm();

    const { props } = usePage();
    const { messages = {} } = props;
    const { conversations: initialConversations = [] } = messages;

    // Separate form state for each chat
    const [chatInputs, setChatInputs] = useState({});

    // Initialize with initial conversations
    useEffect(() => {
        setAllConversations(initialConversations);
    }, [initialConversations]);

    // Improved date validation function
    const isValidDate = (dateString) => {
        if (!dateString) return false;
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    };

    // Format time function
    const formatTime = (dateString) => {
        if (!dateString || !isValidDate(dateString)) {
            return "Just now";
        }
        try {
            const date = new Date(dateString);
            return date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch (error) {
            return "Just now";
        }
    };

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString || !isValidDate(dateString)) {
            return "Recently";
        }
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) return "Yesterday";
            if (diffDays > 1) return date.toLocaleDateString();
            return formatTime(dateString);
        } catch (error) {
            return "Recently";
        }
    };

    // Generate unique message key
    const generateMessageKey = (message, index = 0) => {
        if (message.id) {
            return `msg-${message.id}`;
        }
        if (message.temp_id) {
            return `temp-${message.temp_id}`;
        }
        // Use counter for truly unique keys
        messageCounter.current += 1;
        return `msg-${Date.now()}-${messageCounter.current}-${index}`;
    };

    // ENHANCED: Silent background polling specifically for Horizontal Chat Windows
    const pollForChatWindows = async (targetChatIds = null) => {
        try {
            let chatIdsToPoll;
            if (targetChatIds) {
                // Poll only specific chats
                chatIdsToPoll = targetChatIds;
            } else if (openChats.length > 0) {
                // Poll all open chats in the Horizontal Chat Windows
                chatIdsToPoll = openChats.map((chat) => chat.sender.id);
            } else {
                // No open chats to poll
                return;
            }

            // If no valid chat IDs, return
            if (chatIdsToPoll.length === 0) return;

            console.log(
                `🔄 Polling chat windows for: ${chatIdsToPoll.join(", ")}`
            );

            const response = await axios.get(
                route(
                    auth.user.role === "Organization"
                        ? "organization.messages"
                        : "volunteer.messages"
                ),
                {
                    params: {
                        polling: true,
                        open_chats: chatIdsToPoll.join(","),
                        timestamp: Date.now(),
                        focus_chat_windows: true, // New parameter to indicate this is for chat windows
                    },
                }
            );

            const updatedConversations = response.data.messages || [];

            // Update last poll time
            lastPollTimeRef.current = Date.now();

            let hasNewMessages = false;
            let updatedActiveChat = false;

            // Update open chats with new messages - FOCUS ON CHAT WINDOWS
            setOpenChats((prevOpenChats) => {
                return prevOpenChats.map((openChat) => {
                    const updatedConversation = updatedConversations.find(
                        (conv) => conv.sender.id === openChat.sender.id
                    );

                    if (updatedConversation) {
                        // Check if there are new messages
                        const currentLastMessageId =
                            openChat.messages[openChat.messages.length - 1]?.id;
                        const newLastMessageId =
                            updatedConversation.messages?.[
                                updatedConversation.messages.length - 1
                            ]?.id;

                        if (newLastMessageId !== currentLastMessageId) {
                            hasNewMessages = true;
                            console.log(
                                `🆕 New messages found for ${openChat.sender.name} in chat window`
                            );
                        }

                        // Preserve optimistic messages and local state
                        const existingOptimisticMessages =
                            openChat.messages.filter(
                                (msg) =>
                                    msg.temp_id ||
                                    msg.status === "Sending" ||
                                    msg.status === "Failed"
                            );

                        const sanitizedMessages = (
                            updatedConversation.messages || []
                        )
                            .filter(
                                (serverMsg) =>
                                    // Don't overwrite optimistic messages
                                    !existingOptimisticMessages.some(
                                        (optMsg) =>
                                            optMsg.temp_id &&
                                            serverMsg.id === optMsg.id
                                    )
                            )
                            .map((msg, index) => ({
                                ...msg,
                                created_at: isValidDate(msg.created_at)
                                    ? msg.created_at
                                    : new Date().toISOString(),
                                _key: generateMessageKey(msg, index),
                            }));

                        // Combine optimistic messages with server messages
                        const combinedMessages = [
                            ...existingOptimisticMessages,
                            ...sanitizedMessages,
                        ].sort(
                            (a, b) =>
                                new Date(a.created_at) - new Date(b.created_at)
                        );

                        const updatedChat = {
                            ...openChat,
                            messages: combinedMessages,
                            unreadCount: updatedConversation.unreadCount || 0,
                            latestMessage: updatedConversation.latestMessage
                                ? {
                                      ...updatedConversation.latestMessage,
                                      created_at: isValidDate(
                                          updatedConversation.latestMessage
                                              .created_at
                                      )
                                          ? updatedConversation.latestMessage
                                                .created_at
                                          : new Date().toISOString(),
                                  }
                                : null,
                        };

                        // Check if this is the active chat
                        if (activeChat?.sender.id === openChat.sender.id) {
                            updatedActiveChat = true;
                        }

                        return updatedChat;
                    }
                    return openChat;
                });
            });

            // Update active chat if it's one of the open chats
            if (activeChat) {
                const updatedActiveChatData = updatedConversations.find(
                    (conv) => conv.sender.id === activeChat.sender.id
                );
                if (updatedActiveChatData) {
                    setActiveChat((prev) => ({
                        ...prev,
                        messages: prev.messages, // Keep current messages, they're updated above
                        unreadCount: updatedActiveChatData.unreadCount || 0,
                        latestMessage: updatedActiveChatData.latestMessage,
                    }));
                }
            }

            // Update ALL conversations (for sidebar) as well
            setAllConversations((prevAllConversations) => {
                return prevAllConversations.map((conv) => {
                    const updatedConv = updatedConversations.find(
                        (updated) => updated.sender.id === conv.sender.id
                    );
                    return updatedConv || conv;
                });
            });

            // Auto-scroll to bottom if new messages came in and this chat is active
            if (
                hasNewMessages &&
                activeChat &&
                targetChatIds?.includes(activeChat.sender.id)
            ) {
                setTimeout(scrollToBottom, 100);
            }

            // Auto-scroll for any active chat with new messages
            if (hasNewMessages && updatedActiveChat) {
                setTimeout(scrollToBottom, 100);
            }

            setPollingError(null);
        } catch (error) {
            console.error("Chat window polling error:", error);
            // Silent error - don't disrupt user experience
            setPollingError("Connection issue - retrying...");
        }
    };

    // NON-STOP SILENT BACKGROUND POLLING FOR CHAT WINDOWS
    const startChatWindowPolling = () => {
        if (continuousPollingInterval.current) {
            clearInterval(continuousPollingInterval.current);
        }

        // Silent background polling runs every 2 seconds for instant updates
        continuousPollingInterval.current = setInterval(() => {
            if (openChats.length > 0) {
                pollForChatWindows();
            }
        }, 2000); // Faster polling for better real-time experience

        console.log(
            "🔍 SILENT background polling started for chat windows (every 2 seconds)"
        );
    };

    // Stop continuous polling
    const stopChatWindowPolling = () => {
        if (continuousPollingInterval.current) {
            clearInterval(continuousPollingInterval.current);
            continuousPollingInterval.current = null;
            console.log("🛑 Chat window polling stopped");
        }
    };

    // Immediate targeted polling after message send
    const triggerImmediatePoll = (chatId) => {
        console.log(`🚀 Triggering immediate poll for chat: ${chatId}`);

        // Update last message time for this chat
        lastMessageTimeRef.current[chatId] = Date.now();

        // Trigger immediate poll for this specific chat
        setTimeout(() => pollForChatWindows([chatId]), 300);

        // Schedule additional polls for the next few seconds to ensure we get the latest
        setTimeout(() => pollForChatWindows([chatId]), 1000);
        setTimeout(() => pollForChatWindows([chatId]), 2000);
    };

    // START NON-STOP SILENT BACKGROUND POLLING FOR CHAT WINDOWS
    useEffect(() => {
        startChatWindowPolling();

        // Clean up on unmount
        return () => {
            if (pollingInterval.current) {
                clearInterval(pollingInterval.current);
                pollingInterval.current = null;
            }
            if (continuousPollingInterval.current) {
                clearInterval(continuousPollingInterval.current);
                continuousPollingInterval.current = null;
            }
        };
    }, []); // Empty dependency array - runs once on mount

    // RESTART CHAT WINDOW POLLING WHEN OPEN CHATS CHANGE
    useEffect(() => {
        if (openChats.length > 0) {
            console.log(
                `💬 ${openChats.length} chat window(s) open - polling active`
            );
            // Trigger immediate poll when chats open
            pollForChatWindows();
        } else {
            console.log("💤 No chat windows open - polling continues silently");
        }
    }, [openChats.length]);

    // Enhanced polling when active chat changes
    useEffect(() => {
        if (openChats.length > 0 && activeChat) {
            // Trigger immediate poll when active chat changes
            pollForChatWindows([activeChat.sender.id]);
        }
    }, [activeChat?.sender?.id]);

    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeChat?.messages]);

    // Initialize chat input when a new chat is opened
    useEffect(() => {
        const newChatInputs = { ...chatInputs };
        openChats.forEach((chat) => {
            if (!newChatInputs[chat.sender.id]) {
                newChatInputs[chat.sender.id] = "";
            }
        });
        setChatInputs(newChatInputs);
    }, [openChats]);

    // Filter conversations based on search
    const filteredConversations = allConversations.filter((conversation) =>
        conversation.sender?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    const startChat = (conversation) => {
        // Check if chat is already open
        const existingChatIndex = openChats.findIndex(
            (chat) => chat.sender.id === conversation.sender.id
        );

        if (existingChatIndex !== -1) {
            const existingChat = openChats[existingChatIndex];
            setActiveChat(existingChat);

            // If minimized, maximize it
            if (existingChat.isMinimized) {
                setOpenChats((prev) =>
                    prev.map((chat) =>
                        chat.sender.id === conversation.sender.id
                            ? { ...chat, isMinimized: false }
                            : chat
                    )
                );
            }

            // Trigger immediate poll for this specific chat
            triggerImmediatePoll(conversation.sender.id);
            return;
        }

        // Limit to maximum 4 chat windows
        let newOpenChats = [...openChats];
        if (newOpenChats.length >= 4) {
            newOpenChats = newOpenChats.slice(1);
        }

        // Get project and booking context
        const latestMessage = conversation.latestMessage;
        const projectPublicId = latestMessage?.project_public_id;
        const bookingPublicId = latestMessage?.booking_public_id;

        // Ensure messages have valid dates and unique keys
        const sanitizedMessages = (conversation.messages || []).map(
            (msg, index) => ({
                ...msg,
                created_at: isValidDate(msg.created_at)
                    ? msg.created_at
                    : new Date().toISOString(),
                _key: generateMessageKey(msg, index),
            })
        );

        const newChat = {
            ...conversation,
            messages: sanitizedMessages,
            isMinimized: false,
            project_public_id: projectPublicId,
            booking_public_id: bookingPublicId,
            _instanceId: `${conversation.sender.id}-${Date.now()}`,
        };

        const updatedChats = [...newOpenChats, newChat];
        setOpenChats(updatedChats);
        setActiveChat(newChat);

        setChatInputs((prev) => ({
            ...prev,
            [conversation.sender.id]: "",
        }));

        if (conversation.unreadCount > 0) {
            markMessagesAsRead(conversation.sender.id);
        }

        // Trigger immediate poll after opening new chat
        triggerImmediatePoll(conversation.sender.id);
    };

    // Function to mark messages as read
    const markMessagesAsRead = async (senderId) => {
        try {
            await router.patch(
                route(
                    auth.user.role === "Organization"
                        ? "organization.messages.mark-all-read"
                        : "volunteer.messages.mark-all-read",
                    { senderId }
                ),
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setAllConversations((prev) =>
                            prev.map((conv) =>
                                conv.sender.id === senderId
                                    ? { ...conv, unreadCount: 0 }
                                    : conv
                            )
                        );

                        setOpenChats((prev) =>
                            prev.map((chat) =>
                                chat.sender.id === senderId
                                    ? { ...chat, unreadCount: 0 }
                                    : chat
                            )
                        );
                    },
                }
            );
        } catch (error) {
            console.error("Error marking messages as read:", error);
        }
    };

    const closeChat = (conversationId, e) => {
        e?.stopPropagation();

        const updatedChats = openChats.filter(
            (chat) => chat.sender.id !== conversationId
        );
        setOpenChats(updatedChats);

        setChatInputs((prev) => {
            const newInputs = { ...prev };
            delete newInputs[conversationId];
            return newInputs;
        });

        if (activeChat?.sender.id === conversationId) {
            setActiveChat(
                updatedChats.length > 0
                    ? updatedChats[updatedChats.length - 1]
                    : null
            );
        }
    };

    const toggleMinimizeChat = (conversationId, e) => {
        e?.stopPropagation();
        setOpenChats((prev) =>
            prev.map((chat) =>
                chat.sender.id === conversationId
                    ? { ...chat, isMinimized: !chat.isMinimized }
                    : chat
            )
        );
    };

    const handleInputChange = (chatId, value) => {
        setChatInputs((prev) => ({
            ...prev,
            [chatId]: value,
        }));
    };

    const handleSendMessage = async (chat, e) => {
        e.preventDefault();

        const message = chatInputs[chat.sender.id]?.trim();
        if (!message || !chat) return;

        const receiverId = chat.sender.id;

        // Clear input immediately for better UX
        setChatInputs((prev) => ({
            ...prev,
            [chat.sender.id]: "",
        }));

        // Set loading state for this specific chat
        setIsLoading((prev) => ({
            ...prev,
            [chat.sender.id]: true,
        }));

        // Optimistic update - create the optimistic message
        const tempId = `temp-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`;
        const optimisticMessage = {
            id: tempId,
            message: message,
            sender_id: auth.user.id,
            receiver_id: receiverId,
            created_at: new Date().toISOString(),
            status: "Sending",
            temp_id: tempId,
            sender: {
                id: auth.user.id,
                name: auth.user.name,
                email: auth.user.email,
            },
            _key: generateMessageKey({ temp_id: tempId }),
        };

        // IMMEDIATELY update the open chat with optimistic message
        setOpenChats((prevOpenChats) => {
            return prevOpenChats.map((openChat) => {
                if (openChat.sender.id === chat.sender.id) {
                    const updatedMessages = [
                        ...openChat.messages,
                        optimisticMessage,
                    ];

                    return {
                        ...openChat,
                        messages: updatedMessages,
                        latestMessage: optimisticMessage,
                    };
                }
                return openChat;
            });
        });

        // Also update active chat if it's the current one
        if (activeChat?.sender.id === chat.sender.id) {
            setActiveChat((prev) => {
                if (prev && prev.sender.id === chat.sender.id) {
                    return {
                        ...prev,
                        messages: [...prev.messages, optimisticMessage],
                        latestMessage: optimisticMessage,
                    };
                }
                return prev;
            });
        }

        // Update sidebar conversations for instant display
        setAllConversations((prev) =>
            prev.map((conv) =>
                conv.sender.id === chat.sender.id
                    ? {
                          ...conv,
                          latestMessage: optimisticMessage,
                          // Don't increment unread count for our own messages
                          unreadCount: conv.unreadCount,
                      }
                    : conv
            )
        );

        // Scroll to bottom to show the new message
        setTimeout(scrollToBottom, 100);

        try {
            const requestData = {
                receiver_id: receiverId,
                message: message,
                project_public_id: chat.project_public_id || "",
                booking_public_id: chat.booking_public_id || "",
            };

            const response = await fetch(
                route(
                    auth.user.role === "Organization"
                        ? "organization.messages.store"
                        : "volunteer.messages.store"
                ),
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                        Accept: "application/json",
                    },
                    body: JSON.stringify(requestData),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                console.log(
                    "✅ Message sent successfully, triggering silent polling..."
                );

                // Update optimistic message status to "Sent"
                setOpenChats((prevOpenChats) => {
                    return prevOpenChats.map((openChat) => {
                        if (openChat.sender.id === chat.sender.id) {
                            const updatedMessages = openChat.messages.map(
                                (msg) =>
                                    msg.temp_id === tempId
                                        ? { ...msg, status: "Sent" }
                                        : msg
                            );

                            return {
                                ...openChat,
                                messages: updatedMessages,
                            };
                        }
                        return openChat;
                    });
                });

                // Update active chat
                if (activeChat?.sender.id === chat.sender.id) {
                    setActiveChat((prev) => {
                        if (prev && prev.sender.id === chat.sender.id) {
                            const updatedMessages = prev.messages.map((msg) =>
                                msg.temp_id === tempId
                                    ? { ...msg, status: "Sent" }
                                    : msg
                            );

                            return {
                                ...prev,
                                messages: updatedMessages,
                            };
                        }
                        return prev;
                    });
                }

                // TRIGGER SILENT BACKGROUND POLLING IMMEDIATELY
                triggerImmediatePoll(chat.sender.id);
            } else {
                throw new Error(result.message || "Failed to send message");
            }
        } catch (error) {
            console.error("Error sending message:", error);

            // Mark message as failed instead of removing it
            setOpenChats((prevOpenChats) => {
                return prevOpenChats.map((openChat) => {
                    if (openChat.sender.id === chat.sender.id) {
                        const updatedMessages = openChat.messages.map((msg) =>
                            msg.temp_id === tempId
                                ? { ...msg, status: "Failed" }
                                : msg
                        );

                        return {
                            ...openChat,
                            messages: updatedMessages,
                        };
                    }
                    return openChat;
                });
            });

            // Update active chat with failed status
            if (activeChat?.sender.id === chat.sender.id) {
                setActiveChat((prev) => {
                    if (prev && prev.sender.id === chat.sender.id) {
                        const updatedMessages = prev.messages.map((msg) =>
                            msg.temp_id === tempId
                                ? { ...msg, status: "Failed" }
                                : msg
                        );

                        return {
                            ...prev,
                            messages: updatedMessages,
                        };
                    }
                    return prev;
                });
            }

            // Revert sidebar conversation update on failure
            setAllConversations((prev) =>
                prev.map((conv) =>
                    conv.sender.id === chat.sender.id
                        ? {
                              ...conv,
                              latestMessage: chat.latestMessage,
                          }
                        : conv
                )
            );
        } finally {
            // Clear loading state for this chat
            setIsLoading((prev) => ({
                ...prev,
                [chat.sender.id]: false,
            }));
        }
    };

    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : "U";
    };

    const getOnlineStatus = () => {
        return Math.random() > 0.3;
    };

    // Calculate total unread messages
    const totalUnread = allConversations.reduce(
        (total, conv) => total + (conv.unreadCount || 0),
        0
    );

    return (
        <>
            {/* Chat Sidebar Toggle Button */}
            <div className="fixed bottom-6 left-6 z-30">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-primary hover:bg-primary-focus text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 relative"
                >
                    <MessageCircle className="w-6 h-6" />
                    {totalUnread > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-medium">
                            {totalUnread}
                        </span>
                    )}
                </button>
            </div>

            {/* Facebook-style Chat Sidebar */}
            <div
                className={`fixed right-0 top-0 h-full z-40 transition-all duration-300 ${
                    isOpen ? "w-80 translate-x-0" : "w-0 translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full bg-white border-l border-gray-200 shadow-2xl">
                    {/* Sidebar Header */}
                    <div className="p-4 border-b border-gray-200 bg-white">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-800">
                                Chats {totalUnread > 0 && `(${totalUnread})`}
                            </h3>
                            <div className="flex items-center space-x-1">
                                <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                                    <Video className="w-4 h-4 text-gray-600" />
                                </button>
                                <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                                    <MoreVertical className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="mt-3 relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search messages..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                            />
                        </div>
                    </div>

                    {/* Conversations List */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredConversations.length === 0 ? (
                            <div
                                key="no-conversations"
                                className="text-center text-gray-500 text-sm py-8"
                            >
                                {searchTerm
                                    ? "No conversations found"
                                    : "No conversations yet"}
                            </div>
                        ) : (
                            filteredConversations.map((conversation) => (
                                <button
                                    key={`conv-${conversation.sender.id}`}
                                    onClick={() => startChat(conversation)}
                                    className={`w-full p-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                                        activeChat?.sender?.id ===
                                        conversation.sender.id
                                            ? "bg-blue-50 border-blue-200"
                                            : ""
                                    } ${
                                        openChats.length >= 4 &&
                                        !openChats.find(
                                            (chat) =>
                                                chat.sender.id ===
                                                conversation.sender.id
                                        )
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                    disabled={
                                        openChats.length >= 4 &&
                                        !openChats.find(
                                            (chat) =>
                                                chat.sender.id ===
                                                conversation.sender.id
                                        )
                                    }
                                >
                                    <div className="flex space-x-3">
                                        {/* Avatar */}
                                        <div className="flex-shrink-0 relative">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                {getInitials(
                                                    conversation.sender.name
                                                )}
                                            </div>
                                            {getOnlineStatus() && (
                                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                            )}
                                        </div>

                                        {/* Conversation Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <p className="font-medium text-sm text-gray-900 truncate">
                                                    {conversation.sender.name}
                                                </p>
                                                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                                    {conversation.latestMessage &&
                                                        formatDate(
                                                            conversation
                                                                .latestMessage
                                                                .created_at
                                                        )}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 truncate mt-1">
                                                {conversation.latestMessage
                                                    ?.message || "Say hello!"}
                                            </p>
                                        </div>

                                        {/* Unread Badge */}
                                        {conversation.unreadCount > 0 && (
                                            <div className="flex-shrink-0">
                                                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-5 text-center">
                                                    {conversation.unreadCount}
                                                </span>
                                            </div>
                                        )}

                                        {/* Max limit indicator */}
                                        {openChats.length >= 4 &&
                                            !openChats.find(
                                                (chat) =>
                                                    chat.sender.id ===
                                                    conversation.sender.id
                                            ) && (
                                                <div className="flex-shrink-0">
                                                    <span className="bg-gray-500 text-white text-xs rounded-full px-2 py-1">
                                                        Max
                                                    </span>
                                                </div>
                                            )}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Horizontal Chat Windows - Positioned at bottom right */}
            <div className="fixed bottom-4 right-4 z-50 flex items-end">
                {openChats.map((chat, index) => (
                    <div
                        key={`chat-${chat.sender.id}-${
                            chat._instanceId || index
                        }`}
                        className={`backdrop-blur-md bg-white/90 rounded-xl shadow-2xl border border-gray-200 transition-all duration-300 flex flex-col ${
                            chat.isMinimized ? "h-14" : "h-96"
                        } w-80`}
                        style={{
                            marginLeft: index === 0 ? 0 : "20px",
                            zIndex: 50 + index,
                        }}
                    >
                        {/* Header */}
                        <div
                            className={`flex items-center justify-between px-3 py-2 rounded-t-xl cursor-pointer border-b ${
                                activeChat?.sender?.id === chat.sender.id
                                    ? "bg-primary text-white border-primary"
                                    : "bg-gray-100 border-gray-200"
                            } transition-colors`}
                            onClick={() => setActiveChat(chat)}
                        >
                            <div className="flex items-center space-x-2 min-w-0">
                                <div
                                    className={`w-2 h-2 rounded-full ${
                                        getOnlineStatus()
                                            ? "bg-green-400"
                                            : "bg-gray-400"
                                    }`}
                                ></div>

                                <span
                                    className={`font-semibold text-sm truncate ${
                                        activeChat?.sender?.id ===
                                        chat.sender.id
                                            ? "text-white"
                                            : "text-gray-800"
                                    }`}
                                >
                                    {chat.sender.name}
                                </span>
                            </div>

                            <div className="flex items-center space-x-1">
                                <button
                                    onClick={(e) =>
                                        toggleMinimizeChat(chat.sender.id, e)
                                    }
                                    className="p-1 rounded hover:bg-white/20 transition"
                                >
                                    {chat.isMinimized ? (
                                        <Maximize2 className="w-4 h-4" />
                                    ) : (
                                        <Minimize2 className="w-4 h-4" />
                                    )}
                                </button>
                                <button
                                    onClick={(e) =>
                                        closeChat(chat.sender.id, e)
                                    }
                                    className="p-1 rounded hover:bg-white/20 transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        {!chat.isMinimized && (
                            <div className="flex flex-col flex-1 overflow-hidden">
                                <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
                                    {chat.messages?.length === 0 ? (
                                        <div
                                            key="no-messages"
                                            className="text-center text-gray-500 text-sm py-10"
                                        >
                                            No messages yet. Start a
                                            conversation!
                                        </div>
                                    ) : (
                                        chat.messages.map((message) => {
                                            const isMine =
                                                message.sender_id ===
                                                auth.user.id;

                                            return (
                                                <div
                                                    key={message._key}
                                                    className={`flex ${
                                                        isMine
                                                            ? "justify-end"
                                                            : "justify-start"
                                                    }`}
                                                >
                                                    <div
                                                        className={`max-w-[75%] px-3 py-2 rounded-2xl shadow-sm ${
                                                            isMine
                                                                ? "bg-primary text-white rounded-br-none"
                                                                : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
                                                        } ${
                                                            message.status ===
                                                            "Sending"
                                                                ? "opacity-70"
                                                                : message.status ===
                                                                  "Failed"
                                                                ? "bg-red-100 border-red-300"
                                                                : ""
                                                        }`}
                                                    >
                                                        {/* Show replied message if exists */}
                                                        {message.original_message && (
                                                            <div className="mb-2 p-2 bg-black/10 rounded-lg text-xs">
                                                                <div className="font-medium">
                                                                    {
                                                                        message
                                                                            .original_message
                                                                            .sender
                                                                            ?.name
                                                                    }
                                                                </div>
                                                                <div className="truncate">
                                                                    {
                                                                        message
                                                                            .original_message
                                                                            .message
                                                                    }
                                                                </div>
                                                            </div>
                                                        )}
                                                        <p className="text-sm leading-snug">
                                                            {message.message}
                                                        </p>
                                                        <p
                                                            className={`text-[10px] mt-1 text-right ${
                                                                isMine
                                                                    ? "text-primary-100"
                                                                    : "text-gray-500"
                                                            } ${
                                                                message.status ===
                                                                "Failed"
                                                                    ? "text-red-500"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {formatTime(
                                                                message.created_at
                                                            )}
                                                            {message.status ===
                                                                "Sending" &&
                                                                " • Sending..."}
                                                            {message.status ===
                                                                "Failed" &&
                                                                " • Failed to send"}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}

                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Area */}
                                <div className="p-3 border-t bg-white">
                                    <form
                                        onSubmit={(e) =>
                                            handleSendMessage(chat, e)
                                        }
                                        className="flex items-center space-x-2"
                                    >
                                        <input
                                            type="text"
                                            value={
                                                chatInputs[chat.sender.id] || ""
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    chat.sender.id,
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Type a message..."
                                            className="flex-1 rounded-full border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                                            disabled={
                                                isLoading[chat.sender.id] ||
                                                processing
                                            }
                                        />

                                        <button
                                            type="submit"
                                            disabled={
                                                processing ||
                                                isLoading[chat.sender.id] ||
                                                !chatInputs[
                                                    chat.sender.id
                                                ]?.trim()
                                            }
                                            className="bg-primary hover:bg-primary-focus text-white p-2 rounded-full transition disabled:bg-gray-400"
                                        >
                                            {isLoading[chat.sender.id] ? (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <Send className="w-4 h-4" />
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    key="overlay"
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {openChats.length >= 4 && (
                <div
                    key="max-limit-notification"
                    className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm"
                >
                    Maximum of 4 chat windows reached. Close one to open
                    another.
                </div>
            )}
        </>
    );
}
