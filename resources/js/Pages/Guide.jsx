import GeneralPages from "@/Layouts/GeneralPages";
import { Head } from "@inertiajs/react";
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
    Shield,
    AlertTriangle,
    FileText,
    Lock,
    Eye,
    TrendingUp,
    Star,
    Heart,
    GraduationCap,
    Briefcase,
    Globe,
    Zap,
    RefreshCw,
    ExternalLink,
    CreditCard,
    Handshake,
    Scale,
} from "lucide-react";
import { CookieIcon } from "lucide-react";

const guideSections = [
    {
        id: 1,
        title: "Getting Started & Verification",
        icon: <Compass className="w-6 h-6" />,
        color: "bg-blue-100 text-blue-600",
        description:
            "Complete onboarding and verification for secure volunteering",
        points: [
            {
                title: "Account Creation & Verification",
                description:
                    "Complete profile with verified identity documents. Mandatory for safety and Points eligibility",
                icon: <Shield className="w-4 h-4" />,
                duration: "15-30 minutes",
                required: "Government ID, Age proof, Contact verification",
            },
            {
                title: "Skill Assessment & Certification",
                description:
                    "Complete skill verification tests for specialized roles. Increases matching success by 40%",
                icon: <GraduationCap className="w-4 h-4" />,
                duration: "30-60 minutes",
                optional: "Recommended for premium opportunities",
            },
            {
                title: "Privacy & Communication Setup",
                description:
                    "Configure privacy settings and communication preferences. Required for platform messaging",
                icon: <Eye className="w-4 h-4" />,
                duration: "10 minutes",
                important: "Review communication monitoring policy",
            },
        ],
    },
    {
        id: 2,
        title: "Finding & Applying for Opportunities",
        icon: <Target className="w-6 h-6" />,
        color: "bg-purple-100 text-purple-600",
        description:
            "Smart strategies for maximizing opportunity matches and applications",
        points: [
            {
                title: "Advanced Search & Filtering",
                description:
                    "Use AI-powered matching with location, skills, and Points requirements",
                icon: <Zap className="w-4 h-4" />,
                tip: "Enable notifications for matching opportunities",
            },
            {
                title: "Application Best Practices",
                description:
                    "Customize applications with verified skills and completion rates",
                icon: <Briefcase className="w-4 h-4" />,
                tip: "Applications with video introductions get 60% more responses",
            },
            {
                title: "Points & Funding Strategy",
                description:
                    "Understand Points requirements and fundraising options for paid projects",
                icon: <CreditCard className="w-4 h-4" />,
                tip: "Start earning Points early through referrals and smaller projects",
            },
        ],
    },
    {
        id: 3,
        title: "Expectations, Safety & Compliance",
        icon: <Shield className="w-6 h-6" />,
        color: "bg-red-100 text-red-600",
        critical: true,
        description:
            "Mandatory requirements and safety protocols for all volunteers",
        points: [
            "All volunteers must accept Terms & Conditions and Privacy Policy before participation",
            "Communication monitoring applies to all platform messages for safety and compliance",
            "Zero tolerance for harassment, discrimination, or policy violations",
            "Incident reporting required within 24 hours of any safety concern",
            "Organization verification mandatory before in-person volunteering",
            "Background checks required for sensitive roles (youth, vulnerable populations)",
            "Insurance verification recommended for high-risk activities",
        ],
    },
    {
        id: 4,
        title: "Project Execution & Completion",
        icon: <BookOpen className="w-6 h-6" />,
        color: "bg-green-100 text-green-600",
        description:
            "From acceptance to successful completion and Points earning",
        points: [
            {
                title: "Pre-Project Requirements",
                description:
                    "Complete orientation, sign project-specific agreements, safety training",
                icon: <FileText className="w-4 h-4" />,
                mandatory: "Required before project start",
            },
            {
                title: "Performance & Communication",
                description:
                    "Maintain regular updates, adhere to Completion Criteria, use platform communications",
                icon: <MessageSquare className="w-4 h-4" />,
                note: "All communications subject to monitoring",
            },
            {
                title: "Completion & Verification",
                description:
                    "Submit completion evidence, await Organization verification, earn Points",
                icon: <CheckCircle className="w-4 h-4" />,
                timeline: "Points awarded after 7-day verification period",
            },
        ],
    },
    {
        id: 5,
        title: "Points System & Rewards",
        icon: <TrendingUp className="w-6 h-6" />,
        color: "bg-amber-100 text-amber-600",
        description: "Maximize your Points earnings and redemption strategy",
        points: [
            {
                title: "Points Earning Methods",
                description:
                    "Project completion (1 Day = 1 Point), Referrals (20 Points), Platform contributions",
                icon: <Star className="w-4 h-4" />,
                max: "10,000 Points monthly limit",
            },
            {
                title: "Points Redemption",
                description:
                    "Pay for premium projects, access exclusive features, verified badges",
                icon: <Award className="w-4 h-4" />,
                note: "Points have no cash value, non-transferable",
            },
            {
                title: "Points Protection",
                description:
                    "Fraud prevention, 24-month expiration, dispute resolution process",
                icon: <Lock className="w-4 h-4" />,
                important: "Points subject to Terms & Conditions",
            },
        ],
    },
    {
        id: 6,
        title: "Career Development & Recognition",
        icon: <Heart className="w-6 h-6" />,
        color: "bg-pink-100 text-pink-600",
        description:
            "Leverage volunteering for professional growth and recognition",
        points: [
            {
                title: "Digital Certificates & Badges",
                description:
                    "Automated certificates with QR verification, skill badges for verified expertise",
                icon: <Award className="w-4 h-4" />,
                feature: "LinkedIn integration available",
            },
            {
                title: "Portfolio Development",
                description:
                    "Build comprehensive portfolio with project details, feedback, and metrics",
                icon: <Briefcase className="w-4 h-4" />,
                tip: "Download complete volunteer history",
            },
            {
                title: "Career Advancement",
                description:
                    "Volunteering as experience, references from organizations, networking opportunities",
                icon: <Users className="w-4 h-4" />,
                benefit: "Platform recommendation system",
            },
        ],
    },
];

