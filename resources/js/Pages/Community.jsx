import React from "react";
import GeneralPages from "@/Layouts/GeneralPages";
import { Head } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import {
    Shield,
    Users,
    MessageSquare,
    AlertTriangle,
    FileText,
    DollarSign,
    Award,
    Flag,
    Eye,
    Lock,
    Scale,
    Clock,
    Ban,
    AlertCircle,
    CheckCircle,
    ExternalLink,
    Trash2,
    PauseCircle,
    Globe,
    Key,
    Database,
    Server,
} from "lucide-react";

const guidelines = [
    {
        id: 1,
        title: "Identity & Verification Standards",
        icon: <Shield className="w-5 h-5" />,
        color: "bg-blue-100 text-blue-600",
        description: "Mandatory verification requirements for all users",
        category: "Mandatory",
        critical: true,
        points: [
            "Government-issued ID verification required for all volunteers and organizations",
            "No impersonation, fake accounts, or identity fraud",
            "Contact verification (email/phone) must be current and accessible",
            "Organization registration documents must be valid and verified",
            "Age verification (18+) strictly enforced with document submission",
        ],
        violations: [
            "First offense: Account suspension until verification complete",
            "Repeat offense: Permanent account termination",
            "Fraudulent documents: Immediate ban and legal reporting",
        ],
        reference: "Terms Section 3, Privacy Section 4",
    },
    {
        id: 2,
        title: "Communication & Monitoring Compliance",
        icon: <Eye className="w-5 h-5" />,
        color: "bg-indigo-100 text-indigo-600",
        description:
            "Platform communication standards and monitoring acceptance",
        category: "Mandatory",
        critical: true,
        points: [
            "All platform communications are subject to monitoring for safety and compliance",
            "No harassment, hate speech, discrimination, or abusive language",
            "Professional tone required in all interactions",
            "No off-platform coordination attempts without proper authorization",
            "Respect privacy and confidentiality of shared information",
        ],
        violations: [
            "Minor violations: Warning and mandatory training",
            "Moderate violations: 7-30 day communication suspension",
            "Severe violations: Permanent account termination",
        ],
        reference: "Privacy Section 4, Terms Section 7",
    },
    {
        id: 3,
        title: "Points System Integrity",
        icon: <Award className="w-5 h-5" />,
        color: "bg-amber-100 text-amber-600",
        description: "Proper use and protection of Points system",
        category: "Mandatory",
        points: [
            "Points are non-monetary, non-transferable recognition tokens",
            "No manipulation, fraud, or unauthorized acquisition of Points",
            "Points must be earned through legitimate platform activities",
            "No selling, trading, or external exchange of Points",
            "Points fraud results in forfeiture and account action",
        ],
        violations: [
            "Minor manipulation: Points forfeiture and warning",
            "System exploitation: Account suspension and Points reset",
            "Fraudulent activity: Permanent ban and legal reporting",
        ],
        reference: "Terms Section 7, Points System Policy",
    },
    {
        id: 4,
        title: "Project & Fundraising Integrity",
        icon: <DollarSign className="w-5 h-5" />,
        color: "bg-green-100 text-green-600",
        description: "Transparent project management and fundraising",
        category: "Mandatory",
        critical: true,
        points: [
            "All fundraising campaigns require escrow protection and verification",
            "Funds must be used exclusively for stated purposes",
            "Accurate project reporting and completion verification required",
            "No false claims or misleading project descriptions",
            "Regular updates to donors and participants mandatory",
        ],
        violations: [
            "Inaccurate reporting: Campaign suspension and investigation",
            "Fund misuse: Legal action and permanent platform ban",
            "Fraudulent campaigns: Immediate termination and financial recovery",
        ],
        reference: "Terms Section 14, Fundraising Policy",
    },
    {
        id: 5,
        title: "Safety & Risk Management",
        icon: <AlertTriangle className="w-5 h-5" />,
        color: "bg-red-100 text-red-600",
        description: "Safety protocols and risk prevention",
        category: "Mandatory",
        critical: true,
        points: [
            "No unsafe activities or project postings violating local safety laws",
            "Incident reporting within 24 hours mandatory",
            "Organization safety verification required before participation",
            "Background checks mandatory for sensitive roles",
            "Insurance verification recommended for high-risk activities",
        ],
        violations: [
            "Safety violation: Immediate project suspension",
            "Failure to report: Account suspension and training",
            "Willful endangerment: Permanent ban and legal reporting",
        ],
        reference: "Volunteer Guide Section 3, Safety Protocols",
    },
    {
        id: 6,
        title: "Data & Privacy Protection",
        icon: <Lock className="w-5 h-5" />,
        color: "bg-purple-100 text-purple-600",
        description: "Data handling and privacy compliance",
        category: "Mandatory",
        points: [
            "No unauthorized data collection or sharing",
            "GDPR and local data protection law compliance required",
            "Respect user privacy and data minimization principles",
            "No scraping, crawling, or unauthorized data access",
            "Data breach reporting within 72 hours mandatory",
        ],
        violations: [
            "Privacy violation: Account restriction and investigation",
            "Data misuse: Legal action and platform termination",
            "Breach non-reporting: Regulatory fines and permanent ban",
        ],
        reference: "Privacy Policy, GDPR Compliance",
    },
    {
        id: 7,
        title: "Content & Intellectual Property",
        icon: <FileText className="w-5 h-5" />,
        color: "bg-gray-100 text-gray-600",
        description: "Appropriate content and IP rights",
        category: "Mandatory",
        points: [
            "No illegal, offensive, or inappropriate content",
            "Respect intellectual property rights and copyrights",
            "No spam, unsolicited promotions, or commercial solicitation",
            "Accurate representation of skills and qualifications",
            "Platform content licenses must be respected",
        ],
        violations: [
            "Inappropriate content: Content removal and warning",
            "IP violation: Legal action and account suspension",
            "Spam/abuse: Communication restrictions or account termination",
        ],
        reference: "Terms Section 8, Content Policy",
    },
    {
        id: 8,
        title: "Dispute Resolution Compliance",
        icon: <Scale className="w-5 h-5" />,
        color: "bg-cyan-100 text-cyan-600",
        description: "Proper use of dispute resolution mechanisms",
        category: "Mandatory",
        points: [
            "Follow four-step dispute resolution process",
            "No harassment or retaliation during disputes",
            "Ugandan jurisdiction acceptance for legal proceedings",
            "Mediation and arbitration participation when required",
            "Respect final dispute resolutions and decisions",
        ],
        violations: [
            "Process violation: Dispute disadvantage and warning",
            "Retaliation: Account suspension and dispute forfeiture",
            "Jurisdiction challenge: Platform access restriction",
        ],
        reference: "Terms Section 10, Dispute Resolution Policy",
    },
];

