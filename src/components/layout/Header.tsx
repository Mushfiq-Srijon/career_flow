"use client";

import { useState } from "react";
import { Dropdown, Label } from "@heroui/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { signOut, updateUser, useSession } from "@/lib/auth-client";

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isJobsPage =
        pathname === "/jobs" || pathname.startsWith("/jobs/");
    const isSignUpPage = pathname === "/sign-up";
    const isSignInPage = pathname === "/sign-in";
    const isDashboardPage =
        pathname === "/dashboard" ||
        pathname.startsWith("/recruiter/");

    const profileName = session?.user.name || session?.user.email || "Profile";

    const activeMode =
        session?.user.activeMode === "recruiter" ? "recruiter" : "seeker";

    function closeMobileMenu() {
        setIsMenuOpen(false);
    }

    async function handleSignOut() {
        await signOut();
        closeMobileMenu();
        window.location.href = "/sign-in";
    }

    async function handleModeSwitch() {
        if (!session?.user) {
            return;
        }

        const nextMode = activeMode === "seeker" ? "recruiter" : "seeker";

        try {
            await updateUser({ activeMode: nextMode });
            closeMobileMenu();

            window.location.href =
                nextMode === "recruiter"
                    ? "/recruiter/dashboard"
                    : "/dashboard";
        } catch (error) {
            console.error("Failed to switch account mode:", error);
        }
    }

    return (
        <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link
                    href="/jobs"
                    onClick={closeMobileMenu}
                    className="text-3xl font-bold tracking-tight text-slate-900"
                >
                    Career<span className="text-blue-600">Flow</span>
                </Link>

                <button
                    type="button"
                    aria-label="Toggle navigation menu"
                    aria-expanded={isMenuOpen}
                    onClick={() => setIsMenuOpen((open) => !open)}
                    className="inline-flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg text-slate-700 hover:bg-slate-100 sm:hidden"
                >
                    <span className="h-0.5 w-5 bg-current" />
                    <span className="h-0.5 w-5 bg-current" />
                    <span className="h-0.5 w-5 bg-current" />
                </button>

                <nav
                    className={`${isMenuOpen ? "flex" : "hidden"} absolute left-0 right-0 top-[72px] z-10 flex-col gap-1 border-b border-slate-200 bg-white p-4 shadow-sm sm:static sm:flex sm:flex-row sm:items-center sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none`}
                >
                    {session?.user && activeMode === "recruiter" ? (
                        <>
                            <Link
                                href="/recruiter/dashboard"
                                onClick={closeMobileMenu}
                                className={`rounded-lg px-2.5 py-2 text-xs font-medium transition sm:px-3 sm:text-sm ${isDashboardPage
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    }`}
                            >
                                Recruiter Dashboard
                            </Link>

                            <Link
                                href="/recruiter/jobs/new"
                                onClick={closeMobileMenu}
                                className="rounded-lg px-2.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:px-3 sm:text-sm"
                            >
                                Post a Job
                            </Link>

                            <Link
                                href="/recruiter/jobs"
                                onClick={closeMobileMenu}
                                className="rounded-lg px-2.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:px-3 sm:text-sm"
                            >
                                My Jobs
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/jobs"
                                onClick={closeMobileMenu}
                                className={`rounded-lg px-2.5 py-2 text-xs font-medium transition sm:px-3 sm:text-sm ${isJobsPage
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    }`}
                            >
                                Find Jobs
                            </Link>

                            <Link
                                href="/dashboard"
                                onClick={closeMobileMenu}
                                className={`rounded-lg px-2.5 py-2 text-xs font-medium transition sm:px-3 sm:text-sm ${isDashboardPage && activeMode === "seeker"
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    }`}
                            >
                                Dashboard
                            </Link>
                        </>
                    )}

                    {session?.user ? (
                        <div className="sm:ml-2">
                            <Dropdown>
                                <Dropdown.Trigger className="flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-slate-700 transition hover:bg-slate-100 sm:w-auto sm:text-sm">
                                    <span className="max-w-[200px] truncate">
                                        {profileName}
                                    </span>
                                    <span
                                        aria-hidden="true"
                                        className="h-2 w-2 rotate-45 border-b-2 border-r-2 border-slate-500"
                                    />
                                </Dropdown.Trigger>

                                <Dropdown.Popover placement="bottom end">
                                    <Dropdown.Menu
                                        onAction={(key) => {
                                            if (key === "profile") {
                                                router.push("/profile");
                                            }

                                            if (key === "switch-mode") {
                                                void handleModeSwitch();
                                            }

                                            if (key === "logout") {
                                                void handleSignOut();
                                            }
                                        }}
                                    >
                                        <Dropdown.Item
                                            id="profile"
                                            textValue="Profile"
                                        >
                                            <Label>Profile</Label>
                                        </Dropdown.Item>

                                        <Dropdown.Item
                                            id="switch-mode"
                                            textValue={
                                                activeMode === "seeker"
                                                    ? "Switch to Recruiter Mode"
                                                    : "Switch to Job Seeker Mode"
                                            }
                                        >
                                            <Label>
                                                {activeMode === "seeker"
                                                    ? "Switch to Recruiter Mode"
                                                    : "Switch to Job Seeker Mode"}
                                            </Label>
                                        </Dropdown.Item>

                                        <Dropdown.Item
                                            id="logout"
                                            textValue="Log out"
                                            variant="danger"
                                        >
                                            <Label>Log out</Label>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown.Popover>
                            </Dropdown>
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/sign-in"
                                onClick={closeMobileMenu}
                                className={`rounded-lg px-2.5 py-2 text-xs font-medium transition sm:px-3 sm:text-sm ${isSignInPage
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    }`}
                            >
                                Sign In
                            </Link>

                            <Link
                                href="/sign-up"
                                onClick={closeMobileMenu}
                                className={`rounded-lg px-2.5 py-2 text-xs font-medium transition sm:px-3 sm:text-sm ${isSignUpPage
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    }`}
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}