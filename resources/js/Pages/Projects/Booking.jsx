import { useState } from "react";
import GeneralPages from "@/Layouts/GeneralPages";
import { useForm } from "@inertiajs/react";

export default function Booking({ project, auth }) {
    const [step, setStep] = useState(1);
    const [emailVerified, setEmailVerified] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [sentCode, setSentCode] = useState("");
    const [showVerificationInput, setShowVerificationInput] = useState(false);

    const { data, setData, post, errors, processing } = useForm({
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
    });

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const sendVerificationCode = async (e) => {
        e.preventDefault();

        if (!data.email) {
            alert("Please enter your email first.");
            return;
        }

        try {
            const response = await axios.post(route("volunteer.email.send"), {
                email: data.email,
            });

            if (response.data.success) {
                setSentCode(response.data.code); // store the code for later comparison
                setShowVerificationInput(true);
                alert("Verification code sent to your email.");
            } else {
                alert("Failed to send verification code.");
            }
        } catch (error) {
            console.error(error);
            alert("Error sending verification code.");
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
                // user_id: auth.user.id,
            };
            // console.log(payload);
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
                                                }}
                                                className="w-full p-2 border rounded pr-28"
                                                required
                                            />
                                            {!emailVerified && (
                                                <button
                                                    type="button"
                                                    onClick={
                                                        sendVerificationCode
                                                    }
                                                    className="absolute right-2 top-8 text-sm bg-indigo-600 text-white px-2 py-1 rounded"
                                                >
                                                    Send Code
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
        </GeneralPages>
    );
}
