import GeneralPages from "@/Layouts/GeneralPages";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Contact() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [emailError, setEmailError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmailError(""); // Reset previous error

        try {
            await post(route("contact.store"), {
                onSuccess: () => {
                    setSubmitted(true);
                },
                onError: (errors) => {
                    if (errors.email_suspended) {
                        setEmailError(errors.email_suspended);
                    }
                },
            });
        } catch (error) {
            console.error("Submission error:", error);
        }
    };

    return (
        <GeneralPages>
            <Head title="Contact Us" />

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
                            We'd love to hear from you! Reach out with questions
                            or feedback.
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
                                        Your message has been sent successfully.
                                        We'll get back to you soon.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                                        Send Us a Message
                                    </h2>
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
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                                {errors.email && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.email}
                                                    </p>
                                                )}
                                                {emailError && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {emailError}
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
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </GeneralPages>
    );
}
