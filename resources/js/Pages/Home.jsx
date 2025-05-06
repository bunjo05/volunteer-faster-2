import GeneralPages from "@/Layouts/GeneralPages";
import { Link } from "@inertiajs/react";

export default function Home() {
    return (
        <GeneralPages>
            <section className="text-center">
                {/* Hero Section */}
                <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-blue-400 text-white rounded-lg shadow-md">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                        Connect with Meaningful Volunteer Opportunities
                    </h1>
                    <p className="text-lg sm:text-xl mb-6">
                        Join our platform to support impactful causes around the
                        world.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            href="/register"
                            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
                        >
                            Join as Volunteer
                        </Link>
                        <Link
                            href="/register-organization"
                            className="border border-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
                        >
                            Register Organization
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-center mb-10 text-gray-800">
                    Why Choose Volunteer Faster?
                </h2>
                <div className="grid gap-8 md:grid-cols-3 text-center">
                    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                        <h3 className="text-xl font-semibold text-blue-600 mb-2">
                            Global Opportunities
                        </h3>
                        <p className="text-gray-600">
                            Explore programs across continents and make a global
                            impact.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                        <h3 className="text-xl font-semibold text-blue-600 mb-2">
                            Verified Organizations
                        </h3>
                        <p className="text-gray-600">
                            We ensure every organization is vetted for
                            authenticity and purpose.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                        <h3 className="text-xl font-semibold text-blue-600 mb-2">
                            Flexible Scheduling
                        </h3>
                        <p className="text-gray-600">
                            Find opportunities that suit your time and
                            availability.
                        </p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 bg-gray-100 px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-center mb-10 text-gray-800">
                    How It Works
                </h2>
                <div className="grid gap-8 md:grid-cols-3 text-center">
                    <div>
                        <div className="text-blue-600 text-4xl font-bold mb-2">
                            1
                        </div>
                        <h4 className="font-semibold text-lg mb-1">
                            Create an Account
                        </h4>
                        <p className="text-gray-600">
                            Sign up as a volunteer or organization.
                        </p>
                    </div>
                    <div>
                        <div className="text-blue-600 text-4xl font-bold mb-2">
                            2
                        </div>
                        <h4 className="font-semibold text-lg mb-1">
                            Explore Programs
                        </h4>
                        <p className="text-gray-600">
                            Search by location, cause, or organization.
                        </p>
                    </div>
                    <div>
                        <div className="text-blue-600 text-4xl font-bold mb-2">
                            3
                        </div>
                        <h4 className="font-semibold text-lg mb-1">
                            Start Volunteering
                        </h4>
                        <p className="text-gray-600">
                            Apply and begin your impact journey.
                        </p>
                    </div>
                </div>
            </section>

            {/* Final Call to Action */}
            <section className="py-16 text-center px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Ready to Make a Difference?
                </h2>
                <p className="mb-6 text-gray-600">
                    Start your journey by joining our growing volunteer
                    community.
                </p>
                <Link
                    href="/register"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    Get Started
                </Link>
            </section>
        </GeneralPages>
    );
}