const enforcementLevels = [
    {
        level: "Warning & Education",
        icon: <AlertCircle className="w-5 h-5" />,
        color: "bg-blue-100 text-blue-600",
        actions: [
            "Formal written warning",
            "Mandatory policy training completion",
            "Temporary feature restrictions (7 days)",
            "Public/private note on account",
        ],
        triggers: "First-time minor violations, unintentional non-compliance",
        duration: "7-14 days",
        appeal: "Yes, within 7 days",
    },
    {
        level: "Suspension & Restrictions",
        icon: <PauseCircle className="w-5 h-5" />,
        color: "bg-amber-100 text-amber-600",
        actions: [
            "Account suspension (30-90 days)",
            "Points freeze and transaction hold",
            "Communication ban and project pause",
            "Escrow fund hold for ongoing projects",
        ],
        triggers: "Repeat violations, moderate non-compliance, safety concerns",
        duration: "30-90 days",
        appeal: "Yes, within 14 days via formal process",
    },
    {
        level: "Termination & Legal Action",
        icon: <Ban className="w-5 h-5" />,
        color: "bg-red-100 text-red-600",
        actions: [
            "Permanent account termination",
            "Points forfeiture and financial hold",
            "Legal reporting to authorities",
            "Platform-wide ban with device/IP tracking",
            "Public disclosure for severe violations",
        ],
        triggers:
            "Severe violations, fraud, safety endangerment, repeated non-compliance",
        duration: "Permanent",
        appeal: "Limited to legal challenge per Terms Section 13",
    },
];

