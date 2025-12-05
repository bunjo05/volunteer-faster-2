import GeneralPages from "@/Layouts/GeneralPages";
import { Head } from "@inertiajs/react"; // Add this import
import { Link } from "@inertiajs/react";
import React from "react";
import {
    Shield,
    FileText,
    Scale,
    Database,
    Key,
    Lock,
    Globe,
    Users,
    Settings,
    Building,
    AlertTriangle,
    RefreshCw,
    CheckCircle,
    Download,
    Mail,
    MapPin,
    ExternalLink,
} from "lucide-react";

const gdprRights = [
    {
        right: "Right to Access",
        icon: <FileText className="w-5 h-5" />,
        description: "Request copies of your personal data",
        color: "bg-blue-100 text-blue-600",
    },
    {
        right: "Right to Rectification",
        icon: <CheckCircle className="w-5 h-5" />,
        description: "Correct inaccurate or incomplete data",
        color: "bg-green-100 text-green-600",
    },
    {
        right: "Right to Erasure",
        icon: <Key className="w-5 h-5" />,
        description: "Request deletion of your data",
        color: "bg-red-100 text-red-600",
    },
    {
        right: "Right to Restrict Processing",
        icon: <Settings className="w-5 h-5" />,
        description: "Limit how we use your data",
        color: "bg-purple-100 text-purple-600",
    },
    {
        right: "Right to Data Portability",
        icon: <Download className="w-5 h-5" />,
        description: "Transfer data to another service",
        color: "bg-amber-100 text-amber-600",
    },
    {
        right: "Right to Object",
        icon: <AlertTriangle className="w-5 h-5" />,
        description: "Object to certain processing activities",
        color: "bg-orange-100 text-orange-600",
    },
];

const legalBasis = [
    {
        basis: "Consent",
        description: "You have given clear consent for us to process your data",
        example: "Newsletter subscriptions, cookie preferences",
        icon: <CheckCircle className="w-5 h-5" />,
    },
    {
        basis: "Contract",
        description: "Processing is necessary for a contract with you",
        example: "Connecting volunteers with organizations, payment processing",
        icon: <FileText className="w-5 h-5" />,
    },
    {
        basis: "Legal Obligation",
        description: "Processing is necessary to comply with the law",
        example: "Tax records, regulatory compliance",
        icon: <Scale className="w-5 h-5" />,
    },
    {
        basis: "Legitimate Interests",
        description: "Processing is necessary for our legitimate interests",
        example: "Service improvements, fraud prevention, security",
        icon: <Shield className="w-5 h-5" />,
    },
];

const dataCategories = [
    {
        category: "Identity & Contact Data",
        examples: [
            "Name",
            "Email address",
            "Phone number",
            "Website link",
            "Verification documents",
        ],
        icon: <Users className="w-5 h-5" />,
    },
    {
        category: "Volunteer Profile Data",
        examples: [
            "Location",
            "Availability",
            "Skills & expertise",
            "Volunteer interests",
            "Experience",
        ],
        icon: <Database className="w-5 h-5" />,
    },
    {
        category: "Technical & Usage Data",
        examples: [
            "IP address",
            "Device information",
            "Browser type",
            "Login timestamps",
            "Usage patterns",
        ],
        icon: <Settings className="w-5 h-5" />,
    },
];

