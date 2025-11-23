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

export default function FloatingConversation({ auth, isOpen, onClose }) {
    const [activeChat, setActiveChat] = useState(null);
    const [openChats, setOpenChats] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState({});
    const [allConversations, setAllConversations] = useState([]);
    const [pollingError, setPollingError] = useState(null);
    const messagesEndRef = useRef(null);
    const pollingInterval = useRef(null);
    const continuousPollingInterval = useRef(null);
    const messageCounter = useRef(0);
    const lastMessageTimeRef = useRef({});
    const lastPollTimeRef = useRef(Date.now());
    const { processing } = useForm();

    const { props } = usePage();
    const { messages = {} } = props;
    const { conversations: initialConversations = [] } = messages;

    const [chatInputs, setChatInputs] = useState({});

    // Create a ref for the sidebar
    const sidebarRef = useRef(null);

    // State for window size detection
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== "undefined" ? window.innerWidth : 0,
        height: typeof window !== "undefined" ? window.innerHeight : 0,
    });

    // Detect window size changes
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Initial call
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Determine device type and max chat windows
    const isMobile = windowSize.width < 768;
    const isTablet = windowSize.width >= 768 && windowSize.width < 1024;
    const isDesktop = windowSize.width >= 1024;

    const getMaxChatWindows = () => {
        if (isMobile) return 1;
        if (isTablet) return 2;
        return 3; // Desktop
    };

    const maxChatWindows = getMaxChatWindows();

    // Click outside handler to close sidebar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isOpen &&
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target) &&
                !event.target.closest(".chat-toggle-button") &&
                !event.target.closest(".chat-window")
            ) {
                if (onClose) {
                    onClose();
                } else {
                    setIsOpen(false);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Initialize with initial conversations
    useEffect(() => {
        setAllConversations(initialConversations);
    }, [initialConversations]);

    const isValidDate = (dateString) => {
        if (!dateString) return false;
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    };

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

    const generateMessageKey = (message, index = 0) => {
        if (message.id) {
            return `msg-${message.id}`;
        }
        if (message.temp_id) {
            return `temp-${message.temp_id}`;
        }
        messageCounter.current += 1;
        return `msg-${Date.now()}-${messageCounter.current}-${index}`;
    };

    // Enhanced polling function
    const pollForChatWindows = async (targetChatIds = null) => {
        try {
            let chatIdsToPoll;
            if (targetChatIds) {
                chatIdsToPoll = targetChatIds;
            } else if (openChats.length > 0) {
                chatIdsToPoll = openChats.map((chat) => chat.sender.id);
            } else {
                return;
            }

            if (chatIdsToPoll.length === 0) return;

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
                        focus_chat_windows: true,
                    },
                }
            );

            const updatedConversations = response.data.messages || [];
            lastPollTimeRef.current = Date.now();

            let hasNewMessages = false;

            setOpenChats((prevOpenChats) => {
                return prevOpenChats.map((openChat) => {
                    const updatedConversation = updatedConversations.find(
                        (conv) => conv.sender.id === openChat.sender.id
                    );

                    if (updatedConversation) {
                        const currentMessageIds = new Set(
                            openChat.messages
                                .map((msg) => msg.id)
                                .filter(Boolean)
                        );
                        const newMessages = (
                            updatedConversation.messages || []
                        ).filter(
                            (serverMsg) =>
                                serverMsg.id &&
                                !currentMessageIds.has(serverMsg.id)
                        );

                        if (newMessages.length > 0) {
                            hasNewMessages = true;
                        }

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

                        return updatedChat;
                    }
                    return openChat;
                });
            });

            if (activeChat) {
                const updatedActiveChatData = updatedConversations.find(
                    (conv) => conv.sender.id === activeChat.sender.id
                );
                if (updatedActiveChatData) {
                    setActiveChat((prev) => {
                        if (!prev) return prev;
                        const currentOpenChat = openChats.find(
                            (chat) => chat.sender.id === activeChat.sender.id
                        );
                        return (
                            currentOpenChat || {
                                ...prev,
                                unreadCount:
                                    updatedActiveChatData.unreadCount || 0,
                                latestMessage:
                                    updatedActiveChatData.latestMessage,
                            }
                        );
                    });
                }
            }

            setAllConversations((prevAllConversations) => {
                return prevAllConversations.map((conv) => {
                    const updatedConv = updatedConversations.find(
                        (updated) => updated.sender.id === conv.sender.id
                    );
                    return updatedConv || conv;
                });
            });

            if (hasNewMessages) {
                setTimeout(scrollToBottom, 150);
            }

            setPollingError(null);
        } catch (error) {
            console.error("Chat window polling error:", error);
            setPollingError("Connection issue - retrying...");
        }
    };

    const startChatWindowPolling = () => {
        if (continuousPollingInterval.current) {
            clearInterval(continuousPollingInterval.current);
        }

        continuousPollingInterval.current = setInterval(() => {
            if (openChats.length > 0) {
                pollForChatWindows().catch((error) => {
                    console.error("Polling error:", error);
                });
            }
        }, 2000);
    };

    const stopChatWindowPolling = () => {
        if (continuousPollingInterval.current) {
            clearInterval(continuousPollingInterval.current);
            continuousPollingInterval.current = null;
        }
    };

    const triggerImmediatePoll = (chatId) => {
        lastMessageTimeRef.current[chatId] = Date.now();
        Promise.resolve()
            .then(() => pollForChatWindows([chatId]))
            .catch(console.error);
    };

    // Restart polling when openChats changes
    useEffect(() => {
        startChatWindowPolling();
        return () => {
            stopChatWindowPolling();
            if (pollingInterval.current) {
                clearInterval(pollingInterval.current);
            }
        };
    }, []);

    useEffect(() => {
        if (openChats.length > 0) {
            startChatWindowPolling();
            pollForChatWindows().catch(console.error);
        }
    }, [
        openChats.length,
        JSON.stringify(openChats.map((chat) => chat.sender.id)),
    ]);

    useEffect(() => {
        if (openChats.length > 0 && activeChat) {
            triggerImmediatePoll(activeChat.sender.id);
        }
    }, [activeChat?.sender?.id]);

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

    const filteredConversations = allConversations.filter((conversation) =>
        conversation.sender?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    const startChat = (conversation) => {
        const existingChatIndex = openChats.findIndex(
            (chat) => chat.sender.id === conversation.sender.id
        );

        if (existingChatIndex !== -1) {
            const existingChat = openChats[existingChatIndex];
            setActiveChat(existingChat);

            if (existingChat.isMinimized) {
                setOpenChats((prev) =>
                    prev.map((chat) =>
                        chat.sender.id === conversation.sender.id
                            ? { ...chat, isMinimized: false }
                            : chat
                    )
                );
            }

            triggerImmediatePoll(conversation.sender.id);
            return;
        }

        let newOpenChats = [...openChats];

        // Handle different screen sizes
        if (newOpenChats.length >= maxChatWindows) {
            if (isMobile) {
                // Mobile: replace the existing chat
                newOpenChats = [];
            } else {
                // Tablet and Desktop: remove the oldest chat
                newOpenChats = newOpenChats.slice(1);
            }
        }

        const latestMessage = conversation.latestMessage;
        const projectPublicId = latestMessage?.project_public_id;
        const bookingPublicId = latestMessage?.booking_public_id;

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

        setTimeout(() => {
            triggerImmediatePoll(conversation.sender.id);
        }, 100);
    };

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

        setChatInputs((prev) => ({
            ...prev,
            [chat.sender.id]: "",
        }));

        setIsLoading((prev) => ({
            ...prev,
            [chat.sender.id]: true,
        }));

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

        setAllConversations((prev) =>
            prev.map((conv) =>
                conv.sender.id === chat.sender.id
                    ? {
                          ...conv,
                          latestMessage: optimisticMessage,
                          unreadCount: conv.unreadCount,
                      }
                    : conv
            )
        );

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

                setTimeout(() => {
                    triggerImmediatePoll(chat.sender.id);
                }, 500);
            } else {
                throw new Error(result.message || "Failed to send message");
            }
        } catch (error) {
            console.error("Error sending message:", error);

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

    const totalUnread = allConversations.reduce(
        (total, conv) => total + (conv.unreadCount || 0),
        0
    );

    // Responsive chat window dimensions - FIXED: Added parameters
    const getChatWindowStyles = (chat, index) => {
        if (isMobile) {
            return {
                width: "calc(100vw - 2rem)",
                height: chat.isMinimized ? "3.5rem" : "24rem",
                maxWidth: "400px",
                marginLeft: 0,
                marginBottom: "1rem",
            };
        } else if (isTablet) {
            return {
                width: "22rem",
                height: chat.isMinimized ? "3.5rem" : "28rem",
                marginLeft: index === 0 ? 0 : "1rem",
            };
        } else {
            return {
                width: "20rem",
                height: chat.isMinimized ? "3.5rem" : "24rem",
                marginLeft: index === 0 ? 0 : "1.25rem",
            };
        }
    };

    return (
        <>
            {/* Chat Sidebar Toggle Button */}
            {!onClose && (
                <div
                    className={`fixed ${
                        isMobile ? "bottom-4 right-4" : "bottom-6 left-6"
                    } z-30`}
                >
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="chat-toggle-button bg-primary hover:bg-primary-focus text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 relative"
                    >
                        <MessageCircle className="w-6 h-6" />
                        {totalUnread > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-medium">
                                {totalUnread}
                            </span>
                        )}
                    </button>
                </div>
            )}

            {/* Facebook-style Chat Sidebar */}
            <div
                ref={sidebarRef}
                className={`fixed right-0 top-0 h-full z-40 transition-all duration-300 ${
                    isOpen
                        ? `${isMobile ? "w-full" : "w-80"} translate-x-0`
                        : "w-0 translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full bg-white border-l border-gray-200 shadow-2xl">
                    <div className="p-4 border-b border-gray-200 bg-white">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-800">
                                Chats {totalUnread > 0 && `(${totalUnread})`}
                            </h3>
                            <div className="flex items-center space-x-1">
                                {onClose && (
                                    <button
                                        onClick={onClose}
                                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                                    >
                                        <X className="w-4 h-4 text-gray-600" />
                                    </button>
                                )}
                                <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                                    <Video className="w-4 h-4 text-gray-600" />
                                </button>
                                <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                                    <MoreVertical className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>
                        </div>

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

                    <div className="flex-1 overflow-y-auto">
                        {filteredConversations.length === 0 ? (
                            <div className="text-center text-gray-500 text-sm py-8">
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
                                        openChats.length >= maxChatWindows &&
                                        !openChats.find(
                                            (chat) =>
                                                chat.sender.id ===
                                                conversation.sender.id
                                        )
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                    disabled={
                                        openChats.length >= maxChatWindows &&
                                        !openChats.find(
                                            (chat) =>
                                                chat.sender.id ===
                                                conversation.sender.id
                                        )
                                    }
                                >
                                    <div className="flex space-x-3">
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

                                        {conversation.unreadCount > 0 && (
                                            <div className="flex-shrink-0">
                                                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-5 text-center">
                                                    {conversation.unreadCount}
                                                </span>
                                            </div>
                                        )}

                                        {openChats.length >= maxChatWindows &&
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

            {/* Horizontal Chat Windows - Fully Responsive */}
            <div
                className={`fixed z-50 flex items-end chat-window ${
                    isMobile
                        ? "bottom-0 left-0 right-0 justify-center px-4 pb-4 flex-col space-y-2"
                        : "bottom-4 right-4 flex-row"
                }`}
            >
                {openChats.map((chat, index) => {
                    // FIXED: Pass chat and index as parameters
                    const styles = getChatWindowStyles(chat, index);
                    return (
                        <div
                            key={`chat-${chat.sender.id}-${
                                chat._instanceId || index
                            }`}
                            className={`backdrop-blur-md bg-white/90 rounded-xl shadow-2xl border border-gray-200 transition-all duration-300 flex flex-col ${
                                isMobile ? "mx-auto" : ""
                            }`}
                            style={{
                                ...styles,
                                zIndex: 50 + index,
                            }}
                        >
                            <div
                                className={`flex items-center justify-between px-3 py-2 rounded-t-xl border-b ${
                                    activeChat?.sender?.id === chat.sender.id
                                        ? "bg-primary text-white border-primary"
                                        : "bg-gray-100 border-gray-200"
                                } transition-colors`}
                            >
                                <div className="flex items-center space-x-2 min-w-0">
                                    <div
                                        className={`w-2 h-2 rounded-full ${
                                            getOnlineStatus()
                                                ? "bg-green-400"
                                                : "bg-gray-400"
                                        }`}
                                    ></div>

                                    <button
                                        onClick={() => {
                                            setActiveChat(chat);
                                            toggleMinimizeChat(chat.sender.id);
                                        }}
                                        className="min-w-0 group"
                                    >
                                        <span
                                            className={`font-semibold text-sm truncate transition-all duration-200 ${
                                                activeChat?.sender?.id ===
                                                chat.sender.id
                                                    ? "text-white"
                                                    : "text-gray-800"
                                            } group-hover:underline underline-offset-2 decoration-2`}
                                            title={`Click to ${
                                                chat.isMinimized
                                                    ? "maximize"
                                                    : "minimize"
                                            }`}
                                        >
                                            {chat.sender.name}
                                        </span>
                                    </button>
                                </div>

                                <div className="flex items-center space-x-1">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveChat(chat);
                                            toggleMinimizeChat(
                                                chat.sender.id,
                                                e
                                            );
                                        }}
                                        className="p-1 rounded hover:bg-white/20 transition"
                                        title={
                                            chat.isMinimized
                                                ? "Maximize"
                                                : "Minimize"
                                        }
                                    >
                                        {chat.isMinimized ? (
                                            <Maximize2 className="w-4 h-4" />
                                        ) : (
                                            <Minimize2 className="w-4 h-4" />
                                        )}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            closeChat(chat.sender.id, e);
                                        }}
                                        className="p-1 rounded hover:bg-white/20 transition"
                                        title="Close chat"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {!chat.isMinimized && (
                                <div className="flex flex-col flex-1 overflow-hidden">
                                    <div
                                        className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50"
                                        onClick={() => setActiveChat(chat)}
                                    >
                                        {chat.messages?.length === 0 ? (
                                            <div className="text-center text-gray-500 text-sm py-10">
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
                                                            className={`max-w-[85%] px-3 py-2 rounded-2xl shadow-sm ${
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
                                                            <p className="text-sm leading-snug break-words">
                                                                {
                                                                    message.message
                                                                }
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
                                                    chatInputs[
                                                        chat.sender.id
                                                    ] || ""
                                                }
                                                onChange={(e) => {
                                                    handleInputChange(
                                                        chat.sender.id,
                                                        e.target.value
                                                    );
                                                    if (
                                                        e.target.value.trim() &&
                                                        activeChat?.sender
                                                            ?.id !==
                                                            chat.sender.id
                                                    ) {
                                                        setActiveChat(chat);
                                                    }
                                                }}
                                                onFocus={() => {
                                                    if (
                                                        activeChat?.sender
                                                            ?.id !==
                                                        chat.sender.id
                                                    ) {
                                                        setActiveChat(chat);
                                                    }
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (
                                                        activeChat?.sender
                                                            ?.id !==
                                                        chat.sender.id
                                                    ) {
                                                        setActiveChat(chat);
                                                    }
                                                }}
                                                placeholder="Type a message..."
                                                className="flex-1 rounded-full border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                                                disabled={
                                                    isLoading[chat.sender.id] ||
                                                    processing
                                                }
                                            />
                                            <button
                                                type="submit"
                                                onClick={() => {
                                                    if (
                                                        activeChat?.sender
                                                            ?.id !==
                                                        chat.sender.id
                                                    ) {
                                                        setActiveChat(chat);
                                                    }
                                                }}
                                                onFocus={() => {
                                                    if (
                                                        activeChat?.sender
                                                            ?.id !==
                                                        chat.sender.id
                                                    ) {
                                                        setActiveChat(chat);
                                                    }
                                                }}
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
                    );
                })}
            </div>

            {/* Overlay for mobile */}
            {isOpen && onClose && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Responsive max limit notification */}
            {openChats.length >= maxChatWindows && (
                <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm max-w-xs text-center">
                    {isMobile
                        ? "Only 1 chat allowed on mobile. New chats replace current ones."
                        : isTablet
                        ? "Maximum of 2 chats on tablet. Close one to open another."
                        : "Maximum of 3 chats reached. Close one to open another."}
                </div>
            )}
        </>
    );
}
