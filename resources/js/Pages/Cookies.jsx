import React from "react";
import GeneralPages from "@/Layouts/GeneralPages";
import { Head } from "@inertiajs/react";
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
    Database,
    Key,
    Clock,
    Trash2,
    ShieldCheck,
    Globe,
    FileText,
    Server,
    Users,
    EyeOff,
} from "lucide-react";

const cookieTypes = [
    {
        type: "Essential Cookies",
        icon: <Lock className="w-5 h-5" />,
        color: "bg-red-100 text-red-600",
        description: "Required for basic platform functionality and security",
        examples: [
            "Session management and user authentication tokens",
            "Security features and CSRF protection",
            "Load balancing and system stability",
            "User consent storage and preference management",
            "Fraud detection and prevention mechanisms",
        ],
        required: true,
        duration: "Session to 1 year",
        legalBasis: "Contractual necessity (GDPR 6(1)(b))",
        canDisable: "No - platform will not function properly",
    },
    {
        type: "Performance & Analytics",
        icon: <BarChart3 className="w-5 h-5" />,
        color: "bg-blue-100 text-blue-600",
        description: "Help us understand and improve platform performance",
        examples: [
            "Page visit tracking and user journey analysis (anonymized)",
            "Website performance monitoring and error detection",
            "Feature testing (A/B testing) with user segmentation",
            "Conversion tracking and funnel analysis",
            "Infrastructure monitoring and capacity planning",
        ],
        required: false,
        duration: "30 days to 2 years",
        legalBasis: "Legitimate interests (GDPR 6(1)(f))",
        canDisable: "Yes - via cookie banner or account settings",
    },
    {
        type: "Functional Cookies",
        icon: <Settings className="w-5 h-5" />,
        color: "bg-green-100 text-green-600",
        description: "Remember your preferences for enhanced experience",
        examples: [
            "Language, region, and accessibility preferences",
            "Theme, layout, and display settings",
            "Notification and communication preferences",
            "Form autocomplete and saved draft data",
            "Recent searches and browsing history",
        ],
        required: false,
        duration: "30 days to 1 year",
        legalBasis: "Consent (GDPR 6(1)(a))",
        canDisable: "Yes - preferences will reset on next visit",
    },
    {
        type: "Advertising & Marketing",
        icon: <Bell className="w-5 h-5" />,
        color: "bg-purple-100 text-purple-600",
        description: "Used for relevant advertising and campaign measurement",
        examples: [
            "Ad targeting and personalization (with user profiles)",
            "Campaign performance and ROI tracking",
            "Retargeting and remarketing cookies",
            "Social media integration and sharing analytics",
            "Affiliate marketing and partnership tracking",
        ],
        required: false,
        duration: "90 days to 2 years",
        legalBasis: "Consent (GDPR 6(1)(a))",
        canDisable: "Yes - via cookie banner or opt-out tools",
    },
    {
        type: "Social Media Cookies",
        icon: <Users className="w-5 h-5" />,
        color: "bg-cyan-100 text-cyan-600",
        description: "Set by social media platforms for integration features",
        examples: [
            "Social sharing buttons and embedded content",
            "Social login authentication and session management",
            "Social media analytics and engagement tracking",
            "Cross-site tracking for advertising purposes",
            "Social plugin performance monitoring",
        ],
        required: false,
        duration: "Session to 2 years",
        legalBasis: "Consent (GDPR 6(1)(a))",
        canDisable: "Yes - blocks social media integration features",
    },
    {
        type: "Third-Party Service Cookies",
        icon: <Server className="w-5 h-5" />,
        color: "bg-amber-100 text-amber-600",
        description: "Set by integrated third-party services we use",
        examples: [
            "Payment processing (Stripe, PayPal) security tokens",
            "Analytics services (Google Analytics, Mixpanel)",
            // "Customer support (Intercom, Zendesk) session cookies",
            "Cloud services (AWS, Cloudflare) performance cookies",
            "Email marketing tracking pixels",
        ],
        required: false,
        duration: "Session to 5 years",
        legalBasis: "Consent (GDPR 6(1)(a)) or Legitimate Interests",
        canDisable: "Partial - may affect specific service functionality",
    },
];

