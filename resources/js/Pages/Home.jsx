import GeneralPages from "@/Layouts/GeneralPages";
import { Link } from "@inertiajs/react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

import { useEffect, useRef } from "react";

export default function Home({ projects }) {
    const testimonials = [
        {
            name: "Lina K.",
            quote: "I helped teach kids in Uganda — an unforgettable experience.",
        },
        {
            name: "Mark R.",
            quote: "It was easy to sign up and I found a local project in less than a day.",
        },
        {
            name: "Sarah L.",
            quote: "I’m planning my second volunteering trip through this site!",
        },
        {
            name: "Emily T.",
            quote: "Volunteering changed my life. The connections I made were priceless.",
        },
        {
            name: "David N.",
            quote: "From browsing to joining, the process was smooth and super easy.",
        },
    ];

    const scrollRef = useRef(null);

    useEffect(() => {
        const container = scrollRef.current;
        const scrollAmount = 320; // Adjust based on card width + gap
        const interval = setInterval(() => {
            if (container) {
                container.scrollBy({ left: scrollAmount, behavior: "smooth" });

                // Reset to start if at the end
                if (
                    container.scrollLeft + container.offsetWidth >=
                    container.scrollWidth
                ) {
                    container.scrollTo({ left: 0, behavior: "smooth" });
                }
            }
        }, 4000); // every 4 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <GeneralPages>
            {/* Hero Section */}
            <section
                className="relative bg-cover bg-center bg-no-repeat h-[90vh] flex items-center justify-center"
                style={{ backgroundImage: "url('/hero.jpg')" }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 to-blue-600/60 z-10"></div>

                <div className="relative z-20 container mx-auto px-6 md:px-12 text-center md:text-left">
                    <div className="max-w-2xl mx-auto md:mx-0 animate-fade-in-up">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-white mb-6 transition-all duration-700 ease-out">
                            Discover. Connect. <br />
                            <span className="text-yellow-300 drop-shadow-md">
                                Volunteer.
                            </span>
                        </h1>
                        <p className="text-white text-lg md:text-xl mb-8">
                            Join a global movement of changemakers. Find
                            purpose-driven volunteer projects that align with
                            your passion and skills.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                            <Link
                                href="/register"
                                className="bg-yellow-400 text-blue-900 px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-yellow-300 transition hover:scale-105"
                            >
                                Join as Volunteer
                            </Link>
                            <Link
                                href="/register-organization"
                                className="px-6 py-3 rounded-full border-2 border-white text-white font-semibold hover:bg-white hover:text-blue-900 transition"
                            >
                                Register Organization
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted By */}
            <section className="bg-gray-100 py-8 px-4 text-center">
                <p className="text-gray-500 text-sm uppercase mb-4 tracking-wide">
                    Trusted by leading global organizations
                </p>
                <div className="flex flex-wrap justify-center items-center gap-10 opacity-80">
                    {["unicef", "red-cross", "who", "greenpeace"].map((org) => (
                        <img
                            key={org}
                            src={`hero.jpg`}
                            alt={org}
                            className="h-10 grayscale rounded-full hover:grayscale-0 transition duration-300"
                        />
                    ))}
                </div>
            </section>

            {/* Explore by Cause */}
            <section className="py-20 bg-white px-6">
                <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
                    Explore Opportunities by Cause
                </h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        { name: "Education", icon: "📚" },
                        { name: "Health", icon: "🏥" },
                        { name: "Environment", icon: "🌍" },
                        { name: "Animal Welfare", icon: "🐾" },
                    ].map((cat, i) => (
                        <Link
                            key={i}
                            href={`/projects?category=${cat.name}`}
                            className="bg-blue-50 hover:bg-blue-100 transition p-8 rounded-xl shadow group hover:shadow-lg"
                        >
                            <div className="text-5xl mb-3 group-hover:scale-110 transition">
                                {cat.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-blue-800">
                                {cat.name}
                            </h3>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Stats Counter */}
            <section className="bg-blue-600 py-20 text-white">
                <div className="grid md:grid-cols-4 gap-10 text-center container mx-auto px-6">
                    {[
                        { label: "Volunteers", count: 8423 },
                        { label: "Projects", count: 320 },
                        { label: "Organizations", count: 112 },
                        { label: "Countries", count: 48 },
                    ].map((stat, i) => {
                        const { ref, inView } = useInView({
                            triggerOnce: true,
                        });
                        return (
                            <div key={i} ref={ref}>
                                <div className="text-5xl font-bold">
                                    {inView ? (
                                        <CountUp
                                            end={stat.count}
                                            duration={2}
                                            separator=","
                                            enableScrollSpy
                                            scrollSpyOnce
                                        />
                                    ) : (
                                        // <CountUp
                                        //     end={stat.count}
                                        //     duration={2}
                                        //     separator=","
                                        // />
                                        "0"
                                    )}
                                </div>
                                <p className="text-lg mt-2">{stat.label}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Featured Projects */}
            <section className="py-20 bg-gray-50 px-6">
                <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
                    Featured Volunteer Projects
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {projects?.length ? (
                        projects.slice(0, 6).map((project) => (
                            <div
                                key={project.id}
                                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
                            >
                                <img
                                    src={
                                        project.featuredImage ||
                                        "/images/default-project.jpg"
                                    }
                                    alt={project.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-5">
                                    <h3 className="text-xl font-semibold mb-2 text-blue-700">
                                        {project.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4 text-sm">
                                        {project.shortDescription}
                                    </p>
                                    <Link
                                        href={`/projects/${project.slug}`}
                                        className="text-blue-600 hover:underline text-sm font-medium"
                                    >
                                        View Details →
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center col-span-3 text-gray-600">
                            No projects available at the moment.
                        </p>
                    )}
                </div>
                <div className="text-center mt-12">
                    <Link
                        href="/projects"
                        className="text-blue-700 font-semibold text-lg hover:underline"
                    >
                        Browse All Projects →
                    </Link>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-white px-6">
                <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
                    Volunteer Experiences
                </h2>

                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto px-2 scroll-smooth"
                    style={{
                        scrollbarWidth: "none", // Firefox
                        msOverflowStyle: "none", // IE 10+
                    }}
                >
                    <style jsx>{`
                        div::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            className="bg-blue-50 p-6 rounded-xl shadow min-w-[300px] max-w-sm hover:shadow-md transition-transform duration-500 transform hover:scale-105"
                        >
                            <p className="italic text-gray-700 mb-4 animate-fade-in">
                                “{t.quote}”
                            </p>
                            <p className="text-blue-800 font-semibold">
                                — {t.name}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Organizations */}
            <section className="py-20 bg-blue-50 px-6">
                <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
                    Our Impact Partners
                </h2>
                <div className="grid md:grid-cols-4 gap-8 text-center">
                    {[
                        "Hope Foundation",
                        "Clean Earth Org",
                        "Youth4Change",
                        "Kids First",
                    ].map((org, i) => (
                        <div
                            key={i}
                            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
                        >
                            <img
                                src="hero.jpg"
                                alt={org}
                                className="w-20 h-20 mx-auto mb-4 rounded-full object-cover border-4 border-blue-100"
                            />
                            <h4 className="font-semibold text-lg text-blue-800">
                                {org}
                            </h4>
                        </div>
                    ))}
                </div>
            </section>

            {/* Sticky CTA */}
            <section className="bg-blue-700 text-white py-6 px-4 h-[300px] flex justify-center items-center text-center shadow-xl">
                <div className="space-y-4 flex flex-col">
                    <p className="text-lg font-medium mb-2">
                        Ready to change the world one project at a time?
                    </p>
                    <Link
                        href="/register"
                        className="bg-white text-blue-700 px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition"
                    >
                        Sign Up Now →
                    </Link>
                </div>
            </section>
        </GeneralPages>
    );
}