const safetyProtocols = [
    {
        protocol: "Identity Verification",
        description:
            "Mandatory for all volunteers. Verified accounts receive trust badges",
        icon: <Shield className="w-5 h-5" />,
        requirement: "Required before application submission",
    },
    {
        protocol: "Communication Monitoring",
        description:
            "All platform communications monitored for safety and policy compliance",
        icon: <Eye className="w-5 h-5" />,
        scope: "Messages, project discussions, dispute communications",
    },
    {
        protocol: "Incident Reporting",
        description:
            "24-hour reporting requirement for safety concerns or policy violations",
        icon: <AlertTriangle className="w-5 h-5" />,
        process: "Anonymous reporting available",
    },
    {
        protocol: "Dispute Resolution",
        description:
            "Four-step process: Direct resolution → Platform mediation → Arbitration → Legal",
        icon: <Scale className="w-5 h-5" />,
        jurisdiction: "Ugandan courts for legal proceedings",
    },
];

const faqs = [
    {
        question: "What verification documents are required?",
        answer: "Government-issued photo ID, proof of age (18+), and contact verification. Additional documents may be required for specialized roles or high-risk activities. All documents encrypted and stored per Privacy Policy.",
        icon: <Shield className="w-5 h-5" />,
        category: "Safety & Verification",
    },
    {
        question: "How does communication monitoring work?",
        answer: "Platform communications are monitored through automated scanning and manual review for safety, fraud prevention, and policy compliance. Users are notified of reviews except in safety emergencies. See Privacy Policy Section 4 for details.",
        icon: <Eye className="w-5 h-5" />,
        category: "Privacy & Monitoring",
    },
    {
        question: "Are Points really free money?",
        answer: "NO. Points are a non-monetary recognition system with no cash value. They cannot be exchanged for money, transferred, or withdrawn. Points are subject to Terms & Conditions Section 7 and may be revoked for violations.",
        icon: <CreditCard className="w-5 h-5" />,
        category: "Points System",
    },
    {
        question: "What happens if a project dispute occurs?",
        answer: "Follow our four-step resolution process: 1) Direct negotiation (14 days), 2) Platform mediation, 3) Binding arbitration in Uganda, 4) Legal action if necessary. All disputes governed by Ugandan law per Terms Section 13.",
        icon: <Scale className="w-5 h-5" />,
        category: "Disputes & Resolution",
    },
    {
        question: "Can I volunteer internationally?",
        answer: "Yes, but additional requirements apply: Visa verification, international background checks, and compliance with local regulations. Some countries have specific restrictions for foreign volunteers.",
        icon: <Globe className="w-5 h-5" />,
        category: "International Volunteering",
    },
    {
        question: "How are fundraising campaigns protected?",
        answer: "All funds held in escrow until project verification. 6% platform fee for oversight. Donors receive refunds if projects cancel. Campaigns must comply with local financial regulations. See Terms Section 14 for details.",
        icon: <Handshake className="w-5 h-5" />,
        category: "Fundraising & Finance",
    },
    {
        question: "What insurance protections exist?",
        answer: "Organizations must maintain appropriate insurance. Volunteers should verify coverage before high-risk activities. Platform provides liability disclaimers but recommends personal insurance for specialized volunteering.",
        icon: <AlertTriangle className="w-5 h-5" />,
        category: "Safety & Insurance",
    },
    {
        question: "How long is volunteer data retained?",
        answer: "Data retained per Privacy Policy categories: Identity data (3 years after closure), Performance data (5 years), Financial data (7 years), Communication data (2 years active, 90 days after closure).",
        icon: <FileText className="w-5 h-5" />,
        category: "Data & Privacy",
    },
];

