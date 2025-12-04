import VolunteerLayout from "@/Layouts/VolunteerLayout";
import { useState, useRef } from "react";
import { usePage, useForm, router } from "@inertiajs/react";
import {
    Settings,
    Lock,
    Mail,
    Bell,
    User,
    Shield,
    Eye,
    EyeOff,
    CheckCircle,
    AlertCircle,
    XCircle,
    Save,
    X,
    Key,
    Smartphone,
    Globe,
    LogOut,
    Trash2,
    ShieldCheck,
    Check,
    Copy,
} from "lucide-react";

// Reusable form components
const FormInput = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    error,
    className = "",
    icon,
    required = false,
    disabled = false,
    ...props
}) => (
    <div className="form-control w-full">
        <label className="label">
            <span className="label-text">
                {label}
                {required && <span className="text-error ml-1">*</span>}
            </span>
        </label>
        <div className="relative">
            {icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {icon}
                </div>
            )}
            <input
                type={type}
                name={name}
                value={value || ""}
                onChange={onChange}
                disabled={disabled}
                className={`input input-bordered w-full ${
                    icon ? "pl-10" : ""
                } ${className} ${error ? "input-error" : ""}`}
                {...props}
            />
        </div>
        {error && (
            <label className="label">
                <span className="label-text-alt text-error">{error}</span>
            </label>
        )}
    </div>
);

const FormSelect = ({
    label,
    name,
    value,
    onChange,
    error,
    options,
    className = "",
    icon,
    required = false,
    disabled = false,
}) => (
    <div className="form-control w-full">
        <label className="label">
            <span className="label-text">
                {label}
                {required && <span className="text-error ml-1">*</span>}
            </span>
        </label>
        <div className="relative">
            {icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {icon}
                </div>
            )}
            <select
                name={name}
                value={value || ""}
                onChange={onChange}
                disabled={disabled}
                className={`select select-bordered w-full ${
                    icon ? "pl-10" : ""
                } ${className} ${error ? "select-error" : ""}`}
            >
                <option value="">Select an option</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
        {error && (
            <label className="label">
                <span className="label-text-alt text-error">{error}</span>
            </label>
        )}
    </div>
);

const FormCheckbox = ({
    label,
    name,
    checked,
    onChange,
    error,
    description = "",
    disabled = false,
}) => (
    <div className="form-control">
        <label className="label cursor-pointer justify-start gap-3">
            <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className="checkbox checkbox-primary"
            />
            <div className="label-text">
                <span className="font-medium">{label}</span>
                {description && (
                    <p className="text-sm text-base-content/60 mt-1">
                        {description}
                    </p>
                )}
            </div>
        </label>
        {error && (
            <label className="label">
                <span className="label-text-alt text-error">{error}</span>
            </label>
        )}
    </div>
);

const SettingsCard = ({ title, children, className = "", icon }) => (
    <div
        className={`card bg-base-100 shadow-sm border border-base-300 ${className}`}
    >
        <div className="card-body p-6">
            <div className="flex items-center gap-3 mb-6">
                {icon && <div className="text-primary">{icon}</div>}
                <h3 className="card-title text-lg">{title}</h3>
            </div>
            {children}
        </div>
    </div>
);

const SectionDivider = ({ title }) => (
    <div className="flex items-center my-6">
        <div className="flex-1 h-px bg-base-300"></div>
        <h3 className="px-4 text-sm font-semibold text-base-content/60 uppercase tracking-wider">
            {title}
        </h3>
        <div className="flex-1 h-px bg-base-300"></div>
    </div>
);

