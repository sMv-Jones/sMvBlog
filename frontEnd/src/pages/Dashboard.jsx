import { useState } from "react";
import { useForm } from "react-hook-form";
import { Container } from "../components/index";

// ==========================================
// 1. DYNAMIC INITIAL STORAGE MATRIX
// ==========================================
const INITIAL_USER_DATA = {
    username: "smv_dev",
    displayName: "S.M.V. Engineer",
    email: "engineering@smvblog.com",
    dateJoined: "Jan 2024",
    blogCount: 14,
    profilePhoto: "favicon.png",
    bio: "Full-stack developer architecting scalable engines, deep-diving into indexing algorithms, and occasionally writing front-end glassmorphism wrappers.",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com"
};

// ==========================================
// 2. COMPONENT MODULE
// ==========================================
export default function ProfileDashboard() {
    const [userData, setUserData] = useState(INITIAL_USER_DATA);
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // React Hook Form Instances
    const { 
        register: registerProfile, 
        handleSubmit: handleProfileSubmit, 
        reset: resetProfile,
        formState: { errors: profileErrors } 
    } = useForm({ defaultValues: userData });

    const { 
        register: registerPassword, 
        handleSubmit: handlePasswordSubmit, 
        reset: resetPassword,
        getValues: getPasswordValues,
        formState: { errors: passwordErrors } 
    } = useForm();

    // Profile Submit Action
    const onProfileSubmit = (data) => {
        setUserData(data);
        setIsEditing(false);
        console.log("Dispatched profile updates payload to API:", data);
    };

    const handleProfileCancel = () => {
        resetProfile(userData); 
        setIsEditing(false);
    };

    // Password Submit Action
    const onPasswordSubmit = (data) => {
        console.log("Dispatched credential payload to validation layer:", {
            currentPassword: data.currentPassword,
            newPassword: data.newPassword
        });
        alert("Password updated successfully inside local context.");
        resetPassword();
        setIsChangingPassword(false);
    };

    const handleDeleteAccount = () => {
        const confirmation = window.confirm("CRITICAL WARNING: Are you sure you want to permanently erase this profile metadata and all linked engineering journals?");
        if (confirmation) {
            console.warn("Account deletion engine triggered.");
        }
    };

    return (
        <div className="min-h-screen py-10 px-4 text-white">
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    
                    {/* LEFT COLUMN: LIVE PROFILE SYNC VIEW */}
                    <aside className="lg:col-span-1 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-2xl shadow-2xl p-6 text-center lg:sticky lg:top-10">
                        <div className="relative w-32 h-32 mx-auto mb-4">
                            <img 
                                src={userData.profilePhoto} 
                                alt="Avatar Frame" 
                                className="w-full h-full object-cover rounded-full border border-white/10 p-1"
                            />
                        </div>

                        <h1 className="text-2xl font-extrabold tracking-tight">{userData.displayName}</h1>
                        <p className="text-blue-500 text-sm font-medium mb-1">@{userData.username}</p>
                        <p className="text-white/40 text-xs font-mono mb-4">{userData.email}</p>
                        
                        <p className="text-xs text-white/50 mb-4">
                            Joined: <span className="text-white/80 font-medium">{userData.dateJoined}</span>
                        </p>

                        <div className="h-px bg-white/10 my-4"></div>

                        <p className="text-white/70 text-sm leading-relaxed mb-6 text-left">
                            {userData.bio || <span className="text-white/30 italic">No biographical payload provided.</span>}
                        </p>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-3 mb-6">
                            <span className="block text-xs text-white/50 uppercase tracking-wider font-semibold">Post Logs</span>
                            <span className="text-2xl font-bold text-white">{userData.blogCount}</span>
                        </div>

                        <div className="flex flex-wrap justify-center gap-2">
                            {['github', 'linkedin', 'twitter'].map((platform) => userData[platform] && (
                                <a 
                                    key={platform}
                                    href={userData[platform]} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="px-3 py-1 text-xs font-medium rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-blue-500 hover:text-white transition-all duration-200 capitalize"
                                >
                                    {platform}
                                </a>
                            ))}
                        </div>
                    </aside>

                    {/* RIGHT COLUMN: INTERACTIVE FORM CONSOLE */}
                    <main className="lg:col-span-2 space-y-6">
                        
                        {/* PROFILE CONFIGURATION ENGINE CARD */}
                        <section className="rounded-3xl border border-white/10 bg-black/60 backdrop-blur-2xl shadow-2xl p-6 md:p-8">
                            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                                <div>
                                    <h2 className="text-2xl font-extrabold">Profile Management</h2>
                                    <p className="text-sm text-white/50 mt-1">Update your public structural developer footprint identity details.</p>
                                </div>
                                {!isEditing && (
                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all duration-200"
                                    >
                                        Edit Details
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Display Name Input */}
                                    <div>
                                        <label className="block text-xs font-semibold text-blue-400 mb-2">Display Name</label>
                                        <input 
                                            type="text" 
                                            disabled={!isEditing}
                                            {...registerProfile("displayName", { required: "Display name is required" })}
                                            className="w-full bg-white/5 disabled:bg-transparent border border-white/10 disabled:border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white transition-all duration-200"
                                        />
                                        {profileErrors.displayName && <p className="text-red-400 text-xs mt-1">{profileErrors.displayName.message}</p>}
                                    </div>

                                    {/* Username Input */}
                                    <div>
                                        <label className="block text-xs font-semibold text-blue-400 mb-2">Username Identifier</label>
                                        <input 
                                            type="text" 
                                            disabled={!isEditing}
                                            {...registerProfile("username", { 
                                                required: "Username is required",
                                                pattern: { value: /^[a-zA-Z0-9_]+$/, message: "Alphanumeric and underscores only" }
                                            })}
                                            className="w-full bg-white/5 disabled:bg-transparent border border-white/10 disabled:border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white transition-all duration-200"
                                        />
                                        {profileErrors.username && <p className="text-red-400 text-xs mt-1">{profileErrors.username.message}</p>}
                                    </div>
                                </div>

                                {/* Email Input */}
                                <div>
                                    <label className="block text-xs font-semibold text-blue-400 mb-2">Email Address Connection</label>
                                    <input 
                                        type="email" 
                                        disabled={!isEditing}
                                        {...registerProfile("email", { 
                                            required: "Email is required",
                                            pattern: { value: /^\S+@\S+$/i, message: "Invalid email syntax structure" }
                                        })}
                                        className="w-full bg-white/5 disabled:bg-transparent border border-white/10 disabled:border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white transition-all duration-200"
                                    />
                                    {profileErrors.email && <p className="text-red-400 text-xs mt-1">{profileErrors.email.message}</p>}
                                </div>

                                {/* Bio Input */}
                                <div>
                                    <label className="block text-xs font-semibold text-blue-400 mb-2">Biographical Ledger</label>
                                    <textarea 
                                        rows="3"
                                        disabled={!isEditing}
                                        {...registerProfile("bio", { maxLength: { value: 300, message: "Maximum 300 character constraint" } })}
                                        className="w-full bg-white/5 disabled:bg-transparent border border-white/10 disabled:border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white resize-none transition-all duration-200"
                                    />
                                    {profileErrors.bio && <p className="text-red-400 text-xs mt-1">{profileErrors.bio.message}</p>}
                                </div>

                                <div className="h-px bg-white/10 my-4"></div>

                                {/* Social Links Mapping */}
                                <div className="space-y-3">
                                    <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Social Architecture Matrix Links</h3>
                                    {['github', 'linkedin', 'twitter'].map((platform) => (
                                        <div key={platform} className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className="w-20 text-xs capitalize text-white/60 font-medium">{platform}:</span>
                                                <input 
                                                    type="text" 
                                                    disabled={!isEditing}
                                                    {...registerProfile(platform)}
                                                    className="w-full bg-white/5 disabled:bg-transparent border border-white/10 disabled:border-white/5 rounded-xl px-4 py-1.5 text-xs focus:outline-none focus:border-blue-500 text-white/80 transition-all duration-200"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {isEditing && (
                                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
                                        <button 
                                            type="button" 
                                            onClick={handleProfileCancel}
                                            className="px-4 py-2 text-xs font-semibold text-white/70 hover:text-white transition-colors duration-200"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit"
                                            className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-200"
                                        >
                                            Commit Updates
                                        </button>
                                    </div>
                                )}
                            </form>
                        </section>

                        {/* PASSWORD MODIFICATION LIVE DROPDOWN WITH VALIDATION */}
                        <section className="rounded-3xl border border-white/10 bg-black/60 backdrop-blur-2xl shadow-2xl p-6 md:p-8 space-y-6">
                            <div>
                                <h2 className="text-xl font-extrabold text-white">Critical Operations Terminal</h2>
                                <p className="text-sm text-white/50 mt-1">Sensitive actions governing encryption validation records and account lifecycle limits.</p>
                            </div>
                            
                            {!isChangingPassword ? (
                                <div className="flex flex-wrap gap-4 items-center pt-2">
                                    <button
                                        onClick={() => setIsChangingPassword(true)}
                                        className="px-4 py-2.5 text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-200"
                                    >
                                        Modify Password Auth
                                    </button>

                                    <button
                                        onClick={handleDeleteAccount}
                                        className="px-4 py-2.5 text-xs font-semibold bg-red-950/20 hover:bg-red-900/40 border border-red-500/30 text-red-400 hover:text-red-300 rounded-xl transition-all duration-200"
                                    >
                                        Delete Account Log
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4 border-t border-white/10 pt-4 animate-fadeIn">
                                    <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">Update Security Token</h3>
                                    
                                    <div>
                                        <label className="block text-xs text-white/60 mb-2">Current Verification Password</label>
                                        <input 
                                            type="password"
                                            {...registerPassword("currentPassword", { required: "Current password is mandatory" })}
                                            className="w-full max-w-md bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-white transition-all duration-200"
                                        />
                                        {passwordErrors.currentPassword && <p className="text-red-400 text-xs mt-1">{passwordErrors.currentPassword.message}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                                        {/* New Password Field - Structured validation setup */}
                                        <div>
                                            <label className="block text-xs text-white/60 mb-2">New Secure Password</label>
                                            <input 
                                                type="password"
                                                {...registerPassword("newPassword", { 
                                                    required: "Password is required",
                                                    minLength: {
                                                        value: 8,
                                                        message: "Password must be at least 8 characters long"
                                                    },
                                                    validate: {
                                                        hasUppercase: (value) => /[A-Z]/.test(value) || "Password must contain at least one uppercase letter",
                                                        hasLowercase: (value) => /[a-z]/.test(value) || "Password must contain at least one lowercase letter",
                                                        hasNumber: (value) => /[0-9]/.test(value) || "Password must contain at least one numeric digit",
                                                    }
                                                })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-white transition-all duration-200"
                                            />
                                            {passwordErrors.newPassword && <p className="text-red-400 text-xs mt-1">{passwordErrors.newPassword.message}</p>}
                                        </div>

                                        {/* Confirm Password Field */}
                                        <div>
                                            <label className="block text-xs text-white/60 mb-2">Confirm New Password</label>
                                            <input 
                                                type="password"
                                                {...registerPassword("confirmPassword", { 
                                                    required: "Please confirm your password",
                                                    validate: (value) => value === getPasswordValues("newPassword") || "Passwords do not match"
                                                })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-white transition-all duration-200"
                                            />
                                            {passwordErrors.confirmPassword && <p className="text-red-400 text-xs mt-1">{passwordErrors.confirmPassword.message}</p>}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-2">
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                setIsChangingPassword(false);
                                                resetPassword();
                                            }}
                                            className="px-4 py-2 text-xs font-semibold text-white/70 hover:text-white transition-colors duration-200"
                                        >
                                            Dismiss
                                        </button>
                                        <button 
                                            type="submit"
                                            className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-200"
                                        >
                                            Update Password
                                        </button>
                                    </div>
                                </form>
                            )}
                        </section>

                    </main>

                </div>
            </Container>
        </div>
    );
}