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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">
                            My Volunteer Points
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Track your earned and spent points
                        </p>
                    </div>

                    <div className="px-6 py-4">
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                            <h3 className="text-lg font-medium text-blue-800 mb-2">
                                Total Points: {points.total}
                            </h3>
                            <p className="text-sm text-blue-700">
                                {sortedTransactions.length > 0
                                    ? `You've made ${sortedTransactions.length} point transactions.`
                                    : "You haven't made any point transactions yet."}
                            </p>
                        </div>

                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Points
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Balance
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sortedTransactions.length > 0 ? (
                                        transactionsWithBalance.map(
                                            (transaction) => (
                                                <tr key={transaction.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {format(
                                                            new Date(
                                                                transaction.created_at
                                                            ),
                                                            "MMM d, yyyy HH:mm"
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                transaction.type ===
                                                                "credit"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-red-100 text-red-800"
                                                            }`}
                                                        >
                                                            {transaction.type ===
                                                            "credit"
                                                                ? "Credit"
                                                                : "Debit"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {maskEmails(
                                                            transaction.description
                                                        )}
                                                    </td>
                                                    <td
                                                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                                                            transaction.type ===
                                                            "credit"
                                                                ? "text-green-600"
                                                                : "text-red-600"
                                                        }`}
                                                    >
                                                        {transaction.type ===
                                                        "credit"
                                                            ? "+"
                                                            : "-"}
                                                        {transaction.points}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {transaction.balance}
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="px-6 py-4 text-center text-sm text-gray-500"
                                            >
                                                No point transactions yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </VolunteerLayout>
    );
}
