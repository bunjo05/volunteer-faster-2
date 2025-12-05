import GeneralPages from "@/Layouts/GeneralPages";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Contact({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [formError, setFormError] = useState("");

    // Get APP_URL for SEO
    const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    const currentUrl =
        typeof window !== "undefined" ? window.location.href : appUrl;

    // Page-specific SEO
    const pageTitle = "Contact Us | Volunteer Faster";
    const pageDescription =
        "Get in touch with Volunteer Faster. Contact our support team for questions, feedback, or assistance with volunteering opportunities.";
    const pageKeywords =
        "contact us, volunteer support, contact form, get help, customer service, volunteer questions";

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError(""); // Clear any previous errors

        post(route("contact.store"), {
            onSuccess: () => {
                setSubmitted(true);
            },
            onError: (errors) => {
                if (errors.email_suspended) {
                    setFormError(errors.email_suspended);
                }
            },
        });
    };

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
                <meta property="og:type" content="website" />
                <meta property="og:url" content={currentUrl} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta
                    property="og:image"
                    content={`${appUrl}/images/contact-preview.jpg`}
                />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta
                    property="og:image:alt"
                    content="Contact Us - Volunteer Faster"
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
                    content={`${appUrl}/images/contact-preview.jpg`}
                />
                <meta name="twitter:site" content="@volunteerfaster" />
                <meta name="twitter:creator" content="@volunteerfaster" />
                <meta
                    name="twitter:image:alt"
                    content="Contact Us - Volunteer Faster"
                />

                {/* Additional Meta Tags */}
                <link rel="canonical" href={currentUrl} />

                {/* Structured Data for SEO */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ContactPage",
                        name: pageTitle,
                        description: pageDescription,
                        url: currentUrl,
                        publisher: {
                            "@type": "Organization",
                            name: "Volunteer Faster",
                            logo: `${appUrl}/logo.png`,
                            description: "Volunteer matching platform",
                        },
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
                                    name: "Contact Us",
                                    item: currentUrl,
                                },
                            ],
                        },
                        contactPoint: {
                            "@type": "ContactPoint",
                            contactType: "customer service",
                            email: "contact@volunteerfaster.com",
                            availableLanguage: "English",
                            areaServed: "Worldwide",
                        },
                        address: {
                            "@type": "PostalAddress",
                            addressLocality: "Kampala",
                            addressCountry: "UG",
                            streetAddress: "Plot 3118, Block 206",
                        },
                    })}
                </script>
            </Head>

            <GeneralPages auth={auth} title="Contact Us">
                {/* Hero Section */}
                <section className="relative bg-blue-900 text-white py-20 md:py-28">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-600 opacity-90"></div>
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                                Get in{" "}
                                <span className="text-yellow-300">Touch</span>
                            </h1>
                            <p className="text-xl md:text-2xl opacity-90">
                                We'd love to hear from you! Reach out with
                                questions or feedback.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Centered Contact Form Section */}
                <section className="py-16 md:py-24 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-white rounded-xl shadow-md p-8 md:p-10">
                                {submitted ? (
                                    <div className="text-center py-8">
                                        <div className="text-green-500 text-5xl mb-4">
                                            ✓
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                            Thank You!
                                        </h3>
                                        <p className="text-gray-600">
                                            Your message has been sent
                                            successfully. We'll get back to you
                                            soon.
                                        </p>
                                        <div className="mt-6 text-sm text-gray-500">
                                            <p>
                                                Typically we respond within
                                                24-48 hours.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                                            Send Us a Message
                                        </h2>

                                        {/* Form-wide error message */}
                                        {formError && (
                                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                                                <div className="flex items-center">
                                                    <svg
                                                        className="h-5 w-5 text-red-500 mr-3"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    <p className="text-red-700 font-medium">
                                                        {formError}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                                            <p className="text-gray-700 text-sm">
                                                <strong>Response Time:</strong>{" "}
                                                We typically respond within
                                                24-48 hours. For urgent matters,
                                                please mention "URGENT" in your
                                                subject line.
                                            </p>
                                        </div>

                                        <form
                                            onSubmit={handleSubmit}
                                            className="space-y-6"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label
                                                        htmlFor="name"
                                                        className="block text-sm font-medium text-gray-700 mb-1"
                                                    >
                                                        Your Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        name="name"
                                                        value={data.name}
                                                        onChange={(e) =>
                                                            setData(
                                                                "name",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    />
                                                    {errors.name && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {errors.name}
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label
                                                        htmlFor="email"
                                                        className="block text-sm font-medium text-gray-700 mb-1"
                                                    >
                                                        Email Address
                                                    </label>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        value={data.email}
                                                        onChange={(e) =>
                                                            setData(
                                                                "email",
                                                                e.target.value
                                                            )
                                                        }
                                                        className={`w-full px-4 py-3 border ${
                                                            formError
                                                                ? "border-red-300"
                                                                : "border-gray-300"
                                                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                        required
                                                    />
                                                    {errors.email && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {errors.email}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="subject"
                                                    className="block text-sm font-medium text-gray-700 mb-1"
                                                >
                                                    Subject
                                                </label>
                                                <input
                                                    type="text"
                                                    id="subject"
                                                    name="subject"
                                                    value={data.subject}
                                                    onChange={(e) =>
                                                        setData(
                                                            "subject",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                                {errors.subject && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.subject}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="message"
                                                    className="block text-sm font-medium text-gray-700 mb-1"
                                                >
                                                    Your Message
                                                </label>
                                                <textarea
                                                    id="message"
                                                    name="message"
                                                    rows="5"
                                                    value={data.message}
                                                    onChange={(e) =>
                                                        setData(
                                                            "message",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                ></textarea>
                                                {errors.message && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.message}
                                                    </p>
                                                )}
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 disabled:opacity-50"
                                            >
                                                {processing
                                                    ? "Sending..."
                                                    : "Send Message"}
                                            </button>
                                        </form>

                                        {/* Additional Contact Information */}
                                        <div className="mt-8 pt-6 border-t border-gray-200">
                                            <p className="text-sm text-gray-600 text-center">
                                                You can also email us directly
                                                at{" "}
                                                <a
                                                    href="mailto:contact@volunteerfaster.com"
                                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                                >
                                                    contact@volunteerfaster.com
                                                </a>
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Contact Info Cards */}
                            {!submitted && (
                                <div className="mt-8 grid md:grid-cols-3 gap-4">
                                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                                        <div className="text-blue-600 font-semibold mb-1">
                                            Email
                                        </div>
                                        <a
                                            href="mailto:contact@volunteerfaster.com"
                                            className="text-sm text-gray-700 hover:text-blue-600"
                                        >
                                            contact@volunteerfaster.com
                                        </a>
                                    </div>
                                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                                        <div className="text-blue-600 font-semibold mb-1">
                                            Response Time
                                        </div>
                                        <div className="text-sm text-gray-700">
                                            24-48 hours
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                                        <div className="text-blue-600 font-semibold mb-1">
                                            Support Hours
                                        </div>
                                        <div className="text-sm text-gray-700">
                                            Mon-Fri, 9AM-5PM EAT
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </GeneralPages>
        </>
    );
}
