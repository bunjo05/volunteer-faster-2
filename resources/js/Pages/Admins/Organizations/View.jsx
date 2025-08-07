import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Globe,
    Phone,
    Mail,
    Calendar,
    Link as LinkIcon,
    MapPin,
    BookOpen,
    Target,
    Eye,
    Heart,
    Users,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
} from "lucide-react";

export default function View({ organization }) {
    const socialLinks = [
        { name: "Facebook", icon: Facebook, url: organization.facebook },
        { name: "Twitter", icon: Twitter, url: organization.twitter },
        { name: "Instagram", icon: Instagram, url: organization.instagram },
        { name: "LinkedIn", icon: Linkedin, url: organization.linkedin },
        { name: "YouTube", icon: Youtube, url: organization.youtube },
    ].filter((link) => link.url);

    return (
        <AdminLayout>
            <Head title={`${organization.name} - Organization Profile`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header with back button */}
                <div className="mb-6">
                    <Link
                        href={route("admin.organizations")}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                        ← Back to Organizations
                    </Link>
                </div>
                <div>
                    <Link
                        href={route(
                            "admin.organizations.verifications",
                            organization.slug
                        )}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
                    >
                        Verify Organization
                    </Link>
                </div>

                {/* Main Profile Card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Header with logo and basic info */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex-shrink-0">
                                <div className="h-32 w-32 rounded-lg border-4 border-white shadow-sm overflow-hidden">
                                    <img
                                        src={
                                            organization.logo
                                                ? `/storage/${organization.logo}`
                                                : "/images/default-org.jpg"
                                        }
                                        alt={organization.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                            {organization.name}
                                        </h1>
                                        <div className="flex items-center mt-2 text-gray-600">
                                            <MapPin className="h-5 w-5 mr-1.5" />
                                            <span>
                                                {organization.city},{" "}
                                                {organization.country}
                                                {organization.state &&
                                                    `, ${organization.state}`}
                                            </span>
                                        </div>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                            organization.status === "Approved"
                                                ? "bg-green-100 text-green-800"
                                                : organization.status ===
                                                  "Pending"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {organization.status}
                                    </span>
                                </div>

                                {/* Quick Facts */}
                                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                        Founded: {organization.foundedYear}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Users className="h-4 w-4 mr-2 text-gray-500" />
                                        Members: -
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Eye className="h-4 w-4 mr-2 text-gray-500" />
                                        Views: -
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Heart className="h-4 w-4 mr-2 text-gray-500" />
                                        Followers: -
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 sm:p-8">
                        {/* Left Column - About */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Description */}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                                    About Us
                                </h2>
                                <div className="prose max-w-none text-gray-700">
                                    {organization.description || (
                                        <p className="text-gray-500 italic">
                                            No description provided
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Mission, Vision, Values */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {organization.mission_statement && (
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                                            <Target className="h-4 w-4 mr-2" />
                                            Mission
                                        </h3>
                                        <p className="text-blue-700">
                                            {organization.mission_statement}
                                        </p>
                                    </div>
                                )}
                                {organization.vision_statement && (
                                    <div className="bg-indigo-50 rounded-lg p-4">
                                        <h3 className="font-medium text-indigo-800 mb-2 flex items-center">
                                            <Eye className="h-4 w-4 mr-2" />
                                            Vision
                                        </h3>
                                        <p className="text-indigo-700">
                                            {organization.vision_statement}
                                        </p>
                                    </div>
                                )}
                                {organization.values && (
                                    <div className="md:col-span-2 bg-purple-50 rounded-lg p-4">
                                        <h3 className="font-medium text-purple-800 mb-2 flex items-center">
                                            <Heart className="h-4 w-4 mr-2" />
                                            Core Values
                                        </h3>
                                        <div className="prose max-w-none text-purple-700">
                                            {organization.values}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Contact Info */}
                        <div className="space-y-6">
                            {/* Contact Information */}
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    Contact Information
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <Mail className="flex-shrink-0 h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">
                                                Email
                                            </h3>
                                            <p className="text-gray-900">
                                                {organization.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <Phone className="flex-shrink-0 h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">
                                                Phone
                                            </h3>
                                            <p className="text-gray-900">
                                                {organization.phone}
                                            </p>
                                        </div>
                                    </div>
                                    {organization.website && (
                                        <div className="flex items-start">
                                            <LinkIcon className="flex-shrink-0 h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">
                                                    Website
                                                </h3>
                                                <a
                                                    href={
                                                        organization.website.startsWith(
                                                            "http"
                                                        )
                                                            ? organization.website
                                                            : `https://${organization.website}`
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {organization.website}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                    {organization.address && (
                                        <div className="flex items-start">
                                            <MapPin className="flex-shrink-0 h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">
                                                    Address
                                                </h3>
                                                <p className="text-gray-900">
                                                    {organization.address}
                                                    {organization.postal && (
                                                        <>
                                                            ,{" "}
                                                            {
                                                                organization.postal
                                                            }
                                                        </>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Social Media */}
                            {socialLinks.length > 0 && (
                                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                        Social Media
                                    </h2>
                                    <div className="flex flex-wrap gap-3">
                                        {socialLinks.map(
                                            ({ name, icon: Icon, url }) => (
                                                <a
                                                    key={name}
                                                    href={
                                                        url.startsWith("http")
                                                            ? url
                                                            : `https://${url}`
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                                                >
                                                    <Icon className="h-5 w-5 mr-2" />
                                                    <span>{name}</span>
                                                </a>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
