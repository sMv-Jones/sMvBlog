import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import authService from "../services/auth";
import { Container, DeleteConfirmationModal, Button, Input } from "../components/index";

// Imported your exact action creator from your authSlice file
import { logout } from "../store/authSlice"; // <-- Adjust this path to match your folder structure

export default function Dashboard() {
    // Core user properties sourced from global Redux context
    const userName = useSelector((state) => state.auth?.userName);
    const email = useSelector((state) => state.auth?.userEmail);
    const userDisplayName = useSelector((state) => state.auth?.userDisplayName);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // States for password modification with OTP sequence
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordOtpSent, setPasswordOtpSent] = useState(false);
    const [passwordOtpLoading, setPasswordOtpLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState({ text: "", isError: false });

    // States for account deletion with OTP sequence
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteOtpSent, setDeleteOtpSent] = useState(false);
    const [deleteOtpLoading, setDeleteOtpLoading] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState({ text: "", isError: false });

    // Refs for individual multi-box inputs
    const passwordOtpRefs = useRef([]);
    const deleteOtpRefs = useRef([]);

    // Local memory tracking file upload image preview streams
    const [photoPreview, setPhotoPreview] = useState(null);

    // Form setups via react-hook-form
    const {
        register: registerProfile,
        handleSubmit: handleProfileSubmit,
        reset: resetProfile,
        formState: { errors: profileErrors }
    } = useForm();

    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        reset: resetPassword,
        setValue: setPasswordFormValue,
        getValues: getPasswordValues,
        formState: { errors: passwordErrors }
    } = useForm();

    const {
        register: registerDelete,
        handleSubmit: handleDeleteSubmit,
        reset: resetDelete,
        setValue: setDeleteFormValue,
    } = useForm();

    // Pull database profile configuration values on initialization
    useEffect(() => {
        async function loadProfileData() {
            if (!userName) return;
            try {
                const data = await authService.getProfile(userName);

                if (data?.success && data?.profile) {
                    setUserData(data.profile);
                    resetProfile({
                        bio: data.profile.bio || "",
                        socialLinks: data.profile.socialLinks || { github: "", linkedin: "" }
                    });
                } else {
                    console.warn("Profile payload missing or unsuccessful execution:", data?.message);
                    const fallbackData = {
                        bio: "",
                        socialLinks: { github: "", linkedin: "" },
                        displayName: userDisplayName || "User",
                        profilePhoto: "",
                        postCount: 0
                    };
                    setUserData(fallbackData);
                    resetProfile({
                        bio: fallbackData.bio,
                        socialLinks: fallbackData.socialLinks
                    });
                }
            } catch (err) {
                console.error("Failed to fetch profile:", err);
            }
        }
        loadProfileData();
    }, [userName, resetProfile, userDisplayName]);

    // Handle Input Navigation for Split Boxes
    const handleOtpChange = (e, index, refs, formKey, setValue) => {
        const val = e.target.value.replace(/\D/g, "");
        setValue(`${formKey}.${index}`, val);

        if (val && index < 5) {
            refs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (e, index, refs, formKey, setValue) => {
        if (e.key === "Backspace") {
            const currentVal = e.target.value;
            if (!currentVal && index > 0) {
                setValue(`${formKey}.${index - 1}`, "");
                refs.current[index - 1]?.focus();
            }
        }
    };

    const handleOtpPaste = (e, refs, formKey, setValue) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);

        pastedData.split("").forEach((char, index) => {
            setValue(`${formKey}.${index}`, char);
            if (refs.current[index]) {
                refs.current[index].value = char;
            }
        });

        const focusIndex = pastedData.length < 6 ? pastedData.length : 5;
        refs.current[focusIndex]?.focus();
    };

    const onProfileSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append("bio", data.bio || "");

            if (data.socialLinks) {
                Object.keys(data.socialLinks).forEach(platform => {
                    formData.append(`socialLinks[${platform}]`, data.socialLinks[platform] || "");
                });
            }

            if (data.profilePhotoFile && data.profilePhotoFile[0]) {
                formData.append("profilePhoto", data.profilePhotoFile[0]);
            }

            const response = await authService.updateProfile(formData);

            if (response?.success && response?.profile) {
                setUserData(response.profile);
                resetProfile({
                    bio: response.profile.bio || "",
                    socialLinks: response.profile.socialLinks || { github: "", linkedin: "" }
                });
                setPhotoPreview(null);
                setIsEditing(false);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleProfileCancel = () => {
        if (userData) {
            resetProfile({
                bio: userData.bio || "",
                socialLinks: userData.socialLinks || { github: "", linkedin: "" }
            });
        }
        setPhotoPreview(null);
        setIsEditing(false);
    };

    // Password Step 1: Request OTP
    const requestPasswordOtp = async () => {
        setPasswordOtpLoading(true);
        setPasswordMessage({ text: "", isError: false });
        try {
            const response = await authService.sendPasswordOtp();
            if (response?.success) {
                setPasswordOtpSent(true);
                setPasswordMessage({ text: `Verification token successfully sent to ${email}`, isError: false });
            } else {
                setPasswordMessage({ text: response?.message || "Could not dispatch verification code.", isError: true });
            }
        } catch (err) {
            console.error("OTP send failure:", err);
            setPasswordMessage({ text: "Network error while generating security framework.", isError: true });
        } finally {
            setPasswordOtpLoading(false);
        }
    };

    // Password Step 2: Finalize changes
    const onPasswordSubmit = async (data) => {
        setPasswordMessage({ text: "", isError: false });
        const rawOtp = Object.values(data.passwordOtp || {}).join("");

        if (rawOtp.length !== 6) {
            setPasswordMessage({ text: "Please complete the 6-digit verification security block.", isError: true });
            return;
        }

        try {
            const response = await authService.changePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
                otp: rawOtp
            });
            if (response?.success) {
                setPasswordMessage({ text: "Password changed successfully!", isError: false });
                resetPassword();
                setTimeout(() => {
                    setIsChangingPassword(false);
                    setPasswordOtpSent(false);
                    setPasswordMessage({ text: "", isError: false });
                }, 2000);
            } else {
                setPasswordMessage({ text: response?.message || "Current password or verification code didn't match.", isError: true });
            }
        } catch (err) {
            console.error(err);
            setPasswordMessage({ text: "Could not update password context properties at this time.", isError: true });
        }
    };

    // Deletion Step 1: Open Context Sequence UI Modal
    const openDeleteFlow = async () => {
        setIsDeleteModalOpen(true);
        setDeleteOtpLoading(true);
        setDeleteMessage({ text: "", isError: false });
        try {
            const response = await authService.sendDeleteAccountOtp();
            if (response?.success) {
                setDeleteOtpSent(true);
            } else {
                setDeleteMessage({ text: response?.message || "Unable to dispatch confirmation token.", isError: true });
            }
        } catch (err) {
            console.error("Account termination OTP handshake failed:", err);
            setDeleteMessage({ text: "Security process routing verification malfunctioned.", isError: true });
        } finally {
            setDeleteOtpLoading(false);
        }
    };

    // Deletion Step 2: Perform permanent system data cleanup, state reset & navigation
    const onDeleteSubmit = async (data) => {
        setDeleteMessage({ text: "", isError: false });
        const rawOtp = Object.values(data.deleteOtp || {}).join("");

        if (rawOtp.length !== 6) {
            setDeleteMessage({ text: "Please input the full 6-digit code sequence.", isError: true });
            return;
        }

        try {
            const response = await authService.deleteAccount({ otp: rawOtp });
            if (response?.success) {
                setIsDeleteModalOpen(false);

                // 1. Clean global Redux memory safely using your slice action
                dispatch(logout());

                // 2. Wipe explicit browser storage tokens
                localStorage.clear();
                sessionStorage.clear();

                // 3. Route cleanly back to public login gate and wipe navigation stack history
                navigate("/login", { replace: true });
            } else {
                setDeleteMessage({ text: response?.message || "Invalid code sequence. Operation aborted.", isError: true });
            }
        } catch (err) {
            console.error("Account deletion execution failure:", err);
            setDeleteMessage({ text: "Could not complete destruction routine safely.", isError: true });
        }
    };

    if (!userData) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white/40 text-base font-medium bg-neutral-950">
                Getting everything ready for you...
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 md:px-8 text-white">
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* LEFT COLUMN: LIVE PROFILE SYNC VIEW */}
                    <aside className="lg:col-span-1 rounded-3xl border border-white/10 bg-black/60 p-6 text-center lg:sticky lg:top-10 shadow-xl backdrop-blur-md">
                        <div className="relative w-40 h-40 mx-auto mb-5">
                            <img
                                src={photoPreview || userData.profilePhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80"}
                                alt="Profile Avatar"
                                className="w-full h-full object-cover rounded-full border border-white/10 p-1 bg-neutral-900"
                            />
                            {photoPreview && (
                                <span className="absolute bottom-1 right-1 bg-blue-600 text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-full shadow-lg border border-white/10">
                                    New
                                </span>
                            )}
                        </div>

                        <h1 className="text-2xl font-black tracking-tight text-white">
                            {userDisplayName || userData.displayName}
                        </h1>
                        <p className="text-blue-400 text-base font-semibold mb-1">@{userName}</p>
                        <p className="text-white/40 text-sm font-mono mb-4">{email}</p>

                        <p className="text-sm text-white/50 mb-5">
                            Member since: <span className="text-white/80 font-medium">{userData.date ? new Date(userData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Recently"}</span>
                        </p>

                        <div className="h-px bg-white/5 my-4"></div>

                        <p className="text-white/70 text-base leading-relaxed mb-6 text-left p-4 rounded-2xl bg-neutral-950/40 border border-white/5">
                            {userData.bio || <span className="text-white/30 italic">No bio written yet. Tell us a bit about yourself!</span>}
                        </p>

                        <div className="bg-neutral-950/60 border border-white/5 rounded-2xl p-4 mb-6 flex justify-between items-center">
                            <span className="text-xs text-white/40 uppercase tracking-widest font-bold">Total Posts</span>
                            <span className="text-3xl font-black text-white">{userData.postCount || userData.blogCount || 0}</span>
                        </div>

                        <div className="flex flex-wrap justify-center gap-2">
                            {['github', 'linkedin'].map((platform) => userData.socialLinks?.[platform] && (
                                <a
                                    key={platform}
                                    href={userData.socialLinks[platform]}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-4 py-2 text-sm font-semibold rounded-xl bg-neutral-950 border border-white/10 text-white/70 hover:border-blue-500/50 hover:text-blue-400 transition-all duration-200 capitalize"
                                >
                                    {platform}
                                </a>
                            ))}
                        </div>
                    </aside>

                    {/* RIGHT COLUMN: INTERACTIVE PROFILE AND SETTINGS MANAGEMENT */}
                    <main className="lg:col-span-2 space-y-6">

                        {/* PROFILE EDIT CONTAINER */}
                        <section className="rounded-3xl border border-white/10 bg-black/60 p-6 md:p-8 shadow-xl backdrop-blur-md">
                            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                                <div>
                                    <h2 className="text-xl font-black tracking-tight">Edit Profile</h2>
                                    <p className="text-sm text-white/50 mt-0.5">Update your bio, social handles, and avatar image.</p>
                                </div>
                                {!isEditing && (
                                    <Button onClick={() => setIsEditing(true)} className="text-sm py-2 px-5 font-semibold">
                                        Edit Details
                                    </Button>
                                )}
                            </div>

                            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-5" encType="multipart/form-data">
                                {/* Image Uploader */}
                                {isEditing && (
                                    <div className="bg-neutral-950/40 border border-dashed border-white/10 rounded-2xl p-4 transition-all duration-200">
                                        <label className="block text-sm font-bold text-blue-400 uppercase tracking-widest mb-2">
                                            Upload Profile Picture
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            {...registerProfile("profilePhotoFile", {
                                                onChange: (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setPhotoPreview(reader.result);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }
                                            })}
                                            className="w-full text-sm text-white/40 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border file:border-white/10 file:text-sm file:font-semibold file:bg-neutral-900 file:text-white/80 hover:file:bg-neutral-800 file:transition-colors file:cursor-pointer cursor-pointer"
                                        />
                                    </div>
                                )}

                                {/* Bio Input */}
                                <div>
                                    <label className="block text-sm font-bold text-white/50 uppercase tracking-widest mb-2">Bio</label>
                                    <textarea
                                        rows="4"
                                        disabled={!isEditing}
                                        {...registerProfile("bio", { maxLength: { value: 300, message: "Keep it under 300 characters!" } })}
                                        className="w-full bg-neutral-950/60 disabled:bg-neutral-950/20 border border-white/10 disabled:border-white/5 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-blue-500/50 text-white/90 disabled:text-white/40 placeholder-white/20 resize-none transition-all duration-200"
                                        placeholder="Write a little something about yourself..."
                                    />
                                    {profileErrors.bio && <p className="text-red-400 text-sm mt-1.5 font-medium">{profileErrors.bio.message}</p>}
                                </div>

                                <div className="h-px bg-white/5 my-4"></div>

                                {/* Social Links handles */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-white/30 uppercase tracking-widest">Social Links</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {['github', 'linkedin'].map((platform) => (
                                            <Input
                                                key={platform}
                                                label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                                                disabled={!isEditing}
                                                type="text"
                                                className="!bg-neutral-950/60 !text-white !border-white/10 focus:!bg-neutral-900 focus:!border-blue-500/50 text-base rounded-xl px-4 py-3"
                                                placeholder={`https://${platform}.com/username`}
                                                {...registerProfile(`socialLinks.${platform}`)}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                                        <button
                                            type="button"
                                            onClick={handleProfileCancel}
                                            className="px-5 py-2 text-sm font-bold text-white/50 hover:text-white transition-colors duration-200"
                                        >
                                            Cancel
                                        </button>
                                        <Button type="submit" className="text-sm py-2 px-5 font-semibold">
                                            Save Changes
                                        </Button>
                                    </div>
                                )}
                            </form>
                        </section>

                        {/* PASSWORD MODIFICATION TERMINAL */}
                        <section className="rounded-3xl border border-white/10 bg-black/60 p-6 md:p-8 shadow-xl backdrop-blur-md space-y-6">
                            <div>
                                <h2 className="text-xl font-black tracking-tight text-white">Account Settings</h2>
                                <p className="text-sm text-white/50 mt-0.5">Manage your secret access credentials and account state.</p>
                            </div>

                            {!isChangingPassword ? (
                                <div className="flex flex-wrap gap-3 items-center pt-2">
                                    <Button onClick={() => setIsChangingPassword(true)} className="text-sm py-2 px-5 font-semibold">
                                        Change Password
                                    </Button>

                                    <Button
                                        onClick={openDeleteFlow}
                                        bgColor="bg-red-950/20 hover:bg-red-950/40"
                                        textColor="text-red-400 hover:text-red-300"
                                        className="border border-red-500/20 text-sm py-2 px-5 font-semibold"
                                    >
                                        Delete Account
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4 border-t border-white/5 pt-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest">Update Password</h3>
                                    </div>

                                    <div className="max-w-md">
                                        <Input
                                            label="Current Password"
                                            type="password"
                                            disabled={passwordOtpSent && !passwordMessage.isError}
                                            className="!bg-neutral-950/60 !text-white !border-white/10 focus:!bg-neutral-900 focus:!border-blue-500/50 text-base rounded-xl px-4 py-3 disabled:opacity-40"
                                            {...registerPassword("currentPassword", { required: "Please enter your current password" })}
                                        />
                                        {passwordErrors.currentPassword && <p className="text-red-400 text-sm mt-1.5 font-medium">{passwordErrors.currentPassword.message}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                                        <div>
                                            <Input
                                                label="New Password"
                                                type="password"
                                                disabled={passwordOtpSent && !passwordMessage.isError}
                                                className="!bg-neutral-950/60 !text-white !border-white/10 focus:!bg-neutral-900 focus:!border-blue-500/50 text-base rounded-xl px-4 py-3 disabled:opacity-40"
                                                {...registerPassword("newPassword", {
                                                    required: "Please choose a new password",
                                                    minLength: { value: 8, message: "Must be at least 8 characters long" },
                                                    validate: {
                                                        hasUppercase: (value) => /[A-Z]/.test(value) || "Needs an uppercase letter",
                                                        hasLowercase: (value) => /[a-z]/.test(value) || "Needs a lowercase letter",
                                                        hasNumber: (value) => /[0-9]/.test(value) || "Needs at least one number",
                                                    }
                                                })}
                                            />
                                            {passwordErrors.newPassword && <p className="text-red-400 text-sm mt-1.5 font-medium">{passwordErrors.newPassword.message}</p>}
                                        </div>

                                        <div>
                                            <Input
                                                label="Confirm New Password"
                                                type="password"
                                                disabled={passwordOtpSent && !passwordMessage.isError}
                                                className="!bg-neutral-950/60 !text-white !border-white/10 focus:!bg-neutral-900 focus:!border-blue-500/50 text-base rounded-xl px-4 py-3 disabled:opacity-40"
                                                {...registerPassword("confirmPassword", {
                                                    required: "Please re-type your new password",
                                                    validate: (value) => value === getPasswordValues("newPassword") || "Passwords don't match"
                                                })}
                                            />
                                            {passwordErrors.confirmPassword && <p className="text-red-400 text-sm mt-1.5 font-medium">{passwordErrors.confirmPassword.message}</p>}
                                        </div>
                                    </div>

                                    {/* Inline Feedback Banner */}
                                    {passwordMessage.text && (
                                        <div className={`text-sm p-3 rounded-xl border font-medium ${passwordMessage.isError ? "bg-red-950/30 text-red-400 border-red-500/20" : "bg-emerald-950/30 text-emerald-400 border-emerald-500/20"}`}>
                                            {passwordMessage.text}
                                        </div>
                                    )}

                                    {/* Split OTP validation boxes */}
                                    {passwordOtpSent && (
                                        <div className="pt-2 animate-fadeIn max-w-sm">
                                            <label className="block text-sm font-bold text-white/50 uppercase tracking-widest mb-3">
                                                Verification Security Code
                                            </label>
                                            <div
                                                className="flex gap-2"
                                                onPaste={(e) => handleOtpPaste(e, passwordOtpRefs, "passwordOtp", setPasswordFormValue)}
                                            >
                                                {Array(6).fill(null).map((_, index) => (
                                                    <input
                                                        key={index}
                                                        type="text"
                                                        maxLength={1}
                                                        pattern="\d*"
                                                        inputMode="numeric"
                                                        {...registerPassword(`passwordOtp.${index}`, { required: true })}
                                                        ref={(el) => (passwordOtpRefs.current[index] = el)}
                                                        onChange={(e) => handleOtpChange(e, index, passwordOtpRefs, "passwordOtp", setPasswordFormValue)}
                                                        onKeyDown={(e) => handleOtpKeyDown(e, index, passwordOtpRefs, "passwordOtp", setPasswordFormValue)}
                                                        className="w-12 h-14 bg-neutral-950/60 text-white border border-white/10 focus:border-blue-500 text-center text-xl font-bold font-mono rounded-xl focus:outline-none transition-all"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsChangingPassword(false);
                                                setPasswordOtpSent(false);
                                                setPasswordMessage({ text: "", isError: false });
                                                resetPassword();
                                            }}
                                            className="px-5 py-2 text-sm font-bold text-white/50 hover:text-white transition-colors duration-200"
                                        >
                                            Cancel
                                        </button>

                                        {!passwordOtpSent ? (
                                            <Button
                                                type="button"
                                                onClick={requestPasswordOtp}
                                                disabled={passwordOtpLoading}
                                                className="text-sm py-2 px-5 font-semibold"
                                            >
                                                {passwordOtpLoading ? "Sending Code..." : "Request Verification Code"}
                                            </Button>
                                        ) : (
                                            <Button type="submit" className="text-sm py-2 px-5 font-semibold bg-blue-600 hover:bg-blue-500">
                                                Confirm Identity & Update
                                            </Button>
                                        )}
                                    </div>
                                </form>
                            )}
                        </section>

                    </main>

                </div>
            </Container>

            {/* INTEGRATED DELETE CONFIRMATION MODAL WITH SPLIT OTP ENTRY */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setDeleteOtpSent(false);
                    setDeleteMessage({ text: "", isError: false });
                    resetDelete();
                }}
                onConfirm={handleDeleteSubmit(onDeleteSubmit)}
                title="Permanently Delete Account?"
                message={
                    deleteOtpLoading
                        ? "Generating security signature and sending validation token..."
                        : "This will completely remove your personal database entries, including profile pictures, articles, and configuration details. This cannot be undone."
                }
            >
                {/* Modal Inline Error Output */}
                {deleteMessage.text && (
                    <div className="mt-4 text-sm p-3 rounded-xl bg-red-950/30 text-red-400 border border-red-500/20 text-left font-medium">
                        {deleteMessage.text}
                    </div>
                )}

                {deleteOtpSent && (
                    <div className="mt-5 space-y-4 border-t border-white/10 pt-4 text-left">
                        <label className="block text-xs font-bold text-red-400 uppercase tracking-widest">
                            Enter Security OTP Sent To Your Email
                        </label>

                        <div
                            className="flex justify-center gap-2"
                            onPaste={(e) => handleOtpPaste(e, deleteOtpRefs, "deleteOtp", setDeleteFormValue)}
                        >
                            {Array(6).fill(null).map((_, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength={1}
                                    pattern="\d*"
                                    inputMode="numeric"
                                    {...registerDelete(`deleteOtp.${index}`, { required: true })}
                                    ref={(el) => (deleteOtpRefs.current[index] = el)}
                                    onChange={(e) => handleOtpChange(e, index, deleteOtpRefs, "deleteOtp", setDeleteFormValue)}
                                    onKeyDown={(e) => handleOtpKeyDown(e, index, deleteOtpRefs, "deleteOtp", setDeleteFormValue)}
                                    className="w-12 h-14 bg-neutral-950/80 border border-red-500/20 text-white text-center text-xl font-bold font-mono rounded-xl focus:outline-none focus:border-red-500 transition-all"
                                />
                            ))}
                        </div>

                        <p className="text-xs text-white/40 text-center">
                            Account destruction parameters require immediate authorization keys before final system wipes.
                        </p>
                    </div>
                )}
            </DeleteConfirmationModal>
        </div>
    );
}