"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (error) {
                setErrorMsg(error.message);
                setIsSubmitting(false);
                return;
            }

            const { data: profile } = await supabase
                .from("profiles")
                .select("username, full_name")
                .eq("id", data.user.id)
                .single();

            if (!profile?.username || !profile?.full_name) {
                router.push("/signup");
            } else {
                router.push("/");
            }
        } catch (err) {
            setErrorMsg("An unexpected error occurred");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="flex items-center justify-center min-h-screen px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Welcome back
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Log in to your account
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 space-y-6"
                    >
                        {errorMsg && (
                            <div className="text-red-600 dark:text-red-400 mb-4 text-center">
                                {errorMsg}
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 rounded-lg border transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-3 pr-12 rounded-lg border transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:outline-none transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Logging in...
                                </div>
                            ) : (
                                "Log in"
                            )}
                        </button>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => router.push("/signup")}
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hover:underline focus:outline-none transition-colors duration-200"
                                >
                                    Sign up
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
