import GeneralPages from "@/Layouts/GeneralPages";
import React from "react";
import { Link } from "@inertiajs/react";
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
} from "lucide-react";

const definitions = [
    {
        term: "User",
        definition:
            "Any Volunteer, Organization, Donor/Sponsor or individual accessing the platform",
        icon: <User className="w-4 h-4" />,
    },
    {
        term: "Volunteer",
        definition:
            "An individual offering services without monetary compensation",
        icon: <Users className="w-4 h-4" />,
    },
    {
        term: "Organization",
        definition: "Legal entity/nonprofit/charity seeking volunteer services",
        icon: <Building className="w-4 h-4" />,
    },
    {
        term: "Project",
        definition: "A volunteering opportunity listed by an Organization",
        icon: <Target className="w-4 h-4" />,
    },
    {
        term: "Platform",
        definition:
            "The Volunteer Faster website, mobile applications, and all associated services",
        icon: <Globe className="w-4 h-4" />,
    },
    {
        term: "Points",
        definition:
            "Digital reward currency earned on the Platform with no cash value",
        icon: <Award className="w-4 h-4" />,
    },
    {
        term: "Content",
        definition:
            "Any data, text, images, videos, or materials uploaded or shared on the Platform",
        icon: <FileText className="w-4 h-4" />,
    },
    {
        term: "Verification",
        definition:
            "Process of confirming identity through valid documents and credentials",
        icon: <Shield className="w-4 h-4" />,
    },
];

const eligibilityCriteria = [
    {
        category: "Age Requirement",
        requirement: "18 years or older, or have legal guardian consent",
        icon: <User className="w-4 h-4" />,
    },
    {
        category: "Information Accuracy",
        requirement: "Provide accurate and truthful registration information",
        icon: <CheckCircle className="w-4 h-4" />,
    },
    {
        category: "Legal Capacity",
        requirement: "Have legal capacity to enter binding agreements",
        icon: <Scale className="w-4 h-4" />,
    },
    {
        category: "Organization Registration",
        requirement:
            "Organizations must be legally registered and authorized to operate",
        icon: <Building className="w-4 h-4" />,
    },
];

const volunteerResponsibilities = [
    "Provide accurate and up-to-date information during registration",
    "Use the Platform ethically and lawfully",
    "Maintain confidentiality of account credentials",
    "Report suspicious or fraudulent activities immediately",
    "Fulfill agreed volunteer duties once accepted by an Organization",
    "Respect the values and safety standards of host organizations",
];

const organizationResponsibilities = [
    "Ensure volunteer safety and provide clear role descriptions",
    "Abide by local labor and safety laws regarding volunteer work",
    "Use volunteers' information only for coordination purposes",
    "Provide adequate training and supervision",
    "Maintain appropriate insurance coverage where required",
    "Timely confirm volunteer hours and project completion",
];

const pointsSystem = {
    earning: [
        "Successful referral of users (subject to admin approval)",
        "Completion of projects when organization confirms satisfactory completion",
        "No reports of misconduct or violations exist",
    ],
    volunteerUsage: [
        "Pay for Paid Volunteer Projects (if organization accepts Points)",
        "Exchange for Platform-specific benefits and recognition",
    ],
    organizationUsage: [
        "Pay for project featuring to increase visibility",
        "Redeem for Platform-specific promotional benefits",
    ],
    restrictions: [
        "Points have no cash value and cannot be exchanged for money",
        "Points cannot be transferred between accounts",
        "Points may be revoked for fraud, misconduct, or misuse",
        "Points expire after 24 months of inactivity",
    ],
};

const fundraisingRules = [
    "All donations (except Volunteer Fees) go directly to the Volunteer",
    "Volunteer Faster is not responsible for failed fundraising or donor behavior",
    "Fundraising must comply with financial regulations in Uganda and donor countries",
    "Campaigns must be truthful and transparent about fund usage",
    "We reserve the right to remove or reject campaigns violating guidelines",
];

