import OrganizationLayout from "@/Layouts/OrganizationLayout";
import { Link } from "@inertiajs/react";
import { useState } from "react";

export default function Profile() {
    // Hardcoded dummy data
    const orgData = {
        name: "Your Organization Name",
        slug: "your-organization-slug",
        city: "City not provided",
        country: "Country not provided",
        foundedYear: "Year not provided",
        phone: "Phone number not provided",
        email: "email@example.com",
        website: "https://your-organization-website.com",
        description: "Description not provided.",
        image: "https://via.placeholder.com/150", // Placeholder image
    };

    const [org, setOrg] = useState(orgData); // state to hold the organization data
    const [isEditing, setIsEditing] = useState(false); // state to toggle between view and edit modes
    const [image, setImage] = useState(null); // state to hold the new image

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrg((prevOrg) => ({
            ...prevOrg,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file)); // Show the selected image in edit mode
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        setIsEditing(false);
        // Here you could send the updated data (including image) to the server
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
                            onClick={handleEditClick}
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
                    <div>
                        <span className="font-semibold">Country:</span>
                        {isEditing ? (
                            <input
                                type="text"
                                name="country"
                                value={org.country}
                                onChange={handleInputChange}
                                className="w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded"
                            />
                        ) : (
                            <p>{org.country}</p>
                        )}
                    </div>
                    <div>
                        <span className="font-semibold">Founded Year:</span>
                        {isEditing ? (
                            <input
                                type="text"
                                name="foundedYear"
                                value={org.foundedYear}
                                onChange={handleInputChange}
                                className="w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded"
                            />
                        ) : (
                            <p>{org.foundedYear}</p>
                        )}
                    </div>
                    <div>
                        <span className="font-semibold">Phone:</span>
                        {isEditing ? (
                            <input
                                type="text"
                                name="phone"
                                value={org.phone}
                                onChange={handleInputChange}
                                className="w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded"
                            />
                        ) : (
                            <p>{org.phone}</p>
                        )}
                    </div>
                    <div>
                        <span className="font-semibold">Email:</span>
                        {isEditing ? (
                            <input
                                type="email"
                                name="email"
                                value={org.email}
                                onChange={handleInputChange}
                                className="w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded"
                            />
                        ) : (
                            <p>{org.email}</p>
                        )}
                    </div>
                    <div>
                        <span className="font-semibold">Website:</span>
                        {isEditing ? (
                            <input
                                type="url"
                                name="website"
                                value={org.website}
                                onChange={handleInputChange}
                                className="w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded"
                            />
                        ) : (
                            <p>
                                <a
                                    href={org.website}
                                    target="_blank"
                                    className="text-indigo-600 hover:underline"
                                >
                                    {org.website}
                                </a>
                            </p>
                        )}
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <span className="font-semibold">Description:</span>
                        {isEditing ? (
                            <textarea
                                name="description"
                                value={org.description}
                                onChange={handleInputChange}
                                className="w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded"
                            />
                        ) : (
                            <p>{org.description}</p>
                        )}
                    </div>

                    {/* Image Upload Section */}
                    <div className="col-span-1 md:col-span-2">
                        <span className="font-semibold">Logo:</span>
                        {isEditing ? (
                            <div className="mt-2">
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    className="w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded"
                                />
                            </div>
                        ) : (
                            <div className="mt-2">
                                <img
                                    src={image || org.image}
                                    alt="Organization Logo"
                                    className="w-32 h-32 object-cover rounded"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </OrganizationLayout>
    );
}
