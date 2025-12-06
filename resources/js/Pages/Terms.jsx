import GeneralPages from "@/Layouts/GeneralPages";
import React from "react";
import { Link } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import {
    FileText,
    Scale,
    User,
    Users,
    Building,
    Target,
    Globe,
    Shield,
    AlertTriangle,
    RefreshCw,
    Lock,
    Award,
    CreditCard,
    Handshake,
    Mail,
    MapPin,
    CheckCircle,
    ExternalLink,
    BookOpen,
    MessageSquare,
    TrendingUp,
    Heart,
    Eye,
    Zap,
    Clock,
    ShieldCheck,
    Bell,
    HelpCircle,
} from "lucide-react";

const definitions = [
    {
        term: "User",
        definition:
            "Any Volunteer, Organization, Donor/Sponsor, or individual accessing the platform",
        icon: <User className="w-4 h-4" />,
    },
    {
        term: "Volunteer",
        definition:
            "An individual offering services without monetary compensation, verified through Platform processes",
        icon: <Users className="w-4 h-4" />,
    },
    {
        term: "Organization",
        definition:
            "Legally registered and verified entity seeking volunteer services",
        icon: <Building className="w-4 h-4" />,
    },
    {
        term: "Project",
        definition:
            "A specific volunteering opportunity with defined Completion Criteria and duration",
        icon: <Target className="w-4 h-4" />,
    },
    {
        term: "Platform",
        definition:
            "The Volunteer Faster website, mobile applications, APIs, and all associated services",
        icon: <Globe className="w-4 h-4" />,
    },
    {
        term: "Points",
        definition:
            "Non-transferable digital recognition system with no cash value, governed by Platform rules",
        icon: <Award className="w-4 h-4" />,
    },
    {
        term: "Completion Criteria",
        definition:
            "Objective, pre-defined requirements for satisfactory Project completion",
        icon: <CheckCircle className="w-4 h-4" />,
    },
    {
        term: "Escrow Account",
        definition:
            "Secured holding account for fundraising funds until verification of legitimate use",
        icon: <ShieldCheck className="w-4 h-4" />,
    },
];

const eligibilityCriteria = [
    {
        category: "Age Requirement",
        requirement:
            "18 years or older, or 16-17 with verifiable parental/guardian consent",
        icon: <User className="w-4 h-4" />,
    },
    {
        category: "Information Accuracy",
        requirement:
            "Provide accurate, current, and complete registration information",
        icon: <CheckCircle className="w-4 h-4" />,
    },
    {
        category: "Legal Capacity",
        requirement:
            "Have legal capacity to enter binding agreements under applicable law",
        icon: <Scale className="w-4 h-4" />,
    },
    {
        category: "Verification Status",
        requirement:
            "Pass identity verification and maintain valid credentials",
        icon: <Shield className="w-4 h-4" />,
    },
];

const communicationMonitoring = [
    "All platform communications may be monitored for quality assurance, safety, and compliance purposes",
    "Monitoring helps ensure respectful interactions and platform integrity",
    "Personal communications unrelated to platform activities remain confidential",
    "Users will be notified of significant policy violations detected through monitoring",
    "Monitoring data is processed according to our Privacy Policy and retained for 90 days",
];

const volunteerResponsibilities = [
    "Provide and maintain accurate, current registration information",
    "Fulfill agreed duties according to published Completion Criteria",
    "Provide 72-hour notice if unable to fulfill commitments (except emergencies)",
    "Respect Organization values, safety standards, and confidentiality requirements",
    "Report safety concerns, harassment, or policy violations within 24 hours",
    "Complete required orientation/training for specialized Projects",
    "Adhere to Platform Code of Conduct in all interactions",
];

const organizationResponsibilities = [
    "Define clear, objective Completion Criteria before Volunteer commitment",
    "Ensure safe working environment compliant with local regulations",
    "Maintain appropriate insurance coverage for volunteer activities",
    "Confirm or dispute Project completion within 7 days with specific reasons",
    "Provide adequate supervision, training, and necessary equipment",
    "Protect Volunteer personal data and use only for coordination purposes",
    "Report incidents involving Volunteers to Platform within 24 hours",
];

