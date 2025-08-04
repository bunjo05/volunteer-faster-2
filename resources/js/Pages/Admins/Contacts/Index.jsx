import React, { useState } from "react";
import { usePage, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Eye } from "lucide-react";

export default function Index() {
    const { messages } = usePage().props;
    const [statusChanges, setStatusChanges] = useState({});

    const statusBadge = (status, type) => {
        const color = status
            ? type === "read"
                ? "bg-green-100 text-green-700"
                : type === "replied"
                ? "bg-blue-100 text-blue-700"
                : "bg-red-100 text-red-700"
            : "bg-gray-100 text-gray-500";

        const label = status ? "Yes" : "No";

        return (
            <span
                className={`px-2 py-1 rounded text-xs font-semibold ${color}`}
            >
                {label}
            </span>
        );
    };

    const handleStatusChange = (messageId, newStatus) => {
        const boolStatus = newStatus === "1";
        setStatusChanges((prev) => ({ ...prev, [messageId]: boolStatus }));

        router.put(`/admin/contacts/${messageId}/status`, {
            is_suspended: boolStatus,
        });
    };

    return (
        <AdminLayout>
            <div className="p-6 space-y-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    Contact Messages
                </h1>

                <div className="bg-white shadow rounded-xl overflow-x-auto">
                    <table className="min-w-full text-sm text-left text-gray-700">
                        <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Subject</th>
                                <th className="px-6 py-4">Read</th>
                                <th className="px-6 py-4">Replied</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.data.map((message) => {
                                const isSuspended = message.is_suspended;

                                const rowClass = `border-b ${
                                    isSuspended
                                        ? "bg-red-50"
                                        : "hover:bg-gray-50 transition"
                                }`;

                                const cellText = (text) =>
                                    isSuspended ? (
                                        <span className="line-through text-gray-500">
                                            {text}
                                        </span>
                                    ) : (
                                        text
                                    );

                                return (
                                    <tr key={message.id} className={rowClass}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {cellText(message.name)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {cellText(message.email)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {cellText(message.subject)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {statusBadge(
                                                message.is_read,
                                                "read"
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {statusBadge(
                                                message.is_replied,
                                                "replied"
                                            )}
                                        </td>
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <button
                                                onClick={() =>
                                                    router.visit(
                                                        `/admin/contacts/${message.id}`
                                                    )
                                                }
                                                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View
                                            </button>

                                            <select
                                                value={
                                                    statusChanges[
                                                        message.id
                                                    ] !== undefined
                                                        ? statusChanges[
                                                              message.id
                                                          ]
                                                            ? "1"
                                                            : "0"
                                                        : message.is_suspended
                                                        ? "1"
                                                        : "0"
                                                }
                                                onChange={(e) =>
                                                    handleStatusChange(
                                                        message.id,
                                                        e.target.value
                                                    )
                                                }
                                                className="px-2 py-1 text-sm border rounded-md bg-white text-gray-700 hover:border-gray-400 transition"
                                            >
                                                <option value="">
                                                    Change Status
                                                </option>
                                                <option value="0">
                                                    Active
                                                </option>
                                                <option value="1">
                                                    Suspended
                                                </option>
                                            </select>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-wrap items-center gap-2">
                    {messages.links.map((link, index) => (
                        <button
                            key={index}
                            disabled={!link.url}
                            className={`px-4 py-1 rounded border text-sm transition ${
                                link.active
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-700 hover:bg-blue-50"
                            }`}
                            onClick={() => link.url && router.visit(link.url)}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
