import GeneralPages from "@/Layouts/GeneralPages";
import { Head } from "@inertiajs/react"; // Add this import
import React from "react";
import { Link } from "@inertiajs/react";
import {
    Shield,
    User,
    Building,
    Eye,
    Share2,
    Lock,
    Settings,
    Cookie,
    Link as LinkIcon,
    Users,
    Bell,
    RefreshCw,
    Mail,
    FileText,
    Database,
    BarChart3,
    AlertTriangle,
    CheckCircle,
    ExternalLink,
} from "lucide-react";

const informationCategories = [
    {
        title: "Personal Information",
        icon: <User className="w-5 h-5" />,
        color: "bg-blue-100 text-blue-600",
        items: [
            "Name, email address, phone number",
            "Date of birth and location data",
            "Profile photos and contact details",
            "Government IDs for verification",
        ],
    },
    {
        title: "Volunteer Preferences",
        icon: <Users className="w-5 h-5" />,
        color: "bg-green-100 text-green-600",
        items: [
            "Skills, expertise, and qualifications",
            "Volunteer interests and causes",
            "Availability and scheduling preferences",
            "Geographic preferences",
        ],
    },
    {
        title: "Organizational Data",
        icon: <Building className="w-5 h-5" />,
        color: "bg-purple-100 text-purple-600",
        items: [
            "Organization name and mission",
            "Contact details and verification documents",
            "Posted volunteer opportunities",
            "Organizational history and reviews",
        ],
    },
    {
        title: "Usage & Technical Data",
        icon: <BarChart3 className="w-5 h-5" />,
        color: "bg-amber-100 text-amber-600",
        items: [
            "IP address and device information",
            "Browser type and operating system",
            "Interaction and clickstream data",
            "Log data and performance metrics",
        ],
    },
];

const dataUsage = [
    {
        purpose: "Matching Volunteers",
        description:
            "Connect volunteers with relevant opportunities based on interests and location",
        icon: <Users className="w-5 h-5" />,
    },
    {
        purpose: "Platform Management",
        description:
            "Allow organizations to manage and communicate with volunteers effectively",
        icon: <Settings className="w-5 h-5" />,
    },
    {
        purpose: "Experience Enhancement",
        description:
            "Personalize and improve platform features and user experience",
        icon: <Eye className="w-5 h-5" />,
    },
    {
        purpose: "Communication",
        description:
            "Send updates, announcements, and important service communications",
        icon: <Bell className="w-5 h-5" />,
    },
    {
        purpose: "Security & Compliance",
        description:
            "Ensure platform security, prevent fraud, and comply with legal obligations",
        icon: <Shield className="w-5 h-5" />,
    },
];

const sharingCategories = [
    {
        category: "With Organizations",
        description:
            "When you apply for or express interest in volunteer opportunities",
        icon: <Building className="w-5 h-5" />,
    },
    {
        category: "Service Providers",
        description:
            "Trusted partners who help us operate and improve the platform",
        icon: <Share2 className="w-5 h-5" />,
    },
    {
        category: "Legal Requirements",
        description:
            "When required by law or in response to valid legal requests",
        icon: <FileText className="w-5 h-5" />,
    },
];

const userRights = [
    {
        right: "Access & Correction",
        description:
            "View and update your profile information through account settings",
        icon: <Eye className="w-5 h-5" />,
    },
    {
        right: "Data Deletion",
        description:
            "Request complete removal of your account and personal data",
        icon: <Database className="w-5 h-5" />,
    },
    {
        right: "Communication Preferences",
        description: "Opt-out of promotional emails using unsubscribe links",
        icon: <Bell className="w-5 h-5" />,
    },
];

const securityMeasures = [
    "End-to-end encryption for sensitive data",
    "Regular security audits and vulnerability assessments",
    "Multi-factor authentication options",
    "Access controls and permission management",
    "Data breach response procedures",
];