export default function Terms({ auth }) {
    const lastUpdated = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <GeneralPages auth={auth} title="Terms and Conditions">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl mb-6">
                        <FileText className="w-10 h-10 text-blue-600" />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
                        <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                            Legal Agreement
                        </span>
                        <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            Updated: {lastUpdated}
                        </span>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Terms and Conditions
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Welcome to{" "}
                        <span className="font-bold text-blue-600">
                            Volunteer Faster
                        </span>
                        . These Terms govern your use of our platform, whether
                        you're a volunteer, organization, donor, or visitor.
                    </p>
                </div>

                {/* Overview Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5">
                        <div className="flex items-center mb-3">
                            <MapPin className="w-5 h-5 text-blue-600 mr-3" />
                            <h3 className="font-bold text-gray-900">
                                Registered In
                            </h3>
                        </div>
                        <p className="text-gray-700">Republic of Uganda</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5">
                        <div className="flex items-center mb-3">
                            <Globe className="w-5 h-5 text-blue-600 mr-3" />
                            <h3 className="font-bold text-gray-900">
                                Operation Scope
                            </h3>
                        </div>
                        <p className="text-gray-700">International</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5">
                        <div className="flex items-center mb-3">
                            <Scale className="w-5 h-5 text-blue-600 mr-3" />
                            <h3 className="font-bold text-gray-900">
                                Governing Law
                            </h3>
                        </div>
                        <p className="text-gray-700">
                            Laws of Uganda & East African Community
                        </p>
                    </div>
                </div>

                {/* Acceptance Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-10">
                    <div className="flex items-start">
                        <AlertTriangle className="w-8 h-8 text-blue-600 mt-1 mr-4 flex-shrink-0" />
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Acceptance of Terms
                            </h2>
                            <p className="text-gray-700">
                                By accessing or using our Platform, you agree to
                                be bound by these Terms and Conditions. If you
                                do not agree, you may not use our services.
                                Continued use constitutes ongoing acceptance.
                            </p>
                        </div>
                    </div>
                </div>

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

                {/* Eligibility Section */}
                <section className="mb-12">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                            <Shield className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Eligibility Requirements
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            To use Volunteer Faster, you must meet the following
                            criteria
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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

                    <div className="mt-8 bg-blue-50 rounded-xl p-6">
                        <div className="flex items-center">
                            <AlertTriangle className="w-5 h-5 text-blue-600 mr-3" />
                            <p className="text-gray-700">
                                <strong>Note:</strong> We may perform identity
                                verification at any time and request supporting
                                documents to ensure platform quality and
                                security.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Responsibilities Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* Volunteer Responsibilities */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center mb-4">
                            <Users className="w-6 h-6 text-blue-600 mr-3" />
                            <h3 className="text-2xl font-bold text-gray-900">
                                Volunteer Responsibilities
                            </h3>
                        </div>
                        <ul className="space-y-3">
                            {volunteerResponsibilities.map(
                                (responsibility, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">
                                            {responsibility}
                                        </span>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                    {/* Organization Responsibilities */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center mb-4">
                            <Building className="w-6 h-6 text-purple-600 mr-3" />
                            <h3 className="text-2xl font-bold text-gray-900">
                                Organization Responsibilities
                            </h3>
                        </div>
                        <ul className="space-y-3">
                            {organizationResponsibilities.map(
                                (responsibility, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">
                                            {responsibility}
                                        </span>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                </div>

                {/* Points System Section */}
                <section className="mb-12">
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 mb-8">
                        <div className="flex items-center mb-4">
                            <Award className="w-8 h-8 text-amber-600 mr-4" />
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Points System
                                </h2>
                                <p className="text-gray-700">
                                    Volunteer Faster uses a digital points
                                    system ("Points") as a recognition
                                    mechanism.
                                    <strong>
                                        {" "}
                                        Points are NOT money, have no monetary
                                        value, and cannot be withdrawn, cashed
                                        out, or refunded.
                                    </strong>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Earning Points */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                How Points Are Earned
                            </h3>
                            <ul className="space-y-3">
                                {pointsSystem.earning.map((item, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <TrendingUp className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Using Points */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                How Points Can Be Used
                            </h3>
                            <div className="mb-4">
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    Volunteers:
                                </h4>
                                <ul className="space-y-2 ml-4">
                                    {pointsSystem.volunteerUsage.map(
                                        (item, idx) => (
                                            <li
                                                key={idx}
                                                className="flex items-start"
                                            >
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                                <span className="text-gray-700">
                                                    {item}
                                                </span>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    Organizations:
                                </h4>
                                <ul className="space-y-2 ml-4">
                                    {pointsSystem.organizationUsage.map(
                                        (item, idx) => (
                                            <li
                                                key={idx}
                                                className="flex items-start"
                                            >
                                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                                <span className="text-gray-700">
                                                    {item}
                                                </span>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Restrictions */}
                    <div className="mt-6 bg-red-50 rounded-xl p-6">
                        <div className="flex items-center mb-4">
                            <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
                            <h3 className="text-lg font-bold text-gray-900">
                                Important Restrictions
                            </h3>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {pointsSystem.restrictions.map(
                                (restriction, idx) => (
                                    <div key={idx} className="flex items-start">
                                        <Lock className="w-4 h-4 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700 text-sm">
                                            {restriction}
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </section>

                {/* Fundraising Section */}
                <section className="mb-12">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
                        <div className="flex items-center mb-4">
                            <CreditCard className="w-8 h-8 text-green-600 mr-4" />
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Fundraising & Sponsorship
                                </h2>
                                <p className="text-gray-700">
                                    Volunteer Faster allows volunteers to create
                                    fundraising requests for paid projects
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">
                                    Key Agreements:
                                </h3>
                                <ul className="space-y-3">
                                    {fundraisingRules.map((rule, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-start"
                                        >
                                            <Handshake className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">
                                                {rule}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-center">
                                    <Heart className="w-5 h-5 text-blue-600 mr-3" />
                                    <p className="text-gray-700">
                                        <strong>Transparency:</strong> All
                                        fundraising campaigns must clearly state
                                        how funds will be used and provide
                                        regular updates to donors.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Legal Sections Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {/* Code of Conduct */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center mb-3">
                            <MessageSquare className="w-5 h-5 text-blue-600 mr-3" />
                            <h3 className="text-lg font-bold text-gray-900">
                                Code of Conduct
                            </h3>
                        </div>
                        <p className="text-gray-700 text-sm">
                            All users must treat each other with respect.
                            Harassment, discrimination, or abuse will result in
                            account suspension or termination. See our{" "}
                            <Link
                                href="/community-guidelines"
                                className="text-blue-600 hover:text-blue-800"
                            >
                                Community Guidelines
                            </Link>{" "}
                            for details.
                        </p>
                    </div>

                    {/* Intellectual Property */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center mb-3">
                            <FileText className="w-5 h-5 text-purple-600 mr-3" />
                            <h3 className="text-lg font-bold text-gray-900">
                                Intellectual Property
                            </h3>
                        </div>
                        <p className="text-gray-700 text-sm">
                            Platform content (excluding user submissions) is
                            owned by Volunteer Faster and protected under
                            copyright laws. Users may not copy, distribute, or
                            modify it without permission.
                        </p>
                    </div>

                    {/* Privacy */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center mb-3">
                            <Shield className="w-5 h-5 text-green-600 mr-3" />
                            <h3 className="text-lg font-bold text-gray-900">
                                Privacy
                            </h3>
                        </div>
                        <p className="text-gray-700 text-sm">
                            We collect and process data as outlined in our{" "}
                            <Link
                                href={route("privacy.policy")}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                Privacy Policy
                            </Link>
                            . By using the Platform, you consent to such
                            processing.
                        </p>
                    </div>

                    {/* Limitation of Liability */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center mb-3">
                            <AlertTriangle className="w-5 h-5 text-amber-600 mr-3" />
                            <h3 className="text-lg font-bold text-gray-900">
                                Limitation of Liability
                            </h3>
                        </div>
                        <p className="text-gray-700 text-sm">
                            We are not liable for any harm or loss resulting
                            from interactions between volunteers and
                            organizations. All engagements are at users' own
                            risk.
                        </p>
                    </div>
                </div>

                {/* Dispute Resolution & Contact */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 mb-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Dispute Resolution */}
                        <div>
                            <div className="flex items-center mb-4">
                                <Scale className="w-6 h-6 text-blue-600 mr-3" />
                                <h3 className="text-2xl font-bold text-gray-900">
                                    Dispute Resolution
                                </h3>
                            </div>
                            <p className="text-gray-700 mb-4">
                                Disputes shall first be resolved through
                                informal negotiation. If unresolved, disputes
                                shall be submitted to mediation or binding
                                arbitration in accordance with Ugandan law.
                            </p>
                            <div className="bg-white rounded-lg p-4 border border-blue-200">
                                <h4 className="font-semibold text-gray-900 mb-1">
                                    Governing Jurisdiction
                                </h4>
                                <p className="text-sm text-gray-600">
                                    These Terms are governed by the laws of
                                    Uganda and the East African Community.
                                    Disputes shall be resolved exclusively in
                                    Ugandan courts.
                                </p>
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
                            <p className="text-gray-700 mb-6">
                                For questions about these Terms or to exercise
                                your rights, please contact us.
                            </p>
                            <div className="space-y-4">
                                <a
                                    href="mailto:contact@volunteerfaster.com"
                                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    contact@volunteerfaster.com
                                </a>
                                <div className="text-sm text-gray-600">
                                    Response Time: Typically within 48 hours
                                </div>
                            </div>
                            <div className="mt-6 bg-white rounded-lg p-4 border border-blue-200">
                                <h4 className="font-semibold text-gray-900 mb-1">
                                    Legal Address
                                </h4>
                                <p className="text-sm text-gray-600">
                                    Plot 3118, Block 206, Kampala, Uganda
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Policy Updates */}
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <div className="flex items-center justify-center mb-3">
                        <RefreshCw className="w-5 h-5 text-gray-500 mr-2" />
                        <h3 className="text-lg font-bold text-gray-900">
                            Updates to These Terms
                        </h3>
                    </div>
                    <p className="text-gray-700 max-w-2xl mx-auto">
                        We may update these Terms periodically. Changes will be
                        posted on this page with the updated date. Continued use
                        of the Platform after updates constitutes acceptance.
                    </p>
                    <div className="mt-4 flex items-center justify-center text-gray-600">
                        <span className="text-sm font-semibold mr-3">
                            Current Version:
                        </span>
                        <span className="font-medium">v4.1</span>
                        <span className="mx-3">•</span>
                        <span className="text-sm font-semibold mr-3">
                            Effective Date:
                        </span>
                        <span className="font-medium">{lastUpdated}</span>
                    </div>
                </div>
            </div>
        </GeneralPages>
    );
}