const reportingCategories = [
    {
        category: "Emergency Safety",
        description: "Immediate physical safety concerns",
        icon: <AlertTriangle className="w-5 h-5" />,
        response: "Within 1 hour",
        contact: "Platform emergency line + local authorities",
        priority: "Highest",
    },
    {
        category: "Policy Violations",
        description: "Guideline breaches and non-compliance",
        icon: <Flag className="w-5 h-5" />,
        response: "24-48 hours",
        contact: "Platform moderation team",
        priority: "High",
    },
    {
        category: "Fraud & Scams",
        description: "Financial fraud or deceptive practices",
        icon: <DollarSign className="w-5 h-5" />,
        response: "24 hours",
        contact: "Compliance and legal team",
        priority: "High",
    },
    {
        category: "Communication Issues",
        description: "Harassment or inappropriate communication",
        icon: <MessageSquare className="w-5 h-5" />,
        response: "48 hours",
        contact: "Community moderation team",
        priority: "Medium",
    },
    {
        category: "Technical & Data",
        description: "Data breaches or technical violations",
        icon: <Database className="w-5 h-5" />,
        response: "72 hours",
        contact: "Data Protection Officer",
        priority: "Medium",
    },
    {
        category: "General Concerns",
        description: "Other guideline concerns",
        icon: <Users className="w-5 h-5" />,
        response: "5 business days",
        contact: "Community support team",
        priority: "Standard",
    },
];

const appealProcess = [
    {
        step: "1. Review & Grounds",
        description:
            "Valid appeal grounds: factual errors, disproportionate response, new evidence",
        timeline: "7-14 days from enforcement",
        requirement: "Written appeal with evidence",
    },
    {
        step: "2. Investigation",
        description:
            "Independent review by compliance team, communication review, evidence verification",
        timeline: "14-30 days",
        requirement: "Cooperation with investigation",
    },
    {
        step: "3. Decision & Notification",
        description:
            "Written decision with justification, enforcement modification if warranted",
        timeline: "48 hours post-investigation",
        requirement: "Acceptance of final decision",
    },
    {
        step: "4. Legal Recourse",
        description:
            "Binding arbitration in Uganda per Terms Section 13 for unresolved disputes",
        timeline: "60 days from appeal denial",
        requirement: "Legal representation recommended",
    },
];

