import React from "react";

export default function VolunteerDetailsModal() {
    return (
        <div>
            {/* Volunteer Details Modal */}
            <Dialog
                open={isVolunteerModalOpen}
                onClose={closeVolunteerModal}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-2xl rounded-xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
                        {selectedVolunteer && (
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <Dialog.Title className="text-2xl font-bold text-gray-900">
                                        Volunteer Details
                                    </Dialog.Title>
                                    <button
                                        onClick={closeVolunteerModal}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Left Column */}
                                    <div className="md:w-1/3">
                                        <div className="flex flex-col items-center">
                                            <img
                                                src={
                                                    selectedVolunteer
                                                        .volunteer_profile
                                                        ?.profile_picture
                                                        ? `/storage/${selectedVolunteer.volunteer_profile.profile_picture}`
                                                        : "/images/default-profile.jpg"
                                                }
                                                alt={selectedVolunteer.name}
                                                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow mb-4"
                                            />
                                            <h3 className="text-xl font-semibold text-gray-900">
                                                {selectedVolunteer.name}
                                            </h3>
                                            {selectedVolunteer.volunteer_profile
                                                ?.verification_status ===
                                                "Approved" && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                                                    <Check className="h-3 w-3 mr-1" />
                                                    Verified Volunteer
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-6 space-y-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">
                                                    Email
                                                </h4>
                                                <p className="text-gray-900">
                                                    {selectedVolunteer.email}
                                                </p>
                                            </div>

                                            {selectedVolunteer.volunteer_profile
                                                ?.phone && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">
                                                        Phone
                                                    </h4>
                                                    <p className="text-gray-900">
                                                        {
                                                            selectedVolunteer
                                                                .volunteer_profile
                                                                .phone
                                                        }
                                                    </p>
                                                </div>
                                            )}

                                            {selectedVolunteer.volunteer_profile
                                                ?.gender && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">
                                                        Gender
                                                    </h4>
                                                    <p className="text-gray-900">
                                                        {
                                                            selectedVolunteer
                                                                .volunteer_profile
                                                                .gender
                                                        }
                                                    </p>
                                                </div>
                                            )}

                                            {selectedVolunteer.volunteer_profile
                                                ?.dob && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">
                                                        Date of Birth
                                                    </h4>
                                                    <p className="text-gray-900">
                                                        {new Date(
                                                            selectedVolunteer.volunteer_profile.dob
                                                        ).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            )}

                                            {selectedVolunteer.volunteer_profile
                                                ?.city && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">
                                                        Location
                                                    </h4>
                                                    <p className="text-gray-900">
                                                        {
                                                            selectedVolunteer
                                                                .volunteer_profile
                                                                .city
                                                        }
                                                        ,{" "}
                                                        {
                                                            selectedVolunteer
                                                                .volunteer_profile
                                                                .country
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="md:w-2/3">
                                        {/* Emergency Contact */}
                                        {selectedVolunteer.volunteer_profile
                                            ?.nok && (
                                            <div className="bg-blue-50 p-4 rounded-lg mb-6">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                    Emergency Contact
                                                </h4>
                                                <p className="text-gray-900">
                                                    {
                                                        selectedVolunteer
                                                            .volunteer_profile
                                                            .nok
                                                    }{" "}
                                                    (
                                                    {
                                                        selectedVolunteer
                                                            .volunteer_profile
                                                            .nok_relation
                                                    }
                                                    )
                                                </p>
                                                <p className="text-gray-900">
                                                    {
                                                        selectedVolunteer
                                                            .volunteer_profile
                                                            .nok_phone
                                                    }
                                                </p>
                                            </div>
                                        )}

                                        {/* Skills */}
                                        {selectedVolunteer.volunteer_profile
                                            ?.skills?.length > 0 && (
                                            <div className="mb-6">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                    Skills
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedVolunteer.volunteer_profile.skills.map(
                                                        (skill, index) => (
                                                            <span
                                                                key={index}
                                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                            >
                                                                {skill}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Education */}
                                        {selectedVolunteer.volunteer_profile
                                            ?.education_status && (
                                            <div className="mb-6">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                    Education
                                                </h4>
                                                <p className="text-gray-900">
                                                    {
                                                        selectedVolunteer
                                                            .volunteer_profile
                                                            .education_status
                                                    }
                                                </p>
                                            </div>
                                        )}

                                        {/* Hobbies */}
                                        {selectedVolunteer.volunteer_profile
                                            ?.hobbies?.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                    Hobbies & Interests
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedVolunteer.volunteer_profile.hobbies.map(
                                                        (hobby, index) => (
                                                            <span
                                                                key={index}
                                                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                                            >
                                                                {hobby}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
}
