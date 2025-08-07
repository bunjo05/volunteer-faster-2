import VolunteerLayout from "@/Layouts/VolunteerLayout";
import { usePage, router } from "@inertiajs/react";
import { useState, useEffect, useCallback, useRef } from "react";

export default function Messages({ auth: propAuth }) {
    const { messages: initialMessages = [], auth } = usePage().props;
    const [groupedMessages, setGroupedMessages] = useState({});
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [isReplying, setIsReplying] = useState(false);
    const [replyToMessage, setReplyToMessage] = useState(null);
    const [highlightedMessageId, setHighlightedMessageId] = useState(null);
    const [showConversations, setShowConversations] = useState(false);
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
    const filterContent = (text, isPaidProject, hasPaidBooking) => {
        // If it's a paid project with payment, don't filter anything
        if (isPaidProject && hasPaidBooking) {
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

    // Function to filter restricted content
    // const filterContent = (text) => {
    //     let hasRestrictedContent = false;
    //     let cleanedText = text;

    //     // Check each pattern
    //     Object.values(restrictedPatterns).forEach((pattern) => {
    //         if (pattern.test(cleanedText)) {
    //             cleanedText = cleanedText.replace(pattern, "[content removed]");
    //             hasRestrictedContent = true;
    //         }
    //     });

    //     return { cleanedText, hasRestrictedContent };
    // };

    useEffect(() => {
        if (!window.Echo) {
            // Initialize Echo only once
            window.Echo = new Echo({
                broadcaster: "pusher",
                key: process.env.MIX_PUSHER_APP_KEY,
                cluster: process.env.MIX_PUSHER_APP_CLUSTER,
                forceTLS: true,
                authEndpoint: "/broadcasting/auth",
                auth: {
                    headers: {
                        "X-CSRF-TOKEN": document.querySelector(
                            'meta[name="csrf-token"]'
                        ).content,
                    },
                },
            });
        }

        const userId = auth.user.id;

        window.Echo.private(`chat.${userId}`).listen(".new.message", (data) => {
            const newMessage = data.message;

            setGroupedMessages((prev) => {
                const updated = { ...prev };
                const senderId =
                    newMessage.sender_id === userId
                        ? newMessage.receiver_id
                        : newMessage.sender_id;

                if (updated[senderId]) {
                    updated[senderId] = {
                        ...updated[senderId],
                        messages: [...updated[senderId].messages, newMessage],
                        latestMessage: newMessage,
                        unreadCount:
                            newMessage.receiver_id === userId
                                ? (updated[senderId].unreadCount || 0) + 1
                                : updated[senderId].unreadCount,
                        // Update payment status if included in message
                        project: newMessage.project_id
                            ? {
                                  ...updated[senderId].project,
                                  has_payment: newMessage.has_payment || false,
                              }
                            : updated[senderId].project,
                    };
                } else {
                    updated[senderId] = {
                        sender: {
                            id: senderId,
                            name: newMessage.sender.name || "Unknown",
                            email: newMessage.sender.email || "",
                        },
                        project: newMessage.project_id
                            ? {
                                  id: newMessage.project_id,
                                  type_of_project:
                                      newMessage.project?.type_of_project,
                                  has_payment: newMessage.has_payment || false,
                              }
                            : null,
                        messages: [newMessage],
                        latestMessage: newMessage,
                        unreadCount: newMessage.receiver_id === userId ? 1 : 0,
                    };
                }

                return updated;
            });
        });

        return () => {
            if (window.Echo) {
                window.Echo.leave(`chat.${userId}`);
            }
        };
    }, [auth.user.id, selectedConversationId]);

    // In your useEffect for initializing grouped messages:
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

            acc[conversation.sender.id] = conversationWithPayment;
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
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [highlightedMessageId]);

    const handleConversationClick = useCallback(
        (senderId) => {
            setSelectedConversationId(senderId);
            setIsReplying(false);
            setReplyToMessage(null);
            setHighlightedMessageId(null);
            setShowConversations(false);

            if (groupedMessages[senderId]?.unreadCount > 0) {
                router.patch(
                    route("volunteer.messages.mark-all-read", { senderId }),
                    {},
                    {
                        preserveScroll: true,
                        onSuccess: () => {
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
        messageRefs.current[messageId]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    };

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (!newMessage.trim() || !selectedConversationId) return;

        // Get the current conversation's project and booking (if any)
        const currentProject = selectedConversation?.project;
        const currentBooking = selectedConversation?.booking;

        // Check if this is a paid project
        const isPaidProject = currentProject?.type_of_project === "Paid";

        // Check if user has made payment for this project
        const hasPayment = currentProject?.has_payment || false;

        // Filter content based on project type and payment status
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

        // Determine receiver ID
        const receiverId = isReplying
            ? replyToMessage.sender_id
            : selectedConversation.sender.id;

        // Determine booking_id:
        // - Use booking_id from reply if replying
        // - Use current booking_id if available
        let bookingId = null;
        if (isReplying) {
            bookingId = replyToMessage.booking_id;
        } else if (currentBooking) {
            bookingId = currentBooking.id;
        }

        router.post(
            route("volunteer.messages.store"),
            {
                receiver_id: receiverId,
                message: cleanedText,
                reply_to: isReplying ? replyToMessage.id : null,
                project_id: currentProject?.id || null,
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
                        project_id: currentProject?.id || null,
                        booking_id: bookingId,
                    };

                    setGroupedMessages((prev) => {
                        const updated = { ...prev };

                        if (updated[receiverId]) {
                            updated[receiverId] = {
                                ...updated[receiverId],
                                messages: [
                                    ...updated[receiverId].messages,
                                    newMsg,
                                ],
                                latestMessage: newMsg,
                            };
                        } else {
                            updated[receiverId] = {
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
    // const selectedConversation = selectedConversationId
    //     ? groupedMessages[selectedConversationId]
    //     : null;

    return (
        <VolunteerLayout auth={auth}>
            <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-xl shadow overflow-hidden">
                    {/* Conversations List */}
                    <div
                        className={`${
                            showConversations
                                ? "block fixed inset-0 z-10 bg-black bg-opacity-50 md:bg-opacity-0"
                                : "hidden"
                        } md:block md:relative`}
                    >
                        <div
                            className={`absolute md:relative left-0 top-0 h-full w-80 bg-white shadow-lg md:shadow-none z-20 transform ${
                                showConversations
                                    ? "translate-x-0"
                                    : "-translate-x-full"
                            } md:translate-x-0 transition-transform duration-300 ease-in-out border-r border-gray-200`}
                        >
                            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center">
                                <button
                                    onClick={() => setShowConversations(true)}
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
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                                    {selectedConversation?.sender?.name?.charAt(
                                        0
                                    ) || "U"}
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {selectedConversation?.sender?.name ||
                                            "Unknown"}
                                    </h2>
                                    {selectedConversation?.project && (
                                        <p className="text-xs text-gray-500">
                                            Project:{" "}
                                            {selectedConversation.project.title}
                                            {selectedConversation?.booking && (
                                                <span>
                                                    {" "}
                                                    (Booking #
                                                    {
                                                        selectedConversation
                                                            .booking.id
                                                    }
                                                    )
                                                </span>
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <ul className="divide-y divide-gray-200 max-h-[70vh] overflow-y-auto">
                                {Object.values(groupedMessages).length > 0 ? (
                                    Object.values(groupedMessages).map(
                                        (conversation) => {
                                            const latestMessage =
                                                conversation.latestMessage
                                                    ?.message ||
                                                "No messages yet";
                                            const previewText =
                                                latestMessage.length > 30
                                                    ? `${latestMessage.substring(
                                                          0,
                                                          30
                                                      )}...`
                                                    : latestMessage;

                                            return (
                                                <li
                                                    key={conversation.sender.id}
                                                    className={`py-3 px-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                                                        selectedConversationId ===
                                                        conversation.sender.id
                                                            ? "bg-blue-50 border-l-4 border-blue-500"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        handleConversationClick(
                                                            conversation.sender
                                                                .id
                                                        )
                                                    }
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center min-w-0">
                                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                                                                {conversation.sender.name?.charAt(
                                                                    0
                                                                ) || "U"}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                                    {
                                                                        conversation
                                                                            .sender
                                                                            .name
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-gray-500 truncate">
                                                                    {
                                                                        previewText
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {conversation.unreadCount >
                                                            0 && (
                                                            <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                                                                {
                                                                    conversation.unreadCount
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </li>
                                            );
                                        }
                                    )
                                ) : (
                                    <li className="py-4 px-4 text-center">
                                        <p className="text-gray-500 text-sm">
                                            No conversations found.
                                        </p>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Chat Interface */}
                    <div className="col-span-2 flex flex-col">
                        {isPaidProject && (
                            <div className="mb-2 p-2 bg-green-50 rounded-lg text-sm">
                                {hasPayment ? (
                                    <p className="text-green-700">
                                        <svg
                                            className="w-4 h-4 inline mr-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        Payment verified - You can now share
                                        contact details
                                    </p>
                                ) : (
                                    <p className="text-yellow-700">
                                        <svg
                                            className="w-4 h-4 inline mr-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                        This is a paid project - Contact sharing
                                        is restricted until payment is made
                                    </p>
                                )}
                            </div>
                        )}
                        {selectedConversation ? (
                            <>
                                <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center">
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
                                    <div>
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                                            {selectedConversation.sender.name?.charAt(
                                                0
                                            ) || "U"}
                                        </div>
                                        {selectedConversation.project && (
                                            <p className="text-xs text-gray-500">
                                                Project:{" "}
                                                {
                                                    selectedConversation.project
                                                        .title
                                                }
                                                {selectedConversation.booking && (
                                                    <span>
                                                        {" "}
                                                        (Booking #
                                                        {
                                                            conversation.booking
                                                                .id
                                                        }
                                                        )
                                                    </span>
                                                )}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            {selectedConversation.sender.name}
                                        </h2>
                                        <p>
                                            {/* {selectedConversation.sender.} */}
                                        </p>
                                        {/* <p className="text-xs text-gray-500">
                                            {selectedConversation.sender.email}
                                        </p> */}
                                    </div>
                                </div>

                                <div className="flex-1 p-4 overflow-y-auto max-h-[60vh]">
                                    <div className="space-y-4">
                                        {selectedConversation.messages.map(
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
                                                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg transition-all duration-300 ${
                                                            message.sender_id ===
                                                            auth.user.id
                                                                ? "bg-blue-100"
                                                                : "bg-gray-100"
                                                        } ${
                                                            highlightedMessageId ===
                                                            message.id
                                                                ? "ring-2 ring-blue-500 scale-[1.02]"
                                                                : ""
                                                        }`}
                                                    >
                                                        {message.original_message && (
                                                            <div
                                                                className="mb-2 p-2 bg-blue-50 rounded text-xs cursor-pointer hover:bg-blue-100 transition-colors"
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
                                                                        className="w-3 h-3 text-blue-500 mt-0.5 mr-2 flex-shrink-0"
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
                                                                        <p className="text-xs font-medium text-blue-700 mb-1">
                                                                            Replying
                                                                            to{" "}
                                                                            {message
                                                                                .original_message
                                                                                .sender_id ===
                                                                            auth
                                                                                .user
                                                                                .id
                                                                                ? "your message"
                                                                                : message
                                                                                      .original_message
                                                                                      .sender
                                                                                      ?.name}
                                                                        </p>
                                                                        <p className="text-xs text-gray-600 line-clamp-2">
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

                                                        <p className="text-sm text-gray-800">
                                                            {message.message}
                                                        </p>
                                                        <div className="flex justify-between items-center mt-1">
                                                            {message.sender_id !==
                                                                auth.user
                                                                    .id && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleReplyClick(
                                                                            message
                                                                        )
                                                                    }
                                                                    className="text-xs text-gray-500 hover:text-blue-500"
                                                                >
                                                                    Reply
                                                                </button>
                                                            )}
                                                            <p className="text-[9px] text-gray-500 text-right">
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
                                                                                ? "text-blue-500"
                                                                                : "text-gray-400"
                                                                        }`}
                                                                    >
                                                                        {message.status ===
                                                                        "Read" ? (
                                                                            // Double tick for read messages
                                                                            <span className="flex">
                                                                                <span>
                                                                                    ✓
                                                                                </span>
                                                                                <span>
                                                                                    ✓
                                                                                </span>
                                                                            </span>
                                                                        ) : (
                                                                            // Single tick for unread messages
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

                                <div className="p-4 border-t border-gray-200">
                                    {contentWarning && (
                                        <div className="mb-2 p-2 bg-yellow-50 rounded-lg text-yellow-800 text-sm">
                                            Phone numbers, emails, and links are
                                            not allowed and have been removed.
                                        </div>
                                    )}
                                    {isReplying && (
                                        <div className="mb-2 p-2 bg-blue-50 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <p className="text-sm text-blue-800">
                                                    Replying to:{" "}
                                                    {replyToMessage.sender_id ===
                                                    auth.user.id
                                                        ? "your message"
                                                        : replyToMessage.sender
                                                              ?.name}
                                                </p>
                                                <button
                                                    onClick={() => {
                                                        setIsReplying(false);
                                                        setReplyToMessage(null);
                                                    }}
                                                    className="text-xs text-blue-600 hover:text-blue-800"
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
                                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder={
                                                isReplying
                                                    ? `Reply to ${
                                                          replyToMessage.sender_id ===
                                                          auth.user.id
                                                              ? "your message"
                                                              : replyToMessage
                                                                    .sender
                                                                    ?.name
                                                      }...`
                                                    : "Type your message..."
                                            }
                                        />
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {isReplying ? "Reply" : "Send"}
                                        </button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex items-center justify-center p-12">
                                <div className="text-center text-gray-500">
                                    <p>
                                        Select a conversation to start chatting.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </VolunteerLayout>
    );
}