const trackingTechnologies = [
    {
        technology: "Cookies",
        description: "Small text files stored on your device",
        purpose: "Session management, preferences, authentication",
        icon: <Cookie className="w-5 h-5" />,
        control: "Browser settings or consent management",
    },
    {
        technology: "Local Storage",
        description: "HTML5 storage mechanism for larger data",
        purpose: "Caching, offline functionality, large preferences",
        icon: <Database className="w-5 h-5" />,
        control: "Browser settings (clear site data)",
    },
    {
        technology: "Session Storage",
        description: "Temporary storage for single browsing session",
        purpose: "Form data, temporary preferences, session data",
        icon: <Clock className="w-5 h-5" />,
        control: "Automatically cleared when browser closes",
    },
    {
        technology: "Web Beacons",
        description: "Tiny transparent images for tracking",
        purpose: "Email open tracking, page view monitoring",
        icon: <Eye className="w-5 h-5" />,
        control: "Email client settings or image blocking",
    },
    {
        technology: "Pixel Tags",
        description: "1x1 pixel images embedded in content",
        purpose: "Conversion tracking, ad performance measurement",
        icon: <Filter className="w-5 h-5" />,
        control: "Browser extensions or privacy settings",
    },
    {
        technology: "Device Fingerprinting",
        description: "Combination of device characteristics",
        purpose: "Fraud prevention, security, unique identification",
        icon: <Key className="w-5 h-5" />,
        control: "Browser privacy settings or anti-fingerprinting tools",
    },
];

const browserGuides = [
    {
        browser: "Google Chrome",
        steps: "Settings → Privacy and security → Cookies and other site data → See all cookies and site data",
        link: "https://support.google.com/chrome/answer/95647",
        advanced: "chrome://settings/content/cookies",
    },
    {
        browser: "Mozilla Firefox",
        steps: "Options → Privacy & Security → Cookies and Site Data → Manage Data",
        link: "https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop",
        advanced: "about:preferences#privacy",
    },
    {
        browser: "Safari",
        steps: "Preferences → Privacy → Cookies and website data → Manage Website Data",
        link: "https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac",
        advanced: "Develop → Show Web Inspector → Storage",
    },
    {
        browser: "Microsoft Edge",
        steps: "Settings → Cookies and site permissions → Cookies and site data → See all cookies and site data",
        link: "https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09",
        advanced: "edge://settings/content/cookies",
    },
    {
        browser: "Brave",
        steps: "Settings → Shields → Cookies → Block all cookies or Block third-party cookies",
        link: "https://support.brave.com/hc/en-us/articles/360050085591-How-do-I-use-Shields-while-browsing",
        advanced: "Built-in cookie control via Shields",
    },
];

const thirdPartyServices = [
    {
        name: "Google Analytics 4",
        purpose: "Website analytics and usage tracking",
        cookies: ["_ga", "_gid", "_gat", "_gac_*"],
        retention: "2 years",
        // optOut: "https://tools.google.com/dlpage/gaoptout",
        privacy: "https://policies.google.com/privacy",
    },
    {
        name: "Stripe",
        purpose: "Payment processing and fraud prevention",
        cookies: ["__stripe_mid", "__stripe_sid", "machine_identifier"],
        retention: "1 year",
        // optOut: "Not applicable - essential for payments",
        privacy: "https://stripe.com/privacy",
    },
    {
        name: "Cloudflare",
        purpose: "Security, performance, and DDoS protection",
        cookies: ["__cf_bm", "__cfduid", "__cflb"],
        retention: "30 days",
        // optOut: "Not applicable - essential for security",
        privacy: "https://www.cloudflare.com/privacypolicy/",
    },
    {
        name: "Social Media Platforms",
        purpose: "Social sharing, login, and advertising",
        cookies: ["Various platform-specific cookies"],
        retention: "Varies by platform",
        // optOut: "Platform-specific privacy settings",
        privacy: "Platform privacy policies",
    },
    {
        name: "Hotjar",
        purpose: "User behavior analytics and heatmaps",
        cookies: ["_hj*", "_hjid", "_hjIncludedInSample"],
        retention: "365 days",
        // optOut: "https://www.hotjar.com/legal/compliance/opt-out",
        privacy: "https://www.hotjar.com/legal/policies/privacy",
    },
];

