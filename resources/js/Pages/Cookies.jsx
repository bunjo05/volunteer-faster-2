import React from "react";
import GeneralPages from "@/Layouts/GeneralPages";
import {
    Cookie,
    Shield,
    Settings,
    Eye,
    Bell,
    RefreshCw,
    Mail,
    Lock,
    BarChart3,
    Filter,
    ExternalLink,
    AlertCircle,
    CheckCircle,
} from "lucide-react";

const cookieTypes = [
    {
        type: "Essential Cookies",
        icon: <Lock className="w-5 h-5" />,
        color: "bg-red-100 text-red-600",
        description: "Required for basic platform functionality",
        examples: [
            "Session management and user authentication",
            "Security features and fraud prevention",
            "Load balancing and system stability",
            "Shopping cart functionality (if applicable)",
        ],
        required: true,
        duration: "Session to 1 year",
    },
    {
        type: "Performance Cookies",
        icon: <BarChart3 className="w-5 h-5" />,
        color: "bg-blue-100 text-blue-600",
        description: "Help us understand user interactions",
        examples: [
            "Page visit tracking and user journey analysis",
            "Website performance monitoring",
            "Error detection and debugging",
            "Feature testing (A/B testing)",
        ],
        required: false,
        duration: "30 days to 2 years",
    },
    {
        type: "Functional Cookies",
        icon: <Settings className="w-5 h-5" />,
        color: "bg-green-100 text-green-600",
        description: "Remember your preferences for enhanced experience",
        examples: [
            "Language and region preferences",
            "Theme and display settings",
            "Notification preferences",
            "Form autocomplete data",
        ],
        required: false,
        duration: "30 days to 1 year",
    },
    {
        type: "Marketing Cookies",
        icon: <Bell className="w-5 h-5" />,
        color: "bg-purple-100 text-purple-600",
        description: "Used for advertising and campaign measurement",
        examples: [
            "Ad targeting and personalization",
            "Campaign performance tracking",
            "Conversion tracking",
            "Social media integration",
        ],
        required: false,
        duration: "90 days to 2 years",
    },
];

const browserGuides = [
    {
        browser: "Google Chrome",
        steps: "Settings → Privacy and security → Cookies and other site data",
        link: "https://support.google.com/chrome/answer/95647",
    },
    {
        browser: "Mozilla Firefox",
        steps: "Options → Privacy & Security → Cookies and Site Data",
        link: "https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop",
    },
    {
        browser: "Safari",
        steps: "Preferences → Privacy → Cookies and website data",
        link: "https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac",
    },
    {
        browser: "Microsoft Edge",
        steps: "Settings → Cookies and site permissions → Cookies and site data",
        link: "https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09",
    },
];

const thirdPartyServices = [
    {
        name: "Google Analytics",
        purpose: "Website analytics and usage tracking",
    },
    { name: "Stripe", purpose: "Payment processing and security" },
    { name: "Cloudflare", purpose: "Security and performance optimization" },
    {
        name: "Social Media Platforms",
        purpose: "Social sharing and integration",
    },
];

