import GeneralPages from "@/Layouts/GeneralPages";
import { Head } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";

export default function Home({ projects, auth, platformReviews, seo }) {
    // Get APP_URL from environment (set in your Laravel .env file)
    const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;

    // Define currentUrl safely
    const currentUrl =
        typeof window !== "undefined" ? window.location.href : appUrl;

    // Default SEO values
    const defaultSeo = {
        title: "Volunteer Platform - Find Meaningful Volunteer Opportunities",
        description:
            "Join a global community of changemakers creating lasting impact through volunteer work.",
        keywords:
            "volunteer, volunteering, charity, non-profit, community service, humanitarian work",
        image: "/hero.jpg",
        url: currentUrl, // Use currentUrl here
        type: "website",
    };

    // Merge provided SEO with defaults
    const pageSeo = { ...defaultSeo, ...seo };

    // Generate full image URL
    const fullImageUrl = pageSeo.image.startsWith("http")
        ? pageSeo.image
        : `${appUrl}${pageSeo.image}`;

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
    const [testimonialIndex, setTestimonialIndex] = useState(0);

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => handleNext(),
        onSwipedRight: () => handlePrev(),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true,
    });

    const testimonialSwipeHandlers = useSwipeable({
        onSwipedLeft: () => handleTestimonialNext(),
        onSwipedRight: () => handleTestimonialPrev(),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true,
    });

    const featuredProjects =
        projects?.filter((project) => {
            return project.featured_projects?.find(
                (fp) => fp.status === "approved" && fp.is_active === 1
            );
        }) || [];

    useEffect(() => {
        if (featuredProjects.length <= getVisibleSlides() || isHovered) return;

        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentIndex(
                    (prev) =>
                        (prev + 1) %
                        (featuredProjects.length - (getVisibleSlides() - 1))
                );
                setIsTransitioning(false);
            }, 500);
        }, 5000);

        return () => clearInterval(interval);
    }, [featuredProjects.length, currentIndex, isHovered]);

    useEffect(() => {
        const interval = setInterval(() => {
            handleTestimonialNext();
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    const getVisibleSlides = () => {
        if (typeof window === "undefined") return 3;
        return window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
    };

    const getVisibleTestimonials = () => {
        if (typeof window === "undefined") return 3;
        return window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
    };

    const handlePrev = () => {
        if (featuredProjects.length <= getVisibleSlides()) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex((prev) => Math.max(0, prev - 1));
            setIsTransitioning(false);
        }, 500);
    };

    const handleNext = () => {
        if (featuredProjects.length <= getVisibleSlides()) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex((prev) =>
                Math.min(featuredProjects.length - getVisibleSlides(), prev + 1)
            );
            setIsTransitioning(false);
        }, 500);
    };

    const handleTestimonialPrev = () => {
        setTestimonialIndex((prev) => {
            if (prev === 0) {
                return testimonials.length - getVisibleTestimonials();
            }
            return Math.max(0, prev - 1);
        });
    };

    const handleTestimonialNext = () => {
        setTestimonialIndex((prev) => {
            if (prev >= testimonials.length - getVisibleTestimonials()) {
                return 0;
            }
            return prev + 1;
        });
    };

    const goToSlide = (index) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex(index);
            setIsTransitioning(false);
        }, 500);
    };

    const goToTestimonial = (index) => {
        setTestimonialIndex(index);
    };

    return (
        <>
            <Head>
                {/* Primary Meta Tags */}
                <title>{pageSeo.title}</title>
                <meta name="title" content={pageSeo.title} />
                <meta name="description" content={pageSeo.description} />
                <meta name="keywords" content={pageSeo.keywords} />
                <meta name="author" content="Volunteer Faster" />
                <meta name="robots" content="index, follow" />
                <meta name="language" content="English" />

                {/* Open Graph / Facebook - Enhanced */}
                <meta property="og:type" content={pageSeo.type} />
                <meta property="og:url" content={currentUrl} />
                <meta property="og:title" content={pageSeo.title} />
                <meta property="og:description" content={pageSeo.description} />
                <meta property="og:image" content={fullImageUrl} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta
                    property="og:image:alt"
                    content="Volunteer Faster | Find meaningful volunteer opportunities"
                />
                <meta property="og:site_name" content="Volunteer Faster" />
                <meta property="og:locale" content="en_US" />

                {/* Additional OG tags for better sharing */}
                <meta
                    property="og:see_also"
                    content="https://www.facebook.com/volunteerfaster"
                />
                <meta
                    property="og:see_also"
                    content="https://www.instagram.com/volunteerfaster"
                />
                <meta
                    property="og:see_also"
                    content="https://twitter.com/volunteerfaster"
                />

                {/* Twitter Card - Enhanced */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={currentUrl} />
                <meta name="twitter:title" content={pageSeo.title} />
                <meta
                    name="twitter:description"
                    content={pageSeo.description}
                />
                <meta name="twitter:image" content={fullImageUrl} />
                <meta name="twitter:site" content="@volunteerfaster" />
                <meta name="twitter:creator" content="@volunteerfaster" />
                <meta
                    name="twitter:image:alt"
                    content="Volunteer Faster | Find meaningful volunteer opportunities"
                />

                {/* Additional Meta Tags */}
                <link rel="canonical" href={currentUrl} />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />

                {/* Structured Data for SEO - Enhanced */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        name: "Volunteer Faster",
                        url: appUrl,
                        logo: `${appUrl}/logo.png`,
                        description: pageSeo.description,
                        sameAs: [
                            "https://www.facebook.com/volunteerfaster",
                            "https://twitter.com/volunteerfaster",
                            "https://www.instagram.com/volunteerfaster",
                            "https://www.linkedin.com/company/volunteerfaster",
                        ],
                    })}
                </script>

                {/* Additional schema for WebPage */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        name: pageSeo.title,
                        description: pageSeo.description,
                        url: currentUrl,
                        publisher: {
                            "@type": "Organization",
                            name: "Volunteer Faster",
                            logo: `${appUrl}/logo.png`,
                        },
                    })}
                </script>
            </Head>

            <GeneralPages auth={auth}>
                {/* Hero Section */}
                <section
                    className="hero min-h-screen"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/hero.jpg')",
                    }}
                >
                    <div className="hero-overlay bg-opacity-60 bg-gradient-to-br from-blue-900/80 via-blue-700/60 to-blue-600/50"></div>
                    <div className="hero-content text-center text-neutral-content">
                        <div className="max-w-3xl">
                            <h1 className="mb-5 text-4xl sm:text-5xl md:text-6xl font-bold">
                                <span className="text-green-300">Discover</span>{" "}
                                meaningful volunteer opportunities
                            </h1>
                            <p className="mb-8 text-lg md:text-xl opacity-90">
                                Join a global community of changemakers creating
                                lasting impact.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/register"
                                    className="btn btn-primary text-white hover:bg-yellow-300 shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
                                >
                                    Join as Volunteer
                                </Link>
                                <Link
                                    href="/register"
                                    className="btn btn-outline text-white border-white hover:bg-white/10 hover:border-white transform hover:scale-105 transition-all"
                                >
                                    Register Organization
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Trusted By */}
                <section className="py-8 bg-base-200">
                    <div className="container mx-auto px-6">
                        <p className="text-center text-sm uppercase mb-6 tracking-wider text-base-content/70">
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
                                            alt={`${org} logo`}
                                            className="h-10 object-contain grayscale hover:grayscale-0 transition duration-500"
                                        />
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </section>

                {/* Explore by Cause */}
                <section className="py-16 bg-base-100">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-3">
                                Find Your Passion
                            </h2>
                            <p className="text-base-content/70 max-w-2xl mx-auto">
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
                                    className="card bg-gradient-to-br from-base-200 to-base-100 hover:from-primary/10 border border-base-300 hover:border-primary/30 transition-all hover:shadow-lg"
                                >
                                    <div className="card-body items-center text-center">
                                        <div className="text-5xl mb-4">
                                            {cat.icon}
                                        </div>
                                        <h3 className="card-title text-primary">
                                            {cat.name}
                                        </h3>
                                        <p className="text-base-content/70">
                                            {cat.description}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats Counter */}
                <section className="py-16 bg-gradient-to-r from-primary to-secondary text-primary-content">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                            {[
                                {
                                    label: "Volunteers",
                                    count: 8423,
                                    icon: "👥",
                                },
                                { label: "Projects", count: 320, icon: "🌱" },
                                {
                                    label: "Organizations",
                                    count: 112,
                                    icon: "🏛️",
                                },
                                { label: "Countries", count: 48, icon: "🌎" },
                            ].map((stat, i) => {
                                const { ref, inView } = useInView({
                                    triggerOnce: true,
                                });
                                return (
                                    <div
                                        key={i}
                                        ref={ref}
                                        className="card bg-base-100/10 backdrop-blur-sm"
                                    >
                                        <div className="card-body">
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
                                                <span className="text-accent">
                                                    +
                                                </span>
                                            </div>
                                            <p className="text-lg">
                                                {stat.label}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Featured Volunteer Projects */}
                <section className="py-16 bg-base-200">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-3">
                                Featured Projects
                            </h2>
                            <p className="text-base-content/70 max-w-2xl mx-auto">
                                Handpicked opportunities making real impact
                            </p>
                        </div>

                        {featuredProjects.length > 0 ? (
                            <div
                                className="relative"
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                <div
                                    className="relative overflow-hidden"
                                    {...swipeHandlers}
                                >
                                    <div
                                        className={`flex transition-transform duration-500 ease-in-out ${
                                            isTransitioning
                                                ? "opacity-90"
                                                : "opacity-100"
                                        }`}
                                        style={{
                                            transform: `translateX(-${
                                                currentIndex *
                                                (100 / getVisibleSlides())
                                            }%)`,
                                        }}
                                    >
                                        {featuredProjects.map((project) => (
                                            <div
                                                key={project.id}
                                                className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-2 sm:px-3"
                                            >
                                                <div className="card bg-base-100 shadow-sm hover:shadow-md transition-all h-full group">
                                                    <figure className="relative h-64 overflow-hidden">
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
                                                        <div className="badge badge-primary absolute top-4 left-4 z-10 shadow-sm">
                                                            Featured
                                                        </div>
                                                    </figure>
                                                    <div className="card-body">
                                                        <h3 className="card-title">
                                                            {project.title}
                                                        </h3>
                                                        <div className="badge badge-outline">
                                                            {
                                                                project.category
                                                                    ?.name
                                                            }
                                                        </div>
                                                        <p className="line-clamp-2 text-base-content/70">
                                                            {
                                                                project.short_description
                                                            }
                                                        </p>
                                                        <div className="card-actions justify-between items-center mt-4">
                                                            <div className="flex items-center gap-1 text-sm">
                                                                <svg
                                                                    className="w-4 h-4"
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
                                                                <span>
                                                                    {project.location ||
                                                                        "Multiple locations"}
                                                                </span>
                                                            </div>
                                                            <Link
                                                                href={`/projects/${project.slug}`}
                                                                className="link link-primary text-sm flex items-center gap-1"
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

                                {featuredProjects.length >
                                    getVisibleSlides() && (
                                    <>
                                        <button
                                            onClick={handlePrev}
                                            disabled={currentIndex === 0}
                                            className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 btn btn-circle btn-sm btn-primary shadow-md z-10 hover:scale-110 transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            ❮
                                        </button>
                                        <button
                                            onClick={handleNext}
                                            disabled={
                                                currentIndex >=
                                                featuredProjects.length -
                                                    getVisibleSlides()
                                            }
                                            className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 btn btn-circle btn-sm btn-primary shadow-md z-10 hover:scale-110 transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            ❯
                                        </button>
                                    </>
                                )}

                                <div className="flex justify-center mt-6 sm:hidden">
                                    {Array.from({
                                        length: Math.ceil(
                                            featuredProjects.length /
                                                getVisibleSlides()
                                        ),
                                    }).map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => goToSlide(index)}
                                            className={`w-3 h-3 mx-1 rounded-full transition-all ${
                                                index === currentIndex
                                                    ? "bg-primary w-6"
                                                    : "bg-base-content/20"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="card bg-base-100 shadow-sm max-w-2xl mx-auto">
                                <div className="card-body text-center">
                                    <p className="text-base-content/70 mb-4">
                                        Currently no featured projects
                                        available.
                                    </p>
                                    <Link
                                        href="/projects/create"
                                        className="link link-primary"
                                    >
                                        Suggest a Project
                                    </Link>
                                </div>
                            </div>
                        )}

                        <div className="text-center mt-12">
                            <Link
                                href="/projects"
                                className="btn btn-primary shadow-md hover:shadow-lg"
                            >
                                Browse All Projects
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Testimonials - Show 3 at a time */}
                <section className="py-16 bg-base-100 overflow-hidden">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-3">
                                Volunteer Stories
                            </h2>
                            <p className="text-base-content/70 max-w-2xl mx-auto">
                                Hear from people who've transformed lives
                            </p>
                        </div>

                        {platformReviews.length > 0 ? (
                            <div
                                className="relative"
                                {...testimonialSwipeHandlers}
                            >
                                <div className="overflow-hidden">
                                    <div
                                        className="flex transition-transform duration-500 ease-in-out"
                                        style={{
                                            transform: `translateX(-${
                                                testimonialIndex *
                                                (100 / getVisibleTestimonials())
                                            }%)`,
                                        }}
                                    >
                                        {platformReviews.map(
                                            (testimonial, index) => (
                                                <div
                                                    key={index}
                                                    className="w-full flex-shrink-0 px-4"
                                                    style={{
                                                        width: `${
                                                            100 /
                                                            getVisibleTestimonials()
                                                        }%`,
                                                    }}
                                                >
                                                    <div className="card bg-base-200 shadow-md hover:shadow-lg transition-all h-full">
                                                        <div className="card-body items-center text-center">
                                                            <div className="flex items-center mb-4">
                                                                <div className="avatar">
                                                                    <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                                                        <img
                                                                            src={`/storage/${testimonial.volunteer_profile.profile_picture}`}
                                                                            alt={
                                                                                testimonial
                                                                                    .user
                                                                                    .name
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="ml-3">
                                                                    <h4 className="font-bold">
                                                                        {
                                                                            testimonial
                                                                                .user
                                                                                .name
                                                                        }
                                                                    </h4>
                                                                    <div>
                                                                        <p className="text-sm text-primary">
                                                                            {
                                                                                testimonial
                                                                                    .volunteer_profile
                                                                                    .country
                                                                            }
                                                                        </p>
                                                                        <p className="text-sm text-primary">
                                                                            {
                                                                                testimonial
                                                                                    .volunteer_profile
                                                                                    .state
                                                                            }
                                                                        </p>
                                                                        <p className="text-sm text-primary">
                                                                            {
                                                                                testimonial
                                                                                    .volunteer_profile
                                                                                    .city
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <p className="italic text-base-content/80 mb-4">
                                                                "
                                                                {
                                                                    testimonial.message
                                                                }
                                                                "
                                                            </p>
                                                            <div className="rating rating-sm">
                                                                {[
                                                                    ...Array(5),
                                                                ].map(
                                                                    (_, i) => (
                                                                        <input
                                                                            key={
                                                                                i
                                                                            }
                                                                            type="radio"
                                                                            name={`rating-${index}`}
                                                                            className="mask mask-star-2 bg-yellow-400"
                                                                            checked
                                                                            readOnly
                                                                        />
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* Navigation buttons */}
                                <button
                                    onClick={handleTestimonialPrev}
                                    disabled={testimonialIndex === 0}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 btn btn-circle btn-sm btn-primary shadow-md z-10 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    ❮
                                </button>
                                <button
                                    onClick={handleTestimonialNext}
                                    disabled={
                                        testimonialIndex >=
                                        platformReviews.length -
                                            getVisibleTestimonials()
                                    }
                                    className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-circle btn-sm btn-primary shadow-md z-10 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    ❯
                                </button>

                                {/* Dots indicator */}
                                <div className="flex justify-center mt-6">
                                    {Array.from({
                                        length:
                                            platformReviews.length -
                                            getVisibleTestimonials() +
                                            1,
                                    }).map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                goToTestimonial(index)
                                            }
                                            className={`w-3 h-3 mx-1 rounded-full transition-all ${
                                                index === testimonialIndex
                                                    ? "bg-primary w-6"
                                                    : "bg-base-content/20"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-base-content/70">
                                No testimonials available yet.
                            </p>
                        )}
                    </div>
                </section>

                {/* Organizations */}
                <section className="py-16 bg-base-200">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-3">
                                Our Partners
                            </h2>
                            <p className="text-base-content/70 max-w-2xl mx-auto">
                                Collaborating with organizations making a
                                difference
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    name: "Panmark Charity",
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
                                    className="card bg-base-100 shadow-sm hover:shadow-md transition-all"
                                >
                                    <div className="card-body items-center text-center">
                                        <div className="avatar mb-4">
                                            <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                                <img
                                                    src={org.logo}
                                                    alt={org.name}
                                                />
                                            </div>
                                        </div>
                                        <h4 className="card-title text-primary">
                                            {org.name}
                                        </h4>
                                        <p className="text-base-content/70">
                                            {org.mission}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 bg-gradient-to-r from-primary to-secondary text-primary-content">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ready to make a difference?
                        </h2>
                        <p className="text-xl mb-8 opacity-90">
                            Join thousands of volunteers creating positive
                            change.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                href="/register"
                                className="btn btn-accent text-primary-content shadow-md hover:shadow-lg"
                            >
                                Sign Up Now
                            </Link>
                            <Link
                                href="/projects"
                                className="btn btn-outline btn-accent border-white text-white hover:bg-white/10"
                            >
                                Browse Projects
                            </Link>
                        </div>
                    </div>
                </section>
            </GeneralPages>
        </>
    );
}
