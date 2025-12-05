import GeneralPages from "@/Layouts/GeneralPages";
import React from "react";
import { motion } from "framer-motion";
import { Link } from "@inertiajs/react";
// import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Sponsorship({
    sponsorships,
    successfulSponsorships,
    auth,
}) {
    const formatName = (fullName) => {
        if (!fullName) return "Volunteer";
        const parts = fullName.trim().split(/\s+/);
        if (parts.length === 1) return parts[0];
        if (parts.length === 2) return `${parts[0]} ${parts[1].charAt(0)}.`;
        return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
    };

    const getInitials = (fullName) => {
        if (!fullName) return "V";
        const parts = fullName.trim().split(/\s+/);
        return parts.length === 1
            ? parts[0].charAt(0)
            : parts[0].charAt(0) + parts[parts.length - 1].charAt(0);
    };

    const SponsorshipCard = ({ vol, isSuccessful = false }) => {
        const formattedName = formatName(vol.user?.name);
        const initials = getInitials(vol.user?.name);
        const progress =
            vol.total_amount && vol.funded_amount
                ? Math.min((vol.funded_amount / vol.total_amount) * 100, 100)
                : 0;

        return (
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                }}
                className={`bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                    isSuccessful ? "border-2 border-green-500" : ""
                }`}
            >
                {/* Avatar */}
                <div
                    className={`h-50 w-full flex items-center justify-center ${
                        isSuccessful
                            ? "bg-gradient-to-r from-green-500 to-emerald-600"
                            : "bg-gradient-to-r from-blue-500 to-indigo-600"
                    }`}
                >
                    {vol.volunteer_profile?.profile_picture ? (
                        <img
                            src={`/storage/${vol.volunteer_profile.profile_picture}`}
                            alt={formattedName}
                            className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                    ) : (
                        <span className="text-white text-4xl font-bold drop-shadow">
                            {initials}
                        </span>
                    )}
                </div>

                <div className="p-5">
                    {/* Name */}
                    <h2 className="text-xl font-bold text-gray-900 mb-1 tracking-tight">
                        {formattedName}
                    </h2>

                    {/* Project */}
                    <div className="flex items-center mb-2 text-gray-700 text-sm">
                        <svg
                            className={`w-4 h-4 mr-1 ${
                                isSuccessful
                                    ? "text-green-600"
                                    : "text-blue-600"
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-8 0H5m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                        </svg>
                        <span className="font-medium">
                            {vol.booking?.project?.title || "Volunteer Project"}
                        </span>
                    </div>

                    {/* Skills */}
                    <div className="mb-3">
                        <h4 className="text-gray-700 font-medium text-sm mb-1">
                            Skills
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                            {vol.skills?.length > 0 ? (
                                vol.skills.map((skill, i) => (
                                    <span
                                        key={i}
                                        className={`px-2.5 py-0.5 text-xs rounded-full ${
                                            isSuccessful
                                                ? "bg-green-100 text-green-800"
                                                : "bg-blue-100 text-blue-800"
                                        }`}
                                    >
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-400 text-xs italic">
                                    No skills listed
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Funding */}
                    <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-700 font-medium">
                                Funding Goal
                            </span>
                            <div className="flex items-center gap-1">
                                <span
                                    className={`font-bold ${
                                        isSuccessful
                                            ? "text-green-600"
                                            : "text-green-600"
                                    }`}
                                >
                                    $
                                    {Number(
                                        vol.funded_amount || 0
                                    ).toLocaleString()}
                                </span>
                                <span>/</span>
                                <span
                                    className={`font-bold ${
                                        isSuccessful
                                            ? "text-green-700"
                                            : "text-blue-600"
                                    }`}
                                >
                                    $
                                    {Number(
                                        vol.total_amount || 0
                                    ).toLocaleString()}
                                </span>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{
                                    duration: 1,
                                    ease: "easeOut",
                                }}
                                className={`h-1.5 rounded-full ${
                                    isSuccessful
                                        ? "bg-gradient-to-r from-green-500 to-emerald-600"
                                        : "bg-gradient-to-r from-blue-500 to-indigo-600"
                                }`}
                            />
                        </div>
                        {isSuccessful && (
                            <div className="flex items-center justify-center mt-2">
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                    🎉 Fully Funded!
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Intro */}
                    <p className="text-gray-600 text-xs leading-relaxed line-clamp-3 mb-4">
                        {vol.self_introduction || "No introduction provided."}
                    </p>

                    {/* CTA */}
                    {!isSuccessful && (
                        <Link
                            href={route(
                                "volunteer.guest.sponsorship.page.with.volunteer",
                                vol.public_id
                            )}
                            className="block w-full"
                        >
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-2.5 rounded-lg font-medium text-sm shadow hover:shadow-md transition-all cursor-pointer"
                            >
                                Support {formattedName.split(" ")[0]}'s Journey
                            </motion.button>
                        </Link>
                    )}
                </div>
            </motion.div>
        );
    };

    return (
        <GeneralPages title="Sponsorship Opportunities" auth={auth}>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-10"
                    >
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                            Support Our Volunteers
                        </h1>
                        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Empower passionate individuals to make a difference
                            by sponsoring their volunteer journey. Your support
                            creates lasting impact in communities around the
                            world.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Main Content - 3 columns */}
                        <div className="lg:col-span-3">
                            {sponsorships.length === 0 ? (
                                <div className="text-center py-14">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 shadow">
                                        <svg
                                            className="w-8 h-8 text-blue-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                                        No Current Opportunities
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        There are currently no volunteers open
                                        for sponsorship.
                                    </p>
                                    <p className="text-gray-500 text-xs mt-1 italic">
                                        Check back soon for new opportunities!
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                        Active Sponsorship Opportunities
                                    </h2>
                                    <motion.div
                                        initial="hidden"
                                        animate="visible"
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            visible: {
                                                opacity: 1,
                                                y: 0,
                                                transition: {
                                                    staggerChildren: 0.12,
                                                },
                                            },
                                        }}
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                    >
                                        {sponsorships.map((vol) => (
                                            <SponsorshipCard
                                                key={vol.public_id}
                                                vol={vol}
                                            />
                                        ))}
                                    </motion.div>
                                </>
                            )}
                        </div>

                        {/* Sidebar - Successfully Funded - 1 column */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                    <svg
                                        className="w-5 h-5 text-green-600 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Successfully Funded
                                </h2>
                                <p className="text-gray-600 text-sm mb-4">
                                    These volunteers have reached their funding
                                    goals thanks to generous supporters like
                                    you.
                                </p>

                                {successfulSponsorships.length === 0 ? (
                                    <div className="text-center py-6">
                                        <div className="bg-green-50 rounded-lg p-4">
                                            <svg
                                                className="w-12 h-12 text-green-400 mx-auto mb-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1}
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <p className="text-green-700 text-sm">
                                                Be the first to help a volunteer
                                                reach their goal!
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {successfulSponsorships.map((vol) => (
                                            <div
                                                key={vol.public_id}
                                                className="bg-green-50 rounded-xl p-4 border border-green-200"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    {vol.volunteer_profile
                                                        ?.profile_picture ? (
                                                        <img
                                                            src={`/storage/${vol.volunteer_profile.profile_picture}`}
                                                            alt={formatName(
                                                                vol.user?.name
                                                            )}
                                                            className="w-12 h-12 rounded-full object-cover border-2 border-green-300"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                                                            <span className="text-green-700 font-semibold text-sm">
                                                                {getInitials(
                                                                    vol.user
                                                                        ?.name
                                                                )}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-green-900 text-sm truncate">
                                                            {formatName(
                                                                vol.user?.name
                                                            )}
                                                        </h3>
                                                        <p className="text-green-700 text-xs truncate">
                                                            {vol.booking
                                                                ?.project
                                                                ?.title ||
                                                                "Volunteer Project"}
                                                        </p>
                                                        <div className="flex justify-between items-center mt-1">
                                                            <span className="text-green-600 font-bold text-xs">
                                                                $
                                                                {Number(
                                                                    vol.funded_amount ||
                                                                        0
                                                                ).toLocaleString()}{" "}
                                                                raised
                                                            </span>
                                                            <span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full">
                                                                ✓ Funded
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Success Stats */}
                                {successfulSponsorships.length > 0 && (
                                    <div className="mt-6 pt-4 border-t border-green-200">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-green-600">
                                                {successfulSponsorships.length}
                                            </p>
                                            <p className="text-green-700 text-sm">
                                                Volunteers Successfully Funded
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Info Section */}
                    {sponsorships.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="mt-12 bg-white rounded-2xl shadow-lg p-8"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                                How Sponsorship Works
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    {
                                        step: "1",
                                        title: "Choose a Volunteer",
                                        desc: "Select a volunteer whose mission resonates with your values.",
                                    },
                                    {
                                        step: "2",
                                        title: "Make a Contribution",
                                        desc: "Support their journey with a financial contribution.",
                                    },
                                    {
                                        step: "3",
                                        title: "Track Impact",
                                        desc: "Receive updates on the difference your support is making.",
                                    },
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ scale: 1.04 }}
                                        className="text-center"
                                    >
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <span className="text-2xl font-bold text-blue-600">
                                                {item.step}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-gray-800 mb-1 text-base">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-600 text-xs leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </GeneralPages>
    );
}
