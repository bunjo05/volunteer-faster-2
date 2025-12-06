import GeneralPages from "@/Layouts/GeneralPages";
import React from "react";
import { Head } from "@inertiajs/react";

export default function About({ auth }) {
    // Get APP_URL for SEO
    const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    const currentUrl =
        typeof window !== "undefined" ? window.location.href : appUrl;

    // Page-specific SEO
    const pageTitle = "About Us | Volunteer Faster";
    const pageDescription =
        "Learn about Volunteer Faster - Our mission to connect volunteers with meaningful opportunities since 2015. Discover our values, impact, and team.";
    const pageKeywords =
        "about us, volunteer platform, our mission, our story, social impact, volunteering community, nonprofit technology";

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
                <meta property="og:image" content={`${appUrl}/hero.jpg`} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta
                    property="og:image:alt"
                    content="About Volunteer Faster - Our Story of Impact"
                />
                <meta property="og:site_name" content="Volunteer Faster" />
                <meta property="og:locale" content="en_US" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={currentUrl} />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
                <meta name="twitter:image" content={`${appUrl}/hero.jpg`} />
                <meta name="twitter:site" content="@volunteerfaster" />
                <meta name="twitter:creator" content="@volunteerfaster" />
                <meta
                    name="twitter:image:alt"
                    content="About Volunteer Faster - Our Story of Impact"
                />

                {/* Additional Meta Tags */}
                <link rel="canonical" href={currentUrl} />

                {/* Structured Data for SEO */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "AboutPage",
                        name: pageTitle,
                        description: pageDescription,
                        url: currentUrl,
                        publisher: {
                            "@type": "Organization",
                            name: "Volunteer Faster",
                            logo: `${appUrl}/logo.png`,
                            description: "Volunteer matching platform",
                            foundingDate: "2015",
                            founder: {
                                "@type": "Person",
                                name: "Sarah Johnson",
                            },
                            numberOfEmployees: "50",
                            areaServed: "Worldwide",
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
                                    name: "About Us",
                                    item: currentUrl,
                                },
                            ],
                        },
                        mainEntity: {
                            "@type": "Organization",
                            name: "Volunteer Faster",
                            description: pageDescription,
                            url: appUrl,
                            logo: `${appUrl}/logo.png`,
                            foundingDate: "2015",
                            founder: {
                                "@type": "Person",
                                name: "Sarah Johnson",
                                jobTitle: "Founder & CEO",
                            },
                            numberOfEmployees: "50",
                            address: {
                                "@type": "PostalAddress",
                                addressLocality: "Kampala",
                                addressCountry: "UG",
                                streetAddress: "Plot 3118, Block 206",
                            },
                            contactPoint: {
                                "@type": "ContactPoint",
                                contactType: "customer service",
                                email: "contact@volunteerfaster.com",
                                availableLanguage: "English",
                            },
                            sameAs: [
                                "https://www.facebook.com/volunteerfaster",
                                "https://twitter.com/volunteerfaster",
                                "https://www.instagram.com/volunteerfaster",
                                "https://www.linkedin.com/company/volunteerfaster",
                            ],
                        },
                    })}
                </script>
            </Head>

            <GeneralPages auth={auth} title="About Us">
                {/* Hero Section */}
                <section className="relative bg-blue-900 text-white py-20 md:py-32">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-600 opacity-90"></div>
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                                Our Story of{" "}
                                <span className="text-yellow-300">Impact</span>
                            </h1>
                            <p className="text-xl md:text-2xl opacity-90">
                                Empowering communities through volunteerism
                                since 2015
                            </p>
                            <div className="mt-8">
                                <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-medium">
                                    Over 15,000 volunteers connected
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-16 md:py-24 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="max-w-5xl mx-auto">
                            <div className="flex flex-col md:flex-row gap-12 items-center">
                                <div className="md:w-1/2">
                                    <div className="relative rounded-xl overflow-hidden shadow-xl h-80 w-full">
                                        <img
                                            src="/images/about-team.jpg"
                                            alt="Our team volunteering at Volunteer Faster"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                                    </div>
                                </div>
                                <div className="md:w-1/2">
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                        Our{" "}
                                        <span className="text-blue-600">
                                            Mission
                                        </span>
                                    </h2>
                                    <p className="text-lg text-gray-600 mb-6">
                                        We connect passionate individuals with
                                        meaningful volunteer opportunities that
                                        create lasting change in communities
                                        worldwide.
                                    </p>
                                    <ul className="space-y-4">
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-4">
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
                                                        d="M5 13l4 4L19 7"
                                                    ></path>
                                                </svg>
                                            </div>
                                            <span className="text-gray-700">
                                                Bridge the gap between
                                                volunteers and organizations
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-4">
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
                                                        d="M5 13l4 4L19 7"
                                                    ></path>
                                                </svg>
                                            </div>
                                            <span className="text-gray-700">
                                                Amplify the impact of grassroots
                                                initiatives
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-4">
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
                                                        d="M5 13l4 4L19 7"
                                                    ></path>
                                                </svg>
                                            </div>
                                            <span className="text-gray-700">
                                                Foster sustainable community
                                                development
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-16 md:py-24 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl mx-auto text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Our Core{" "}
                                <span className="text-blue-600">Values</span>
                            </h2>
                            <p className="text-lg text-gray-600">
                                These principles guide everything we do at
                                Volunteer Faster
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "Community First",
                                    description:
                                        "We prioritize local needs and empower communities to drive their own development.",
                                    icon: "🤝",
                                },
                                {
                                    title: "Transparency",
                                    description:
                                        "We maintain open communication about our operations, finances, and impact.",
                                    icon: "🔍",
                                },
                                {
                                    title: "Inclusivity",
                                    description:
                                        "We welcome volunteers and organizations from all backgrounds and abilities.",
                                    icon: "🌍",
                                },
                                {
                                    title: "Sustainability",
                                    description:
                                        "We focus on long-term solutions rather than temporary fixes.",
                                    icon: "♻️",
                                },
                                {
                                    title: "Innovation",
                                    description:
                                        "We continuously improve our platform to better serve our community.",
                                    icon: "💡",
                                },
                                {
                                    title: "Collaboration",
                                    description:
                                        "We believe real change happens when we work together.",
                                    icon: "👥",
                                },
                            ].map((value, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
                                >
                                    <div className="text-4xl mb-4">
                                        {value.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {value.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Impact Stats */}
                <section className="py-16 md:py-24 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
                    <div className="container mx-auto px-6">
                        <div className="max-w-5xl mx-auto text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Our{" "}
                                <span className="text-yellow-300">Impact</span>{" "}
                                in Numbers
                            </h2>
                            <p className="text-xl opacity-90">
                                The collective difference we've made together
                                since 2015
                            </p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                {
                                    number: "15,000+",
                                    label: "Volunteers Connected",
                                },
                                { number: "500+", label: "Projects Supported" },
                                { number: "45", label: "Countries Reached" },
                                { number: "250,000+", label: "Lives Impacted" },
                            ].map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-4xl md:text-5xl font-bold mb-2">
                                        {stat.number}
                                    </div>
                                    <div className="text-blue-200">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                {/* <section className="py-16 md:py-24 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl mx-auto text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Meet Our{" "}
                                <span className="text-blue-600">Team</span>
                            </h2>
                            <p className="text-lg text-gray-600">
                                Passionate individuals driving our mission
                                forward at Volunteer Faster
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {
                                    name: "Sarah Johnson",
                                    role: "Founder & CEO",
                                    bio: "Social entrepreneur with 15 years in nonprofit leadership.",
                                    image: "/images/team-sarah.jpg",
                                },
                                {
                                    name: "Michael Chen",
                                    role: "CTO",
                                    bio: "Tech innovator focused on social impact solutions.",
                                    image: "/images/team-michael.jpg",
                                },
                                {
                                    name: "Amina Diallo",
                                    role: "Community Director",
                                    bio: "Grassroots organizer with global experience.",
                                    image: "/images/team-amina.jpg",
                                },
                                {
                                    name: "David Rodriguez",
                                    role: "Partnerships Lead",
                                    bio: "Connector of people and organizations for greater good.",
                                    image: "/images/team-david.jpg",
                                },
                            ].map((member, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                                >
                                    <div className="h-64 w-full overflow-hidden">
                                        <img
                                            src={member.image}
                                            alt={`${member.name}, ${member.role} at Volunteer Faster`}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {member.name}
                                        </h3>
                                        <p className="text-blue-600 mb-3">
                                            {member.role}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            {member.bio}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section> */}

                {/* CTA Section */}
                <section className="py-16 md:py-24 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-12 shadow-xl">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Ready to Make a Difference?
                            </h2>
                            <p className="text-xl mb-8 opacity-90">
                                Join our community of changemakers today
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <a
                                    href="/register"
                                    className="bg-white text-blue-700 px-8 py-4 rounded-full font-bold shadow-md hover:shadow-lg transition-all hover:scale-105"
                                >
                                    Become a Volunteer
                                </a>
                                <a
                                    href="/register"
                                    className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all hover:scale-105"
                                >
                                    Register Your Organization
                                </a>
                            </div>
                            <p className="mt-8 text-blue-200 text-sm">
                                Questions? Contact us at{" "}
                                <a
                                    href="mailto:contact@volunteerfaster.com"
                                    className="text-white font-medium hover:underline"
                                >
                                    contact@volunteerfaster.com
                                </a>
                            </p>
                        </div>
                    </div>
                </section>
            </GeneralPages>
        </>
    );
}
