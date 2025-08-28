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
            comment: "", // Reset comment field
            project_remark_id: remarkId,
            parent_id: parentId,
            user_id: auth.user?.id, // Include user ID
        });
    };

    const handleSubmitReply = (e, remarkId) => {
        e.preventDefault();

        // Ensure we have all required data
        const formData = {
            ...replyData,
            user_id: auth.user?.id,
            project_remark_id: remarkId,
        };

        postReply(route("project.remark.comments.store"), formData, {
            onSuccess: () => {
                resetReply();
                setReplyingTo(null);
                setActiveReplyForms((prev) => ({ ...prev, [remarkId]: false }));
            },
            onError: (errors) => {
                console.error("Error submitting reply:", errors);
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
                        className="relative w-full h-[500px] aspect-video overflow-hidden rounded-box shadow-lg cursor-pointer"
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
                    <div className="bg-base-200 rounded-box shadow-lg aspect-video flex items-center justify-center">
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
                <div className="modal modal-open">
                    <div className="modal-box max-w-5xl p-0 relative">
                        <button
                            onClick={closeModal}
                            className="btn btn-sm btn-circle absolute right-2 top-2"
                        >
                            ✕
                        </button>
                        <div ref={modalRef} className="relative w-full">
                            <img
                                src={`/storage/${gallery[currentImageIndex].image_path}`}
                                alt={`Full Image ${currentImageIndex + 1}`}
                                className="w-full max-h-[85vh] object-contain"
                            />
                            <button
                                onClick={goToPrev}
                                className="absolute left-0 top-1/2 -translate-y-1/2 btn btn-circle btn-ghost text-white text-4xl"
                            >
                                ‹
                            </button>
                            <button
                                onClick={goToNext}
                                className="absolute right-0 top-1/2 -translate-y-1/2 btn btn-circle btn-ghost text-white text-4xl"
                            >
                                ›
                            </button>
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                                {gallery.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() =>
                                            setCurrentImageIndex(idx)
                                        }
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
                </div>
            )}

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column - Main Content */}
                <div className="md:col-span-2 space-y-6 bg-base-100 p-6 rounded-box shadow">
                    <div className="space-y-3">
                        <h1 className="text-3xl font-bold text-base-content">
                            {project.title}
                        </h1>
                        <div className="flex flex-wrap gap-2">
                            <span className="badge badge-primary">
                                {project.category?.name}
                            </span>
                            <span className="badge badge-secondary">
                                {project.subcategory?.name}
                            </span>
                            <span className="badge badge-accent">
                                📍 {project.address}
                            </span>
                        </div>
                    </div>
                    {/* Project Details */}
                    <section className="space-y-6">
                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-base-content">
                                About the Project
                            </h2>
                            <p className="text-base-content leading-relaxed">
                                {project.detailed_description}
                            </p>
                        </div>

                        {project.activities && (
                            <div className="space-y-3">
                                <h2 className="text-xl font-semibold text-base-content">
                                    Volunteer Activities
                                </h2>
                                <p className="text-base-content leading-relaxed">
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
                                className="btn btn-primary"
                            >
                                Apply to Volunteer
                            </Link>
                            {isVolunteer && (
                                <button
                                    onClick={() => setIsReportModalOpen(true)}
                                    className="btn btn-ghost text-error"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
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
                            <h2 className="text-xl font-semibold text-base-content mb-4">
                                Project Reviews
                            </h2>
                            <div className="space-y-3">
                                {project.project_remarks.map((remark) => (
                                    <CommentThread
                                        key={remark.id}
                                        remark={remark}
                                        auth={auth}
                                        timeAgo={timeAgo}
                                        handleStartReply={handleStartReply}
                                        replyingTo={replyingTo}
                                        activeReplyForms={activeReplyForms}
                                        replyData={replyData}
                                        setReplyData={setReplyData}
                                        replyProcessing={replyProcessing}
                                        handleSubmitReply={handleSubmitReply}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-5">
                    {/* Organization Card */}
                    <div className="card bg-base-100 shadow-sm">
                        <Link
                            href={route("home.organization.profile", {
                                slug: project.slug,
                                organization_profile:
                                    project.organization_profile.slug,
                            })}
                            className="card-body p-4 hover:bg-base-200 transition"
                        >
                            <div className="flex items-center">
                                <div className="avatar">
                                    <div className="w-14 rounded-full">
                                        <img
                                            src={
                                                project.organization_profile
                                                    .logo
                                                    ? `/storage/${project.organization_profile.logo}`
                                                    : "/images/placeholder.jpg"
                                            }
                                            alt={
                                                project.organization_profile
                                                    ?.name
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="ml-3 flex justify-between w-full">
                                    <div>
                                        <h3 className="card-title text-lg">
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
                            </div>
                        </Link>
                    </div>

                    {/* Quick Facts Card */}
                    <div className="card bg-base-100 shadow-sm">
                        <div className="card-body p-5">
                            <h3 className="card-title text-lg mb-3">
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

                            {/* Includes For */}
                            {project.includes?.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-500 mb-2">
                                        Includes
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.includes.map((item, index) => (
                                            <span
                                                key={index}
                                                className="badge badge-primary"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Excludes For */}
                            {project.excludes?.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-500 mb-2">
                                        Excludes
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.excludes.map((item, index) => (
                                            <span
                                                key={index}
                                                className="badge bg-red-600 text-white"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

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
                                                className="badge badge-primary"
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
                                                    className="badge badge-secondary"
                                                >
                                                    {item}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Ratings Card */}
                    <div className="card bg-base-100 shadow-sm">
                        <div className="card-body p-6">
                            <h3 className="card-title text-lg mb-5">
                                Volunteer Ratings
                            </h3>

                            {totalRatings > 0 ? (
                                <div className="space-y-6">
                                    {/* Average Rating */}
                                    <div className="flex items-center justify-center gap-4">
                                        <div className="text-5xl font-bold text-base-content leading-none">
                                            {averageRating}
                                        </div>
                                        <div className="flex flex-col items-start">
                                            <div className="rating rating-md">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <input
                                                        key={star}
                                                        type="radio"
                                                        name="rating-2"
                                                        className={`mask mask-star-2 ${
                                                            star <=
                                                            Math.round(
                                                                averageRating
                                                            )
                                                                ? "bg-yellow-400"
                                                                : "bg-gray-300"
                                                        }`}
                                                        checked={
                                                            star ===
                                                            Math.round(
                                                                averageRating
                                                            )
                                                        }
                                                        readOnly
                                                    />
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
                                                <div className="w-10 text-sm font-medium text-base-content">
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
                    </div>

                    {/* Share Card */}
                    <div className="card bg-base-100 shadow-sm">
                        <div className="card-body p-5">
                            <h3 className="card-title text-lg mb-3">
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
                                <div className="join w-full">
                                    <input
                                        type="text"
                                        readOnly
                                        value={window.location.href}
                                        className="input input-bordered join-item w-full"
                                    />
                                    <button
                                        onClick={() =>
                                            navigator.clipboard.writeText(
                                                window.location.href
                                            )
                                        }
                                        className="btn btn-primary join-item"
                                    >
                                        <ClipboardDocumentIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Suggested Projects */}
                    {suggestedProjects?.length > 0 && (
                        <div className="card bg-base-100 shadow-sm">
                            <div className="card-body p-5">
                                <h3 className="card-title text-lg mb-3">
                                    {hasVolunteerProfile
                                        ? "Projects Matching Your Skills"
                                        : "Suggested Projects"}
                                </h3>
                                <div className="space-y-3">
                                    {suggestedProjects.map(
                                        (suggestedProject) => (
                                            <Link
                                                key={suggestedProject.id}
                                                href={route(
                                                    "projects",
                                                    suggestedProject.slug
                                                )}
                                                className="flex gap-3 p-2 hover:bg-base-200 rounded transition"
                                            >
                                                <div className="avatar">
                                                    <div className="w-12 h-12 rounded">
                                                        {suggestedProject.featured_image ? (
                                                            <img
                                                                src={`/storage/${suggestedProject.featured_image}`}
                                                                alt={
                                                                    suggestedProject.title
                                                                }
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-base-200 text-gray-400">
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
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-base-content">
                                                        {suggestedProject.title}
                                                    </h4>
                                                    <p className="text-xs text-gray-500">
                                                        {
                                                            suggestedProject
                                                                .category?.name
                                                        }
                                                    </p>
                                                </div>
                                            </Link>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Report Modal */}
            {isReportModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-md">
                        <button
                            onClick={() => setIsReportModalOpen(false)}
                            className="btn btn-sm btn-circle absolute right-2 top-2"
                        >
                            ✕
                        </button>
                        <h2 className="text-lg font-semibold mb-4">
                            Report Project
                        </h2>
                        <form onSubmit={handleSubmitReport}>
                            <div className="space-y-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">
                                            Issue Category
                                        </span>
                                    </label>
                                    <select
                                        className="select select-bordered w-full"
                                        value={data.report_category_id}
                                        onChange={(e) => {
                                            setData(
                                                "report_category_id",
                                                e.target.value
                                            );
                                            const selectedCategory =
                                                reportCategories.find(
                                                    (cat) =>
                                                        cat.id == e.target.value
                                                );
                                            setSubcategories(
                                                selectedCategory?.subcategories ||
                                                    []
                                            );
                                        }}
                                        required
                                    >
                                        <option value="">
                                            Select a category
                                        </option>
                                        {reportCategories.map((category) => (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">
                                            Issue Type
                                        </span>
                                    </label>
                                    <select
                                        className="select select-bordered w-full"
                                        value={data.report_subcategory_id}
                                        onChange={(e) =>
                                            setData(
                                                "report_subcategory_id",
                                                e.target.value
                                            )
                                        }
                                        required
                                        disabled={!data.report_category_id}
                                    >
                                        <option value="">Select a type</option>
                                        {subcategories.map((subcategory) => (
                                            <option
                                                key={subcategory.id}
                                                value={subcategory.id}
                                            >
                                                {subcategory.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">
                                            Description
                                        </span>
                                    </label>
                                    <textarea
                                        className="textarea textarea-bordered h-24"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-action">
                                <button
                                    type="button"
                                    onClick={() => setIsReportModalOpen(false)}
                                    className="btn btn-ghost"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="btn btn-error"
                                >
                                    {processing ? (
                                        <span className="loading loading-spinner"></span>
                                    ) : (
                                        "Submit Report"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </GeneralPages>
    );
}

const CommentThread = ({
    remark,
    auth,
    timeAgo,
    handleStartReply,
    replyingTo,
    activeReplyForms,
    replyData,
    setReplyData,
    replyProcessing,
    handleSubmitReply,
    depth = 0,
}) => {
    const maxDepth = 5;
    const isTopLevel = depth === 0;
    const indentClass = `ml-${
        Math.min(depth, 3) * 4
    } pl-4 border-l-2 border-base-200`;

    const showReplyButton = auth.user && isTopLevel;

    // Sort nested comments by most recent first
    const sortedComments = [...(remark.comments || [])].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    return (
        <div className="space-y-4">
            {/* Comment Card */}
            <div className={`relative ${isTopLevel ? "pt-0" : "pt-2"}`}>
                <div
                    className={`group p-4 rounded-box transition-all duration-150 ${
                        isTopLevel
                            ? "bg-base-100 shadow-sm border border-base-200 hover:border-base-300"
                            : "bg-base-200"
                    }`}
                >
                    <div className="flex items-start space-x-3">
                        {/* User Avatar */}
                        <div className="flex-shrink-0">
                            <div className="avatar">
                                <div className="w-8 rounded-full">
                                    {remark.user?.avatar ? (
                                        <img
                                            src={`/storage/${remark.user.avatar}`}
                                            alt={remark.user.name}
                                        />
                                    ) : (
                                        <div className="bg-base-300 text-base-content flex items-center justify-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
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
                                </div>
                            </div>
                        </div>

                        {/* Comment Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <h4 className="text-sm font-medium text-base-content">
                                        {remark.user?.name ||
                                            "Anonymous Volunteer"}
                                    </h4>
                                    <span className="text-xs text-gray-500">
                                        {timeAgo(remark.created_at)}
                                    </span>
                                </div>

                                {/* Reply Button */}
                                {showReplyButton && (
                                    <button
                                        onClick={() =>
                                            handleStartReply(remark.id)
                                        }
                                        className="btn btn-xs btn-ghost"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-3.5 w-3.5 mr-1"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Reply
                                    </button>
                                )}
                            </div>
                            <p className="mt-1 text-sm text-base-content leading-snug">
                                {remark.comment}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reply Form (only for top-level comments) */}
            {isTopLevel &&
                replyingTo === remark.id &&
                activeReplyForms[remark.id] && (
                    <div className={`${indentClass} mt-3`}>
                        <form
                            onSubmit={(e) => handleSubmitReply(e, remark.id)}
                            className="bg-base-100 p-3 rounded-box shadow-xs border border-base-200"
                        >
                            <textarea
                                value={replyData.comment}
                                onChange={(e) =>
                                    setReplyData({
                                        ...replyData,
                                        comment: e.target.value,
                                    })
                                }
                                className="textarea textarea-bordered w-full"
                                rows={3}
                                placeholder="Write your thoughtful reply..."
                                required
                            />
                            <div className="mt-2 flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setReplyingTo(null);
                                        setActiveReplyForms((prev) => ({
                                            ...prev,
                                            [remark.id]: false,
                                        }));
                                    }}
                                    className="btn btn-ghost btn-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={replyProcessing}
                                    className="btn btn-primary btn-sm"
                                >
                                    {replyProcessing ? (
                                        <span className="loading loading-spinner"></span>
                                    ) : (
                                        "Post Reply"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

            {/* Nested Comments */}
            {sortedComments.length > 0 && depth < maxDepth && (
                <div className={indentClass}>
                    {sortedComments.map((comment) => (
                        <CommentThread
                            key={comment.id}
                            remark={comment}
                            auth={auth}
                            timeAgo={timeAgo}
                            handleStartReply={handleStartReply}
                            replyingTo={replyingTo}
                            activeReplyForms={activeReplyForms}
                            replyData={replyData}
                            setReplyData={setReplyData}
                            replyProcessing={replyProcessing}
                            handleSubmitReply={handleSubmitReply}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
