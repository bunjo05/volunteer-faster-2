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

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("contact.store"), {
            onSuccess: () => {
                setSubmitted(true);
            },
        });
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

            {/* Contact Form Section */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex flex-col lg:flex-row gap-12">
                            {/* Contact Form */}
                            <div className="lg:w-2/3">
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
                                                successfully. We'll get back to
                                                you soon.
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <h2 className="text-3xl font-bold text-gray-900 mb-8">
                                                Send Us a Message
                                            </h2>
                                            <form onSubmit={handleSubmit}>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                                                                    e.target
                                                                        .value
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
                                                                    e.target
                                                                        .value
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
                                                    </div>
                                                </div>
                                                <div className="mb-6">
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
                                                <div className="mb-6">
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

                            {/* Contact Info */}
                            <div className="lg:w-1/3">
                                <div className="bg-gray-50 rounded-xl p-8 h-full">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                        Contact Information
                                    </h3>

                                    <div className="space-y-6">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 bg-blue-100 rounded-full p-3 mr-4">
                                                <svg
                                                    className="w-6 h-6 text-blue-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                    ></path>
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                    ></path>
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">
                                                    Our Address
                                                </h4>
                                                <p className="text-gray-600">
                                                    123 Volunteer Street, Impact
                                                    City, IC 12345
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 bg-blue-100 rounded-full p-3 mr-4">
                                                <svg
                                                    className="w-6 h-6 text-blue-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                    ></path>
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">
                                                    Phone Number
                                                </h4>
                                                <p className="text-gray-600">
                                                    +1 (555) 123-4567
                                                </p>
                                                <p className="text-gray-600">
                                                    +1 (555) 987-6543
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 bg-blue-100 rounded-full p-3 mr-4">
                                                <svg
                                                    className="w-6 h-6 text-blue-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                    ></path>
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">
                                                    Email Address
                                                </h4>
                                                <p className="text-gray-600">
                                                    info@volunteerfaster.com
                                                </p>
                                                <p className="text-gray-600">
                                                    support@volunteerfaster.com
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 bg-blue-100 rounded-full p-3 mr-4">
                                                <svg
                                                    className="w-6 h-6 text-blue-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    ></path>
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">
                                                    Working Hours
                                                </h4>
                                                <p className="text-gray-600">
                                                    Monday - Friday: 9am - 5pm
                                                </p>
                                                <p className="text-gray-600">
                                                    Saturday: 10am - 2pm
                                                </p>
                                                <p className="text-gray-600">
                                                    Sunday: Closed
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="bg-gray-100">
                <div className="container mx-auto px-6">
                    <div className="max-w-5xl mx-auto">
                        <div className="rounded-xl overflow-hidden shadow-lg">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215573012722!2d-73.98784492416478!3d40.74844097138992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1623862343963!5m2!1sen!2sus"
                                width="100%"
                                height="450"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                title="Our Location"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>
        </GeneralPages>
    );
}
