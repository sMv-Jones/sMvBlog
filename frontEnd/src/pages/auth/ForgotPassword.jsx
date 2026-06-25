import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import authService from "../../services/auth";
import { Container, Button, Input } from "../../components/index";

export default function ForgotPassword() {
    const navigate = useNavigate();

    // Workflow tracking states
    const [step, setStep] = useState(1); // 1: Request OTP, 2: Reset Password
    const [isLoading, setIsLoading] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [feedbackMessage, setFeedbackMessage] = useState({ text: "", isError: false });

    // Multi-box split input reference handling
    const otpRefs = useRef([]);

    //Form setup for sending OTP
    const {
        register: registerEmail,
        handleSubmit: handleEmailSubmit,
        formState: { errors: emailErrors }
    } = useForm();

    //Form setup for providing the new password + OTP code assembly
    const {
        register: registerReset,
        handleSubmit: handleResetSubmit,
        setValue: setResetFormValue,
        getValues: getResetValues,
        formState: { errors: resetErrors },
        reset: resetFields
    } = useForm();

    // 💡 FORCE BACKGROUND CSS VARIABLES FOR ENTIRE LIFE CYCLE (Typing, Blur, Autofill)
    const fixedInputClass = "!bg-black/60 !text-white !border-white/10 focus:!bg-neutral-900 focus:!border-blue-500/50 focus:!text-white active:!bg-black/60 text-base rounded-xl px-4 py-3 autofill:shadow-[inset_0_0_0_1000px_#0a0a0a] autofill:text-white [-webkit-text-fill-color:white_!important]";
    const fixedOtpClass = "w-12 h-14 !bg-black/60 !text-white border border-white/10 focus:border-blue-500 text-center text-xl font-bold font-mono rounded-xl focus:outline-none focus:!bg-neutral-900 transition-all autofill:shadow-[inset_0_0_0_1000px_#0a0a0a] autofill:text-white [-webkit-text-fill-color:white_!important]";

    // Input cursor forwarding behaviors for the split security boxes
    const handleOtpChange = (e, index) => {
        const val = e.target.value.replace(/\D/g, "");
        setResetFormValue(`otp.${index}`, val);

        if (val && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            const currentVal = e.target.value;
            if (!currentVal && index > 0) {
                setResetFormValue(`otp.${index - 1}`, "");
                otpRefs.current[index - 1]?.focus();
            }
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);

        pastedData.split("").forEach((char, index) => {
            setResetFormValue(`otp.${index}`, char);
            if (otpRefs.current[index]) {
                otpRefs.current[index].value = char;
            }
        });

        const focusIndex = pastedData.length < 6 ? pastedData.length : 5;
        otpRefs.current[focusIndex]?.focus();
    };

    // Form Action Step 1: Send Request Outbound 
    const onEmailSubmit = async (data) => {
        setIsLoading(true);
        setFeedbackMessage({ text: "", isError: false });
        try {
            const response = await authService.requestPasswordResetOtp(data.email);
            if (response?.success) {
                setUserEmail(data.email);
                setStep(2);
                setFeedbackMessage({ text: `A 6-digit verification code was routed to ${data.email}`, isError: false });
            } else {
                setFeedbackMessage({ text: response?.message || "This email address is not registered in our records.", isError: true });
            }
        } catch (err) {
            console.error(err);
            setFeedbackMessage({ text: "Network routing exception. Please try again later.", isError: true });
        } finally {
            setIsLoading(false);
        }
    };

    // Form Action Step 2: Validate Credentials & Overwrite System Store
    const onResetSubmit = async (data) => {
        setFeedbackMessage({ text: "", isError: false });
        const rawOtp = Object.values(data.otp || {}).join("");

        if (rawOtp.length !== 6) {
            setFeedbackMessage({ text: "Please complete the 6-digit verification security block.", isError: true });
            return;
        }

        setIsLoading(true);
        try {
            const response = await authService.resetPasswordWithOtp({
                email: userEmail,
                otp: rawOtp,
                newPassword: data.newPassword
            });

            if (response?.success) {
                setFeedbackMessage({ text: "Password reset complete! Forwarding to gateway login...", isError: false });
                resetFields();
                setTimeout(() => {
                    navigate("/login");
                }, 2500);
            } else {
                setFeedbackMessage({ text: response?.message || "Invalid or expired security code.", isError: true });
            }
        } catch (err) {
            console.error(err);
            setFeedbackMessage({ text: "Failed to update configuration credentials system fields.", isError: true });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-white">
            <Container>
                <div className="max-w-md w-full mx-auto rounded-3xl border border-white/10 bg-black/60 p-6 md:p-8 shadow-xl backdrop-blur-md space-y-6">

                    {/* Header Block */}
                    <div className="text-center">
                        <h2 className="text-3xl font-black tracking-tight text-white">
                            {step === 1 ? "Forgot Password?" : "Reset Password"}
                        </h2>
                        <p className="text-sm text-white/50 mt-2">
                            {step === 1
                                ? "Enter your email to receive an identity confirmation security code."
                                : "Construct your updated access credentials below."
                            }
                        </p>
                    </div>

                    {/* Global Form In-Line Notifications */}
                    {feedbackMessage.text && (
                        <div className={`text-sm p-4 rounded-xl border font-medium leading-relaxed ${feedbackMessage.isError ? "bg-red-950/30 text-red-400 border-red-500/20" : "bg-emerald-950/30 text-emerald-400 border-emerald-500/20"}`}>
                            {feedbackMessage.text}
                        </div>
                    )}

                    {/* Step 1 Form View */}
                    {step === 1 && (
                        <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-5">
                            <div>
                                <Input
                                    label="Email Address"
                                    type="email"
                                    placeholder="name@domain.com"
                                    className={fixedInputClass}
                                    {...registerEmail("email", {
                                        required: "Email address identification is required.",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid address formatting framework."
                                        }
                                    })}
                                />
                                {emailErrors.email && <p className="text-red-400 text-sm mt-1.5 font-medium">{emailErrors.email.message}</p>}
                            </div>

                            <Button type="submit" disabled={isLoading} className="w-full py-3 font-semibold text-base transition-all">
                                {isLoading ? "Dispatching..." : "Send Verification Code"}
                            </Button>
                        </form>
                    )}

                    {/* Step 2 Form View */}
                    {step === 2 && (
                        <form onSubmit={handleResetSubmit(onResetSubmit)} className="space-y-5">

                            {/* OTP Segment */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-white/50 uppercase tracking-widest mb-1">
                                    Security Verification Code
                                </label>
                                <div
                                    className="flex gap-2 justify-between"
                                    onPaste={handleOtpPaste}
                                >
                                    {Array(6).fill(null).map((_, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            maxLength={1}
                                            pattern="\d*"
                                            inputMode="numeric"
                                            {...registerReset(`otp.${index}`, { required: true })}
                                            ref={(el) => (otpRefs.current[index] = el)}
                                            onChange={(e) => handleOtpChange(e, index)}
                                            onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                            className={fixedOtpClass}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Password Inputs */}
                            <div className="space-y-4">
                                <div>
                                    <Input
                                        label="New Password"
                                        type="password"
                                        className={fixedInputClass}
                                        {...registerReset("newPassword", {
                                            required: "Please configure a password key signature.",
                                            minLength: { value: 8, message: "Must be at least 8 characters long." },
                                            validate: {
                                                hasUppercase: (value) => /[A-Z]/.test(value) || "Needs an uppercase letter.",
                                                hasLowercase: (value) => /[a-z]/.test(value) || "Needs a lowercase letter.",
                                                hasNumber: (value) => /[0-9]/.test(value) || "Needs at least one number.",
                                            }
                                        })}
                                    />
                                    {resetErrors.newPassword && <p className="text-red-400 text-sm mt-1.5 font-medium">{resetErrors.newPassword.message}</p>}
                                </div>

                                <div>
                                    <Input
                                        label="Confirm New Password"
                                        type="password"
                                        className={fixedInputClass}
                                        {...registerReset("confirmPassword", {
                                            required: "Please re-type validation parameters.",
                                            validate: (value) => value === getResetValues("newPassword") || "Passwords don't match."
                                        })}
                                    />
                                    {resetErrors.confirmPassword && <p className="text-red-400 text-sm mt-1.5 font-medium">{resetErrors.confirmPassword.message}</p>}
                                </div>
                            </div>

                            <Button type="submit" disabled={isLoading} className="w-full py-3 font-semibold text-base bg-blue-600 hover:bg-blue-500 transition-all">
                                {isLoading ? "Overwriting Database..." : "Update Password"}
                            </Button>

                            <button
                                type="button"
                                onClick={() => { setStep(1); setFeedbackMessage({ text: "", isError: false }); }}
                                className="w-full text-center text-sm text-white/40 hover:text-white/60 transition-colors pt-2"
                            >
                                Back to Email Entry
                            </button>
                        </form>
                    )}

                    {/* Bottom Back To Login Router Link */}
                    <div className="h-px bg-white/5 my-4"></div>
                    <div className="text-center">
                        <Link to="/login" className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                            Return to Login portal
                        </Link>
                    </div>

                </div>
            </Container>
        </div>
    );
}