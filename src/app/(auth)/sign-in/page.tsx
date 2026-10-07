"use client";

import { SubmitEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { signIn, useSession } from "@/lib/auth-client";

const SignInPage = () => {
    const router = useRouter();
    const { data: session, isPending: isSessionPending } = useSession();
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (!isSessionPending && session?.user) {
            router.replace("/dashboard");
        }
    }, [isSessionPending, router, session?.user]);

    useEffect(() => {
        const message = sessionStorage.getItem("career-flow-signup-success");

        if (message) {
            const timeoutId = window.setTimeout(() => {
                setSuccessMessage(message);
                sessionStorage.removeItem("career-flow-signup-success");
            }, 0);

            return () => window.clearTimeout(timeoutId);
        }
    }, []);

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const formData = new FormData(event.currentTarget);
            const result = await signIn.email({
                email: String(formData.get("email")),
                password: String(formData.get("password")),
                callbackURL: "/dashboard",
            });

            if (result.error) {
                setError(result.error.message || "Unable to sign in.");
            } else {
                router.push("/dashboard");
            }
        } catch {
            setError("The authentication service is unavailable. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleGoogleSignIn() {
        await signIn.social({
            provider: "google",
        });
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-900">Sign In</h2>
                {successMessage && (
                    <p role="status" className="text-sm text-center text-green-600">
                        {successMessage}
                    </p>
                )}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                required
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                            />
                            <button
                                type="button"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                aria-pressed={showPassword}
                                onClick={() => setShowPassword((visible) => !visible)}
                                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-gray-500 hover:text-gray-700"
                            >
                                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
                                    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                                    <circle cx="12" cy="12" r="2.5" />
                                    {showPassword && <path d="m4 4 16 16" />}
                                </svg>
                            </button>
                        </div>
                    </div>
                    {error && (
                        <p role="alert" className="text-sm text-red-600">
                            {error}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {isSubmitting ? "Signing In..." : "Sign In"}
                    </button>
                    <p className="mt-4 text-sm text-center text-gray-600">
                        Don&apos;t have an account?{" "}
                        <Link href="/sign-up" className="text-indigo-600 hover:text-indigo-500">
                            Sign Up
                        </Link>
                    </p>
                </form>
                <div className="mt-4">
                    <p className="text-sm text-center text-gray-600">Or sign in with</p>
                    <div className="mt-2">
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            className="flex h-11 w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
                        >
                            <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
                                <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.61 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.04 17.74 9.5 24 9.5Z" />
                                <path fill="#34A853" d="M2.56 13.22A23.95 23.95 0 0 0 0 24c0 3.89.93 7.57 2.56 10.78l7.98-6.2A14.45 14.45 0 0 1 9.5 24c0-1.6.37-3.15 1.04-4.58l-7.98-6.2Z" />
                                <path fill="#FBBC05" d="M24 48c6.47 0 11.9-2.14 15.87-5.82l-7.73-6c-2.14 1.44-4.88 2.3-8.14 2.3-6.26 0-11.57-3.54-13.46-8.3l-7.98 6.2C6.51 42.62 14.61 48 24 48Z" />
                                <path fill="#EA4335" d="M47.5 24.55c0-1.64-.15-3.22-.42-4.74H24v9.02h12.94c-.56 2.98-2.24 5.5-4.8 7.18l7.73 6C44.9 37.85 47.5 31.73 47.5 24.55Z" />
                            </svg>
                            Continue with Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignInPage;