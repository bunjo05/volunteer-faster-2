import React from "react";
import GeneralPages from "@/Layouts/GeneralPages";
import {
    Shield,
    Users,
    MessageSquare,
    AlertTriangle,
    FileText,
    DollarSign,
    Award,
    Flag,
} from "lucide-react";
import { Link } from "@inertiajs/react";

const guidelines = [
    {
        id: 1,
        title: "Respect & Conduct",
        icon: <Users className="w-5 h-5" />,
        description:
            "Maintain a respectful environment for all community members",
        points: [
            "No harassment, hate speech, or discriminatory behavior",
            "Respect cultural differences and local laws",
            "Communicate professionally and constructively",
        ],
    },
    {
        id: 2,
        title: "Honesty & Authenticity",
        icon: <Shield className="w-5 h-5" />,
        description: "Ensure transparency and trust in all interactions",
        points: [
            "No fake accounts or impersonation",
            "No falsified documents or project reports",
            "Accurate representation of skills and experience",
        ],
    },
    {
        id: 3,
        title: "Safety & Security",
        icon: <AlertTriangle className="w-5 h-5" />,
        description: "Protect the well-being of all community members",
        points: [
            "No unsafe project postings or activities",
            "No exploitation of volunteers",
            "Compliance with safety instructions and protocols",
        ],
    },
    {
        id: 4,
        title: "Content Standards",
        icon: <FileText className="w-5 h-5" />,
        description: "Maintain appropriate and professional content",
        points: [
            "No nudity, violence, or illegal content",
            "No offensive or inappropriate material",
            "No spam or unsolicited promotions",
        ],
    },
    {
        id: 5,
        title: "Fundraising Integrity",
        icon: <DollarSign className="w-5 h-5" />,
        description: "Ensure transparency in all financial matters",
        points: [
            "Fundraising requests must be truthful and documented",
            "Raised funds must be used for their stated purpose",
            "Fraudulent campaigns result in permanent ban and legal action",
        ],
    },
    {
        id: 6,
        title: "Points System",
        icon: <Award className="w-5 h-5" />,
        description: "Fair use of recognition and reward systems",
        points: [
            "No manipulation or abuse of points system",
            "No unauthorized selling or trading of points",
            "Points must be earned through legitimate contributions",
        ],
    },
    {
        id: 7,
        title: "Reporting & Compliance",
        icon: <Flag className="w-5 h-5" />,
        description: "Help maintain community standards",
        points: [
            "Report fraud and safety concerns immediately",
            "Report misconduct and guideline violations",
            "All reports are reviewed by Volunteer Faster administration",
        ],
    },
    {
        id: 8,
        title: "Communication",
        icon: <MessageSquare className="w-5 h-5" />,
        description: "Professional and monitored communication channels",
        points: [
            "All communications are monitored for quality assurance",
            "Maintain professional tone in all interactions",
            "Respect privacy and confidentiality",
        ],
    },
];

export default function Community({ auth }) {
    return (
        <GeneralPages auth={auth} title="Community Guidelines">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                        <Shield className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Community Guidelines
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        These guidelines ensure a safe, respectful, and
                        productive environment for all Volunteer Faster
                        community members worldwide. By participating, you agree
                        to uphold these standards.
                    </p>
                </div>

                {/* Introduction */}
                <div className="bg-blue-50 rounded-xl p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                        Our Commitment to Community Safety
                    </h2>
                    <p className="text-gray-700">
                        Volunteer Faster is committed to maintaining a global
                        community where volunteers and organizations can
                        collaborate safely and effectively. These guidelines are
                        enforced by our administration team to protect all
                        members and ensure the integrity of our platform.
                    </p>
                </div>

                {/* Guidelines Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {guidelines.map((guideline) => (
                        <div
                            key={guideline.id}
                            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
                        >
                            <div className="flex items-start space-x-4 mb-4">
                                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <div className="text-blue-600">
                                        {guideline.icon}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {guideline.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mt-1">
                                        {guideline.description}
                                    </p>
                                </div>
                            </div>
                            <ul className="space-y-2">
                                {guideline.points.map((point, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start"
                                    >
                                        <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                        <span className="text-gray-700">
                                            {point}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Enforcement Section */}
                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Enforcement & Consequences
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 bg-white rounded-lg">
                            <div className="text-blue-600 font-semibold mb-2">
                                Warning
                            </div>
                            <p className="text-sm text-gray-600">
                                First-time minor violations result in a formal
                                warning and temporary restrictions.
                            </p>
                        </div>
                        <div className="p-4 bg-white rounded-lg">
                            <div className="text-orange-600 font-semibold mb-2">
                                Suspension
                            </div>
                            <p className="text-sm text-gray-600">
                                Repeated or serious violations lead to temporary
                                suspension from the platform.
                            </p>
                        </div>
                        <div className="p-4 bg-white rounded-lg">
                            <div className="text-red-600 font-semibold mb-2">
                                Permanent Ban
                            </div>
                            <p className="text-sm text-gray-600">
                                Severe violations, fraud, or repeated offenses
                                result in permanent removal.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="text-center border-t border-gray-200 pt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Need to Report a Concern?
                    </h3>
                    <p className="text-gray-600 mb-4">
                        All reports are reviewed by our administration team
                        within 24-48 hours.
                    </p>

                    <Link
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        href={route("contact")}
                    >
                        <Flag className="w-4 h-4 mr-2" />
                        Report an Issue
                    </Link>
                    <p className="text-sm text-gray-500 mt-4">
                        Last updated:{" "}
                        {new Date().toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                </div>
            </div>
        </GeneralPages>
    );
}
