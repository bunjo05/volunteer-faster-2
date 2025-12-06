import GeneralPages from "@/Layouts/GeneralPages";
import { Head } from "@inertiajs/react";
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
    Key,
    Clock,
    Trash2,
    Download,
    EyeOff,
    Server,
    ShieldCheck,
    MessageSquare,
    Filter,
    LogOut,
    Globe,
    PauseCircle,
} from "lucide-react";

const informationCategories = [
    {
        title: "Personal Identification Data",
        icon: <User className="w-5 h-5" />,
        color: "bg-blue-100 text-blue-600",
        items: [
            "Full name, email address, phone number",
            "Date of birth and verified age documentation",
            "Government-issued ID for verification (securely stored)",
            "Profile photos and biographical information",
            "Physical address for verification purposes",
        ],
        retention: "3 years after account closure for legal compliance",
    },
    {
        title: "Volunteer Activity Data",
        icon: <Users className="w-5 h-5" />,
        color: "bg-green-100 text-green-600",
        items: [
            "Verified skills, certifications, and qualifications",
            "Volunteer interests and cause preferences",
            "Project applications, acceptances, and rejections",
            "Performance evaluations and completion confirmations",
            "Points earned and redemption history",
        ],
        retention: "5 years for performance records",
    },
    {
        title: "Organizational & Operational Data",
        icon: <Building className="w-5 h-5" />,
        color: "bg-purple-100 text-purple-600",
        items: [
            "Legal registration documents and verification status",
            "Contact details of authorized representatives",
            "Posted volunteer opportunities and requirements",
            "Organizational history, reviews, and ratings",
            "Financial transactions and payment information",
        ],
        retention: "7 years for financial and legal records",
    },
    {
        title: "Technical & Behavioral Data",
        icon: <Server className="w-5 h-5" />,
        color: "bg-amber-100 text-amber-600",
        items: [
            "IP addresses, device fingerprints, and browser data",
            "Session logs, login attempts, and access patterns",
            "Platform interaction and clickstream analytics",
            "Communication metadata (not content) for security",
            "Error reports and performance metrics",
        ],
        retention: "90 days for security logs, anonymized after",
    },
    {
        title: "Communication Content",
        icon: <MessageSquare className="w-5 h-5" />,
        color: "bg-indigo-100 text-indigo-600",
        items: [
            "Platform messages between volunteers and organizations",
            "Project discussion threads and comments",
            "Report submissions and dispute communications",
            "Feedback and review content",
            "Fundraising campaign descriptions and updates",
        ],
        retention: "2 years for active accounts, 90 days after closure",
        monitoring: "Subject to automated and manual review for safety",
    },
    {
        title: "Financial & Transaction Data",
        icon: <Key className="w-5 h-5" />,
        color: "bg-red-100 text-red-600",
        items: [
            "Payment method tokens (never full card numbers)",
            "Donation amounts and transaction timestamps",
            "Escrow account activity and fund releases",
            "Platform fee calculations and receipts",
            "Tax documentation for organizational partners",
        ],
        retention: "7 years for financial compliance",
    },
];

const dataUsage = [
    {
        purpose: "Volunteer-Organization Matching",
        description:
            "Algorithmic matching based on skills, location, and preferences with manual review",
        icon: <Users className="w-5 h-5" />,
        legalBasis: "Contractual necessity",
    },
    {
        purpose: "Platform Safety & Integrity",
        description:
            "Automated and manual review of communications to prevent fraud, harassment, and policy violations",
        icon: <ShieldCheck className="w-5 h-5" />,
        legalBasis: "Legitimate interest & legal obligation",
    },
    {
        purpose: "Service Operation & Improvement",
        description:
            "Platform functionality, feature development, and user experience enhancement",
        icon: <Settings className="w-5 h-5" />,
        legalBasis: "Contractual necessity & legitimate interest",
    },
    {
        purpose: "Legal & Regulatory Compliance",
        description:
            "Identity verification, financial reporting, and legal obligation fulfillment",
        icon: <FileText className="w-5 h-5" />,
        legalBasis: "Legal obligation",
    },
    {
        purpose: "Personalized Communication",
        description:
            "Project recommendations, relevant updates, and service announcements",
        icon: <Bell className="w-5 h-5" />,
        legalBasis: "Consent & legitimate interest",
    },
    {
        purpose: "Research & Analytics",
        description:
            "Aggregated, anonymized analysis of volunteer trends and platform usage",
        icon: <BarChart3 className="w-5 h-5" />,
        legalBasis: "Legitimate interest",
    },
];

