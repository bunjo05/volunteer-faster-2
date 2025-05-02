import { useState } from "react";
// import Inertia from "@inertiajs/react";

import { Inertia } from "@inertiajs/react"; // Use Inertia for POST request
import OrganizationLayout from "@/Layouts/OrganizationLayout";

export default function Profile({ organization }) {
    const [org, setOrg] = useState(organization); // state to hold the organization data
    const [isEditing, setIsEditing] = useState(false); // state to toggle between view and edit modes

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrg((prevOrg) => ({
            ...prevOrg,
            [name]: value,
        }));
    };

    const handleSaveClick = () => {
        // Send the updated data to the server
        Inertia.post(route("organization.profile.update"), org, {
            onSuccess: () => {
                setIsEditing(false);
            },
        });
    };

    return (
        <OrganizationLayout>
            <section className="max-w-4xl mx-auto bg-white shadow rounded p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Organization Profile
                    </h2>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                        >
                            Edit Profile
                        </button>
                    )}
                    {isEditing && (
                        <button
                            onClick={handleSaveClick}
                            className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                        >
                            Save Profile
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
                    <div>
                        <span className="font-semibold">Name:</span>
                        {isEditing ? (
                            <input
                                type="text"
                                name="name"
                                value={org.name}
                                onChange={handleInputChange}
                                className="w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded"
                            />
                        ) : (
                            <p>{org.name}</p>
                        )}
                    </div>
                    <div>
                        <span className="font-semibold">Slug:</span>
                        {isEditing ? (
                            <input
                                type="text"
                                name="slug"
                                value={org.slug}
                                onChange={handleInputChange}
                                className="w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded"
                            />
                        ) : (
                            <p>{org.slug}</p>
                        )}
                    </div>
                    <div>
                        <span className="font-semibold">City:</span>
                        {isEditing ? (
                            <input
                                type="text"
                                name="city"
                                value={org.city}
                                onChange={handleInputChange}
                                className="w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded"
                            />
                        ) : (
                            <p>{org.city}</p>
                        )}
                    </div>
                    {/* Repeat this structure for other fields */}
                </div>
            </section>
        </OrganizationLayout>
    );
}
