import React, { useState, useEffect } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { format } from "date-fns";
import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import SelectInput from "@/Components/SelectInput";
import AdminLayout from "@/Layouts/AdminLayout";

import { formatCurrency } from "@/Helpers/currency";

export default function Index({ payments }) {
    const { auth } = usePage().props;
    const { data: queryParams } = usePage().props;

    const [filters, setFilters] = useState({
        // search: queryParams.search || "",
        // status: queryParams.status || "",
        // payment_type: queryParams.payment_type || "",
        // date_from: queryParams.date_from || "",
        // date_to: queryParams.date_to || "",
    });

    const [sort, setSort] = useState({
        // field: queryParams.sort || "created_at",
        // direction: queryParams.direction || "desc",
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            const params = {};

            // Add filters
            // if (filters.search) params.search = filters.search;
            if (filters.status) params.status = filters.status;
            if (filters.payment_type)
                params.payment_type = filters.payment_type;
            if (filters.date_from) params.date_from = filters.date_from;
            if (filters.date_to) params.date_to = filters.date_to;

            // Add sorting
            if (sort.field) params.sort = sort.field;
            if (sort.direction) params.direction = sort.direction;

            router.get(route("admin.payments.index"), params, {
                preserveState: true,
                replace: true,
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [filters, sort]);

    const handleSort = (field) => {
        setSort({
            field,
            direction:
                sort.field === field
                    ? sort.direction === "asc"
                        ? "desc"
                        : "asc"
                    : "desc",
        });
    };

    const statusBadge = (status) => {
        const statusClasses = {
            deposit_paid: "bg-blue-100 text-blue-800",
            full_paid: "bg-green-100 text-green-800",
            failed: "bg-red-100 text-red-800",
            refunded: "bg-gray-100 text-gray-800",
            pending: "bg-yellow-100 text-yellow-800",
        };

        return (
            <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                    statusClasses[status] || "bg-gray-100 text-gray-800"
                }`}
            >
                {status.replace("_", " ")}
            </span>
        );
    };

    const paymentTypeBadge = (type) => {
        const typeClasses = {
            deposit: "bg-purple-100 text-purple-800",
            full: "bg-indigo-100 text-indigo-800",
            refund: "bg-pink-100 text-pink-800",
        };

        return (
            <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                    typeClasses[type] || "bg-gray-100 text-gray-800"
                }`}
            >
                {type}
            </span>
        );
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Payments Management
                </h2>
            }
        >
            <Head title="Payments" />

            <div className="py-4 sm:py-6">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-4 sm:p-6 bg-white border-b border-gray-200">
                            {/* Filters - Stack vertically on mobile */}
                            <div className="mb-6 space-y-4 sm:grid sm:grid-cols-2 md:grid-cols-4 sm:gap-4 sm:space-y-0">
                                <SelectInput
                                    name="status"
                                    value={filters.status}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            status: e.target.value,
                                        })
                                    }
                                    className="w-full"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="deposit_paid">
                                        Deposit Paid
                                    </option>
                                    <option value="full_paid">Full Paid</option>
                                    <option value="failed">Failed</option>
                                    <option value="refunded">Refunded</option>
                                    <option value="pending">Pending</option>
                                </SelectInput>

                                <div className="flex space-x-2 sm:col-span-2">
                                    <TextInput
                                        type="date"
                                        name="date_from"
                                        value={filters.date_from}
                                        onChange={(e) =>
                                            setFilters({
                                                ...filters,
                                                date_from: e.target.value,
                                            })
                                        }
                                        className="w-full"
                                        placeholder="From Date"
                                    />
                                    <TextInput
                                        type="date"
                                        name="date_to"
                                        value={filters.date_to}
                                        onChange={(e) =>
                                            setFilters({
                                                ...filters,
                                                date_to: e.target.value,
                                            })
                                        }
                                        className="w-full"
                                        placeholder="To Date"
                                    />
                                </div>
                            </div>

                            {/* Mobile Cards View */}
                            <div className="sm:hidden space-y-4">
                                {payments.data.length > 0 ? (
                                    payments.data.map((payment) => (
                                        <div
                                            key={payment.id}
                                            className="bg-gray-50 p-4 rounded-lg shadow"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        #{payment.id} -{" "}
                                                        {payment.booking
                                                            ?.project?.title ||
                                                            "N/A"}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {format(
                                                            new Date(
                                                                payment.created_at
                                                            ),
                                                            "MMM dd, yyyy HH:mm"
                                                        )}
                                                    </p>
                                                </div>
                                                <div>
                                                    {payment?.status
                                                        ? statusBadge(
                                                              payment.status
                                                          )
                                                        : "N/A"}
                                                </div>
                                            </div>
                                            <div className="mt-2">
                                                <p className="text-sm">
                                                    <span className="font-medium">
                                                        Amount:
                                                    </span>{" "}
                                                    {formatCurrency(
                                                        payment.amount
                                                    )}
                                                </p>
                                                <p className="text-sm">
                                                    <span className="font-medium">
                                                        Volunteer:
                                                    </span>{" "}
                                                    {payment.user?.name ||
                                                        "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        No payments found
                                    </div>
                                )}
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden sm:block overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                ID
                                            </th>
                                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Project
                                            </th>
                                            <th className="hidden md:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Volunteer
                                            </th>
                                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {payments.data.length > 0 ? (
                                            payments.data.map((payment) => (
                                                <tr key={payment.id}>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        #{payment.id}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {format(
                                                            new Date(
                                                                payment.created_at
                                                            ),
                                                            "MMM dd, yyyy"
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-4 text-sm text-gray-500">
                                                        <div className="font-medium text-gray-900">
                                                            {payment.booking
                                                                ?.project
                                                                ?.title ||
                                                                "N/A"}
                                                        </div>
                                                        <div className="text-gray-500">
                                                            {payment.booking
                                                                ?.project
                                                                ?.organization_profile
                                                                ?.name || "N/A"}
                                                        </div>
                                                    </td>
                                                    <td className="hidden md:table-cell px-3 py-4 text-sm text-gray-500">
                                                        <div className="font-medium text-gray-900">
                                                            {payment.user
                                                                ?.name || "N/A"}
                                                        </div>
                                                        <div className="text-gray-500">
                                                            {payment.user
                                                                ?.email ||
                                                                "N/A"}
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatCurrency(
                                                            payment.amount
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {payment?.status
                                                            ? statusBadge(
                                                                  payment.status
                                                              )
                                                            : "N/A"}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="6"
                                                    className="px-6 py-4 text-center text-sm text-gray-500"
                                                >
                                                    No payments found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <Pagination
                                links={payments.links}
                                className="mt-4"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
