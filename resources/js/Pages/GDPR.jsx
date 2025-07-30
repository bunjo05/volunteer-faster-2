import GeneralPages from "@/Layouts/GeneralPages";
import { Link } from "@inertiajs/react";
import React from "react";

export default function GDPR() {
    return (
        <GeneralPages>
            <div className="max-w-4xl mx-auto p-6 text-gray-800">
                <p className="mt-6 text-sm text-gray-500">
                    Last updated: {new Date().toLocaleDateString()}
                </p>
                <h1 className="text-3xl font-bold mb-6">GDPR Compliance</h1>

                <p className="mb-4">
                    This page explains how we comply with the General Data
                    Protection Regulation (GDPR), which governs how we collect,
                    process, store, and protect personal data of individuals
                    located in the European Union (EU).
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    1. What is GDPR?
                </h2>
                <p className="mb-4">
                    The General Data Protection Regulation (EU) 2016/679
                    (“GDPR”) is a legal framework that sets guidelines for the
                    collection and processing of personal data from individuals
                    who live in the European Union (EU).
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    2. Legal Basis for Processing Data
                </h2>
                <p className="mb-4">
                    We collect and use your personal data only when we have a
                    valid legal basis, including:
                </p>
                <ul className="list-disc list-inside mb-4">
                    <li>Your consent.</li>
                    <li>
                        To perform a contract with you (e.g., connecting
                        volunteers with organizations).
                    </li>
                    <li>To comply with legal obligations.</li>
                    <li>
                        To pursue legitimate interests, such as improving our
                        services and security.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    3. Data We Collect
                </h2>
                <p className="mb-4">
                    We may collect the following personal data:
                </p>
                <ul className="list-disc list-inside mb-4">
                    <li>
                        Name, email address, phone number, website link,
                        verification documents.
                    </li>
                    <li>
                        Location, availability, skills, and volunteer interests.
                    </li>
                    <li>
                        Login and usage information (IP address, device info).
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    4. Your Rights Under GDPR
                </h2>
                <p className="mb-4">
                    As a data subject under GDPR, you have the following rights:
                </p>
                <ul className="list-disc list-inside mb-4">
                    <li>
                        <strong>Right to Access:</strong> You may request copies
                        of your personal data.
                    </li>
                    <li>
                        <strong>Right to Rectification:</strong> You can request
                        correction of inaccurate or incomplete data.
                    </li>
                    <li>
                        <strong>Right to Erasure:</strong> You can request that
                        we delete your data ("right to be forgotten").
                    </li>
                    <li>
                        <strong>Right to Restrict Processing:</strong> You can
                        request that we limit the way we use your data.
                    </li>
                    <li>
                        <strong>Right to Data Portability:</strong> You can
                        request that we transfer your data to another service
                        provider.
                    </li>
                    <li>
                        <strong>Right to Object:</strong> You can object to
                        processing based on legitimate interest or direct
                        marketing.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    5. Data Retention
                </h2>
                <p className="mb-4">
                    We retain your personal data only for as long as necessary
                    to fulfill the purposes outlined in our{" "}
                    <Link
                        className="hover:text-[#3a48cc] hover:underline"
                        href={route("privacy.policy")}
                    >
                        Privacy Policy
                    </Link>{" "}
                    or as required by applicable laws.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    6. International Transfers
                </h2>
                <p className="mb-4">
                    If we transfer your personal data outside the European
                    Economic Area (EEA), we ensure appropriate safeguards are in
                    place, such as Standard Contractual Clauses or your explicit
                    consent.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    7. Data Security
                </h2>
                <p className="mb-4">
                    We take security seriously and implement appropriate
                    technical and organizational measures to protect your data
                    from loss, misuse, unauthorized access, disclosure, or
                    alteration.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    8. Third Parties
                </h2>
                <p className="mb-4">
                    We may share your personal data with trusted third-party
                    service providers to help deliver our services. We ensure
                    they comply with GDPR and only process data on our
                    instructions.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    9. Consent Management
                </h2>
                <p className="mb-4">
                    We provide users with the ability to give or withdraw
                    consent for specific types of data collection (e.g.,
                    marketing emails, cookies). You can update your preferences
                    in your account settings or via cookie banners.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    10. Data Controller
                </h2>
                <p className="mb-4">
                    The data controller responsible for your personal data is:
                </p>
                <p className="mb-4">
                    <strong>Volunteer Faster</strong>
                    <br />
                    Plot 3118, Block 206, Kampala
                    <br />
                    Uganda
                    <br />
                    Email:{" "}
                    <a
                        href="mailto:contact@volunteerfaster.com"
                        className="text-blue-600 underline"
                    >
                        contact@volunteerfaster.com
                    </a>
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    11. How to Make a Complaint
                </h2>
                <p className="mb-4">
                    If you believe we are unlawfully processing your personal
                    data, you have the right to lodge a complaint with your
                    local supervisory authority.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    12. Updates to This Page
                </h2>
                <p className="mb-4">
                    We may update this GDPR page from time to time. Updates will
                    be posted here with the revised date.
                </p>
            </div>
        </GeneralPages>
    );
}
