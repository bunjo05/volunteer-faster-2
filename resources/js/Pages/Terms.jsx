import GeneralPages from "@/Layouts/GeneralPages";
import React from "react";
import { Link, usePage } from "@inertiajs/react";

export default function Terms() {
    return (
        <GeneralPages>
            <div className="max-w-4xl mx-auto p-6 text-gray-800">
                <div className="flex flex-col gap-[5px] mb-5">
                    <p className="text-sm text-gray-500">
                        Last updated:{" "}
                        <span className="font-bold">
                            {new Date().toLocaleDateString()}
                        </span>
                    </p>
                    <p className="text-sm text-gray-500">
                        Country of Registration:{" "}
                        <span className="font-bold">Republic of Uganda</span>
                    </p>
                    <p className="text-sm text-gray-500">
                        Operation Scope:{" "}
                        <span className="font-bold">International</span>
                    </p>
                </div>
                <h1 className="text-3xl font-bold mb-6">
                    Terms and Conditions
                </h1>

                <p className="mb-4">
                    Welcome to{" "}
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
                    these Terms and Conditions. If you do not agree, you may not
                    use our services.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    2. Definitions
                </h2>
                <ul className="list-disc list-inside mb-4">
                    <li>
                        <strong>“User”</strong> any Volunteer, Organization,
                        Donor/Sponsor or individual accessing the platform.
                    </li>
                    <li>
                        <strong>“Volunteer”</strong> An individual offering
                        services without salary.
                    </li>
                    <li>
                        <strong>“Organization”</strong> legal
                        entity/nonprofit/charity seeking volunteer services.
                    </li>
                    <li>
                        <strong>“Project”</strong> a volunteerring opportunity
                        listed by an Organization.
                    </li>
                    <li>
                        <strong>“Platform”</strong> refers to the Volunteer
                        Faster website and services.
                    </li>
                    <li>
                        <strong>“Points”</strong> a digital reward currency
                        earned on the Platform with no cash value.
                    </li>
                    <li>
                        <strong>“Content”</strong> any data, text, images,
                        videos, or other materials uploaded or shared on the
                        Platform.
                    </li>
                    <li>
                        <strong>“Verification”</strong> the process of
                        confirming identity through valid documents.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    3. Eligibility
                </h2>
                <div className="mb-4">
                    <p>You may use this Platform only if:</p>
                    <ul className="list-disc list-inside mb-4">
                        <li>
                            You are 18 years or older, or have legal guardian
                            consent
                        </li>
                        <li>
                            You provide accurate and truthful registration
                            information
                        </li>
                        <li>
                            You have legal capacity to enter binding agreements
                        </li>
                        <li>
                            Organizations must be legally registered and
                            authorized to operate
                        </li>
                    </ul>
                    <p>
                        We may perform identity verification and may request
                        supporting documents at any time for quality purpose.
                    </p>
                </div>

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
                    We collect and process data as outlined in our{" "}
                    <Link
                        className="hover:text-blue-500"
                        href={route("privacy.policy")}
                    >
                        Privacy Policy
                    </Link>{" "}
                    . By using the Platform, you consent to such processing and
                    warrant that all data provided is accurate.
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
                <div>
                    <h2 className="text-xl font-semibold mt-6 mb-2">
                        14. Points System
                    </h2>
                    <p className="mb-4">
                        Volunteer Faster uses a digital points system
                        ("Points").
                    </p>
                    <p>
                        Points are NOT money, have no monetary value, and cannot
                        be withdrawn, cashed our, or refunded.
                    </p>
                    <div>
                        <h2>5.1. How Point are Earned</h2>
                        <p>Volunteers earn Point through</p>
                        <ul className="list-disc list-inside mb-4">
                            <li>
                                Successful Referral of Users (subject to admin
                                approval)
                            </li>
                            <li>
                                Completion of Projects when:
                                <ul className="list-disc list-inside mb-4 ml-5">
                                    <li>
                                        The Organization confirms satisfactory
                                        completion
                                    </li>
                                    <li>
                                        No reports of misconduct or violations
                                        exist
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <h2>5.2. How Volunteers can use Points</h2>
                        <p>Points may be used to:</p>
                        <ul className="list-disc list-inside mb-4">
                            <li>
                                Fully pay for Paid Volunteer Project, only if
                                the Organization accepts Points
                            </li>
                            <li>
                                Exchange for Platform-specific benefits (if
                                available)
                            </li>
                        </ul>
                        <h2>5.3. How Organization can use Points</h2>
                        <p>Organizations may use Points to:</p>
                        <ul className="list-disc list-inside mb-4">
                            <li>
                                Pay for a Project to be Featured for higher
                                visibility
                            </li>
                            <li>
                                Redeem for Platform-specific promotional
                                benefits (if available)
                            </li>
                        </ul>
                        <h2>Restriction</h2>
                        <ul>
                            <li>Points cannot be exchanged for cash</li>
                            <li>
                                Points cannot be transferred between accounts
                            </li>
                            <li>
                                Points may be revoked for fraud, misconduct, or
                                misuse
                            </li>
                        </ul>
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-semibold mt-6 mb-2">
                        Fundraising & Sponsorship
                    </h2>
                    <p>Volunteer Faster allows Volunteer to:</p>
                    <ul className="list-disc list-inside mb-4">
                        <li>
                            Create fundraising requests for support to
                            participate in paid projects
                        </li>
                    </ul>
                    <p>You agree that:</p>
                    <ul className="list-disc list-inside mb-4">
                        <li>
                            All donations except Volunteer Fees go direct to the
                            Volunteer (or designated payment method)
                        </li>
                        <li>
                            Volunteer Faster is not responsible for failed
                            fundraising, donor behavior, misuse of funds.
                        </li>
                        <li>
                            Fundraising activities must comply with all
                            applicable financial and legal regulations in both
                            Uganda and the donor's country.
                        </li>
                    </ul>
                    <p>We reserve the right to remove or reject campaigns</p>
                </div>
                <div>
                    <h2 className="text-xl font-semibold mt-6 mb-2">
                        15. Dispute Resolution
                    </h2>
                    <p className="mb-4">
                        Any disputes arising from the use of the Platform shall
                        first be attempted to be resolved through informal
                        negotiation between the parties. If unresolved, disputes
                        shall be submitted to mediation or binding arbitration
                        in accordance with the laws of{" "}
                        <span className="font-bold">Republic of Uganda</span>.
                    </p>
                </div>
                <div>
                    <h2>16. Indemnification</h2>
                    <p>
                        You agree to indemnify and defend Volunteer Faster from
                        all claims, damages, liabilities, and expenses resulting
                        from:
                    </p>
                    <ul className="list-disc list-inside mb-4">
                        <li>Your violation of these Terms</li>
                        <li>Your misuse of the Platform</li>
                        <li>Your interactions with other users</li>
                    </ul>
                </div>
                <div>
                    <h2>17. Severability</h2>
                    <p>
                        If any provision of these Terms is found to be invalid
                        or unenforceable, the remaining provisions shall remain
                        in full force and effect.
                    </p>
                </div>
                <div>
                    <h2>18. Governing Law</h2>
                    <p>These Terms are governed by the Laws of Uganda.</p>
                    <p>
                        Disputes shall be resolved exclusively in Ugandan
                        Courts.
                    </p>
                </div>

                <h2 className="text-xl font-semibold mt-6 mb-2">
                    19. Contact Us
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
