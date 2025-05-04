import AdminLayout from "@/Layouts/AdminLayout";

export default function Projects() {
    return (
        <AdminLayout>
            <div className="min-h-screen py-8 px-4 sm:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-semibold text-gray-800">
                            Projects
                        </h1>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow">
                            Add Project
                        </button>
                    </div>

                    {/* Search */}
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Projects List */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Example card - replace with map over actual data */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                            {/* Profile Image */}
                            <img
                                src="/storage/images/sample-user.jpg"
                                alt="Profile"
                                className="h-40 w-full object-cover"
                            />

                            {/* Card Body */}
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-1">
                                    Project Name
                                </h2>
                                <p className="text-sm text-gray-500 mb-2">
                                    Role: Project Manager
                                </p>
                                <p className="text-gray-600 text-sm mb-4">
                                    Description of the project goes here.
                                </p>

                                <div className="text-sm text-gray-500 mb-2">
                                    <span className="font-semibold">
                                        Email:
                                    </span>{" "}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
