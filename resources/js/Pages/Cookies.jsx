import React from "react";
import GeneralPages from "@/Layouts/GeneralPages";

export default function Cookies() {
    return (
        <GeneralPages>
            <div className="max-w-4xl mx-auto p-6 text-gray-800">
                <p className="mt-6 text-sm text-gray-500">
                    Last updated: {new Date().toLocaleDateString()}
                </p>
                <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>

                <p className="mb-4">
                    This Cookie Policy explains how Volunteer Faster (“we”,
                    “our”, or “us”) uses cookies and similar technologies to
                    recognize you when you visit our platform. It explains what
                    these technologies are, why we use them, and your rights to
                    control our use of them.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    1. What Are Cookies?
                </h2>
                <p className="mb-4">
                    Cookies are small text files that are stored on your
                    computer or mobile device when you visit a website. Cookies
                    help us improve your browsing experience and understand how
                    our site is used.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    2. Types of Cookies We Use
                </h2>
                <ul className="list-disc list-inside mb-4">
                    <li>
                        <strong>Essential Cookies:</strong> These are necessary
                        for the platform to function properly (e.g., login,
                        security).
                    </li>
                    <li>
                        <strong>Performance Cookies:</strong> These help us
                        understand how visitors interact with our website (e.g.,
                        page visits, load times).
                    </li>
                    <li>
                        <strong>Functional Cookies:</strong> These allow us to
                        remember your preferences and enhance functionality
                        (e.g., language settings).
                    </li>
                    <li>
                        <strong>Marketing Cookies:</strong> These are used to
                        deliver advertisements that are relevant to you and
                        measure campaign effectiveness. We use these only with
                        your consent.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    3. Third-Party Cookies
                </h2>
                <p className="mb-4">
                    We may allow third-party services such as Google Analytics
                    to set cookies on your device to collect information about
                    your interactions with our website. These third parties have
                    their own privacy and cookie policies.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    4. How You Can Control Cookies
                </h2>
                <p className="mb-4">
                    You can control and manage cookies through your browser
                    settings. Most browsers allow you to:
                </p>
                <ul className="list-disc list-inside mb-4">
                    <li>View what cookies are stored.</li>
                    <li>Delete existing cookies.</li>
                    <li>
                        Block cookies from specific websites or all websites.
                    </li>
                </ul>
                <p className="mb-4">
                    Please note that disabling cookies may affect the
                    functionality of the website.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    5. Your Consent
                </h2>
                <p className="mb-4">
                    When you first visit our site, we ask for your consent to
                    use cookies that are not strictly necessary. You can change
                    or withdraw your consent at any time by adjusting your
                    cookie settings or clearing your browser cache.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    6. Changes to This Policy
                </h2>
                <p className="mb-4">
                    We may update this Cookie Policy to reflect changes in our
                    practices or legal requirements. Any changes will be posted
                    on this page with the updated date.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    7. Contact Us
                </h2>
                <p className="mb-4">
                    If you have any questions about our use of cookies, please
                    contact us at:{" "}
                    <a
                        href="mailto:privacy@example.com"
                        className="text-blue-600 underline"
                    >
                        privacy@example.com
                    </a>
                </p>
            </div>
        </GeneralPages>
    );
}
