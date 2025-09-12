import { useState, useEffect } from "react";
import GeneralPages from "@/Layouts/GeneralPages";
import { usePage, router } from "@inertiajs/react";
import { useForm, Link } from "@inertiajs/react";

import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import Checkbox from "@/Components/Checkbox";
import PrimaryButton from "@/Components/PrimaryButton";

import OtpModal from "@/Components/OtpModal";
import Modal from "@/Components/Modal";

export default function Booking({
    project,
    auth,
    canResetPassword,
    requiresOtp = false,
}) {
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otpEmail, setOtpEmail] = useState("");
    const [step, setStep] = useState(1);
    const [emailVerified, setEmailVerified] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [showVerificationInput, setShowVerificationInput] = useState(false);
    const [emailExists, setEmailExists] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { url } = usePage();

    const [seekingSponsorship, setSeekingSponsorship] = useState(false);
    const [fundingAspects, setFundingAspects] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [numberOfDays, setNumberOfDays] = useState(0);

    const fundingOptions = [
        { id: "travel", label: "Travel" },
        { id: "accommodation", label: "Accommodation" },
        { id: "meals", label: "Meals" },
        { id: "living_expenses", label: "Living Expenses" },
        { id: "visa_fees", label: "Visa Fees" },
        { id: "project_fees", label: "Project Fees" },
    ];

    const { data, setData, post, processing, errors, reset } = useForm({
        project_public_id: project.public_id, // Add this line
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        gender: "",
        dob: "",
        country: "",
        address: "",
        city: "",
        postal: "",
        phone: "",
        start_date: "",
        end_date: "",
        number_of_travellers: "",
        message: "",
        booking_status: "Pending",
        seeking_sponsorship: false,
        aspect_needs_funding: [],
        travel: 0,
        accommodation: 0,
        meals: 0,
        living_expenses: 0,
        visa_fees: 0,
        project_fees_amount: 0,
        total_amount: 0,
        self_introduction: "",
        skills: [],
        impact: "",
        commitment: false,
        agreement: false,
        privacy: false,
        remember: false,
    });

    const [isSendingCode, setIsSendingCode] = useState(false);

    // Persist form data between steps
    useEffect(() => {
        const savedData = sessionStorage.getItem("bookingFormData");
        if (savedData && !auth?.user) {
            setData(JSON.parse(savedData));
        }
    }, []);

    useEffect(() => {
        if (!auth?.user) {
            sessionStorage.setItem("bookingFormData", JSON.stringify(data));
        }
    }, [data, auth]);

    const handleShowLoginModal = () => {
        setShowLoginModal(true);
        sessionStorage.setItem("preLoginUrl", window.location.href);
    };

    const handleLogin = (e) => {
        e.preventDefault();

        post(route("login"), {
            preserveState: true,
            onSuccess: (page) => {
                if (page.props.requiresOtp) {
                    setOtpEmail(data.email);
                    setShowOtpModal(true);
                } else {
                    setShowLoginModal(false);
                    // Reload to get updated auth state
                    router.reload();
                }
            },
            onError: (errors) => {
                console.log("Login errors:", errors);
            },
        });
    };

    const handleOtpVerification = (otp) => {
        post(route("verify.otp"), {
            email: otpEmail,
            otp: otp,
            preserveState: true,
            onSuccess: () => {
                setShowOtpModal(false);
                setShowLoginModal(false);
                router.reload();
            },
            onError: (errors) => {
                alert("Invalid OTP code");
            },
        });
    };

    const sendVerificationCode = async () => {
        setIsSendingCode(true);
        setEmailExists(false);

        try {
            const response = await axios.post(route("volunteer.email.exists"), {
                email: data.email,
            });

            if (response.data.exists) {
                setEmailExists(true);
                return;
            }

            await axios.post(route("volunteer.email.send"), {
                email: data.email,
            });

            setShowVerificationInput(true);
        } catch (error) {
            console.error("Failed to send code:", error);
            if (error.response?.status === 422) {
                setEmailExists(true);
            }
        } finally {
            setIsSendingCode(false);
        }
    };

    const verifyCode = async () => {
        try {
            const response = await axios.post(route("volunteer.email.verify"), {
                email: data.email,
                code: verificationCode,
            });

            if (response.data.success) {
                setEmailVerified(true);
                setShowVerificationInput(false);
            } else {
                alert("Incorrect verification code.");
            }
        } catch (error) {
            console.error(error);
            alert("Error verifying code.");
        }
    };

    const nextStep = () => {
        if (step === 1 && !emailVerified) return;
        setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    // Calculate number of days between dates
    useEffect(() => {
        if (data.start_date && data.end_date) {
            const start = new Date(data.start_date);
            const end = new Date(data.end_date);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setNumberOfDays(diffDays);

            if (fundingAspects.some((aspect) => aspect.id === "project_fees")) {
                const projectFeePerDay = project.fees || 0;
                const calculatedProjectFee = diffDays * projectFeePerDay;
                setData("project_fees_amount", calculatedProjectFee);

                const newTotal = fundingAspects.reduce((total, aspect) => {
                    if (aspect.id === "project_fees")
                        return total + calculatedProjectFee;
                    return total + (data[aspect.id] || 0);
                }, 0);

                setTotalAmount(newTotal);
                setData("total_amount", newTotal);
            }
        }
    }, [data.start_date, data.end_date, project.fees, fundingAspects]);

    const handleSponsorshipChange = (e) => {
        const isSeeking = e.target.checked;
        setSeekingSponsorship(isSeeking);
        setData("seeking_sponsorship", isSeeking);

        if (!isSeeking) {
            setFundingAspects([]);
            setData("aspect_needs_funding", []);
            setTotalAmount(0);
            setData("total_amount", 0);
            fundingOptions.forEach((aspect) => {
                setData(aspect.id, 0);
            });
        }
    };

    const handleAspectChange = (e, aspect) => {
        const isChecked = e.target.checked;
        let updatedAspects;

        if (isChecked) {
            updatedAspects = [...fundingAspects, aspect];
            if (
                aspect.id === "project_fees" &&
                data.start_date &&
                data.end_date
            ) {
                const projectFeePerDay = project.fees || 0;
                const calculatedProjectFee = numberOfDays * projectFeePerDay;
                setData("project_fees_amount", calculatedProjectFee);
            }
        } else {
            updatedAspects = fundingAspects.filter((a) => a.id !== aspect.id);
            setData(aspect.id, 0);
        }

        setFundingAspects(updatedAspects);
        setData(
            "aspect_needs_funding",
            updatedAspects.map((a) => a.id)
        );

        const newTotal = updatedAspects.reduce((total, aspect) => {
            if (aspect.id === "project_fees" && isChecked) {
                return total + numberOfDays * (project.fees || 0);
            }
            return total + (data[aspect.id] || 0);
        }, 0);

        setTotalAmount(newTotal);
        setData("total_amount", newTotal);
    };

    const handleAmountChange = (aspectId, amount) => {
        if (aspectId === "project_fees") return;

        const numericAmount = parseFloat(amount) || 0;
        setData(aspectId, numericAmount);

        const newTotal = fundingAspects.reduce((total, aspect) => {
            if (aspect.id === aspectId) return total + numericAmount;
            if (aspect.id === "project_fees")
                return total + numberOfDays * (project.fees || 0);
            return total + (data[aspect.id] || 0);
        }, 0);

        setTotalAmount(newTotal);
        setData("total_amount", newTotal);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (auth?.user) {
            const payload = {
                start_date: data.start_date,
                end_date: data.end_date,
                number_of_travellers: data.number_of_travellers || 1,
                message: data.message,
                project_public_id: data.project_public_id, // Make sure this is included
                booking_status: "Pending",
                seeking_sponsorship: seekingSponsorship,
                aspect_needs_funding: data.aspect_needs_funding,
                total_amount: data.total_amount,
                travel: data.travel,
                accommodation: data.accommodation,
                meals: data.meals,
                living_expenses: data.living_expenses,
                visa_fees: data.visa_fees,
                project_fees_amount: data.project_fees_amount,
                self_introduction: data.self_introduction,
                skills: data.skills,
                impact: data.impact,
                commitment: data.commitment,
                agreement: data.agreement,
                privacy: data.privacy,
            };

            post(route("auth.volunteer.booking.store"), {
                data: payload,
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    sessionStorage.removeItem("bookingFormData");
                    // Show success message or redirect
                },
                onError: (errors) => {
                    setIsSubmitting(false);
                    console.log("Booking errors:", errors);
                },
            });
        } else {
            post(route("volunteer.booking.store"), {
                data: data,
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    sessionStorage.removeItem("bookingFormData");
                    // Show success message or redirect
                },
                onError: (errors) => {
                    setIsSubmitting(false);
                    console.log("Registration errors:", errors);
                },
            });
        }
    };

    const visibleFundingOptions = fundingOptions.filter((option) => {
        if (
            project.includes?.includes("Accommodation") &&
            option.id === "accommodation"
        )
            return false;
        if (project.includes?.includes("Meals") && option.id === "meals")
            return false;
        return true;
    });

    return (
        <GeneralPages auth={auth}>
            <div className="max-w-4xl mx-auto mt-10">
                <div className="bg-white shadow-lg rounded-2xl p-8">
                    <h2 className="text-3xl font-bold text-center mb-6">
                        Booking for{" "}
                        <span className="text-indigo-600">{project.title}</span>
                    </h2>

                    {/* Error display */}
                    {Object.keys(errors).length > 0 && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            <ul className="list-disc list-inside">
                                {Object.entries(errors).map(([key, error]) => (
                                    <li key={key}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {auth?.user ? (
                        /* Authenticated user form */
                        <form onSubmit={handleSubmit} className="space-y-10">
                            {/* Volunteer Info */}
                            <section>
                                <h3 className="text-xl font-semibold border-b pb-2 mb-4">
                                    Volunteer Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full border rounded-lg px-3 py-2"
                                            value={data.start_date}
                                            onChange={(e) =>
                                                setData(
                                                    "start_date",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        {errors.start_date && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.start_date}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full border rounded-lg px-3 py-2"
                                            value={data.end_date}
                                            onChange={(e) =>
                                                setData(
                                                    "end_date",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        {errors.end_date && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.end_date}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {numberOfDays > 0 && (
                                    <div className="mt-2 text-sm text-gray-600">
                                        Duration: {numberOfDays} day
                                        {numberOfDays !== 1 ? "s" : ""}
                                        {project.fees && (
                                            <span className="ml-4">
                                                Project fee: ${project.fees}
                                                /day
                                            </span>
                                        )}
                                    </div>
                                )}
                                {/* Sponsorship Section */}
                                {project.type_of_project === "Paid" && (
                                    <section className="mt-5">
                                        <h3 className="text-xl font-semibold border-b pb-2 mb-4">
                                            Financial Sponsorship
                                        </h3>

                                        <label className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                className="h-5 w-5 text-indigo-600 border-gray-300 rounded"
                                                checked={seekingSponsorship}
                                                onChange={
                                                    handleSponsorshipChange
                                                }
                                            />
                                            <span className="font-medium">
                                                I am seeking financial
                                                sponsorship
                                            </span>
                                        </label>

                                        {seekingSponsorship && (
                                            <div className="mt-6 space-y-6">
                                                {/* Funding Aspects */}
                                                <div>
                                                    <h4 className="font-semibold mb-3">
                                                        What aspects need
                                                        funding?
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {visibleFundingOptions.map(
                                                            (aspect) => (
                                                                <div
                                                                    key={
                                                                        aspect.id
                                                                    }
                                                                    className="border rounded-lg p-3"
                                                                >
                                                                    <label className="flex items-center gap-2 font-medium">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="h-5 w-5 text-indigo-600"
                                                                            checked={fundingAspects.some(
                                                                                (
                                                                                    a
                                                                                ) =>
                                                                                    a.id ===
                                                                                    aspect.id
                                                                            )}
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                handleAspectChange(
                                                                                    e,
                                                                                    aspect
                                                                                )
                                                                            }
                                                                        />
                                                                        {
                                                                            aspect.label
                                                                        }
                                                                    </label>
                                                                    {fundingAspects.some(
                                                                        (a) =>
                                                                            a.id ===
                                                                            aspect.id
                                                                    ) && (
                                                                        <div className="mt-3">
                                                                            <label className="block text-sm">
                                                                                Amount
                                                                                needed
                                                                                ($)
                                                                            </label>
                                                                            <input
                                                                                type="number"
                                                                                className="w-full border rounded-lg px-2 py-1 mt-1"
                                                                                value={
                                                                                    data[
                                                                                        aspect
                                                                                            .id
                                                                                    ] ||
                                                                                    ""
                                                                                } // Changed from data[`${aspect.id}_amount`]
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    handleAmountChange(
                                                                                        aspect.id,
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    )
                                                                                }
                                                                                min="0"
                                                                                step="0.01"
                                                                                readOnly={
                                                                                    aspect.id ===
                                                                                    "project_fees"
                                                                                }
                                                                                style={{
                                                                                    backgroundColor:
                                                                                        aspect.id ===
                                                                                        "project_fees"
                                                                                            ? "#f3f4f6"
                                                                                            : "white",
                                                                                    cursor:
                                                                                        aspect.id ===
                                                                                        "project_fees"
                                                                                            ? "not-allowed"
                                                                                            : "auto",
                                                                                }}
                                                                            />
                                                                            {aspect.id ===
                                                                                "project_fees" &&
                                                                                numberOfDays >
                                                                                    0 && (
                                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                                        Calculated:{" "}
                                                                                        {
                                                                                            numberOfDays
                                                                                        }{" "}
                                                                                        days
                                                                                        ×
                                                                                        $
                                                                                        {project.fees ||
                                                                                            0}
                                                                                        /day
                                                                                    </p>
                                                                                )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Total */}
                                                <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                                                    <span className="font-semibold">
                                                        Total Requested:
                                                    </span>
                                                    <span className="text-2xl font-bold text-indigo-600">
                                                        $
                                                        {totalAmount.toFixed(2)}
                                                    </span>
                                                </div>

                                                {/* Personal Statement */}
                                                <div>
                                                    <label className="block font-medium mb-1">
                                                        Personal Statement
                                                    </label>
                                                    <textarea
                                                        className="w-full border rounded-lg px-3 py-2 h-28"
                                                        value={
                                                            data.self_introduction
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "self_introduction",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Introduce yourself and explain why you are passionate about this project..."
                                                        required
                                                    />
                                                </div>

                                                {/* Skills */}
                                                <div>
                                                    <label className="block font-medium mb-1">
                                                        Relevant Skills
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="w-full border rounded-lg px-3 py-2"
                                                        value={
                                                            Array.isArray(
                                                                data.skills
                                                            )
                                                                ? data.skills.join(
                                                                      ", "
                                                                  )
                                                                : data.skills
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "skills",
                                                                e.target.value
                                                                    .split(",")
                                                                    .map((s) =>
                                                                        s.trim()
                                                                    )
                                                            )
                                                        }
                                                        placeholder="List your skills separated by commas"
                                                    />
                                                </div>

                                                {/* Impact */}
                                                <div>
                                                    <label className="block font-medium mb-1">
                                                        Expected Impact
                                                    </label>
                                                    <textarea
                                                        className="w-full border rounded-lg px-3 py-2 h-24"
                                                        value={data.impact}
                                                        onChange={(e) =>
                                                            setData(
                                                                "impact",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="How do you believe you can make a difference through this opportunity?"
                                                        required
                                                    />
                                                </div>

                                                {/* Commitments */}
                                                <label className="flex items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        className="h-5 w-5 text-indigo-600 border-gray-300 rounded"
                                                        checked={
                                                            data.commitment
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "commitment",
                                                                e.target.checked
                                                            )
                                                        }
                                                    />
                                                    <span>
                                                        I commit to providing
                                                        regular updates about my
                                                        volunteer experience
                                                    </span>
                                                </label>
                                                <label className="flex items-center gap-3 relative">
                                                    <input
                                                        type="checkbox"
                                                        className="h-5 w-5 text-indigo-600 border-gray-300 rounded"
                                                        checked={data.privacy}
                                                        onChange={(e) =>
                                                            setData(
                                                                "privacy",
                                                                e.target.checked
                                                            )
                                                        }
                                                        required
                                                    />
                                                    <span>
                                                        Do you allow your
                                                        sponsorship needs to be
                                                        visible on guest/public
                                                        pages.
                                                    </span>

                                                    {/* Info icon */}
                                                    <div className="group relative inline-block ml-1">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-5 w-5 text-gray-400 cursor-help"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            />
                                                        </svg>

                                                        {/* Tooltip text */}
                                                        <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                                            Selecting this
                                                            option means your
                                                            sponsorship request
                                                            will be visible to
                                                            potential corporate
                                                            sponsors browsing
                                                            our platform. This
                                                            increases your
                                                            chances of getting
                                                            funded.
                                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-gray-800 border-t-gray-800 border-r-transparent border-b-transparent border-l-transparent"></div>
                                                        </div>
                                                    </div>
                                                </label>

                                                <label className="flex items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        className="h-5 w-5 text-indigo-600 border-gray-300 rounded"
                                                        checked={data.agreement}
                                                        onChange={(e) =>
                                                            setData(
                                                                "agreement",
                                                                e.target.checked
                                                            )
                                                        }
                                                        required
                                                    />
                                                    <span>
                                                        I agree to the terms and
                                                        conditions of
                                                        sponsorship
                                                    </span>
                                                </label>
                                            </div>
                                        )}
                                    </section>
                                )}
                                {/* {!seekingSponsorship && ( */}
                                <div className="mt-4">
                                    <label className="block text-sm font-medium mb-1">
                                        Number of Travellers
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full border rounded-lg px-3 py-2"
                                        value={data.number_of_travellers}
                                        onChange={(e) =>
                                            setData(
                                                "number_of_travellers",
                                                e.target.value
                                            )
                                        }
                                    />
                                    {errors.number_of_travellers && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.number_of_travellers}
                                        </p>
                                    )}
                                </div>
                                {/* // )} */}
                                <div className="mt-4">
                                    <label className="block text-sm font-medium mb-1">
                                        Message to Organization
                                    </label>
                                    <textarea
                                        className="w-full border rounded-lg px-3 py-2 h-28"
                                        value={data.message}
                                        onChange={(e) =>
                                            setData("message", e.target.value)
                                        }
                                        placeholder="Tell the organization why you're interested in volunteering..."
                                    />
                                    {errors.message && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.message}
                                        </p>
                                    )}
                                </div>
                            </section>

                            {/* Submit */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 disabled:opacity-50"
                                    disabled={processing}
                                >
                                    {processing
                                        ? "Submitting..."
                                        : "Submit Application"}
                                </button>
                            </div>
                        </form>
                    ) : (
                        /* Non-authenticated user multi-step form */
                        <div>
                            {/* Step progress indicator */}
                            <div className="flex items-center justify-center mb-8">
                                {[1, 2, 3].map((s) => (
                                    <div key={s} className="flex items-center">
                                        <div
                                            className={`w-10 h-10 flex items-center justify-center rounded-full border-2 font-bold ${
                                                step === s
                                                    ? "bg-indigo-600 text-white border-indigo-600"
                                                    : step > s
                                                    ? "bg-green-500 text-white border-green-500"
                                                    : "bg-white text-gray-600 border-gray-300"
                                            }`}
                                        >
                                            {s}
                                        </div>
                                        {s !== 3 && (
                                            <div className="w-10 h-1 bg-gray-300 mx-2"></div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={handleSubmit}>
                                {/* Step 1: Personal Info */}
                                {step === 1 && (
                                    <div className="space-y-4">
                                        {/* Email verification section */}
                                        <div className="mb-4 relative">
                                            <label className="block text-sm font-medium mb-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => {
                                                    setData(
                                                        "email",
                                                        e.target.value
                                                    );
                                                    setEmailExists(false);
                                                }}
                                                className="w-full border rounded-lg px-3 py-2 pr-28"
                                                required
                                            />
                                            {emailExists && (
                                                <div className="text-red-500 text-sm mt-1">
                                                    Email already exists. Please{" "}
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            handleShowLoginModal
                                                        }
                                                        className="text-indigo-600 underline"
                                                    >
                                                        login
                                                    </button>{" "}
                                                    to continue.
                                                </div>
                                            )}
                                            {!emailVerified && !emailExists && (
                                                <button
                                                    type="button"
                                                    onClick={
                                                        sendVerificationCode
                                                    }
                                                    disabled={isSendingCode}
                                                    className="absolute right-2 top-8 text-sm px-2 py-1 bg-indigo-600 text-white rounded"
                                                >
                                                    {isSendingCode
                                                        ? "Sending..."
                                                        : "Send Code"}
                                                </button>
                                            )}
                                            {emailVerified && (
                                                <span className="absolute right-2 top-8 text-green-600 text-xl">
                                                    ✓
                                                </span>
                                            )}
                                        </div>

                                        {showVerificationInput &&
                                            !emailVerified && (
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium mb-1">
                                                        Verification Code
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={verificationCode}
                                                        onChange={(e) =>
                                                            setVerificationCode(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full border rounded-lg px-3 py-2"
                                                        placeholder="Enter code sent to your email"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={verifyCode}
                                                        className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
                                                    >
                                                        Verify Email
                                                    </button>
                                                </div>
                                            )}

                                        {emailVerified && (
                                            <>
                                                {/* Password fields */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">
                                                            Password
                                                        </label>
                                                        <input
                                                            type="password"
                                                            value={
                                                                data.password
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "password",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="w-full border rounded-lg px-3 py-2"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">
                                                            Confirm Password
                                                        </label>
                                                        <input
                                                            type="password"
                                                            value={
                                                                data.confirmPassword
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "confirmPassword",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="w-full border rounded-lg px-3 py-2"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                {/* Personal info fields */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">
                                                            Full Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={data.name}
                                                            onChange={(e) =>
                                                                setData(
                                                                    "name",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="w-full border rounded-lg px-3 py-2"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">
                                                            Gender
                                                        </label>
                                                        <select
                                                            value={data.gender}
                                                            onChange={(e) =>
                                                                setData(
                                                                    "gender",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="w-full border rounded-lg px-3 py-2"
                                                            required
                                                        >
                                                            <option value="">
                                                                Select
                                                            </option>
                                                            <option value="Male">
                                                                Male
                                                            </option>
                                                            <option value="Female">
                                                                Female
                                                            </option>
                                                            <option value="Other">
                                                                Other
                                                            </option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium mb-1">
                                                        Date of Birth
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={data.dob}
                                                        onChange={(e) =>
                                                            setData(
                                                                "dob",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full border rounded-lg px-3 py-2"
                                                        required
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* Step 2: Contact Info */}
                                {step === 2 && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">
                                                    Country
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.country}
                                                    onChange={(e) =>
                                                        setData(
                                                            "country",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full border rounded-lg px-3 py-2"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">
                                                    City
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.city}
                                                    onChange={(e) =>
                                                        setData(
                                                            "city",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full border rounded-lg px-3 py-2"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Address
                                            </label>
                                            <input
                                                type="text"
                                                value={data.address}
                                                onChange={(e) =>
                                                    setData(
                                                        "address",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border rounded-lg px-3 py-2"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">
                                                    Postal Code
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.postal}
                                                    onChange={(e) =>
                                                        setData(
                                                            "postal",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full border rounded-lg px-3 py-2"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">
                                                    Phone
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={data.phone}
                                                    onChange={(e) =>
                                                        setData(
                                                            "phone",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full border rounded-lg px-3 py-2"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Booking Details */}
                                {step === 3 && (
                                    <div className="space-y-6">
                                        {/* Date fields */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">
                                                    Start Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={data.start_date}
                                                    onChange={(e) =>
                                                        setData(
                                                            "start_date",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full border rounded-lg px-3 py-2"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">
                                                    End Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={data.end_date}
                                                    onChange={(e) =>
                                                        setData(
                                                            "end_date",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full border rounded-lg px-3 py-2"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {numberOfDays > 0 && (
                                            <div className="text-sm text-gray-600">
                                                Duration: {numberOfDays} day
                                                {numberOfDays !== 1 ? "s" : ""}
                                                {project.fees && (
                                                    <span className="ml-4">
                                                        Project fee: $
                                                        {project.fees}/day
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Sponsorship Section */}
                                        {project.type_of_project === "Paid" && (
                                            <div className="mt-6">
                                                <h4 className="text-lg font-semibold mb-4">
                                                    Financial Sponsorship
                                                </h4>

                                                <label className="flex items-center gap-3 mb-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            seekingSponsorship
                                                        }
                                                        onChange={
                                                            handleSponsorshipChange
                                                        }
                                                        className="h-5 w-5 text-indigo-600"
                                                    />
                                                    <span className="font-medium">
                                                        I am seeking financial
                                                        sponsorship
                                                    </span>
                                                </label>

                                                {seekingSponsorship && (
                                                    <div className="space-y-6 p-4 bg-gray-50 rounded-lg">
                                                        {/* Funding aspects selection */}
                                                        <div>
                                                            <h5 className="font-semibold mb-3">
                                                                Funding Needs
                                                            </h5>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                {visibleFundingOptions.map(
                                                                    (
                                                                        aspect
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                aspect.id
                                                                            }
                                                                            className="border rounded-lg p-3"
                                                                        >
                                                                            <label className="flex items-center gap-2 font-medium">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={fundingAspects.some(
                                                                                        (
                                                                                            a
                                                                                        ) =>
                                                                                            a.id ===
                                                                                            aspect.id
                                                                                    )}
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        handleAspectChange(
                                                                                            e,
                                                                                            aspect
                                                                                        )
                                                                                    }
                                                                                    className="h-5 w-5 text-indigo-600"
                                                                                />
                                                                                {
                                                                                    aspect.label
                                                                                }
                                                                            </label>

                                                                            {fundingAspects.some(
                                                                                (
                                                                                    a
                                                                                ) =>
                                                                                    a.id ===
                                                                                    aspect.id
                                                                            ) && (
                                                                                <div className="mt-3">
                                                                                    <label className="block text-sm mb-1">
                                                                                        Amount
                                                                                        needed
                                                                                        ($)
                                                                                    </label>
                                                                                    <input
                                                                                        type="number"
                                                                                        value={
                                                                                            data[
                                                                                                aspect
                                                                                                    .id
                                                                                            ] ||
                                                                                            ""
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            handleAmountChange(
                                                                                                aspect.id,
                                                                                                e
                                                                                                    .target
                                                                                                    .value
                                                                                            )
                                                                                        }
                                                                                        className="w-full border rounded px-2 py-1"
                                                                                        min="0"
                                                                                        step="0.01"
                                                                                        readOnly={
                                                                                            aspect.id ===
                                                                                            "project_fees"
                                                                                        }
                                                                                    />
                                                                                    {aspect.id ===
                                                                                        "project_fees" &&
                                                                                        numberOfDays >
                                                                                            0 && (
                                                                                            <p className="text-xs text-gray-500 mt-1">
                                                                                                Calculated:{" "}
                                                                                                {
                                                                                                    numberOfDays
                                                                                                }{" "}
                                                                                                days
                                                                                                ×
                                                                                                $
                                                                                                {project.fees ||
                                                                                                    0}
                                                                                                /day
                                                                                            </p>
                                                                                        )}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Total amount display */}
                                                        <div className="bg-white p-4 rounded border">
                                                            <div className="flex justify-between items-center">
                                                                <span className="font-semibold">
                                                                    Total
                                                                    Requested:
                                                                </span>
                                                                <span className="text-2xl font-bold text-indigo-600">
                                                                    $
                                                                    {totalAmount.toFixed(
                                                                        2
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Additional sponsorship fields */}
                                                        <div>
                                                            <label className="block font-medium mb-2">
                                                                Personal
                                                                Statement
                                                            </label>
                                                            <textarea
                                                                value={
                                                                    data.self_introduction
                                                                }
                                                                onChange={(e) =>
                                                                    setData(
                                                                        "self_introduction",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="w-full border rounded-lg px-3 py-2 h-24"
                                                                placeholder="Tell us about yourself and why you need sponsorship..."
                                                                required
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block font-medium mb-2">
                                                                Relevant Skills
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    Array.isArray(
                                                                        data.skills
                                                                    )
                                                                        ? data.skills.join(
                                                                              ", "
                                                                          )
                                                                        : data.skills
                                                                }
                                                                onChange={(e) =>
                                                                    setData(
                                                                        "skills",
                                                                        e.target.value
                                                                            .split(
                                                                                ","
                                                                            )
                                                                            .map(
                                                                                (
                                                                                    s
                                                                                ) =>
                                                                                    s.trim()
                                                                            )
                                                                    )
                                                                }
                                                                className="w-full border rounded-lg px-3 py-2"
                                                                placeholder="List your skills separated by commas"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block font-medium mb-2">
                                                                Expected Impact
                                                            </label>
                                                            <textarea
                                                                value={
                                                                    data.impact
                                                                }
                                                                onChange={(e) =>
                                                                    setData(
                                                                        "impact",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="w-full border rounded-lg px-3 py-2 h-20"
                                                                placeholder="How will this opportunity help you make a difference?"
                                                                required
                                                            />
                                                        </div>

                                                        <div className="space-y-3">
                                                            <label className="flex items-center gap-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={
                                                                        data.commitment
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setData(
                                                                            "commitment",
                                                                            e
                                                                                .target
                                                                                .checked
                                                                        )
                                                                    }
                                                                    className="h-5 w-5 text-indigo-600"
                                                                />
                                                                <span>
                                                                    I commit to
                                                                    providing
                                                                    regular
                                                                    updates
                                                                </span>
                                                            </label>

                                                            <label className="flex items-center gap-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={
                                                                        data.agreement
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setData(
                                                                            "agreement",
                                                                            e
                                                                                .target
                                                                                .checked
                                                                        )
                                                                    }
                                                                    className="h-5 w-5 text-indigo-600"
                                                                    required
                                                                />
                                                                <span>
                                                                    I agree to
                                                                    the terms
                                                                    and
                                                                    conditions
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Number of travellers */}
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Number of Travellers
                                            </label>
                                            <input
                                                type="number"
                                                value={
                                                    data.number_of_travellers
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "number_of_travellers",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border rounded-lg px-3 py-2"
                                                min="1"
                                                required
                                            />
                                        </div>

                                        {/* Message to organization */}
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Message to Organization
                                            </label>
                                            <textarea
                                                value={data.message}
                                                onChange={(e) =>
                                                    setData(
                                                        "message",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border rounded-lg px-3 py-2 h-28"
                                                placeholder="Tell the organization why you're interested in volunteering..."
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Navigation buttons */}
                                <div className="mt-8 flex justify-between">
                                    {step > 1 && (
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                        >
                                            Back
                                        </button>
                                    )}

                                    {step < 3 ? (
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            disabled={
                                                step === 1 && !emailVerified
                                            }
                                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 ml-auto"
                                        >
                                            Next
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 ml-auto"
                                        >
                                            {isSubmitting
                                                ? "Submitting..."
                                                : "Complete Booking"}
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Login Modal */}
                    <Modal
                        show={showLoginModal}
                        onClose={() => setShowLoginModal(false)}
                    >
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-4">
                                Login to Continue
                            </h2>
                            <form onSubmit={handleLogin}>
                                <div className="space-y-4">
                                    <div>
                                        <InputLabel
                                            htmlFor="login-email"
                                            value="Email"
                                        />
                                        <TextInput
                                            id="login-email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            className="w-full"
                                            required
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="login-password"
                                            value="Password"
                                        />
                                        <TextInput
                                            id="login-password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full"
                                            required
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center">
                                            <Checkbox
                                                name="remember"
                                                checked={data.remember}
                                                onChange={(e) =>
                                                    setData(
                                                        "remember",
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                            <span className="ml-2 text-sm">
                                                Remember me
                                            </span>
                                        </label>

                                        {canResetPassword && (
                                            <Link
                                                href={route("password.request")}
                                                className="text-sm text-indigo-600 hover:text-indigo-800"
                                            >
                                                Forgot password?
                                            </Link>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-center mt-4">
                                        <span className="text-gray-500 mr-2">
                                            Sign in with
                                        </span>
                                        <a
                                            href={route("google.login")}
                                            className="flex items-center justify-center"
                                        >
                                            <img
                                                src="/google.png"
                                                alt="Google"
                                                className="w-5 h-5"
                                            />
                                        </a>
                                    </div>

                                    <div className="text-center mt-4">
                                        <p className="text-sm text-gray-600">
                                            Don't have an account?{" "}
                                            <Link
                                                href={route("register")}
                                                className="text-indigo-600 hover:text-indigo-800"
                                            >
                                                Register here
                                            </Link>
                                        </p>
                                    </div>

                                    <div className="flex justify-end mt-6">
                                        <PrimaryButton disabled={processing}>
                                            {processing
                                                ? "Logging in..."
                                                : "Log in"}
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </Modal>

                    {/* OTP Modal */}
                    <OtpModal
                        show={showOtpModal}
                        onClose={() => setShowOtpModal(false)}
                        email={otpEmail}
                        onVerify={handleOtpVerification}
                    />
                </div>
            </div>
        </GeneralPages>
    );
}
