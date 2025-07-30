import GeneralPages from "@/Layouts/GeneralPages";
import { Link } from "@inertiajs/react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef, useState } from "react";

export default function Home({ projects, auth }) {
    const testimonials = [
        {
            name: "Lina K.",
            role: "Volunteer Teacher",
            quote: "I helped teach kids in Uganda — an unforgettable experience that changed my perspective on life.",
            avatar: "/avatar1.jpg",
        },
        {
            name: "Mark R.",
            role: "Environmental Volunteer",
            quote: "It was easy to sign up and I found a local conservation project in less than a day. The impact was immediate!",
            avatar: "/avatar2.jpg",
        },
        {
            name: "Sarah L.",
            role: "Healthcare Volunteer",
            quote: "I'm planning my second volunteering trip through this site! The connections I made were invaluable.",
            avatar: "/avatar3.jpg",
        },
        {
            name: "Emily T.",
            role: "Community Builder",
            quote: "Volunteering changed my life. The relationships I built with the local community will last a lifetime.",
            avatar: "/avatar4.jpg",
        },
        {
            name: "David N.",
            role: "Disaster Relief",
            quote: "From browsing to joining, the process was smooth and super easy. The team support was exceptional.",
            avatar: "/avatar5.jpg",
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

    // Auto-advance to next project
    useEffect(() => {
        if (featuredProjects.length <= 3 || isHovered) return;

        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentIndex(
                    (prev) => (prev + 1) % (featuredProjects.length - 2)
                );
                setIsTransitioning(false);
            }, 500);
        }, 5000);

        return () => clearInterval(interval);
    }, [featuredProjects.length, currentIndex, isHovered]);

    const handlePrev = () => {
        if (featuredProjects.length <= 3) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex((prev) => Math.max(0, prev - 1));
            setIsTransitioning(false);
        }, 500);
    };

    const handleNext = () => {
        if (featuredProjects.length <= 3) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex((prev) =>
                Math.min(featuredProjects.length - 3, prev + 1)
            );
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
            {/* Hero Section - Reduced padding and tighter spacing */}
            <section
                className="relative bg-cover bg-center bg-no-repeat h-screen min-h-[600px] flex items-center justify-center bg-fixed"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/hero.jpg')",
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-700/60 to-blue-600/50 z-10"></div>

                <div className="relative z-20 container mx-auto px-6 lg:px-12 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white mb-4">
                            <span className="text-yellow-300">Discover</span>{" "}
                            meaningful volunteer opportunities
                        </h1>
                        <p className="text-white text-lg md:text-xl mb-8 opacity-90">
                            Join a global community of changemakers creating
                            lasting impact.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/register"
                                className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 px-6 py-3 rounded-full font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                            >
                                Join as Volunteer
                            </Link>
                            <Link
                                href="/register-organization"
                                className="px-6 py-3 rounded-full border-2 border-white text-white font-bold hover:bg-white/10 transition-all duration-300 hover:scale-105"
                            >
                                Register Organization
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted By - More compact */}
            <section className="bg-gray-50 py-8 px-6">
                <div className="max-w-6xl mx-auto">
                    <p className="text-gray-500 text-xs uppercase mb-4 tracking-wider text-center font-medium">
                        Trusted by leading organizations
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-8 opacity-90">
                        {["unicef", "red-cross", "who", "greenpeace"].map(
                            (org) => (
                                <div
                                    key={org}
                                    className="transition-all duration-300 hover:scale-105"
                                >
                                    <img
                                        src={`/logos/${org}.png`}
                                        alt={org}
                                        className="h-10 object-contain grayscale hover:grayscale-0 transition duration-500"
                                    />
                                </div>
                            )
                        )}
                    </div>
                </div>
            </section>

            {/* Explore by Cause - Tighter layout */}
            <section className="py-16 bg-white px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            Find Your Passion
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Explore volunteer opportunities across these
                            categories
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                name: "Education",
                                icon: "📚",
                                description: "Empower through knowledge",
                            },
                            {
                                name: "Health",
                                icon: "🏥",
                                description: "Support community wellness",
                            },
                            {
                                name: "Environment",
                                icon: "🌍",
                                description: "Protect our natural world",
                            },
                            {
                                name: "Animal Welfare",
                                icon: "🐾",
                                description: "Care for creatures",
                            },
                        ].map((cat, i) => (
                            <Link
                                key={i}
                                href={`/projects?category=${cat.name}`}
                                className="bg-gradient-to-br from-blue-50 to-white hover:from-blue-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
                            >
                                <div className="text-5xl mb-4 text-center">
                                    {cat.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-blue-800 mb-2 text-center">
                                    {cat.name}
                                </h3>
                                <p className="text-gray-600 text-sm text-center">
                                    {cat.description}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Counter - More refined */}
            <section className="bg-gradient-to-r from-blue-700 to-blue-900 py-16 text-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {[
                            { label: "Volunteers", count: 8423, icon: "👥" },
                            { label: "Projects", count: 320, icon: "🌱" },
                            { label: "Organizations", count: 112, icon: "🏛️" },
                            { label: "Countries", count: 48, icon: "🌎" },
                        ].map((stat, i) => {
                            const { ref, inView } = useInView({
                                triggerOnce: true,
                            });
                            return (
                                <div
                                    key={i}
                                    ref={ref}
                                    className="p-4 rounded-lg bg-white/10 backdrop-blur-sm"
                                >
                                    <div className="text-3xl mb-2">
                                        {stat.icon}
                                    </div>
                                    <div className="text-4xl font-bold mb-1">
                                        {inView ? (
                                            <CountUp
                                                end={stat.count}
                                                duration={2.5}
                                                separator=","
                                                enableScrollSpy
                                                scrollSpyOnce
                                            />
                                        ) : (
                                            "0"
                                        )}
                                        <span className="text-yellow-300">
                                            +
                                        </span>
                                    </div>
                                    <p className="text-lg text-blue-100">
                                        {stat.label}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Featured Volunteer Projects - Streamlined */}
            {/* Featured Volunteer Projects - Streamlined */}
            <section className="py-16 bg-gray-50 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            Featured Projects
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Handpicked opportunities making real impact
                        </p>
                    </div>

                    {featuredProjects.length > 0 ? (
                        <div
                            className="relative"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <div className="relative overflow-hidden">
                                <div
                                    className={`flex transition-transform duration-500 ease-in-out ${
                                        isTransitioning
                                            ? "opacity-90"
                                            : "opacity-100"
                                    }`}
                                    style={{
                                        transform: `translateX(-${
                                            currentIndex *
                                            (100 /
                                                Math.min(
                                                    featuredProjects.length,
                                                    window.innerWidth < 768
                                                        ? 1
                                                        : window.innerWidth <
                                                          1024
                                                        ? 2
                                                        : 3
                                                ))
                                        }%)`,
                                    }}
                                >
                                    {featuredProjects.map((project) => (
                                        <div
                                            key={project.id}
                                            className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-2 sm:px-3"
                                        >
                                            <div className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden relative h-full border border-gray-200">
                                                {/* Project card content remains the same */}
                                                <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold z-10 shadow-sm">
                                                    Featured
                                                </div>

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
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                                                    <div className="absolute bottom-0 left-0 w-full p-5">
                                                        <h3 className="text-xl font-bold text-white mb-1">
                                                            {project.title}
                                                        </h3>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-white/90 font-medium bg-blue-600/30 px-2 py-1 rounded-full">
                                                                {
                                                                    project
                                                                        .category
                                                                        ?.name
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-5">
                                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                        {
                                                            project.short_description
                                                        }
                                                    </p>
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-1">
                                                            <svg
                                                                className="w-4 h-4 text-gray-400"
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
                                                            <span className="text-xs text-gray-500">
                                                                {project.location ||
                                                                    "Multiple locations"}
                                                            </span>
                                                        </div>
                                                        <Link
                                                            href={`/projects/${project.slug}`}
                                                            className="text-blue-600 hover:text-blue-800 font-medium text-xs flex items-center gap-1"
                                                        >
                                                            View Details
                                                            <svg
                                                                className="w-3 h-3"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M9 5l7 7-7 7"
                                                                ></path>
                                                            </svg>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Navigation arrows */}
                            {featuredProjects.length > 3 && (
                                <>
                                    <button
                                        onClick={handlePrev}
                                        disabled={currentIndex === 0}
                                        className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-blue-800 w-10 h-10 rounded-full shadow-md items-center justify-center z-10 transition-all hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 19l-7-7 7-7"
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        disabled={
                                            currentIndex >=
                                            featuredProjects.length - 3
                                        }
                                        className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-blue-800 w-10 h-10 rounded-full shadow-md items-center justify-center z-10 transition-all hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </button>
                                </>
                            )}

                            {/* Mobile navigation dots */}
                            <div className="flex justify-center mt-6 sm:hidden">
                                {Array.from({
                                    length: Math.ceil(
                                        featuredProjects.length /
                                            (window.innerWidth < 768 ? 1 : 2)
                                    ),
                                }).map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`w-3 h-3 mx-1 rounded-full transition-all ${
                                            index === currentIndex
                                                ? "bg-blue-600 w-6"
                                                : "bg-gray-300"
                                        }`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-white rounded-xl shadow-sm max-w-2xl mx-auto">
                            <p className="text-gray-600 mb-4">
                                Currently no featured projects available.
                            </p>
                            <Link
                                href="/projects/create"
                                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
                            >
                                Suggest a Project
                                <svg
                                    className="w-4 h-4 ml-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 5l7 7-7 7"
                                    ></path>
                                </svg>
                            </Link>
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <Link
                            href="/projects"
                            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold shadow-md hover:shadow-lg transition-all"
                        >
                            Browse All Projects
                            <svg
                                className="w-4 h-4 ml-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5l7 7-7 7"
                                ></path>
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Testimonials - More compact */}
            <section className="py-16 bg-white px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            Volunteer Stories
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Hear from people who've transformed lives
                        </p>
                    </div>

                    <div
                        ref={scrollRef}
                        className="flex gap-6 overflow-x-auto pb-6 scroll-smooth"
                    >
                        {testimonials.map((t, i) => (
                            <div key={i} className="flex-shrink-0 w-80">
                                <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all h-full">
                                    <div className="flex items-center mb-4">
                                        <img
                                            src={t.avatar}
                                            alt={t.name}
                                            className="w-10 h-10 rounded-full object-cover border border-white shadow-sm"
                                        />
                                        <div className="ml-3">
                                            <h4 className="font-bold text-gray-900">
                                                {t.name}
                                            </h4>
                                            <p className="text-xs text-blue-600">
                                                {t.role}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="italic text-gray-700 text-sm mb-4">
                                        "{t.quote}"
                                    </p>
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className="w-4 h-4 fill-current"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Organizations - Simplified */}
            <section className="py-16 bg-blue-50 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            Our Partners
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Collaborating with organizations making a difference
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                name: "Hope Foundation",
                                mission: "Education for children",
                                logo: "/hope-foundation.jpg",
                            },
                            {
                                name: "Clean Earth Org",
                                mission: "Environmental conservation",
                                logo: "/clean-earth.jpg",
                            },
                            {
                                name: "Youth4Change",
                                mission: "Empowering young leaders",
                                logo: "/youth4change.jpg",
                            },
                            {
                                name: "Kids First",
                                mission: "Child welfare",
                                logo: "/kids-first.jpg",
                            },
                        ].map((org, i) => (
                            <div
                                key={i}
                                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all text-center"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden border-2 border-blue-100">
                                    <img
                                        src={org.logo}
                                        alt={org.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h4 className="font-bold text-lg text-blue-800 mb-1">
                                    {org.name}
                                </h4>
                                <p className="text-gray-600 text-sm">
                                    {org.mission}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA - More refined */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to make a difference?
                    </h2>
                    <p className="text-lg mb-8 opacity-90">
                        Join thousands of volunteers creating positive change.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href="/register"
                            className="bg-white text-blue-700 px-6 py-3 rounded-full font-bold shadow-md hover:shadow-lg transition-all"
                        >
                            Sign Up Now
                        </Link>
                        <Link
                            href="/projects"
                            className="border border-white text-white px-6 py-3 rounded-full font-bold hover:bg-white/10 transition-all"
                        >
                            Browse Projects
                        </Link>
                    </div>
                </div>
            </section>
        </GeneralPages>
    );
}
