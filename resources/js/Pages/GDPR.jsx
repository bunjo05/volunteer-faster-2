import GeneralPages from "@/Layouts/GeneralPages";
import { Head } from "@inertiajs/react";
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
    Eye,
    Trash2,
    PauseCircle,
    EyeOff,
    MessageSquare,
    ShieldCheck,
    Clock,
    Filter,
    Server,
    Award,
    CreditCard,
    Handshake,
    Bell,
} from "lucide-react";

const gdprRights = [
    {
        right: "Right to Access",
        icon: <Eye className="w-5 h-5" />,
        description: "Complete data export including all stored information",
        process: "30-day fulfillment period, machine-readable format",
        color: "bg-blue-100 text-blue-600",
        timeline: "Within 30 days of verified request",
    },
    {
        right: "Right to Rectification",
        icon: <CheckCircle className="w-5 h-5" />,
        description: "Update inaccurate or incomplete information",
        process:
            "Immediate self-service via profile, ID verification for sensitive data",
        color: "bg-green-100 text-green-600",
        timeline: "Immediate for profile data, 48 hours for verification",
    },
    {
        right: "Right to Erasure",
        icon: <Trash2 className="w-5 h-5" />,
        description:
            "Complete account and data removal ('Right to be Forgotten')",
        process: "14-day cooling-off period, 30-day deletion cycle",
        color: "bg-red-100 text-red-600",
        timeline: "45 days total (14-day cooling + 30-day deletion)",
    },
    {
        right: "Right to Restrict Processing",
        icon: <PauseCircle className="w-5 h-5" />,
        description: "Temporarily halt data processing during disputes",
        process: "Account placed in read-only mode while restrictions apply",
        color: "bg-purple-100 text-purple-600",
        timeline: "Immediate upon verified request",
    },
    {
        right: "Right to Data Portability",
        icon: <Download className="w-5 h-5" />,
        description: "Transfer your data to another service provider",
        process: "Standardized JSON format compatible with major platforms",
        color: "bg-amber-100 text-amber-600",
        timeline: "Within 30 days of verified request",
    },
    {
        right: "Right to Object",
        icon: <EyeOff className="w-5 h-5" />,
        description: "Opt-out of specific processing activities",
        process: "Marketing, automated decision-making, research",
        color: "bg-orange-100 text-orange-600",
        timeline: "Processing stops within 7 business days",
    },
];

const legalBasis = [
    {
        basis: "Explicit Consent",
        description:
            "You have given clear, specific, and informed consent for us to process your data",
        example:
            "Newsletter subscriptions, cookie preferences, communication monitoring agreement",
        icon: <CheckCircle className="w-5 h-5" />,
        legalReference: "GDPR Article 6(1)(a)",
        withdrawable: "Yes, via account settings or request to DPO",
    },
    {
        basis: "Performance of Contract",
        description:
            "Processing is necessary for the performance of a contract with you",
        example:
            "Connecting volunteers with organizations, payment processing, project coordination",
        icon: <FileText className="w-5 h-5" />,
        legalReference: "GDPR Article 6(1)(b)",
        withdrawable: "No, required for service delivery",
    },
    {
        basis: "Legal Obligation",
        description:
            "Processing is necessary to comply with our legal obligations",
        example:
            "Tax records, regulatory compliance, financial reporting, court orders",
        icon: <Scale className="w-5 h-5" />,
        legalReference: "GDPR Article 6(1)(c)",
        withdrawable: "No, mandatory by law",
    },
    {
        basis: "Legitimate Interests",
        description:
            "Processing is necessary for our legitimate interests, balanced against your rights",
        example:
            "Service improvements, fraud prevention, security monitoring, platform analytics",
        icon: <Shield className="w-5 h-5" />,
        legalReference: "GDPR Article 6(1)(f)",
        withdrawable: "Yes, right to object available",
        balancingTest: "Conducted for each processing activity",
    },
];

