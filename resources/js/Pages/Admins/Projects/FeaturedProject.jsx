import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { format } from "date-fns";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Search,
    Filter,
    TrendingUp,
    Download,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    Calendar,
    DollarSign,
    Award,
    Users,
    Building,
    ExternalLink,
    Shield,
    TrendingUp as TrendingUpIcon,
    ChevronDown,
    ChevronUp,
    MoreVertical,
} from "lucide-react";

export default function FeaturedProject({ featuredProjects }) {
    const [rejectionReason, setRejectionReason] = useState("");
    const [selectedProject, setSelectedProject] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [expandedProject, setExpandedProject] = useState(null);
    const [viewMode, setViewMode] = useState("grid");

    const handleStatusChange = (projectId, status) => {
        if (status === "rejected") {
            setSelectedProject(projectId);
            return;
        }

        router.put(route("admin.featured-projects.update-status", projectId), {
            status,
            rejection_reason: null,
        });
    };

    const submitRejection = () => {
        if (!rejectionReason.trim()) {
            alert("Please provide a reason for rejection");
            return;
        }

        router.put(
            route("admin.featured-projects.update-status", selectedProject),
            {
                status: "rejected",
                rejection_reason: rejectionReason,
            },
            {
                onSuccess: () => {
                    setSelectedProject(null);
                    setRejectionReason("");
                },
            }
        );
    };

    const getPlanDuration = (planType) => {
        switch (planType) {
            case "1_month":
                return "1 Month";
            case "3_months":
                return "3 Months";
            case "6_months":
                return "6 Months";
            case "1_year":
                return "1 Year";
            default:
                return planType;
        }
    };

    const getPlanColor = (planType) => {
        switch (planType) {
            case "1_month":
                return "text-blue-700 bg-blue-50";
            case "3_months":
                return "text-green-700 bg-green-50";
            case "6_months":
                return "text-purple-700 bg-purple-50";
            case "1_year":
                return "text-amber-700 bg-amber-50";
            default:
                return "text-gray-700 bg-gray-50";
        }
    };

    const formatAmount = (amount) => {
        const num = parseFloat(amount);
        return isNaN(num) ? "$0.00" : `$${num.toFixed(2)}`;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "approved":
                return "text-green-700 bg-green-50 border-green-200";
            case "rejected":
                return "text-red-700 bg-red-50 border-red-200";
            case "pending":
                return "text-amber-700 bg-amber-50 border-amber-200";
            default:
                return "text-gray-700 bg-gray-50 border-gray-200";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "approved":
                return <CheckCircle className="w-4 h-4" />;
            case "rejected":
                return <XCircle className="w-4 h-4" />;
            case "pending":
                return <Clock className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    // Filter projects
    const filteredProjects = featuredProjects.filter((project) => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            project.project?.title?.toLowerCase().includes(searchLower) ||
            project.user?.name?.toLowerCase().includes(searchLower) ||
            project.user?.email?.toLowerCase().includes(searchLower);

        const matchesStatus =
            statusFilter === "all" || project.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Sort projects
    const sortedProjects = [...filteredProjects].sort((a, b) => {
        if (sortBy === "newest") {
            return new Date(b.created_at) - new Date(a.created_at);
        } else if (sortBy === "oldest") {
            return new Date(a.created_at) - new Date(b.created_at);
        } else if (sortBy === "amount-high") {
            return parseFloat(b.amount) - parseFloat(a.amount);
        } else if (sortBy === "amount-low") {
            return parseFloat(a.amount) - parseFloat(b.amount);
        } else if (sortBy === "name-asc") {
            return a.project?.title?.localeCompare(b.project?.title);
        }
        return 0;
    });

    // Statistics
    const stats = {
        total: featuredProjects.length,
        pending: featuredProjects.filter((p) => p.status === "pending").length,
        approved: featuredProjects.filter((p) => p.status === "approved")
            .length,
        rejected: featuredProjects.filter((p) => p.status === "rejected")
            .length,
        totalRevenue: featuredProjects.reduce(
            (sum, p) => sum + parseFloat(p.amount || 0),
            0
        ),
    };

    return (
        <AdminLayout>
            <Head title="Featured Projects" />

            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                Featured Projects
                            </h1>
                            <p className="text-sm md:text-base text-gray-600 mt-1">
                                Review and manage featured project requests
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition-colors">
                                <Download className="h-4 w-4" />
                                <span className="hidden sm:inline">Export</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Total Requests
                                </p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {stats.total}
                                </p>
                            </div>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Award className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {stats.pending}
                                </p>
                            </div>
                            <div className="p-2 bg-amber-50 rounded-lg">
                                <Clock className="h-5 w-5 text-amber-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Total Revenue
                                </p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                                    ${stats.totalRevenue.toFixed(2)}
                                </p>
                            </div>
                            <div className="p-2 bg-green-50 rounded-lg">
                                <DollarSign className="h-5 w-5 text-green-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Approved
                                </p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {stats.approved}
                                </p>
                            </div>
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <CheckCircle className="h-5 w-5 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search featured projects by title or user..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                    className="w-full sm:w-auto pl-10 pr-8 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            </div>
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full sm:w-auto pl-10 pr-8 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="amount-high">
                                        Amount (High to Low)
                                    </option>
                                    <option value="amount-low">
                                        Amount (Low to High)
                                    </option>
                                    <option value="name-asc">
                                        Project (A-Z)
                                    </option>
                                </select>
                                <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Featured Projects Grid/List View */}
                {sortedProjects.length > 0 ? (
                    viewMode === "grid" ? (
                        /* Grid View */
                        <div className="grid gap-4 md:gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                            {sortedProjects.map((project) => (
                                <div
                                    key={project.id}
                                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col"
                                >
                                    {/* Header */}
                                    <div className="p-4 border-b border-gray-100">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                                                    <Award className="h-5 w-5 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <Link
                                                        href={route(
                                                            "admin.projects.view",
                                                            project.project
                                                                ?.slug
                                                        )}
                                                        className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                                                    >
                                                        {project.project
                                                            ?.title ||
                                                            "Untitled Project"}
                                                    </Link>
                                                    <p className="text-sm text-gray-500">
                                                        Submitted{" "}
                                                        {format(
                                                            new Date(
                                                                project.created_at
                                                            ),
                                                            "MMM d, yyyy"
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    setExpandedProject(
                                                        expandedProject ===
                                                            project.id
                                                            ? null
                                                            : project.id
                                                    )
                                                }
                                                className="p-1 text-gray-400 hover:text-gray-600"
                                            >
                                                {expandedProject ===
                                                project.id ? (
                                                    <ChevronUp className="h-5 w-5" />
                                                ) : (
                                                    <ChevronDown className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 flex-1 flex flex-col">
                                        <div className="mb-4">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <p className="text-xs text-gray-500">
                                                        User
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Users className="w-4 h-4 text-gray-400" />
                                                        <p className="text-sm font-medium">
                                                            {project.user?.name}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">
                                                        Plan
                                                    </p>
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getPlanColor(
                                                            project.plan_type
                                                        )}`}
                                                    >
                                                        {getPlanDuration(
                                                            project.plan_type
                                                        )}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">
                                                        Amount
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <DollarSign className="w-4 h-4 text-gray-400" />
                                                        <p className="text-sm font-medium">
                                                            {formatAmount(
                                                                project.amount
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">
                                                        Status
                                                    </p>
                                                    <div className="mt-1">
                                                        <span
                                                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                                project.status
                                                            )}`}
                                                        >
                                                            {getStatusIcon(
                                                                project.status
                                                            )}
                                                            {project.status
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                project.status.slice(
                                                                    1
                                                                )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dates */}
                                        {project.start_date && (
                                            <div className="mb-4">
                                                <p className="text-xs text-gray-500 mb-1">
                                                    Featured Period
                                                </p>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>
                                                        {format(
                                                            new Date(
                                                                project.start_date
                                                            ),
                                                            "MMM d, yyyy"
                                                        )}
                                                        {project.end_date && (
                                                            <>
                                                                {" "}
                                                                -{" "}
                                                                {format(
                                                                    new Date(
                                                                        project.end_date
                                                                    ),
                                                                    "MMM d, yyyy"
                                                                )}
                                                            </>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Rejection Reason (if any) */}
                                        {project.rejection_reason && (
                                            <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-100">
                                                <p className="text-xs font-medium text-red-700 mb-1">
                                                    Rejection Reason
                                                </p>
                                                <p className="text-sm text-red-600">
                                                    {project.rejection_reason}
                                                </p>
                                            </div>
                                        )}

                                        {/* Expanded Details */}
                                        {expandedProject === project.id && (
                                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                                <p className="text-xs font-medium text-gray-700 mb-2">
                                                    User Details
                                                </p>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-600">
                                                            Name
                                                        </span>
                                                        <span className="font-medium">
                                                            {project.user?.name}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-600">
                                                            Email
                                                        </span>
                                                        <span className="font-medium">
                                                            {
                                                                project.user
                                                                    ?.email
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-600">
                                                            Submitted
                                                        </span>
                                                        <span className="font-medium">
                                                            {format(
                                                                new Date(
                                                                    project.created_at
                                                                ),
                                                                "MMM d, yyyy"
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="mt-auto pt-4 border-t border-gray-100">
                                            {project.status === "pending" ? (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                project.id,
                                                                "approved"
                                                            )
                                                        }
                                                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                project.id,
                                                                "rejected"
                                                            )
                                                        }
                                                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between">
                                                    <Link
                                                        href={route(
                                                            "admin.projects.view",
                                                            project.project
                                                                ?.slug
                                                        )}
                                                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        View Project
                                                    </Link>
                                                    <span className="text-xs text-gray-500">
                                                        Action completed
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* List View */
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                                Project
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden md:table-cell">
                                                User
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                                Plan
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                                Amount
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden lg:table-cell">
                                                Dates
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {sortedProjects.map((project) => (
                                            <tr
                                                key={project.id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                                                            <Award className="h-5 w-5 text-indigo-600" />
                                                        </div>
                                                        <div>
                                                            <Link
                                                                href={route(
                                                                    "admin.projects.view",
                                                                    project
                                                                        .project
                                                                        ?.slug
                                                                )}
                                                                className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                                                            >
                                                                {project.project
                                                                    ?.title ||
                                                                    "Untitled Project"}
                                                            </Link>
                                                            <p className="text-xs text-gray-500">
                                                                Submitted{" "}
                                                                {format(
                                                                    new Date(
                                                                        project.created_at
                                                                    ),
                                                                    "MMM d, yyyy"
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 hidden md:table-cell">
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {project.user?.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate">
                                                            {
                                                                project.user
                                                                    ?.email
                                                            }
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getPlanColor(
                                                            project.plan_type
                                                        )}`}
                                                    >
                                                        {getPlanDuration(
                                                            project.plan_type
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="w-4 h-4 text-gray-400" />
                                                        <span className="font-medium text-gray-900">
                                                            {formatAmount(
                                                                project.amount
                                                            )}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 hidden lg:table-cell">
                                                    {project.start_date ? (
                                                        <div className="text-sm text-gray-600">
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="w-4 h-4" />
                                                                <span>
                                                                    {format(
                                                                        new Date(
                                                                            project.start_date
                                                                        ),
                                                                        "MMM d, yyyy"
                                                                    )}
                                                                    {project.end_date && (
                                                                        <>
                                                                            {" "}
                                                                            -{" "}
                                                                            {format(
                                                                                new Date(
                                                                                    project.end_date
                                                                                ),
                                                                                "MMM d, yyyy"
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-gray-500 italic">
                                                            Not started
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span
                                                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                                project.status
                                                            )}`}
                                                        >
                                                            {getStatusIcon(
                                                                project.status
                                                            )}
                                                            {project.status
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                project.status.slice(
                                                                    1
                                                                )}
                                                        </span>
                                                        {project.rejection_reason && (
                                                            <p className="text-xs text-red-600 line-clamp-1">
                                                                {
                                                                    project.rejection_reason
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    {project.status ===
                                                    "pending" ? (
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        project.id,
                                                                        "approved"
                                                                    )
                                                                }
                                                                className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                                                                title="Approve"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        project.id,
                                                                        "rejected"
                                                                    )
                                                                }
                                                                className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Reject"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <Link
                                                                href={route(
                                                                    "admin.projects.view",
                                                                    project
                                                                        .project
                                                                        ?.slug
                                                                )}
                                                                className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="View Project"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Link>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                ) : (
                    /* Empty State */
                    <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 text-center">
                        <div className="mx-auto max-w-md">
                            <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No featured projects found
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                {searchTerm || statusFilter !== "all"
                                    ? "Try adjusting your search or filter criteria"
                                    : "No featured project requests have been submitted yet"}
                            </p>
                            {(searchTerm || statusFilter !== "all") && (
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setStatusFilter("all");
                                    }}
                                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg shadow-sm transition-colors"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {sortedProjects.length > 0 && (
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-600">
                            Showing{" "}
                            <span className="font-medium">
                                1-{Math.min(12, sortedProjects.length)}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium">
                                {sortedProjects.length}
                            </span>{" "}
                            requests
                        </p>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                Previous
                            </button>
                            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Rejection Reason Modal */}
            {selectedProject && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Reason for Rejection
                                </h3>
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <XCircle className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="mb-6">
                                <label
                                    htmlFor="rejection-reason"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Please explain why this submission is being
                                    rejected
                                </label>
                                <textarea
                                    id="rejection-reason"
                                    value={rejectionReason}
                                    onChange={(e) =>
                                        setRejectionReason(e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    rows="4"
                                    placeholder="Provide specific feedback for the user..."
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitRejection}
                                    className="flex-1 px-4 py-3 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                >
                                    Confirm Rejection
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
