import GeneralPages from "@/Layouts/GeneralPages";
import { Link } from "@inertiajs/react";

export default function Projects({ projects }) {
    // Example projects array (replace with real data)
    // const projects = [
    //     {
    //         id: 1,
    //         title: "Teach English in Rural Uganda",
    //         location: "Kampala, Uganda",
    //         organization: "Hope for Tomorrow",
    //         shortDescription:
    //             "Help young children learn basic English and communication skills.",
    //         image: "/images/teaching.jpg",
    //     },
    //     {
    //         id: 2,
    //         title: "Environmental Conservation Program",
    //         location: "Nairobi, Kenya",
    //         organization: "Green Earth Africa",
    //         shortDescription:
    //             "Join efforts to plant trees and promote eco-awareness in schools.",
    //         image: "/images/conservation.jpg",
    //     },
    //     {
    //         id: 3,
    //         title: "Healthcare Support Initiative",
    //         location: "Accra, Ghana",
    //         organization: "Heal Africa Foundation",
    //         shortDescription:
    //             "Assist local clinics with patient support, health education, and more.",
    //         image: "/images/healthcare.jpg",
    //     },
    // ];

    return (
        <GeneralPages>
            {/* Header */}
            <div className="py-12 px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Explore Volunteer Projects
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Discover meaningful projects from trusted organizations and
                    make a real difference.
                </p>
            </div>

            {/* Projects Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-white rounded-lg shadow hover:shadow-lg transition"
                        >
                            <img
                                src={
                                    project.featured_image
                                        ? `/storage/${project.featured_image}`
                                        : "/images/placeholder.jpg"
                                }
                                alt={project.title}
                                className="object-cover w-[200px] h-full rounded-lg"
                            />
                            {/* <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-48 object-cover rounded-t-lg"
                            /> */}
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-blue-600 mb-1">
                                    {project.title}
                                </h3>
                                <p className="text-gray-500 text-sm mb-2">
                                    {project.organization} — {project.location}
                                </p>
                                <p className="text-gray-600 mb-4">
                                    {project.shortDescription}
                                </p>
                                <Link
                                    href={`/projects/${project.id}`}
                                    className="text-blue-600 hover:underline font-medium"
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