const dataCategories = [
    {
        category: "Identity & Verification Data",
        examples: [
            "Full name, email, phone number",
            "Government-issued ID (encrypted)",
            "Date of birth and age verification",
            "Physical address for verification",
            "Biometric data (if used for MFA)",
        ],
        icon: <Users className="w-5 h-5" />,
        retention: "3 years after account closure",
        legalBasis: "Contract, Legal Obligation",
    },
    {
        category: "Volunteer & Operational Data",
        examples: [
            "Skills, certifications, qualifications",
            "Project applications and performance",
            "Points earned and redemption history",
            "Communication metadata and content",
            "Platform interaction patterns",
        ],
        icon: <Database className="w-5 h-5" />,
        retention: "5 years for performance records",
        legalBasis: "Contract, Legitimate Interests",
    },
    {
        category: "Financial & Transaction Data",
        examples: [
            "Payment method tokens",
            "Donation amounts and timestamps",
            "Escrow account activity",
            "Platform fee calculations",
            "Tax documentation (organizations)",
        ],
        icon: <CreditCard className="w-5 h-5" />,
        retention: "7 years for financial compliance",
        legalBasis: "Legal Obligation, Contract",
    },
];

const communicationMonitoringRights = [
    {
        right: "Notification of Monitoring",
        description: "Right to be informed when communications are reviewed",
        icon: <Bell className="w-5 h-5" />,
        exception: "Safety emergencies or legal investigations",
    },
    {
        right: "Appeal Monitoring Decisions",
        description:
            "Right to contest monitoring findings and content removals",
        icon: <AlertTriangle className="w-5 h-5" />,
        timeline: "30-day appeal window",
    },
    {
        right: "Explanation of Actions",
        description:
            "Right to receive specific reasons for account actions based on monitoring",
        icon: <MessageSquare className="w-5 h-5" />,
        requirement: "Detailed justification provided",
    },
    {
        right: "Data Minimization in Monitoring",
        description: "Right to have only necessary communications monitored",
        icon: <Filter className="w-5 h-5" />,
        scope: "Limited to platform safety and compliance purposes",
    },
];

const internationalTransfers = [
    {
        mechanism: "Standard Contractual Clauses",
        description: "EU-approved contractual clauses ensuring data protection",
        status: "Implemented with all non-EEA processors",
        icon: <FileText className="w-5 h-5" />,
        coverage: "100% of non-EEA data transfers",
    },
    {
        mechanism: "Adequacy Decisions",
        description: "Transfer only to countries with EU adequacy decisions",
        status: "Preferred where available",
        icon: <Globe className="w-5 h-5" />,
        countries: ["UK", "Switzerland", "Japan", "Canada", "New Zealand"],
    },
    {
        mechanism: "Binding Corporate Rules",
        description: "Internal rules for intra-group transfers",
        status: "Under development for 2025",
        icon: <ShieldCheck className="w-5 h-5" />,
        timeline: "Q4 2025 implementation",
    },
    {
        mechanism: "Explicit Consent",
        description: "Your informed consent for specific transfers",
        status: "Required for non-standard transfers",
        icon: <CheckCircle className="w-5 h-5" />,
        revocable: "Yes, at any time",
    },
];

const securityMeasures = [
    {
        measure: "End-to-End Encryption",
        description: "AES-256 for data at rest, TLS 1.3 for data in transit",
        icon: <Lock className="w-5 h-5" />,
        compliance: "GDPR Article 32",
    },
    {
        measure: "Pseudonymization",
        description:
            "Data minimization through pseudonymization where possible",
        icon: <Key className="w-5 h-5" />,
        compliance: "GDPR Article 25",
    },
    {
        measure: "Regular DPIA",
        description:
            "Data Protection Impact Assessments for high-risk processing",
        icon: <Scale className="w-5 h-5" />,
        frequency: "Annual review, triggered by new features",
    },
    {
        measure: "Breach Notification",
        description: "72-hour notification to authorities and affected users",
        icon: <AlertTriangle className="w-5 h-5" />,
        timeline: "Internal response within 1 hour",
    },
];

