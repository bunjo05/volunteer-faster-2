import VerifiedBadge from "@/Components/VerifiedBadge";
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
    CheckCircle,
    Clock,
    XCircle,
    ChevronLeft,
} from "lucide-react";

export default function View({ organization, organization_verification }) {
    const socialLinks = [
        { name: "Facebook", icon: Facebook, url: organization.facebook },
        { name: "Twitter", icon: Twitter, url: organization.twitter },
        { name: "Instagram", icon: Instagram, url: organization.instagram },
        { name: "LinkedIn", icon: Linkedin, url: organization.linkedin },
        { name: "YouTube", icon: Youtube, url: organization.youtube },
    ].filter((link) => link.url);

    const showVerifyButton = organization_verification?.status === "Pending";
    const organizationVerified =
        organization_verification?.status === "Approved";

    const statusIcons = {
        Approved: <CheckCircle className="h-5 w-5 mr-1.5 text-green-500" />,
        Pending: <Clock className="h-5 w-5 mr-1.5 text-yellow-500" />,
        Rejected: <XCircle className="h-5 w-5 mr-1.5 text-red-500" />,
    };

    return (
        <AdminLayout>
            <Head title={`${organization.name} - Organization Profile`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 py-4">
                {/* Header Section */}
                <div className="mb-4">
                    <Link
                        href={route("admin.organizations")}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors group"
                    >
                        <ChevronLeft className="h-5 w-5 mr-1 group-hover:-translate-x-0.5 transition-transform" />
                        Back to Organizations
                    </Link>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
                        {/* <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                {organization.name}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Organization profile details and verification
                                status
                            </p>
                        </div> */}

                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            {showVerifyButton && (
                                <Link
                                    href={route(
                                        "admin.organizations.verifications",
                                        organization.slug
                                    )}
                                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                                >
                                    <CheckCircle className="h-5 w-5" />
                                    Verify Organization
                                </Link>
                            )}
                            {/* <div
                                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                                    organization.status === "Approved"
                                        ? "bg-green-50 text-green-800 border border-green-200"
                                        : organization.status === "Pending"
                                        ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
                                        : "bg-red-50 text-red-800 border border-red-200"
                                }`}
                            >
                                {statusIcons[organization.status]}
                                {organization.status}
                            </div> */}
                        </div>
                    </div>
                </div>

                {/* Main Profile Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200/50">
                    {/* Header with logo */}
                    <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 p-8">
                        <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
                            <div className="flex-shrink-0 relative">
                                <div className="h-40 w-40 rounded-xl border-4 border-white/90 shadow-lg overflow-hidden">
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
                                {organizationVerified && <VerifiedBadge />}
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <div className="flex items-center justify-center sm:justify-start gap-3">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                        {organization.name}
                                    </h1>
                                </div>
                                <div className="flex items-center justify-center sm:justify-start mt-3 text-gray-600">
                                    <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                                    <span className="text-gray-700">
                                        {organization.city},{" "}
                                        {organization.country}
                                        {organization.state &&
                                            `, ${organization.state}`}
                                    </span>
                                </div>

                                {/* Quick Facts */}
                                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div className="flex flex-col items-center sm:items-start">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                            Founded
                                        </div>
                                        <span className="font-medium text-gray-900">
                                            {organization.foundedYear}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center sm:items-start">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Users className="h-4 w-4 mr-2 text-gray-500" />
                                            Members
                                        </div>
                                        <span className="font-medium text-gray-900">
                                            -
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center sm:items-start">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Eye className="h-4 w-4 mr-2 text-gray-500" />
                                            Views
                                        </div>
                                        <span className="font-medium text-gray-900">
                                            -
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center sm:items-start">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Heart className="h-4 w-4 mr-2 text-gray-500" />
                                            Followers
                                        </div>
                                        <span className="font-medium text-gray-900">
                                            -
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
                        {/* Left Column - About */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Description */}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                                    About Us
                                </h2>
                                <div className="prose prose-blue max-w-none text-gray-700">
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
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-sm border border-blue-100">
                                        <h3 className="font-medium text-blue-800 mb-3 flex items-center">
                                            <Target className="h-5 w-5 mr-2" />
                                            Mission
                                        </h3>
                                        <p className="text-blue-700">
                                            {organization.mission_statement}
                                        </p>
                                    </div>
                                )}
                                {organization.vision_statement && (
                                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 shadow-sm border border-indigo-100">
                                        <h3 className="font-medium text-indigo-800 mb-3 flex items-center">
                                            <Eye className="h-5 w-5 mr-2" />
                                            Vision
                                        </h3>
                                        <p className="text-indigo-700">
                                            {organization.vision_statement}
                                        </p>
                                    </div>
                                )}
                                {organization.values && (
                                    <div className="md:col-span-2 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-sm border border-purple-100">
                                        <h3 className="font-medium text-purple-800 mb-3 flex items-center">
                                            <Heart className="h-5 w-5 mr-2" />
                                            Core Values
                                        </h3>
                                        <div className="prose prose-purple max-w-none text-purple-700">
                                            {organization.values}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Contact Info */}
                        <div className="space-y-6">
                            {/* Contact Information */}
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <Phone className="h-5 w-5 mr-2 text-blue-600" />
                                    Contact Information
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <Mail className="flex-shrink-0 h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">
                                                Email
                                            </h3>
                                            <a
                                                href={`mailto:${organization.user?.email}`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {organization.user?.email}
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <Phone className="flex-shrink-0 h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">
                                                Phone
                                            </h3>
                                            <a
                                                href={`tel:${organization.phone}`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {organization.phone}
                                            </a>
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
                                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                        <Globe className="h-5 w-5 mr-2 text-blue-600" />
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
                                                    className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
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
