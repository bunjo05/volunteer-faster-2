import GeneralPages from "@/Layouts/GeneralPages";
import { Link } from "@inertiajs/react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef, useState } from "react";

// import { useEffect, useRef } from "react";

export default function Home({ projects, auth }) {
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
    const featuredProjectsRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const featuredProjects =
        projects?.filter((project) => {
            return project.featured_projects?.find(
                (fp) => fp.status === "approved" && fp.is_active === 1
            );
        }) || [];

    // Create an extended array for infinite loop effect
    const extendedProjects = [
        ...featuredProjects,
        ...featuredProjects.slice(0, 3),
    ];

    // Get the current set of 3 projects to display
    const getVisibleProjects = () => {
        if (featuredProjects.length <= 3) return featuredProjects;

        const projectsToShow = [];
        for (let i = 0; i < 3; i++) {
            const index = (currentIndex + i) % featuredProjects.length;
            projectsToShow.push(extendedProjects[index]);
        }
        return projectsToShow;
    };

    // Auto-advance to next project
    useEffect(() => {
        if (featuredProjects.length <= 3 || isHovered) return;

        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % featuredProjects.length);
                setIsTransitioning(false);
            }, 500);
        }, 3000);

        return () => clearInterval(interval);
    }, [featuredProjects.length, currentIndex, isHovered]);

    const handlePrev = () => {
        if (featuredProjects.length <= 3) return;

        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex(
                (prev) =>
                    (prev - 1 + featuredProjects.length) %
                    featuredProjects.length
            );
            setIsTransitioning(false);
        }, 500);
    };

    const handleNext = () => {
        if (featuredProjects.length <= 3) return;

        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % featuredProjects.length);
            setIsTransitioning(false);
        }, 500);
    };

    const goToSlide = (index) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex(index);
            setIsTransitioning(false);
        }, 500);
    };

    return (
        <GeneralPages auth={auth}>
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

            {/* Featured Volunteer Projects - Infinite Scroll with 3 in a row */}
            <section className="py-20 bg-gray-50 px-6 relative">
                <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
                    Featured Volunteer Projects
                </h2>

                {featuredProjects.length > 0 ? (
                    <div
                        className="relative"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {/* Carousel container */}
                        <div className="relative h-[420px] overflow-hidden">
                            <div
                                className={`flex transition-transform duration-500 ease-in-out ${
                                    isTransitioning
                                        ? "opacity-90"
                                        : "opacity-100"
                                }`}
                                style={{
                                    transform: `translateX(calc(-${
                                        currentIndex * (100 / 3)
                                    }% - ${currentIndex * 1}rem))`,
                                }}
                                ref={featuredProjectsRef}
                            >
                                {getVisibleProjects().map((project, index) => (
                                    <div
                                        key={`${project.id}-${index}`}
                                        className="w-1/3 flex-shrink-0 px-4 transition-all duration-300"
                                    >
                                        <div className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative h-full border border-gray-100 hover:border-blue-100">
                                            {/* Featured badge with animation */}
                                            <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold z-10 transform group-hover:scale-105 transition-transform">
                                                Featured
                                            </div>

                                            {/* Image container with elegant overlay */}
                                            <div className="relative h-64 w-full overflow-hidden">
                                                <img
                                                    src={
                                                        project.featured_image
                                                            ? `/storage/${project.featured_image}`
                                                            : "/images/default-project.jpg"
                                                    }
                                                    alt={project.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                                                {/* Title overlay with smooth animation */}
                                                <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-0 group-hover:translate-y-2 transition-transform duration-300">
                                                    <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md">
                                                        {project.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-sm text-white/90 font-medium">
                                                            {
                                                                project.category
                                                                    ?.name
                                                            }
                                                        </span>
                                                        {project.subcategory
                                                            ?.name && (
                                                            <>
                                                                <span className="text-white/50">
                                                                    •
                                                                </span>
                                                                <span className="text-sm text-white/90 font-medium">
                                                                    {
                                                                        project
                                                                            .subcategory
                                                                            ?.name
                                                                    }
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Content with elegant transitions */}
                                            <div className="p-5">
                                                <p className="text-gray-600 mb-4 line-clamp-2 group-hover:line-clamp-3 transition-all duration-200">
                                                    {project.short_description}
                                                </p>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-500">
                                                        {project.location ||
                                                            "Multiple locations"}
                                                    </span>
                                                    <Link
                                                        href={`/projects/${project.slug}`}
                                                        className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 transition-colors group-hover:gap-2"
                                                    >
                                                        View Details
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 5l7 7-7 7"
                                                            />
                                                        </svg>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation arrows with hover effects */}
                        {featuredProjects.length > 3 && (
                            <>
                                <button
                                    onClick={handlePrev}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-300 z-10 hover:scale-110 ml-2"
                                    aria-label="Previous slide"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-gray-700 hover:text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 19l-7-7 7-7"
                                        />
                                    </svg>
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-300 z-10 hover:scale-110 mr-2"
                                    aria-label="Next slide"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-gray-700 hover:text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </button>
                            </>
                        )}

                        {/* Elegant dot indicators */}
                        {featuredProjects.length > 3 && (
                            <div className="flex justify-center mt-8 space-x-2">
                                {featuredProjects.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                            currentIndex %
                                                featuredProjects.length ===
                                            index
                                                ? "bg-blue-600 w-6"
                                                : "bg-gray-300 hover:bg-gray-400"
                                        }`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-600 mb-4">
                            No featured projects available at the moment.
                        </p>
                        <Link
                            href="/projects/create"
                            className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
                        >
                            Suggest a Project
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </Link>
                    </div>
                )}

                <div className="text-center mt-12">
                    <Link
                        href="/projects"
                        className="inline-flex items-center text-blue-700 font-semibold text-lg hover:underline group"
                    >
                        Browse All Projects
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
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
