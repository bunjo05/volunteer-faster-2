import AdminLayout from "@/Layouts/AdminLayout";

import { useState } from "react";
import { router, useForm } from "@inertiajs/react";

export default function ViewProject({ project }) {
    const [showRejectModal, setShowRejectModal] = useState(false);

    const { data, setData, post, processing, reset, errors, flash, success } =
        useForm({
            remark: "",
            project_id: project.id,
        });

    const submitRemark = (e) => {
        e.preventDefault();
        const formData = new FormData();

        console.log(errors);

        post(route("admin.project.remark.store"), {
            data: formData,
            onSuccess: () => {
                setShowRejectModal(false);
                reset();
            },
        });
    };
    return (
        <AdminLayout>
            <div className="">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">
                        Review Project: {project.title}
                    </h1>

                    {/* Main Project Card */}
                    <div className="bg-white shadow rounded-xl p-6 mb-8">
                        {/* Image */}
                        <img
                            src={
                                project.featured_image
                                    ? `/storage/${project.featured_image}`
                                    : "/images/placeholder.jpg"
                            }
                            alt={project.title}
                            className="object-cover w-[200px] h-full rounded-lg"
                        />

                        {/* Metadata */}
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    Title
                                </label>
                                <p className="text-gray-800 font-medium">
                                    {project.title}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    Category
                                </label>
                                <p className="text-gray-800">
                                    {project.category?.name}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    Subcategory
                                </label>
                                <p className="text-gray-800">
                                    {project.subcategory?.name}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    Address
                                </label>
                                <p className="text-gray-800">
                                    {project.address}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    Duration
                                </label>
                                <p className="text-gray-800">
                                    {project.duration} {project.duration_type}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    Start Date
                                </label>
                                <p className="text-gray-800">
                                    {project.start_date}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    Fees
                                </label>
                                <p className="text-gray-800">
                                    {project.fees
                                        ? `${project.currency} ${project.fees}`
                                        : "Free"}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">
                                    Status
                                </label>
                                <span
                                    className={`inline-block text-sm font-semibold px-3 py-1 rounded-full ${
                                        project.status === "Pending"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : project.status === "Active"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                    }`}
                                >
                                    {project.status}
                                </span>
                            </div>
                        </div>

                        {/* Short Description */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-500">
                                Short Description
                            </label>
                            <p className="text-gray-700">
                                {project.short_description}
                            </p>
                        </div>

                        {/* Detailed Description */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-500">
                                Detailed Description
                            </label>
                            <p className="text-gray-700 whitespace-pre-line">
                                {project.detailed_description}
                            </p>
                        </div>

                        {/* Daily Routine */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-500">
                                Typical Daily Routine
                            </label>
                            <p className="text-gray-700 whitespace-pre-line">
                                {project.daily_routine}
                            </p>
                        </div>

                        {/* Activities */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-500">
                                Volunteer Activities
                            </label>
                            <p className="text-gray-700 whitespace-pre-line">
                                {project.activities}
                            </p>
                        </div>

                        {/* Suitable For */}
                        {project.suitable && project.suitable.length > 0 && (
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-500">
                                    Suitable For
                                </label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {project.suitable.map((item, i) => (
                                        <span
                                            key={i}
                                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Availability Months */}
                        {project.availability_months &&
                            project.availability_months.length > 0 && (
                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-gray-500">
                                        Available Months
                                    </label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {project.availability_months.map(
                                            (month, i) => (
                                                <span
                                                    key={i}
                                                    className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                                                >
                                                    {month}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                        {/* Project Gallery Images */}
                        {project.gallery_images &&
                            project.gallery_images.length > 0 && (
                                <div className="mt-10">
                                    <label className="block text-sm font-medium text-gray-500 mb-2">
                                        Project Gallery
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {project.gallery_images.map(
                                            (image, i) => (
                                                <img
                                                    key={i}
                                                    src={`/storage/${image.image_path}`}
                                                    alt={`Gallery Image ${
                                                        i + 1
                                                    }`}
                                                    className="w-full h-48 object-cover rounded-lg shadow"
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                        {/* Action Buttons (only show if request_for_approval is true) */}
                        {project.request_for_approval === 1 && (
                            <div className="mt-10 flex gap-4">
                                <button className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition">
                                    Approve Project
                                </button>

                                <button
                                    onClick={() => setShowRejectModal(true)}
                                    className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition"
                                >
                                    Reject Project
                                </button>

                                {/* <button className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition">
                                    Reject Project
                                </button> */}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showRejectModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-red-600">
                            Reject Project
                        </h2>
                        <form onSubmit={submitRemark}>
                            <textarea
                                className="w-full border border-gray-300 rounded p-2 mb-3"
                                rows="4"
                                placeholder="Enter your rejection reason..."
                                value={data.remark}
                                onChange={(e) =>
                                    setData("remark", e.target.value)
                                }
                            ></textarea>
                            {errors.remark && (
                                <p className="text-sm text-red-500 mb-2">
                                    {errors.remark}
                                </p>
                            )}
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    className="text-gray-600 hover:text-gray-800"
                                    onClick={() => setShowRejectModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                >
                                    Submit Remark
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* {flash.success && (
                <div className="mb-4 bg-green-100 text-green-700 p-3 rounded">
                    {flash.success}
                </div>
            )} */}
        </AdminLayout>
    );
}
