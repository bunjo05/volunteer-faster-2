import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { useForm } from "@inertiajs/react";

export default function Review({ activeBooking }) {
    const { data, setData, post, processing, errors } = useForm({
        project_id: activeBooking?.project?.id || "",
        booking_id: activeBooking?.id || "",
        rating: 0,
        comment: "",
    });

    const [showReviewModal, setShowReviewModal] = useState(false);

    const handleReviewSubmit = (e) => {
        e.preventDefault();

        if (!data.rating) {
            return alert("Please select a rating");
        }

        post(route("volunteer.reviews.stores"), {
            onSuccess: () => {
                setShowReviewModal(false);
                setData({
                    project_id: activeBooking?.project?.id || "",
                    booking_id: activeBooking?.id || "",
                    rating: 0,
                    comment: "",
                });
            },
        });
    };

    useEffect(() => {
        if (activeBooking) {
            setData({
                project_id: activeBooking.project.id,
                booking_id: activeBooking.id,
                rating: 0,
                comment: "",
            });
        }
    }, [activeBooking]);

    return (
        <>
            {showReviewModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Submit Your Review
                            </h3>
                            <form onSubmit={handleReviewSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Rating
                                    </label>
                                    <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                type="button"
                                                key={star}
                                                onClick={() =>
                                                    setData("rating", star)
                                                }
                                                className="focus:outline-none"
                                            >
                                                <Star
                                                    className={`h-8 w-8 ${
                                                        star <= data.rating
                                                            ? "text-yellow-400 fill-yellow-400"
                                                            : "text-gray-300"
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Comment
                                    </label>
                                    <textarea
                                        className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Share your experience..."
                                        value={data.comment}
                                        onChange={(e) =>
                                            setData("comment", e.target.value)
                                        }
                                    />
                                </div>
                                <div className="mt-4 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowReviewModal(false)
                                        }
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? "Submitting..."
                                            : "Submit Review"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            <button
                onClick={() => setShowReviewModal(true)}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg"
                disabled={!activeBooking}
            >
                Submit Review
            </button>
        </>
    );
}