const legalReferences = [
    {
        document: "Terms & Conditions",
        description: "Complete legal agreement governing platform use",
        icon: <FileText className="w-5 h-5" />,
        sections: [
            "Section 7: Points System",
            "Section 13: Dispute Resolution",
            "Section 14: Fundraising",
        ],
    },
    {
        document: "Privacy Policy",
        description: "Data protection and communication monitoring details",
        icon: <Eye className="w-5 h-5" />,
        sections: [
            "Section 4: Communication Monitoring",
            "Section 6: Data Retention",
            "Section 8: Your Rights",
        ],
    },
    {
        document: "GDPR Compliance",
        description: "EU data protection rights and compliance framework",
        icon: <Shield className="w-5 h-5" />,
        sections: [
            "Legal Basis for Processing",
            "International Transfers",
            "Data Subject Rights",
        ],
    },
    {
        document: "Cookie Policy",
        description: "Tracking technologies and consent management",
        icon: <CookieIcon className="w-5 h-5" />,
        sections: [
            "Cookie Categories",
            "Third-Party Services",
            "Consent Management",
        ],
    },
];

const riskManagement = [
    {
        risk: "Project Non-Completion",
        mitigation:
            "Clear Completion Criteria, Organization verification, Points protection",
        icon: <CheckCircle className="w-5 h-5" />,
        reference: "Terms Section 5",
    },
    {
        risk: "Safety Incidents",
        mitigation:
            "Organization verification, Insurance checks, Incident reporting system",
        icon: <AlertTriangle className="w-5 h-5" />,
        reference: "Guide Section 3",
    },
    {
        risk: "Payment/Fundraising Issues",
        mitigation: "Escrow accounts, Donor protections, Platform oversight",
        icon: <CreditCard className="w-5 h-5" />,
        reference: "Terms Section 14",
    },
    {
        risk: "Data Privacy Concerns",
        mitigation: "GDPR compliance, Data encryption, User control rights",
        icon: <Lock className="w-5 h-5" />,
        reference: "Privacy Policy",
    },
];