const userRights = [
    {
        right: "Right to Information",
        description: "Clear information about all tracking technologies used",
        icon: <Eye className="w-5 h-5" />,
        implementation: "Detailed in this policy with specific examples",
    },
    {
        right: "Right to Consent",
        description: "Granular consent for different cookie categories",
        icon: <CheckCircle className="w-5 h-5" />,
        implementation: "Cookie banner with category-wise opt-in/opt-out",
    },
    {
        right: "Right to Withdraw Consent",
        description: "Change preferences at any time with immediate effect",
        icon: <RefreshCw className="w-5 h-5" />,
        implementation: "Account settings or cookie preference center",
    },
    {
        right: "Right to Object",
        description: "Object to processing based on legitimate interests",
        icon: <AlertCircle className="w-5 h-5" />,
        implementation: "Contact DPO or use objection form",
    },
    {
        right: "Right to Access",
        description: "Access information about cookies stored on your device",
        icon: <FileText className="w-5 h-5" />,
        implementation: "Browser cookie inspection tools",
    },
    {
        right: "Right to Deletion",
        description: "Remove cookies and tracking data from your device",
        icon: <Trash2 className="w-5 h-5" />,
        implementation: "Browser settings to clear site data",
    },
];

const retentionPeriods = [
    {
        category: "Session Cookies",
        duration: "Until browser closes",
        examples: "Authentication tokens, form data, temporary preferences",
        legalBasis: "Contractual necessity",
    },
    {
        category: "Short-term Cookies",
        duration: "24 hours to 30 days",
        examples: "Analytics sessions, security tokens, A/B testing",
        legalBasis: "Legitimate interests or consent",
    },
    {
        category: "Medium-term Cookies",
        duration: "30 days to 1 year",
        examples: "User preferences, login remember me, language settings",
        legalBasis: "Consent",
    },
    {
        category: "Long-term Cookies",
        duration: "1 to 5 years",
        examples: "Advertising IDs, analytics user IDs, fraud prevention",
        legalBasis: "Consent with periodic renewal",
    },
];