const pointsSystem = {
    earning: [
        "Project completion verified against objective Completion Criteria",
        "Successful referral of verified Users who complete one Project",
        "Constructive platform contributions subject to admin review",
        "Completion of Platform training modules and certifications",
    ],
    volunteerUsage: [
        "Offset costs of Paid Projects (subject to Organization acceptance)",
        "Access premium features and skill verification badges",
        "Priority access to exclusive volunteer opportunities",
        "Platform recognition and achievement certificates",
    ],
    organizationUsage: [
        "Feature Projects for increased visibility (subject to availability)",
        "Access advanced volunteer matching and analytics",
        "Platform promotional credits and partnership benefits",
        "Training resource access and volunteer recognition tools",
    ],
    protections: [
        "Points awarded only after 7-day dispute window expires",
        "Fraudulent Points acquisition results in forfeiture and account review",
        "Points expire after 24 months of account inactivity",
        "Maximum 10,000 Points transfer/transaction limits apply",
        "30-day notice for significant Points system changes",
    ],
};

const fundraisingRules = [
    "Funds held in escrow until Project commencement verification",
    "Platform retains 6% fee for payment processing and oversight services",
    "Donors receive refund if Project cancels before commencement",
    "Volunteers must provide quarterly updates on fund usage",
    "Unused funds returned if Project cannot proceed as described",
    "All campaigns must include detailed budget and timeline",
    "Platform may investigate and withhold funds for suspected misuse",
];

const disputeResolution = [
    "Step 1: Direct resolution attempt between parties (14 days)",
    "Step 2: Platform mediation with assigned neutral facilitator (30 days)",
    "Step 3: Binding arbitration in Kampala under Ugandan Arbitration Act",
    "Step 4: Right to pursue small claims or injunctive relief remains",
    "Each party bears own costs; arbitration fees shared equally",
];

