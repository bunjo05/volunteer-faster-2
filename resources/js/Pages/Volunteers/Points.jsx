import VolunteerLayout from "@/Layouts/VolunteerLayout";
import { Head } from "@inertiajs/react";
import { format } from "date-fns";

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

export default function Points({ auth, points }) {
    // Sort transactions in descending order by date
    const sortedTransactions = [...(points.history || [])].sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
    });

    // Calculate running balance in descending order
    let runningBalance = points.total;
    const transactionsWithBalance = sortedTransactions
        .map((transaction) => {
            const balance = runningBalance;
            runningBalance =
                transaction.type === "credit"
                    ? runningBalance - transaction.points
                    : runningBalance + transaction.points;
            return { ...transaction, balance };
        })
        .reverse(); // Reverse to show newest first but calculate balance correctly

    return (
        <VolunteerLayout auth={auth}>
            <Head title="My Points" />

            <div className="container mx-auto px-4 py-8">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-2xl">
                            My Volunteer Points
                        </h2>
                        <p className="text-base-content/70">
                            Track your earned and spent points
                        </p>

                        <div className="stats bg-primary/10 my-4">
                            <div className="stat">
                                <div className="stat-title">Total Points</div>
                                <div className="stat-value text-primary">
                                    {points.total}
                                </div>
                                <div className="stat-desc">
                                    {sortedTransactions.length > 0
                                        ? `${sortedTransactions.length} transactions`
                                        : "No transactions yet"}
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            {sortedTransactions.length > 0 ? (
                                <table className="table table-zebra">
                                    {/* Desktop table head */}
                                    <thead className="hidden sm:table-header-group">
                                        <tr>
                                            <th>Date</th>
                                            <th>Type</th>
                                            <th>Description</th>
                                            <th>Points</th>
                                            <th>Balance</th>
                                        </tr>
                                    </thead>
                                    {/* Mobile table head */}
                                    <thead className="sm:hidden">
                                        <tr>
                                            <th>Transaction Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactionsWithBalance.map(
                                            (transaction) => (
                                                <tr key={transaction.id}>
                                                    {/* Desktop view */}
                                                    <td className="hidden sm:table-cell">
                                                        {format(
                                                            new Date(
                                                                transaction.created_at
                                                            ),
                                                            "MMM d, yyyy HH:mm"
                                                        )}
                                                    </td>
                                                    <td className="hidden sm:table-cell">
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
                                                    </td>
                                                    <td className="hidden sm:table-cell">
                                                        {maskEmails(
                                                            transaction.description
                                                        )}
                                                    </td>
                                                    <td className="hidden sm:table-cell">
                                                        <span
                                                            className={`font-semibold ${
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
                                                            {transaction.points}
                                                        </span>
                                                    </td>
                                                    <td className="hidden sm:table-cell">
                                                        {transaction.balance}
                                                    </td>

                                                    {/* Mobile view */}
                                                    <td className="sm:hidden">
                                                        <div className="flex flex-col space-y-2">
                                                            <div className="flex justify-between">
                                                                <span className="font-semibold">
                                                                    {format(
                                                                        new Date(
                                                                            transaction.created_at
                                                                        ),
                                                                        "MMM d, yyyy"
                                                                    )}
                                                                </span>
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
                                                            </div>
                                                            <div>
                                                                {maskEmails(
                                                                    transaction.description
                                                                )}
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span
                                                                    className={`font-semibold ${
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
                                                                    }{" "}
                                                                    points
                                                                </span>
                                                                <span>
                                                                    Balance:{" "}
                                                                    {
                                                                        transaction.balance
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="alert alert-info">
                                    <div className="flex-1">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            className="w-6 h-6 mx-2 stroke-current"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            ></path>
                                        </svg>
                                        <label>
                                            No point transactions yet.
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </VolunteerLayout>
    );
}
