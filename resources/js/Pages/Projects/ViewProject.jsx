import GeneralPages from "@/Layouts/GeneralPages";
import { useState, useEffect, useRef } from "react";

export default function ViewProject({ project }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const gallery = project.gallery_images || [];

    // Auto-slide every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === gallery.length - 1 ? 0 : prevIndex + 1
            );
        }, 4000);
        return () => clearInterval(interval);
    }, [gallery.length]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                closeModal();
            }
        };

        if (isModalOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isModalOpen]);

    const goToNext = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === gallery.length - 1 ? 0 : prevIndex + 1
        );
    };

    const goToPrev = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? gallery.length - 1 : prevIndex - 1
        );
    };
    return (
        <GeneralPages>
            {/* Hero Image */}
            <div className="w-full max-w-7xl mx-auto px-4 py-8">
                {/* Hero Image */}
                <div className="w-full max-w-7xl mx-auto px-4 py-8">
                    {gallery.length > 0 ? (
                        <div
                            className="relative w-full h-[400px] overflow-hidden rounded-lg shadow-lg cursor-pointer"
                            onClick={openModal}
                        >
                            <img
                                key={
                                    gallery[currentImageIndex]?.id ||
                                    currentImageIndex
                                }
                                src={`/storage/${gallery[currentImageIndex].image_path}`}
                                alt={`Gallery Image ${currentImageIndex + 1}`}
                                className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
                            />
                            {/* Dots */}
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                                {gallery.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => {
                                            e.stopPropagation(); // prevent modal open
                                            setCurrentImageIndex(idx);
                                        }}
                                        className={`w-3 h-3 rounded-full ${
                                            idx === currentImageIndex
                                                ? "bg-white"
                                                : "bg-gray-400"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-100 p-2 rounded-lg shadow-lg">
                            <img
                                src="/images/placeholder.jpg"
                                alt="Placeholder"
                                className="w-full h-64 object-cover rounded-lg"
                            />
                        </div>
                    )}
                </div>

                {/* Modal Fullscreen Carousel */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center px-4">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-white text-3xl font-bold"
                        >
                            &times;
                        </button>
                        <div
                            ref={modalRef}
                            className="relative w-full max-w-4xl"
                        >
                            <img
                                src={`/storage/${gallery[currentImageIndex].image_path}`}
                                alt={`Full Image ${currentImageIndex + 1}`}
                                className="w-full max-h-[80vh] object-contain rounded-lg shadow-xl"
                            />

                            {/* Navigation Buttons */}
                            <button
                                onClick={goToPrev}
                                className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white text-4xl px-4"
                            >
                                ‹
                            </button>
                            <button
                                onClick={goToNext}
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white text-4xl px-4"
                            >
                                ›
                            </button>

                            {/* Dots */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                                {gallery.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() =>
                                            setCurrentImageIndex(idx)
                                        }
                                        className={`w-3 h-3 rounded-full ${
                                            idx === currentImageIndex
                                                ? "bg-white"
                                                : "bg-gray-500"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content Grid */}
            <div className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-1 md:grid-cols-3 gap-10 bg-[#fff] rounded-lg">
                {/* LEFT SIDE - Main Content */}

                <div className="space-y-5 md:col-span-2">
                    <h1 className="text-4xl font-extrabold text-blue-800 mb-3">
                        {project.title}
                    </h1>
                    {/* Tags & Location */}
                    <div className="flex flex-wrap gap-3 text-sm">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                            {project.category?.name}
                        </span>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                            {project.subcategory?.name}
                        </span>
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
                            📍 {project.address}
                        </span>
                    </div>

                    {/* About */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            About the Project
                        </h2>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            {project.detailed_description}
                        </p>
                    </section>

                    {/* Activities */}
                    {project.activities && (
                        <section>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                Volunteer Activities
                            </h3>
                            <p className="text-gray-700 text-lg">
                                {project.activities}
                            </p>
                        </section>
                    )}

                    {/* CTA */}
                    <div className="pt-6">
                        <a
                            href={`/apply/${project.id}`}
                            className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition duration-300 shadow-lg"
                        >
                            Apply to Volunteer
                        </a>
                    </div>
                </div>

                {/* RIGHT SIDE - Sidebar */}
                <div className="space-y-8 md:col-span-1">
                    {/* Quick Facts */}
                    <section className="bg-gray-50 p-6 rounded-xl shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Quick Facts
                        </h2>
                        <div className="space-y-4">
                            <div className="col-span-2 grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-gray-800 font-semibold">
                                        Start Date
                                    </h4>
                                    <p className="text-gray-600">
                                        {project.start_date}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-gray-800 font-semibold">
                                        Duration
                                    </h4>
                                    <p className="text-gray-600">
                                        {project.duration}{" "}
                                        {project.duration_type}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-gray-800 font-semibold">
                                    Minimum Age
                                </h4>
                                <p className="text-gray-600">
                                    {project.minAge || "18+"}
                                </p>
                            </div>

                            {/* Suitable For */}
                            {project.suitable?.length > 0 && (
                                <section>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                        Suitable For
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {project.suitable.map((item, index) => (
                                            <span
                                                key={index}
                                                className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}
                            {project.languages && (
                                <div>
                                    <h4 className="text-gray-800 font-semibold">
                                        Languages
                                    </h4>
                                    <p className="text-gray-600">
                                        {project.languages}
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Organization Info */}
                    <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            Hosted by {project.user?.name}
                        </h3>
                        {project.organization && (
                            <p className="text-gray-600">
                                {project.organization.name} <br />
                                {project.organization.city},{" "}
                                {project.organization.country}
                            </p>
                        )}
                    </section>
                </div>
            </div>
        </GeneralPages>
    );
}
