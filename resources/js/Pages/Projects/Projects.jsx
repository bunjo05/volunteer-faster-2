import GeneralPages from "@/Layouts/GeneralPages";
import { Link } from "@inertiajs/react";

export default function Projects({ projects, auth }) {
    return (
        <GeneralPages auth={auth}>
            {/* Page Header */}
            <div className="py-12 px-4 sm:px-6 lg:px-8 text-center bg-blue-50">
                <h1 className="text-4xl font-extrabold text-blue-800 mb-3">
                    Explore Volunteer Projects
                </h1>
                <p className="text-gray-700 max-w-2xl mx-auto text-lg">
                    Discover meaningful opportunities and make a real impact
                    with trusted organizations.
                </p>
            </div>

            {/* Projects Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
                        >
                            <img
                                src={
                                    project.featured_image
                                        ? `/storage/${project.featured_image}`
                                        : "/images/placeholder.jpg"
                                }
                                alt={project.title}
                                className="object-cover w-full h-48 rounded-t-xl"
                            />
                            <div className="p-5 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold text-gray-800 mb-1">
                                    <Link
                                        href={route(
                                            "projects.home.view",
                                            project.slug
                                        )}
                                    >
                                        {project.title}
                                    </Link>
                                </h3>
                                <div className="flex flex-wrap gap-2 text-sm mb-2">
                                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                        {project.category?.name}
                                    </span>
                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                        {project.subcategory?.name}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-sm mb-2">
                                    📍 {project.address}
                                </p>
                                <p className="text-gray-700 flex-grow mb-4">
                                    {project.short_description?.length > 120
                                        ? project.short_description.slice(
                                              0,
                                              120
                                          ) + "..."
                                        : project.short_description}
                                </p>
                                <Link
                                    href={route(
                                        "projects.home.view",
                                        project.slug
                                    )}
                                    className="inline-block mt-auto text-blue-600 font-semibold hover:text-blue-800 transition duration-200"
                                >
                                    View Details →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </GeneralPages>
    );
}
