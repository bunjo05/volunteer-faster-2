import GeneralPages from "@/Layouts/GeneralPages";
import { useState, useEffect, useRef } from "react";
import { Link, useForm } from "@inertiajs/react";
import {
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    EmailShareButton,
    LinkedinShareButton,
    FacebookIcon,
    TwitterIcon,
    WhatsappIcon,
    EmailIcon,
    LinkedinIcon,
} from "react-share";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { ArrowRightCircle } from "lucide-react";

export default function ViewProject({
    project,
    auth,
    reportCategories,
    suggestedProjects = [],
}) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [subcategories, setSubcategories] = useState([]);
    const gallery = project.gallery_images || [];
    const hasVolunteerProfile = auth.user?.volunteerProfile !== null;
    const isOrganization = auth.user?.role === "Organization";
    const isVolunteer = auth.user?.role === "Volunteer";

    const [replyingTo, setReplyingTo] = useState(null);
    const [activeReplyForms, setActiveReplyForms] = useState({});

    const { data, setData, post, processing, errors } = useForm({
        project_id: project.id,
        report_category_id: "",
        report_subcategory_id: "",
        description: "",
    });

    const {
        data: commentData,
        setData: setCommentData,
        post: postComment,
        processing: commentProcessing,
        reset: resetComment,
    } = useForm({
        comment: "",
        project_id: project.id,
    });

    const {
        data: replyData,
        setData: setReplyData,
        post: postReply,
        processing: replyProcessing,
        reset: resetReply,
    } = useForm({
        comment: "",
        project_remark_id: "",
        parent_id: null,
    });

    const handleSubmitComment = (e) => {
        e.preventDefault();
        postComment(route("project.remarks.store"), {
            onSuccess: () => {
                resetComment();
            },
        });
    };

    // Carousel auto-slide
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) =>
                prev === gallery.length - 1 ? 0 : prev + 1
            );
        }, 4000);
        return () => clearInterval(interval);
    }, [gallery.length]);

    const handleSubmitReport = (e) => {
        e.preventDefault();
        post(route("project.report.store"), {
            onSuccess: () => setIsReportModalOpen(false),
        });
    };

    // Modal handlers
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                closeModal();
            }
        };

        if (isModalOpen)
            document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [isModalOpen]);

    // Navigation functions
    const goToNext = () =>
        setCurrentImageIndex((prev) =>
            prev === gallery.length - 1 ? 0 : prev + 1
        );
    const goToPrev = () =>
        setCurrentImageIndex((prev) =>
            prev === 0 ? gallery.length - 1 : prev - 1
        );

    // Add this function to calculate rating distribution
    const calculateRatingDistribution = (remarks) => {
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        remarks?.forEach((remark) => {
            if (remark.rating && distribution.hasOwnProperty(remark.rating)) {
                distribution[remark.rating]++;
            }
        });
        return distribution;
    };

    // Inside your component, add this before the return statement
    const ratingDistribution = calculateRatingDistribution(
        project.project_remarks
    );
    const totalRatings = Object.values(ratingDistribution).reduce(
        (sum, count) => sum + count,
        0
    );
    const averageRating =
        totalRatings > 0
            ? (
                  Object.entries(ratingDistribution).reduce(
                      (sum, [stars, count]) => sum + parseInt(stars) * count,
                      0
                  ) / totalRatings
              ).toFixed(1)
            : 0;

    const handleStartReply = (remarkId, parentId = null) => {
        setReplyingTo(remarkId);
        setActiveReplyForms((prev) => ({ ...prev, [remarkId]: true }));
        setReplyData({
            ...replyData,
            project_remark_id: remarkId,
            parent_id: parentId,
        });
    };

    const handleSubmitReply = (e, remarkId) => {
        e.preventDefault();
        postReply(route("project.remark.comments.store"), {
            onSuccess: () => {
                resetReply();
                setReplyingTo(null);
                setActiveReplyForms((prev) => ({ ...prev, [remarkId]: false }));
            },
        });
    };

    const timeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1)
            return `${interval} year${interval === 1 ? "" : "s"} ago`;

        interval = Math.floor(seconds / 2592000);
        if (interval >= 1)
            return `${interval} month${interval === 1 ? "" : "s"} ago`;

        interval = Math.floor(seconds / 86400);
        if (interval >= 1)
            return `${interval} day${interval === 1 ? "" : "s"} ago`;

        interval = Math.floor(seconds / 3600);
        if (interval >= 1)
            return `${interval} hour${interval === 1 ? "" : "s"} ago`;

        interval = Math.floor(seconds / 60);
        if (interval >= 1)
            return `${interval} minute${interval === 1 ? "" : "s"} ago`;

        return `${Math.floor(seconds)} second${seconds === 1 ? "" : "s"} ago`;
    };

    return (
        <GeneralPages auth={auth}>
            {/* Hero Image Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {gallery.length > 0 ? (
                    <div
                        className="relative w-full h-[500px] aspect-video overflow-hidden rounded-lg shadow-md cursor-pointer"
                        onClick={openModal}
                    >
                        <img
                            src={`/storage/${gallery[currentImageIndex].image_path}`}
                            alt={`Gallery Image ${currentImageIndex + 1}`}
                            className="w-full h-full object-cover transition-opacity duration-700"
                        />
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                            {gallery.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentImageIndex(idx);
                                    }}
                                    className={`w-2 h-2 rounded-full ${
                                        idx === currentImageIndex
                                            ? "bg-white"
                                            : "bg-gray-400"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-100 rounded-lg shadow-md aspect-video flex items-center justify-center">
                        <img
                            src="/images/placeholder.jpg"
                            alt="Placeholder"
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
            </div>

            {/* Image Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                    <button
                        onClick={closeModal}
                        className="absolute top-6 right-6 text-white text-3xl font-light"
                    >
                        &times;
                    </button>
                    <div ref={modalRef} className="relative w-full max-w-5xl">
                        <img
                            src={`/storage/${gallery[currentImageIndex].image_path}`}
                            alt={`Full Image ${currentImageIndex + 1}`}
                            className="w-full max-h-[85vh] object-contain"
                        />
                        <button
                            onClick={goToPrev}
                            className="absolute left-0 top-1/2 -translate-y-1/2 text-white text-4xl px-4 hover:bg-black/20 rounded-r-lg"
                        >
                            ‹
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-0 top-1/2 -translate-y-1/2 text-white text-4xl px-4 hover:bg-black/20 rounded-l-lg"
                        >
                            ›
                        </button>
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                            {gallery.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`w-2 h-2 rounded-full ${
                                        idx === currentImageIndex
                                            ? "bg-white"
                                            : "bg-gray-500"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column - Main Content */}
                <div className="md:col-span-2 space-y-6 bg-white p-[15px] rounded-lg">
                    <div className="space-y-3">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {project.title}
                        </h1>
                        <div className="flex flex-wrap gap-2">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                {project.category?.name}
                            </span>
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                {project.subcategory?.name}
                            </span>
                            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center">
                                📍 {project.address}
                            </span>
                        </div>
                    </div>
                    {/* Project Details */}
                    <section className="space-y-6">
                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-gray-900">
                                About the Project
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                {project.detailed_description}
                            </p>
                        </div>

                        {project.activities && (
                            <div className="space-y-3">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Volunteer Activities
                                </h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {project.activities}
                                </p>
                            </div>
                        )}
                    </section>
                    {/* Call to Action */}
                    {!isOrganization && (
                        <div className="flex items-center justify-between pt-2">
                            <Link
                                href={route(
                                    "project.volunteer.booking",
                                    project.slug
                                )}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition shadow-md"
                            >
                                Apply to Volunteer
                            </Link>
                            {isVolunteer && (
                                <button
                                    onClick={() => setIsReportModalOpen(true)}
                                    className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                        />
                                    </svg>
                                    Report Project
                                </button>
                            )}
                        </div>
                    )}
                    {/* Project Updates */}
                    {project.project_remarks?.length > 0 && (
                        <section className="pt-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Project Updates
                            </h2>
                            <div className="space-y-3">
                                {project.project_remarks.map((remark) => (
                                    <div key={remark.id} className="space-y-3">
                                        <div className="bg-blue-50/50 p-4 rounded-lg border-l-4 border-blue-500">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-medium text-blue-800">
                                                    {remark.user
                                                        ? `Volunteer: ${remark.user.name}`
                                                        : "Anonymous Volunteer"}
                                                </h3>
                                                <span className="text-xs text-gray-500">
                                                    {timeAgo(remark.created_at)}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 mt-1">
                                                {remark.comment}
                                            </p>
                                            {auth.user && (
                                                <button
                                                    onClick={() =>
                                                        handleStartReply(
                                                            remark.id
                                                        )
                                                    }
                                                    className="text-blue-600 hover:text-blue-800 text-xs mt-2"
                                                >
                                                    Reply
                                                </button>
                                            )}
                                        </div>

                                        {/* Reply form */}
                                        {replyingTo === remark.id &&
                                            activeReplyForms[remark.id] && (
                                                <div className="ml-8 pl-4 border-l-2 border-gray-200">
                                                    <form
                                                        onSubmit={(e) =>
                                                            handleSubmitReply(
                                                                e,
                                                                remark.id
                                                            )
                                                        }
                                                        className="mt-2"
                                                    >
                                                        <textarea
                                                            value={
                                                                replyData.comment
                                                            }
                                                            onChange={(e) =>
                                                                setReplyData(
                                                                    "comment",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                                            rows={2}
                                                            placeholder="Write your reply..."
                                                            required
                                                        />
                                                        <div className="flex justify-end gap-2 mt-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setReplyingTo(
                                                                        null
                                                                    );
                                                                    setActiveReplyForms(
                                                                        (
                                                                            prev
                                                                        ) => ({
                                                                            ...prev,
                                                                            [remark.id]: false,
                                                                        })
                                                                    );
                                                                }}
                                                                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                type="submit"
                                                                disabled={
                                                                    replyProcessing
                                                                }
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

                                        {/* Nested comments */}
                                        {remark.comments?.length > 0 && (
                                            <div className="ml-8 pl-4 border-l-2 border-gray-200 space-y-3">
                                                {remark.comments.map(
                                                    (comment) => (
                                                        <div
                                                            key={comment.id}
                                                            className="space-y-2"
                                                        >
                                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                                <div className="flex justify-between items-start">
                                                                    <h4 className="font-medium text-gray-800 text-sm">
                                                                        {comment
                                                                            .user
                                                                            ?.name ||
                                                                            "Anonymous"}
                                                                    </h4>
                                                                    <span className="text-xs text-gray-500">
                                                                        {timeAgo(
                                                                            comment.created_at
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                <p className="text-gray-600 text-sm mt-1">
                                                                    {
                                                                        comment.comment
                                                                    }
                                                                </p>
                                                                {auth.user && (
                                                                    <button
                                                                        onClick={() =>
                                                                            handleStartReply(
                                                                                remark.id,
                                                                                comment.id
                                                                            )
                                                                        }
                                                                        className="text-blue-600 hover:text-blue-800 text-xs mt-1"
                                                                    >
                                                                        Reply
                                                                    </button>
                                                                )}
                                                            </div>

                                                            {/* Nested reply form */}
                                                            {replyingTo ===
                                                                remark.id &&
                                                                activeReplyForms[
                                                                    remark.id
                                                                ] &&
                                                                replyData.parent_id ===
                                                                    comment.id && (
                                                                    <div className="ml-6 pl-4 border-l-2 border-gray-200">
                                                                        <form
                                                                            onSubmit={(
                                                                                e
                                                                            ) =>
                                                                                handleSubmitReply(
                                                                                    e,
                                                                                    remark.id
                                                                                )
                                                                            }
                                                                            className="mt-2"
                                                                        >
                                                                            <textarea
                                                                                value={
                                                                                    replyData.comment
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    setReplyData(
                                                                                        "comment",
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    )
                                                                                }
                                                                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                                                                rows={
                                                                                    2
                                                                                }
                                                                                placeholder="Write your reply..."
                                                                                required
                                                                            />
                                                                            <div className="flex justify-end gap-2 mt-2">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        setReplyingTo(
                                                                                            null
                                                                                        );
                                                                                        setActiveReplyForms(
                                                                                            (
                                                                                                prev
                                                                                            ) => ({
                                                                                                ...prev,
                                                                                                [remark.id]: false,
                                                                                            })
                                                                                        );
                                                                                    }}
                                                                                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                                                                                >
                                                                                    Cancel
                                                                                </button>
                                                                                <button
                                                                                    type="submit"
                                                                                    disabled={
                                                                                        replyProcessing
                                                                                    }
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
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-5">
                    {/* Organization Card */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                        <Link
                            href={route("home.organization.profile", {
                                slug: project.slug,
                                organization_profile:
                                    project.organization_profile.slug,
                            })}
                            className="flex items-center p-4 hover:bg-gray-50 transition"
                        >
                            <img
                                className="w-14 h-14 rounded-full object-cover"
                                src={
                                    project.organization_profile.logo
                                        ? `/storage/${project.organization_profile.logo}`
                                        : "/images/placeholder.jpg"
                                }
                                alt={project.organization_profile?.name}
                            />
                            {/* <div className="ml-3"> */}
                            <div className="ml-3 flex justify-between w-full">
                                <div>
                                    <h3 className="font-semibold text-[18px] text-gray-900">
                                        {project.organization_profile?.name}
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        Organization
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <ArrowRightCircle />
                                </div>
                            </div>
                            {/* </div> */}
                        </Link>
                    </div>

                    {/* Quick Facts Card */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                        <h3 className="font-semibold text-gray-900 mb-3">
                            Quick Facts
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {project.start_date && (
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Start Date
                                        </p>
                                        <p className="font-medium">
                                            {project.start_date}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Duration
                                    </p>
                                    <p className="font-medium">
                                        {`${project.min_duration} - ${project.max_duration} `}
                                        {/* {project.duration}{" "} */}
                                        {project.duration_type}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    Minimum Age
                                </p>
                                <p className="font-medium">
                                    {project.minAge || "18+"}
                                </p>
                            </div>
                        </div>

                        {/* Suitable For */}
                        {project.suitable?.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-500 mb-2">
                                    Suitable For
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {project.suitable.map((item, index) => (
                                        <span
                                            key={index}
                                            className="bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-full text-xs"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Availability */}
                        {project.availability_months?.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-500 mb-2">
                                    Availability
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {project.availability_months.map(
                                        (item, index) => (
                                            <span
                                                key={index}
                                                className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full text-xs"
                                            >
                                                {item}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-5 border-b border-gray-100 pb-2">
                            Volunteer Ratings
                        </h3>

                        {totalRatings > 0 ? (
                            <div className="space-y-6">
                                {/* Average Rating */}
                                <div className="flex items-center justify-center gap-4">
                                    <div className="text-5xl font-bold text-gray-900 leading-none">
                                        {averageRating}
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <svg
                                                    key={star}
                                                    className={`h-6 w-6 ${
                                                        star <=
                                                        Math.round(
                                                            averageRating
                                                        )
                                                            ? "text-yellow-400"
                                                            : "text-gray-300"
                                                    }`}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            {totalRatings}{" "}
                                            {totalRatings === 1
                                                ? "rating"
                                                : "ratings"}
                                        </div>
                                    </div>
                                </div>

                                {/* Rating Distribution */}
                                <div className="space-y-3">
                                    {[5, 4, 3, 2, 1].map((stars) => (
                                        <div
                                            key={stars}
                                            className="flex items-center"
                                        >
                                            <div className="w-10 text-sm font-medium text-gray-900">
                                                {stars} star
                                            </div>
                                            <div className="flex-1 mx-3 h-3 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-3 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${
                                                            totalRatings > 0
                                                                ? (ratingDistribution[
                                                                      stars
                                                                  ] /
                                                                      totalRatings) *
                                                                  100
                                                                : 0
                                                        }%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="w-8 text-sm text-gray-500 text-right">
                                                {ratingDistribution[stars]}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 italic">
                                No ratings yet
                            </p>
                        )}
                    </div>

                    {/* Share Card */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                        <h3 className="font-semibold text-gray-900 mb-3">
                            Share This Opportunity
                        </h3>
                        <div className="flex justify-center gap-3 mb-4">
                            <FacebookShareButton
                                url={window.location.href}
                                quote={`Check out: ${project.title}`}
                            >
                                <FacebookIcon size={32} round />
                            </FacebookShareButton>
                            <TwitterShareButton
                                url={window.location.href}
                                title={`Check out: ${project.title}`}
                            >
                                <TwitterIcon size={32} round />
                            </TwitterShareButton>
                            <WhatsappShareButton
                                url={window.location.href}
                                title={`Check out: ${project.title}`}
                            >
                                <WhatsappIcon size={32} round />
                            </WhatsappShareButton>
                            <EmailShareButton
                                url={window.location.href}
                                subject={`Volunteer Opportunity: ${project.title}`}
                            >
                                <EmailIcon size={32} round />
                            </EmailShareButton>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-2">
                                Copy link
                            </p>
                            <div className="flex">
                                <input
                                    type="text"
                                    readOnly
                                    value={window.location.href}
                                    className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <button
                                    onClick={() =>
                                        navigator.clipboard.writeText(
                                            window.location.href
                                        )
                                    }
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-r-md text-xs flex items-center"
                                >
                                    <ClipboardDocumentIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Suggested Projects */}
                    {suggestedProjects?.length > 0 && (
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                            <h3 className="font-semibold text-gray-900 mb-3">
                                {hasVolunteerProfile
                                    ? "Projects Matching Your Skills"
                                    : "Suggested Projects"}
                            </h3>
                            <div className="space-y-3">
                                {suggestedProjects.map((suggestedProject) => (
                                    <Link
                                        key={suggestedProject.id}
                                        href={route(
                                            "projects",
                                            suggestedProject.slug
                                        )}
                                        className="flex gap-3 p-2 hover:bg-gray-50 rounded transition"
                                    >
                                        <div className="flex-shrink-0 w-12 h-12 rounded overflow-hidden bg-gray-100">
                                            {suggestedProject.featured_image ? (
                                                <img
                                                    src={`/storage/${suggestedProject.featured_image}`}
                                                    alt={suggestedProject.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-6 w-6"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">
                                                {suggestedProject.title}
                                            </h4>
                                            <p className="text-xs text-gray-500">
                                                {
                                                    suggestedProject.category
                                                        ?.name
                                                }
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Report Modal */}
            {isReportModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
                        <button
                            onClick={() => setIsReportModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Report Project
                            </h2>
                            <form onSubmit={handleSubmitReport}>
                                <div className="space-y-4">
                                    <div>
                                        <label
                                            htmlFor="report_category_id"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Issue Category
                                        </label>
                                        <select
                                            id="report_category_id"
                                            value={data.report_category_id}
                                            onChange={(e) => {
                                                setData(
                                                    "report_category_id",
                                                    e.target.value
                                                );
                                                const selectedCategory =
                                                    reportCategories.find(
                                                        (cat) =>
                                                            cat.id ==
                                                            e.target.value
                                                    );
                                                setSubcategories(
                                                    selectedCategory?.subcategories ||
                                                        []
                                                );
                                            }}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                            required
                                        >
                                            <option value="">
                                                Select a category
                                            </option>
                                            {reportCategories.map(
                                                (category) => (
                                                    <option
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.name}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="report_subcategory_id"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Issue Type
                                        </label>
                                        <select
                                            id="report_subcategory_id"
                                            value={data.report_subcategory_id}
                                            onChange={(e) =>
                                                setData(
                                                    "report_subcategory_id",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                            required
                                            disabled={!data.report_category_id}
                                        >
                                            <option value="">
                                                Select a type
                                            </option>
                                            {subcategories.map(
                                                (subcategory) => (
                                                    <option
                                                        key={subcategory.id}
                                                        value={subcategory.id}
                                                    >
                                                        {subcategory.name}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="description"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                            rows={4}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsReportModalOpen(false)
                                        }
                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                                    >
                                        {processing
                                            ? "Submitting..."
                                            : "Submit Report"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </GeneralPages>
    );
}
