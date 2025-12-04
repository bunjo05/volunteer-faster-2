import VolunteerLayout from "@/Layouts/VolunteerLayout";
import { Head } from "@inertiajs/react";
import { format } from "date-fns";
import {
    Award,
    TrendingUp,
    TrendingDown,
    History,
    CreditCard,
    Calendar,
    ChevronRight,
    Info,
    DollarSign,
    Filter,
} from "lucide-react";
import { useState, useEffect } from "react";

// Helper function to partially mask emails in text
const maskEmails = (text) => {
    if (!text) return text;

    const emailRegex = /([a-zA-Z0-9._-]+)@([a-zA-Z0-9._-]+\.[a-zA-Z]{2,})/g;

    return text.replace(emailRegex, (match, username, domain) => {
        const keepChars = 2;
        const visibleStart = username.substring(0, keepChars);
        const visibleEnd =
            username.length > keepChars + 1
                ? username.substring(username.length - 1)
                : "";
        const maskedMiddle =
            username.length > keepChars + 1
                ? "**"
                : username.length > keepChars
                ? "*"
                : "";
        return `${visibleStart}${maskedMiddle}${visibleEnd}@${domain}`;
    });
};

export default function Points({
    auth,
    // points,
    totalPoints = 0,
    pointsHistory = [],
}) {
    const [filter, setFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Safely access points data with defaults
    // const pointsData = points || {};
    // const totalPoints = parseInt(pointsData.total) || 0;
    // const historyArray = Array.isArray(pointsData.history)
    //     ? pointsData.history
    //     : [];

    // Sort and filter transactions
    const sortedTransactions = pointsHistory
        .filter((transaction) => {
            if (!transaction || typeof transaction !== "object") return false;
            if (filter === "all") return true;
            return transaction.type === filter;
        })
        .sort((a, b) => {
            if (!a || !b) return 0;

            switch (sortBy) {
                case "newest":
                    return (
                        new Date(b.created_at || 0) -
                        new Date(a.created_at || 0)
                    );
                case "oldest":
                    return (
                        new Date(a.created_at || 0) -
                        new Date(b.created_at || 0)
                    );
                case "highest":
                    return (b.points || 0) - (a.points || 0);
                case "lowest":
                    return (a.points || 0) - (b.points || 0);
                default:
                    return (
                        new Date(b.created_at || 0) -
                        new Date(a.created_at || 0)
                    );
            }
        });

    // Fix the running balance calculation
    let runningBalance = 0; // Start from 0
    const transactionsWithBalance = sortedTransactions
        .map((transaction) => {
            if (!transaction) return null;

            // Calculate balance as we go through transactions
            if (transaction.type === "credit") {
                runningBalance += transaction.points || 0;
            } else {
                runningBalance -= transaction.points || 0;
            }

            return {
                ...transaction,
                balance: runningBalance,
            };
        })
        .filter((transaction) => transaction !== null);

    // Calculate summary statistics with safe defaults
    const totalCredits = sortedTransactions
        .filter((t) => t && t.type === "credit")
        .reduce((sum, t) => sum + (t.points || 0), 0);

    const totalDebits = sortedTransactions
        .filter((t) => t && t.type === "debit")
        .reduce((sum, t) => sum + (t.points || 0), 0);

    // Add error boundary and loading state
    if (isLoading) {
        return (
            <VolunteerLayout auth={auth}>
                <div className="container mx-auto px-3 sm:px-4 py-8">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
                            <p className="text-base-content/70">
                                Loading points data...
                            </p>
                        </div>
                    </div>
                </div>
            </VolunteerLayout>
        );
    }

    if (error) {
        return (
            <VolunteerLayout auth={auth}>
                <div className="container mx-auto px-3 sm:px-4 py-8">
                    <div className="alert alert-error">
                        <span>Error loading points: {error}</span>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn btn-sm btn-ghost ml-4"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </VolunteerLayout>
        );
    }

    return (
        <VolunteerLayout auth={auth}>
            <Head title="My Points" />

            <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
                {/* Page Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                My Volunteer Points
                            </h1>
                            <p className="text-base-content/70 mt-1 sm:mt-2 text-sm sm:text-base">
                                Track your earned and spent points
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Award className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                        </div>
                    </div>
                </div>

                {/* Points Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    {/* Total Points Card */}
                    <div className="card bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 shadow-sm">
                        <div className="card-body p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-1">
                                        Total Points
                                    </h3>
                                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                                        {totalPoints}
                                    </p>
                                </div>
                                <div className="bg-primary/20 p-2 sm:p-3 rounded-full">
                                    <Award className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                </div>
                            </div>
                            <div className="mt-2 sm:mt-4 pt-2 sm:pt-3 border-t border-primary/10">
                                <p className="text-xs sm:text-sm text-gray-600">
                                    {sortedTransactions.length} total
                                    transactions
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Credits Card */}
                    <div className="card bg-gradient-to-br from-success/10 to-success/5 border border-success/20 shadow-sm">
                        <div className="card-body p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-1">
                                        Total Earned
                                    </h3>
                                    <p className="text-2xl sm:text-3xl font-bold text-success">
                                        +{totalCredits}
                                    </p>
                                </div>
                                <div className="bg-success/20 p-2 sm:p-3 rounded-full">
                                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-success" />
                                </div>
                            </div>
                            <div className="mt-2 sm:mt-4 pt-2 sm:pt-3 border-t border-success/10">
                                <p className="text-xs sm:text-sm text-gray-600">
                                    Points earned from projects
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Debits Card */}
                    <div className="card bg-gradient-to-br from-error/10 to-error/5 border border-error/20 shadow-sm">
                        <div className="card-body p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-1">
                                        Total Spent
                                    </h3>
                                    <p className="text-2xl sm:text-3xl font-bold text-error">
                                        -{totalDebits}
                                    </p>
                                </div>
                                <div className="bg-error/20 p-2 sm:p-3 rounded-full">
                                    <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-error" />
                                </div>
                            </div>
                            <div className="mt-2 sm:mt-4 pt-2 sm:pt-3 border-t border-error/10">
                                <p className="text-xs sm:text-sm text-gray-600">
                                    Points used for payments
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Value Card */}
                    <div className="card bg-gradient-to-br from-info/10 to-info/5 border border-info/20 shadow-sm">
                        <div className="card-body p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-1">
                                        Point Value
                                    </h3>
                                    <p className="text-2xl sm:text-3xl font-bold text-info">
                                        ${(totalPoints * 0.5).toFixed(2)}
                                    </p>
                                </div>
                                <div className="bg-info/20 p-2 sm:p-3 rounded-full">
                                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-info" />
                                </div>
                            </div>
                            <div className="mt-2 sm:mt-4 pt-2 sm:pt-3 border-t border-info/10">
                                <p className="text-xs sm:text-sm text-gray-600">
                                    $0.50 per point value
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter and Sort Controls */}
                <div className="card bg-base-100 shadow-sm border border-base-300 mb-4 sm:mb-6">
                    <div className="card-body p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h3 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                                <History className="w-5 h-5" />
                                Transaction History
                            </h3>

                            <div className="flex flex-col sm:flex-row gap-3">
                                {/* Filter Dropdown */}
                                <div className="dropdown dropdown-bottom dropdown-end">
                                    <div
                                        tabIndex={0}
                                        role="button"
                                        className="btn btn-outline btn-sm gap-2"
                                    >
                                        <Filter className="w-4 h-4" />
                                        <span className="hidden xs:inline">
                                            Filter
                                        </span>
                                    </div>
                                    <ul
                                        tabIndex={0}
                                        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                                    >
                                        <li>
                                            <button
                                                className={
                                                    filter === "all"
                                                        ? "active"
                                                        : ""
                                                }
                                                onClick={() => setFilter("all")}
                                            >
                                                All Transactions
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className={
                                                    filter === "credit"
                                                        ? "active"
                                                        : ""
                                                }
                                                onClick={() =>
                                                    setFilter("credit")
                                                }
                                            >
                                                <TrendingUp className="w-4 h-4 text-success" />
                                                Credits Only
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className={
                                                    filter === "debit"
                                                        ? "active"
                                                        : ""
                                                }
                                                onClick={() =>
                                                    setFilter("debit")
                                                }
                                            >
                                                <TrendingDown className="w-4 h-4 text-error" />
                                                Debits Only
                                            </button>
                                        </li>
                                    </ul>
                                </div>

                                {/* Sort Dropdown */}
                                <div className="dropdown dropdown-bottom dropdown-end">
                                    <div
                                        tabIndex={0}
                                        role="button"
                                        className="btn btn-outline btn-sm gap-2"
                                    >
                                        <Calendar className="w-4 h-4" />
                                        <span className="hidden xs:inline">
                                            Sort
                                        </span>
                                    </div>
                                    <ul
                                        tabIndex={0}
                                        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                                    >
                                        <li>
                                            <button
                                                className={
                                                    sortBy === "newest"
                                                        ? "active"
                                                        : ""
                                                }
                                                onClick={() =>
                                                    setSortBy("newest")
                                                }
                                            >
                                                Newest First
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className={
                                                    sortBy === "oldest"
                                                        ? "active"
                                                        : ""
                                                }
                                                onClick={() =>
                                                    setSortBy("oldest")
                                                }
                                            >
                                                Oldest First
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className={
                                                    sortBy === "highest"
                                                        ? "active"
                                                        : ""
                                                }
                                                onClick={() =>
                                                    setSortBy("highest")
                                                }
                                            >
                                                Highest Points
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className={
                                                    sortBy === "lowest"
                                                        ? "active"
                                                        : ""
                                                }
                                                onClick={() =>
                                                    setSortBy("lowest")
                                                }
                                            >
                                                Lowest Points
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Active Filters */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            {filter !== "all" && (
                                <div className="badge badge-outline gap-1">
                                    {filter === "credit" ? (
                                        <>
                                            <TrendingUp className="w-3 h-3" />
                                            Credits Only
                                        </>
                                    ) : (
                                        <>
                                            <TrendingDown className="w-3 h-3" />
                                            Debits Only
                                        </>
                                    )}
                                    <button
                                        onClick={() => setFilter("all")}
                                        className="btn btn-xs btn-ghost btn-circle"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                            <div className="badge badge-outline gap-1">
                                {sortBy === "newest" && "Newest First"}
                                {sortBy === "oldest" && "Oldest First"}
                                {sortBy === "highest" && "Highest Points"}
                                {sortBy === "lowest" && "Lowest Points"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="card bg-base-100 shadow-sm border border-base-300">
                    <div className="card-body p-0">
                        {sortedTransactions.length > 0 ? (
                            <div className="overflow-hidden">
                                {/* Desktop Table */}
                                <div className="hidden md:block">
                                    <div className="overflow-x-auto">
                                        <table className="table table-zebra">
                                            <thead>
                                                <tr className="bg-base-200">
                                                    <th className="text-left py-3 px-4 font-semibold text-sm">
                                                        Date & Time
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-semibold text-sm">
                                                        Type
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-semibold text-sm">
                                                        Description
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-semibold text-sm">
                                                        Points
                                                    </th>
                                                    <th className="text-left py-3 px-4 font-semibold text-sm">
                                                        Balance
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {transactionsWithBalance.map(
                                                    (transaction) => (
                                                        <tr
                                                            key={transaction.id}
                                                            className="hover:bg-base-100/50"
                                                        >
                                                            <td className="py-3 px-4 border-t border-base-300">
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium">
                                                                        {format(
                                                                            new Date(
                                                                                transaction.created_at
                                                                            ),
                                                                            "MMM d, yyyy"
                                                                        )}
                                                                    </span>
                                                                    <span className="text-xs text-base-content/60">
                                                                        {format(
                                                                            new Date(
                                                                                transaction.created_at
                                                                            ),
                                                                            "h:mm a"
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="py-3 px-4 border-t border-base-300">
                                                                <span
                                                                    className={`badge badge-lg ${
                                                                        transaction.type ===
                                                                        "credit"
                                                                            ? "badge-success"
                                                                            : "badge-error"
                                                                    }`}
                                                                >
                                                                    {transaction.type ===
                                                                    "credit" ? (
                                                                        <TrendingUp className="w-3 h-3 mr-1" />
                                                                    ) : (
                                                                        <TrendingDown className="w-3 h-3 mr-1" />
                                                                    )}
                                                                    {transaction.type ===
                                                                    "credit"
                                                                        ? "Credit"
                                                                        : "Debit"}
                                                                </span>
                                                            </td>
                                                            <td className="py-3 px-4 border-t border-base-300 max-w-xs">
                                                                <div className="line-clamp-2">
                                                                    {maskEmails(
                                                                        transaction.description
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="py-3 px-4 border-t border-base-300">
                                                                <span
                                                                    className={`font-semibold text-lg ${
                                                                        transaction.type ===
                                                                        "credit"
                                                                            ? "text-success"
                                                                            : "text-error"
                                                                    }`}
                                                                >
                                                                    {transaction.type ===
                                                                    "credit"
                                                                        ? "+"
                                                                        : "-"}
                                                                    {
                                                                        transaction.points
                                                                    }
                                                                </span>
                                                            </td>
                                                            <td className="py-3 px-4 border-t border-base-300">
                                                                <div className="font-semibold text-base">
                                                                    {
                                                                        transaction.balance
                                                                    }
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Mobile/Tablet Cards View */}
                                <div className="md:hidden">
                                    <div className="divide-y divide-base-300">
                                        {transactionsWithBalance.map(
                                            (transaction) => (
                                                <div
                                                    key={transaction.id}
                                                    className="p-4 hover:bg-base-100/50"
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className={`p-2 rounded-full ${
                                                                    transaction.type ===
                                                                    "credit"
                                                                        ? "bg-success/10"
                                                                        : "bg-error/10"
                                                                }`}
                                                            >
                                                                {transaction.type ===
                                                                "credit" ? (
                                                                    <TrendingUp className="w-4 h-4 text-success" />
                                                                ) : (
                                                                    <TrendingDown className="w-4 h-4 text-error" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-sm">
                                                                    {format(
                                                                        new Date(
                                                                            transaction.created_at
                                                                        ),
                                                                        "MMM d, yyyy"
                                                                    )}
                                                                </div>
                                                                <div className="text-xs text-base-content/60">
                                                                    {format(
                                                                        new Date(
                                                                            transaction.created_at
                                                                        ),
                                                                        "h:mm a"
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <span
                                                                className={`font-bold text-lg ${
                                                                    transaction.type ===
                                                                    "credit"
                                                                        ? "text-success"
                                                                        : "text-error"
                                                                }`}
                                                            >
                                                                {transaction.type ===
                                                                "credit"
                                                                    ? "+"
                                                                    : "-"}
                                                                {
                                                                    transaction.points
                                                                }
                                                            </span>
                                                            <div className="text-sm text-base-content/70 mt-1">
                                                                Balance:{" "}
                                                                {
                                                                    transaction.balance
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-3">
                                                        <p className="text-sm text-base-content/80">
                                                            {maskEmails(
                                                                transaction.description
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div className="mt-3 flex justify-between items-center">
                                                        <span
                                                            className={`badge ${
                                                                transaction.type ===
                                                                "credit"
                                                                    ? "badge-success"
                                                                    : "badge-error"
                                                            }`}
                                                        >
                                                            {transaction.type ===
                                                            "credit"
                                                                ? "Credit"
                                                                : "Debit"}
                                                        </span>
                                                        <ChevronRight className="w-4 h-4 text-base-content/40" />
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* Summary Footer */}
                                <div className="border-t border-base-300 p-4 bg-base-200/50">
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-base-content/70">
                                            Showing {sortedTransactions.length}{" "}
                                            transactions
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-sm">
                                                <span className="text-success font-medium">
                                                    +{totalCredits}
                                                </span>
                                                <span className="text-base-content/50 mx-2">
                                                    |
                                                </span>
                                                <span className="text-error font-medium">
                                                    -{totalDebits}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 sm:p-12 text-center">
                                <div className="max-w-md mx-auto">
                                    <div className="bg-base-200 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <Info className="w-8 h-8 text-base-content/40" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-gray-700 mb-2">
                                        No transactions found
                                    </h4>
                                    <p className="text-base-content/70 mb-6 text-sm">
                                        {filter !== "all"
                                            ? `No ${filter} transactions match your filters.`
                                            : "You haven't made any point transactions yet."}
                                    </p>
                                    {filter !== "all" && (
                                        <button
                                            onClick={() => setFilter("all")}
                                            className="btn btn-primary btn-sm"
                                        >
                                            Clear Filters
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Information Panel */}
                <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="card bg-info/5 border border-info/20">
                        <div className="card-body p-4 sm:p-6">
                            <h4 className="card-title text-lg font-semibold mb-3 flex items-center gap-2">
                                <Info className="w-5 h-5 text-info" />
                                How Points Work
                            </h4>
                            <ul className="space-y-2 text-sm sm:text-base">
                                <li className="flex items-start gap-2">
                                    <div className="badge badge-success badge-xs mt-1">
                                        ✓
                                    </div>
                                    <span>
                                        <strong>Earn points</strong> by
                                        completing volunteer projects
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="badge badge-error badge-xs mt-1">
                                        ✗
                                    </div>
                                    <span>
                                        <strong>Use points</strong> to pay for
                                        new volunteer experiences
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="badge badge-info badge-xs mt-1">
                                        $
                                    </div>
                                    <span>
                                        <strong>Point value:</strong> 1 point =
                                        $0.50 towards bookings
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="badge badge-primary badge-xs mt-1">
                                        ⏱
                                    </div>
                                    <span>
                                        <strong>Points never expire</strong> and
                                        can be saved indefinitely
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="card bg-warning/5 border border-warning/20">
                        <div className="card-body p-4 sm:p-6">
                            <h4 className="card-title text-lg font-semibold mb-3 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-warning" />
                                Using Your Points
                            </h4>
                            <div className="space-y-3 text-sm sm:text-base">
                                <p>
                                    <strong>To use your points:</strong>
                                </p>
                                <ol className="list-decimal pl-5 space-y-2">
                                    <li>Book a volunteer project</li>
                                    <li>
                                        During payment, select "Pay with Points"
                                        option
                                    </li>
                                    <li>Confirm the amount you want to use</li>
                                    <li>
                                        Points will be deducted from your
                                        balance
                                    </li>
                                </ol>
                                <div className="mt-4 p-3 bg-warning/10 rounded-lg">
                                    <p className="text-sm text-warning-content/90">
                                        <strong>Note:</strong> Points can only
                                        be used for partial or full payment of
                                        project fees.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </VolunteerLayout>
    );
}
