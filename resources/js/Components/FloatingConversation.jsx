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

    // Chat message polling refs
    const chatPollingIntervals = useRef({}); // Separate intervals for each chat
    const [isChatPollingActive, setIsChatPollingActive] = useState({});
    const [lastMessageIds, setLastMessageIds] = useState({});

    // State for tracking real-time message updates
    const [messageUpdateIndicator, setMessageUpdateIndicator] = useState({});
    const [optimisticMessages, setOptimisticMessages] = useState({});
    const [sendingMessages, setSendingMessages] = useState({});

    // Create a ref for the sidebar
    const sidebarRef = useRef(null);

    // State for window size detection
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== "undefined" ? window.innerWidth : 0,
        height: typeof window !== "undefined" ? window.innerHeight : 0,
    });

    // State for showing max chat limit notification
    const [showMaxLimitNotification, setShowMaxLimitNotification] =
        useState(false);

    // Get user role safely
    const userRole = auth?.user?.role || "Volunteer"; // Default to Volunteer if not available

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
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    const { props } = usePage();
    const { messages = {} } = props;
    const { conversations: initialConversations = [] } = messages;

    const [chatInputs, setChatInputs] = useState({});
    const [loadingChats, setLoadingChats] = useState({});

    // Initialize with initial conversations
    useEffect(() => {
        setAllConversations(initialConversations);
        // Initialize last message IDs
        const initialLastMessageIds = {};
        initialConversations.forEach((conv) => {
            if (conv.messages && conv.messages.length > 0) {
                const lastMsg = conv.messages[conv.messages.length - 1];
                initialLastMessageIds[conv.sender.id] =
                    lastMsg.id || lastMsg.temp_id;
            }
        });
        setLastMessageIds(initialLastMessageIds);
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
        // For optimistic messages without ID, use a combination of timestamp and index
        return `opt-${Date.now()}-${index}`;
    };

    // ==============================
    // CHAT-SPECIFIC POLLING FUNCTIONS
    // ==============================

    // Poll for new messages in a specific chat
    // Poll for new messages in a specific chat
    const pollChatMessages = async (chatId, senderId) => {
        if (!chatId || !senderId || isChatPollingActive[chatId]) return;

        setIsChatPollingActive((prev) => ({ ...prev, [chatId]: true }));

        try {
            const response = await axios.get(
                route(
                    userRole === "Organization"
                        ? "organization.messages"
                        : "volunteer.messages"
                ),
                {
                    params: {
                        polling: true,
                        chat_id: chatId,
                        sender_id: senderId,
                        last_message_id: lastMessageIds[senderId] || null,
                        timestamp: Date.now(),
                    },
                }
            );

            const updatedConversations = response.data.messages || [];
            const updatedConversation = updatedConversations.find(
                (conv) => conv.sender.id === senderId
            );

            if (updatedConversation && updatedConversation.messages) {
                const serverMessages = updatedConversation.messages;

                // Find the latest message ID (skip null IDs)
                if (serverMessages.length > 0) {
                    // Find the latest message with a non-null ID
                    const validServerMessages = serverMessages.filter(
                        (msg) => msg.id !== null
                    );
                    if (validServerMessages.length > 0) {
                        const lastServerMsg =
                            validServerMessages[validServerMessages.length - 1];
                        const newLastMessageId = lastServerMsg.id;

                        // Check if we have new messages
                        const hadNewMessages =
                            newLastMessageId !== lastMessageIds[senderId];

                        if (hadNewMessages) {
                            setLastMessageIds((prev) => ({
                                ...prev,
                                [senderId]: newLastMessageId,
                            }));

                            // Show notification for new messages if chat is minimized or not active
                            const isChatActive =
                                activeChat?.sender?.id === senderId;
                            const chatWindow = openChats.find(
                                (c) => c.sender.id === senderId
                            );
                            if (
                                !isChatActive ||
                                (chatWindow && chatWindow.isMinimized)
                            ) {
                                setMessageUpdateIndicator((prev) => ({
                                    ...prev,
                                    [senderId]: (prev[senderId] || 0) + 1,
                                }));
                            }

                            // Update messages in the chat
                            updateChatMessages(
                                chatId,
                                senderId,
                                serverMessages
                            );

                            // ALWAYS scroll to bottom when new messages arrive from polling
                            // This is the key change - remove the condition
                            setTimeout(scrollToBottom, 100);
                        }
                    }
                }
            }

            setPollingError(null);
        } catch (error) {
            console.error(`Polling error for chat ${chatId}:`, error);
            if (
                error.response?.status !== 401 &&
                error.response?.status !== 403
            ) {
                setPollingError("Connection issue - retrying...");
            }
        } finally {
            setIsChatPollingActive((prev) => ({ ...prev, [chatId]: false }));
        }
    };

    // Start polling for a specific chat
    const startChatPolling = (chatId, senderId) => {
        if (!chatId || !senderId) return;

        // Clear existing interval for this chat
        if (chatPollingIntervals.current[chatId]) {
            clearInterval(chatPollingIntervals.current[chatId]);
        }

        // Poll immediately
        pollChatMessages(chatId, senderId);

        // Set up interval for polling (every 2 seconds for active chat, 5 seconds for others)
        const isActiveChat = activeChat?.sender?.id === senderId;
        const pollInterval = isActiveChat ? 2000 : 5000;

        chatPollingIntervals.current[chatId] = setInterval(() => {
            pollChatMessages(chatId, senderId);
        }, pollInterval);
    };

    // Stop polling for a specific chat
    const stopChatPolling = (chatId) => {
        if (chatPollingIntervals.current[chatId]) {
            clearInterval(chatPollingIntervals.current[chatId]);
            delete chatPollingIntervals.current[chatId];
        }
        setIsChatPollingActive((prev) => ({ ...prev, [chatId]: false }));
    };

    // Update chat messages with server data - FIXED VERSION
    // Update the updateChatMessages function to properly replace temp messages:

    // Update the updateChatMessages function to ensure temp messages are properly replaced:

    const updateChatMessages = (chatId, senderId, serverMessages) => {
        setOpenChats((prevOpenChats) => {
            return prevOpenChats.map((openChat) => {
                if (openChat.sender.id === senderId) {
                    const currentMessages = openChat.messages || [];

                    // Create a map of server message IDs for quick lookup
                    const serverMessageMap = new Map();
                    serverMessages.forEach((msg) => {
                        if (msg.id) serverMessageMap.set(msg.id, msg);
                    });

                    // Update existing messages: replace null ID messages with database messages
                    const updatedMessages = currentMessages.map((msg) => {
                        // If this is an optimistic message (null ID) and we received a server message
                        // that matches the content and sender
                        if (msg.id === null) {
                            // Look for a server message with similar content and same sender
                            const matchingServerMsg = serverMessages.find(
                                (serverMsg) =>
                                    serverMsg.message === msg.message &&
                                    serverMsg.sender_id === msg.sender_id &&
                                    // Check if timestamps are close (within 10 seconds)
                                    Math.abs(
                                        new Date(serverMsg.created_at) -
                                            new Date(msg.created_at)
                                    ) < 10000
                            );

                            if (matchingServerMsg) {
                                // Replace the optimistic message with the database message
                                return {
                                    ...matchingServerMsg,
                                    _key: generateMessageKey(matchingServerMsg), // Update key with real ID
                                };
                            }
                        }
                        return msg;
                    });

                    // Remove duplicates (messages with same ID)
                    const uniqueMessages = [];
                    const seenIds = new Set();

                    updatedMessages.forEach((msg) => {
                        const id = msg.id;
                        if (!id || !seenIds.has(id)) {
                            if (id) seenIds.add(id);
                            uniqueMessages.push(msg);
                        }
                    });

                    // Add any new server messages that aren't already in our list
                    serverMessages.forEach((serverMsg) => {
                        if (serverMsg.id && !seenIds.has(serverMsg.id)) {
                            seenIds.add(serverMsg.id);
                            uniqueMessages.push(serverMsg);
                        }
                    });

                    // Sort chronologically
                    const sortedMessages = uniqueMessages.sort(
                        (a, b) =>
                            new Date(a.created_at) - new Date(b.created_at)
                    );

                    return {
                        ...openChat,
                        messages: sortedMessages,
                        latestMessage:
                            sortedMessages[sortedMessages.length - 1] ||
                            openChat.latestMessage,
                    };
                }
                return openChat;
            });
        });

        // Update active chat with similar logic
        if (activeChat?.sender?.id === senderId) {
            setActiveChat((prev) => {
                if (prev && prev.sender.id === senderId) {
                    const currentMessages = prev.messages || [];

                    const updatedMessages = currentMessages.map((msg) => {
                        if (msg.id === null) {
                            const matchingServerMsg = serverMessages.find(
                                (serverMsg) =>
                                    serverMsg.message === msg.message &&
                                    serverMsg.sender_id === msg.sender_id &&
                                    Math.abs(
                                        new Date(serverMsg.created_at) -
                                            new Date(msg.created_at)
                                    ) < 10000
                            );

                            if (matchingServerMsg) {
                                return {
                                    ...matchingServerMsg,
                                    _key: generateMessageKey(matchingServerMsg),
                                };
                            }
                        }
                        return msg;
                    });

                    const uniqueMessages = [];
                    const seenIds = new Set();

                    updatedMessages.forEach((msg) => {
                        const id = msg.id;
                        if (!id || !seenIds.has(id)) {
                            if (id) seenIds.add(id);
                            uniqueMessages.push(msg);
                        }
                    });

                    serverMessages.forEach((serverMsg) => {
                        if (serverMsg.id && !seenIds.has(serverMsg.id)) {
                            seenIds.add(serverMsg.id);
                            uniqueMessages.push(serverMsg);
                        }
                    });

                    const sortedMessages = uniqueMessages.sort(
                        (a, b) =>
                            new Date(a.created_at) - new Date(b.created_at)
                    );

                    return {
                        ...prev,
                        messages: sortedMessages,
                        latestMessage:
                            sortedMessages[sortedMessages.length - 1] ||
                            prev.latestMessage,
                    };
                }
                return prev;
            });
        }
    };

    // ==============================
    // CHAT MANAGEMENT FUNCTIONS
    // ==============================

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            try {
                // Try multiple methods to ensure we scroll to bottom
                const container = messagesEndRef.current.parentElement;
                if (container) {
                    // Method 1: Scroll to the element
                    messagesEndRef.current.scrollIntoView({
                        behavior: "smooth",
                        block: "end",
                    });

                    // Method 2: Also set scrollTop directly as backup
                    setTimeout(() => {
                        if (container.scrollHeight > container.clientHeight) {
                            container.scrollTop = container.scrollHeight;
                        }
                    }, 100);
                }
            } catch (error) {
                console.error("Error scrolling to bottom:", error);
            }
        }
    };

    useEffect(() => {
        // Scroll to bottom whenever activeChat messages change
        if (activeChat?.messages) {
            setTimeout(scrollToBottom, 50);
        }
    }, [activeChat?.messages]);

    useEffect(() => {
        if (activeChat) {
            // Scroll to bottom after a short delay to ensure DOM is updated
            setTimeout(scrollToBottom, 300);
        }
    }, [activeChat?._instanceId]);

    // Start/stop polling when active chat changes
    useEffect(() => {
        if (activeChat) {
            const chatId = activeChat._instanceId || activeChat.sender.id;
            const senderId = activeChat.sender.id;

            // Start polling for active chat
            startChatPolling(chatId, senderId);

            // Clear message indicator for this chat
            setMessageUpdateIndicator((prev) => ({
                ...prev,
                [senderId]: 0,
            }));
        }

        return () => {
            // Cleanup function - stop polling when component unmounts
            Object.keys(chatPollingIntervals.current).forEach((chatId) => {
                stopChatPolling(chatId);
            });
        };
    }, [activeChat?.sender?.id]);

    // Start polling for all open chats
    useEffect(() => {
        openChats.forEach((chat) => {
            const chatId = chat._instanceId || chat.sender.id;
            const senderId = chat.sender.id;

            if (!chatPollingIntervals.current[chatId]) {
                startChatPolling(chatId, senderId);
            }
        });

        // Stop polling for chats that are no longer open
        Object.keys(chatPollingIntervals.current).forEach((chatId) => {
            const isStillOpen = openChats.some(
                (chat) => (chat._instanceId || chat.sender.id) === chatId
            );
            if (!isStillOpen) {
                stopChatPolling(chatId);
            }
        });
    }, [openChats.map((chat) => chat.sender.id).join(",")]);

    const filteredConversations = allConversations.filter((conversation) =>
        conversation.sender?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    const showMaxLimitMessage = () => {
        setShowMaxLimitNotification(true);
        setTimeout(() => {
            setShowMaxLimitNotification(false);
        }, 3000);
    };

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

            if (existingChat.unreadCount > 0) {
                markMessagesAsRead(conversation.sender.id);
            }

            // Trigger immediate poll for this chat
            const chatId = existingChat._instanceId || existingChat.sender.id;
            pollChatMessages(chatId, conversation.sender.id);

            return;
        }

        let newOpenChats = [...openChats];

        if (newOpenChats.length >= maxChatWindows) {
            showMaxLimitMessage();

            if (isMobile) {
                newOpenChats = [];
            } else {
                return;
            }
        }

        const latestMessage = conversation.latestMessage;
        const projectPublicId = latestMessage?.project_public_id;
        const bookingPublicId = latestMessage?.booking_public_id;

        const initialMessages = conversation.messages || [];
        const sanitizedMessages = initialMessages.map((msg, index) => ({
            ...msg,
            created_at: isValidDate(msg.created_at)
                ? msg.created_at
                : new Date().toISOString(),
            _key: generateMessageKey(msg, index),
        }));

        const newChat = {
            ...conversation,
            messages: sanitizedMessages,
            isMinimized: false,
            project_public_id: projectPublicId,
            booking_public_id: bookingPublicId,
            _instanceId: `${conversation.sender.id}-${Date.now()}`,
            unreadCount: conversation.unreadCount || 0,
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

        setLoadingChats((prev) => ({
            ...prev,
            [conversation.sender.id]: true,
        }));

        // Initialize last message ID for this chat
        if (sanitizedMessages.length > 0) {
            const lastMsg = sanitizedMessages[sanitizedMessages.length - 1];
            setLastMessageIds((prev) => ({
                ...prev,
                [conversation.sender.id]: lastMsg.id || lastMsg.temp_id,
            }));
        }

        // Start polling for this new chat
        setTimeout(() => {
            startChatPolling(newChat._instanceId, conversation.sender.id);
            setTimeout(() => {
                setLoadingChats((prev) => ({
                    ...prev,
                    [conversation.sender.id]: false,
                }));
            }, 1000);
        }, 100);
    };

    const markMessagesAsRead = async (senderId) => {
        try {
            const routeName =
                userRole === "Organization"
                    ? "organization.messages.mark-all-read"
                    : "volunteer.messages.mark-all-read";

            await router.patch(
                route(routeName, { senderId }),
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
                    onError: (error) => {
                        console.error("Error marking messages as read:", error);
                    },
                }
            );
        } catch (error) {
            console.error("Error marking messages as read:", error);
        }
    };

    const closeChat = (conversationId, e) => {
        e?.stopPropagation();

        const chatToClose = openChats.find(
            (chat) => chat.sender.id === conversationId
        );
        if (chatToClose) {
            stopChatPolling(chatToClose._instanceId || conversationId);
        }

        const updatedChats = openChats.filter(
            (chat) => chat.sender.id !== conversationId
        );
        setOpenChats(updatedChats);

        setChatInputs((prev) => {
            const newInputs = { ...prev };
            delete newInputs[conversationId];
            return newInputs;
        });

        // Clear optimistic messages for this chat
        setOptimisticMessages((prev) => {
            const newOptimistic = { ...prev };
            delete newOptimistic[conversationId];
            return newOptimistic;
        });

        setSendingMessages((prev) => {
            const newSending = { ...prev };
            delete newSending[conversationId];
            return newSending;
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
        const chatId = chat._instanceId || chat.sender.id;

        setChatInputs((prev) => ({
            ...prev,
            [chat.sender.id]: "",
        }));

        setIsLoading((prev) => ({
            ...prev,
            [chat.sender.id]: true,
        }));

        // Create optimistic message WITHOUT temp_id, with null ID
        const optimisticMessage = {
            id: null, // Start with null ID
            message: message,
            sender_id: auth?.user?.id || 0,
            receiver_id: receiverId,
            created_at: new Date().toISOString(),
            status: "Sending", // Initial status
            sender: {
                id: auth?.user?.id || 0,
                name: auth?.user?.name || "User",
                email: auth?.user?.email || "",
            },
            _key: generateMessageKey({ id: null }), // Generate key without ID
        };

        // Add to sending messages state (but we'll track it differently)
        setSendingMessages((prev) => ({
            ...prev,
            [chatId]: [...(prev[chatId] || []), optimisticMessage],
        }));

        // Update chat with optimistic message - Append to existing messages
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

        // Also update allConversations to show the new message in the sidebar
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
                    userRole === "Organization"
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
                // When server responds successfully, update the message status to "Sent"
                // We'll find the message with null ID and same content and update its status
                setOpenChats((prevOpenChats) => {
                    return prevOpenChats.map((openChat) => {
                        if (openChat.sender.id === chat.sender.id) {
                            const updatedMessages = openChat.messages.map(
                                (msg, index) => {
                                    // Find the optimistic message (null ID, "Sending" status, same content)
                                    if (
                                        msg.id === null &&
                                        msg.status === "Sending" &&
                                        msg.message === message &&
                                        // Make sure we're updating the most recent matching message
                                        index === openChat.messages.length - 1
                                    ) {
                                        return {
                                            ...msg,
                                            status: "Sent", // Update status to "Sent"
                                            // We'll keep id as null for now, polling will update it
                                        };
                                    }
                                    return msg;
                                }
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
                            const updatedMessages = prev.messages.map(
                                (msg, index) => {
                                    if (
                                        msg.id === null &&
                                        msg.status === "Sending" &&
                                        msg.message === message &&
                                        index === prev.messages.length - 1
                                    ) {
                                        return {
                                            ...msg,
                                            status: "Sent",
                                        };
                                    }
                                    return msg;
                                }
                            );

                            return {
                                ...prev,
                                messages: updatedMessages,
                            };
                        }
                        return prev;
                    });
                }

                // Trigger immediate poll for this chat to get the actual message from server
                setTimeout(() => {
                    pollChatMessages(chatId, chat.sender.id);
                }, 100);
            }
        } catch (error) {
            console.error("Error sending message:", error);

            // Update message status to failed
            setOpenChats((prevOpenChats) => {
                return prevOpenChats.map((openChat) => {
                    if (openChat.sender.id === chat.sender.id) {
                        const updatedMessages = openChat.messages.map(
                            (msg, index) => {
                                if (
                                    msg.id === null &&
                                    msg.status === "Sending" &&
                                    msg.message === message &&
                                    index === openChat.messages.length - 1
                                ) {
                                    return {
                                        ...msg,
                                        status: "Failed",
                                    };
                                }
                                return msg;
                            }
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
                        const updatedMessages = prev.messages.map(
                            (msg, index) => {
                                if (
                                    msg.id === null &&
                                    msg.status === "Sending" &&
                                    msg.message === message &&
                                    index === prev.messages.length - 1
                                ) {
                                    return {
                                        ...msg,
                                        status: "Failed",
                                    };
                                }
                                return msg;
                            }
                        );

                        return {
                            ...prev,
                            messages: updatedMessages,
                        };
                    }
                    return prev;
                });
            }

            // Update the conversation in sidebar to show failed status
            setAllConversations((prev) =>
                prev.map((conv) =>
                    conv.sender.id === chat.sender.id
                        ? {
                              ...conv,
                              latestMessage: {
                                  ...optimisticMessage,
                                  status: "Failed",
                              },
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

    // Don't render anything if auth is not available
    if (!auth) {
        return null;
    }

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
                        onClick={onClose}
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
                                    }`}
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
                                        {messageUpdateIndicator[
                                            conversation.sender.id
                                        ] > 0 && (
                                            <div className="flex-shrink-0">
                                                <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-5 text-center animate-pulse">
                                                    {
                                                        messageUpdateIndicator[
                                                            conversation.sender
                                                                .id
                                                        ]
                                                    }
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
                    const styles = getChatWindowStyles(chat, index);
                    const newMessageCount =
                        messageUpdateIndicator[chat.sender.id] || 0;

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
                                            if (chat.isMinimized) {
                                                toggleMinimizeChat(
                                                    chat.sender.id
                                                );
                                            }
                                        }}
                                        className="min-w-0 group relative"
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
                                        {newMessageCount > 0 &&
                                            chat.isMinimized && (
                                                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                                                    {newMessageCount}
                                                </span>
                                            )}
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
                                            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50">
                                                <div className="text-center">
                                                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                                    <p className="text-gray-500 text-sm font-medium mb-1">
                                                        No messages yet
                                                    </p>
                                                    <p className="text-gray-400 text-xs">
                                                        Start the conversation!
                                                    </p>
                                                    {loadingChats[
                                                        chat.sender.id
                                                    ] && (
                                                        <div className="mt-4">
                                                            <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                                                            <p className="text-xs text-gray-400 mt-2">
                                                                Loading
                                                                messages...
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            chat.messages.map((message) => {
                                                const isMine =
                                                    message.sender_id ===
                                                    auth?.user?.id;
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
                                                                    "Sent" &&
                                                                    " • Sent"}
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
                                                    isLoading[chat.sender.id] // Removed the undefined 'processing' variable
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
                                                    // Removed the undefined 'processing' variable
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
                                        {pollingError && (
                                            <div className="mt-2 text-xs text-red-500 text-center">
                                                {pollingError}
                                            </div>
                                        )}
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

            {/* Responsive max limit notification - Only shows when triggered */}
            {showMaxLimitNotification && (
                <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm max-w-xs text-center animate-fadeIn">
                    {isMobile
                        ? "Only 1 chat allowed on mobile. New chats replace current ones."
                        : isTablet
                        ? "Maximum of 2 chats on tablet. Close one to open another."
                        : "Maximum of 3 chats reached. Close one to open another."}
                </div>
            )}

            {/* Add inline CSS for fadeIn animation */}
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </>
    );
}
