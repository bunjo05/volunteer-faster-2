import GeneralPages from "@/Layouts/GeneralPages";
import React from "react";

export default function Guide() {
    return (
        <GeneralPages>
            <div className="max-w-5xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Volunteer Guide
                </h1>

                <p className="text-gray-700 mb-6">
                    Welcome to <strong>Volunteer Faster</strong> — your hub for
                    finding meaningful, impactful volunteer opportunities.
                    Whether you're new to volunteering or an experienced
                    changemaker, this guide will help you get the most out of
                    your journey.
                </p>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        1. Getting Started
                    </h2>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li>
                            <strong>Create an account:</strong> Sign up and
                            complete your volunteer profile.
                        </li>
                        <li>
                            <strong>Browse programs:</strong> Use filters to
                            search for opportunities that match your interests,
                            skills, and availability.
                        </li>
                        <li>
                            <strong>Apply to volunteer:</strong> Submit your
                            application or directly connect with an
                            organization.
                        </li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        2. Expectations & Responsibilities
                    </h2>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li>
                            Show up on time and communicate proactively with
                            coordinators.
                        </li>
                        <li>
                            Be respectful, inclusive, and professional in all
                            interactions.
                        </li>
                        <li>
                            Complete your assigned tasks with care and
                            diligence.
                        </li>
                        <li>
                            Log your hours and submit feedback when prompted.
                        </li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        3. Volunteer Onboarding
                    </h2>
                    <p className="text-gray-700 mb-2">
                        Many organizations offer training sessions before you
                        start. This may include:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li>Orientation meetings or video introductions</li>
                        <li>Background checks or identity verification</li>
                        <li>Health and safety guidelines</li>
                        <li>Code of conduct and expectations</li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        4. Tips for a Great Experience
                    </h2>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li>Choose causes you're passionate about</li>
                        <li>Start with short-term tasks to learn and grow</li>
                        <li>Ask questions and seek feedback regularly</li>
                        <li>Stay curious — learning is part of the process!</li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        5. Frequently Asked Questions
                    </h2>
                    <div className="text-gray-700 space-y-4">
                        <div>
                            <strong>Do I need experience to volunteer?</strong>
                            <p>
                                Not at all! Many organizations welcome
                                first-time volunteers and provide training.
                            </p>
                        </div>
                        <div>
                            <strong>Can I volunteer remotely?</strong>
                            <p>
                                Yes! We list both in-person and remote/virtual
                                opportunities.
                            </p>
                        </div>
                        {/* <div>
                            <strong>How do I track my volunteer hours?</strong>
                            <p>
                                Use your dashboard to log completed tasks and
                                hours. This helps build your volunteer record.
                            </p>
                        </div> */}
                        <div>
                            <strong>Will I receive a certificate?</strong>
                            <p>
                                Some programs offer digital certificates after
                                completion. Check the opportunity details or
                                contact the organizer.
                            </p>
                            <p>
                                But <span>Volunteer Faster</span> shall provide
                                you with a Digital Certificate upon completion
                                of the volunteering assignment / period
                            </p>
                        </div>
                    </div>
                </section>

                <p className="text-gray-700">
                    Still have questions?{" "}
                    <a
                        href={route("contact")}
                        className="text-blue-600 hover:underline"
                    >
                        Contact us
                    </a>{" "}
                    and we’ll be happy to help.
                </p>
            </div>
        </GeneralPages>
    );
}
