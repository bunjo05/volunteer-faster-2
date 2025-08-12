import AdminLayout from "@/Layouts/AdminLayout";
import { Check, X } from "lucide-react";
import { router, Link } from "@inertiajs/react";

export default function Referral({ referrals }) {
    const handleAction = (id, action) => {
        router.post(
            route(`admin.referrals.${action}`, { referral: id }),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Optional: Show a success message
                    window.toast?.show({
                        title: "Success",
                        message: `Referral ${action}d successfully`,
                        type: "success",
                    });
                },
                onError: () => {
                    // Optional: Show an error message
                    window.toast?.show({
                        title: "Error",
                        message: `Failed to ${action} referral`,
                        type: "error",
                    });
                },
            }
        );
    };

    return (
        <AdminLayout>
            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-6">Referrals</h1>

                <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-100">
                    <table className="min-w-full text-sm text-left text-gray-700">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">Referrer</th>
                                <th className="px-6 py-3">Referee</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3 text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {referrals.data.length > 0 ? (
                                referrals.data.map((referral) => (
                                    <tr
                                        key={referral.id}
                                        className="border-t hover:bg-gray-50 transition-colors"
                                    >
                                        {/* Referrer */}
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-medium">
                                                    {referral.referrer?.name ||
                                                        "N/A"}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {referral.referrer?.email}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Referee */}
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-medium">
                                                    {referral.referee?.name ||
                                                        "N/A"}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {referral.referee?.email}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${
                                                    referral.status ===
                                                    "approved"
                                                        ? "bg-green-100 text-green-800"
                                                        : referral.status ===
                                                          "rejected"
                                                        ? "bg-red-100 text-red-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                }`}
                                            >
                                                {referral.status}
                                            </span>
                                        </td>

                                        {/* Date */}
                                        <td className="px-6 py-4">
                                            {new Date(
                                                referral.created_at
                                            ).toLocaleDateString()}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 flex gap-2 justify-center">
                                            {referral.status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            handleAction(
                                                                referral.id,
                                                                "approve"
                                                            )
                                                        }
                                                        className="flex items-center gap-1 text-green-600 hover:text-green-800"
                                                    >
                                                        <Check className="h-4 w-4" />{" "}
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleAction(
                                                                referral.id,
                                                                "reject"
                                                            )
                                                        }
                                                        className="flex items-center gap-1 text-red-600 hover:text-red-800"
                                                    >
                                                        <X className="h-4 w-4" />{" "}
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            {referral.status !== "pending" && (
                                                <span className="text-gray-500">
                                                    Action taken
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-6 py-8 text-center text-gray-500"
                                    >
                                        No referrals found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {referrals.meta && (
                    <div className="mt-4 flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            Showing {referrals.meta.from} to {referrals.meta.to}{" "}
                            of {referrals.meta.total} entries
                        </div>
                        <div className="flex gap-2">
                            {referrals.meta.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || "#"}
                                    className={`px-3 py-1 rounded ${
                                        link.active
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-100 text-gray-700"
                                    } ${
                                        !link.url
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:bg-gray-200"
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