export default function Cookies({ auth }) {
    const lastUpdated = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <GeneralPages auth={auth} title="Cookie Policy">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl mb-6">
                        <Cookie className="w-10 h-10 text-blue-600" />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
                        <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            Transparency & Control
                        </span>
                        <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                            Updated: {lastUpdated}
                        </span>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Cookie Policy
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        This policy explains how{" "}
                        <span className="font-bold text-blue-600">
                            Volunteer Faster
                        </span>
                        uses cookies and similar technologies to enhance your
                        experience while respecting your privacy and choices.
                    </p>
                </div>

                {/* Introduction Card */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-10">
                    <div className="flex items-start">
                        <Shield className="w-8 h-8 text-blue-600 mt-1 mr-4 flex-shrink-0" />
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Your Privacy Matters
                            </h2>
                            <p className="text-gray-700">
                                Cookies help us provide a secure, personalized,
                                and efficient experience on our platform. We
                                believe in transparency about what data we
                                collect and how we use it. You have full control
                                over your cookie preferences at any time.
                            </p>
                        </div>
                    </div>
                </div>

                {/* What Are Cookies Section */}
                <section className="mb-12">
                    <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                            <Eye className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">
                            What Are Cookies?
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                Definition & Purpose
                            </h3>
                            <p className="text-gray-700 mb-4">
                                Cookies are small text files placed on your
                                device when you visit websites. They serve as
                                memory for websites, enabling them to recognize
                                your device and remember your preferences, login
                                status, and other useful information.
                            </p>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600">
                                    <strong>Analogy:</strong> Like a coat check
                                    ticket – you get a token that helps the
                                    system remember what belongs to you without
                                    carrying everything with you.
                                </p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                How They Work
                            </h3>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">
                                        Stored locally on your device
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">
                                        Sent back to server with each request
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">
                                        Enable personalized browsing experiences
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">
                                        Help prevent fraudulent activities
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Cookie Types Section */}
                <section className="mb-12">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Types of Cookies We Use
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            We categorize cookies based on their purpose and
                            necessity for platform functionality
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {cookieTypes.map((cookie) => (
                            <div
                                key={cookie.type}
                                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center">
                                        <div
                                            className={`${cookie.color} w-10 h-10 rounded-lg flex items-center justify-center mr-4`}
                                        >
                                            {cookie.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {cookie.type}
                                            </h3>
                                            <p className="text-gray-600 text-sm">
                                                {cookie.description}
                                            </p>
                                        </div>
                                    </div>
                                    {cookie.required ? (
                                        <span className="text-xs font-semibold bg-red-100 text-red-600 px-2 py-1 rounded">
                                            Required
                                        </span>
                                    ) : (
                                        <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                            Optional
                                        </span>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-gray-500 mb-2">
                                        Examples:
                                    </h4>
                                    <ul className="space-y-2">
                                        {cookie.examples.map((example, idx) => (
                                            <li
                                                key={idx}
                                                className="flex items-start"
                                            >
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                                <span className="text-gray-700">
                                                    {example}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <span className="text-sm text-gray-500">
                                        Duration:{" "}
                                        <strong>{cookie.duration}</strong>
                                    </span>
                                    <span
                                        className={`text-xs px-2 py-1 rounded ${
                                            cookie.required
                                                ? "bg-red-50 text-red-600"
                                                : "bg-gray-50 text-gray-600"
                                        }`}
                                    >
                                        {cookie.required
                                            ? "Cannot be disabled"
                                            : "Can be managed"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Third-Party Cookies Section */}
                <section className="mb-12">
                    <div className="bg-gray-50 rounded-2xl p-6">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                                <Filter className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">
                                    Third-Party Cookies
                                </h2>
                                <p className="text-gray-600">
                                    Services we integrate with may set their own
                                    cookies
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-700 mb-4">
                                We partner with trusted third-party services to
                                enhance platform functionality. These services
                                may set their own cookies, which are governed by
                                their respective privacy policies.
                            </p>
                            <div className="bg-white rounded-xl border border-gray-200 p-4">
                                <h4 className="font-semibold text-gray-900 mb-3">
                                    Common Services:
                                </h4>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {thirdPartyServices.map((service) => (
                                        <div
                                            key={service.name}
                                            className="flex items-center p-3 bg-gray-50 rounded-lg"
                                        >
                                            <ExternalLink className="w-4 h-4 text-gray-400 mr-3" />
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {service.name}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {service.purpose}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Cookie Control Section */}
                <section className="mb-12">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                            <Settings className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Managing Your Cookie Preferences
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            You have full control over how cookies are used on
                            your device
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Browser Settings
                            </h3>
                            <p className="text-gray-700 mb-6">
                                Most browsers allow you to control cookies
                                through their settings. Here's how to manage
                                them in popular browsers:
                            </p>

                            <div className="space-y-4">
                                {browserGuides.map((browser) => (
                                    <div
                                        key={browser.browser}
                                        className="p-4 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-semibold text-gray-900">
                                                {browser.browser}
                                            </span>
                                            <a
                                                href={browser.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                            >
                                                Guide{" "}
                                                <ExternalLink className="w-3 h-3 ml-1" />
                                            </a>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {browser.steps}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Platform Cookie Settings
                            </h3>
                            <p className="text-gray-700 mb-6">
                                You can also manage your cookie preferences
                                directly through our platform:
                            </p>

                            <div className="space-y-4">
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <div className="flex items-center mb-2">
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                                        <h4 className="font-semibold text-gray-900">
                                            Consent Banner
                                        </h4>
                                    </div>
                                    <p className="text-gray-700 text-sm">
                                        When you first visit, use our consent
                                        banner to accept or decline optional
                                        cookies. Your preferences are saved for
                                        future visits.
                                    </p>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center mb-2">
                                        <RefreshCw className="w-5 h-5 text-blue-500 mr-3" />
                                        <h4 className="font-semibold text-gray-900">
                                            Update Preferences
                                        </h4>
                                    </div>
                                    <p className="text-gray-700 text-sm">
                                        Change your mind anytime through your
                                        account settings or by clearing your
                                        browser cookies.
                                    </p>
                                </div>

                                <div className="p-4 bg-amber-50 rounded-lg">
                                    <div className="flex items-center mb-2">
                                        <AlertCircle className="w-5 h-5 text-amber-500 mr-3" />
                                        <h4 className="font-semibold text-gray-900">
                                            Important Note
                                        </h4>
                                    </div>
                                    <p className="text-gray-700 text-sm">
                                        Disabling essential cookies may prevent
                                        certain features from working properly,
                                        including login and security functions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <div className="text-center">
                        <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
                            <Settings className="w-5 h-5 mr-2" />
                            Manage Cookie Preferences
                        </button>
                    </div> */}
                </section>

                {/* Contact & Updates Section */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <Mail className="w-6 h-6 text-blue-600 mr-3" />
                                <h3 className="text-2xl font-bold text-gray-900">
                                    Contact Us
                                </h3>
                            </div>
                            <p className="text-gray-700 mb-4">
                                If you have questions about our Cookie Policy or
                                need assistance with managing your preferences,
                                our privacy team is here to help.
                            </p>
                            <a
                                href="mailto:privacy@volunteerfaster.com"
                                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                            >
                                privacy@volunteerfaster.com
                                <ExternalLink className="w-4 h-4 ml-2" />
                            </a>
                        </div>

                        <div>
                            <div className="flex items-center mb-4">
                                <RefreshCw className="w-6 h-6 text-blue-600 mr-3" />
                                <h3 className="text-2xl font-bold text-gray-900">
                                    Policy Updates
                                </h3>
                            </div>
                            <p className="text-gray-700 mb-4">
                                We may update this policy to reflect changes in
                                technology, regulations, or our services.
                                Significant changes will be communicated through
                                platform notifications.
                            </p>
                            <div className="flex items-center text-gray-600">
                                <span className="text-sm font-semibold mr-3">
                                    Last Updated:
                                </span>
                                <span className="font-medium">
                                    {lastUpdated}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GeneralPages>
    );
}
