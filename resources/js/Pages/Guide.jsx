import GeneralPages from "@/Layouts/GeneralPages";
import { Head } from "@inertiajs/react"; // Add this import
import React from "react";
import {
    Compass,
    Target,
    BookOpen,
    Lightbulb,
    HelpCircle,
    Clock,
    Users,
    Award,
    CheckCircle,
    Calendar,
    MapPin,
    MessageSquare,
} from "lucide-react";

const guideSections = [
    {
        id: 1,
        title: "Getting Started",
        icon: <Compass className="w-6 h-6" />,
        color: "bg-blue-100 text-blue-600",
        points: [
            {
                title: "Create Your Account",
                description:
                    "Sign up and complete your volunteer profile with skills, interests, and availability",
                icon: <Users className="w-4 h-4" />,
            },
            {
                title: "Browse Opportunities",
                description:
                    "Use filters to find opportunities matching your skills, location, and interests",
                icon: <Target className="w-4 h-4" />,
            },
            {
                title: "Apply & Connect",
                description:
                    "Submit applications or directly message organizations that interest you",
                icon: <MessageSquare className="w-4 h-4" />,
            },
        ],
    },
    {
        id: 2,
        title: "Expectations & Responsibilities",
        icon: <Target className="w-6 h-6" />,
        color: "bg-purple-100 text-purple-600",
        points: [
            "Show up on time and communicate proactively with coordinators",
            "Be respectful, inclusive, and professional in all interactions",
            "Complete assigned tasks with care and diligence",
            "Log your hours and submit feedback through the platform",
        ],
    },
    {
        id: 3,
        title: "Volunteer Onboarding",
        icon: <BookOpen className="w-6 h-6" />,
        color: "bg-green-100 text-green-600",
        description:
            "Organizations typically provide training before you start:",
        points: [
            "Orientation meetings or video introductions",
            "Background checks or identity verification",
            "Health and safety guidelines specific to the role",
            "Code of conduct and organizational expectations",
        ],
    },
    {
        id: 4,
        title: "Tips for Success",
        icon: <Lightbulb className="w-6 h-6" />,
        color: "bg-amber-100 text-amber-600",
        points: [
            "Choose causes you're genuinely passionate about",
            "Start with short-term tasks to learn and build confidence",
            "Ask questions and seek regular feedback for improvement",
            "Network with fellow volunteers and organization staff",
            "Document your experience for future opportunities",
        ],
    },
];

const faqs = [
    {
        question: "Do I need experience to volunteer?",
        answer: "Not at all! Many organizations welcome first-time volunteers and provide comprehensive training. Volunteer Faster also offers beginner-friendly opportunities marked with a 'First-Time Volunteer' badge.",
        icon: <HelpCircle className="w-5 h-5" />,
    },
    {
        question: "Can I volunteer remotely or virtually?",
        answer: "Yes! We offer both in-person and remote/virtual opportunities. Use our location filter to find 'Remote' opportunities that you can participate in from anywhere.",
        icon: <MapPin className="w-5 h-5" />,
    },
    {
        question: "How do I track my volunteer hours?",
        answer: "Use your Volunteer Dashboard to log completed tasks and hours. Organizations can verify your hours, building a credible volunteer record for certificates and future opportunities.",
        icon: <Clock className="w-5 h-5" />,
    },
    {
        question: "Will I receive a certificate or recognition?",
        answer: "Yes! Most organizations offer certificates upon completion. Additionally, Volunteer Faster provides a Digital Certificate for all completed assignments, which you can showcase on your profile and professional networks.",
        icon: <Award className="w-5 h-5" />,
    },
    {
        question: "What's the typical time commitment?",
        answer: "Opportunities range from one-time events (2-4 hours) to ongoing commitments (weekly/monthly). Each listing clearly states the expected time commitment so you can choose what fits your schedule.",
        icon: <Calendar className="w-5 h-5" />,
    },
];

