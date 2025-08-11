import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Register({ referralCode }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
        referral_code: referralCode || "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                {/* ✅ Role Select Dropdown */}
                <div className="mt-4">
                    <InputLabel htmlFor="role" value="Register As" />
                    <select
                        id="role"
                        name="role"
                        value={data.role}
                        onChange={(e) => setData("role", e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    >
                        <option value="">-- Select Role --</option>
                        <option value="Volunteer">Volunteer</option>
                        <option value="Organization">Organization</option>
                    </select>
                    <InputError message={errors.role} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData("email", e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData("password", e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                {/* Add Referral Code Field */}
                <div className="mt-4">
                    <InputLabel
                        htmlFor="referral_code"
                        value="Referral Code (optional)"
                    />
                    <TextInput
                        id="referral_code"
                        name="referral_code"
                        value={data.referral_code}
                        className="mt-1 block w-full"
                        onChange={(e) =>
                            setData("referral_code", e.target.value)
                        }
                    />
                    <InputError
                        message={errors.referral_code}
                        className="mt-2"
                    />
                    {data.referral_code && (
                        <p className="mt-1 text-sm text-gray-600">
                            Both you and your referrer will receive bonus points
                            after approval.
                        </p>
                    )}
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <Link
                        href={route("login")}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>

            {data.role === "Volunteer" && (
                <div>
                    <div className="flex items-center justify-between mt-4">
                        <hr className="w-full border-gray-300" />
                        <span className="mx-2 text-gray-500">or</span>
                        <hr className="w-full border-gray-300" />
                    </div>
                    <div className="flex items-center justify-center mt-4">
                        <p className="text-sm text-gray-600">register with</p>

                        <a
                            href={route("google.login")}
                            className="flex items-center justify-center ms-2 "
                        >
                            <img
                                src="/google.png"
                                alt="Google"
                                className="w-[20px] h-[20px]"
                            />
                        </a>
                    </div>
                </div>
            )}

            <div>
                <p className="mt-4 text-sm text-gray-600">
                    By registering, you agree to our{" "}
                    <Link
                        href={route("terms")}
                        className="text-gray-900 underline hover:text-gray-700"
                    >
                        Terms of Service
                    </Link>{" "}
                    ,{" "}
                    <Link
                        href={route("privacy.policy")}
                        className="text-gray-900 underline hover:text-gray-700"
                    >
                        Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <Link
                        href={route("gdpr")}
                        className="text-gray-900 underline hover:text-gray-700"
                    >
                        GDPR Compliance
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
