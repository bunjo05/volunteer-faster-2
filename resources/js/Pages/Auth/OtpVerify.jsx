import { useForm } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";

export default function OtpVerify({ email, message }) {
    const { data, setData, post, errors, processing } = useForm({
        email: email || "",
        otp: "",
    });

    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
    const [expired, setExpired] = useState(false);
    const [resendMessage, setResendMessage] = useState("");

    const otpInputs = useRef([]);

    useEffect(() => {
        if (timeLeft <= 0) {
            setExpired(true);
            return;
        }
        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0");
        const secs = (seconds % 60).toString().padStart(2, "0");
        return `${mins}:${secs}`;
    };

    const handleChange = (index, value) => {
        if (!/^\d?$/.test(value)) return; // only digits

        const otpArray = data.otp
            .split("")
            .concat(Array(6).fill(""))
            .slice(0, 6);
        otpArray[index] = value;
        const newOtp = otpArray.join("").trim();
        setData("otp", newOtp);

        if (value && index < 5) {
            otpInputs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !data.otp[index] && index > 0) {
            otpInputs.current[index - 1]?.focus();
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("otp.verify.store"));
    };

    const resendOtp = () => {
        post(route("otp.resend"), {
            onSuccess: () => {
                setTimeLeft(600);
                setExpired(false);
                setResendMessage("A new OTP has been sent to your email.");
            },
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
                <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                    Verify Your Device
                </h1>

                {message && (
                    <div className="mb-4 text-green-600 text-center font-medium">
                        {message}
                    </div>
                )}

                {resendMessage && (
                    <div className="mb-4 text-blue-600 text-center font-medium">
                        {resendMessage}
                    </div>
                )}

                {!expired && (
                    <div className="text-center text-sm text-gray-600 mb-4">
                        This code will expire in{" "}
                        <span className="font-semibold text-gray-800">
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                )}

                <form onSubmit={submit}>
                    <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                        Enter the 6-digit OTP sent to your email
                    </label>

                    {/* Elegant OTP Inputs */}
                    <div className="flex justify-center gap-3 mb-4">
                        {[...Array(6)].map((_, i) => (
                            <input
                                key={i}
                                type="text"
                                maxLength="1"
                                ref={(el) => (otpInputs.current[i] = el)}
                                value={data.otp[i] || ""}
                                onChange={(e) =>
                                    handleChange(i, e.target.value)
                                }
                                onKeyDown={(e) => handleKeyDown(i, e)}
                                className="w-12 h-14 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        ))}
                    </div>

                    {errors.otp && (
                        <div className="text-red-600 text-sm text-center mb-3">
                            {errors.otp}
                        </div>
                    )}

                    <button
                        disabled={processing}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3 rounded-lg transition duration-200"
                        type="submit"
                    >
                        Verify OTP
                    </button>
                </form>

                {expired && (
                    <p className="text-center text-sm text-gray-500 mt-6">
                        Didn't receive the code? Check your spam folder or{" "}
                        <span
                            className="text-blue-600 hover:underline cursor-pointer font-medium"
                            onClick={resendOtp}
                        >
                            resend it
                        </span>
                        .
                    </p>
                )}
            </div>
        </div>
    );
}