const communicationMonitoring = [
    {
        aspect: "Automated Content Scanning",
        description:
            "Real-time scanning for prohibited content, threats, and policy violations",
        purpose: "Immediate threat prevention",
        icon: <Filter className="w-5 h-5" />,
    },
    {
        aspect: "Manual Review Triggers",
        description:
            "Human review triggered by automated flags or user reports",
        purpose: "Contextual assessment and fair judgment",
        icon: <Eye className="w-5 h-5" />,
    },
    {
        aspect: "Retention Period",
        description:
            "Communication content retained for 90 days for dispute resolution",
        purpose: "Evidence preservation",
        icon: <Clock className="w-5 h-5" />,
    },
    {
        aspect: "User Notification",
        description:
            "Notification when communications are reviewed, except in safety emergencies",
        purpose: "Transparency and trust",
        icon: <Bell className="w-5 h-5" />,
    },
];

const sharingCategories = [
    {
        category: "With Volunteer Partners",
        description:
            "Profile information shared with organizations for project consideration",
        icon: <Building className="w-5 h-5" />,
        control: "You control what's visible in your public profile",
        required: ["Name", "Skills", "Location radius"],
        optional: ["Photo", "Full address", "Contact details"],
    },
    {
        category: "Service Providers",
        description: "Trusted vendors under strict data protection agreements",
        icon: <Share2 className="w-5 h-5" />,
        examples: [
            "Payment processors",
            "Cloud hosting",
            "Analytics providers",
        ],
        agreements: "All providers sign DPAs and undergo security audits",
    },
    {
        category: "Legal & Governmental",
        description:
            "When required by court order, subpoena, or valid legal process",
        icon: <FileText className="w-5 h-5" />,
        process:
            "We review all requests for validity and narrow scope where possible",
        notification: "Users notified unless legally prohibited",
    },
    {
        category: "Business Transfers",
        description: "In case of merger, acquisition, or asset sale",
        icon: <Globe className="w-5 h-5" />,
        protection: "Data subject to same privacy standards",
        notification: "30-day advance notice required",
    },
];

const userRights = [
    {
        right: "Right to Access",
        description: "Complete data export including all stored information",
        icon: <Eye className="w-5 h-5" />,
        process: "Request via account settings, delivered within 30 days",
        format: "Machine-readable JSON/CSV format",
    },
    {
        right: "Right to Correction",
        description: "Update inaccurate or incomplete information",
        icon: <Settings className="w-5 h-5" />,
        process:
            "Immediate through profile settings, verification required for sensitive data",
        timeline: "48-hour review for verification requests",
    },
    {
        right: "Right to Deletion",
        description:
            "Complete account and data removal ('Right to be Forgotten')",
        icon: <Trash2 className="w-5 h-5" />,
        process:
            "Request triggers 14-day cooling-off period, then 30-day deletion cycle",
        exceptions:
            "Data retained where legally required (financial records, dispute history)",
    },
    {
        right: "Right to Restrict Processing",
        description:
            "Temporarily halt data processing while disputes are resolved",
        icon: <PauseCircle className="w-5 h-5" />,
        trigger: "Data accuracy disputes or objection to processing",
        effect: "Account placed in read-only mode during restriction",
    },
    {
        right: "Right to Data Portability",
        description: "Transfer your data to another service provider",
        icon: <Download className="w-5 h-5" />,
        format: "Standardized JSON format compatible with major platforms",
        timeline: "Delivered within 30 days of verified request",
    },
    {
        right: "Right to Object",
        description: "Opt-out of specific processing activities",
        icon: <EyeOff className="w-5 h-5" />,
        scope: "Marketing communications, automated decision-making, research",
        effect: "Processing stops within 7 business days",
    },
];

