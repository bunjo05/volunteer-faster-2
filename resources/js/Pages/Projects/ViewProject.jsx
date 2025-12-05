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
import {
    ArrowRightCircle,
    Calendar,
    Clock,
    Users,
    DollarSign,
    AlertCircle,
} from "lucide-react";

import { Head } from "@inertiajs/react";

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

    // Get APP_URL for SEO
    const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    const currentUrl =
        typeof window !== "undefined" ? window.location.href : appUrl;

    // Page-specific SEO - Using project title
    const pageTitle = `${project.title} | Volunteer Faster`;
    const pageDescription =
        project.short_description ||
        `Join this volunteer project in ${project.city}, ${
            project.country
        }. ${project.detailed_description?.substring(0, 150)}...`;
    const pageKeywords = `volunteer project, ${project.category?.name}, volunteering, ${project.city}, ${project.country}, volunteer opportunity`;

    // Get image for social sharing
    const mainImage =
        gallery.length > 0
            ? `${appUrl}/storage/${gallery[0].image_path}`
            : `${appUrl}/hero.jpg`;

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
        <>
            <Head>
                {/* Primary Meta Tags */}
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta name="keywords" content={pageKeywords} />
                <meta name="author" content="Volunteer Faster" />
                <meta name="robots" content="index, follow" />
                <meta name="language" content="English" />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content={currentUrl} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:image" content={mainImage} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta
                    property="og:image:alt"
                    content={`${project.title} - Volunteer Project`}
                />
                <meta property="og:site_name" content="Volunteer Faster" />
                <meta property="og:locale" content="en_US" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={currentUrl} />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
                <meta name="twitter:image" content={mainImage} />
                <meta name="twitter:site" content="@volunteerfaster" />
                <meta name="twitter:creator" content="@volunteerfaster" />
                <meta
                    name="twitter:image:alt"
                    content={`${project.title} - Volunteer Project`}
                />

                {/* Additional Meta Tags */}
                <link rel="canonical" href={currentUrl} />

                {/* Structured Data for SEO */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Event",
                        name: project.title,
                        description:
                            project.short_description ||
                            "Volunteer opportunity",
                        url: currentUrl,
                        startDate: project.start_date,
                        endDate: project.end_date,
                        location: {
                            "@type": "Place",
                            name:
                                project.location ||
                                `${project.city}, ${project.country}`,
                            address: {
                                "@type": "PostalAddress",
                                addressCountry: project.country,
                                addressRegion: project.state,
                                addressLocality: project.city,
                            },
                        },
                        organizer: project.organization_profile
                            ? {
                                  "@type": "Organization",
                                  name: project.organization_profile.name,
                                  url: `${appUrl}/organization/${project.organization_profile.slug}`,
                                  logo: project.organization_profile.logo
                                      ? `${appUrl}/storage/${project.organization_profile.logo}`
                                      : `${appUrl}/logo.png`,
                              }
                            : null,
                        offers: {
                            "@type": "Offer",
                            category: project.category?.name,
                            availability: "https://schema.org/InStock",
                            price: project.fees || 0,
                            priceCurrency: project.currency || "USD",
                        },
                        aggregateRating:
                            totalRatings > 0
                                ? {
                                      "@type": "AggregateRating",
                                      ratingValue: averageRating,
                                      ratingCount: totalRatings,
                                      bestRating: "5",
                                      worstRating: "1",
                                  }
                                : null,
                        eventStatus: "https://schema.org/EventScheduled",
                        duration: `PT${project.min_duration || 1}H`,
                        image:
                            gallery.length > 0
                                ? gallery.map(
                                      (img) =>
                                          `${appUrl}/storage/${img.image_path}`
                                  )
                                : [
                                      `${appUrl}/images/project-default-preview.jpg`,
                                  ],
                        breadcrumb: {
                            "@type": "BreadcrumbList",
                            itemListElement: [
                                {
                                    "@type": "ListItem",
                                    position: 1,
                                    name: "Home",
                                    item: appUrl,
                                },
                                {
                                    "@type": "ListItem",
                                    position: 2,
                                    name: "Projects",
                                    item: `${appUrl}/projects`,
                                },
                                {
                                    "@type": "ListItem",
                                    position: 3,
                                    name: project.title,
                                    item: currentUrl,
                                },
                            ],
                        },
                    })}
                </script>
            </Head>
            <GeneralPages auth={auth}>
                {/* Hero Image Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
                    {gallery.length > 0 ? (
                        <div
                            className="relative w-full h-[500px] aspect-video overflow-hidden rounded-xl shadow-xl cursor-pointer"
                            onClick={openModal}
                        >
                            <img
                                src={`/storage/${gallery[currentImageIndex].image_path}`}
                                alt={`Gallery Image ${currentImageIndex + 1}`}
                                className="w-full h-full object-cover transition-opacity duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                {gallery.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentImageIndex(idx);
                                        }}
                                        className={`w-3 h-3 rounded-full transition-all ${
                                            idx === currentImageIndex
                                                ? "bg-white scale-110"
                                                : "bg-white/60"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-base-200 rounded-xl shadow-xl aspect-video flex items-center justify-center">
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
                        <div className="modal-box max-w-5xl p-0 relative bg-transparent shadow-none">
                            <button
                                onClick={closeModal}
                                className="btn btn-sm btn-circle absolute right-4 top-4 z-10 bg-black/30 text-white border-0 hover:bg-black/50"
                            >
                                ✕
                            </button>
                            <div ref={modalRef} className="relative w-full">
                                <img
                                    src={`/storage/${gallery[currentImageIndex].image_path}`}
                                    alt={`Full Image ${currentImageIndex + 1}`}
                                    className="w-full max-h-[85vh] object-contain rounded-lg"
                                />
                                <button
                                    onClick={goToPrev}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 btn btn-circle btn-ghost text-white text-4xl bg-black/30 hover:bg-black/50 border-0"
                                >
                                    ‹
                                </button>
                                <button
                                    onClick={goToNext}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 btn btn-circle btn-ghost text-white text-4xl bg-black/30 hover:bg-black/50 border-0"
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
                                            className={`w-3 h-3 rounded-full transition-all ${
                                                idx === currentImageIndex
                                                    ? "bg-white scale-110"
                                                    : "bg-white/60"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column - Main Content */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Project Header */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                {project.title}
                            </h1>
                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className="badge badge-primary badge-lg px-3 py-2">
                                    {project.category?.name}
                                </span>
                                <span className="badge badge-secondary badge-lg px-3 py-2">
                                    {project.subcategory?.name}
                                </span>
                                <span className="badge badge-accent badge-lg px-3 py-2">
                                    📍
                                    <span>{project.country} </span>
                                    <span>- {project.city}</span>
                                    <>
                                        {project.state ? (
                                            <span>- {project.state}</span>
                                        ) : (
                                            <span></span>
                                        )}
                                    </>
                                </span>
                            </div>

                            {/* Project Description */}
                            <section className="space-y-6">
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                                        About the Project
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed text-lg">
                                        {project.detailed_description}
                                    </p>
                                </div>

                                {project.activities && (
                                    <div className="space-y-4">
                                        <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                                            Volunteer Activities
                                        </h2>
                                        <p className="text-gray-700 leading-relaxed text-lg">
                                            {project.activities}
                                        </p>
                                    </div>
                                )}
                            </section>

                            {/* Call to Action */}
                            {!isOrganization && (
                                <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
                                    <Link
                                        href={route(
                                            "project.volunteer.booking",
                                            project.slug
                                        )}
                                        className="btn btn-primary btn-lg px-8 rounded-full"
                                    >
                                        Apply to Volunteer
                                    </Link>
                                    {isVolunteer && (
                                        <button
                                            onClick={() =>
                                                setIsReportModalOpen(true)
                                            }
                                            className="btn btn-ghost text-error hover:bg-error/10 rounded-full"
                                        >
                                            <AlertCircle className="h-5 w-5 mr-2" />
                                            Report Project
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Project Updates */}
                        {project.project_remarks?.length > 0 && (
                            <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-2">
                                    Project Reviews
                                </h2>
                                <div className="space-y-6">
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
                                            handleSubmitReply={
                                                handleSubmitReply
                                            }
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Organization Card */}
                        {/* Organization Card */}
                        <div className="card bg-white shadow-sm border border-gray-100 overflow-hidden">
                            <Link
                                href={route("public.organization.profile", {
                                    organization_slug:
                                        project.organization_profile.slug,
                                })}
                                className="card-body p-6 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center">
                                    <div className="avatar">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow">
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
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                    </div>
                                    <div className="ml-4 flex justify-between w-full">
                                        <div>
                                            <h3 className="card-title text-lg font-semibold text-gray-900">
                                                {
                                                    project.organization_profile
                                                        ?.name
                                                }
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Organization
                                            </p>
                                        </div>
                                        <div className="flex items-center text-primary">
                                            <ArrowRightCircle size={20} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Quick Facts Card */}
                        <div className="card bg-white shadow-md border border-gray-100 overflow-hidden">
                            <div className="card-body p-6">
                                <div className="flex items-center mb-5">
                                    <div className="bg-primary/10 p-2 rounded-lg">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-primary"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="card-title text-xl font-semibold ml-3 text-gray-900">
                                        Quick Facts
                                    </h3>
                                </div>

                                {/* Fees Section */}
                                {project.type_of_project === "Paid" && (
                                    <>
                                        {project.fees && (
                                            <div className="mb-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-600 mb-1">
                                                            Program Fees
                                                        </p>
                                                        <div className="flex items-baseline">
                                                            <span className="text-2xl font-bold text-primary">
                                                                {
                                                                    project.currency
                                                                }{" "}
                                                                {project.fees}
                                                            </span>
                                                            <span className="text-sm text-gray-500 ml-2">
                                                                /{" "}
                                                                {
                                                                    project.category_of_charge
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="bg-primary/10 p-2 rounded-full">
                                                        <DollarSign className="h-5 w-5 text-primary" />
                                                    </div>
                                                </div>
                                                {/* {project.includes && (
                                                <p className="text-xs text-gray-500 mt-2">
                                                    {project.includes}
                                                </p>
                                            )} */}
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Quick Facts Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    {project.start_date && (
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                            <div className="flex items-center mb-2">
                                                <Calendar className="h-4 w-4 text-primary mr-2" />
                                                <p className="text-sm font-medium text-gray-600">
                                                    Start Date
                                                </p>
                                            </div>
                                            <p className="font-semibold text-gray-900">
                                                {project.start_date}
                                            </p>
                                        </div>
                                    )}

                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        <div className="flex items-center mb-2">
                                            <Clock className="h-4 w-4 text-primary mr-2" />
                                            <p className="text-sm font-medium text-gray-600">
                                                Duration
                                            </p>
                                        </div>
                                        <p className="font-semibold text-gray-900">
                                            {`${project.min_duration} - ${project.max_duration} `}
                                            {project.duration_type}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        <div className="flex items-center mb-2">
                                            <Users className="h-4 w-4 text-primary mr-2" />
                                            <p className="text-sm font-medium text-gray-600">
                                                Minimum Age
                                            </p>
                                        </div>
                                        <p className="font-semibold text-gray-900">
                                            {project.minAge || "18+"}
                                        </p>
                                    </div>

                                    {project.participants && (
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                            <div className="flex items-center mb-2">
                                                <Users className="h-4 w-4 text-primary mr-2" />
                                                <p className="text-sm font-medium text-gray-600">
                                                    Participants
                                                </p>
                                            </div>
                                            <p className="font-semibold text-gray-900">
                                                {project.participants}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Badge Sections with Improved Styling */}
                                {project.includes?.length > 0 && (
                                    <div className="mb-5">
                                        <div className="flex items-center mb-3">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 text-green-500 mr-2"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            <p className="text-sm font-medium text-gray-600">
                                                What's Included
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {project.includes.map(
                                                (item, index) => (
                                                    <span
                                                        key={index}
                                                        className="badge badge-success gap-1 py-2 px-3 rounded-lg border-0"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-3 w-3"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                        {item}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                                {project.excludes?.length > 0 && (
                                    <div className="mb-5">
                                        <div className="flex items-center mb-3">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 text-red-500 mr-2"
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
                                            <p className="text-sm font-medium text-gray-600">
                                                What's Not Included
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {project.excludes.map(
                                                (item, index) => (
                                                    <span
                                                        key={index}
                                                        className="badge badge-error gap-1 py-2 px-3 rounded-lg border-0"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-3 w-3"
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
                                                        {item}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                                {project.suitable?.length > 0 && (
                                    <div className="mb-5">
                                        <div className="flex items-center mb-3">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 text-blue-500 mr-2"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                                />
                                            </svg>
                                            <p className="text-sm font-medium text-gray-600">
                                                Suitable For
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {project.suitable.map(
                                                (item, index) => (
                                                    <span
                                                        key={index}
                                                        className="badge badge-info gap-1 py-2 px-3 rounded-lg border-0"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-3 w-3"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                                            />
                                                        </svg>
                                                        {item}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                                {project.availability_months?.length > 0 && (
                                    <div>
                                        <div className="flex items-center mb-3">
                                            <Calendar className="h-4 w-4 text-purple-500 mr-2" />
                                            <p className="text-sm font-medium text-gray-600">
                                                Best Time to Volunteer
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {project.availability_months.map(
                                                (item, index) => (
                                                    <span
                                                        key={index}
                                                        className="badge badge-secondary gap-1 py-2 px-3 rounded-lg border-0"
                                                    >
                                                        <Calendar className="h-3 w-3" />
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
                        <div className="card bg-white shadow-sm border border-gray-100 overflow-hidden">
                            <div className="card-body p-6">
                                <h3 className="card-title text-lg font-semibold mb-5 text-gray-900">
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
                                                <div className="rating rating-md">
                                                    {[1, 2, 3, 4, 5].map(
                                                        (star) => (
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
                                                        )
                                                    )}
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
                                                    <div className="flex-1 mx-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-2 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full transition-all duration-500"
                                                            style={{
                                                                width: `${
                                                                    totalRatings >
                                                                    0
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
                                                        {
                                                            ratingDistribution[
                                                                stars
                                                            ]
                                                        }
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic text-center py-4">
                                        No ratings yet
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Share Card */}
                        <div className="card bg-white shadow-sm border border-gray-100 overflow-hidden">
                            <div className="card-body p-6">
                                <h3 className="card-title text-lg font-semibold mb-3 text-gray-900">
                                    Share This Opportunity
                                </h3>
                                <div className="flex justify-center gap-3 mb-4">
                                    <FacebookShareButton
                                        url={window.location.href}
                                        quote={`Check out: ${project.title}`}
                                    >
                                        <FacebookIcon size={36} round />
                                    </FacebookShareButton>
                                    <TwitterShareButton
                                        url={window.location.href}
                                        title={`Check out: ${project.title}`}
                                    >
                                        <TwitterIcon size={36} round />
                                    </TwitterShareButton>
                                    <WhatsappShareButton
                                        url={window.location.href}
                                        title={`Check out: ${project.title}`}
                                    >
                                        <WhatsappIcon size={36} round />
                                    </WhatsappShareButton>
                                    <EmailShareButton
                                        url={window.location.href}
                                        subject={`Volunteer Opportunity: ${project.title}`}
                                    >
                                        <EmailIcon size={36} round />
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
                                            className="input input-bordered join-item w-full bg-gray-50"
                                        />
                                        <button
                                            onClick={() =>
                                                navigator.clipboard.writeText(
                                                    window.location.href
                                                )
                                            }
                                            className="btn btn-primary join-item rounded-r-lg"
                                        >
                                            <ClipboardDocumentIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Suggested Projects */}
                        {suggestedProjects?.length > 0 && (
                            <div className="card bg-white shadow-sm border border-gray-100 overflow-hidden">
                                <div className="card-body p-6">
                                    <h3 className="card-title text-lg font-semibold mb-3 text-gray-900">
                                        {hasVolunteerProfile
                                            ? "Projects Matching Your Skills"
                                            : "Suggested Projects"}
                                    </h3>
                                    <div className="space-y-4">
                                        {suggestedProjects.map(
                                            (suggestedProject) => (
                                                <Link
                                                    key={
                                                        suggestedProject.public_id
                                                    }
                                                    href={route(
                                                        "projects",
                                                        suggestedProject.slug
                                                    )}
                                                    className="flex gap-3 p-3 hover:bg-gray-50 rounded-lg transition"
                                                >
                                                    <div className="avatar">
                                                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
                                                            {suggestedProject.featured_image ? (
                                                                <img
                                                                    src={`/storage/${suggestedProject.featured_image}`}
                                                                    alt={
                                                                        suggestedProject.title
                                                                    }
                                                                    className="object-cover w-full h-full"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
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
                                                        <h4 className="text-sm font-medium text-gray-900">
                                                            {
                                                                suggestedProject.title
                                                            }
                                                        </h4>
                                                        <p className="text-xs text-gray-500">
                                                            {
                                                                suggestedProject
                                                                    .category
                                                                    ?.name
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
                        <div className="modal-box max-w-md p-0 overflow-hidden">
                            <div className="bg-error text-error-content p-4">
                                <h2 className="text-lg font-semibold">
                                    Report Project
                                </h2>
                            </div>
                            <div className="p-6">
                                <button
                                    onClick={() => setIsReportModalOpen(false)}
                                    className="btn btn-sm btn-circle absolute right-4 top-4"
                                >
                                    ✕
                                </button>
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
                                                                cat.id ==
                                                                e.target.value
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
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">
                                                    Issue Type
                                                </span>
                                            </label>
                                            <select
                                                className="select select-bordered w-full"
                                                value={
                                                    data.report_subcategory_id
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "report_subcategory_id",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                disabled={
                                                    !data.report_category_id
                                                }
                                            >
                                                <option value="">
                                                    Select a type
                                                </option>
                                                {subcategories.map(
                                                    (subcategory) => (
                                                        <option
                                                            key={subcategory.id}
                                                            value={
                                                                subcategory.id
                                                            }
                                                        >
                                                            {subcategory.name}
                                                        </option>
                                                    )
                                                )}
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
                                    <div className="modal-action mt-6">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsReportModalOpen(false)
                                            }
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
                    </div>
                )}
            </GeneralPages>
        </>
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
    } pl-4 border-l-2 border-gray-200`;

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
                    className={`group p-5 rounded-xl transition-all duration-150 ${
                        isTopLevel
                            ? "bg-white shadow-xs border border-gray-100 hover:border-gray-200"
                            : "bg-gray-50"
                    }`}
                >
                    <div className="flex items-start space-x-4">
                        {/* User Avatar */}
                        <div className="flex-shrink-0">
                            <div className="avatar">
                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow">
                                    {remark.user?.avatar ? (
                                        <img
                                            src={`/storage/${remark.user.avatar}`}
                                            alt={remark.user.name}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <div className="bg-gray-200 text-gray-600 flex items-center justify-center w-full h-full">
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
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                    <h4 className="text-sm font-semibold text-gray-900">
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
                                        className="btn btn-xs btn-ghost text-gray-500 hover:text-primary"
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
                            <p className="text-gray-700 leading-relaxed">
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
                            className="bg-white p-4 rounded-xl shadow-xs border border-gray-200"
                        >
                            <textarea
                                value={replyData.comment}
                                onChange={(e) =>
                                    setReplyData({
                                        ...replyData,
                                        comment: e.target.value,
                                    })
                                }
                                className="textarea textarea-bordered w-full bg-gray-50"
                                rows={3}
                                placeholder="Write your thoughtful reply..."
                                required
                            />
                            <div className="mt-3 flex justify-end space-x-2">
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
