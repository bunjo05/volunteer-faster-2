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
            {/* Hero Section */}
            <section
                className="relative bg-cover bg-center bg-no-repeat h-screen min-h-[700px] flex items-center justify-center bg-fixed"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/hero.jpg')",
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-700/60 to-blue-600/50 z-10"></div>

                <div className="relative z-20 container mx-auto px-6 lg:px-16 text-center">
                    <div className="max-w-3xl mx-auto animate-fade-in-up">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white mb-6">
                            <span className="text-yellow-300">Discover</span>{" "}
                            meaningful volunteer opportunities that{" "}
                            <span className="text-yellow-300">
                                change lives
                            </span>
                        </h1>
                        <p className="text-white text-lg md:text-xl lg:text-2xl mb-10 opacity-90 leading-relaxed">
                            Join a global community of changemakers. Find
                            purpose-driven projects that match your passion and
                            create lasting impact.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                            <Link
                                href="/register"
                                className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg"
                            >
                                Join as Volunteer
                            </Link>
                            <Link
                                href="/register-organization"
                                className="px-8 py-4 rounded-full border-2 border-white text-white font-bold hover:bg-white/10 transition-all duration-300 hover:scale-105 text-lg"
                            >
                                Register Organization
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Scrolling indicator */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
                    <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        ></path>
                    </svg>
                </div>
            </section>

            {/* Trusted By */}
            <section className="bg-gray-50 py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <p className="text-gray-500 text-sm uppercase mb-6 tracking-wider text-center font-medium">
                        Trusted by leading organizations worldwide
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-12 opacity-90">
                        {[
                            "unicef",
                            "red-cross",
                            "who",
                            "greenpeace",
                            "wwf",
                            "amnesty",
                        ].map((org) => (
                            <div
                                key={org}
                                className="transition-all duration-300 hover:scale-110 hover:opacity-100"
                            >
                                <img
                                    src={`/logos/${org}.png`}
                                    alt={org}
                                    className="h-12 object-contain grayscale hover:grayscale-0 transition duration-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Explore by Cause */}
            <section className="py-24 bg-white px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Find Your Passion
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Explore volunteer opportunities across these
                            impactful categories
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                name: "Education",
                                icon: "📚",
                                description:
                                    "Empower through knowledge and learning opportunities",
                            },
                            {
                                name: "Health",
                                icon: "🏥",
                                description:
                                    "Support medical care and community wellness",
                            },
                            {
                                name: "Environment",
                                icon: "🌍",
                                description:
                                    "Protect and preserve our natural world",
                            },
                            {
                                name: "Animal Welfare",
                                icon: "🐾",
                                description:
                                    "Care for creatures great and small",
                            },
                        ].map((cat, i) => (
                            <Link
                                key={i}
                                href={`/projects?category=${cat.name}`}
                                className="bg-gradient-to-br from-blue-50 to-white hover:from-blue-100 hover:to-blue-50 transition-all p-8 rounded-2xl shadow-md hover:shadow-xl group border border-gray-100"
                            >
                                <div className="text-6xl mb-5 group-hover:scale-110 transition-transform duration-300 text-center">
                                    {cat.icon}
                                </div>
                                <h3 className="text-2xl font-semibold text-blue-800 mb-3 text-center">
                                    {cat.name}
                                </h3>
                                <p className="text-gray-600 text-center">
                                    {cat.description}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Counter */}
            <section className="bg-gradient-to-r from-blue-700 to-blue-900 py-24 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
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
                                    className="p-6 rounded-xl bg-white/10 backdrop-blur-sm"
                                >
                                    <div className="text-4xl mb-3">
                                        {stat.icon}
                                    </div>
                                    <div className="text-5xl font-bold mb-2">
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
                                    <p className="text-xl font-medium text-blue-100">
                                        {stat.label}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Featured Volunteer Projects */}
            <section className="py-24 bg-gray-50 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Featured Volunteer Projects
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Handpicked opportunities making real impact around
                            the world
                        </p>
                    </div>

                    {featuredProjects.length > 0 ? (
                        <div
                            className="relative"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            {/* Carousel container */}
                            <div className="relative overflow-hidden">
                                <div
                                    className={`flex transition-transform duration-500 ease-in-out ${
                                        isTransitioning
                                            ? "opacity-90"
                                            : "opacity-100"
                                    }`}
                                    style={{
                                        transform: `translateX(-${
                                            currentIndex * (100 / 3)
                                        }%)`,
                                    }}
                                >
                                    {featuredProjects.map((project) => (
                                        <div
                                            key={project.id}
                                            className="w-1/3 flex-shrink-0 px-4"
                                        >
                                            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden relative h-full border border-gray-200 hover:border-blue-200">
                                                {/* Featured badge */}
                                                <div className="absolute top-5 left-5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-4 py-1 rounded-full text-xs font-bold z-10 transform group-hover:scale-105 transition-transform shadow-md">
                                                    Featured
                                                </div>

                                                {/* Image */}
                                                <div className="relative h-72 w-full overflow-hidden">
                                                    <img
                                                        src={
                                                            project.featured_image
                                                                ? `/storage/${project.featured_image}`
                                                                : "/images/default-project.jpg"
                                                        }
                                                        alt={project.title}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                                                    <div className="absolute bottom-0 left-0 w-full p-6">
                                                        <h3 className="text-2xl font-bold text-white mb-2">
                                                            {project.title}
                                                        </h3>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-white/90 font-medium bg-blue-600/30 px-3 py-1 rounded-full backdrop-blur-sm">
                                                                {
                                                                    project
                                                                        .category
                                                                        ?.name
                                                                }
                                                            </span>
                                                            {project.subcategory
                                                                ?.name && (
                                                                <span className="text-sm text-white/90 font-medium bg-blue-600/30 px-3 py-1 rounded-full backdrop-blur-sm">
                                                                    {
                                                                        project
                                                                            .subcategory
                                                                            ?.name
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="p-6">
                                                    <p className="text-gray-600 mb-5 line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                                                        {
                                                            project.short_description
                                                        }
                                                    </p>
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-2">
                                                            <svg
                                                                className="w-5 h-5 text-gray-400"
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
                                                            <span className="text-sm text-gray-500">
                                                                {project.location ||
                                                                    "Multiple locations"}
                                                            </span>
                                                        </div>
                                                        <Link
                                                            href={`/projects/${project.slug}`}
                                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 transition-all group-hover:gap-2"
                                                        >
                                                            View Details
                                                            <svg
                                                                className="w-4 h-4 transition-transform group-hover:translate-x-1"
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

                            {/* Navigation */}
                            {featuredProjects.length > 3 && (
                                <>
                                    <button
                                        onClick={handlePrev}
                                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow-xl hover:bg-gray-50 transition-all duration-300 z-10 hover:scale-110 -ml-6"
                                        aria-label="Previous slide"
                                    >
                                        <svg
                                            className="w-6 h-6 text-gray-700 hover:text-blue-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 19l-7-7 7-7"
                                            ></path>
                                        </svg>
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow-xl hover:bg-gray-50 transition-all duration-300 z-10 hover:scale-110 -mr-6"
                                        aria-label="Next slide"
                                    >
                                        <svg
                                            className="w-6 h-6 text-gray-700 hover:text-blue-600"
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
                                    </button>
                                </>
                            )}

                            {/* Pagination */}
                            {featuredProjects.length > 3 && (
                                <div className="flex justify-center mt-10 space-x-2">
                                    {Array.from({
                                        length: Math.ceil(
                                            featuredProjects.length / 3
                                        ),
                                    }).map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => goToSlide(index * 3)}
                                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                                Math.floor(currentIndex / 3) ===
                                                index
                                                    ? "bg-blue-600 w-8"
                                                    : "bg-gray-300 hover:bg-gray-400"
                                            }`}
                                            aria-label={`Go to slide ${
                                                index + 1
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-2xl shadow-sm max-w-3xl mx-auto">
                            <p className="text-gray-600 mb-6 text-lg">
                                Currently no featured projects available. Check
                                back soon!
                            </p>
                            <Link
                                href="/projects/create"
                                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-lg group"
                            >
                                Suggest a Project
                                <svg
                                    className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1"
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

                    <div className="text-center mt-16">
                        <Link
                            href="/projects"
                            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            Browse All Projects
                            <svg
                                className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1"
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

            {/* Testimonials */}
            <section className="py-24 bg-white px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Volunteer Stories
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Hear from people who've transformed lives through
                            volunteering
                        </p>
                    </div>

                    <div
                        ref={scrollRef}
                        className="flex gap-8 overflow-x-auto pb-8 scroll-smooth px-2"
                    >
                        <style jsx>{`
                            ::-webkit-scrollbar {
                                display: none;
                            }
                        `}</style>
                        {testimonials.map((t, i) => (
                            <div key={i} className="flex-shrink-0 w-96">
                                <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 h-full">
                                    <div className="flex items-center mb-6">
                                        <img
                                            src={t.avatar}
                                            alt={t.name}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                                        />
                                        <div className="ml-4">
                                            <h4 className="font-bold text-gray-900">
                                                {t.name}
                                            </h4>
                                            <p className="text-sm text-blue-600">
                                                {t.role}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="italic text-gray-700 text-lg mb-6 leading-relaxed">
                                        "{t.quote}"
                                    </p>
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className="w-5 h-5 fill-current"
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

            {/* Organizations */}
            <section className="py-24 bg-blue-50 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Our Impact Partners
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Collaborating with organizations making a difference
                            worldwide
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                name: "Hope Foundation",
                                mission:
                                    "Education for underprivileged children",
                                logo: "/hope-foundation.jpg",
                            },
                            {
                                name: "Clean Earth Org",
                                mission:
                                    "Environmental conservation and sustainability",
                                logo: "/clean-earth.jpg",
                            },
                            {
                                name: "Youth4Change",
                                mission: "Empowering young leaders globally",
                                logo: "/youth4change.jpg",
                            },
                            {
                                name: "Kids First",
                                mission: "Child welfare and development",
                                logo: "/kids-first.jpg",
                            },
                        ].map((org, i) => (
                            <div
                                key={i}
                                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 text-center"
                            >
                                <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-4 border-blue-100 shadow-inner">
                                    <img
                                        src={org.logo}
                                        alt={org.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h4 className="font-bold text-xl text-blue-800 mb-2">
                                    {org.name}
                                </h4>
                                <p className="text-gray-600">{org.mission}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Ready to make a difference?
                    </h2>
                    <p className="text-xl mb-10 opacity-90 leading-relaxed">
                        Join thousands of volunteers creating positive change
                        around the world. Your journey starts here.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-5">
                        <Link
                            href="/register"
                            className="bg-white text-blue-700 px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 text-lg"
                        >
                            Sign Up Now
                        </Link>
                        <Link
                            href="/projects"
                            className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all hover:scale-105 text-lg"
                        >
                            Browse Projects
                        </Link>
                    </div>
                </div>
            </section>
        </GeneralPages>
    );
}
