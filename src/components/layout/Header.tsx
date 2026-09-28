import Link from "next/link";

export default function Header() {
    return (
        <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link
                    href="/jobs"
                    className="text-xl font-bold tracking-tight text-slate-900"
                >
                    CareerFlow
                </Link>

                <nav className="flex items-center gap-6">
                    <Link
                        href="/jobs"
                        className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
                    >
                        Find Jobs
                    </Link>

                    <Link
                        href="/dashboard"
                        className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
                    >
                        Applied Jobs
                    </Link>
                </nav>
            </div>
        </header>
    );
}