export default function Terms({ auth }) {
    const lastUpdated = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    const currentUrl =
        typeof window !== "undefined" ? window.location.href : appUrl;

    const pageTitle = "Terms and Conditions | Volunteer Faster";
    const pageDescription =
        "Comprehensive Terms and Conditions governing the use of Volunteer Faster platform for volunteers, organizations, and donors.";

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta
                    name="keywords"
                    content="terms and conditions, volunteer agreement, legal terms, platform rules, volunteer protection"
                />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:url" content={currentUrl} />
                <meta property="og:type" content="article" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
                <link rel="canonical" href={currentUrl} />
            </Head>
            <GeneralPages auth={auth} title="Terms and Conditions">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl mb-6">
                            <FileText className="w-10 h-10 text-blue-600" />
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
                            <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                                Legal Agreement v5.2
                            </span>
                            <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                Updated: {lastUpdated}
                            </span>
                            <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                                Enhanced Protections
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Terms and Conditions
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            These comprehensive Terms govern all use of the{" "}
                            <span className="font-bold text-blue-600">
                                Volunteer Faster
                            </span>{" "}
                            platform. Please read carefully as they contain
                            important information about your rights,
                            responsibilities, and protections.
                        </p>
                    </div>

                    {/* Critical Notice */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-r-xl p-6 mb-8">
                        <div className="flex items-start">
                            <AlertTriangle className="w-6 h-6 text-amber-600 mt-1 mr-4 flex-shrink-0" />
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    Important Notice
                                </h3>
                                <p className="text-gray-700">
                                    These Terms include significant updates to
                                    enhance user protections, clarify dispute
                                    resolution, and ensure platform integrity.
                                    Key changes include:{" "}
                                    <strong>
                                        Escrow protection for donations
                                    </strong>
                                    , <strong>Clear Completion Criteria</strong>
                                    , and{" "}
                                    <strong>
                                        Enhanced communication monitoring for
                                        safety
                                    </strong>
                                    .
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Overview Cards */}
                    <div className="grid md:grid-cols-4 gap-6 mb-10">
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5">
                            <div className="flex items-center mb-3">
                                <MapPin className="w-5 h-5 text-blue-600 mr-3" />
                                <h3 className="font-bold text-gray-900">
                                    Registered In
                                </h3>
                            </div>
                            <p className="text-gray-700">Republic of Uganda</p>
                            {/* <p className="text-xs text-gray-500 mt-1">
                                Registration #: URSB-2025-89432
                            </p> */}
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5">
                            <div className="flex items-center mb-3">
                                <Globe className="w-5 h-5 text-blue-600 mr-3" />
                                <h3 className="font-bold text-gray-900">
                                    Operation Scope
                                </h3>
                            </div>
                            <p className="text-gray-700">International</p>
                            <p className="text-xs text-gray-500 mt-1">
                                160+ countries supported
                            </p>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5">
                            <div className="flex items-center mb-3">
                                <Scale className="w-5 h-5 text-blue-600 mr-3" />
                                <h3 className="font-bold text-gray-900">
                                    Governing Law
                                </h3>
                            </div>
                            <p className="text-gray-700">Laws of Uganda</p>
                            <p className="text-xs text-gray-500 mt-1">
                                Courts of Kampala
                            </p>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5">
                            <div className="flex items-center mb-3">
                                <Eye className="w-5 h-5 text-blue-600 mr-3" />
                                <h3 className="font-bold text-gray-900">
                                    Communication Policy
                                </h3>
                            </div>
                            <p className="text-gray-700">
                                Monitored for Safety
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                See Section 4.4
                            </p>
                        </div>
                    </div>

                    {/* Acceptance Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-10">
                        <div className="flex items-start">
                            <Zap className="w-8 h-8 text-blue-600 mt-1 mr-4 flex-shrink-0" />
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Acceptance of Terms
                                </h2>
                                <p className="text-gray-700 mb-4">
                                    By accessing or using our Platform, you
                                    acknowledge that you have read, understood,
                                    and agree to be bound by these Terms and
                                    Conditions, our{" "}
                                    <Link
                                        href={route("privacy.policy")}
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Privacy Policy
                                    </Link>
                                    , and our{" "}
                                    <Link
                                        href="/community-guidelines"
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Community Guidelines
                                    </Link>
                                    .
                                </p>
                                <div className="bg-white rounded-lg p-4 border border-blue-200">
                                    <p className="text-gray-700">
                                        <strong>Continued Use:</strong> Ongoing
                                        use constitutes acceptance of current
                                        Terms. You may reject updates by
                                        terminating your account before they
                                        take effect.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Communication Monitoring Section */}
                    <section className="mb-12">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mr-4">
                                <Eye className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">
                                    Communication Monitoring & Safety
                                </h2>
                                <p className="text-gray-600 mt-1">
                                    Ensuring safe, respectful, and productive
                                    interactions for all users
                                </p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-6">
                            <div className="flex items-start mb-4">
                                <Shield className="w-6 h-6 text-indigo-600 mr-4 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        Our Commitment to Safe Communication
                                    </h3>
                                    <p className="text-gray-700">
                                        To maintain platform integrity, ensure
                                        user safety, and provide quality
                                        services, Volunteer Faster may monitor
                                        platform communications including
                                        messages, forum posts, and project
                                        discussions. This monitoring helps us:
                                    </p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {communicationMonitoring.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-white rounded-xl p-5"
                                    >
                                        <div className="flex items-start">
                                            <Bell className="w-5 h-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-gray-700">
                                                    {item}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 bg-white rounded-xl p-5 border border-indigo-200">
                                <div className="flex items-start">
                                    <HelpCircle className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2">
                                            What We Do Not Monitor
                                        </h4>
                                        <p className="text-gray-700">
                                            We respect your privacy. Personal
                                            communications outside our platform,
                                            private contact information shared
                                            after mutual consent, and sensitive
                                            personal data unrelated to platform
                                            activities are not subject to
                                            routine monitoring.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Definitions Section */}
                    <section className="mb-12">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                                <BookOpen className="w-6 h-6 text-blue-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                Key Definitions
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {definitions.map((def) => (
                                <div
                                    key={def.term}
                                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
                                >
                                    <div className="flex items-center mb-3">
                                        <div className="text-blue-500 mr-3">
                                            {def.icon}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {def.term}
                                        </h3>
                                    </div>
                                    <p className="text-gray-700">
                                        {def.definition}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Eligibility & Verification */}
                    <section className="mb-12">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                <ShieldCheck className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Eligibility & Verification
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                To ensure platform safety and integrity, all
                                users must meet these requirements
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {eligibilityCriteria.map((item) => (
                                <div
                                    key={item.category}
                                    className="bg-white rounded-xl border border-gray-200 p-6 text-center"
                                >
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                                        {item.icon}
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-2">
                                        {item.category}
                                    </h3>
                                    <p className="text-gray-700 text-sm">
                                        {item.requirement}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Verification Details */}
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Verification Process
                            </h3>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-white rounded-xl p-5">
                                    <div className="flex items-center mb-3">
                                        <Clock className="w-5 h-5 text-blue-500 mr-3" />
                                        <h4 className="font-bold text-gray-900">
                                            When We Verify
                                        </h4>
                                    </div>
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3"></div>
                                            <span>
                                                During initial registration
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3"></div>
                                            <span>
                                                Before high-value Points
                                                transactions
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3"></div>
                                            <span>
                                                When suspicious activity is
                                                detected
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="bg-white rounded-xl p-5">
                                    <div className="flex items-center mb-3">
                                        <FileText className="w-5 h-5 text-blue-500 mr-3" />
                                        <h4 className="font-bold text-gray-900">
                                            What We Request
                                        </h4>
                                    </div>
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3"></div>
                                            <span>
                                                Government-issued ID for
                                                individuals
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3"></div>
                                            <span>
                                                Registration certificates for
                                                Organizations
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt=2 mr-3"></div>
                                            <span>
                                                Proof of address when required
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="bg-white rounded-xl p-5">
                                    <div className="flex items-center mb-3">
                                        <Lock className="w-5 h-5 text-blue-500 mr-3" />
                                        <h4 className="font-bold text-gray-900">
                                            Your Rights
                                        </h4>
                                    </div>
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3"></div>
                                            <span>
                                                14-day notice for non-urgent
                                                requests
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3"></div>
                                            <span>
                                                Secure document handling per
                                                Privacy Policy
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3"></div>
                                            <span>
                                                Right to dispute unreasonable
                                                requests
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Responsibilities Grid */}
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    Volunteer Rights & Responsibilities
                                </h3>
                            </div>
                            <ul className="space-y-3">
                                {volunteerResponsibilities.map(
                                    (responsibility, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-start"
                                        >
                                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">
                                                {responsibility}
                                            </span>
                                        </li>
                                    )
                                )}
                            </ul>
                            <div className="mt-6 bg-blue-50 rounded-lg p-4">
                                <h4 className="font-bold text-gray-900 mb-2">
                                    Volunteer Protections
                                </h4>
                                <p className="text-sm text-gray-700">
                                    Right to safe environment, clear
                                    expectations, timely confirmation of
                                    completion, and protection from arbitrary
                                    termination. Disputes regarding completion
                                    must cite specific unmet criteria.
                                </p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100 p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                                    <Building className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    Organization Obligations
                                </h3>
                            </div>
                            <ul className="space-y-3">
                                {organizationResponsibilities.map(
                                    (responsibility, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-start"
                                        >
                                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">
                                                {responsibility}
                                            </span>
                                        </li>
                                    )
                                )}
                            </ul>
                            <div className="mt-6 bg-purple-50 rounded-lg p-4">
                                <h4 className="font-bold text-gray-900 mb-2">
                                    Organization Protections
                                </h4>
                                <p className="text-sm text-gray-700">
                                    Right to expect committed volunteer
                                    performance, protection from volunteer
                                    no-shows (with defined penalties), and clear
                                    dispute resolution process for performance
                                    issues.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Points System */}
                    <section className="mb-12">
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 mb-8">
                            <div className="flex items-center mb-4">
                                <Award className="w-8 h-8 text-amber-600 mr-4" />
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        Enhanced Points System
                                    </h2>
                                    <p className="text-gray-700">
                                        Our Points system provides recognition
                                        while preventing fraud and misuse.
                                        <strong>
                                            {" "}
                                            Points are NOT currency, have NO
                                            cash value, and cannot be
                                            transferred, sold, or exchanged for
                                            money.
                                        </strong>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                    Earning & Using Points
                                </h3>
                                <div className="mb-6">
                                    <h4 className="font-bold text-gray-900 mb-2">
                                        Earning Points:
                                    </h4>
                                    <ul className="space-y-2 mb-4">
                                        {pointsSystem.earning.map(
                                            (item, idx) => (
                                                <li
                                                    key={idx}
                                                    className="flex items-start"
                                                >
                                                    <TrendingUp className="w-4 h-4 text-green-500 mr-3 mt-1 flex-shrink-0" />
                                                    <span className="text-gray-700 text-sm">
                                                        {item}
                                                    </span>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2">
                                            Volunteers:
                                        </h4>
                                        <ul className="space-y-1">
                                            {pointsSystem.volunteerUsage.map(
                                                (item, idx) => (
                                                    <li
                                                        key={idx}
                                                        className="flex items-start"
                                                    >
                                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2"></div>
                                                        <span className="text-gray-700 text-xs">
                                                            {item}
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2">
                                            Organizations:
                                        </h4>
                                        <ul className="space-y-1">
                                            {pointsSystem.organizationUsage.map(
                                                (item, idx) => (
                                                    <li
                                                        key={idx}
                                                        className="flex items-start"
                                                    >
                                                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-2"></div>
                                                        <span className="text-gray-700 text-xs">
                                                            {item}
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                    Points Protections & Restrictions
                                </h3>
                                <ul className="space-y-3">
                                    {pointsSystem.protections.map(
                                        (protection, idx) => (
                                            <li
                                                key={idx}
                                                className="flex items-start"
                                            >
                                                <Shield className="w-4 h-4 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                                                <span className="text-gray-700">
                                                    {protection}
                                                </span>
                                            </li>
                                        )
                                    )}
                                </ul>
                                <div className="mt-6 bg-blue-50 rounded-lg p-4">
                                    <h4 className="font-bold text-gray-900 mb-2">
                                        Fraud Prevention
                                    </h4>
                                    <p className="text-sm text-gray-700">
                                        Points acquired through fraud,
                                        misrepresentation, or system
                                        manipulation will be forfeited. Repeated
                                        violations may result in account
                                        termination and legal action.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Fundraising with Escrow Protection */}
                    <section className="mb-12">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
                            <div className="flex items-center mb-4">
                                <ShieldCheck className="w-8 h-8 text-green-600 mr-4" />
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        Fundraising with Escrow Protection
                                    </h2>
                                    <p className="text-gray-700">
                                        All fundraising campaigns now include
                                        escrow protection to ensure donor funds
                                        are used as intended
                                    </p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-xl p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                                        Escrow Process
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                                <span className="text-green-600 font-bold">
                                                    1
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">
                                                    Funds Collected
                                                </h4>
                                                <p className="text-sm text-gray-700">
                                                    Donations held in secure
                                                    escrow account
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                                <span className="text-green-600 font-bold">
                                                    2
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">
                                                    Project Verification
                                                </h4>
                                                <p className="text-sm text-gray-700">
                                                    Platform verifies Project
                                                    can proceed as described
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                                <span className="text-green-600 font-bold">
                                                    3
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">
                                                    Funds Released
                                                </h4>
                                                <p className="text-sm text-gray-700">
                                                    75% released at
                                                    commencement, 25% after
                                                    midpoint verification
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                                        Rules & Protections
                                    </h3>
                                    <ul className="space-y-3">
                                        {fundraisingRules.map((rule, idx) => (
                                            <li
                                                key={idx}
                                                className="flex items-start"
                                            >
                                                <Handshake className="w-4 h-4 text-green-500 mr-3 mt-1 flex-shrink-0" />
                                                <span className="text-gray-700 text-sm">
                                                    {rule}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-6 bg-white rounded-xl p-6">
                                <div className="flex items-center mb-3">
                                    <Heart className="w-5 h-5 text-red-500 mr-3" />
                                    <h3 className="text-lg font-bold text-gray-900">
                                        Donor Protections
                                    </h3>
                                </div>
                                <div className="grid sm:grid-cols-3 gap-4">
                                    <div className="text-center p-4 bg-red-50 rounded-lg">
                                        <div className="text-red-600 font-bold text-lg mb-1">
                                            Full Refund
                                        </div>
                                        <p className="text-xs text-gray-700">
                                            If Project cancels before starting
                                        </p>
                                    </div>
                                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                        <div className="text-yellow-600 font-bold text-lg mb-1">
                                            Quarterly Updates
                                        </div>
                                        <p className="text-xs text-gray-700">
                                            Required progress reports from
                                            Volunteers
                                        </p>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-lg">
                                        <div className="text-green-600 font-bold text-lg mb-1">
                                            Fund Recovery
                                        </div>
                                        <p className="text-xs text-gray-700">
                                            If funds misused, Platform assists
                                            recovery
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Enhanced Dispute Resolution */}
                    <section className="mb-12">
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
                            <div className="flex items-center mb-6">
                                <Scale className="w-8 h-8 text-blue-600 mr-4" />
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Enhanced Dispute Resolution
                                    </h2>
                                    <p className="text-gray-700">
                                        Clear, fair process for resolving
                                        conflicts between users
                                    </p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        Four-Step Resolution Process
                                    </h3>
                                    <div className="space-y-4">
                                        {disputeResolution.map((step, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-start"
                                            >
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                                    <span className="text-blue-600 font-bold">
                                                        {idx + 1}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 mb-1">
                                                        {step.split(":")[0]}
                                                    </h4>
                                                    <p className="text-gray-700 text-sm">
                                                        {step.split(":")[1]}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        Costs & Jurisdiction
                                    </h3>
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl p-5">
                                            <h4 className="font-bold text-gray-900 mb-2">
                                                Cost Allocation
                                            </h4>
                                            <ul className="space-y-2 text-sm text-gray-700">
                                                <li className="flex items-start">
                                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3"></div>
                                                    <span>
                                                        Each party bears own
                                                        legal costs
                                                    </span>
                                                </li>
                                                <li className="flex items-start">
                                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3"></div>
                                                    <span>
                                                        Arbitration fees shared
                                                        equally
                                                    </span>
                                                </li>
                                                <li className="flex items-start">
                                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3"></div>
                                                    <span>
                                                        Platform mediation
                                                        provided at no cost
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="bg-white rounded-xl p-5">
                                            <h4 className="font-bold text-gray-900 mb-2">
                                                Legal Jurisdiction
                                            </h4>
                                            <p className="text-sm text-gray-700 mb-2">
                                                These Terms are governed by the
                                                laws of Uganda. The courts of
                                                Kampala, Uganda have exclusive
                                                jurisdiction.
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                For international users: You may
                                                have additional rights under
                                                your local consumer protection
                                                laws.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Key Legal Sections */}
                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center mb-3">
                                <AlertTriangle className="w-5 h-5 text-amber-600 mr-3" />
                                <h3 className="text-lg font-bold text-gray-900">
                                    Limitation of Liability
                                </h3>
                            </div>
                            <p className="text-gray-700 text-sm mb-3">
                                We provide a connection service only. We are not
                                liable for User interactions, except for:
                            </p>
                            <ul className="space-y-2 text-xs text-gray-700">
                                <li className="flex items-start">
                                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 mr-2"></div>
                                    <span>
                                        Gross negligence or willful misconduct
                                        by Platform
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 mr-2"></div>
                                    <span>
                                        Breach of data protection obligations
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 mr-2"></div>
                                    <span>
                                        Death or personal injury caused by
                                        Platform negligence
                                    </span>
                                </li>
                            </ul>
                            <div className="mt-4 text-xs text-gray-600">
                                Maximum liability limited to fees paid by User
                                in previous 6 months.
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center mb-3">
                                <Shield className="w-5 h-5 text-green-600 mr-3" />
                                <h3 className="text-lg font-bold text-gray-900">
                                    Mutual Indemnification
                                </h3>
                            </div>
                            <div className="mb-4">
                                <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                                    You Indemnify Platform For:
                                </h4>
                                <p className="text-xs text-gray-700">
                                    Your violations of these Terms, misuse of
                                    Platform, and harm caused to other Users.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                                    Platform Indemnifies You For:
                                </h4>
                                <p className="text-xs text-gray-700">
                                    Platform's breach of these Terms, violation
                                    of applicable law, or gross negligence.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center mb-3">
                                <FileText className="w-5 h-5 text-purple-600 mr-3" />
                                <h3 className="text-lg font-bold text-gray-900">
                                    Intellectual Property
                                </h3>
                            </div>
                            <p className="text-gray-700 text-sm mb-2">
                                Platform content is protected. Users grant
                                non-exclusive license for Platform to use
                                submitted content.
                            </p>
                            <p className="text-xs text-gray-600">
                                Users retain ownership of original content but
                                grant Platform rights to display, distribute,
                                and modify for technical purposes.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center mb-3">
                                <Clock className="w-5 h-5 text-blue-600 mr-3" />
                                <h3 className="text-lg font-bold text-gray-900">
                                    Termination & Data
                                </h3>
                            </div>
                            <p className="text-gray-700 text-sm mb-2">
                                Accounts may be terminated for violations or
                                inactivity. Data retained for legal compliance
                                per Privacy Policy.
                            </p>
                            <p className="text-xs text-gray-600">
                                Upon termination: Access disabled immediately,
                                Points forfeited after 90 days, data deletion
                                available upon request.
                            </p>
                        </div>
                    </div>

                    {/* Policy Updates & Contact */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <div className="flex items-center mb-4">
                                    <RefreshCw className="w-6 h-6 text-blue-600 mr-3" />
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        Updates & Modifications
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-white rounded-lg p-4">
                                        <h4 className="font-bold text-gray-900 mb-1">
                                            Update Process
                                        </h4>
                                        <p className="text-sm text-gray-700 mb-2">
                                            We may update Terms with advance
                                            notice:
                                        </p>
                                        <ul className="space-y-1 text-xs text-gray-600">
                                            <li>
                                                Minor changes: 30-day notice
                                            </li>
                                            <li>
                                                Material changes: 60-day notice
                                            </li>
                                            <li>
                                                Notification via email and
                                                platform announcement
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="bg-white rounded-lg p-4">
                                        <h4 className="font-bold text-gray-900 mb-1">
                                            Your Rights
                                        </h4>
                                        <p className="text-sm text-gray-700">
                                            You may reject changes by
                                            terminating your account before they
                                            take effect. Continued use
                                            constitutes acceptance.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center mb-4">
                                    <Mail className="w-6 h-6 text-blue-600 mr-3" />
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        Contact & Support
                                    </h3>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2">
                                            Legal Inquiries
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
                                        <h4 className="font-bold text-gray-900 mb-1">
                                            Physical Address
                                        </h4>
                                        <p className="text-sm text-gray-700">
                                            Volunteer Faster Ltd.
                                            <br />
                                            Plot 3118, Block 206
                                            <br />
                                            Kampala, Uganda
                                            <br />
                                            {/* Registration: URSB-2025-89432 */}
                                        </p>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <p>
                                            For disputes, please follow the
                                            resolution process outlined in
                                            Section 10.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Final Acknowledgement */}
                    <div className="mt-8 bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl p-8 text-white text-center">
                        <h3 className="text-2xl font-bold mb-4">
                            Final Acknowledgement
                        </h3>
                        <p className="mb-6 opacity-90">
                            By using Volunteer Faster, you acknowledge that you
                            have read, understood, and agree to these Terms,
                            including our communication monitoring policy,
                            escrow protections, and enhanced dispute resolution
                            process.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                                <span>
                                    I understand the communication monitoring
                                    policy
                                </span>
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                                <span>
                                    I accept the fundraising escrow protection
                                </span>
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                                <span>
                                    I agree to the dispute resolution process
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </GeneralPages>
        </>
    );
}