const securityMeasures = [
    {
        measure: "End-to-End Encryption",
        description:
            "AES-256 encryption for data at rest and TLS 1.3 for data in transit",
        icon: <Lock className="w-5 h-5" />,
        scope: "All sensitive data including messages and documents",
    },
    {
        measure: "Zero-Knowledge Architecture",
        description:
            "Payment tokens and sensitive verification data encrypted client-side",
        icon: <Key className="w-5 h-5" />,
        scope: "Financial data and government ID documents",
    },
    {
        measure: "Regular Security Audits",
        description:
            "Quarterly third-party penetration testing and continuous vulnerability scanning",
        icon: <ShieldCheck className="w-5 h-5" />,
        frequency: "External audits every 90 days, internal scans daily",
    },
    {
        measure: "Granular Access Controls",
        description:
            "Role-based access with multi-factor authentication for staff",
        icon: <Users className="w-5 h-5" />,
        requirement:
            "Biometric or hardware token MFA for sensitive data access",
    },
    {
        measure: "Data Breach Protocol",
        description:
            "72-hour notification to authorities and affected users for qualifying breaches",
        icon: <AlertTriangle className="w-5 h-5" />,
        timeline:
            "Internal response within 1 hour, full assessment within 24 hours",
    },
    {
        measure: "Privacy by Design",
        description:
            "Data minimization, purpose limitation, and storage limitation principles",
        icon: <Shield className="w-5 h-5" />,
        implementation:
            "Built into all development processes and feature designs",
    },
];

