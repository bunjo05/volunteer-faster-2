import OrganizationLayout from "@/Layouts/OrganizationLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    KeyIcon,
    ShieldExclamationIcon,
    ShieldCheckIcon,
    EnvelopeIcon,
    BellIcon,
    TrashIcon,
    EyeIcon,
    EyeSlashIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    ArrowRightIcon,
} from "@heroicons/react/24/outline";

export default function Settings({ auth, organizationProfile }) {
    const [activeTab, setActiveTab] = useState("password");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showDeactivatePassword, setShowDeactivatePassword] = useState(false);
    const [showEmailPassword, setShowEmailPassword] = useState(false);
    const [isDeactivating, setIsDeactivating] = useState(false);
    // const [notificationSettings, setNotificationSettings] = useState({
    //     email_notifications: true,
    //     booking_notifications: true,
    //     message_notifications: true,
    //     newsletter: false,
    // });

    // Check if user is deactivated
    const isDeactivated =
        auth?.user?.is_active === 0 || auth?.user?.is_active === false;

    // Password change form
    const {
        data: passwordData,
        setData: setPasswordData,
        post: changePassword,
        processing: passwordProcessing,
        errors: passwordErrors,
        reset: resetPasswordForm,
        recentlySuccessful: passwordSuccess,
    } = useForm({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
    });

    // Email change form
    const {
        data: emailData,
        setData: setEmailData,
        post: updateEmail,
        processing: emailProcessing,
        errors: emailErrors,
        reset: resetEmailForm,
        recentlySuccessful: emailSuccess,
    } = useForm({
        current_password: "",
        new_email: "",
    });

    // Deactivation form
    const {
        data: deactivateData,
        setData: setDeactivateData,
        post: deactivateAccount,
        processing: deactivateProcessing,
        errors: deactivateErrors,
        reset: resetDeactivateForm,
    } = useForm({
        password: "",
        reason: "",
        confirm: false,
    });

    // Reactivation form
    const {
        data: reactivateData,
        setData: setReactivateData,
        post: reactivateAccount,
        processing: reactivateProcessing,
        errors: reactivateErrors,
        reset: resetReactivateForm,
        recentlySuccessful: reactivateSuccess,
    } = useForm({
        password: "",
    });

    const submitPasswordChange = (e) => {
        e.preventDefault();
        changePassword(route("organization.settings.change-password"), {
            onSuccess: () => {
                resetPasswordForm();
                setTimeout(() => {
                    const event = new CustomEvent("password-changed");
                    window.dispatchEvent(event);
                }, 100);
            },
            preserveScroll: true,
        });
    };

    const submitEmailChange = (e) => {
        e.preventDefault();
        updateEmail(route("organization.settings.update-email"), {
            onSuccess: () => resetEmailForm(),
            preserveScroll: true,
        });
    };

    const submitDeactivation = (e) => {
        e.preventDefault();
        if (
            !window.confirm(
                "Are you sure you want to deactivate your account? This action cannot be undone for 30 days."
            )
        ) {
            return;
        }
        deactivateAccount(route("organization.settings.deactivate-account"), {
            onSuccess: () => {
                // Redirect will be handled by controller
            },
            preserveScroll: true,
        });
    };

    const submitReactivation = (e) => {
        e.preventDefault();
        reactivateAccount(route("organization.settings.reactivate-account"), {
            onSuccess: () => {
                resetReactivateForm();
                // Optionally refresh the page or show a success message
            },
            preserveScroll: true,
        });
    };

    // const updateNotificationSetting = (key, value) => {
    //     setNotificationSettings((prev) => ({
    //         ...prev,
    //         [key]: value,
    //     }));

    //     // Send update to server
    //     useForm({
    //         ...notificationSettings,
    //         [key]: value,
    //     }).post(route("organization.settings.update-notifications"), {
    //         preserveScroll: true,
    //     });
    // };

    // Password strength checker
    const checkPasswordStrength = (password) => {
        if (!password)
            return { score: 0, text: "Empty", color: "text-gray-500" };

        let score = 0;
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        const strengthMap = [
            { text: "Very Weak", color: "text-red-600" },
            { text: "Weak", color: "text-red-500" },
            { text: "Fair", color: "text-yellow-500" },
            { text: "Good", color: "text-green-500" },
            { text: "Strong", color: "text-green-600" },
            { text: "Very Strong", color: "text-green-700" },
        ];

        return strengthMap[Math.min(score, strengthMap.length - 1)];
    };

    const passwordStrength = checkPasswordStrength(passwordData.new_password);

    return (
        <OrganizationLayout auth={auth}>
            <Head title="Account Settings" />

            <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Account Settings
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Manage your organization account security and
                        preferences
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="flex overflow-x-auto">
                            <button
                                onClick={() => setActiveTab("password")}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === "password"
                                        ? "border-blue-600 text-blue-700 bg-blue-50"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                <KeyIcon className="w-5 h-5" />
                                Password & Security
                            </button>
                            {/* <button
                                onClick={() => setActiveTab("notifications")}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === "notifications"
                                        ? "border-blue-600 text-blue-700 bg-blue-50"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                <BellIcon className="w-5 h-5" />
                                Notifications
                            </button> */}
                            <button
                                onClick={() => setActiveTab("email")}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === "email"
                                        ? "border-blue-600 text-blue-700 bg-blue-50"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                <EnvelopeIcon className="w-5 h-5" />
                                Email Address
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab(
                                        isDeactivated
                                            ? "reactivate"
                                            : "deactivate"
                                    );
                                    setIsDeactivating(!isDeactivated);
                                }}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab ===
                                    (isDeactivated
                                        ? "reactivate"
                                        : "deactivate")
                                        ? isDeactivated
                                            ? "border-green-600 text-green-700 bg-green-50"
                                            : "border-red-600 text-red-700 bg-red-50"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                {isDeactivated ? (
                                    <ShieldCheckIcon className="w-5 h-5" />
                                ) : (
                                    <ShieldExclamationIcon className="w-5 h-5" />
                                )}
                                {isDeactivated
                                    ? "Reactivate Account"
                                    : "Deactivate Account"}
                            </button>
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="p-6">
                        {/* Password & Security Tab */}
                        {activeTab === "password" && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Change Password
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-6">
                                        Update your password to keep your
                                        account secure
                                    </p>

                                    {passwordSuccess && (
                                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                                                <span className="text-sm font-medium text-green-800">
                                                    Password updated
                                                    successfully!
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <form
                                        onSubmit={submitPasswordChange}
                                        className="space-y-4"
                                    >
                                        {/* Current Password */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Current Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={
                                                        showCurrentPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    value={
                                                        passwordData.current_password
                                                    }
                                                    onChange={(e) =>
                                                        setPasswordData(
                                                            "current_password",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                                    placeholder="Enter your current password"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowCurrentPassword(
                                                            !showCurrentPassword
                                                        )
                                                    }
                                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showCurrentPassword ? (
                                                        <EyeSlashIcon className="w-5 h-5" />
                                                    ) : (
                                                        <EyeIcon className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>
                                            {passwordErrors.current_password && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {
                                                        passwordErrors.current_password
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        {/* New Password */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                New Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={
                                                        showNewPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    value={
                                                        passwordData.new_password
                                                    }
                                                    onChange={(e) =>
                                                        setPasswordData(
                                                            "new_password",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                                    placeholder="Enter new password"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowNewPassword(
                                                            !showNewPassword
                                                        )
                                                    }
                                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showNewPassword ? (
                                                        <EyeSlashIcon className="w-5 h-5" />
                                                    ) : (
                                                        <EyeIcon className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>
                                            {passwordData.new_password && (
                                                <div className="mt-2">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs text-gray-600">
                                                            Password strength
                                                        </span>
                                                        <span
                                                            className={`text-xs font-medium ${passwordStrength.color}`}
                                                        >
                                                            {
                                                                passwordStrength.text
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${
                                                                passwordStrength.color ===
                                                                "text-red-600"
                                                                    ? "bg-red-500"
                                                                    : passwordStrength.color ===
                                                                      "text-red-500"
                                                                    ? "bg-red-400"
                                                                    : passwordStrength.color ===
                                                                      "text-yellow-500"
                                                                    ? "bg-yellow-400"
                                                                    : passwordStrength.color ===
                                                                      "text-green-500"
                                                                    ? "bg-green-400"
                                                                    : passwordStrength.color ===
                                                                      "text-green-600"
                                                                    ? "bg-green-500"
                                                                    : "bg-green-600"
                                                            }`}
                                                            style={{
                                                                width: `${
                                                                    passwordStrength.text ===
                                                                    "Very Weak"
                                                                        ? "20%"
                                                                        : passwordStrength.text ===
                                                                          "Weak"
                                                                        ? "40%"
                                                                        : passwordStrength.text ===
                                                                          "Fair"
                                                                        ? "60%"
                                                                        : passwordStrength.text ===
                                                                          "Good"
                                                                        ? "80%"
                                                                        : "100%"
                                                                }`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            {passwordErrors.new_password && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {
                                                        passwordErrors.new_password
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        {/* Confirm New Password */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Confirm New Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={
                                                        showConfirmPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    value={
                                                        passwordData.new_password_confirmation
                                                    }
                                                    onChange={(e) =>
                                                        setPasswordData(
                                                            "new_password_confirmation",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                                    placeholder="Confirm new password"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowConfirmPassword(
                                                            !showConfirmPassword
                                                        )
                                                    }
                                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeSlashIcon className="w-5 h-5" />
                                                    ) : (
                                                        <EyeIcon className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>
                                            {passwordErrors.new_password_confirmation && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {
                                                        passwordErrors.new_password_confirmation
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                disabled={passwordProcessing}
                                                className="inline-flex justify-center items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {passwordProcessing
                                                    ? "Updating..."
                                                    : "Update Password"}
                                                <ArrowRightIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Security Tips */}
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                        <InformationCircleIcon className="w-5 h-5" />
                                        Password Security Tips
                                    </h4>
                                    <ul className="text-sm text-blue-800 space-y-2">
                                        <li className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5"></div>
                                            Use at least 8 characters with a mix
                                            of letters, numbers, and symbols
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5"></div>
                                            Avoid using personal information or
                                            common words
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5"></div>
                                            Don't reuse passwords from other
                                            accounts
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5"></div>
                                            Consider using a password manager
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {/* {activeTab === "notifications" && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Notification Preferences
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-6">
                                        Choose what notifications you want to
                                        receive
                                    </p>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div>
                                                <h4 className="font-medium text-gray-900">
                                                    Email Notifications
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    Receive important updates
                                                    via email
                                                </p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        notificationSettings.email_notifications
                                                    }
                                                    onChange={(e) =>
                                                        updateNotificationSetting(
                                                            "email_notifications",
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div>
                                                <h4 className="font-medium text-gray-900">
                                                    Booking Notifications
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    Notifications about
                                                    volunteer bookings
                                                </p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        notificationSettings.booking_notifications
                                                    }
                                                    onChange={(e) =>
                                                        updateNotificationSetting(
                                                            "booking_notifications",
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div>
                                                <h4 className="font-medium text-gray-900">
                                                    Message Notifications
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    Notifications about new
                                                    messages
                                                </p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        notificationSettings.message_notifications
                                                    }
                                                    onChange={(e) =>
                                                        updateNotificationSetting(
                                                            "message_notifications",
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div>
                                                <h4 className="font-medium text-gray-900">
                                                    Newsletter
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    Receive platform updates and
                                                    tips
                                                </p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        notificationSettings.newsletter
                                                    }
                                                    onChange={(e) =>
                                                        updateNotificationSetting(
                                                            "newsletter",
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )} */}

                        {/* Email Tab */}
                        {activeTab === "email" && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Update Email Address
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-6">
                                        Change the email address associated with
                                        your account
                                    </p>

                                    {emailSuccess && (
                                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                                                <span className="text-sm font-medium text-green-800">
                                                    Email updated successfully!
                                                    Please check your new email
                                                    for verification.
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <form
                                        onSubmit={submitEmailChange}
                                        className="space-y-4"
                                    >
                                        {/* Current Password */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Current Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={
                                                        showEmailPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    value={
                                                        emailData.current_password
                                                    }
                                                    onChange={(e) =>
                                                        setEmailData(
                                                            "current_password",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                                    placeholder="Enter your password to confirm"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowEmailPassword(
                                                            !showEmailPassword
                                                        )
                                                    }
                                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showEmailPassword ? (
                                                        <EyeSlashIcon className="w-5 h-5" />
                                                    ) : (
                                                        <EyeIcon className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>
                                            {emailErrors.current_password && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {
                                                        emailErrors.current_password
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        {/* New Email */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                New Email Address
                                            </label>
                                            <input
                                                type="email"
                                                value={emailData.new_email}
                                                onChange={(e) =>
                                                    setEmailData(
                                                        "new_email",
                                                        e.target.value
                                                    )
                                                }
                                                className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                                placeholder="Enter new email address"
                                                required
                                            />
                                            {emailErrors.new_email && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {emailErrors.new_email}
                                                </p>
                                            )}
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                disabled={emailProcessing}
                                                className="inline-flex justify-center items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {emailProcessing
                                                    ? "Updating..."
                                                    : "Update Email Address"}
                                                <ArrowRightIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Current Email Info */}
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                                    <h4 className="font-semibold text-gray-900 mb-2">
                                        Current Email
                                    </h4>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                {auth?.user?.email}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Status:{" "}
                                                {auth?.user
                                                    ?.email_verified_at ? (
                                                    <span className="text-green-600">
                                                        Verified
                                                    </span>
                                                ) : (
                                                    <span className="text-yellow-600">
                                                        Not Verified
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                        {!auth?.user?.email_verified_at && (
                                            <Link
                                                href={route(
                                                    "verification.send"
                                                )}
                                                method="post"
                                                as="button"
                                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                Resend Verification
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Deactivate Account Tab */}
                        {activeTab === "deactivate" && !isDeactivated && (
                            <div className="space-y-6">
                                <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                                    <div className="flex items-start gap-3">
                                        <ExclamationTriangleIcon className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-red-900 mb-2">
                                                Important: Read Before
                                                Deactivating
                                            </h4>
                                            <ul className="text-sm text-red-800 space-y-2">
                                                <li className="flex items-start gap-2">
                                                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5"></div>
                                                    Your account will be
                                                    deactivated immediately
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5"></div>
                                                    All your projects and
                                                    bookings will be hidden
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5"></div>
                                                    You can reactivate within 30
                                                    days by logging in
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5"></div>
                                                    After 30 days, account
                                                    deletion becomes permanent
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <form
                                    onSubmit={submitDeactivation}
                                    className="space-y-4"
                                >
                                    {/* Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Your Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={
                                                    showDeactivatePassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={deactivateData.password}
                                                onChange={(e) =>
                                                    setDeactivateData(
                                                        "password",
                                                        e.target.value
                                                    )
                                                }
                                                className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                                                placeholder="Enter your password to confirm"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowDeactivatePassword(
                                                        !showDeactivatePassword
                                                    )
                                                }
                                                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                                            >
                                                {showDeactivatePassword ? (
                                                    <EyeSlashIcon className="w-5 h-5" />
                                                ) : (
                                                    <EyeIcon className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                        {deactivateErrors.password && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {deactivateErrors.password}
                                            </p>
                                        )}
                                    </div>

                                    {/* Reason */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Reason for Deactivation
                                        </label>
                                        <textarea
                                            value={deactivateData.reason}
                                            onChange={(e) =>
                                                setDeactivateData(
                                                    "reason",
                                                    e.target.value
                                                )
                                            }
                                            className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition min-h-[100px]"
                                            placeholder="Please tell us why you're deactivating your account..."
                                            required
                                        />
                                        {deactivateErrors.reason && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {deactivateErrors.reason}
                                            </p>
                                        )}
                                    </div>

                                    {/* Confirmation */}
                                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                        <input
                                            type="checkbox"
                                            id="confirm-deactivate"
                                            checked={deactivateData.confirm}
                                            onChange={(e) =>
                                                setDeactivateData(
                                                    "confirm",
                                                    e.target.checked
                                                )
                                            }
                                            className="mt-1"
                                            required
                                        />
                                        <div>
                                            <label
                                                htmlFor="confirm-deactivate"
                                                className="text-sm font-medium text-gray-900"
                                            >
                                                I understand the consequences
                                            </label>
                                            <p className="text-sm text-gray-600 mt-1">
                                                I understand that deactivating
                                                my account will hide all my
                                                projects and bookings, and I may
                                                lose access to certain features.
                                            </p>
                                        </div>
                                    </div>
                                    {deactivateErrors.confirm && (
                                        <p className="text-sm text-red-600">
                                            {deactivateErrors.confirm}
                                        </p>
                                    )}

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={
                                                deactivateProcessing ||
                                                !deactivateData.confirm
                                            }
                                            className="inline-flex justify-center items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {deactivateProcessing ? (
                                                "Deactivating..."
                                            ) : (
                                                <>
                                                    <TrashIcon className="w-5 h-5" />
                                                    Deactivate Account
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Reactivate Account Tab */}
                        {activeTab === "reactivate" && isDeactivated && (
                            <div className="space-y-6">
                                <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                                    <div className="flex items-start gap-3">
                                        <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-green-900 mb-2">
                                                Reactivate Your Account
                                            </h4>
                                            <ul className="text-sm text-green-800 space-y-2">
                                                <li className="flex items-start gap-2">
                                                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5"></div>
                                                    Your account will be
                                                    reactivated immediately
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5"></div>
                                                    All your projects and
                                                    bookings will be restored
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5"></div>
                                                    You'll regain full access to
                                                    all features
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {reactivateSuccess && (
                                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <CheckCircleIcon className="w-5 h-5 text-green-600" />
                                            <span className="text-sm font-medium text-green-800">
                                                Account reactivated
                                                successfully!
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <form
                                    onSubmit={submitReactivation}
                                    className="space-y-4"
                                >
                                    {/* Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Your Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={
                                                    showDeactivatePassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={reactivateData.password}
                                                onChange={(e) =>
                                                    setReactivateData(
                                                        "password",
                                                        e.target.value
                                                    )
                                                }
                                                className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                                                placeholder="Enter your password to confirm reactivation"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowDeactivatePassword(
                                                        !showDeactivatePassword
                                                    )
                                                }
                                                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                                            >
                                                {showDeactivatePassword ? (
                                                    <EyeSlashIcon className="w-5 h-5" />
                                                ) : (
                                                    <EyeIcon className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                        {reactivateErrors.password && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {reactivateErrors.password}
                                            </p>
                                        )}
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={reactivateProcessing}
                                            className="inline-flex justify-center items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {reactivateProcessing ? (
                                                "Reactivating..."
                                            ) : (
                                                <>
                                                    <ShieldCheckIcon className="w-5 h-5" />
                                                    Reactivate Account
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                {/* Account Information */}
                <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                        Account Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Account ID
                            </h4>
                            <p className="text-sm text-gray-900 font-mono">
                                {auth?.user?.public_id}
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Member Since
                            </h4>
                            <p className="text-sm text-gray-900">
                                {new Date(
                                    auth?.user?.created_at
                                ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Account Status
                            </h4>
                            <div className="flex items-center gap-2">
                                <p
                                    className={`text-sm font-medium ${
                                        auth?.user?.is_active === 1
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {auth?.user?.is_active === 1
                                        ? "Active"
                                        : "Deactivated"}
                                </p>
                                {auth?.user?.is_active === 0 && (
                                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                        Deactivated
                                    </span>
                                )}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Organization
                            </h4>
                            <p className="text-sm text-gray-900">
                                {organizationProfile?.name || "Not set up"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </OrganizationLayout>
    );
}
