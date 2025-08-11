import React, { useState, useRef, useEffect } from "react";

const VolunteerSkillsDropdown = ({
    label = "Required Skills",
    multiple = true,
    onSkillsChange,
    initialSelectedSkills = [],
    required = false,
    maxHeight = "60vh", // New prop for customizable max height
    minHeight = "200px", // New prop for customizable min height
}) => {
    const volunteerSkills = [
        "First Aid/CPR",
        "Teaching/Tutoring",
        "Mentoring",
        "Crisis Counseling",
        "Fundraising",
        "Event Planning",
        "Social Media Management",
        "Graphic Design",
        "Photography/Videography",
        "Translation",
        "Construction/Renovation",
        "Gardening/Landscaping",
        "Cooking/Food Preparation",
        "Driving/Delivery",
        "Medical/Healthcare",
        "Elderly Care",
        "Child Care",
        "Animal Care",
        "Disaster Relief",
        "Environmental Conservation",
        "Public Speaking",
        "Data Entry",
        "Web Development",
        "Legal Assistance",
        "Accounting/Finance",
        "Leadership",
        "Teamwork",
        "Communication",
        "Problem Solving",
    ];

    const [selectedSkills, setSelectedSkills] = useState(initialSelectedSkills);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleSkill = (skill) => {
        let newSkills;
        if (multiple) {
            newSkills = selectedSkills.includes(skill)
                ? selectedSkills.filter((s) => s !== skill)
                : [...selectedSkills, skill];
        } else {
            newSkills = selectedSkills.includes(skill) ? [] : [skill];
        }

        setSelectedSkills(newSkills);
        if (onSkillsChange) {
            onSkillsChange(newSkills);
        }
    };

    const removeSkill = (skill) => {
        const newSkills = selectedSkills.filter((s) => s !== skill);
        setSelectedSkills(newSkills);
        if (onSkillsChange) {
            onSkillsChange(newSkills);
        }
    };

    const filteredSkills = volunteerSkills.filter((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="mb-6" ref={dropdownRef}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                <button
                    type="button"
                    className={`relative w-full bg-white border ${
                        isOpen
                            ? "border-blue-500 ring-2 ring-blue-200"
                            : "border-gray-300"
                    } rounded-lg shadow-sm pl-3 pr-10 py-3 text-left cursor-default focus:outline-none transition-all duration-150`}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                >
                    <div className="flex flex-wrap gap-2 min-h-[40px] items-center">
                        {selectedSkills.length > 0 ? (
                            selectedSkills.map((skill) => (
                                <span
                                    key={skill}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-500">
                                Select skills...
                            </span>
                        )}
                    </div>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg
                            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                                isOpen ? "transform rotate-180" : ""
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </span>
                </button>

                {isOpen && (
                    <div
                        className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                        style={{
                            maxHeight: maxHeight,
                            minHeight: minHeight,
                        }}
                    >
                        <div className="p-3">
                            {selectedSkills.length > 0 && (
                                <div className="w-full mb-3">
                                    <span className="text-xs font-medium text-gray-500">
                                        Selected skills:
                                    </span>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {selectedSkills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                            >
                                                {skill}
                                                <button
                                                    type="button"
                                                    className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeSkill(skill);
                                                    }}
                                                    aria-label={`Remove ${skill}`}
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="w-full">
                                <input
                                    type="text"
                                    placeholder="Search skills..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
                                    onClick={(e) => e.stopPropagation()}
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />

                                <div
                                    className="overflow-y-auto"
                                    style={{
                                        maxHeight: `calc(${maxHeight} - 150px)`,
                                    }}
                                >
                                    {filteredSkills.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {filteredSkills.map((skill) => (
                                                <div
                                                    key={skill}
                                                    className={`px-3 py-2 text-sm cursor-default select-none rounded-md transition-colors duration-100 flex items-center ${
                                                        selectedSkills.includes(
                                                            skill
                                                        )
                                                            ? "bg-blue-50 text-blue-800"
                                                            : "hover:bg-gray-50 text-gray-700"
                                                    }`}
                                                    onClick={() =>
                                                        toggleSkill(skill)
                                                    }
                                                >
                                                    <input
                                                        type={
                                                            multiple
                                                                ? "checkbox"
                                                                : "radio"
                                                        }
                                                        checked={selectedSkills.includes(
                                                            skill
                                                        )}
                                                        readOnly
                                                        className={`h-4 w-4 ${
                                                            multiple
                                                                ? "rounded text-blue-600 focus:ring-blue-500"
                                                                : "rounded-full text-blue-600 focus:ring-blue-500"
                                                        } border-gray-300`}
                                                    />
                                                    <span className="ml-2 truncate">
                                                        {skill}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 text-gray-500">
                                            No skills found matching your search
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VolunteerSkillsDropdown;
