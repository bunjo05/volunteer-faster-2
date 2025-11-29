import AdminLayout from "@/Layouts/AdminLayout";
import React from "react";
import { Head, Link } from "@inertiajs/react";
import {
    CheckCircle,
    X,
    Clock,
    User,
    Mail,
    Phone,
    MapPin,
    Search,
    ShieldCheck,
    Eye,
    Edit,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import VerifiedBadge from "@/Components/VerifiedBadge";

export default function Volunteers({ volunteers, verifications }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedVolunteer, setExpandedVolunteer] = useState(null);
    const [isMobileView, setIsMobileView] = useState(false);
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Check mobile view on resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };

        // Set initial value
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Combine volunteers with their verification status
    const volunteersWithVerification = volunteers.map((volunteer) => {
        const verification = verifications.find(
            (v) => v.volunteer_public_id === volunteer.public_id
        );
        return { ...volunteer, verification };
    });

    // Filter volunteers based on search term
    const filteredVolunteers = volunteersWithVerification.filter(
        (volunteer) => {
            const searchLower = searchTerm.toLowerCase();
            return (
                volunteer.user?.name?.toLowerCase().includes(searchLower) ||
                volunteer.user?.email?.toLowerCase().includes(searchLower) ||
                volunteer.phone?.toLowerCase().includes(searchLower) ||
                volunteer.verification?.status
                    .toLowerCase()
                    .includes(searchLower)
            );
        }
    );

    const toggleExpand = (volunteerId) => {
        setExpandedVolunteer(
            expandedVolunteer === volunteerId ? null : volunteerId
        );
    };

    const openModal = (volunteer) => {
        setSelectedVolunteer(volunteer);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedVolunteer(null);
    };

    return (
        <AdminLayout>
            <Head title="Volunteers Management" />

            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Volunteers
                            </h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Manage volunteer profiles and verifications
                            </p>
                        </div>
                        <div className="relative w-full sm:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search volunteers..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden space-y-4">
                        {filteredVolunteers.length > 0 ? (
                            filteredVolunteers.map((volunteer) => (
                                <div
                                    key={`mobile-${volunteer.id}`}
                                    className="bg-white rounded-lg shadow p-4"
                                >
                                    <div
                                        className="flex justify-between items-start cursor-pointer"
                                        onClick={() =>
                                            toggleExpand(volunteer.id)
                                        }
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                {volunteer.profile_picture ? (
                                                    <img
                                                        className="h-10 w-10 rounded-full object-cover"
                                                        src={`/storage/${volunteer.profile_picture}`}
                                                        alt="Profile"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <User className="h-5 w-5 text-gray-500" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-900">
                                                    {volunteer.user?.name ||
                                                        "N/A"}
                                                </h3>
                                                <p className="text-xs text-gray-500">
                                                    {volunteer.user?.email ||
                                                        "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                        <button className="text-gray-400">
                                            {expandedVolunteer ===
                                            volunteer.id ? (
                                                <ChevronUp className="h-5 w-5" />
                                            ) : (
                                                <ChevronDown className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>

                                    {expandedVolunteer === volunteer.id && (
                                        <div className="mt-4 space-y-3">
                                            <div className="flex items-center text-sm">
                                                <Phone className="h-4 w-4 text-gray-400 mr-2" />
                                                <span>
                                                    {volunteer.phone ||
                                                        "Not provided"}
                                                </span>
                                            </div>

                                            <div className="flex items-center text-sm">
                                                {volunteer.verification ? (
                                                    <>
                                                        {volunteer.verification
                                                            .status ===
                                                        "Approved" ? (
                                                            <VerifiedBadge />
                                                        ) : // <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                                        volunteer.verification
                                                              .status ===
                                                          "Pending" ? (
                                                            <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                                                        ) : (
                                                            <X className="h-4 w-4 text-red-500 mr-2" />
                                                        )}
                                                        <span className="capitalize">
                                                            {
                                                                volunteer
                                                                    .verification
                                                                    .status
                                                            }
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-gray-500">
                                                        Not verified
                                                    </span>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 pt-2">
                                                <Link
                                                    href={route(
                                                        "admin.volunteers.verifications",
                                                        volunteer.public_id
                                                    )}
                                                    className="inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                                                >
                                                    <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                                                    Verify
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        openModal(volunteer)
                                                    }
                                                    className="inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                >
                                                    <Eye className="h-3.5 w-3.5 mr-1" />
                                                    View
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-lg shadow p-6 text-center">
                                <p className="text-gray-500">
                                    No volunteers found matching your search
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Desktop View */}
                    <div className="hidden md:block bg-white shadow-sm rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Volunteer
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Contact
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Status
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredVolunteers.length > 0 ? (
                                    filteredVolunteers.map((volunteer) => (
                                        <React.Fragment
                                            key={`desktop-${volunteer.id}`}
                                        >
                                            <tr
                                                className="hover:bg-gray-50 cursor-pointer"
                                                onClick={() =>
                                                    toggleExpand(volunteer.id)
                                                }
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            {volunteer.profile_picture ? (
                                                                <img
                                                                    className="h-10 w-10 rounded-full object-cover"
                                                                    src={`/storage/${volunteer.profile_picture}`}
                                                                    alt="Profile"
                                                                />
                                                            ) : (
                                                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                                    <User className="h-5 w-5 text-gray-500" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {volunteer.user
                                                                    ?.name ||
                                                                    "N/A"}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                Joined{" "}
                                                                {new Date(
                                                                    volunteer.created_at
                                                                ).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        <div className="flex items-center">
                                                            <Mail className="h-4 w-4 text-gray-400 mr-2" />
                                                            {volunteer.user
                                                                ?.email ||
                                                                "N/A"}
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-gray-500 mt-1">
                                                        <div className="flex items-center">
                                                            <Phone className="h-4 w-4 text-gray-400 mr-2" />
                                                            {volunteer.phone ||
                                                                "Not provided"}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {volunteer.verification ? (
                                                            <>
                                                                {volunteer
                                                                    .verification
                                                                    .status ===
                                                                "Approved" ? (
                                                                    <div className="flex items-center text-green-600">
                                                                        <CheckCircle className="h-5 w-5 mr-1" />
                                                                        <span>
                                                                            Approved
                                                                        </span>
                                                                    </div>
                                                                ) : volunteer
                                                                      .verification
                                                                      .status ===
                                                                  "Pending" ? (
                                                                    <div className="flex items-center text-yellow-600">
                                                                        <Clock className="h-5 w-5 mr-1" />
                                                                        <span>
                                                                            Pending
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center text-red-600">
                                                                        <X className="h-5 w-5 mr-1" />
                                                                        <span>
                                                                            Rejected
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <span className="text-sm text-gray-500">
                                                                Not verified
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-2">
                                                        <Link
                                                            href={route(
                                                                "admin.volunteers.verifications",
                                                                volunteer.public_id
                                                            )}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            <ShieldCheck className="h-5 w-5" />
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                openModal(
                                                                    volunteer
                                                                )
                                                            }
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            <Eye className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {expandedVolunteer ===
                                                volunteer.id && (
                                                <tr
                                                    key={`expanded-${volunteer.id}`}
                                                    className="bg-gray-50"
                                                >
                                                    <td
                                                        colSpan="4"
                                                        className="px-6 py-4"
                                                    >
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div>
                                                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                                                    Personal
                                                                    Info
                                                                </h3>
                                                                <div className="space-y-2">
                                                                    <div className="flex text-sm">
                                                                        <span className="text-gray-500 w-32">
                                                                            Gender:
                                                                        </span>
                                                                        <span className="text-gray-900">
                                                                            {volunteer.gender ||
                                                                                "Not specified"}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex text-sm">
                                                                        <span className="text-gray-500 w-32">
                                                                            Date
                                                                            of
                                                                            Birth:
                                                                        </span>
                                                                        <span className="text-gray-900">
                                                                            {volunteer.dob
                                                                                ? new Date(
                                                                                      volunteer.dob
                                                                                  ).toLocaleDateString()
                                                                                : "Not specified"}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex text-sm">
                                                                        <span className="text-gray-500 w-32">
                                                                            Location:
                                                                        </span>
                                                                        <span className="text-gray-900">
                                                                            {[
                                                                                volunteer.city,
                                                                                volunteer.state,
                                                                                volunteer.country,
                                                                            ]
                                                                                .filter(
                                                                                    Boolean
                                                                                )
                                                                                .join(
                                                                                    ", "
                                                                                ) ||
                                                                                "Not specified"}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                                                    Verification
                                                                </h3>
                                                                {volunteer.verification ? (
                                                                    <div className="space-y-2">
                                                                        <div className="flex text-sm">
                                                                            <span className="text-gray-500 w-32">
                                                                                Status:
                                                                            </span>
                                                                            <span className="text-gray-900 capitalize">
                                                                                {
                                                                                    volunteer
                                                                                        .verification
                                                                                        .status
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        {volunteer
                                                                            .verification
                                                                            .comments && (
                                                                            <div className="flex text-sm">
                                                                                <span className="text-gray-500 w-32">
                                                                                    Comments:
                                                                                </span>
                                                                                <span className="text-gray-900">
                                                                                    {
                                                                                        volunteer
                                                                                            .verification
                                                                                            .comments
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                        {volunteer
                                                                            .verification
                                                                            .verified_at && (
                                                                            <div className="flex text-sm">
                                                                                <span className="text-gray-500 w-32">
                                                                                    Verified
                                                                                    On:
                                                                                </span>
                                                                                <span className="text-gray-900">
                                                                                    {new Date(
                                                                                        volunteer.verification.verified_at
                                                                                    ).toLocaleDateString()}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-sm text-gray-500">
                                                                        No
                                                                        verification
                                                                        submitted
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-6 py-4 text-center text-sm text-gray-500"
                                        >
                                            No volunteers found matching your
                                            search criteria
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Volunteer Details Modal */}
            {isModalOpen && selectedVolunteer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Volunteer Details
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="col-span-1 flex flex-col items-center">
                                    {selectedVolunteer.profile_picture ? (
                                        <img
                                            className="h-32 w-32 rounded-full object-cover mb-4"
                                            src={`/storage/${selectedVolunteer.profile_picture}`}
                                            alt="Profile"
                                        />
                                    ) : (
                                        <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                                            <User className="h-16 w-16 text-gray-500" />
                                        </div>
                                    )}
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {selectedVolunteer.user?.name || "N/A"}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {selectedVolunteer.user?.email || "N/A"}
                                    </p>
                                </div>

                                <div className="col-span-1 md:col-span-2 space-y-4">
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                            Contact Information
                                        </h4>
                                        <div className="flex items-center text-sm">
                                            <Phone className="h-4 w-4 text-gray-400 mr-2" />
                                            <span>
                                                {selectedVolunteer.phone ||
                                                    "Not provided"}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <Mail className="h-4 w-4 text-gray-400 mr-2" />
                                            <span>
                                                {selectedVolunteer.user
                                                    ?.email || "N/A"}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                                            <span>
                                                {[
                                                    selectedVolunteer.city,
                                                    selectedVolunteer.state,
                                                    selectedVolunteer.country,
                                                ]
                                                    .filter(Boolean)
                                                    .join(", ") ||
                                                    "Not specified"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                            Personal Information
                                        </h4>
                                        <div className="flex text-sm">
                                            <span className="text-gray-500 w-24">
                                                Gender:
                                            </span>
                                            <span className="text-gray-900">
                                                {selectedVolunteer.gender ||
                                                    "Not specified"}
                                            </span>
                                        </div>
                                        <div className="flex text-sm">
                                            <span className="text-gray-500 w-24">
                                                Date of Birth:
                                            </span>
                                            <span className="text-gray-900">
                                                {selectedVolunteer.dob
                                                    ? new Date(
                                                          selectedVolunteer.dob
                                                      ).toLocaleDateString()
                                                    : "Not specified"}
                                            </span>
                                        </div>
                                        <div className="flex text-sm">
                                            <span className="text-gray-500 w-24">
                                                Joined:
                                            </span>
                                            <span className="text-gray-900">
                                                {new Date(
                                                    selectedVolunteer.created_at
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                            Verification Status
                                        </h4>
                                        {selectedVolunteer.verification ? (
                                            <div className="space-y-2">
                                                <div className="flex items-center text-sm">
                                                    {selectedVolunteer
                                                        .verification.status ===
                                                    "Approved" ? (
                                                        <>
                                                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                                            <span className="text-green-600">
                                                                Approved
                                                            </span>
                                                        </>
                                                    ) : selectedVolunteer
                                                          .verification
                                                          .status ===
                                                      "Pending" ? (
                                                        <>
                                                            <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                                                            <span className="text-yellow-600">
                                                                Pending
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <X className="h-4 w-4 text-red-500 mr-2" />
                                                            <span className="text-red-600">
                                                                Rejected
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                                {selectedVolunteer.verification
                                                    .comments && (
                                                    <div className="text-sm">
                                                        <div className="text-gray-500">
                                                            Comments:
                                                        </div>
                                                        <div className="text-gray-900">
                                                            {
                                                                selectedVolunteer
                                                                    .verification
                                                                    .comments
                                                            }
                                                        </div>
                                                    </div>
                                                )}
                                                {selectedVolunteer.verification
                                                    .verified_at && (
                                                    <div className="text-sm">
                                                        <div className="text-gray-500">
                                                            Verified On:
                                                        </div>
                                                        <div className="text-gray-900">
                                                            {new Date(
                                                                selectedVolunteer.verification.verified_at
                                                            ).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                No verification submitted
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <Link
                                    href={route(
                                        "admin.volunteers.verifications",
                                        selectedVolunteer.public_id
                                    )}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    <ShieldCheck className="h-4 w-4 mr-2" />
                                    Verify
                                </Link>
                                <button
                                    onClick={closeModal}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
