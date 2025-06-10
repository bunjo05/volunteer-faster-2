import { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";

export default function OtpModal({ show, onClose, email }) {
    const { data, setData, post, processing, errors } = useForm({
        email: email,
        otp: "",
    });

    const [message, setMessage] = useState("");

    const submit = (e) => {
        e.preventDefault();

        post(route("otp.verify.store"), {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                // The page will automatically refresh after successful verification
            },
            onError: (errors) => {
                if (errors.otp) {
                    setMessage(errors.otp);
                }
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose}>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
                <p className="mb-4">
                    We've sent a 6-digit code to {email}. Please enter it below:
                </p>

                <form onSubmit={submit}>
                    <div className="mb-4">
                        <label
                            htmlFor="otp"
                            className="block text-gray-700 mb-2"
                        >
                            OTP Code
                        </label>
                        <input
                            id="otp"
                            type="text"
                            className="w-full px-3 py-2 border rounded-md"
                            maxLength="6"
                            value={data.otp}
                            onChange={(e) => setData("otp", e.target.value)}
                            autoComplete="off"
                            autoFocus
                        />
                        <InputError
                            message={message || errors.otp}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex justify-between items-center mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <PrimaryButton disabled={processing}>
                            {processing ? "Verifying..." : "Verify"}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
