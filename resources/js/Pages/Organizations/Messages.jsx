import OrganizationLayout from "@/Layouts/OrganizationLayout";
import { usePage, router } from "@inertiajs/react";
import { useState, useEffect, useCallback, useRef } from "react";
import {
    MessageSquare,
    ArrowLeft,
    Reply,
    Check,
    CheckCheck,
    AlertCircle,
    Phone,
    Mail,
    Link as LinkIcon,
    X,
    Menu,
    Search,
    Clock,
    User,
    Building,
    Star,
    Shield,
} from "lucide-react";

export default function Messages({
    // messages: initialMessages,
    receiverId,
    auth: propAuth,
}) {
    const { messages: initialMessages = [], auth } = usePage().props;
    const [groupedMessages, setGroupedMessages] = useState({});
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [isReplying, setIsReplying] = useState(false);
    const [replyToMessage, setReplyToMessage] = useState(null);
    const [highlightedMessageId, setHighlightedMessageId] = useState(null);
    const [showConversations, setShowConversations] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const messageRefs = useRef({});
    const messagesEndRef = useRef(null);
    const [contentWarning, setContentWarning] = useState(false);

    const selectedConversation = selectedConversationId
        ? groupedMessages[selectedConversationId]
        : null;

    // Determine if this is a paid project conversation and if payment was made
    const currentProject = selectedConversation?.project;
    const isPaidProject = currentProject?.type_of_project === "Paid";
    const hasPayment = currentProject?.has_payment || false;
    // Regex patterns for restricted content
    const restrictedPatterns = {
        phone: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
        email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
        url: /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g,
    };

    // Function to filter restricted content
    const filterContent = (text, isPaidProject, hasPayment) => {
        // If it's a paid project with payment, don't filter anything
        if (isPaidProject && hasPayment) {
            return { cleanedText: text, hasRestrictedContent: false };
        }

        let hasRestrictedContent = false;
        let cleanedText = text;

        // Check each pattern
        Object.values(restrictedPatterns).forEach((pattern) => {
            if (pattern.test(cleanedText)) {
                cleanedText = cleanedText.replace(pattern, "[content removed]");
                hasRestrictedContent = true;
            }
        });

        return { cleanedText, hasRestrictedContent };
    };

    // Initialize grouped messages from props
    useEffect(() => {
        const initialGrouped = initialMessages.reduce((acc, conversation) => {
            // Use conversation.sender instead of selectedConversation.sender
            if (!conversation.sender) return acc;

            const conversationWithPayment = {
                ...conversation,
                project: conversation.project
                    ? {
                          ...conversation.project,
                          has_payment:
                              conversation.project.has_payment || false,
                      }
                    : null,
            };

            acc[conversation.sender.user_id] = conversationWithPayment;
            return acc;
        }, {});

        setGroupedMessages(initialGrouped);

        // Select first conversation if none selected and there are valid conversations
        if (!selectedConversationId && Object.keys(initialGrouped).length > 0) {
            const firstKey = Object.keys(initialGrouped)[0];
            setSelectedConversationId(firstKey);
        }
    }, [initialMessages]);

    // Scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [groupedMessages, selectedConversationId]);

    // Hide content warning after 3 seconds
    useEffect(() => {
        if (contentWarning) {
            const timer = setTimeout(() => {
                setContentWarning(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [contentWarning]);
    // Handle highlighting a message
    useEffect(() => {
        if (highlightedMessageId) {
            const timer = setTimeout(() => {
                setHighlightedMessageId(null);
            }, 3000); // Remove highlight after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [highlightedMessageId]);

    const handleConversationClick = useCallback(
        (senderId) => {
            setSelectedConversationId(senderId);
            setIsReplying(false);
            setReplyToMessage(null);
            setHighlightedMessageId(null);
            setShowConversations(false); // Hide the menu after selection

            // Mark all messages as read if there are unread messages
            if (groupedMessages[senderId]?.unreadCount > 0) {
                router.patch(
                    route("organization.messages.mark-all-read", {
                        senderId: senderId,
                    }),
                    {},
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            // Update all messages to read status locally
                            setGroupedMessages((prev) => ({
                                ...prev,
                                [senderId]: {
                                    ...prev[senderId],
                                    unreadCount: 0,
                                    messages: prev[senderId].messages.map(
                                        (msg) => ({
                                            ...msg,
                                            status: "Read",
                                        })
                                    ),
                                    latestMessage: {
                                        ...prev[senderId].latestMessage,
                                        status: "Read",
                                    },
                                },
                            }));
                        },
                    }
                );
            }
        },
        [groupedMessages]
    );

    const handleReplyClick = (message) => {
        setIsReplying(true);
        setReplyToMessage(message);
    };

    const handleOriginalMessageClick = (messageId) => {
        setHighlightedMessageId(messageId);
        // Scroll to the original message
        messageRefs.current[messageId]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    };

    // Replace the current useEffect with:
    useEffect(() => {
        if (!receiverId) return;

        // Sort IDs to match the channel name in the event
        const ids = [auth.user.id, receiverId].sort((a, b) => a - b);
        const channelName = `message.${ids.join("-")}`;

        window.Echo.private(channelName).listen(".new.message", (e) => {
            console.log("Received message:", e.message);

            setGroupedMessages((prev) => {
                const updated = { ...prev };
                const conversationKey =
                    e.message.sender_id === auth.user.id
                        ? e.message.receiver_id
                        : e.message.sender_id;

                if (updated[conversationKey]) {
                    updated[conversationKey] = {
                        ...updated[conversationKey],
                        messages: [
                            ...updated[conversationKey].messages,
                            e.message,
                        ],
                        latestMessage: e.message,
                    };
                } else {
                    // Create new conversation if it doesn't exist
                    updated[conversationKey] = {
                        sender:
                            e.message.sender_id === auth.user.id
                                ? e.message.receiver
                                : e.message.sender,
                        messages: [e.message],
                        latestMessage: e.message,
                        unreadCount:
                            e.message.sender_id !== auth.user.id ? 1 : 0,
                        project: e.message.project_id
                            ? {
                                  id: e.message.project_id,
                                  type_of_project: "Unknown", // You might need to load this
                                  has_payment: false,
                              }
                            : null,
                    };
                }
                return updated;
            });
        });
    }, [receiverId, auth.user.id]);

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (!newMessage.trim() || !selectedConversationId) return;

        // Get the current conversation
        const currentConversation = groupedMessages[selectedConversationId];

        // Determine receiver ID
        const receiverId = currentConversation.sender.user_id;

        // Filter the message content
        const { cleanedText, hasRestrictedContent } = filterContent(
            newMessage,
            isPaidProject,
            hasPayment
        );

        if (hasRestrictedContent) {
            setContentWarning(true);
            setNewMessage(cleanedText);
            return;
        }

        // Get project and booking info
        const projectId = currentConversation?.project?.id || null;
        let bookingId = null;

        if (isReplying) {
            bookingId = replyToMessage.booking_id;
        } else if (projectId) {
            // Find booking between org and volunteer if available
            bookingId = currentConversation?.booking?.id || null;
        }

        router.post(
            route("organization.messages.store"),
            {
                receiver_id: receiverId,
                message: cleanedText,
                reply_to: isReplying ? replyToMessage.id : null,
                project_id: projectId,
                booking_id: bookingId,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setNewMessage("");
                    setIsReplying(false);
                    setReplyToMessage(null);

                    // Optimistically update the messages
                    const newMsg = {
                        id: Date.now(),
                        message: cleanedText,
                        sender_id: auth.user.id,
                        receiver_id: receiverId,
                        created_at: new Date().toISOString(),
                        status: "Read",
                        reply_to: isReplying ? replyToMessage.id : null,
                        original_message: isReplying ? replyToMessage : null,
                        project_id: projectId,
                        booking_id: bookingId,
                    };

                    setGroupedMessages((prev) => {
                        const updated = { ...prev };
                        const conversationKey = receiverId;

                        if (updated[conversationKey]) {
                            updated[conversationKey] = {
                                ...updated[conversationKey],
                                messages: [
                                    ...updated[conversationKey].messages,
                                    newMsg,
                                ],
                                latestMessage: newMsg,
                            };
                        } else {
                            updated[conversationKey] = {
                                sender: {
                                    id: receiverId,
                                    name:
                                        replyToMessage?.sender?.name ||
                                        "Unknown",
                                    email: replyToMessage?.sender?.email || "",
                                },
                                messages: [newMsg],
                                latestMessage: newMsg,
                                unreadCount: 0,
                            };
                        }

                        return updated;
                    });
                },
            }
        );
    };

    const getLastMessageTime = (conversation) => {
        if (!conversation.latestMessage?.created_at) return null;

        const messageDate = new Date(conversation.latestMessage.created_at);
        const now = new Date();
        const diffHours = Math.floor((now - messageDate) / (1000 * 60 * 60));

        if (diffHours < 24) {
            return messageDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });
        } else if (diffHours < 48) {
            return "Yesterday";
        } else {
            return messageDate.toLocaleDateString([], {
                month: "short",
                day: "numeric",
            });
        }
    };

    const filteredConversations = Object.values(groupedMessages).filter(
        (conversation) =>
            conversation.sender.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            conversation.latestMessage?.message
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase())
    );

    const getSenderTypeIcon = (conversation) => {
        if (conversation.sender?.type === "organization") {
            return <Building className="w-3 h-3" />;
        } else if (conversation.sender?.is_verified) {
            return <Shield className="w-3 h-3 text-success" />;
        }
        return <User className="w-3 h-3" />;
    };

    // const selectedConversation = selectedConversationId
    //     ? groupedMessages[selectedConversationId]
    //     : null;

    return (
        <OrganizationLayout auth={auth}>
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-base-content">
                        Messages
                    </h1>
                    <p className="text-base-content/70 mt-2">
                        Communicate with volunteers and manage your
                        conversations
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 bg-base-100 rounded-box shadow-lg overflow-hidden">
                    {/* Enhanced Conversations Sidebar */}
                    <div
                        className={`lg:col-span-1 ${
                            showConversations ? "block" : "hidden"
                        } lg:block`}
                    >
                        <div className="bg-base-100 rounded-box border border-base-300 h-full flex flex-col">
                            {/* Sidebar Header with Gradient */}
                            <div className="p-4 border-b border-base-300 bg-gradient-to-r from-primary/10 to-secondary/10">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5 text-primary" />
                                        Conversations
                                        <span className="badge badge-primary badge-sm">
                                            {filteredConversations.length}
                                        </span>
                                    </h2>
                                    <div className="lg:hidden">
                                        <button
                                            onClick={() =>
                                                setShowConversations(false)
                                            }
                                            className="btn btn-ghost btn-sm btn-circle"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Enhanced Search */}
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                                    <input
                                        type="text"
                                        placeholder="Search conversations..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="input input-bordered w-full pl-9 pr-4 py-2 text-sm bg-base-200/50 focus:bg-base-100 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Conversations List with Improved Styling */}
                            <div className="flex-1 overflow-y-auto">
                                {filteredConversations.length > 0 ? (
                                    <div className="p-2 space-y-1">
                                        {filteredConversations.map(
                                            (conversation) => {
                                                const lastMessageTime =
                                                    getLastMessageTime(
                                                        conversation
                                                    );
                                                const isSelected =
                                                    selectedConversationId ===
                                                    conversation.sender.id;
                                                const hasUnread =
                                                    conversation.unreadCount >
                                                    0;

                                                return (
                                                    <div
                                                        key={
                                                            conversation.sender
                                                                .id
                                                        }
                                                        className={`group relative p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                                                            isSelected
                                                                ? "bg-primary/20 border-l-4 border-primary shadow-sm"
                                                                : "hover:bg-base-300/50 border-l-4 border-transparent"
                                                        }`}
                                                        onClick={() =>
                                                            handleConversationClick(
                                                                conversation
                                                                    .sender.id
                                                            )
                                                        }
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            {/* Avatar with Status Indicator */}
                                                            <div className="relative flex-shrink-0">
                                                                <div
                                                                    className={`avatar placeholder ${
                                                                        hasUnread
                                                                            ? "ring-2 ring-primary ring-offset-2 ring-offset-base-100"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    <div className="bg-gradient-to-br from-primary to-secondary text-primary-content rounded-full w-12 h-12">
                                                                        <span className="text-lg font-semibold">
                                                                            {conversation.sender.name
                                                                                ?.charAt(
                                                                                    0
                                                                                )
                                                                                ?.toUpperCase() ||
                                                                                "U"}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                {hasUnread && (
                                                                    <div className="absolute -top-1 -right-1">
                                                                        <div className="bg-primary text-primary-content text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                                                            {
                                                                                conversation.unreadCount
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Conversation Details */}
                                                            <div className="flex-1 min-w-0 space-y-1">
                                                                {/* Sender Name and Time */}
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        <span
                                                                            className={`font-semibold text-sm truncate ${
                                                                                isSelected
                                                                                    ? "text-primary"
                                                                                    : "text-base-content"
                                                                            }`}
                                                                        >
                                                                            {
                                                                                conversation
                                                                                    .sender
                                                                                    .name
                                                                            }
                                                                        </span>
                                                                        {getSenderTypeIcon(
                                                                            conversation
                                                                        )}
                                                                    </div>
                                                                    {lastMessageTime && (
                                                                        <span className="text-xs text-base-content/50 flex items-center gap-1">
                                                                            <Clock className="w-3 h-3" />
                                                                            {
                                                                                lastMessageTime
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                {/* Last Message Preview */}
                                                                <p className="text-xs text-base-content/70 line-clamp-2 leading-relaxed">
                                                                    {conversation
                                                                        .latestMessage
                                                                        ?.message ||
                                                                        "No messages yet"}
                                                                </p>

                                                                {/* Project Badge */}
                                                                {conversation.project && (
                                                                    <div className="flex items-center gap-1">
                                                                        <span className="badge badge-outline badge-xs py-1">
                                                                            <Star className="w-2.5 h-2.5 mr-1" />
                                                                            {
                                                                                conversation
                                                                                    .project
                                                                                    .title
                                                                            }
                                                                        </span>
                                                                        {conversation
                                                                            .project
                                                                            .type_of_project ===
                                                                            "Paid" && (
                                                                            <span className="badge badge-success badge-xs">
                                                                                Paid
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Hover Actions */}
                                                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button className="btn btn-ghost btn-xs btn-circle">
                                                                <MessageSquare className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                        <div className="bg-base-200 rounded-full p-4 mb-4">
                                            <MessageSquare className="w-8 h-8 text-base-content/30" />
                                        </div>
                                        <h3 className="font-semibold text-base-content/70 mb-2">
                                            No conversations found
                                        </h3>
                                        <p className="text-sm text-base-content/50">
                                            {searchQuery
                                                ? "Try a different search term"
                                                : "Start a conversation to see it here"}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar Footer */}
                            <div className="p-3 border-t border-base-300 bg-base-200/50">
                                <div className="flex items-center justify-between text-xs text-base-content/50">
                                    <span>
                                        Total: {filteredConversations.length}
                                    </span>
                                    <span>
                                        {new Date().toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chat Interface */}
                    <div className="lg:col-span-3">
                        <div className="bg-base-100 rounded-box border border-base-300 h-full flex flex-col">
                            {selectedConversation ? (
                                <>
                                    {/* Chat Header */}
                                    <div className="p-4 border-b border-base-300 bg-base-200 flex items-center gap-3">
                                        <button
                                            onClick={() =>
                                                setShowConversations(true)
                                            }
                                            className="lg:hidden btn btn-ghost btn-sm btn-circle"
                                        >
                                            <Menu className="w-4 h-4" />
                                        </button>
                                        <div className="avatar placeholder">
                                            <div className="bg-neutral text-neutral-content rounded-full w-10">
                                                <span className="text-sm">
                                                    {selectedConversation.sender.name?.charAt(
                                                        0
                                                    ) || "U"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold">
                                                {
                                                    selectedConversation.sender
                                                        .name
                                                }
                                            </h3>
                                            {selectedConversation.project && (
                                                <p className="text-xs text-base-content/70">
                                                    Project:{" "}
                                                    {
                                                        selectedConversation
                                                            .project.title
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Payment Status Banner */}
                                    {isPaidProject && (
                                        <div
                                            className={`p-3 ${
                                                hasPayment
                                                    ? "bg-success/20 text-success"
                                                    : "bg-warning/20 text-warning"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 text-sm">
                                                {hasPayment ? (
                                                    <>
                                                        <Check className="w-4 h-4" />
                                                        Payment verified -
                                                        Contact sharing enabled
                                                    </>
                                                ) : (
                                                    <>
                                                        <AlertCircle className="w-4 h-4" />
                                                        Paid project - Contact
                                                        sharing restricted until
                                                        payment
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Messages Container */}
                                    <div className="flex-1 p-4 overflow-y-auto max-h-[60vh] space-y-4">
                                        {selectedConversation.messages.map(
                                            (message) => (
                                                <div
                                                    key={message.id}
                                                    ref={(el) =>
                                                        (messageRefs.current[
                                                            message.id
                                                        ] = el)
                                                    }
                                                    className={`chat ${
                                                        message.sender_id ===
                                                        auth.user.id
                                                            ? "chat-end"
                                                            : "chat-start"
                                                    }`}
                                                >
                                                    <div className="chat-image avatar">
                                                        <div className="w-8 rounded-full bg-neutral text-neutral-content">
                                                            <span className="text-xs">
                                                                {message.sender_id ===
                                                                auth.user.id
                                                                    ? auth.user.name?.charAt(
                                                                          0
                                                                      )
                                                                    : selectedConversation.sender.name?.charAt(
                                                                          0
                                                                      )}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="chat-header mb-1">
                                                        {message.sender_id ===
                                                        auth.user.id
                                                            ? "You"
                                                            : selectedConversation
                                                                  .sender.name}
                                                        <time className="text-xs opacity-50 ml-2">
                                                            {new Date(
                                                                message.created_at
                                                            ).toLocaleTimeString()}
                                                        </time>
                                                    </div>

                                                    <div
                                                        className={`chat-bubble ${
                                                            message.sender_id ===
                                                            auth.user.id
                                                                ? "chat-bubble-primary"
                                                                : "chat-bubble-base-200"
                                                        } ${
                                                            highlightedMessageId ===
                                                            message.id
                                                                ? "ring-2 ring-primary"
                                                                : ""
                                                        }`}
                                                    >
                                                        {message.original_message && (
                                                            <div
                                                                className="bg-base-100/50 rounded-lg p-2 mb-2 cursor-pointer hover:bg-base-100 transition-colors"
                                                                onClick={() =>
                                                                    handleOriginalMessageClick(
                                                                        message
                                                                            .original_message
                                                                            .id
                                                                    )
                                                                }
                                                            >
                                                                <div className="flex items-start gap-2">
                                                                    <Reply className="w-3 h-3 mt-0.5 text-base-content/50" />
                                                                    <div className="flex-1">
                                                                        <p className="text-xs font-medium text-base-content/70">
                                                                            Replying
                                                                            to{" "}
                                                                            {message
                                                                                .original_message
                                                                                .sender_id ===
                                                                            auth
                                                                                .user
                                                                                .id
                                                                                ? "your message"
                                                                                : selectedConversation
                                                                                      .sender
                                                                                      .name}
                                                                        </p>
                                                                        <p className="text-xs text-base-content/50 line-clamp-2">
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

                                                        <p className="text-sm">
                                                            {message.message}
                                                        </p>
                                                    </div>

                                                    <div className="chat-footer">
                                                        {message.sender_id !==
                                                            auth.user.id && (
                                                            <button
                                                                onClick={() =>
                                                                    handleReplyClick(
                                                                        message
                                                                    )
                                                                }
                                                                className="btn btn-ghost btn-xs text-xs opacity-50 hover:opacity-100"
                                                            >
                                                                <Reply className="w-3 h-3 mr-1" />
                                                                Reply
                                                            </button>
                                                        )}
                                                        {message.sender_id ===
                                                            auth.user.id && (
                                                            <div className="text-xs opacity-50">
                                                                {message.status ===
                                                                "Read" ? (
                                                                    <CheckCheck className="w-3 h-3 inline" />
                                                                ) : (
                                                                    <Check className="w-3 h-3 inline" />
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Reply Indicator */}
                                    {isReplying && (
                                        <div className="bg-base-200 p-3 border-y border-base-300">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Reply className="w-4 h-4 text-primary" />
                                                    <span className="text-sm text-base-content">
                                                        Replying to{" "}
                                                        {replyToMessage.sender_id ===
                                                        auth.user.id
                                                            ? "your message"
                                                            : selectedConversation
                                                                  .sender.name}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setIsReplying(false);
                                                        setReplyToMessage(null);
                                                    }}
                                                    className="btn btn-ghost btn-sm btn-circle"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="text-xs text-base-content/70 mt-1 truncate">
                                                {replyToMessage.message}
                                            </p>
                                        </div>
                                    )}

                                    {/* Message Input */}
                                    <div className="p-4 border-t border-base-300">
                                        {contentWarning && (
                                            <div className="alert alert-warning mb-3">
                                                <AlertCircle className="w-4 h-4" />
                                                <span>
                                                    Contact information removed
                                                    due to restrictions
                                                </span>
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
                                                className="input input-bordered flex-1"
                                                placeholder={
                                                    isReplying
                                                        ? "Type your reply..."
                                                        : "Type your message..."
                                                }
                                            />
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                disabled={!newMessage.trim()}
                                            >
                                                {isReplying ? (
                                                    <Reply className="w-4 h-4" />
                                                ) : (
                                                    <MessageSquare className="w-4 h-4" />
                                                )}
                                                {isReplying ? "Reply" : "Send"}
                                            </button>
                                        </form>
                                    </div>
                                </>
                            ) : (
                                /* Empty State */
                                <div className="flex-1 flex items-center justify-center p-8">
                                    <div className="text-center">
                                        <MessageSquare className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-base-content/70 mb-2">
                                            Select a conversation
                                        </h3>
                                        <p className="text-base-content/50">
                                            Choose a conversation from the
                                            sidebar to start messaging
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </OrganizationLayout>
    );
}
