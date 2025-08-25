import VolunteerLayout from "@/Layouts/VolunteerLayout";
import { usePage, router } from "@inertiajs/react";
import { useState, useEffect, useCallback, useRef } from "react";

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

        return () => {
            window.Echo.leave(channelName);
        };
    }, [receiverId, auth.user.id]);
    // useEffect(() => {
    //     if (!receiverId) return;

    //     const channelName = `message.user.${[auth.user.id, receiverId]
    //         .sort()
    //         .join("-")}`;

    //     // Connection status listeners
    //     window.Echo.connector.socket.on("connect", () => {
    //         console.log("Connected to WebSocket server");
    //     });

    //     window.Echo.connector.socket.on("error", (error) => {
    //         console.error("WebSocket error:", error);
    //     });

    //     console.log(`Attempting to subscribe to channel: ${channelName}`);

    //     const listener = window.Echo.private(channelName)
    //         .here((users) => {
    //             console.log("Users in channel:", users);
    //         })
    //         .listen("NewMessage", (e) => {
    //             console.log("Received message:", e.message);
    //             // Handle new message
    //             setGroupedMessages((prev) => {
    //                 const updated = { ...prev };
    //                 const conversationKey =
    //                     e.message.sender_id === auth.user.id
    //                         ? e.message.receiver_id
    //                         : e.message.sender_id;

    //                 if (updated[conversationKey]) {
    //                     updated[conversationKey] = {
    //                         ...updated[conversationKey],
    //                         messages: [
    //                             ...updated[conversationKey].messages,
    //                             e.message,
    //                         ],
    //                         latestMessage: e.message,
    //                     };
    //                 }
    //                 return updated;
    //             });
    //         });

    //     return () => {
    //         window.Echo.leave(channelName);
    //         // Clean up socket listeners
    //         window.Echo.connector.socket.off("connect");
    //         window.Echo.connector.socket.off("error");
    //     };
    // }, [receiverId, auth.user.id]);

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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-base-100 rounded-box shadow-lg overflow-hidden">
                    {/* Conversations List */}
                    <div
                        className={`${
                            showConversations
                                ? "block fixed inset-0 z-10 bg-black bg-opacity-50 md:bg-opacity-0"
                                : "hidden"
                        } md:block md:relative`}
                    >
                        <div
                            className={`absolute md:relative left-0 top-0 h-full w-80 bg-base-100 z-20 transform ${
                                showConversations
                                    ? "translate-x-0"
                                    : "-translate-x-full"
                            } md:translate-x-0 transition-transform duration-300 ease-in-out border-r border-base-200`}
                        >
                            <div className="p-4 border-b border-base-200 bg-base-200 flex items-center">
                                <button
                                    onClick={() =>
                                        setShowConversations(!showConversations)
                                    }
                                    className="md:hidden btn btn-ghost btn-square btn-sm mr-2"
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
                                <div className="avatar placeholder">
                                    <div className="bg-neutral text-neutral-content rounded-full w-10">
                                        <span>
                                            {selectedConversation?.sender?.name?.charAt(
                                                0
                                            ) || "U"}
                                        </span>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <h2 className="text-lg font-semibold">
                                        {selectedConversation?.sender?.name ||
                                            "Unknown"}
                                    </h2>
                                    {selectedConversation?.project && (
                                        <p className="text-xs opacity-70">
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
                            <ul className="menu p-2 max-h-[70vh] overflow-y-auto">
                                {Object.values(groupedMessages).length > 0 ? (
                                    Object.values(groupedMessages).map(
                                        (conversation) => {
                                            const previewText =
                                                conversation.latestMessage
                                                    ?.message?.length > 30
                                                    ? `${conversation.latestMessage.message.substring(
                                                          0,
                                                          30
                                                      )}...`
                                                    : conversation.latestMessage
                                                          ?.message ||
                                                      "No messages yet";

                                            return (
                                                <li
                                                    key={conversation.sender.id}
                                                >
                                                    <a
                                                        className={`${
                                                            selectedConversationId ===
                                                            conversation.sender
                                                                .id
                                                                ? "active"
                                                                : ""
                                                        }`}
                                                        onClick={() =>
                                                            handleConversationClick(
                                                                conversation
                                                                    .sender.id
                                                            )
                                                        }
                                                    >
                                                        <div className="avatar placeholder">
                                                            <div className="bg-neutral text-neutral-content rounded-full w-8">
                                                                <span>
                                                                    {conversation.sender.name?.charAt(
                                                                        0
                                                                    ) || "U"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium truncate">
                                                                {
                                                                    conversation
                                                                        .sender
                                                                        .name
                                                                }
                                                            </p>
                                                            <p className="text-xs opacity-70 truncate">
                                                                {previewText}
                                                            </p>
                                                        </div>
                                                        {conversation.unreadCount >
                                                            0 && (
                                                            <span className="badge badge-primary badge-sm">
                                                                {
                                                                    conversation.unreadCount
                                                                }
                                                            </span>
                                                        )}
                                                    </a>
                                                </li>
                                            );
                                        }
                                    )
                                ) : (
                                    <li className="py-4 text-center">
                                        <p className="text-sm opacity-70">
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
                            <div
                                className={`alert ${
                                    hasPayment
                                        ? "alert-success"
                                        : "alert-warning"
                                } mb-4`}
                            >
                                {hasPayment ? (
                                    <>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="stroke-current shrink-0 h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <span>
                                            Payment verified - You can now share
                                            contact details
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="stroke-current shrink-0 h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                        <span>
                                            This is a paid project - Contact
                                            sharing is restricted until payment
                                            is made
                                        </span>
                                    </>
                                )}
                            </div>
                        )}

                        {selectedConversation ? (
                            <>
                                <div className="p-4 border-b border-base-200 bg-base-200 flex items-center">
                                    <button
                                        onClick={() =>
                                            setShowConversations(true)
                                        }
                                        className="md:hidden btn btn-ghost btn-square btn-sm mr-2"
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
                                    <div className="avatar placeholder">
                                        <div className="bg-neutral text-neutral-content rounded-full w-10">
                                            <span>
                                                {selectedConversation.sender.name?.charAt(
                                                    0
                                                ) || "U"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <h2 className="text-lg font-semibold">
                                            {selectedConversation.sender.name}
                                        </h2>
                                        {selectedConversation.project && (
                                            <p className="text-xs opacity-70">
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
                                                    className={`chat ${
                                                        message.sender_id ===
                                                        auth.user.id
                                                            ? "chat-end"
                                                            : "chat-start"
                                                    }`}
                                                >
                                                    <div className="chat-image avatar">
                                                        <div className="w-10 rounded-full bg-neutral text-neutral-content">
                                                            <span>
                                                                {message.sender_id ===
                                                                auth.user.id
                                                                    ? "Me"
                                                                    : selectedConversation.sender.name?.charAt(
                                                                          0
                                                                      ) || "U"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={`chat-bubble ${
                                                            message.sender_id ===
                                                            auth.user.id
                                                                ? "chat-bubble-primary"
                                                                : "chat-bubble-secondary"
                                                        } ${
                                                            highlightedMessageId ===
                                                            message.id
                                                                ? "ring-2 ring-primary"
                                                                : ""
                                                        }`}
                                                    >
                                                        {message.original_message && (
                                                            <div
                                                                className="mb-2 p-2 bg-base-200 rounded-lg text-xs cursor-pointer hover:bg-base-300 transition-colors"
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
                                                                        className="w-3 h-3 opacity-70 mt-0.5 mr-2 flex-shrink-0"
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
                                                                        <p className="text-xs font-medium mb-1">
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
                                                                        <p className="text-xs opacity-70 line-clamp-2">
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
                                                        <p>{message.message}</p>
                                                    </div>
                                                    <div className="chat-footer opacity-70">
                                                        <time className="text-xs">
                                                            {new Date(
                                                                message.created_at
                                                            ).toLocaleTimeString(
                                                                [],
                                                                {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                }
                                                            )}
                                                        </time>
                                                        {message.sender_id ===
                                                            auth.user.id && (
                                                            <span className="text-xs ml-1">
                                                                {message.status ===
                                                                "Read"
                                                                    ? "✓✓"
                                                                    : "✓"}
                                                            </span>
                                                        )}
                                                        {message.sender_id !==
                                                            auth.user.id && (
                                                            <button
                                                                className="btn btn-xs btn-ghost ml-1"
                                                                onClick={() =>
                                                                    handleReplyClick(
                                                                        message
                                                                    )
                                                                }
                                                            >
                                                                Reply
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </div>

                                <div className="p-4 border-t border-base-200">
                                    {contentWarning && (
                                        <div className="alert alert-warning mb-4">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="stroke-current shrink-0 h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                                />
                                            </svg>
                                            <span>
                                                Phone numbers, emails, and links
                                                are not allowed and have been
                                                removed.
                                            </span>
                                        </div>
                                    )}
                                    {isReplying && (
                                        <div className="alert alert-info mb-4">
                                            <div className="flex-1">
                                                <label className="label">
                                                    <span className="label-text">
                                                        Replying to:{" "}
                                                        {replyToMessage.sender_id ===
                                                        auth.user.id
                                                            ? "your message"
                                                            : replyToMessage
                                                                  .sender?.name}
                                                    </span>
                                                </label>
                                                <p className="text-sm opacity-70 truncate">
                                                    {replyToMessage.message}
                                                </p>
                                            </div>
                                            <button
                                                className="btn btn-sm btn-ghost"
                                                onClick={() => {
                                                    setIsReplying(false);
                                                    setReplyToMessage(null);
                                                }}
                                            >
                                                Cancel
                                            </button>
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
                                            className="input input-bordered flex-1"
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
                                            className="btn btn-primary"
                                        >
                                            {isReplying ? "Reply" : "Send"}
                                        </button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex items-center justify-center p-12">
                                <div className="text-center opacity-70">
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
