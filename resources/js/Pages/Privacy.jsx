import GeneralPages from "@/Layouts/GeneralPages";
import React from "react";

export default function Privacy() {
    return (
        <GeneralPages>
            <div className="max-w-4xl mx-auto p-6 text-gray-800">
                <p className="mt-6 text-sm text-gray-500">
                    Last updated: {new Date().toLocaleDateString()}
                </p>
                <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

                <p className="mb-4">
                    This Privacy Policy explains how we collect, use, disclose,
                    and protect your information when you use our platform that
                    connects volunteers with organizations (the “Platform”). By
                    accessing or using our services, you consent to the
                    practices described in this Policy.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    1. Information We Collect
                </h2>
                <ul className="list-disc list-inside mb-4">
                    <li>
                        <strong>Personal Information:</strong> Name, email
                        address, phone number, date of birth, location, and
                        other details provided upon registration.
                    </li>
                    <li>
                        <strong>Volunteer Preferences:</strong> Skills,
                        interests, availability, and causes you care about.
                    </li>
                    <li>
                        <strong>Organizational Information:</strong>{" "}
                        Organization name, mission, contact details,
                        Organization verification documents, and volunteer
                        opportunities posted.
                    </li>
                    <li>
                        <strong>Usage Data:</strong> Log data, IP address,
                        device information, browser type, and interaction data.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    2. How We Use Your Information
                </h2>
                <ul className="list-disc list-inside mb-4">
                    <li>
                        To connect volunteers with relevant opportunities based
                        on interests and location.
                    </li>
                    <li>
                        To allow organizations to manage and communicate with
                        volunteers.
                    </li>
                    <li>To personalize and improve the Platform experience.</li>
                    <li>
                        To send updates, service announcements, and
                        administrative communications.
                    </li>
                    <li>
                        To ensure security, prevent fraud, and comply with legal
                        obligations.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    3. Information Sharing
                </h2>
                <p className="mb-4">
                    We do not sell your personal information. We may share your
                    information:
                </p>
                <ul className="list-disc list-inside mb-4">
                    <li>
                        With organizations when you apply for or express
                        interest in a volunteer opportunity.
                    </li>
                    <li>
                        With service providers who help us operate the Platform
                        (e.g., hosting, analytics).
                    </li>
                    <li>
                        If required by law or in response to valid legal
                        requests.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    4. Data Security
                </h2>
                <p className="mb-4">
                    We implement reasonable administrative, technical, and
                    physical safeguards to protect your data. However, no system
                    can be 100% secure, and we cannot guarantee absolute
                    security.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    5. Your Rights and Choices
                </h2>
                <ul className="list-disc list-inside mb-4">
                    <li>
                        Access and correct your profile information from your
                        account settings.
                    </li>
                    <li>Request deletion of your account by contacting us.</li>
                    <li>
                        Opt out of promotional emails using the “unsubscribe”
                        link in the footer of our messages.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    6. Cookies and Tracking
                </h2>
                <p className="mb-4">
                    We use cookies and similar technologies to enhance your
                    experience, understand usage patterns, and deliver relevant
                    content. You can adjust cookie settings through your browser
                    preferences.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    7. Third-Party Links
                </h2>
                <p className="mb-4">
                    Our Platform may contain links to third-party websites or
                    services. We are not responsible for the privacy practices
                    or content of those sites.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    8. Children's Privacy
                </h2>
                <p className="mb-4">
                    Our services are not intended for children under 18. We do
                    not knowingly collect data from children. If we learn we
                    have inadvertently collected such data, we will delete it
                    promptly.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    9. Changes to This Policy
                </h2>
                <p className="mb-4">
                    We may update this Privacy Policy periodically. We will
                    notify users of material changes by updating the date and/or
                    sending notifications. Continued use of the Platform implies
                    acceptance of the revised policy.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    10. Contact Us
                </h2>
                <p className="mb-4">
                    If you have questions or concerns about this Privacy Policy,
                    please contact us at{" "}
                    <a
                        href="mailto:contact@volunteerfaster.com"
                        className="text-blue-600 underline"
                    >
                        contact@volunteerfaster.com
                    </a>
                    .
                </p>
            </div>
        </GeneralPages>
    );
}
