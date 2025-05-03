import OrganizationLayout from "@/Layouts/OrganizationLayout";
import { useState } from "react";
import { usePage, useForm, Head, router } from "@inertiajs/react";

export default function Profile({ organization, auth }) {
    const [org, setOrg] = useState(organization ?? {});
    const [isEditing, setIsEditing] = useState(false);
    const [image, setImage] = useState(null);

    const { data, setData, post } = useForm({
        name: org.name,
        slug: org.slug,
        city: org.city,
        country: org.country,
        foundedYear: org.foundedYear,
        phone: org.phone,
        email: auth.user.email, // <-- Set email from authenticated user
        website: org.website,
        description: org.description,
        logo: org.logo,
    });

    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setOrg((prevOrg) => ({
    //         ...prevOrg,
    //         [name]: value,
    //     }));
    // };

    // const handleImageChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         setImage(file);
    //         setOrg((prev) => ({
    //             ...prev,
    //             image: URL.createObjectURL(file),
    //         }));
    //     }
    // };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveSubmit = async (e) => {
        e.preventDefault();
        setIsEditing(false);

        post(route("organization.profile.update"), {
            onSuccess: () => {
                console.log("Profile updated successfully");
                location.reload(); // 🔄 Refresh the page
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
                            onClick={handleEditClick}
                            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                <form onSubmit={handleSaveSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
                        {/* Fields (use same inputs you had) */}
                        <div>
                            <span className="font-semibold">Name:</span>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    onChange={(e) => {
                                        const nameValue = e.target.value;
                                        setData("name", nameValue);
                                        setData(
                                            "slug",
                                            nameValue
                                                .toLowerCase()
                                                .trim()
                                                .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
                                                .replace(/\s+/g, "-") // collapse whitespace and replace by -
                                                .replace(/-+/g, "-")
                                        ); // collapse dashes
                                    }}
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
                                    value={data.slug}
                                    readOnly
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
                                    value={data.city}
                                    onChange={(e) =>
                                        setData("city", e.target.value)
                                    }
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
                                    value={data.country}
                                    onChange={(e) =>
                                        setData("country", e.target.value)
                                    }
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
                                    value={data.foundedYear}
                                    onChange={(e) =>
                                        setData("foundedYear", e.target.value)
                                    }
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
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData("phone", e.target.value)
                                    }
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
                                    value={auth.user.email}
                                    disabled
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    className="w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded"
                                />
                            ) : (
                                <p>{auth.user.email}</p>
                            )}
                        </div>

                        <div>
                            <span className="font-semibold">Website:</span>
                            {isEditing ? (
                                <input
                                    type="url"
                                    name="website"
                                    value={data.website}
                                    onChange={(e) =>
                                        setData("website", e.target.value)
                                    }
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
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    className="w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded"
                                />
                            ) : (
                                <p>{org.description}</p>
                            )}
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <span className="font-semibold">Logo:</span>
                            {isEditing ? (
                                <>
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;

                                            const validTypes = [
                                                "image/jpeg",
                                                "image/jpg",
                                                "image/png",
                                            ];
                                            if (
                                                !validTypes.includes(file.type)
                                            ) {
                                                alert(
                                                    "Only JPG, JPEG, and PNG files are allowed."
                                                );
                                                return;
                                            }

                                            const maxSize = 2 * 1024 * 1024; // 2MB
                                            if (file.size > maxSize) {
                                                alert(
                                                    "File size should be less than 2MB."
                                                );
                                                return;
                                            }

                                            setData("logo", file);
                                            setImage(URL.createObjectURL(file));
                                        }}
                                        className="w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded"
                                    />

                                    {image ? (
                                        <img
                                            src={image}
                                            alt="Selected Logo Preview"
                                            className="w-32 h-32 object-cover rounded mt-4"
                                        />
                                    ) : (
                                        org.logo && (
                                            <img
                                                src={`/storage/${org.logo}`}
                                                alt="Current Logo"
                                                className="w-32 h-32 object-cover rounded mt-4"
                                            />
                                        )
                                    )}
                                </>
                            ) : (
                                org.logo && (
                                    <img
                                        src={`/storage/${org.logo}`}
                                        alt="Organization Logo"
                                        className="w-32 h-32 object-cover rounded mt-2"
                                    />
                                )
                            )}
                        </div>

                        {isEditing && (
                            <div className="col-span-2 text-right">
                                <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                                >
                                    Save Profile
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            </section>
        </OrganizationLayout>
    );
}
