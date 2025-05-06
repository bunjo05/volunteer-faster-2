import AdminLayout from "@/Layouts/AdminLayout";
import { usePage } from "@inertiajs/react";
import { CalendarDays, Clock, DollarSign, Globe, Users } from "lucide-react";

export default function Projects() {
    const { projects = [] } = usePage().props;

    return (
        <AdminLayout>
            <div className="min-h-screen py-8 px-4 sm:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800">
                        All Projects
                    </h1>

                    {/* Search Input */}
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Project Cards Grid */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
                            >
                                {/* Image */}
                                {/* <div className="h-48"> */}
                                <img
                                    src={
                                        project.featured_image
                                            ? `/storage/${project.featured_image}`
                                            : "/images/placeholder.jpg"
                                    }
                                    alt={project.title}
                                    className="object-cover h-48 w-full"
                                />
                                {/* </div> */}

                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    {/* Title and Organization */}
                                    <div className="mb-2">
                                        <h2 className="text-lg font-bold text-gray-900">
                                            {project.title}
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            Organization:{" "}
                                            <span className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full text-xs">
                                                {project.organization_profile
                                                    ?.name ?? "N/A"}
                                            </span>
                                        </p>
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                                        {project.short_description}
                                    </p>

                                    {/* Quick Info Badges */}
                                    <div className="flex flex-wrap gap-2 text-xs mb-3">
                                        {project.duration && (
                                            <span className="flex items-center gap-1 bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                                                <Clock className="w-3 h-3" />
                                                {project.duration}
                                            </span>
                                        )}
                                        {project.fees && (
                                            <span className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                <DollarSign className="w-3 h-3" />
                                                {project.fees}{" "}
                                                {project.currency}
                                            </span>
                                        )}
                                        {project.start_date && (
                                            <span className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                <CalendarDays className="w-3 h-3" />
                                                {new Date(
                                                    project.start_date
                                                ).toLocaleDateString()}
                                            </span>
                                        )}
                                        {project.country && (
                                            <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                                <Globe className="w-3 h-3" />
                                                {project.country}
                                            </span>
                                        )}
                                    </div>

                                    {/* Suitable Tags */}
                                    {Array.isArray(project.suitable) &&
                                        project.suitable.length > 0 && (
                                            <div className="mb-3">
                                                <p className="text-xs text-gray-500 font-medium mb-1">
                                                    Suitable For:
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {project.suitable.map(
                                                        (item, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full text-xs"
                                                            >
                                                                {item}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    {/* Status */}
                                    <div className="mt-auto flex justify-between items-center">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${
                                                project.status === "active"
                                                    ? "bg-green-500"
                                                    : project.status ===
                                                      "pending"
                                                    ? "bg-yellow-500"
                                                    : "bg-red-500"
                                            }`}
                                        >
                                            {project.status}
                                        </span>

                                        <a
                                            href={`/projects/${project.slug}`}
                                            className="text-sm text-blue-600 hover:underline font-medium"
                                        >
                                            View Details
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {projects.length === 0 && (
                        <p className="mt-10 text-center text-gray-500">
                            No projects found.
                        </p>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
