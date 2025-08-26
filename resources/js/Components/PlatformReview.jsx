import React, { useState, useEffect } from "react";
import {
    Star,
    X,
    Heart,
    MessageCircle,
    Award,
    Sparkles,
    AlertCircle,
} from "lucide-react";
import { useForm, usePage } from "@inertiajs/react";

export default function PlatformReview() {
    const { props } = usePage();
    const { data, setData, post, processing, errors, reset } = useForm({
        rating: 0,
        message: "",
    });

    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showFloatingButton, setShowFloatingButton] = useState(true);
    const [submitError, setSubmitError] = useState("");

    // Show the floating button after a delay when component mounts
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowFloatingButton(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    // Listen for errors from the backend
    useEffect(() => {
        if (props.errors && Object.keys(props.errors).length > 0) {
            setSubmitError(
                "There was an error submitting your review. Please try again."
            );
            console.error("Form errors:", props.errors);
        }
    }, [props.errors]);

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        setSubmitError("");

        if (!data.rating || data.rating === 0) {
            setSubmitError("Please select a rating");
            return;
        }

        post(route("platform.review"), {
            preserveScroll: true,
            onSuccess: () => {
                if (props.flash.success) {
                    setShowReviewModal(false);
                    reset();
                    setShowFloatingButton(false);
                }
                if (props.flash.error) {
                    setSubmitError(props.flash.error);
                }
            },
            onError: (errors) => {
                if (errors.rating) {
                    setSubmitError(errors.rating);
                } else if (errors.message) {
                    setSubmitError(errors.message);
                } else {
                    setSubmitError(
                        "An error occurred while submitting your review."
                    );
                }
            },
        });
    };

    return (
        <>
            {showReviewModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto mx-2 sm:mx-0">
                        {/* Header with gradient */}
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 sm:p-6 text-white sticky top-0">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Award className="w-5 h-5 sm:w-6 sm:h-6" />
                                    <h3 className="text-lg sm:text-xl font-bold">
                                        Share Your Experience
                                    </h3>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowReviewModal(false);
                                        setSubmitError("");
                                        reset();
                                    }}
                                    className="text-white hover:text-gray-200 transition-colors p-1"
                                >
                                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </div>
                            <p className="mt-1 sm:mt-2 text-purple-100 text-sm">
                                Your feedback helps us improve and serve you
                                better!
                            </p>
                        </div>

                        <div className="p-4 sm:p-6">
                            {/* Error Display */}
                            {submitError && (
                                <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-lg flex items-center space-x-2">
                                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                    <p className="text-red-700 text-sm">
                                        {submitError}
                                    </p>
                                </div>
                            )}

                            <form onSubmit={handleReviewSubmit}>
                                <div className="mb-4 sm:mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                                        How would you rate your experience?
                                    </label>
                                    <div className="flex items-center justify-center space-x-0 sm:space-x-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                type="button"
                                                key={star}
                                                onClick={() => {
                                                    setData("rating", star);
                                                    setSubmitError("");
                                                }}
                                                className="transform hover:scale-110 transition-transform duration-200 focus:outline-none p-1"
                                            >
                                                <Star
                                                    className={`w-8 h-8 sm:w-10 sm:h-10 ${
                                                        star <= data.rating
                                                            ? "text-yellow-400 fill-yellow-400 drop-shadow-lg"
                                                            : "text-gray-300 hover:text-yellow-300"
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                                        <span>Poor</span>
                                        <span>Excellent</span>
                                    </div>
                                </div>

                                <div className="mb-4 sm:mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center space-x-2">
                                            <MessageCircle className="w-4 h-4" />
                                            <span>Tell us more (optional)</span>
                                        </div>
                                    </label>
                                    <textarea
                                        className="w-full h-24 sm:h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm sm:text-base"
                                        placeholder="What did you love? What can we improve? Your thoughts matter to us..."
                                        value={data.message}
                                        onChange={(e) =>
                                            setData("message", e.target.value)
                                        }
                                    />
                                </div>

                                <div className="bg-purple-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
                                    <div className="flex items-start space-x-2">
                                        <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                        <p className="text-xs sm:text-sm text-purple-700">
                                            Thank you for taking the time to
                                            share your experience. Your feedback
                                            helps us create a better platform
                                            for volunteers worldwide.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-2 sm:space-y-0">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowReviewModal(false);
                                            setSubmitError("");
                                            reset();
                                        }}
                                        className="px-4 py-2 sm:px-6 sm:py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        Maybe Later
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg flex items-center justify-center space-x-2"
                                        disabled={
                                            processing || data.rating === 0
                                        }
                                    >
                                        {processing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                <span className="text-sm sm:text-base">
                                                    Submitting...
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-4 h-4" />
                                                <span className="text-sm sm:text-base">
                                                    Share Experience
                                                </span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Review Button - Mobile optimized */}
            {showFloatingButton && (
                <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 animate-bounce hover:animate-none">
                    <button
                        onClick={() => setShowReviewModal(true)}
                        className="group relative inline-flex items-center px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300"></div>

                        <div className="relative flex items-center space-x-1 sm:space-x-2">
                            <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline text-sm sm:text-base">
                                Share Feedback
                            </span>
                            <span className="sm:hidden text-sm">Review</span>
                        </div>

                        {/* Notification badge */}
                        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
                            <div className="bg-yellow-400 text-yellow-900 text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-lg animate-pulse">
                                <Sparkles className="w-2 h-2 sm:w-3 sm:h-3" />
                            </div>
                        </div>
                    </button>

                    {/* Optional: Tooltip on hover - Hidden on mobile */}
                    <div className="hidden sm:block absolute bottom-full right-0 mb-2 w-48 bg-black text-white text-sm rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl">
                        <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4 text-pink-400" />
                            <span>Help us improve your experience!</span>
                        </div>
                        <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-black"></div>
                    </div>
                </div>
            )}

            {/* Alternative: Fixed banner at bottom - Mobile optimized */}
            {!showFloatingButton && (
                <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 sm:p-4 z-40 shadow-lg">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                            <div className="text-center sm:text-left">
                                <p className="font-semibold text-sm sm:text-base">
                                    Love using Volunteer Faster?
                                </p>
                                <p className="text-purple-100 text-xs sm:text-sm">
                                    Share your experience and help us improve!
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowReviewModal(true)}
                            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 text-sm sm:text-base whitespace-nowrap"
                        >
                            Leave Review
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