export default function Community({ auth }) {
    const lastUpdated = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    const currentUrl =
        typeof window !== "undefined" ? window.location.href : appUrl;

    const pageTitle =
        "Community Guidelines & Compliance Standards | Volunteer Faster";
    const pageDescription =
        "Comprehensive community guidelines including mandatory verification, communication monitoring, Points system rules, and enforcement procedures for Volunteer Faster.";
    const pageKeywords =
        "community guidelines, compliance standards, enforcement procedures, Points system rules, communication monitoring, volunteer conduct";

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
                <meta
                    property="og:image"
                    content={`${appUrl}/images/community-guidelines-preview.jpg`}
                />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta
                    property="og:image:alt"
                    content="Community Guidelines - Volunteer Faster"
                />
                <meta property="og:site_name" content="Volunteer Faster" />
                <meta property="og:locale" content="en_US" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={currentUrl} />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
                <meta
                    name="twitter:image"
                    content={`${appUrl}/images/community-guidelines-preview.jpg`}
                />
                <meta name="twitter:site" content="@volunteerfaster" />
                <meta name="twitter:creator" content="@volunteerfaster" />
                <meta
                    name="twitter:image:alt"
                    content="Community Guidelines - Volunteer Faster"
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
                                    name: "Community Guidelines",
                                    item: currentUrl,
                                },
                            ],
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
                            articleSection: "Community Standards",
                        },
                        about: {
                            "@type": "Thing",
                            name: "Community Guidelines",
                        },
                    })}
                </script>
            </Head>

            <GeneralPages auth={auth} title="Community Guidelines">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl mb-6">
                            <Shield className="w-10 h-10 text-blue-600" />
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
                            <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                                v3.1 - Enhanced Compliance
                            </span>
                            <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                Updated: {lastUpdated}
                            </span>
                            <span className="text-sm font-semibold text-red-600 bg-red-100 px-3 py-1 rounded-full">
                                Mandatory Requirements
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Community Guidelines & Compliance Standards
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Comprehensive standards for safe, compliant, and
                            productive volunteering on{" "}
                            <span className="font-bold text-blue-600">
                                Volunteer Faster
                            </span>
                            . Includes mandatory verification, communication
                            monitoring, and detailed enforcement procedures.
                        </p>
                    </div>

                    {/* Critical Notice */}
                    <div className="bg-gradient-to-r from-red-50 to-amber-50 border-l-4 border-red-500 rounded-r-xl p-6 mb-10">
                        <div className="flex items-start">
                            <AlertTriangle className="w-6 h-6 text-red-600 mt-1 mr-4 flex-shrink-0" />
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Mandatory Compliance Notice
                                </h2>
                                <p className="text-gray-700 mb-3">
                                    All users must accept and comply with these
                                    guidelines. Violations result in enforcement
                                    actions including warnings, suspensions, or
                                    permanent bans. Critical requirements
                                    include identity verification and acceptance
                                    of communication monitoring.
                                </p>
                                <div className="bg-white rounded-lg p-4">
                                    <p className="text-sm text-gray-700">
                                        <strong>
                                            By using Volunteer Faster, you
                                            acknowledge:
                                        </strong>{" "}
                                        Identity verification requirements,
                                        communication monitoring acceptance,
                                        Points system limitations, and Ugandan
                                        jurisdiction for disputes.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Essential Policy Links */}
                    <div className="grid md:grid-cols-4 gap-4 mb-12">
                        <a
                            href="/terms"
                            className="bg-white rounded-xl border border-blue-200 p-4 text-center hover:shadow-lg transition-shadow"
                        >
                            <div className="flex flex-col items-center">
                                <FileText className="w-6 h-6 text-blue-600 mb-2" />
                                <span className="text-sm font-medium text-gray-900">
                                    Terms & Conditions
                                </span>
                            </div>
                        </a>
                        <a
                            href="/privacy"
                            className="bg-white rounded-xl border border-indigo-200 p-4 text-center hover:shadow-lg transition-shadow"
                        >
                            <div className="flex flex-col items-center">
                                <Eye className="w-6 h-6 text-indigo-600 mb-2" />
                                <span className="text-sm font-medium text-gray-900">
                                    Privacy Policy
                                </span>
                            </div>
                        </a>
                        <a
                            href="/gdpr"
                            className="bg-white rounded-xl border border-purple-200 p-4 text-center hover:shadow-lg transition-shadow"
                        >
                            <div className="flex flex-col items-center">
                                <Shield className="w-6 h-6 text-purple-600 mb-2" />
                                <span className="text-sm font-medium text-gray-900">
                                    GDPR Compliance
                                </span>
                            </div>
                        </a>
                        <a
                            href="/cookies"
                            className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-lg transition-shadow"
                        >
                            <div className="flex flex-col items-center">
                                <CookieIcon className="w-6 h-6 text-gray-600 mb-2" />
                                <span className="text-sm font-medium text-gray-900">
                                    Cookie Policy
                                </span>
                            </div>
                        </a>
                    </div>

                    {/* Main Guidelines */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
                            Comprehensive Guidelines
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            {guidelines.map((guideline) => (
                                <div
                                    key={guideline.id}
                                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center">
                                            <div
                                                className={`${guideline.color} w-10 h-10 rounded-lg flex items-center justify-center mr-4`}
                                            >
                                                {guideline.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">
                                                    {guideline.title}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span
                                                        className={`text-xs font-semibold px-2 py-1 rounded ${
                                                            guideline.critical
                                                                ? "bg-red-100 text-red-600"
                                                                : "bg-blue-100 text-blue-600"
                                                        }`}
                                                    >
                                                        {guideline.category}
                                                    </span>
                                                    {guideline.critical && (
                                                        <span className="text-xs font-semibold bg-red-100 text-red-600 px-2 py-1 rounded">
                                                            Critical
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-gray-700 text-sm mb-4">
                                        {guideline.description}
                                    </p>

                                    <div className="mb-4">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                                            Requirements:
                                        </h4>
                                        <ul className="space-y-2">
                                            {guideline.points.map(
                                                (point, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-start"
                                                    >
                                                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                        <span className="text-gray-700 text-sm">
                                                            {point}
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>

                                    <div className="mb-4">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                                            Violation Consequences:
                                        </h4>
                                        <ul className="space-y-1">
                                            {guideline.violations.map(
                                                (violation, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-start"
                                                    >
                                                        <AlertTriangle className="w-3 h-3 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                                                        <span className="text-gray-700 text-xs">
                                                            {violation}
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">
                                                Reference:
                                            </span>
                                            <a
                                                href={`/${guideline.reference
                                                    .split(" ")[0]
                                                    .toLowerCase()}`}
                                                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                {guideline.reference}{" "}
                                                <ExternalLink className="w-3 h-3 ml-1 inline" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Enforcement Framework */}
                    <section className="mb-16">
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                                    <Scale className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">
                                        Enforcement Framework
                                    </h2>
                                    <p className="text-gray-600">
                                        Progressive enforcement actions based on
                                        violation severity
                                    </p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                {enforcementLevels.map((level) => (
                                    <div
                                        key={level.level}
                                        className="bg-white rounded-xl border border-gray-200 p-6"
                                    >
                                        <div className="flex items-center mb-4">
                                            <div
                                                className={`${level.color} w-10 h-10 rounded-lg flex items-center justify-center mr-4`}
                                            >
                                                {level.icon}
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {level.level}
                                            </h3>
                                        </div>

                                        <div className="mb-4">
                                            <h4 className="text-sm font-semibold text-gray-900 mb-2">
                                                Actions:
                                            </h4>
                                            <ul className="space-y-1">
                                                {level.actions.map(
                                                    (action, idx) => (
                                                        <li
                                                            key={idx}
                                                            className="flex items-start"
                                                        >
                                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2"></div>
                                                            <span className="text-gray-700 text-sm">
                                                                {action}
                                                            </span>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500">
                                                    Triggers:
                                                </span>
                                                <span className="text-xs font-medium text-gray-700">
                                                    {level.triggers}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500">
                                                    Duration:
                                                </span>
                                                <span className="text-xs font-medium text-gray-700">
                                                    {level.duration}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500">
                                                    Appeal:
                                                </span>
                                                <span
                                                    className={`text-xs font-medium ${
                                                        level.appeal.startsWith(
                                                            "Yes"
                                                        )
                                                            ? "text-green-600"
                                                            : "text-red-600"
                                                    }`}
                                                >
                                                    {level.appeal}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Reporting & Response */}
                    <section className="mb-16">
                        <div className="bg-white rounded-2xl border border-gray-200 p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                Reporting & Response System
                            </h2>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {reportingCategories.map((category) => (
                                    <div
                                        key={category.category}
                                        className="bg-gray-50 rounded-xl p-6"
                                    >
                                        <div className="flex items-center mb-3">
                                            <div className="text-blue-500 mr-3">
                                                {category.icon}
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {category.category}
                                            </h3>
                                        </div>
                                        <p className="text-gray-700 text-sm mb-3">
                                            {category.description}
                                        </p>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500">
                                                    Response Time:
                                                </span>
                                                <span className="text-xs font-medium text-blue-600">
                                                    {category.response}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500">
                                                    Contact:
                                                </span>
                                                <span className="text-xs font-medium text-gray-700">
                                                    {category.contact}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500">
                                                    Priority:
                                                </span>
                                                <span
                                                    className={`text-xs font-medium px-2 py-1 rounded ${
                                                        category.priority ===
                                                        "Highest"
                                                            ? "bg-red-100 text-red-700"
                                                            : category.priority ===
                                                              "High"
                                                            ? "bg-amber-100 text-amber-700"
                                                            : "bg-blue-100 text-blue-700"
                                                    }`}
                                                >
                                                    {category.priority}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-blue-50 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">
                                    Reporting Requirements
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li className="flex items-start">
                                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                                        <span>
                                            Include specific guideline violation
                                            references
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                                        <span>
                                            Provide evidence (screenshots,
                                            messages, documents)
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                                        <span>
                                            Specify incident date, time, and
                                            involved parties
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                                        <span>
                                            Emergency situations: Contact local
                                            authorities first
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Appeal Process */}
                    <section className="mb-16">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                                    <Scale className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">
                                        Appeal Process
                                    </h2>
                                    <p className="text-gray-600">
                                        Fair and transparent appeal procedures
                                        for enforcement actions
                                    </p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {appealProcess.map((step) => (
                                    <div
                                        key={step.step}
                                        className="bg-white rounded-xl p-6"
                                    >
                                        <div className="flex items-center mb-3">
                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                                <span className="text-blue-600 font-bold">
                                                    {step.step.split(".")[0]}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {step.step.split(" ")[1]}
                                            </h3>
                                        </div>
                                        <p className="text-gray-700 text-sm mb-3">
                                            {step.description}
                                        </p>
                                        <div className="space-y-2">
                                            <div className="flex items-center text-xs text-gray-500">
                                                <Clock className="w-3 h-3 mr-2" />
                                                Timeline: {step.timeline}
                                            </div>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <FileText className="w-3 h-3 mr-2" />
                                                Requirement: {step.requirement}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 bg-white rounded-xl p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">
                                    Appeal Limitations
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li className="flex items-start">
                                        <AlertTriangle className="w-4 h-4 text-amber-500 mr-2 mt-0.5" />
                                        <span>
                                            No appeals for fraudulent identity
                                            verification attempts
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <AlertTriangle className="w-4 h-4 text-amber-500 mr-2 mt-0.5" />
                                        <span>
                                            Legal jurisdiction challenges not
                                            permitted
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <AlertTriangle className="w-4 h-4 text-amber-500 mr-2 mt-0.5" />
                                        <span>
                                            Points forfeiture appeals limited to
                                            technical errors only
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <AlertTriangle className="w-4 h-4 text-amber-500 mr-2 mt-0.5" />
                                        <span>
                                            Final arbitration decisions binding
                                            per Terms Section 13
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Final Compliance Declaration */}
                    <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-8 text-white text-center">
                        <h3 className="text-2xl font-bold mb-4">
                            Compliance Declaration
                        </h3>
                        <p className="mb-6 opacity-90 max-w-2xl mx-auto">
                            By participating in Volunteer Faster, you
                            acknowledge and agree to all community guidelines,
                            enforcement procedures, and platform policies.
                            Non-compliance results in appropriate enforcement
                            actions.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                                <span>Identity Verification Required</span>
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                                <span>Communication Monitoring Accepted</span>
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                                <span>
                                    Points System Limitations Understood
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Contact & Support */}
                    <div className="text-center border-t border-gray-200 pt-10 mt-12">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            Need to Report or Appeal?
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                            Use appropriate channels based on issue category and
                            urgency. Emergency safety concerns require immediate
                            local authority contact.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href={route("contact")}
                                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Flag className="w-4 h-4 mr-2" /> Report a
                                Violation
                            </a>
                            <a
                                href="mailto:compliance@volunteerfaster.com"
                                className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
                            >
                                <Scale className="w-4 h-4 mr-2" /> Appeal
                                Enforcement
                            </a>
                            <a
                                href="mailto:dpo@volunteerfaster.com"
                                className="inline-flex items-center justify-center px-6 py-3 bg-white text-purple-600 font-medium rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors"
                            >
                                <Shield className="w-4 h-4 mr-2" /> Data
                                Protection Officer
                            </a>
                        </div>
                        <p className="text-sm text-gray-500 mt-4">
                            For legal disputes, follow the resolution process in
                            Terms Section 13. Ugandan courts have exclusive
                            jurisdiction.
                        </p>
                    </div>
                </div>
            </GeneralPages>
        </>
    );
}

// Cookie icon component
const CookieIcon = ({ className }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
    </svg>
);