export default function Privacy({ auth }) {
    const lastUpdated = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    const currentUrl =
        typeof window !== "undefined" ? window.location.href : appUrl;

    const pageTitle = "Privacy Policy | Volunteer Faster";
    const pageDescription =
        "Comprehensive Privacy Policy detailing data protection, communication monitoring, and user rights for Volunteer Faster platform.";
    const pageKeywords =
        "privacy policy, GDPR compliance, data protection, communication monitoring, volunteer privacy, data security";

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
                    content="Volunteer Faster Privacy Policy"
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
                    content="Volunteer Faster Privacy Policy"
                />

                <link rel="canonical" href={currentUrl} />

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
                            <ShieldCheck className="w-10 h-10 text-blue-600" />
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
                            <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                                v5.3 - Enhanced Protections
                            </span>
                            <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                Updated: {lastUpdated}
                            </span>
                            <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                                GDPR & CCPA Compliant
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Privacy & Data Protection Policy
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Comprehensive framework detailing how{" "}
                            <span className="font-bold text-blue-600">
                                Volunteer Faster
                            </span>{" "}
                            collects, protects, and manages your data, including
                            our communication monitoring practices for platform
                            safety.
                        </p>
                    </div>

                    {/* Critical Transparency Notice */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 rounded-r-xl p-6 mb-10">
                        <div className="flex items-start">
                            <Eye className="w-6 h-6 text-indigo-600 mt-1 mr-4 flex-shrink-0" />
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Transparent Communication Monitoring
                                </h2>
                                <p className="text-gray-700 mb-3">
                                    To ensure platform safety, prevent
                                    harassment, and maintain service quality,
                                    Volunteer Faster monitors platform
                                    communications. This includes automated
                                    scanning and, when necessary, manual review
                                    of messages, discussions, and content.
                                </p>
                                <div className="bg-white rounded-lg p-4">
                                    <p className="text-sm text-gray-700">
                                        <strong>Key Principle:</strong> We
                                        monitor for safety, not surveillance.
                                        Personal communications outside platform
                                        coordination are respected. Read our
                                        full Communication Monitoring Policy
                                        below.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Information Collection Overview */}
                    <section className="mb-12">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                                <Database className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">
                                    Data We Collect & Retain
                                </h2>
                                <p className="text-gray-600 mt-1">
                                    Transparent categorization with specific
                                    retention periods
                                </p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {category.title}
                                        </h3>
                                    </div>
                                    <ul className="space-y-2 mb-4">
                                        {category.items.map((item, idx) => (
                                            <li
                                                key={idx}
                                                className="flex items-start"
                                            >
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                                <span className="text-gray-700 text-sm">
                                                    {item}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                    {category.monitoring && (
                                        <div className="mb-3">
                                            <div className="flex items-center text-indigo-600">
                                                <Eye className="w-4 h-4 mr-2" />
                                                <span className="text-xs font-semibold">
                                                    MONITORED CONTENT
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600 mt-1">
                                                {category.monitoring}
                                            </p>
                                        </div>
                                    )}
                                    <div className="pt-3 border-t border-gray-100">
                                        <div className="flex items-center text-gray-500">
                                            <Clock className="w-3 h-3 mr-2" />
                                            <span className="text-xs font-medium">
                                                Retention: {category.retention}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Communication Monitoring Section */}
                    <section id="monitoring" className="mb-12">
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mr-4">
                                    <MessageSquare className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">
                                        Communication Monitoring Policy
                                    </h2>
                                    <p className="text-gray-600">
                                        How and why we monitor platform
                                        communications for safety and quality
                                    </p>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                    Our Monitoring Approach
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {communicationMonitoring.map((item) => (
                                        <div
                                            key={item.aspect}
                                            className="bg-white rounded-xl p-6"
                                        >
                                            <div className="flex items-center mb-3">
                                                <div className="text-indigo-500 mr-3">
                                                    {item.icon}
                                                </div>
                                                <h4 className="font-bold text-gray-900">
                                                    {item.aspect}
                                                </h4>
                                            </div>
                                            <p className="text-gray-700 text-sm mb-2">
                                                {item.description}
                                            </p>
                                            <div className="flex items-center text-indigo-600">
                                                <span className="text-xs font-semibold">
                                                    Purpose: {item.purpose}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">
                                    What We Monitor & Why
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2">
                                            Monitored Content
                                        </h4>
                                        <ul className="space-y-2 text-sm text-gray-700">
                                            <li className="flex items-start">
                                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                <span>
                                                    Platform messages between
                                                    users
                                                </span>
                                            </li>
                                            <li className="flex items-start">
                                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                <span>
                                                    Project discussion threads
                                                </span>
                                            </li>
                                            <li className="flex items-start">
                                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                <span>
                                                    Report submissions and
                                                    dispute communications
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2">
                                            Not Routinely Monitored
                                        </h4>
                                        <ul className="space-y-2 text-sm text-gray-700">
                                            <li className="flex items-start">
                                                <EyeOff className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                                                <span>
                                                    Personal contact information
                                                    exchanged after match
                                                </span>
                                            </li>
                                            <li className="flex items-start">
                                                <EyeOff className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                                                <span>
                                                    Off-platform communications
                                                </span>
                                            </li>
                                            <li className="flex items-start">
                                                <EyeOff className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                                                <span>
                                                    Sensitive personal data
                                                    unrelated to platform use
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 bg-indigo-50 rounded-xl p-6">
                                <div className="flex items-start">
                                    <Shield className="w-5 h-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2">
                                            Your Privacy Rights in Monitoring
                                        </h4>
                                        <p className="text-gray-700 text-sm">
                                            You have the right to know when your
                                            communications are reviewed (except
                                            in emergency safety situations), to
                                            appeal monitoring decisions, and to
                                            receive explanations for content
                                            removals or account actions
                                            resulting from monitoring.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Data Usage & Legal Basis */}
                    <section className="mb-12">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                <BarChart3 className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                How & Why We Use Your Data
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Each processing activity tied to specific legal
                                basis under GDPR and other privacy frameworks
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {dataUsage.map((usage) => (
                                <div
                                    key={usage.purpose}
                                    className="bg-white rounded-xl border border-gray-200 p-6"
                                >
                                    <div className="flex items-center mb-3">
                                        <div className="text-blue-500 mr-3">
                                            {usage.icon}
                                        </div>
                                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                            {usage.legalBasis}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        {usage.purpose}
                                    </h3>
                                    <p className="text-gray-700 text-sm mb-3">
                                        {usage.description}
                                    </p>
                                    <div className="pt-3 border-t border-gray-100">
                                        <span className="text-xs text-gray-500">
                                            Legal Basis: {usage.legalBasis}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Information Sharing with Controls */}
                    <section className="mb-12">
                        <div className="bg-gray-50 rounded-2xl p-8">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                                    <Share2 className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">
                                        Controlled Information Sharing
                                    </h2>
                                    <p className="text-gray-600">
                                        We never sell your data. Sharing occurs
                                        only under specific, controlled
                                        circumstances.
                                    </p>
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
                                    <div className="flex items-center">
                                        <AlertTriangle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
                                        <div>
                                            <p className="text-red-700 font-medium">
                                                Data Sale Prohibition: We do not
                                                and will never sell your
                                                personal information to third
                                                parties.
                                            </p>
                                            <p className="text-red-600 text-sm mt-1">
                                                This includes prohibition on
                                                renting, trading, or licensing
                                                your personal data.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
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
                                            <p className="text-gray-700 text-sm mb-4">
                                                {sharing.description}
                                            </p>

                                            {sharing.control && (
                                                <div className="mb-3">
                                                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                                                        Your Control:
                                                    </h4>
                                                    <p className="text-xs text-gray-600">
                                                        {sharing.control}
                                                    </p>
                                                </div>
                                            )}

                                            {sharing.required && (
                                                <div className="mb-3">
                                                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                                                        Required Sharing:
                                                    </h4>
                                                    <ul className="text-xs text-gray-600">
                                                        {sharing.required.map(
                                                            (item, idx) => (
                                                                <li
                                                                    key={idx}
                                                                    className="flex items-start"
                                                                >
                                                                    <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 mr-2"></div>
                                                                    {item}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </div>
                                            )}

                                            {sharing.optional && (
                                                <div className="mb-3">
                                                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                                                        Optional Sharing:
                                                    </h4>
                                                    <ul className="text-xs text-gray-600">
                                                        {sharing.optional.map(
                                                            (item, idx) => (
                                                                <li
                                                                    key={idx}
                                                                    className="flex items-start"
                                                                >
                                                                    <div className="w-1 h-1 bg-gray-400 rounded-full mt-1.5 mr-2"></div>
                                                                    {item}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </div>
                                            )}

                                            {sharing.agreements && (
                                                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                                    {sharing.agreements}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Comprehensive User Rights */}
                    <section className="mb-12">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                                <Settings className="w-8 h-8 text-blue-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Your Data Rights & Controls
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Comprehensive rights under GDPR, CCPA, and other
                                data protection regulations
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {userRights.map((right) => (
                                <div
                                    key={right.right}
                                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
                                >
                                    <div className="flex items-center mb-4">
                                        <div className="text-blue-500 mr-3">
                                            {right.icon}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {right.right}
                                        </h3>
                                    </div>
                                    <p className="text-gray-700 text-sm mb-4">
                                        {right.description}
                                    </p>

                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm">
                                            <Clock className="w-4 h-4 text-gray-400 mr-2" />
                                            <span className="text-gray-600">
                                                {right.timeline ||
                                                    right.process}
                                            </span>
                                        </div>
                                        {right.format && (
                                            <div className="flex items-center text-sm">
                                                <FileText className="w-4 h-4 text-gray-400 mr-2" />
                                                <span className="text-gray-600">
                                                    {right.format}
                                                </span>
                                            </div>
                                        )}
                                        {right.exceptions && (
                                            <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                                                {right.exceptions}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                            Exercise this right →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                How to Exercise Your Rights
                            </h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="bg-white rounded-lg p-4">
                                    <h4 className="font-bold text-gray-900 mb-2">
                                        Self-Service Portal
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        Access most rights directly through your
                                        account settings
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg p-4">
                                    <h4 className="font-bold text-gray-900 mb-2">
                                        Email Request
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        Send verified request to
                                        contact@volunteerfaster.com
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg p-4">
                                    <h4 className="font-bold text-gray-900 mb-2">
                                        Verification Process
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        ID verification required for sensitive
                                        requests
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Security Measures */}
                    <section className="mb-12">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                                    <ShieldCheck className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">
                                        Security & Protection Measures
                                    </h2>
                                    <p className="text-gray-600">
                                        Multi-layered security framework
                                        protecting your data
                                    </p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {securityMeasures.map((security) => (
                                    <div
                                        key={security.measure}
                                        className="bg-white rounded-xl p-6"
                                    >
                                        <div className="flex items-center mb-4">
                                            <div className="text-green-500 mr-3">
                                                {security.icon}
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {security.measure}
                                            </h3>
                                        </div>
                                        <p className="text-gray-700 text-sm mb-3">
                                            {security.description}
                                        </p>
                                        <div className="text-xs text-gray-500">
                                            <span className="font-medium">
                                                Scope:
                                            </span>{" "}
                                            {security.scope}
                                        </div>
                                        {security.frequency && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                <span className="font-medium">
                                                    Frequency:
                                                </span>{" "}
                                                {security.frequency}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 bg-white rounded-xl p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                    Incident Response Protocol
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                            <span className="text-red-600 font-bold text-sm">
                                                1
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">
                                                Detection & Containment
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                Automated systems detect
                                                anomalies, immediate containment
                                                measures activated
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                            <span className="text-amber-600 font-bold text-sm">
                                                2
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">
                                                Assessment & Notification
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                72-hour assessment, notification
                                                to authorities and affected
                                                users if required
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                            <span className="text-green-600 font-bold text-sm">
                                                3
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">
                                                Remediation & Prevention
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                Root cause analysis, system
                                                remediation, and preventive
                                                measures implemented
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Additional Policy Sections */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center mb-3">
                                <Cookie className="w-5 h-5 text-amber-600 mr-3" />
                                <h3 className="text-lg font-bold text-gray-900">
                                    Cookies & Tracking
                                </h3>
                            </div>
                            <p className="text-gray-700 text-sm mb-4">
                                We use essential, functional, and analytics
                                cookies. Third-party cookies are minimized and
                                disclosed.
                            </p>
                            <div className="space-y-2 text-xs text-gray-600">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    <span>
                                        Essential: Required for platform
                                        functionality
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                    <span>
                                        Functional: Remember preferences and
                                        settings
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                                    <span>
                                        Analytics: Anonymous usage statistics
                                    </span>
                                </div>
                            </div>
                            <a
                                href="/cookies"
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center mt-4"
                            >
                                Manage Cookie Preferences{" "}
                                <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center mb-3">
                                <Globe className="w-5 h-5 text-blue-600 mr-3" />
                                <h3 className="text-lg font-bold text-gray-900">
                                    International Transfers
                                </h3>
                            </div>
                            <p className="text-gray-700 text-sm mb-4">
                                Data may be transferred outside Uganda with
                                adequate protections:
                            </p>
                            <ul className="space-y-1 text-xs text-gray-600">
                                <li className="flex items-start">
                                    <Shield className="w-3 h-3 text-green-500 mr-2 mt-0.5" />
                                    <span>EU Standard Contractual Clauses</span>
                                </li>
                                <li className="flex items-start">
                                    <Shield className="w-3 h-3 text-green-500 mr-2 mt-0.5" />
                                    <span>
                                        Adequacy Decisions where applicable
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <Shield className="w-3 h-3 text-green-500 mr-2 mt-0.5" />
                                    <span>
                                        Data Protection Impact Assessments
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center mb-3">
                                <Users className="w-5 h-5 text-red-600 mr-3" />
                                <h3 className="text-lg font-bold text-gray-900">
                                    Children's Privacy
                                </h3>
                            </div>
                            <p className="text-gray-700 text-sm mb-4">
                                Services restricted to users 18+. Parental
                                consent required for 16-17 year olds in
                                compliant jurisdictions.
                            </p>
                            <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded">
                                <strong>Age Verification:</strong> Required
                                during registration. Accounts of underage users
                                terminated upon discovery.
                            </div>
                        </div>
                    </div>

                    {/* Policy Updates & Contact */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <div className="flex items-center mb-4">
                                    <RefreshCw className="w-6 h-6 text-blue-600 mr-3" />
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        Policy Updates
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-white rounded-lg p-4">
                                        <h4 className="font-bold text-gray-900 mb-2">
                                            Update Procedure
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-2">
                                            Significant changes trigger:
                                        </p>
                                        <ul className="text-xs text-gray-600 space-y-1">
                                            <li>
                                                30-day advance notice for
                                                material changes
                                            </li>
                                            <li>
                                                Email notification to all users
                                            </li>
                                            <li>
                                                In-platform banner notifications
                                            </li>
                                            <li>
                                                Version history maintained
                                                publicly
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <span className="text-sm font-semibold mr-3">
                                            Current Version:
                                        </span>
                                        <span className="font-medium">
                                            v5.3
                                        </span>
                                        <span className="mx-3">•</span>
                                        <span className="text-sm font-semibold mr-3">
                                            Effective:
                                        </span>
                                        <span className="font-medium">
                                            {lastUpdated}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center mb-4">
                                    <Mail className="w-6 h-6 text-blue-600 mr-3" />
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        Contact & Compliance
                                    </h3>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2">
                                            Privacy Team
                                        </h4>
                                        <a
                                            href="mailto:contact@volunteerfaster.com"
                                            className="text-blue-600 hover:text-blue-800 font-medium block mb-1"
                                        >
                                            contact@volunteerfaster.com
                                        </a>
                                        <p className="text-sm text-gray-600">
                                            Response within 14 business days
                                        </p>
                                    </div>
                                    <div className="bg-white rounded-lg p-4">
                                        <h4 className="font-bold text-gray-900 mb-2">
                                            Data Protection Officer
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-1">
                                            For GDPR and regulatory inquiries:
                                        </p>
                                        <a
                                            href="mailto:dpo@volunteerfaster.com"
                                            className="text-blue-600 hover:text-blue-800 text-sm"
                                        >
                                            dpo@volunteerfaster.com
                                        </a>
                                    </div>
                                    <div className="bg-white rounded-lg p-4">
                                        <h4 className="font-bold text-gray-900 mb-2">
                                            Regulatory Authority
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            Uganda Data Protection Office
                                            <br />
                                            Ministry of ICT and National
                                            Guidance
                                            <br />
                                            Kampala, Uganda
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Final Acceptance */}
                    <div className="mt-8 bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl p-8 text-white text-center">
                        <h3 className="text-2xl font-bold mb-4">
                            Acknowledgement & Acceptance
                        </h3>
                        <p className="mb-6 opacity-90 max-w-2xl mx-auto">
                            By using Volunteer Faster, you acknowledge that you
                            have read and understood this Privacy Policy,
                            including our communication monitoring practices,
                            data retention periods, and your comprehensive
                            rights.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                                <span>
                                    I understand communication monitoring for
                                    safety
                                </span>
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                                <span>
                                    I acknowledge my data rights and how to
                                    exercise them
                                </span>
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                                <span>
                                    I accept data processing as described
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </GeneralPages>
        </>
    );
}
