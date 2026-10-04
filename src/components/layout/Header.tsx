"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();

    const isJobsPage =
        pathname === "/jobs" || pathname.startsWith("/jobs/");

    const isDashboardPage = pathname === "/dashboard";

    return (
        <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link
                    href="/jobs"
                    className="text-xl font-bold tracking-tight text-slate-900"
                >
                    Career<span className="text-blue-600">Flow</span>
                </Link>

                <nav className="flex items-center gap-1">
                    <Link
                        href="/jobs"
                        className={`rounded-lg px-2.5 py-2 text-xs font-medium transition sm:px-3 sm:text-sm ${isJobsPage
                            ? "bg-blue-50 text-blue-700"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                    >
                        Find Jobs
                    </Link>

                    <Link
                        href="/dashboard"
                        className={`rounded-lg px-2.5 py-2 text-xs font-medium transition sm:px-3 sm:text-sm ${isDashboardPage
                                ? "bg-blue-50 text-blue-700"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                    >
                        Applied Jobs
                    </Link>
                    <Link
                        href="/sign-in"
                        className="rounded-lg px-2.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:px-3 sm:text-sm"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/sign-up"
                        className="rounded-lg px-2.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:px-3 sm:text-sm"
                    >
                        Sign Up
                    </Link>
                </nav>
            </div>
        </header>
    );
}