export default function Cookies({ auth }) {
    const lastUpdated = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    const currentUrl =
        typeof window !== "undefined" ? window.location.href : appUrl;

    const pageTitle =
        "Cookie & Tracking Technologies Policy | Volunteer Faster";
    const pageDescription =
        "Comprehensive policy covering cookies, local storage, web beacons, and other tracking technologies with full user control and GDPR/ePrivacy compliance.";
    const pageKeywords =
        "cookie policy, tracking technologies, GDPR cookies, ePrivacy, cookie consent, privacy settings, data protection, web storage";

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
                    content={`${appUrl}/images/cookie-policy-preview.jpg`}
                />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta
                    property="og:image:alt"
                    content="Cookie Policy - Volunteer Faster"
                />
                <meta property="og:site_name" content="Volunteer Faster" />
                <meta property="og:locale" content="en_US" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={currentUrl} />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
                <meta
                    name="twitter:image"
                    content={`${appUrl}/images/cookie-policy-preview.jpg`}
                />
                <meta name="twitter:site" content="@volunteerfaster" />
                <meta name="twitter:creator" content="@volunteerfaster" />
                <meta
                    name="twitter:image:alt"
                    content="Cookie Policy - Volunteer Faster"
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
                                    name: "Cookie Policy",
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
                                logo: {
                                    "@type": "ImageObject",
                                    url: `${appUrl}/logo.png`,
                                },
                            },
                            datePublished: lastUpdated,
                            dateModified: lastUpdated,
                        },
                        about: {
                            "@type": "Thing",
                            name: "Cookie Consent Management",
                        },
                    })}
                </script>
            </Head>

            <GeneralPages auth={auth} title="Cookie Policy">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl mb-6">
                            <ShieldCheck className="w-10 h-10 text-blue-600" />
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
                            <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                                v4.2 - Enhanced Controls
                            </span>
                            <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                Updated: {lastUpdated}
                            </span>
                            <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                                GDPR & ePrivacy Compliant
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Cookie & Tracking Technologies Policy
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Comprehensive policy detailing all tracking
                            technologies used by{" "}
                            <span className="font-bold text-blue-600">
                                Volunteer Faster
                            </span>
                            , including cookies, local storage, web beacons, and
                            your complete control over them.
                        </p>
                    </div>

                    {/* Critical Notice */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-r-xl p-6 mb-10">
                        <div className="flex items-start">
                            <AlertCircle className="w-6 h-6 text-blue-600 mt-1 mr-4 flex-shrink-0" />
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Enhanced User Control & Transparency
                                </h2>
                                <p className="text-gray-700 mb-3">
                                    Under GDPR and ePrivacy regulations, you
                                    have comprehensive rights over tracking
                                    technologies. This policy provides detailed
                                    information and granular controls for all
                                    tracking methods we use.
                                </p>
                                <div className="bg-white rounded-lg p-4">
                                    <p className="text-sm text-gray-700">
                                        <strong>Key Principle:</strong> Granular
                                        consent by category, right to withdraw
                                        anytime, and full transparency about
                                        data retention and third-party access.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tracking Technologies Overview */}
                    <section className="mb-12">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                                <Database className="w-6 h-6 text-blue-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                Tracking Technologies We Use
                            </h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trackingTechnologies.map((tech) => (
                                <div
                                    key={tech.technology}
                                    className="bg-white rounded-xl border border-gray-200 p-6"
                                >
                                    <div className="flex items-center mb-4">
                                        <div className="text-blue-500 mr-3">
                                            {tech.icon}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {tech.technology}
                                        </h3>
                                    </div>
                                    <p className="text-gray-700 text-sm mb-3">
                                        {tech.description}
                                    </p>
                                    <div className="mb-3">
                                        <h4 className="text-xs font-semibold text-gray-500 mb-1">
                                            Primary Purpose:
                                        </h4>
                                        <p className="text-sm text-gray-700">
                                            {tech.purpose}
                                        </p>
                                    </div>
                                    <div className="pt-3 border-t border-gray-100">
                                        <h4 className="text-xs font-semibold text-gray-500 mb-1">
                                            Your Control:
                                        </h4>
                                        <p className="text-sm text-gray-700">
                                            {tech.control}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Cookie Categories Section */}
                    <section className="mb-12">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Cookie Categories & Legal Basis
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Detailed categorization with GDPR legal basis,
                                retention periods, and control options
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    {cookie.type}
                                                </h3>
                                                <p className="text-gray-600 text-sm">
                                                    {cookie.description}
                                                </p>
                                            </div>
                                        </div>
                                        {cookie.required ? (
                                            <span className="text-xs font-semibold bg-red-100 text-red-600 px-2 py-1 rounded">
                                                Essential
                                            </span>
                                        ) : (
                                            <span className="text-xs font-semibold bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                                Optional
                                            </span>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <h4 className="text-sm font-semibold text-gray-500 mb-2">
                                            Examples:
                                        </h4>
                                        <ul className="space-y-2">
                                            {cookie.examples.map(
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
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-gray-100">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">
                                                Duration:
                                            </span>
                                            <span className="text-xs font-medium text-gray-700">
                                                {cookie.duration}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">
                                                Legal Basis:
                                            </span>
                                            <span className="text-xs font-medium text-blue-600">
                                                {cookie.legalBasis}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">
                                                Can Disable:
                                            </span>
                                            <span
                                                className={`text-xs font-medium ${
                                                    cookie.canDisable.startsWith(
                                                        "Yes"
                                                    )
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {cookie.canDisable}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Data Retention Periods */}
                    <section className="mb-12">
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                                    <Clock className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">
                                        Data Retention Periods
                                    </h2>
                                    <p className="text-gray-600">
                                        Clear retention schedules for different
                                        cookie categories
                                    </p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {retentionPeriods.map((period) => (
                                    <div
                                        key={period.category}
                                        className="bg-white rounded-xl border border-gray-200 p-6"
                                    >
                                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                                            {period.category}
                                        </h3>
                                        <div className="mb-4">
                                            <div className="text-2xl font-bold text-blue-600 mb-1">
                                                {period.duration}
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                Maximum Retention
                                            </span>
                                        </div>
                                        <div className="mb-3">
                                            <h4 className="text-xs font-semibold text-gray-500 mb-1">
                                                Examples:
                                            </h4>
                                            <p className="text-sm text-gray-700">
                                                {period.examples}
                                            </p>
                                        </div>
                                        <div className="pt-3 border-t border-gray-100">
                                            <span className="text-xs text-gray-500">
                                                Legal Basis:{" "}
                                            </span>
                                            <span className="text-xs font-medium text-blue-600">
                                                {period.legalBasis}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Third-Party Services Detailed */}
                    <section className="mb-12">
                        <div className="bg-gray-50 rounded-2xl p-8">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                                    <Filter className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">
                                        Third-Party Services & Cookies
                                    </h2>
                                    <p className="text-gray-600">
                                        Detailed information about external
                                        services and their cookies
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {thirdPartyServices.map((service) => (
                                    <div
                                        key={service.name}
                                        className="bg-white rounded-xl border border-gray-200 p-6"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">
                                                    {service.name}
                                                </h3>
                                                <p className="text-gray-700">
                                                    {service.purpose}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-2 mt-2 md:mt-0">
                                                <a
                                                    href={service.privacy}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                >
                                                    Privacy Policy
                                                </a>
                                                {/* {service.optOut !==
                                                    "Not applicable" && (
                                                    <a
                                                        href={service.optOut}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                    >
                                                        Opt-Out
                                                    </a>
                                                )} */}
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-500 mb-2">
                                                    Cookie Names:
                                                </h4>
                                                <div className="flex flex-wrap gap-1">
                                                    {service.cookies.map(
                                                        (cookie, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                                            >
                                                                {cookie}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-500 mb-2">
                                                    Retention:
                                                </h4>
                                                <p className="text-sm text-gray-700">
                                                    {service.retention}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Your Rights & Controls */}
                    <section className="mb-12">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                <Shield className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Your Rights & Controls
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Comprehensive rights under GDPR and ePrivacy
                                Directive
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {userRights.map((right) => (
                                <div
                                    key={right.right}
                                    className="bg-white rounded-xl border border-gray-200 p-6"
                                >
                                    <div className="flex items-center mb-3">
                                        <div className="text-blue-500 mr-3">
                                            {right.icon}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {right.right}
                                        </h3>
                                    </div>
                                    <p className="text-gray-700 text-sm mb-3">
                                        {right.description}
                                    </p>
                                    <div className="pt-3 border-t border-gray-100">
                                        <span className="text-xs text-gray-500">
                                            Implementation:{" "}
                                        </span>
                                        <span className="text-xs font-medium text-blue-600">
                                            {right.implementation}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                How to Exercise Your Rights
                            </h3>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-white rounded-xl p-5">
                                    <h4 className="font-bold text-gray-900 mb-2">
                                        Cookie Consent Banner
                                    </h4>
                                    <p className="text-sm text-gray-700 mb-3">
                                        Granular controls for each cookie
                                        category on first visit and any time via
                                        banner
                                    </p>
                                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                        Show Consent Banner →
                                    </button>
                                </div>
                                <div className="bg-white rounded-xl p-5">
                                    <h4 className="font-bold text-gray-900 mb-2">
                                        Account Settings
                                    </h4>
                                    <p className="text-sm text-gray-700 mb-3">
                                        Persistent preference management in your
                                        account settings dashboard
                                    </p>
                                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                        Go to Settings →
                                    </button>
                                </div>
                                <div className="bg-white rounded-xl p-5">
                                    <h4 className="font-bold text-gray-900 mb-2">
                                        Browser Controls
                                    </h4>
                                    <p className="text-sm text-gray-700 mb-3">
                                        Complete control via browser settings
                                        for all tracking technologies
                                    </p>
                                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                        See Browser Guides →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Browser Management Guides */}
                    <section className="mb-12">
                        <div className="bg-white rounded-2xl border border-gray-200 p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                Browser-Specific Management Guides
                            </h2>
                            <div className="space-y-4">
                                {browserGuides.map((browser) => (
                                    <div
                                        key={browser.browser}
                                        className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                            <span className="font-semibold text-gray-900 text-lg">
                                                {browser.browser}
                                            </span>
                                            <div className="flex space-x-3 mt-2 md:mt-0">
                                                <a
                                                    href={browser.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                                >
                                                    Official Guide{" "}
                                                    <ExternalLink className="w-3 h-3 ml-1" />
                                                </a>
                                                {/* {browser.advanced && (
                                                    <button className="text-gray-600 hover:text-gray-800 text-sm">
                                                        Advanced Settings
                                                    </button>
                                                )} */}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-700 mb-2">
                                            {browser.steps}
                                        </p>
                                        {browser.advanced && (
                                            <p className="text-xs text-gray-500">
                                                Advanced: {browser.advanced}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Contact & Updates Section */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <div className="flex items-center mb-4">
                                    <Mail className="w-6 h-6 text-blue-600 mr-3" />
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        Contact & Compliance
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2">
                                            Privacy Team
                                        </h4>
                                        <a
                                            href="mailto:privacy@volunteerfaster.com"
                                            className="text-blue-600 hover:text-blue-800 font-medium block mb-1"
                                        >
                                            privacy@volunteerfaster.com
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
                                            For GDPR and cookie compliance
                                            inquiries:
                                        </p>
                                        <a
                                            href="mailto:dpo@volunteerfaster.com"
                                            className="text-blue-600 hover:text-blue-800 text-sm"
                                        >
                                            dpo@volunteerfaster.com
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center mb-4">
                                    <RefreshCw className="w-6 h-6 text-blue-600 mr-3" />
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        Policy Updates & Compliance
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
                                                Renewal of consent for affected
                                                cookie categories
                                            </li>
                                            <li>
                                                In-platform notifications and
                                                email alerts
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
                                            v4.2
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
                        </div>
                    </div>

                    {/* Final Declaration */}
                    <div className="mt-8 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-8 text-white text-center">
                        <h3 className="text-2xl font-bold mb-4">
                            Compliance Declaration
                        </h3>
                        <p className="mb-6 opacity-90 max-w-2xl mx-auto">
                            Volunteer Faster complies with GDPR, ePrivacy
                            Directive, and global cookie regulations, providing
                            transparent information and granular controls for
                            all tracking technologies.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                                <span>
                                    GDPR Article 6 & 7: Valid Consent Mechanisms
                                </span>
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                                <span>
                                    ePrivacy Directive: Prior Informed Consent
                                </span>
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                                <span>
                                    Granular Controls & Right to Withdraw
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </GeneralPages>
        </>
    );
}