export default function GDPR({ auth }) {
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
    const pageTitle = "GDPR Compliance Statement | Volunteer Faster";
    const pageDescription =
        "Learn how Volunteer Faster complies with GDPR (General Data Protection Regulation). Understand your data rights, security measures, and legal basis for data processing.";
    const pageKeywords =
        "GDPR compliance, data protection, EU data rights, GDPR statement, data privacy, General Data Protection Regulation";

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
                    content={`${appUrl}/images/gdpr-compliance-preview.jpg`}
                />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta
                    property="og:image:alt"
                    content="GDPR Compliance Statement - Volunteer Faster"
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
                    content={`${appUrl}/images/gdpr-compliance-preview.jpg`}
                />
                <meta name="twitter:site" content="@volunteerfaster" />
                <meta name="twitter:creator" content="@volunteerfaster" />
                <meta
                    name="twitter:image:alt"
                    content="GDPR Compliance Statement - Volunteer Faster"
                />

                {/* Additional Meta Tags */}
                <link rel="canonical" href={currentUrl} />

                {/* Structured Data for SEO */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "LegalService",
                        name: pageTitle,
                        description: pageDescription,
                        url: currentUrl,
                        provider: {
                            "@type": "Organization",
                            name: "Volunteer Faster",
                            logo: `${appUrl}/logo.png`,
                            description: "Volunteer matching platform",
                        },
                        serviceType: "GDPR Compliance Statement",
                        areaServed: {
                            "@type": "GeoCircle",
                            geoMidpoint: {
                                "@type": "GeoCoordinates",
                                latitude: 0.3476,
                                longitude: 32.5825,
                            },
                            geoRadius: "10000000",
                        },
                        address: {
                            "@type": "PostalAddress",
                            addressLocality: "Kampala",
                            addressCountry: "UG",
                            streetAddress: "Plot 3118, Block 206",
                        },
                        contactPoint: {
                            "@type": "ContactPoint",
                            contactType: "Data Protection Officer",
                            email: "dpo@volunteerfaster.com",
                            availableLanguage: "English",
                        },
                    })}
                </script>
            </Head>

            <GeneralPages auth={auth} title="GDPR Compliance Statement">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl mb-6">
                            <Shield className="w-10 h-10 text-blue-600" />
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
                            <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                                EU Regulation 2016/679
                            </span>
                            <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                Last Updated: {lastUpdated}
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            GDPR Compliance Statement
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            This statement outlines how{" "}
                            <span className="font-bold text-blue-600">
                                Volunteer Faster
                            </span>
                            complies with the General Data Protection Regulation
                            (GDPR), ensuring your personal data is handled with
                            transparency, security, and respect for your rights.
                        </p>
                    </div>

                    {/* Overview Card */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-10">
                        <div className="flex items-start">
                            <Scale className="w-8 h-8 text-blue-600 mt-1 mr-4 flex-shrink-0" />
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    What is GDPR?
                                </h2>
                                <p className="text-gray-700">
                                    The General Data Protection Regulation (EU)
                                    2016/679 is a comprehensive data protection
                                    law that gives EU residents control over
                                    their personal data. It sets guidelines for
                                    the collection, processing, and protection
                                    of personal information, regardless of where
                                    the processing takes place.
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <span className="text-sm px-3 py-1 bg-white rounded-full text-gray-700 border border-blue-200">
                                        Applies to EU/EEA residents
                                    </span>
                                    <span className="text-sm px-3 py-1 bg-white rounded-full text-gray-700 border border-blue-200">
                                        Data protection by design
                                    </span>
                                    <span className="text-sm px-3 py-1 bg-white rounded-full text-gray-700 border border-blue-200">
                                        Strict consent requirements
                                    </span>
                                    <span className="text-sm px-3 py-1 bg-white rounded-full text-gray-700 border border-blue-200">
                                        Fines up to €20 million or 4% of global
                                        turnover
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Legal Basis Section */}
                    <section className="mb-12">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                                <Scale className="w-6 h-6 text-blue-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                Legal Basis for Processing
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            {legalBasis.map((item) => (
                                <div
                                    key={item.basis}
                                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
                                >
                                    <div className="flex items-center mb-4">
                                        <div className="text-blue-500 mr-3">
                                            {item.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {item.basis}
                                        </h3>
                                    </div>
                                    <p className="text-gray-700 mb-3">
                                        {item.description}
                                    </p>
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-sm font-medium text-gray-600 mb-1">
                                            Example:
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            {item.example}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Data We Collect Section */}
                    <section className="mb-12">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                <Database className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Data We Collect
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                We collect only the data necessary to provide
                                our services and improve your experience
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {dataCategories.map((category) => (
                                <div
                                    key={category.category}
                                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
                                >
                                    <div className="flex items-center mb-4">
                                        <div className="text-blue-500 mr-3">
                                            {category.icon}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {category.category}
                                        </h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {category.examples.map(
                                            (example, idx) => (
                                                <li
                                                    key={idx}
                                                    className="flex items-start"
                                                >
                                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                                    <span className="text-gray-700">
                                                        {example}
                                                    </span>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Your Rights Section */}
                    <section className="mb-12">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                                <Key className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">
                                    Your Rights Under GDPR
                                </h2>
                                <p className="text-gray-600">
                                    You have significant control over your
                                    personal data
                                </p>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {gdprRights.map((right) => (
                                <div
                                    key={right.right}
                                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
                                >
                                    <div
                                        className={`${right.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
                                    >
                                        {right.icon}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        {right.right}
                                    </h3>
                                    <p className="text-gray-700 text-sm mb-4">
                                        {right.description}
                                    </p>
                                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                        Exercise this right →
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="bg-blue-50 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">
                                How to Exercise Your Rights
                            </h3>
                            <p className="text-gray-700 mb-4">
                                To exercise any of these rights, please contact
                                our Data Protection Officer at{" "}
                                <a
                                    href="mailto:dpo@volunteerfaster.com"
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    dpo@volunteerfaster.com
                                </a>
                                . We will respond to your request within 30 days
                                as required by GDPR.
                            </p>
                        </div>
                    </section>

                    {/* Data Security & International Transfers */}
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
                                We implement robust technical and organizational
                                measures to protect your data:
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">
                                        End-to-end encryption for sensitive data
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">
                                        Regular security audits and penetration
                                        testing
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">
                                        Access controls and authentication
                                        mechanisms
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">
                                        Data breach notification procedures
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* International Transfers */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center mb-4">
                                <Globe className="w-6 h-6 text-blue-600 mr-3" />
                                <h3 className="text-2xl font-bold text-gray-900">
                                    International Transfers
                                </h3>
                            </div>
                            <p className="text-gray-700 mb-4">
                                When transferring data outside the European
                                Economic Area (EEA), we ensure:
                            </p>
                            <div className="space-y-4">
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-1">
                                        Standard Contractual Clauses
                                    </h4>
                                    <p className="text-sm text-gray-700">
                                        EU-approved contractual clauses for data
                                        protection
                                    </p>
                                </div>
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-1">
                                        Adequacy Decisions
                                    </h4>
                                    <p className="text-sm text-gray-700">
                                        Transfer only to countries with adequate
                                        protection
                                    </p>
                                </div>
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-1">
                                        Explicit Consent
                                    </h4>
                                    <p className="text-sm text-gray-700">
                                        Your consent for specific transfers when
                                        required
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Data Controller & Contact */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 mb-12">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Data Controller */}
                            <div>
                                <div className="flex items-center mb-4">
                                    <Building className="w-6 h-6 text-blue-600 mr-3" />
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        Data Controller
                                    </h3>
                                </div>
                                <p className="text-gray-700 mb-4">
                                    The entity responsible for determining how
                                    and why your personal data is processed:
                                </p>
                                <div className="bg-white rounded-xl p-5 border border-blue-200">
                                    <h4 className="font-bold text-xl text-gray-900 mb-3">
                                        Volunteer Faster
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="flex items-start">
                                            <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">
                                                Plot 3118, Block 206, Kampala,
                                                Uganda
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <Mail className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                                            <a
                                                href="mailto:contact@volunteerfaster.com"
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                contact@volunteerfaster.com
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Complaint & Contact */}
                            <div>
                                <div className="flex items-center mb-4">
                                    <AlertTriangle className="w-6 h-6 text-amber-600 mr-3" />
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        Complaints & Contact
                                    </h3>
                                </div>
                                <p className="text-gray-700 mb-4">
                                    If you have concerns about how we handle
                                    your data:
                                </p>
                                <div className="space-y-4">
                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                        <h4 className="font-semibold text-gray-900 mb-1">
                                            Contact Our DPO
                                        </h4>
                                        <p className="text-sm text-gray-700 mb-2">
                                            Email our Data Protection Officer
                                            for any GDPR-related inquiries
                                        </p>
                                        <a
                                            href="mailto:dpo@volunteerfaster.com"
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                        >
                                            dpo@volunteerfaster.com
                                        </a>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                        <h4 className="font-semibold text-gray-900 mb-1">
                                            Supervisory Authority
                                        </h4>
                                        <p className="text-sm text-gray-700">
                                            You have the right to lodge a
                                            complaint with your local data
                                            protection authority
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {/* Data Retention */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">
                                Data Retention
                            </h3>
                            <p className="text-gray-700 text-sm mb-4">
                                We retain personal data only as long as
                                necessary for the purposes outlined in our{" "}
                                <Link
                                    href={route("privacy.policy")}
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Privacy Policy
                                </Link>{" "}
                                or as required by law.
                            </p>
                        </div>

                        {/* Third Parties */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">
                                Third Parties
                            </h3>
                            <p className="text-gray-700 text-sm mb-4">
                                We share data only with trusted partners who
                                comply with GDPR and process data under our
                                instructions.
                            </p>
                        </div>

                        {/* Consent Management */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">
                                Consent Management
                            </h3>
                            <p className="text-gray-700 text-sm mb-4">
                                Manage your consent preferences in account
                                settings or via our cookie banner. You can
                                withdraw consent at any time.
                            </p>
                            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                Manage Preferences →
                            </button>
                        </div>
                    </div>

                    {/* Update Notice */}
                    <div className="bg-gray-50 rounded-xl p-6 text-center">
                        <div className="flex items-center justify-center mb-3">
                            <RefreshCw className="w-5 h-5 text-gray-500 mr-2" />
                            <h3 className="text-lg font-bold text-gray-900">
                                Updates to This Statement
                            </h3>
                        </div>
                        <p className="text-gray-700 max-w-2xl mx-auto">
                            We may update this GDPR Compliance Statement to
                            reflect changes in regulations, our services, or
                            processing activities. Significant changes will be
                            communicated through platform notifications.
                        </p>
                        <div className="mt-4 flex items-center justify-center text-gray-600">
                            <span className="text-sm font-semibold mr-3">
                                Current Version:
                            </span>
                            <span className="font-medium">v2.1</span>
                            <span className="mx-3">•</span>
                            <span className="text-sm font-semibold mr-3">
                                Effective Date:
                            </span>
                            <span className="font-medium">{lastUpdated}</span>
                        </div>
                    </div>
                </div>
            </GeneralPages>
        </>
    );
}
