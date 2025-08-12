import GeneralPages from "@/Layouts/GeneralPages";
import { useState, useEffect, useRef } from "react";
import { Link, useForm } from "@inertiajs/react";

import {
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    EmailShareButton,
    LinkedinShareButton,
} from "react-share";
import {
    FacebookIcon,
    TwitterIcon,
    WhatsappIcon,
    EmailIcon,
    LinkedinIcon,
} from "react-share";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";

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

    // Add this to check for volunteer profile
    const hasVolunteerProfile = auth.user?.volunteerProfile !== null;

    // useEffect(() => {
    //     // Initialize toast container
    //     toast.configure();
    // }, []);

    // Add this function to get the project image URL
    const getProjectImageUrl = () => {
        if (gallery.length > 0) {
            return `${window.location.origin}/storage/${gallery[0].image_path}`;
        }
        return `${window.location.origin}/images/placeholder.jpg`;
    };

    const { data, setData, post, processing, errors } = useForm({
        project_id: project.id,
        report_category_id: "",
        report_subcategory_id: "",
        description: "",
    });

    // Check if user is logged in and has organization role
    const isOrganization = auth.user && auth.user.role === "Organization";

    // Check if user is logged in and has volunteer role
    const isVolunteer = auth.user && auth.user.role === "Volunteer";

    // Auto-slide every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === gallery.length - 1 ? 0 : prevIndex + 1
            );
        }, 4000);
        return () => clearInterval(interval);
    }, [gallery.length]);

    const handleSubmitReport = (e) => {
        e.preventDefault();
        post(route("project.report.store"), {
            onSuccess: () => {
                setIsReportModalOpen(false);
                // Optionally show a success message
            },
        });
    };

    useEffect(() => {
        if (data.report_category_id) {
            const selectedCategory = reportCategories.find(
                (cat) => cat.id == data.report_category_id
            );
            setSubcategories(selectedCategory?.subcategories || []);
            setData("report_subcategory_id", ""); // Reset subcategory when category changes
        }
    }, [data.report_category_id]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                closeModal();
            }
        };

        if (isModalOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isModalOpen]);

    const goToNext = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === gallery.length - 1 ? 0 : prevIndex + 1
        );
    };

    const goToPrev = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? gallery.length - 1 : prevIndex - 1
        );
    };
    return (
        <GeneralPages auth={auth}>
            {/* Hero Image */}
            <div className="w-full max-w-7xl mx-auto px-4 py-4">
                {/* Hero Image */}
                <div className="w-full max-w-7xl mx-auto">
                    {gallery.length > 0 ? (
                        <div
                            className="relative w-full h-[400px] overflow-hidden rounded-lg shadow-lg cursor-pointer"
                            onClick={openModal}
                        >
                            <img
                                key={
                                    gallery[currentImageIndex]?.id ||
                                    currentImageIndex
                                }
                                src={`/storage/${gallery[currentImageIndex].image_path}`}
                                alt={`Gallery Image ${currentImageIndex + 1}`}
                                className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
                            />
                            {/* Dots */}
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                                {gallery.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => {
                                            e.stopPropagation(); // prevent modal open
                                            setCurrentImageIndex(idx);
                                        }}
                                        className={`w-3 h-3 rounded-full ${
                                            idx === currentImageIndex
                                                ? "bg-white"
                                                : "bg-gray-400"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-100 p-2 rounded-lg shadow-lg">
                            <img
                                src="/images/placeholder.jpg"
                                alt="Placeholder"
                                className="w-full h-64 object-cover rounded-lg"
                            />
                        </div>
                    )}
                </div>

                {/* Modal Fullscreen Carousel */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center px-4">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-white text-3xl font-bold"
                        >
                            &times;
                        </button>
                        <div
                            ref={modalRef}
                            className="relative w-full max-w-4xl"
                        >
                            <img
                                src={`/storage/${gallery[currentImageIndex].image_path}`}
                                alt={`Full Image ${currentImageIndex + 1}`}
                                className="w-full max-h-[80vh] object-contain rounded-lg shadow-xl"
                            />

                            {/* Navigation Buttons */}
                            <button
                                onClick={goToPrev}
                                className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white text-4xl px-4"
                            >
                                ‹
                            </button>
                            <button
                                onClick={goToNext}
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white text-4xl px-4"
                            >
                                ›
                            </button>

                            {/* Dots */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                                {gallery.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() =>
                                            setCurrentImageIndex(idx)
                                        }
                                        className={`w-3 h-3 rounded-full ${
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
            </div>

            {/* Main Content Grid */}
            <div className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-1 md:grid-cols-3 gap-10 bg-[#fff] rounded-lg">
                {/* LEFT SIDE - Main Content */}

                <div className="space-y-5 md:col-span-2">
                    <h1 className="text-4xl font-extrabold text-blue-800 mb-3">
                        {project.title}
                    </h1>
                    {/* Tags & Location */}
                    <div className="flex flex-wrap gap-3 text-sm">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                            {project.category?.name}
                        </span>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                            {project.subcategory?.name}
                        </span>
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
                            📍 {project.address}
                        </span>
                    </div>

                    {/* About */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            About the Project
                        </h2>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            {project.detailed_description}
                        </p>
                    </section>

                    {/* Activities */}
                    {project.activities && (
                        <section>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                Volunteer Activities
                            </h3>
                            <p className="text-gray-700 text-lg">
                                {project.activities}
                            </p>
                        </section>
                    )}

                    {/* CTA */}

                    {!isOrganization && (
                        <div className="pt-4 flex items-center justify-between">
                            <Link
                                href={route(
                                    "project.volunteer.booking",
                                    project.slug
                                )}
                                className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition duration-300 shadow-lg"
                            >
                                Apply to Volunteer
                            </Link>

                            {isVolunteer && (
                                <button
                                    onClick={() => setIsReportModalOpen(true)}
                                    className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                                    title="Report this project"
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
                                    Report this Project
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {errors.booking && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                        <p>{errors.booking}</p>
                    </div>
                )}

                {/* {success.booking && (
                    <div className="bg-red-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
                        <p>{errors.booking}</p>
                    </div>
                )} */}

                {isReportModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center px-4">
                        <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl p-6">
                            <button
                                onClick={() => setIsReportModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
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

                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                Report Project
                            </h2>

                            <form onSubmit={handleSubmitReport}>
                                <div className="mb-4">
                                    <label
                                        htmlFor="report_category_id"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Issue Category *
                                    </label>
                                    <select
                                        id="report_category_id"
                                        value={data.report_category_id}
                                        onChange={(e) => {
                                            setData(
                                                "report_category_id",
                                                e.target.value
                                            );
                                            // Find and set subcategories immediately
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                    {errors.report_category_id && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.report_category_id}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label
                                        htmlFor="report_subcategory_id"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Issue Type *
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                    {errors.report_subcategory_id && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.report_subcategory_id}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <label
                                        htmlFor="description"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Description *
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={4}
                                        placeholder="Please provide details about your report"
                                        required
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsReportModalOpen(false)
                                        }
                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                    >
                                        {processing
                                            ? "Submitting..."
                                            : "Submit Report"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* RIGHT SIDE - Sidebar */}
                <div className="space-y-4 md:col-span-1">
                    {/* Organization Info */}
                    <Link
                        href={route("home.organization.profile", {
                            slug: project.slug,
                            organization_profile:
                                project.organization_profile.slug,
                        })}
                        className="bg-blue-50 p-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2 hover:bg-blue-100 transition-colors"
                    >
                        <img
                            className="w-16 h-16 rounded-full"
                            src={
                                project.organization_profile.logo
                                    ? `/storage/${project.organization_profile.logo}`
                                    : "/images/placeholder.jpg"
                            }
                            alt={project.organization_profile?.name}
                        />
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {project.organization_profile?.name}
                        </h3>
                    </Link>

                    {/* Quick Facts */}
                    <section className="bg-blue-50 p-6 rounded-xl shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Quick Facts
                        </h2>
                        <div className="space-y-4">
                            <div className="col-span-2 grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-gray-800 font-semibold">
                                        Start Date
                                    </h4>
                                    <p className="text-gray-600">
                                        {project.start_date}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-gray-800 font-semibold">
                                        Duration
                                    </h4>
                                    <p className="text-gray-600">
                                        {project.duration}{" "}
                                        {project.duration_type}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-gray-800 font-semibold">
                                    Minimum Age
                                </h4>
                                <p className="text-gray-600">
                                    {project.minAge || "18+"}
                                </p>
                            </div>

                            {/* Suitable For */}
                            {project.suitable?.length > 0 && (
                                <section>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                        Suitable For
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {project.suitable.map((item, index) => (
                                            <span
                                                key={index}
                                                className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {project.availability_months?.length > 0 && (
                                <section className="">
                                    <h3 className="text-xl font-semibold text-blue-800 mb-4">
                                        🗓️ Availability Months
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {project.availability_months.map(
                                            (item, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow"
                                                >
                                                    {item}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </section>
                            )}
                        </div>
                    </section>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mt-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">
                            Share This Opportunity
                        </h3>

                        {/* Social Share Buttons */}
                        <div className="flex flex-wrap justify-center gap-3 mb-4">
                            <FacebookShareButton
                                url={window.location.href}
                                quote={`Check out this volunteer opportunity: ${project.title}`}
                                hashtag="#Volunteer"
                                className="transition-transform hover:scale-110"
                            >
                                <div className="flex flex-col items-center">
                                    <FacebookIcon size={40} round />
                                    <span className="text-xs mt-1 text-gray-600">
                                        Facebook
                                    </span>
                                </div>
                            </FacebookShareButton>

                            <TwitterShareButton
                                url={window.location.href}
                                title={`Check out this volunteer opportunity: ${project.title}`}
                                hashtags={["Volunteer", "Opportunity"]}
                                className="transition-transform hover:scale-110"
                            >
                                <div className="flex flex-col items-center">
                                    <TwitterIcon size={40} round />
                                    <span className="text-xs mt-1 text-gray-600">
                                        Twitter
                                    </span>
                                </div>
                            </TwitterShareButton>

                            <WhatsappShareButton
                                url={window.location.href}
                                title={`Check out this volunteer opportunity: ${project.title}`}
                                description={`${project.short_description}`}
                                separator=":: "
                                className="transition-transform hover:scale-110"
                            >
                                <div className="flex flex-col items-center">
                                    <WhatsappIcon size={40} round />
                                    <span className="text-xs mt-1 text-gray-600">
                                        WhatsApp
                                    </span>
                                </div>
                            </WhatsappShareButton>

                            <EmailShareButton
                                url={window.location.href}
                                subject={`Volunteer Opportunity: ${project.title}`}
                                body={`I thought you might be interested in this volunteer opportunity:\n\n${
                                    project.title
                                }\n\n${project.detailed_description?.substring(
                                    0,
                                    100
                                )}...\n\n`}
                                className="transition-transform hover:scale-110"
                            >
                                <div className="flex flex-col items-center">
                                    <EmailIcon size={40} round />
                                    <span className="text-xs mt-1 text-gray-600">
                                        Email
                                    </span>
                                </div>
                            </EmailShareButton>

                            <LinkedinShareButton
                                url={window.location.href}
                                title={project.title}
                                summary={project.detailed_description?.substring(
                                    0,
                                    200
                                )}
                                source="Volunteer Platform"
                                className="transition-transform hover:scale-110"
                            >
                                <div className="flex flex-col items-center">
                                    <LinkedinIcon size={40} round />
                                    <span className="text-xs mt-1 text-gray-600">
                                        LinkedIn
                                    </span>
                                </div>
                            </LinkedinShareButton>
                        </div>

                        {/* Direct Link Sharing */}
                        <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Share direct link:
                            </h4>
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    readOnly
                                    value={window.location.href}
                                    className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            window.location.href
                                        );
                                        // toast.success(
                                        //     "Project link copied to clipboard!",
                                        //     {
                                        //         position: "top-center",
                                        //         autoClose: 3000,
                                        //         hideProgressBar: false,
                                        //         closeOnClick: true,
                                        //         pauseOnHover: true,
                                        //     }
                                        // );
                                    }}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-r-md text-sm flex items-center"
                                    title="Copy link"
                                >
                                    <ClipboardDocumentIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Referral Link (for logged-in users) */}
                        {/* {auth.user && (
                                <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                                        Share with your referral code:
                                    </h4>
                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            readOnly
                                            value={`${
                                                window.location.origin
                                            }/refer/${
                                                auth.user.referral_code
                                            }?redirect=${encodeURIComponent(
                                                window.location.pathname
                                            )}`}
                                            className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(
                                                    `${
                                                        window.location.origin
                                                    }/refer/${
                                                        auth.user.referral_code
                                                    }?redirect=${encodeURIComponent(
                                                        window.location.pathname
                                                    )}`
                                                );
                                                toast.success(
                                                    "Referral link copied to clipboard!",
                                                    {
                                                        position: "top-center",
                                                        autoClose: 3000,
                                                        hideProgressBar: false,
                                                        closeOnClick: true,
                                                        pauseOnHover: true,
                                                    }
                                                );
                                            }}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-r-md text-sm flex items-center"
                                            title="Copy referral link"
                                        >
                                            <ClipboardDocumentIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">
                                        Earn points when friends sign up through
                                        your link!
                                    </p>
                                </div>
                            )} */}
                    </div>
                    {/* Suggested Projects Section */}
                    {suggestedProjects && suggestedProjects.length > 0 && (
                        <section className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">
                                {hasVolunteerProfile
                                    ? "Projects Matching Your Skills"
                                    : "Suggested Projects"}
                            </h3>
                            <div className="space-y-4">
                                {suggestedProjects.map((suggestedProject) => (
                                    <Link
                                        key={suggestedProject.id}
                                        href={route(
                                            "projects",
                                            suggestedProject.slug
                                        )}
                                        className="block group"
                                    >
                                        <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                            <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                                                {suggestedProject.featured_image ? (
                                                    <img
                                                        src={`/storage/${suggestedProject.featured_image}`}
                                                        alt={
                                                            suggestedProject.title
                                                        }
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-8 w-8"
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
                                                <h4 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                                                    {suggestedProject.title}
                                                </h4>
                                                <p className="text-sm text-gray-500">
                                                    {
                                                        suggestedProject
                                                            .category?.name
                                                    }
                                                </p>
                                                <div className="flex items-center mt-1 text-xs text-gray-500">
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
                                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                        />
                                                    </svg>
                                                    {suggestedProject.city},{" "}
                                                    {suggestedProject.country}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </GeneralPages>
    );
}