export default function Guide({ auth }) {
    // Get APP_URL for SEO
    const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    const currentUrl =
        typeof window !== "undefined" ? window.location.href : appUrl;

    // Page-specific SEO
    const pageTitle = "Volunteer Success Guide | Volunteer Faster";
    const pageDescription =
        "Your comprehensive roadmap to meaningful volunteering. Learn how to find opportunities, maximize impact, and earn recognition with Volunteer Faster.";
    const pageKeywords =
        "volunteer guide, volunteering tips, volunteer success, how to volunteer, volunteer roadmap, volunteer resources";

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
                <meta property="og:type" content="article" />
                <meta property="og:url" content={currentUrl} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta
                    property="og:image"
                    content={`${appUrl}/images/volunteer-guide-preview.jpg`}
                />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta
                    property="og:image:alt"
                    content="Volunteer Success Guide - Volunteer Faster"
                />
                <meta property="og:site_name" content="Volunteer Faster" />
                <meta property="og:locale" content="en_US" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={currentUrl} />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
                <meta
                    name="twitter:image"
                    content={`${appUrl}/images/volunteer-guide-preview.jpg`}
                />
                <meta name="twitter:site" content="@volunteerfaster" />
                <meta name="twitter:creator" content="@volunteerfaster" />
                <meta
                    name="twitter:image:alt"
                    content="Volunteer Success Guide - Volunteer Faster"
                />

                {/* Additional Meta Tags */}
                <link rel="canonical" href={currentUrl} />

                {/* Structured Data for SEO */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "HowTo",
                        name: pageTitle,
                        description: pageDescription,
                        url: currentUrl,
                        totalTime: "PT15M",
                        estimatedCost: {
                            "@type": "MonetaryAmount",
                            currency: "USD",
                            value: "0",
                        },
                        step: [
                            {
                                "@type": "HowToStep",
                                name: "Create Your Account",
                                text: "Sign up and complete your volunteer profile with skills, interests, and availability",
                                url: `${appUrl}/register`,
                            },
                            {
                                "@type": "HowToStep",
                                name: "Browse Opportunities",
                                text: "Use filters to find opportunities matching your skills, location, and interests",
                                url: `${appUrl}/projects`,
                            },
                            {
                                "@type": "HowToStep",
                                name: "Apply & Connect",
                                text: "Submit applications or directly message organizations that interest you",
                            },
                        ],
                        publisher: {
                            "@type": "Organization",
                            name: "Volunteer Faster",
                            logo: `${appUrl}/logo.png`,
                        },
                    })}
                </script>
            </Head>

            <GeneralPages auth={auth} title="Volunteer Success Guide">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl mb-6">
                            <Users className="w-10 h-10 text-blue-600" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Volunteer Success Guide
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Your comprehensive roadmap to meaningful
                            volunteering with{" "}
                            <span className="font-bold text-blue-600">
                                Volunteer Faster
                            </span>
                            . Whether you're new to volunteering or an
                            experienced changemaker, this guide will help you
                            maximize your impact and experience.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
                                <CheckCircle className="w-4 h-4 mr-1" />{" "}
                                Step-by-step guidance
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                                <Clock className="w-4 h-4 mr-1" /> Time-saving
                                tips
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700">
                                <Award className="w-4 h-4 mr-1" /> Certificate
                                eligibility
                            </span>
                        </div>
                    </div>

                    {/* Quick Start Banner */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-12">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Ready to Start Your Journey?
                                </h2>
                                <p className="text-gray-700">
                                    Complete your profile in 5 minutes and
                                    discover opportunities matched to your
                                    skills.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Guide Sections */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
                            Your Volunteering Roadmap
                        </h2>

                        <div className="space-y-8">
                            {guideSections.map((section, index) => (
                                <div
                                    key={section.id}
                                    className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 hover:shadow-lg transition-all duration-200"
                                >
                                    <div className="flex items-start md:items-center mb-6">
                                        <div
                                            className={`${section.color} w-12 h-12 rounded-xl flex items-center justify-center mr-4 flex-shrink-0`}
                                        >
                                            {section.icon}
                                        </div>
                                        <div>
                                            <div className="flex items-center">
                                                <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full mr-3">
                                                    Step {index + 1}
                                                </span>
                                                <h3 className="text-2xl font-bold text-gray-900">
                                                    {section.title}
                                                </h3>
                                            </div>
                                            {section.description && (
                                                <p className="text-gray-600 mt-2">
                                                    {section.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {section.points[0]?.title ? (
                                        <div className="grid md:grid-cols-3 gap-6">
                                            {section.points.map(
                                                (point, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="bg-gray-50 rounded-lg p-4"
                                                    >
                                                        <div className="flex items-center mb-2">
                                                            <div className="text-blue-500 mr-2">
                                                                {point.icon}
                                                            </div>
                                                            <h4 className="font-semibold text-gray-900">
                                                                {point.title}
                                                            </h4>
                                                        </div>
                                                        <p className="text-gray-600 text-sm">
                                                            {point.description}
                                                        </p>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <ul className="space-y-3 pl-2">
                                            {section.points.map(
                                                (point, idx) => (
                                                    <li
                                                        key={idx}
                                                        className="flex items-start"
                                                    >
                                                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                        </div>
                                                        <span className="text-gray-700">
                                                            {point}
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="mb-16">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-full mb-4">
                                <HelpCircle className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Common questions answered to help you volunteer
                                with confidence
                            </p>
                        </div>

                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-all duration-200"
                                >
                                    <div className="flex items-start">
                                        <div className="mr-4 text-blue-500 flex-shrink-0">
                                            {faq.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                                                {faq.question}
                                            </h3>
                                            <p className="text-gray-700">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Certificate Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 mb-12">
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="md:w-2/3">
                                <div className="flex items-center mb-3">
                                    <Award className="w-8 h-8 text-blue-600 mr-3" />
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        Earn Your Digital Certificate
                                    </h3>
                                </div>
                                <p className="text-gray-700 mb-4">
                                    Volunteer Faster provides official Digital
                                    Certificates for all completed volunteering
                                    assignments. Showcase your contributions on
                                    LinkedIn, resumes, and professional
                                    portfolios.
                                </p>
                                <ul className="space-y-2 text-gray-700">
                                    <li className="flex items-center">
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                        Automatically generated upon completion
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                        Includes verification QR code
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                        Downloadable PDF format
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="text-center border-t border-gray-200 pt-10">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            Need Personalized Assistance?
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                            Our volunteer support team is here to help you find
                            the perfect opportunity and answer any questions
                            about your volunteering journey.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href={route("contact")}
                                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                                Contact Support Team
                            </a>
                        </div>
                    </div>
                </div>
            </GeneralPages>
        </>
    );
}
