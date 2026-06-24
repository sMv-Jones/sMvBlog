import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Button, Logo } from '../../components/index'
import authService from '../../services/auth'
import { login } from '../../store/authSlice'

function VerifyEmail() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [status, setStatus] = useState("idle")
    const [error, setError] = useState("")

    const { register, handleSubmit, setValue, getValues } = useForm({
        defaultValues: {
            otp: Array(6).fill(""),
        }
    });

    const inputRefs = useRef([]);

    const onOtpChange = (e, index) => {
        const value = e.target.value;
        if (/[^0-9]/.test(value)) return;

        setValue(`otp.${index}`, value);

        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const onKeyDown = (e, index) => {
        // Use getValues() instead of watch() to bypass React Compiler strict checks
        const currentOtpValues = getValues("otp");

        if (e.key === "Backspace" && !currentOtpValues[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const onPaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").trim();

        if (/^\d{6}$/.test(pastedData)) {
            const digits = pastedData.split("");
            digits.forEach((digit, idx) => {
                setValue(`otp.${idx}`, digit);
                if (inputRefs.current[idx]) {
                    inputRefs.current[idx].value = digit;
                }
            });
            inputRefs.current[5].focus();
        }
    };

    const onSubmit = async (data) => {
        const fullOtp = data.otp.join("");
        setStatus("loading");
        setError("");

        try {
            const response = await authService.verifyEmail(fullOtp);
            if (response?.success) {
                setStatus("success");
                if (response.user) {
                    dispatch(login(response.user));
                }
                navigate("/dashboard?firstTime=true");

            } else {
                setStatus("error");
                setError(response?.message || "Verification failed.");
            }
        } catch (err) {
            setStatus("error");
            setError(err?.response?.data?.message || err.message || "An error occurred.");
        }
    };

    return (
        <div className="flex items-center justify-center w-full min-h-[70vh]">
            <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10 text-center">
                <div className="mb-6 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>

                {(status === "idle" || status === "loading") && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold leading-tight text-gray-800">
                            {status === "loading" ? "Verifying code..." : "Verify Your Email"}
                        </h2>
                        <p className="text-base text-black/60">
                            {status === "loading"
                                ? "Please wait while we validate your credentials."
                                : "Enter the 6-digit verification code sent to your email."
                            }
                        </p>

                        {status === "loading" ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mt-4"></div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="flex justify-center gap-2" onPaste={onPaste}>
                                    {Array(6).fill(null).map((_, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            maxLength={1}
                                            pattern="\d*"
                                            inputMode="numeric"
                                            {...register(`otp.${index}`, { required: true })}
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            onChange={(e) => onOtpChange(e, index)}
                                            onKeyDown={(e) => onKeyDown(e, index)}
                                            className="w-12 h-12 text-center text-xl font-bold bg-white border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                    ))}
                                </div>

                                <Button type="submit" className="w-full">
                                    Verify & Register
                                </Button>
                            </form>
                        )}
                    </div>
                )}

                {status === "success" && (
                    <div className="space-y-6">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold leading-tight text-gray-800">Email Verified!</h2>
                        <p className="text-base text-black/60">
                            Redirecting you to your dashboard...
                        </p>
                    </div>
                )}

                {status === "error" && (
                    <div className="space-y-6">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold leading-tight text-red-600">Verification Failed</h2>
                        <p className="text-base text-black/60">{error}</p>

                        <div className="space-y-3 pt-2">
                            <Button onClick={() => setStatus("idle")} className="w-full">
                                Try Again
                            </Button>
                            <Link to="/login" className="block">
                                <span className="text-sm text-primary font-medium hover:underline">Back to Sign In</span>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default VerifyEmail;