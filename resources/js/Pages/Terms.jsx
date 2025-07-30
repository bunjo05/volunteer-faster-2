import GeneralPages from "@/Layouts/GeneralPages";
import React from "react";
import { usePage } from "@inertiajs/react";

export default function Terms() {
    return (
        <GeneralPages>
            <div className="max-w-4xl mx-auto p-6 text-gray-800">
                <p className="mt-6 text-sm text-gray-500">
                    Last updated: {new Date().toLocaleDateString()}
                </p>
                <h1 className="text-3xl font-bold mb-6">
                    Terms and Conditions
                </h1>

                <p className="mb-4">
                    Welcome to our{" "}
                    <span className="font-bold">Volunteer Faster</span> a
                    platform that connects volunteers with organizations. These
                    Terms and Conditions ("Terms") govern your use of our
                    services, whether you are a Volunteer, Organization, or
                    Visitor.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    1. Acceptance of Terms
                </h2>
                <p className="mb-4">
                    By accessing or using our Platform, you agree to be bound by
                    these Terms and our Privacy Policy. If you do not agree, you
                    may not use our services.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    2. Definitions
                </h2>
                <ul className="list-disc list-inside mb-4">
                    <li>
                        <strong>“User”</strong> refers to anyone using the
                        Platform, including volunteers and organizations.
                    </li>
                    <li>
                        <strong>“Volunteer”</strong> refers to individuals
                        offering their time or skills.
                    </li>
                    <li>
                        <strong>“Organization”</strong> refers to any nonprofit,
                        charity, or cause seeking volunteer help.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    3. Eligibility
                </h2>
                <p className="mb-4">
                    Users must be at least 16 years old. Organizations must be
                    legally registered and authorized to operate in their
                    jurisdiction.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    4. User Responsibilities
                </h2>
                <ul className="list-disc list-inside mb-4">
                    <li>
                        Provide accurate and up-to-date information during
                        registration.
                    </li>
                    <li>Use the Platform ethically and lawfully.</li>
                    <li>Maintain confidentiality of account information.</li>
                    <li>
                        Report suspicious or fraudulent activities immediately.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    5. Volunteer Commitments
                </h2>
                <ul className="list-disc list-inside mb-4">
                    <li>
                        Volunteers commit to fulfilling their agreed duties once
                        accepted by an Organization.
                    </li>
                    <li>
                        Volunteers must respect the values and safety standards
                        of the Organization.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    6. Organization Responsibilities
                </h2>
                <ul className="list-disc list-inside mb-4">
                    <li>
                        Ensure volunteer safety and provide clear role
                        descriptions.
                    </li>
                    <li>
                        Abide by local labor and safety laws regarding volunteer
                        work.
                    </li>
                    <li>
                        Use volunteers' information only for the purposes of
                        coordination and engagement.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    7. Code of Conduct
                </h2>
                <p className="mb-4">
                    All users must treat each other with respect. Harassment,
                    discrimination, or abuse will result in account suspension
                    or termination.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    8. Intellectual Property
                </h2>
                <p className="mb-4">
                    All content on the Platform (excluding user submissions) is
                    owned by the Platform and protected under copyright laws.
                    Users may not copy, distribute, or modify it without
                    permission.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">9. Privacy</h2>
                <p className="mb-4">
                    We collect and process data as outlined in our Privacy
                    Policy. By using the Platform, you consent to such
                    processing and warrant that all data provided is accurate.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    10. Termination
                </h2>
                <p className="mb-4">
                    We reserve the right to suspend or terminate any account for
                    violation of these Terms or for conduct we deem
                    inappropriate or harmful to others or to the integrity of
                    the Platform.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    11. Limitation of Liability
                </h2>
                <p className="mb-4">
                    We are not liable for any harm or loss resulting from
                    interactions between volunteers and organizations. All
                    engagements are at the users’ own risk.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    12. Modifications
                </h2>
                <p className="mb-4">
                    We may update these Terms periodically. Changes will be
                    communicated on this page. Continued use of the Platform
                    after such updates constitutes acceptance.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    13. Governing Law
                </h2>
                <p className="mb-4">
                    These Terms are governed by and construed in accordance with
                    the laws of{" "}
                    <span className="font-bold">Republic of Uganda</span> and
                    the{" "}
                    <span className="font-bold">East African Community</span>,
                    without regard to its conflict of law provisions.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    14. Contact Us
                </h2>
                <p className="mb-4">
                    For any questions regarding these Terms, please contact us
                    at{" "}
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
