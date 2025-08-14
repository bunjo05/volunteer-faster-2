const CommentItem = ({ comment, depth = 0, remarkId }) => {
    const isReply = depth > 0;
    return (
        <div
            className={`${isReply ? "ml-8" : ""} ${
                depth > 0 ? "mt-3" : "mt-4"
            }`}
            style={{ marginLeft: `${depth * 24}px` }}
        >
            <div
                className={`bg-${
                    isReply ? "gray" : "blue"
                }-50 p-4 rounded-lg border-l-4 border-${
                    isReply ? "gray" : "blue"
                }-500`}
            >
                <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                        {comment.user?.profile_photo_path ? (
                            <img
                                src={`/storage/${comment.user.profile_photo_path}`}
                                alt={comment.user.name}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-gray-500"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        )}
                        <div>
                            <h4 className="font-medium text-sm text-gray-800">
                                {comment.user?.name || "Anonymous"}
                            </h4>
                            <span className="text-xs text-gray-500">
                                {timeAgo(comment.created_at)}
                            </span>
                        </div>
                    </div>
                </div>
                <p className="text-gray-700 mt-2 text-sm">{comment.comment}</p>

                {auth.user && (
                    <button
                        onClick={() => handleStartReply(remarkId, comment.id)}
                        className="text-blue-600 hover:text-blue-800 text-xs mt-2 flex items-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                            />
                        </svg>
                        Reply
                    </button>
                )}
            </div>

            {/* Reply form for this specific comment */}
            {replyingTo === remarkId &&
                activeReplyForms[remarkId] &&
                replyData.parent_id === comment.id && (
                    <div className="mt-3">
                        <form
                            onSubmit={(e) => handleSubmitReply(e, remarkId)}
                            className="space-y-2"
                        >
                            <textarea
                                value={replyData.comment}
                                onChange={(e) =>
                                    setReplyData("comment", e.target.value)
                                }
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                rows={2}
                                placeholder="Write your reply..."
                                required
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setReplyingTo(null);
                                        setActiveReplyForms((prev) => ({
                                            ...prev,
                                            [remarkId]: false,
                                        }));
                                    }}
                                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={replyProcessing}
                                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {replyProcessing
                                        ? "Posting..."
                                        : "Post Reply"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

            {/* Recursively render nested comments */}
            {comment.comments?.length > 0 && (
                <div className="space-y-3">
                    {comment.comments.map((nestedComment) => (
                        <CommentItem
                            key={nestedComment.id}
                            comment={nestedComment}
                            depth={depth + 1}
                            remarkId={remarkId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