export default function GDPR({ auth }) {
    const lastUpdated = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    const currentUrl =
        typeof window !== "undefined" ? window.location.href : appUrl;

    const pageTitle = "GDPR Compliance Statement | Volunteer Faster";
    const pageDescription =
        "Comprehensive GDPR compliance framework detailing data rights, security measures, legal basis, and communication monitoring practices.";
    const pageKeywords =
        "GDPR compliance, data protection, EU data rights, GDPR statement, data privacy, communication monitoring, data security";

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta name="keywords" content={pageKeywords} />
                <meta name="author" content="Volunteer Faster" />
                <meta name="robots" content="index, follow" />
                <meta name="language" content="English" />

                <meta property="og:type" content="article" />
                <meta property="og:url" content={currentUrl} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:image" content={`${appUrl}/hero.jpg`} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta
                    property="og:image:alt"
                    content="GDPR Compliance Statement - Volunteer Faster"
                />
                <meta property="og:site_name" content="Volunteer Faster" />
                <meta property="og:locale" content="en_US" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={currentUrl} />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
                <meta name="twitter:image" content={`${appUrl}/hero.jpg`} />
                <meta name="twitter:site" content="@volunteerfaster" />
                <meta name="twitter:creator" content="@volunteerfaster" />
                <meta
                    name="twitter:image:alt"
                    content="GDPR Compliance Statement - Volunteer Faster"
                />

                <link rel="canonical" href={currentUrl} />

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
                            email: "contact@volunteerfaster.com",
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
                            <ShieldCheck className="w-10 h-10 text-blue-600" />
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
                            <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                                EU Regulation 2016/679 v3.2
                            </span>
                            <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                Updated: {lastUpdated}
                            </span>
                            <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                                Enhanced Communication Monitoring
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            GDPR Compliance Framework
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Comprehensive compliance with the General Data
                            Protection Regulation (GDPR), including enhanced
                            communication monitoring for platform safety and
                            your data rights.
                        </p>
                    </div>

                    {/* Critical Communication Monitoring Notice */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 rounded-r-xl p-6 mb-10">
                        <div className="flex items-start">
                            <MessageSquare className="w-6 h-6 text-indigo-600 mt-1 mr-4 flex-shrink-0" />
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Communication Monitoring Under GDPR
                                </h2>
                                <p className="text-gray-700 mb-3">
                                    To maintain platform safety and integrity,
                                    Volunteer Faster monitors platform
                                    communications. This processing is conducted
                                    under GDPR{" "}
                                    <strong>
                                        Legitimate Interests (Article 6(1)(f))
                                    </strong>
                                    and includes specific rights for data
                                    subjects regarding monitoring activities.
                                </p>
                                <div className="bg-white rounded-lg p-4">
                                    <p className="text-sm text-gray-700">
                                        <strong>Legal Basis:</strong> Legitimate
                                        interests (platform safety, fraud
                                        prevention).
                                        <strong> Your Rights:</strong>{" "}
                                        Notification, appeal, explanation, and
                                        data minimization. Read our complete{" "}
                                        <Link
                                            href={route("privacy.policy")}
                                            className="text-blue-600 hover:text-blue-800 font-medium mx-1"
                                        >
                                            Privacy Policy
                                        </Link>
                                        for detailed monitoring practices.
                                    </p>
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
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {item.basis}
                                            </h3>
                                            <span className="text-xs text-gray-500">
                                                {item.legalReference}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 mb-3 text-sm">
                                        {item.description}
                                    </p>
                                    <div className="bg-blue-50 rounded-lg p-3 mb-3">
                                        <p className="text-sm font-medium text-gray-600 mb-1">
                                            Example:
                                        </p>
                                        <p className="text-gray-700 text-sm">
                                            {item.example}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span
                                            className={`text-xs font-medium px-2 py-1 rounded ${
                                                item.withdrawable === "Yes"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-700"
                                            }`}
                                        >
                                            Withdrawable: {item.withdrawable}
                                        </span>
                                        {item.balancingTest && (
                                            <span className="text-xs font-medium text-blue-600">
                                                Legitimate Interests Test
                                                Conducted
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Data Categories with Retention */}
                    <section className="mb-12">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                <Database className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Data Categories & Retention
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Clear categorization with specific retention
                                periods and legal bases
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
                                    <ul className="space-y-2 mb-4">
                                        {category.examples.map(
                                            (example, idx) => (
                                                <li
                                                    key={idx}
                                                    className="flex items-start"
                                                >
                                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                                    <span className="text-gray-700 text-sm">
                                                        {example}
                                                    </span>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                    <div className="pt-3 border-t border-gray-100">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center text-gray-500">
                                                <Clock className="w-3 h-3 mr-2" />
                                                <span className="text-xs font-medium">
                                                    {category.retention}
                                                </span>
                                            </div>
                                            <div className="text-xs text-blue-600 font-medium">
                                                {category.legalBasis}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Comprehensive Rights Section */}
                    <section className="mb-12">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                                <Key className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">
                                    Your GDPR Rights
                                </h2>
                                <p className="text-gray-600">
                                    Comprehensive rights with clear processes
                                    and timelines
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
                                    <p className="text-gray-700 text-sm mb-3">
                                        {right.description}
                                    </p>
                                    <div className="mb-3">
                                        <p className="text-xs font-medium text-gray-600 mb-1">
                                            Process:
                                        </p>
                                        <p className="text-xs text-gray-700">
                                            {right.process}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">
                                            Timeline: {right.timeline}
                                        </span>
                                        {/* <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                                            Exercise →
                                        </button> */}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Communication Monitoring Rights */}
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Special Rights for Communication Monitoring
                            </h3>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {communicationMonitoringRights.map((right) => (
                                    <div
                                        key={right.right}
                                        className="bg-white rounded-xl p-4"
                                    >
                                        <div className="flex items-center mb-2">
                                            <div className="text-indigo-500 mr-2">
                                                {right.icon}
                                            </div>
                                            <h4 className="font-bold text-gray-900 text-sm">
                                                {right.right}
                                            </h4>
                                        </div>
                                        <p className="text-xs text-gray-700 mb-2">
                                            {right.description}
                                        </p>
                                        {right.exception && (
                                            <p className="text-xs text-gray-500">
                                                Exception: {right.exception}
                                            </p>
                                        )}
                                        {right.timeline && (
                                            <p className="text-xs text-gray-500">
                                                Timeline: {right.timeline}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">
                                How to Exercise Your Rights
                            </h3>
                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                                <div className="bg-white rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-1">
                                        Self-Service Portal
                                    </h4>
                                    <p className="text-sm text-gray-700">
                                        Access most rights directly through
                                        account settings
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-1">
                                        Email to DPO
                                    </h4>
                                    <p className="text-sm text-gray-700">
                                        contact@volunteerfaster.com - 14
                                        business day response
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-1">
                                        Verification Required
                                    </h4>
                                    <p className="text-sm text-gray-700">
                                        ID verification for sensitive requests
                                        to prevent fraud
                                    </p>
                                </div>
                            </div>
                            <p className="text-gray-700 text-sm">
                                All requests will be fulfilled within 30 days as
                                required by GDPR Article 12. Complex requests
                                may be extended by an additional 60 days with
                                notification.
                            </p>
                        </div>
                    </section>

                    {/* Data Security & International Transfers */}
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {/* Enhanced Security Measures */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center mb-4">
                                <ShieldCheck className="w-6 h-6 text-green-600 mr-3" />
                                <h3 className="text-2xl font-bold text-gray-900">
                                    Security & Protection
                                </h3>
                            </div>
                            <p className="text-gray-700 mb-4">
                                Technical and organizational measures per GDPR
                                Article 32:
                            </p>
                            <div className="space-y-4">
                                {securityMeasures.map((measure) => (
                                    <div
                                        key={measure.measure}
                                        className="bg-gray-50 rounded-lg p-4"
                                    >
                                        <div className="flex items-center mb-2">
                                            <div className="text-green-500 mr-3">
                                                {measure.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">
                                                    {measure.measure}
                                                </h4>
                                                <span className="text-xs text-gray-500">
                                                    {measure.compliance}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-700">
                                            {measure.description}
                                        </p>
                                        {measure.frequency && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Frequency: {measure.frequency}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* International Transfer Mechanisms */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center mb-4">
                                <Globe className="w-6 h-6 text-blue-600 mr-3" />
                                <h3 className="text-2xl font-bold text-gray-900">
                                    International Transfers
                                </h3>
                            </div>
                            <p className="text-gray-700 mb-4">
                                All transfers outside EEA use GDPR-compliant
                                mechanisms:
                            </p>
                            <div className="space-y-4">
                                {internationalTransfers.map((transfer) => (
                                    <div
                                        key={transfer.mechanism}
                                        className="bg-blue-50 rounded-lg p-4"
                                    >
                                        <div className="flex items-center mb-2">
                                            <div className="text-blue-500 mr-3">
                                                {transfer.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">
                                                    {transfer.mechanism}
                                                </h4>
                                                <span
                                                    className={`text-xs px-2 py-0.5 rounded ${
                                                        transfer.status.includes(
                                                            "Implemented"
                                                        )
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-amber-100 text-amber-700"
                                                    }`}
                                                >
                                                    {transfer.status}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-700 mb-2">
                                            {transfer.description}
                                        </p>
                                        {transfer.coverage && (
                                            <p className="text-xs text-gray-600">
                                                Coverage: {transfer.coverage}
                                            </p>
                                        )}
                                        {transfer.timeline && (
                                            <p className="text-xs text-gray-600">
                                                Timeline: {transfer.timeline}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 bg-amber-50 rounded-lg p-4">
                                <p className="text-sm text-amber-800">
                                    <strong>Note:</strong> We conduct Transfer
                                    Impact Assessments for all international
                                    data transfers to ensure equivalent
                                    protection levels.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Data Controller & DPO Information */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 mb-12">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <div className="flex items-center mb-4">
                                    <Building className="w-6 h-6 text-blue-600 mr-3" />
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        Data Controller Information
                                    </h3>
                                </div>
                                <div className="bg-white rounded-xl p-5 border border-blue-200 mb-4">
                                    <h4 className="font-bold text-xl text-gray-900 mb-3">
                                        Volunteer Faster Ltd.
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex items-start">
                                            <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-gray-700">
                                                    Plot 3118, Block 206
                                                </p>
                                                <p className="text-gray-700">
                                                    Kampala, Uganda
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Registration:
                                                    URSB-2025-89432
                                                </p>
                                            </div>
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
                                <div className="bg-white rounded-xl p-5 border border-blue-200">
                                    <h4 className="font-bold text-gray-900 mb-2">
                                        Processing Activities Register
                                    </h4>
                                    <p className="text-sm text-gray-700 mb-2">
                                        Maintained per GDPR Article 30.
                                        Available upon request to supervisory
                                        authorities.
                                    </p>
                                    <ul className="text-xs text-gray-600 space-y-1">
                                        <li>
                                            • Volunteer matching and
                                            coordination
                                        </li>
                                        <li>
                                            • Communication monitoring for
                                            safety
                                        </li>
                                        <li>
                                            • Financial transaction processing
                                        </li>
                                        <li>
                                            • Platform analytics and improvement
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center mb-4">
                                    <AlertTriangle className="w-6 h-6 text-amber-600 mr-3" />
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        Complaints & Supervision
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                        <h4 className="font-semibold text-gray-900 mb-1">
                                            Data Protection Officer
                                        </h4>
                                        <p className="text-sm text-gray-700 mb-2">
                                            Independent DPO for GDPR compliance
                                            monitoring and inquiries
                                        </p>
                                        <a
                                            href="mailto:contact@volunteerfaster.com"
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                        >
                                            contact@volunteerfaster.com
                                        </a>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Response within 14 business days
                                        </p>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                        <h4 className="font-semibold text-gray-900 mb-1">
                                            Supervisory Authority
                                        </h4>
                                        <p className="text-sm text-gray-700 mb-2">
                                            You have the right to lodge a
                                            complaint with your local data
                                            protection authority.
                                        </p>
                                        <div className="text-xs text-gray-600">
                                            <p className="font-medium mb-1">
                                                Lead Supervisory Authority:
                                            </p>
                                            <p>Uganda Data Protection Office</p>
                                            <p>
                                                Ministry of ICT and National
                                                Guidance
                                            </p>
                                            <p>Kampala, Uganda</p>
                                        </div>
                                    </div>
                                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                                        <h4 className="font-semibold text-gray-900 mb-1">
                                            Data Breach Reporting
                                        </h4>
                                        <p className="text-sm text-gray-700">
                                            Report suspected data breaches to
                                            DPO immediately. We notify
                                            authorities within 72 hours as
                                            required by GDPR Article 33.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Compliance Information */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">
                                Data Protection Impact Assessments
                            </h3>
                            <p className="text-gray-700 text-sm mb-4">
                                DPIAs conducted for high-risk processing
                                including communication monitoring, automated
                                decision-making, and large-scale processing of
                                sensitive data.
                            </p>
                            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                Last DPIA: October 2024 | Next Review: October
                                2025
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">
                                Third-Party Processors
                            </h3>
                            <p className="text-gray-700 text-sm mb-4">
                                All processors sign Data Processing Agreements
                                with GDPR-mandated clauses. Regular audits
                                ensure compliance.
                            </p>
                            {/* <Link
                                href="/processor-list"
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
                            >
                                View Processor List{" "}
                                <ExternalLink className="w-3 h-3 ml-1" />
                            </Link> */}
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">
                                Automated Decision-Making
                            </h3>
                            <p className="text-gray-700 text-sm mb-4">
                                Right to human intervention, explanation, and
                                challenge for decisions based solely on
                                automated processing (GDPR Article 22).
                            </p>
                            {/* <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                Request Human Review →
                            </button> */}
                        </div>
                    </div>

                    {/* Update Notice & Integration */}
                    <div className="bg-gray-50 rounded-xl p-6 text-center">
                        <div className="flex items-center justify-center mb-3">
                            <RefreshCw className="w-5 h-5 text-gray-500 mr-2" />
                            <h3 className="text-lg font-bold text-gray-900">
                                Updates & Integration
                            </h3>
                        </div>
                        <p className="text-gray-700 max-w-2xl mx-auto mb-4">
                            This GDPR Compliance Framework is integrated with
                            our
                            <Link
                                href={route("privacy.policy")}
                                className="text-blue-600 hover:text-blue-800 font-medium mx-1"
                            >
                                Privacy Policy
                            </Link>
                            and
                            <Link
                                href="/terms"
                                className="text-blue-600 hover:text-blue-800 font-medium mx-1"
                            >
                                Terms & Conditions
                            </Link>
                            . Significant changes trigger 30-day advance notice
                            to users.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-600">
                            <div>
                                <span className="text-sm font-semibold mr-3">
                                    Current Version:
                                </span>
                                <span className="font-medium">v3.2</span>
                            </div>
                            <div>
                                <span className="text-sm font-semibold mr-3">
                                    Effective Date:
                                </span>
                                <span className="font-medium">
                                    {lastUpdated}
                                </span>
                            </div>
                            <div>
                                <span className="text-sm font-semibold mr-3">
                                    GDPR Version:
                                </span>
                                <span className="font-medium">
                                    Regulation (EU) 2016/679
                                </span>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-500">
                            This framework is reviewed annually or following
                            significant regulatory changes.
                        </div>
                    </div>

                    {/* Final Compliance Declaration */}
                    <div className="mt-8 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-8 text-white text-center">
                        <h3 className="text-2xl font-bold mb-4">
                            Compliance Declaration
                        </h3>
                        <p className="mb-6 opacity-90 max-w-2xl mx-auto">
                            Volunteer Faster declares full compliance with GDPR
                            requirements, including data subject rights,
                            security measures, international transfer
                            mechanisms, and transparent communication monitoring
                            practices.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                                <span>
                                    GDPR Article 6: Legal Basis Established
                                </span>
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                                <span>
                                    GDPR Article 32: Security Measures
                                    Implemented
                                </span>
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                                <span>
                                    GDPR Article 44-49: International Transfers
                                    Secured
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </GeneralPages>
        </>
    );
}