export default function Privacy({ auth }) {
    const lastUpdated = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    // Get APP_URL for SEO
    const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    const currentUrl =
        typeof window !== "undefined" ? window.location.href : appUrl;

    // Page-specific SEO
    const pageTitle = "Privacy Policy | Volunteer Faster";
    const pageDescription =
        "Learn how Volunteer Faster protects your personal information. Read our comprehensive privacy policy for volunteers and organizations.";
    const pageKeywords =
        "privacy policy, data protection, volunteer privacy, GDPR compliance, personal information, data security";

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
                    content={`${appUrl}/images/privacy-policy-preview.jpg`}
                />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta
                    property="og:image:alt"
                    content="Volunteer Faster Privacy Policy"
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
                    content={`${appUrl}/images/privacy-policy-preview.jpg`}
                />
                <meta name="twitter:site" content="@volunteerfaster" />
                <meta name="twitter:creator" content="@volunteerfaster" />
                <meta
                    name="twitter:image:alt"
                    content="Volunteer Faster Privacy Policy"
                />

                {/* Additional Meta Tags */}
                <link rel="canonical" href={currentUrl} />

                {/* Structured Data for SEO */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        name: pageTitle,
                        description: pageDescription,
                        url: currentUrl,
                        datePublished: lastUpdated,
                        dateModified: lastUpdated,
                        publisher: {
                            "@type": "Organization",
                            name: "Volunteer Faster",
                            logo: `${appUrl}/logo.png`,
                            description: "Volunteer matching platform",
                        },
                        mainEntity: {
                            "@type": "Article",
                            headline: pageTitle,
                            description: pageDescription,
                            author: {
                                "@type": "Organization",
                                name: "Volunteer Faster",
                            },
                            publisher: {
                                "@type": "Organization",
                                name: "Volunteer Faster",
                                logo: `${appUrl}/logo.png`,
                            },
                            datePublished: lastUpdated,
                            dateModified: lastUpdated,
                        },
                    })}
                </script>
            </Head>

            <GeneralPages auth={auth} title="Privacy Policy">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl mb-6">
                            <Shield className="w-10 h-10 text-blue-600" />
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
                            <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                                Transparency & Trust
                            </span>
                            <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                Last Updated: {lastUpdated}
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Privacy Policy
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            This Privacy Policy explains how{" "}
                            <span className="font-bold text-blue-600">
                                Volunteer Faster
                            </span>
                            collects, uses, discloses, and protects your
                            information. By using our platform, you acknowledge
                            and consent to the practices described in this
                            document.
                        </p>
                    </div>

                    {/* Introduction Card */}
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 mb-10">
                        <div className="flex items-start">
                            <FileText className="w-8 h-8 text-blue-600 mt-1 mr-4 flex-shrink-0" />
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Our Commitment to Your Privacy
                                </h2>
                                <p className="text-gray-700">
                                    At Volunteer Faster, we are committed to
                                    protecting your personal information while
                                    providing a seamless volunteering
                                    experience. This policy outlines our data
                                    practices, your rights, and how we maintain
                                    the security and confidentiality of your
                                    information.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Information We Collect Section */}
                    <section className="mb-12">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                                <Database className="w-6 h-6 text-blue-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                Information We Collect
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {informationCategories.map((category) => (
                                <div
                                    key={category.title}
                                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
                                >
                                    <div className="flex items-center mb-4">
                                        <div
                                            className={`${category.color} w-10 h-10 rounded-lg flex items-center justify-center mr-4`}
                                        >
                                            {category.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {category.title}
                                        </h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {category.items.map((item, idx) => (
                                            <li
                                                key={idx}
                                                className="flex items-start"
                                            >
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                                <span className="text-gray-700">
                                                    {item}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* How We Use Your Information */}
                    <section className="mb-12">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                <Eye className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                How We Use Your Information
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                We use collected data to provide, improve, and
                                secure our platform services
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {dataUsage.map((usage, index) => (
                                <div
                                    key={usage.purpose}
                                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
                                >
                                    <div className="flex items-center mb-3">
                                        <div className="text-blue-500 mr-3">
                                            {usage.icon}
                                        </div>
                                        <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            Use {index + 1}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        {usage.purpose}
                                    </h3>
                                    <p className="text-gray-700 text-sm">
                                        {usage.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Information Sharing */}
                    <section className="mb-12">
                        <div className="bg-gray-50 rounded-2xl p-6">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                                    <Share2 className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">
                                        Information Sharing
                                    </h2>
                                    <p className="text-gray-600">
                                        We never sell your personal information.
                                        Sharing occurs only under specific
                                        circumstances
                                    </p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                                    <div className="flex items-center">
                                        <AlertTriangle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
                                        <p className="text-red-700 font-medium">
                                            We do not and will never sell your
                                            personal information to third
                                            parties.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-6">
                                    {sharingCategories.map((sharing) => (
                                        <div
                                            key={sharing.category}
                                            className="bg-white rounded-xl border border-gray-200 p-6"
                                        >
                                            <div className="flex items-center mb-4">
                                                <div className="text-blue-500 mr-3">
                                                    {sharing.icon}
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    {sharing.category}
                                                </h3>
                                            </div>
                                            <p className="text-gray-700 text-sm">
                                                {sharing.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Data Security & Rights */}
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {/* Data Security */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center mb-4">
                                <Lock className="w-6 h-6 text-green-600 mr-3" />
                                <h3 className="text-2xl font-bold text-gray-900">
                                    Data Security
                                </h3>
                            </div>
                            <p className="text-gray-700 mb-4">
                                We implement comprehensive security measures to
                                protect your information:
                            </p>
                            <ul className="space-y-3">
                                {securityMeasures.map((measure, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">
                                            {measure}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6 bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600">
                                    <strong>Note:</strong> While we implement
                                    robust security measures, no system can
                                    guarantee 100% security. We continuously
                                    monitor and improve our security practices.
                                </p>
                            </div>
                        </div>

                        {/* Your Rights and Choices */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center mb-4">
                                <Settings className="w-6 h-6 text-blue-600 mr-3" />
                                <h3 className="text-2xl font-bold text-gray-900">
                                    Your Rights and Choices
                                </h3>
                            </div>
                            <p className="text-gray-700 mb-6">
                                You have significant control over your personal
                                information:
                            </p>

                            <div className="space-y-4">
                                {userRights.map((right) => (
                                    <div
                                        key={right.right}
                                        className="bg-blue-50 rounded-lg p-4"
                                    >
                                        <div className="flex items-center mb-2">
                                            {right.icon}
                                            <h4 className="font-semibold text-gray-900 ml-3">
                                                {right.right}
                                            </h4>
                                        </div>
                                        <p className="text-gray-700 text-sm">
                                            {right.description}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6">
                                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Manage Privacy Settings
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Additional Policy Sections */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {/* Cookies and Tracking */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center mb-3">
                                <Cookie className="w-5 h-5 text-amber-600 mr-3" />
                                <h3 className="text-lg font-bold text-gray-900">
                                    Cookies & Tracking
                                </h3>
                            </div>
                            <p className="text-gray-700 text-sm mb-4">
                                We use cookies to enhance your experience and
                                analyze platform usage. Manage preferences
                                through browser settings or our consent banner.
                            </p>
                            <a
                                href="/cookies"
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
                            >
                                View Cookie Policy{" "}
                                <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                        </div>

                        {/* Third-Party Links */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center mb-3">
                                <LinkIcon className="w-5 h-5 text-gray-600 mr-3" />
                                <h3 className="text-lg font-bold text-gray-900">
                                    Third-Party Links
                                </h3>
                            </div>
                            <p className="text-gray-700 text-sm mb-4">
                                Our platform may contain external links. We are
                                not responsible for the privacy practices of
                                third-party sites.
                            </p>
                        </div>

                        {/* Children's Privacy */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center mb-3">
                                <Users className="w-5 h-5 text-red-600 mr-3" />
                                <h3 className="text-lg font-bold text-gray-900">
                                    Children's Privacy
                                </h3>
                            </div>
                            <p className="text-gray-700 text-sm mb-4">
                                Our services are for users 18+. We do not
                                knowingly collect data from children and
                                promptly delete any inadvertently collected
                                information.
                            </p>
                            <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                Age Requirement: 18 years minimum
                            </div>
                        </div>
                    </div>

                    {/* Policy Updates & Contact */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Policy Updates */}
                            <div>
                                <div className="flex items-center mb-4">
                                    <RefreshCw className="w-6 h-6 text-blue-600 mr-3" />
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        Policy Updates
                                    </h3>
                                </div>
                                <p className="text-gray-700 mb-4">
                                    We may update this Privacy Policy to reflect
                                    changes in our practices, services, or legal
                                    requirements. Significant changes will be
                                    communicated through platform notifications.
                                </p>
                                <div className="flex items-center text-gray-600">
                                    <span className="text-sm font-semibold mr-3">
                                        Current Version:
                                    </span>
                                    <span className="font-medium">v3.2</span>
                                    <span className="mx-3">•</span>
                                    <span className="text-sm font-semibold mr-3">
                                        Effective:
                                    </span>
                                    <span className="font-medium">
                                        {lastUpdated}
                                    </span>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <div className="flex items-center mb-4">
                                    <Mail className="w-6 h-6 text-blue-600 mr-3" />
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        Contact Us
                                    </h3>
                                </div>
                                <p className="text-gray-700 mb-4">
                                    For questions about this Privacy Policy or
                                    to exercise your rights, please contact our
                                    privacy team.
                                </p>
                                <div className="space-y-3">
                                    <a
                                        href="mailto:privacy@volunteerfaster.com"
                                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        privacy@volunteerfaster.com
                                    </a>
                                    <div className="text-sm text-gray-600">
                                        Response Time: Typically within 48 hours
                                    </div>
                                </div>
                                <div className="mt-6 bg-white rounded-lg p-4 border border-blue-200">
                                    <h4 className="font-semibold text-gray-900 mb-1">
                                        Data Protection Officer
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        For GDPR-related inquiries, contact our
                                        DPO at{" "}
                                        <a
                                            href="mailto:dpo@volunteerfaster.com"
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            dpo@volunteerfaster.com
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Acceptance Notice */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-600 text-sm">
                            By using Volunteer Faster, you acknowledge that you
                            have read, understood, and agree to this Privacy
                            Policy and our{" "}
                            <Link
                                href="/terms"
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Terms of Service
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </GeneralPages>
        </>
    );
}
