import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    CheckCircle,
    Clock,
    FileText,
    AlertCircle,
    Download,
    ChevronLeft,
    File,
    MessageSquare,
    Check,
    X,
    User,
    Shield,
} from "lucide-react";
import { useState } from "react";

export default function Verify({ volunteer, verification }) {
    const [action, setAction] = useState(null);
    const [comments, setComments] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const verificationStatus = {
        Pending: {
            icon: Clock,
            color: "text-yellow-500 bg-yellow-50",
            text: "Pending Verification",
            badgeColor: "bg-yellow-100 text-yellow-800",
        },
        Approved: {
            icon: CheckCircle,
            color: "text-green-500 bg-green-50",
            text: "Verified",
            badgeColor: "bg-green-100 text-green-800",
        },
        Rejected: {
            icon: AlertCircle,
            color: "text-red-500 bg-red-50",
            text: "Rejected",
            badgeColor: "bg-red-100 text-red-800",
        },
    };

    const StatusBadge = ({ status }) => {
        const statusConfig =
            verificationStatus[status] || verificationStatus.Pending;
        const Icon = statusConfig.icon;

        return (
            <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.badgeColor}`}
            >
                <Icon className="h-4 w-4 mr-1.5" />
                {statusConfig.text}
            </span>
        );
    };

    const handleAction = (selectedAction) => {
        setAction(selectedAction);
    };

    const handleSubmit = () => {
        setIsSubmitting(true);

        router.post(
            route(
                "admin.volunteers.verification.update",
                {
                    volunteer: volunteer.id, // Changed from 'id' to 'volunteer' to match route parameter
                    verification: verification.id,
                    action: action,
                    comments: comments,
                },
                {
                    onFinish: () => {
                        setIsSubmitting(false);
                        setAction(null);
                        setComments("");
                    },
                    preserveScroll: true,
                }
            )
        );
    };

    return (
        <AdminLayout>
            <Head
                title={`${volunteer.user?.name || "Volunteer"} - Verification`}
            />

            <div className="max-w-6xl mx-auto px-4 sm:px-4 lg:px-4 py-4">
                <div className="mb-6">
                    <Link
                        href={route("admin.volunteers")}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5 mr-1" />
                        Back to Volunteers
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                    {/* Header */}
                    <div className="px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="p-2 rounded-lg bg-blue-100 text-blue-600 mr-4">
                                    <Shield className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Volunteer Verification
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        Review and verify{" "}
                                        {volunteer.user?.name ||
                                            "this volunteer"}
                                        's documents
                                    </p>
                                </div>
                            </div>
                            {verification && (
                                <StatusBadge
                                    status={verification.status || "Pending"}
                                />
                            )}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="px-6 py-6">
                        {verification ? (
                            <div className="space-y-8">
                                {/* Volunteer Info */}
                                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
                                        <User className="h-5 w-5 mr-2 text-blue-500" />
                                        Volunteer Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Name
                                            </p>
                                            <p className="font-medium">
                                                {volunteer.user?.name || "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Email
                                            </p>
                                            <p className="font-medium">
                                                {volunteer.user?.email || "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Phone
                                            </p>
                                            <p className="font-medium">
                                                {volunteer.phone ||
                                                    "Not provided"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Location
                                            </p>
                                            <p className="font-medium">
                                                {[
                                                    volunteer.city,
                                                    volunteer.state,
                                                    volunteer.country,
                                                ]
                                                    .filter(Boolean)
                                                    .join(", ") ||
                                                    "Not specified"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Documents Section */}
                                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                            <File className="h-5 w-5 mr-2 text-blue-500" />
                                            Verification Document
                                        </h3>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {verification.verification_type}
                                        </span>
                                    </div>
                                    {verification.document && (
                                        <div className="space-y-3">
                                            <div className="flex space-x-3">
                                                <a
                                                    href={`/storage/${verification.document}`}
                                                    download
                                                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                                >
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Download
                                                </a>
                                                <a
                                                    href={`/storage/${verification.document}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                                >
                                                    <File className="h-4 w-4 mr-2" />
                                                    View Full Screen
                                                </a>
                                            </div>
                                            <div className="border rounded-lg shadow-sm overflow-hidden">
                                                <iframe
                                                    src={`/storage/${verification.document}`}
                                                    className="w-full h-96"
                                                    frameBorder="0"
                                                ></iframe>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Admin Comments */}
                                {verification.comments && (
                                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                        <h3 className="text-lg font-medium text-gray-900 flex items-center mb-3">
                                            <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
                                            Previous Admin Comments
                                        </h3>
                                        <div className="prose max-w-none text-gray-700 bg-white p-4 rounded-md border border-gray-200">
                                            {verification.comments}
                                        </div>
                                    </div>
                                )}

                                {/* Verification Actions - Only show if status is pending */}
                                {verification.status === "Pending" && (
                                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                                            Verification Decision
                                        </h3>

                                        {action ? (
                                            <div className="space-y-4">
                                                <div>
                                                    <label
                                                        htmlFor="comments"
                                                        className="block text-sm font-medium text-gray-700 mb-1"
                                                    >
                                                        Add Comments (Optional)
                                                    </label>
                                                    <textarea
                                                        id="comments"
                                                        rows={3}
                                                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                        placeholder="Enter any comments about this verification..."
                                                        value={comments}
                                                        onChange={(e) =>
                                                            setComments(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="flex space-x-3">
                                                    <button
                                                        onClick={() =>
                                                            setAction(null)
                                                        }
                                                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={handleSubmit}
                                                        disabled={isSubmitting}
                                                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                                            action === "approve"
                                                                ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                                                                : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                                                        }`}
                                                    >
                                                        {isSubmitting ? (
                                                            "Processing..."
                                                        ) : (
                                                            <>
                                                                {action ===
                                                                "approve" ? (
                                                                    <Check className="h-4 w-4 mr-2" />
                                                                ) : (
                                                                    <X className="h-4 w-4 mr-2" />
                                                                )}
                                                                Confirm {action}
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex space-x-4">
                                                <button
                                                    onClick={() =>
                                                        handleAction("approve")
                                                    }
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                >
                                                    <Check className="h-4 w-4 mr-2" />
                                                    Approve Verification
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleAction("reject")
                                                    }
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                >
                                                    <X className="h-4 w-4 mr-2" />
                                                    Reject Verification
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                                    <FileText className="h-6 w-6 text-gray-400" />
                                </div>
                                <h3 className="mt-2 text-lg font-medium text-gray-900">
                                    No verification documents submitted
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    This volunteer hasn't submitted any
                                    documents for verification yet.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