export default function SettingsPage({ auth }) {
    const { errors, flash } = usePage().props;
    const [activeTab, setActiveTab] = useState("account");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showEmailCode, setShowEmailCode] = useState(false);
    const [deactivateConfirm, setDeactivateConfirm] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [copied, setCopied] = useState(false);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    // Email change form
    const {
        data: emailData,
        setData: setEmailData,
        post: emailPost,
        processing: emailProcessing,
        reset: resetEmail,
        errors: emailErrors,
    } = useForm({
        email: auth.user.email,
        current_password: "",
    });

    // Password change form
    const {
        data: passwordData,
        setData: setPasswordData,
        post: passwordPost,
        processing: passwordProcessing,
        reset: resetPassword,
        errors: passwordErrors,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    // Handle email change
    const handleEmailSubmit = (e) => {
        e.preventDefault();
        emailPost(route("volunteer.settings.update-email"), {
            preserveScroll: true,
            onSuccess: () => {
                resetEmail();
                setShowEmailCode(false);
            },
        });
    };

    // Handle password change
    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        passwordPost(route("volunteer.settings.change-password"), {
            preserveScroll: true,
            onSuccess: () => resetPassword(),
        });
    };

    // Handle account deactivation
    const handleDeactivateAccount = () => {
        if (!deactivateConfirm) {
            setDeactivateConfirm(true);
            return;
        }

        router.post(
            route("volunteer.settings.deactivate-account"),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDeactivateConfirm(false);
                },
            }
        );
    };

    // Handle account deletion
    // const handleDeleteAccount = () => {
    //     if (!deleteConfirm) {
    //         setDeleteConfirm(true);
    //         return;
    //     }

    //     router.delete(route("profile.destroy"), {
    //         preserveScroll: true,
    //         onBefore: () =>
    //             confirm(
    //                 "Are you sure you want to delete your account? This action cannot be undone."
    //             ),
    //     });
    // };

    const tabs = [
        { id: "account", label: "Account", icon: <User className="w-4 h-4" /> },
        {
            id: "security",
            label: "Security",
            icon: <Lock className="w-4 h-4" />,
        },

        // {
        //     id: "danger",
        //     label: "Danger Zone",
        //     icon: <AlertCircle className="w-4 h-4" />,
        // },
    ];

    return (
        <VolunteerLayout auth={auth}>
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Settings
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Manage your account settings and preferences
                        </p>
                    </div>

                    {/* Success/Error Messages */}
                    {flash.success && (
                        <div className="alert alert-success mb-6">
                            <CheckCircle className="w-5 h-5" />
                            <span>{flash.success}</span>
                        </div>
                    )}

                    {flash.error && (
                        <div className="alert alert-error mb-6">
                            <XCircle className="w-5 h-5" />
                            <span>{flash.error}</span>
                        </div>
                    )}

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Navigation */}
                        <div className="lg:w-1/4">
                            <div className="card bg-base-100 shadow-sm border border-base-300">
                                <div className="card-body p-4">
                                    <nav className="space-y-1">
                                        {tabs.map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() =>
                                                    setActiveTab(tab.id)
                                                }
                                                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
                                                    activeTab === tab.id
                                                        ? "bg-primary text-primary-content"
                                                        : "hover:bg-base-200"
                                                }`}
                                            >
                                                {tab.icon}
                                                <span className="font-medium">
                                                    {tab.label}
                                                </span>
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:w-3/4 space-y-6">
                            {/* Account Settings */}
                            {activeTab === "account" && (
                                <>
                                    <SettingsCard
                                        title="Email Address"
                                        icon={<Mail className="w-5 h-5" />}
                                    >
                                        <form
                                            onSubmit={handleEmailSubmit}
                                            className="space-y-4"
                                        >
                                            <FormInput
                                                label="Current Email"
                                                type="email"
                                                value={auth.user.email}
                                                disabled
                                                icon={
                                                    <Mail className="w-4 h-4" />
                                                }
                                            />

                                            <FormInput
                                                label="New Email Address"
                                                type="email"
                                                name="email"
                                                value={emailData.email}
                                                onChange={(e) =>
                                                    setEmailData(
                                                        "email",
                                                        e.target.value
                                                    )
                                                }
                                                error={emailErrors.email}
                                                icon={
                                                    <Mail className="w-4 h-4" />
                                                }
                                                required
                                            />

                                            <FormInput
                                                label="Current Password"
                                                type={
                                                    showEmailCode
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="current_password"
                                                value={
                                                    emailData.current_password
                                                }
                                                onChange={(e) =>
                                                    setEmailData(
                                                        "current_password",
                                                        e.target.value
                                                    )
                                                }
                                                error={
                                                    emailErrors.current_password
                                                }
                                                icon={
                                                    <Lock className="w-4 h-4" />
                                                }
                                                required
                                                endAdornment={
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowEmailCode(
                                                                !showEmailCode
                                                            )
                                                        }
                                                        className="btn btn-ghost btn-sm"
                                                    >
                                                        {showEmailCode ? (
                                                            <EyeOff className="w-4 h-4" />
                                                        ) : (
                                                            <Eye className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                }
                                            />

                                            <div className="flex gap-3 pt-4">
                                                <button
                                                    type="submit"
                                                    disabled={emailProcessing}
                                                    className="btn btn-primary gap-2"
                                                >
                                                    {emailProcessing ? (
                                                        <>
                                                            <span className="loading loading-spinner"></span>
                                                            Updating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save className="w-4 h-4" />
                                                            Update Email
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={resetEmail}
                                                    className="btn btn-outline"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </SettingsCard>
                                </>
                            )}

                            {/* Security Settings */}
                            {activeTab === "security" && (
                                <>
                                    <SettingsCard
                                        title="Change Password"
                                        icon={<Lock className="w-5 h-5" />}
                                    >
                                        <form
                                            onSubmit={handlePasswordSubmit}
                                            className="space-y-4"
                                        >
                                            <FormInput
                                                label="Current Password"
                                                type={
                                                    showCurrentPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="current_password"
                                                value={
                                                    passwordData.current_password
                                                }
                                                onChange={(e) =>
                                                    setPasswordData(
                                                        "current_password",
                                                        e.target.value
                                                    )
                                                }
                                                error={
                                                    passwordErrors.current_password
                                                }
                                                icon={
                                                    <Lock className="w-4 h-4" />
                                                }
                                                required
                                                endAdornment={
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowCurrentPassword(
                                                                !showCurrentPassword
                                                            )
                                                        }
                                                        className="btn btn-ghost btn-sm"
                                                    >
                                                        {showCurrentPassword ? (
                                                            <EyeOff className="w-4 h-4" />
                                                        ) : (
                                                            <Eye className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                }
                                            />

                                            <FormInput
                                                label="New Password"
                                                type={
                                                    showNewPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="password"
                                                value={passwordData.password}
                                                onChange={(e) =>
                                                    setPasswordData(
                                                        "password",
                                                        e.target.value
                                                    )
                                                }
                                                error={passwordErrors.password}
                                                icon={
                                                    <Key className="w-4 h-4" />
                                                }
                                                required
                                                endAdornment={
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowNewPassword(
                                                                !showNewPassword
                                                            )
                                                        }
                                                        className="btn btn-ghost btn-sm"
                                                    >
                                                        {showNewPassword ? (
                                                            <EyeOff className="w-4 h-4" />
                                                        ) : (
                                                            <Eye className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                }
                                            />

                                            <FormInput
                                                label="Confirm New Password"
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="password_confirmation"
                                                value={
                                                    passwordData.password_confirmation
                                                }
                                                onChange={(e) =>
                                                    setPasswordData(
                                                        "password_confirmation",
                                                        e.target.value
                                                    )
                                                }
                                                error={
                                                    passwordErrors.password_confirmation
                                                }
                                                icon={
                                                    <Key className="w-4 h-4" />
                                                }
                                                required
                                                endAdornment={
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowConfirmPassword(
                                                                !showConfirmPassword
                                                            )
                                                        }
                                                        className="btn btn-ghost btn-sm"
                                                    >
                                                        {showConfirmPassword ? (
                                                            <EyeOff className="w-4 h-4" />
                                                        ) : (
                                                            <Eye className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                }
                                            />

                                            <div className="flex gap-3 pt-4">
                                                <button
                                                    type="submit"
                                                    disabled={
                                                        passwordProcessing
                                                    }
                                                    className="btn btn-primary gap-2"
                                                >
                                                    {passwordProcessing ? (
                                                        <>
                                                            <span className="loading loading-spinner"></span>
                                                            Updating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save className="w-4 h-4" />
                                                            Update Password
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={resetPassword}
                                                    className="btn btn-outline"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </SettingsCard>
                                </>
                            )}

                            {/* Danger Zone */}
                            {/* {activeTab === "danger" && (
                                <SettingsCard
                                    title="Account Management"
                                    icon={<AlertCircle className="w-5 h-5" />}
                                >
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <h4 className="font-medium text-lg text-error">
                                                Danger Zone
                                            </h4>
                                            <p className="text-base-content/60">
                                                These actions are irreversible.
                                                Please proceed with caution.
                                            </p>
                                        </div>

                                        <SectionDivider title="Account Deactivation" />

                                        <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h5 className="font-medium text-error">
                                                        Deactivate Account
                                                    </h5>
                                                    <p className="text-sm text-base-content/60 mt-1">
                                                        Temporarily disable your
                                                        account. Your data will
                                                        be preserved but you
                                                        won't be able to access
                                                        the platform until you
                                                        reactivate.
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={
                                                        handleDeactivateAccount
                                                    }
                                                    className="btn btn-error btn-outline"
                                                >
                                                    {deactivateConfirm ? (
                                                        <>
                                                            <AlertCircle className="w-4 h-4" />
                                                            Confirm Deactivation
                                                        </>
                                                    ) : (
                                                        "Deactivate Account"
                                                    )}
                                                </button>
                                            </div>
                                            {deactivateConfirm && (
                                                <div className="mt-4 p-3 bg-base-100 rounded-lg">
                                                    <p className="text-sm font-medium mb-2">
                                                        Are you sure you want to
                                                        deactivate your account?
                                                    </p>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() =>
                                                                router.post(
                                                                    route(
                                                                        "volunteer.settings.deactivate-account"
                                                                    )
                                                                )
                                                            }
                                                            className="btn btn-error btn-sm"
                                                        >
                                                            Yes, Deactivate
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                setDeactivateConfirm(
                                                                    false
                                                                )
                                                            }
                                                            className="btn btn-ghost btn-sm"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <SectionDivider title="Account Deletion" />

                                        <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h5 className="font-medium text-error">
                                                        Delete Account
                                                    </h5>
                                                    <p className="text-sm text-base-content/60 mt-1">
                                                        Permanently delete your
                                                        account and all
                                                        associated data. This
                                                        action cannot be undone.
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={
                                                        handleDeleteAccount
                                                    }
                                                    className="btn btn-error"
                                                >
                                                    {deleteConfirm ? (
                                                        <>
                                                            <Trash2 className="w-4 h-4" />
                                                            Confirm Deletion
                                                        </>
                                                    ) : (
                                                        "Delete Account"
                                                    )}
                                                </button>
                                            </div>
                                            {deleteConfirm && (
                                                <div className="mt-4 p-3 bg-base-100 rounded-lg">
                                                    <p className="text-sm font-medium mb-2 text-error">
                                                        Warning: This will
                                                        permanently delete your
                                                        account and all
                                                        associated data!
                                                    </p>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() =>
                                                                router.delete(
                                                                    route(
                                                                        "profile.destroy"
                                                                    )
                                                                )
                                                            }
                                                            className="btn btn-error btn-sm"
                                                        >
                                                            Yes, Delete Forever
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                setDeleteConfirm(
                                                                    false
                                                                )
                                                            }
                                                            className="btn btn-ghost btn-sm"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="alert alert-warning">
                                            <AlertCircle className="w-5 h-5" />
                                            <div>
                                                <h3 className="font-medium">
                                                    Important Notice
                                                </h3>
                                                <p className="text-sm">
                                                    Before taking any
                                                    irreversible actions, please
                                                    consider:
                                                </p>
                                                <ul className="text-sm list-disc list-inside mt-2 space-y-1">
                                                    <li>
                                                        Download your data first
                                                    </li>
                                                    <li>
                                                        Cancel any active
                                                        bookings
                                                    </li>
                                                    <li>
                                                        Withdraw any pending
                                                        sponsorship applications
                                                    </li>
                                                    <li>
                                                        Contact support if you
                                                        need assistance
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </SettingsCard>
                            )} */}
                        </div>
                    </div>
                </div>
            </div>
        </VolunteerLayout>
    );
}
