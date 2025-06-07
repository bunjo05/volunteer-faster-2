import { useState } from "react";
import GeneralPages from "@/Layouts/GeneralPages";
import { usePage } from "@inertiajs/react"; // Add this import
import { useForm } from "@inertiajs/react";

import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import Checkbox from "@/Components/Checkbox";
import PrimaryButton from "@/Components/PrimaryButton";

import Modal from "@/Components/Modal"; // Assuming you have a Modal component

export default function Booking({ project, auth, canResetPassword }) {
    const [step, setStep] = useState(1);
    const [emailVerified, setEmailVerified] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [sentCode, setSentCode] = useState("");
    const [showVerificationInput, setShowVerificationInput] = useState(false);
    const [emailExists, setEmailExists] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const { url } = usePage(); // Get current URL

    const { data, setData, post, errors, processing, fullData, reset } =
        useForm({
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
            project_id: project.id,
            booking_status: "Pending",
        });

    const [isSendingCode, setIsSendingCode] = useState(false);

    const handleShowLoginModal = () => {
        setShowLoginModal(true);
        // Store the current URL in session storage
        sessionStorage.setItem(
            "preLoginUrl",
            window.location.pathname + window.location.search
        );
    };

    const LoginSubmit = (e) => {
        e.preventDefault();

        const preLoginUrl =
            sessionStorage.getItem("preLoginUrl") || window.location.pathname;

        post(route("login"), {
            preserveState: true,
            preserveScroll: true,
            data: {
                email: data.email,
                password: data.password,
                remember: data.remember,
                redirect_to: preLoginUrl,
            },
            onSuccess: () => {
                setShowLoginModal(false);
                sessionStorage.removeItem("preLoginUrl");
                // Use Inertia's reload instead of window.location.reload()
                window.location.href = preLoginUrl;
            },
            onError: (errors) => {
                console.error("Login failed:", errors);
            },
        });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const sendVerificationCode = async () => {
        setIsSendingCode(true);
        setEmailExists(false); // Reset email exists error

        try {
            const response = await axios.post("/check-email-exists", {
                email: data.email,
            });

            if (response.data.exists) {
                setEmailExists(true);
                return;
            }

            // Call your backend logic here (e.g., axios.post or Inertia.post)
            await axios.post("/send-verification-code", { email: data.email });

            // Optionally show input for code
            setShowVerificationInput(true);
        } catch (error) {
            console.error("Failed to send code:", error);
            if (error.response && error.response.status === 422) {
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
                alert("Email verified successfully.");
            } else {
                alert("Incorrect verification code.");
            }
        } catch (error) {
            console.error(error);
            alert("Error verifying code.");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (auth?.user) {
            const payload = {
                start_date: data.start_date,
                end_date: data.end_date,
                number_of_travellers: data.number_of_travellers,
                message: data.message,
                project_id: project.id,
            };
            post(route("auth.volunteer.booking.store"), {
                data: payload,
                onSuccess: () => console.log("Booking successful"),
            });
        } else {
            post(route("volunteer.booking.store"), {
                data: fullData,
                onSuccess: () =>
                    console.log("Booking + Registration successful"),
            });
        }
    };

    return (
        <GeneralPages auth={auth}>
            <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
                {/* Floating error badge */}
                {Object.keys(errors).length > 0 && (
                    <div className="fixed top-5 right-5 z-50 bg-red-500 text-white px-4 py-2 rounded shadow-lg animate-fade-in-out">
                        <div className="list-disc pl-5">
                            {Object.values(errors).map((error, index) => (
                                <p key={index}>{error}</p>
                            ))}
                        </div>
                    </div>
                )}

                <h2 className="text-2xl font-semibold mb-4 text-center">
                    Booking for{" "}
                    <span className="text-indigo-600">{project.title}</span>
                </h2>

                {/* Step Progress Indicator */}
                <div>
                    {auth?.user ? (
                        <>
                            <form
                                onSubmit={handleSubmit}
                                encType="multipart/form-data"
                            >
                                <h3 className="text-lg font-bold mb-4">
                                    Step 3: Booking Details
                                </h3>
                                <div className="mb-4">
                                    <label className="block text-gray-700">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        name="start_date"
                                        value={data.start_date}
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        onChange={(e) =>
                                            setData(
                                                "start_date",
                                                e.target.value
                                            )
                                        }
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        name="end_date"
                                        value={data.end_date}
                                        onChange={(e) =>
                                            setData("end_date", e.target.value)
                                        }
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">
                                        Number of Travellers
                                    </label>
                                    <input
                                        type="number"
                                        name="number_of_travellers"
                                        value={data.number_of_travellers}
                                        onChange={(e) =>
                                            setData(
                                                "number_of_travellers",
                                                e.target.value
                                            )
                                        }
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">
                                        Message to Admin
                                    </label>
                                    <textarea
                                        name="message"
                                        value={data.message}
                                        onChange={(e) =>
                                            setData("message", e.target.value)
                                        }
                                        className="w-full p-2 border rounded"
                                        rows="3"
                                        placeholder="Optional message..."
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ml-auto"
                                >
                                    Submit Booking
                                </button>
                            </form>
                        </>
                    ) : (
                        <section>
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
                                            <div className="w-10 h-1 bg-gray-300 mx-2 rounded-full relative">
                                                <div
                                                    className={`absolute h-full top-0 left-0 rounded-full transition-all duration-300 ${
                                                        step > s
                                                            ? "bg-green-500 w-full"
                                                            : "bg-indigo-600 w-0"
                                                    }`}
                                                ></div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                encType="multipart/form-data"
                            >
                                {/* STEP 1 */}
                                {step === 1 && (
                                    <div>
                                        <h3 className="text-lg font-bold mb-4">
                                            Step 1: Personal Info
                                        </h3>

                                        {/* Email */}
                                        <div className="mb-4 relative">
                                            <label className="block text-gray-700">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                onChange={(e) => {
                                                    setData(
                                                        "email",
                                                        e.target.value
                                                    );
                                                    setEmailExists(false); // Reset when typing
                                                }}
                                                className="w-full p-2 border rounded pr-28"
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
                                                        className="text-indigo-600 underline hover:text-indigo-800"
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
                                                    className={`absolute right-2 top-8 text-sm px-2 py-1 rounded transition ${
                                                        isSendingCode
                                                            ? "bg-gray-400 cursor-not-allowed"
                                                            : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                                    }`}
                                                >
                                                    {isSendingCode ? (
                                                        <span className="flex items-center gap-1">
                                                            <svg
                                                                className="animate-spin h-4 w-4 text-white"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <circle
                                                                    className="opacity-25"
                                                                    cx="12"
                                                                    cy="12"
                                                                    r="10"
                                                                    stroke="currentColor"
                                                                    strokeWidth="4"
                                                                ></circle>
                                                                <path
                                                                    className="opacity-75"
                                                                    fill="currentColor"
                                                                    d="M4 12a8 8 0 018-8v8z"
                                                                ></path>
                                                            </svg>
                                                            Sending...
                                                        </span>
                                                    ) : (
                                                        "Send Code"
                                                    )}
                                                </button>
                                            )}
                                            {emailVerified && (
                                                <span className="absolute right-2 top-8 text-green-600 text-xl font-bold">
                                                    ✔
                                                </span>
                                            )}
                                        </div>

                                        {/* Code Verification */}
                                        {showVerificationInput &&
                                            !emailVerified && (
                                                <div className="mb-4">
                                                    <label className="block text-gray-700">
                                                        Enter Verification Code
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={verificationCode}
                                                        onChange={(e) =>
                                                            setVerificationCode(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full p-2 border rounded"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={verifyCode}
                                                        className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                                    >
                                                        Verify Email
                                                    </button>
                                                </div>
                                            )}

                                        {/* Rest of form after email verified */}
                                        {emailVerified && (
                                            <>
                                                <div className="mb-4">
                                                    <label className="block text-gray-700">
                                                        Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        value={data.password}
                                                        onChange={(e) =>
                                                            setData(
                                                                "password",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full p-2 border rounded"
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label className="block text-gray-700">
                                                        Confirm Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="confirmPassword"
                                                        value={
                                                            data.confirmPassword
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "confirmPassword",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full p-2 border rounded"
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label className="block text-gray-700">
                                                        Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={data.name}
                                                        onChange={(e) =>
                                                            setData(
                                                                "name",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full p-2 border rounded"
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label className="block text-gray-700">
                                                        Gender
                                                    </label>
                                                    <select
                                                        name="gender"
                                                        value={data.gender}
                                                        onChange={(e) =>
                                                            setData(
                                                                "gender",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full p-2 border rounded"
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
                                                <div className="mb-4">
                                                    <label className="block text-gray-700">
                                                        Date of Birth
                                                    </label>
                                                    <input
                                                        type="date"
                                                        name="dob"
                                                        value={data.dob}
                                                        onChange={(e) =>
                                                            setData(
                                                                "dob",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full p-2 border rounded"
                                                        required
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* STEP 2 */}
                                {step === 2 && (
                                    <div>
                                        <h3 className="text-lg font-bold mb-4">
                                            Step 2: Contact Info
                                        </h3>
                                        <div className="mb-4">
                                            <label className="block text-gray-700">
                                                Country
                                            </label>
                                            <input
                                                type="text"
                                                name="country"
                                                value={data.country}
                                                onChange={(e) =>
                                                    setData(
                                                        "country",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full p-2 border rounded"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700">
                                                Address
                                            </label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={data.address}
                                                onChange={(e) =>
                                                    setData(
                                                        "address",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full p-2 border rounded"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={data.city}
                                                onChange={(e) =>
                                                    setData(
                                                        "city",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full p-2 border rounded"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700">
                                                Postal Code / Zip code
                                            </label>
                                            <input
                                                type="text"
                                                name="postal"
                                                value={data.postal}
                                                onChange={(e) =>
                                                    setData(
                                                        "postal",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full p-2 border rounded"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700">
                                                Phone
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={data.phone}
                                                onChange={(e) =>
                                                    setData(
                                                        "phone",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full p-2 border rounded"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* STEP 3 */}
                                {step === 3 && (
                                    <div>
                                        <h3 className="text-lg font-bold mb-4">
                                            Step 3: Booking Details
                                        </h3>
                                        <div className="mb-4">
                                            <label className="block text-gray-700">
                                                Start Date
                                            </label>
                                            <input
                                                type="date"
                                                name="start_date"
                                                value={data.start_date}
                                                onChange={(e) =>
                                                    setData(
                                                        "start_date",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full p-2 border rounded"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700">
                                                End Date
                                            </label>
                                            <input
                                                type="date"
                                                name="end_date"
                                                value={data.end_date}
                                                onChange={(e) =>
                                                    setData(
                                                        "end_date",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full p-2 border rounded"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700">
                                                Number of Travellers
                                            </label>
                                            <input
                                                type="number"
                                                name="number_of_travellers"
                                                value={
                                                    data.number_of_travellers
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "number_of_travellers",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full p-2 border rounded"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700">
                                                Message to Admin
                                            </label>
                                            <textarea
                                                name="message"
                                                value={data.message}
                                                onChange={(e) =>
                                                    setData(
                                                        "message",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full p-2 border rounded"
                                                rows="3"
                                                placeholder="Optional message..."
                                            ></textarea>
                                        </div>
                                    </div>
                                )}

                                {/* Buttons */}
                                <div className="mt-6 flex justify-between">
                                    {step > 1 && (
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                        >
                                            Back
                                        </button>
                                    )}
                                    {step < 3 ? (
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 ml-auto"
                                            disabled={
                                                step === 1 && !emailVerified
                                            }
                                        >
                                            Next
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ml-auto"
                                        >
                                            Submit Booking
                                        </button>
                                    )}
                                </div>
                            </form>
                        </section>
                    )}
                </div>
            </div>

            {/* Login Modal */}
            <Modal
                show={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            >
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Login</h2>
                    <form onSubmit={LoginSubmit}>
                        <div>
                            <InputLabel htmlFor="email" value="Email" />

                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />

                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="password" value="Password" />

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="current-password"
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                            />

                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4 block">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                />
                                <span className="ms-2 text-sm text-gray-600">
                                    Remember me
                                </span>
                            </label>
                        </div>

                        <div className="mt-4 flex items-center justify-end">
                            {canResetPassword && (
                                <Link
                                    href={route("password.request")}
                                    className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Forgot your password?
                                </Link>
                            )}

                            <PrimaryButton
                                className="ms-4"
                                disabled={processing}
                            >
                                Log in
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </GeneralPages>
    );
}
