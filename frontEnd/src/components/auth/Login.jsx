import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from "react-redux"
import { useForm } from "react-hook-form"
import { Button, Input, Logo } from "../index"
import { login as authLogin } from '../../store/authSlice'
import authService from "../../services/auth"

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm()
    const [error, setError] = useState("")

    const loginUser = async (data) => {
        setError("")
        try {
            // OPTIMIZATION: Await the response which already contains the user object
            const response = await authService.login(data)
            
            if (response?.success) {
                // Extract the clean user object and dispatch immediately
                dispatch(authLogin(response.user));
                navigate("/")
            } else {
                setError("Login failed. Please check your credentials.")
            }
        } catch (err) {
            setError(err?.response?.data?.message || err.message || "An error occurred during login")
        }
    }

    return (
        <div className='flex items-center justify-center w-full'>
            <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10">
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
                
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
                
                <form onSubmit={handleSubmit(loginUser)} className='mt-8'>
                    <div className='space-y-5'>
                        <Input
                            label="Email: "
                            placeholder="Enter your email"
                            type="email"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                    "Email address must be a valid address",
                                }
                            })}
                        />
                        <div>
                            <Input
                                label="Password: "
                                type="password"
                                placeholder="Enter your password"
                                {...register("password", {
                                    required: true,
                                })}
                            />
                            
                            {/* Forgot Password Link Container */}
                            <div className="flex justify-end mt-2.5 px-0.5">
                                <button
                                    type="button"
                                    onClick={() => navigate("/forgot-password")}
                                    className="text-xs font-semibold text-primary/80 hover:text-primary hover:underline transition-all duration-200 ease-out transform hover:scale-[1.02] focus:outline-none"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        </div>
                        <Button type="submit" className="w-full">Sign in</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login