export default function Guide({ auth }) {
    const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    const currentUrl =
        typeof window !== "undefined" ? window.location.href : appUrl;

    const pageTitle = "Volunteer Success & Safety Guide | Volunteer Faster";
    const pageDescription =
        "Comprehensive guide to successful, safe, and compliant volunteering with detailed safety protocols, Points system, legal requirements, and risk management.";
    const pageKeywords =
        "volunteer guide, volunteering safety, volunteer compliance, Points system, communication monitoring, volunteer verification, dispute resolution";

    // Cookie icon component
    // const CookieIcon = ({ className }) => (
    //     <svg
    //         className={className}
    //         fill="none"
    //         stroke="currentColor"
    //         viewBox="0 0 24 24"
    //         xmlns="http://www.w3.org/2000/svg"
    //     >
    //         <path
    //             strokeLinecap="round"
    //             strokeLinejoin="round"
    //             strokeWidth={2}
    //             d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    //         />
    //     </svg>
    // );

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
                    content="Volunteer Success Guide - Volunteer Faster"
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
                    content="Volunteer Success Guide - Volunteer Faster"
                />

                <link rel="canonical" href={currentUrl} />

                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "HowTo",
                        name: pageTitle,
                        description: pageDescription,
                        url: currentUrl,
                        totalTime: "PT30M",
                        estimatedCost: {
                            "@type": "MonetaryAmount",
                            currency: "USD",
                            value: "0",
                        },
                        step: [
                            {
                                "@type": "HowToStep",
                                name: "Complete Identity Verification",
                                text: "Submit government ID and contact verification for platform access",
                                url: `${appUrl}/verification`,
                            },
                            {
                                "@type": "HowToStep",
                                name: "Review Safety Protocols",
                                text: "Understand communication monitoring and safety requirements",
                                url: `${currentUrl}#safety`,
                            },
                            {
                                "@type": "HowToStep",
                                name: "Accept Terms & Conditions",
                                text: "Review and accept all platform policies before volunteering",
                                url: `${appUrl}/terms-and-conditions`,
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
                    {/* Hero Section with Critical Notice */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl mb-6">
                            <Shield className="w-10 h-10 text-blue-600" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Volunteer Success & Safety Guide
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
                            Comprehensive guide to meaningful, safe, and
                            compliant volunteering with{" "}
                            <span className="font-bold text-blue-600">
                                Volunteer Faster
                            </span>
                            . Includes mandatory safety protocols, Points system
                            details, and legal compliance requirements.
                        </p>

                        {/* Critical Safety Notice */}
                        <div className="bg-gradient-to-r from-red-50 to-amber-50 border-l-4 border-red-500 rounded-r-xl p-4 mb-6 max-w-3xl mx-auto">
                            <div className="flex items-start">
                                <AlertTriangle className="w-6 h-6 text-red-600 mt-1 mr-4 flex-shrink-0" />
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                                        Mandatory Requirements
                                    </h3>
                                    <p className="text-gray-700 text-sm">
                                        Identity verification, Terms &
                                        Conditions acceptance, and communication
                                        monitoring are required for all
                                        volunteers. Review Section 3 before
                                        applying.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
                                <Shield className="w-4 h-4 mr-1" /> Safety First
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-700">
                                <AlertTriangle className="w-4 h-4 mr-1" /> Legal
                                Compliance
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                                <CheckCircle className="w-4 h-4 mr-1" />{" "}
                                Step-by-step
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700">
                                <Award className="w-4 h-4 mr-1" /> Points System
                            </span>
                        </div>
                    </div>

                    {/* Quick Start Banner with Legal Links */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-12">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div className="mb-4 md:mb-0">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Ready to Volunteer Safely?
                                </h2>
                                <p className="text-gray-700">
                                    Complete verification and review essential
                                    policies before starting.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <a
                                    href="/terms-and-conditions"
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <FileText className="w-4 h-4 mr-2" /> Terms
                                    & Conditions
                                </a>
                                <a
                                    href="/privacy"
                                    className="inline-flex items-center px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
                                >
                                    <Eye className="w-4 h-4 mr-2" /> Privacy
                                    Policy
                                </a>
                                <a
                                    href="/gdpr"
                                    className="inline-flex items-center px-4 py-2 bg-white text-purple-600 text-sm font-medium rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors"
                                >
                                    <Shield className="w-4 h-4 mr-2" /> GDPR
                                    Compliance
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Safety Protocols Section */}
                    <section id="safety" className="mb-16">
                        <div className="flex items-center mb-8">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                                <Shield className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">
                                    Mandatory Safety Protocols
                                </h2>
                                <p className="text-gray-600">
                                    Required for all volunteers before
                                    participation
                                </p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {safetyProtocols.map((protocol) => (
                                <div
                                    key={protocol.protocol}
                                    className="bg-white rounded-xl border border-gray-200 p-6"
                                >
                                    <div className="flex items-center mb-3">
                                        <div className="text-red-500 mr-3">
                                            {protocol.icon}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {protocol.protocol}
                                        </h3>
                                    </div>
                                    <p className="text-gray-700 text-sm mb-3">
                                        {protocol.description}
                                    </p>
                                    <div className="pt-3 border-t border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">
                                                Requirement:
                                            </span>
                                            <span className="text-xs font-medium text-red-600">
                                                {protocol.requirement}
                                            </span>
                                        </div>
                                        <div className="mt-1">
                                            <span className="text-xs text-gray-500">
                                                Scope:
                                            </span>
                                            <span className="text-xs font-medium text-gray-700 ml-2">
                                                {protocol.scope ||
                                                    "All volunteers"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-red-50 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">
                                Critical Compliance Notes
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start">
                                    <AlertTriangle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>
                                        Identity verification failure results in
                                        account suspension
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <AlertTriangle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>
                                        Communication policy violations may lead
                                        to permanent account termination
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <AlertTriangle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>
                                        Failure to report safety incidents may
                                        affect future volunteering eligibility
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <AlertTriangle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>
                                        Dispute resolution process is mandatory
                                        for all platform conflicts
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Main Guide Sections */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
                            Complete Volunteering Roadmap
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
                                        <div className="flex-1">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                                                <div className="flex items-center mb-2 md:mb-0">
                                                    <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full mr-3">
                                                        Step {index + 1}
                                                    </span>
                                                    <h3 className="text-2xl font-bold text-gray-900">
                                                        {section.title}
                                                    </h3>
                                                    {section.critical && (
                                                        <span className="ml-3 text-xs font-semibold bg-red-100 text-red-600 px-2 py-1 rounded">
                                                            Critical
                                                        </span>
                                                    )}
                                                </div>
                                                {section.description && (
                                                    <span className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded">
                                                        {section.description}
                                                    </span>
                                                )}
                                            </div>
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
                                                        <p className="text-gray-600 text-sm mb-3">
                                                            {point.description}
                                                        </p>
                                                        <div className="space-y-2">
                                                            {point.duration && (
                                                                <div className="flex items-center text-xs text-gray-500">
                                                                    <Clock className="w-3 h-3 mr-2" />
                                                                    Duration:{" "}
                                                                    {
                                                                        point.duration
                                                                    }
                                                                </div>
                                                            )}
                                                            {point.required && (
                                                                <div className="flex items-center text-xs text-red-600">
                                                                    <AlertTriangle className="w-3 h-3 mr-2" />
                                                                    Required:{" "}
                                                                    {
                                                                        point.required
                                                                    }
                                                                </div>
                                                            )}
                                                            {point.optional && (
                                                                <div className="flex items-center text-xs text-green-600">
                                                                    <CheckCircle className="w-3 h-3 mr-2" />
                                                                    {
                                                                        point.optional
                                                                    }
                                                                </div>
                                                            )}
                                                            {point.tip && (
                                                                <div className="flex items-center text-xs text-blue-600">
                                                                    <Lightbulb className="w-3 h-3 mr-2" />
                                                                    Tip:{" "}
                                                                    {point.tip}
                                                                </div>
                                                            )}
                                                        </div>
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
                                                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                                            <AlertTriangle className="w-3 h-3 text-red-500" />
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

                    {/* Risk Management Section */}
                    <section className="mb-16">
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mr-4">
                                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">
                                        Risk Management & Mitigation
                                    </h2>
                                    <p className="text-gray-600">
                                        Understanding and mitigating common
                                        volunteering risks
                                    </p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {riskManagement.map((risk) => (
                                    <div
                                        key={risk.risk}
                                        className="bg-white rounded-xl p-6"
                                    >
                                        <div className="flex items-center mb-3">
                                            <div className="text-amber-500 mr-3">
                                                {risk.icon}
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {risk.risk}
                                            </h3>
                                        </div>
                                        <p className="text-gray-700 text-sm mb-3">
                                            {risk.mitigation}
                                        </p>
                                        <div className="flex items-center text-xs text-gray-500">
                                            <FileText className="w-3 h-3 mr-2" />
                                            Reference: {risk.reference}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Comprehensive FAQ Section */}
                    <div className="mb-16">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-full mb-4">
                                <HelpCircle className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Comprehensive FAQ
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Detailed answers to common questions about
                                safety, compliance, and platform features
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-all duration-200"
                                >
                                    <div className="flex items-start mb-3">
                                        <div className="mr-3 text-blue-500 flex-shrink-0">
                                            {faq.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                    {faq.category}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                                                {faq.question}
                                            </h3>
                                            <p className="text-gray-700 text-sm">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Legal Reference Section */}
                    <section className="mb-16">
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                                    <FileText className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">
                                        Essential Legal References
                                    </h2>
                                    <p className="text-gray-600">
                                        Key documents every volunteer must
                                        review
                                    </p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {legalReferences.map((doc) => (
                                    <div
                                        key={doc.document}
                                        className="bg-white rounded-xl p-6"
                                    >
                                        <div className="flex items-center mb-3">
                                            <div className="text-blue-500 mr-3">
                                                {doc.icon}
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {doc.document}
                                            </h3>
                                        </div>
                                        <p className="text-gray-700 text-sm mb-4">
                                            {doc.description}
                                        </p>
                                        <div className="space-y-2">
                                            {doc.sections.map(
                                                (section, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center text-xs text-gray-600"
                                                    >
                                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                                                        {section}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                        {/* <a
                                            href={`/${doc.document
                                                .toLowerCase()
                                                .replace(/ & /g, "-")
                                                .replace(/ /g, "-")}`}
                                            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium mt-4"
                                        >
                                            Read Document{" "}
                                            <ExternalLink className="w-3 h-3 ml-1" />
                                        </a> */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Final Compliance Check */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 mb-12">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Final Compliance Checklist
                            </h3>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Verify completion of all requirements before
                                volunteering
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white rounded-lg p-4">
                                <div className="flex items-center mb-2">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                    <h4 className="font-semibold text-gray-900">
                                        Identity Verified
                                    </h4>
                                </div>
                                <p className="text-xs text-gray-600">
                                    Government ID and contact verification
                                    complete
                                </p>
                            </div>
                            <div className="bg-white rounded-lg p-4">
                                <div className="flex items-center mb-2">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                    <h4 className="font-semibold text-gray-900">
                                        Terms Accepted
                                    </h4>
                                </div>
                                <p className="text-xs text-gray-600">
                                    All platform policies reviewed and accepted
                                </p>
                            </div>
                            <div className="bg-white rounded-lg p-4">
                                <div className="flex items-center mb-2">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                    <h4 className="font-semibold text-gray-900">
                                        Safety Protocols
                                    </h4>
                                </div>
                                <p className="text-xs text-gray-600">
                                    Communication monitoring and safety
                                    requirements understood
                                </p>
                            </div>
                            <div className="bg-white rounded-lg p-4">
                                <div className="flex items-center mb-2">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                    <h4 className="font-semibold text-gray-900">
                                        Points Understood
                                    </h4>
                                </div>
                                <p className="text-xs text-gray-600">
                                    Points system and limitations acknowledged
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Support & Contact */}
                    <div className="text-center border-t border-gray-200 pt-10">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            Need Clarification or Support?
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                            Contact our compliance team for questions about
                            safety protocols, legal requirements, or platform
                            policies.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href={route("contact")}
                                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                                Contact Compliance Team
                            </a>
                            <a
                                href="mailto:contact@volunteerfaster.com"
                                className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors duration-200"
                            >
                                <Shield className="w-4 h-4 mr-2" /> Data
                                Protection Officer
                            </a>
                        </div>
                        <p className="text-sm text-gray-500 mt-4">
                            For legal disputes, follow the resolution process
                            outlined in Terms Section 13
                        </p>
                    </div>
                </div>
            </GeneralPages>
        </>
    );
}
