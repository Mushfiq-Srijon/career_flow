"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useSession } from "@/lib/auth-client";
import { Job } from "@/types/job";

export default function RecruiterDashboardPage() {
    const router = useRouter();
    const { data: session, isPending } = useSession();

    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isPending) {
            return;
        }

        if (!session?.user) {
            router.replace("/sign-in");
            return;
        }

        if (session.user.activeMode !== "recruiter") {
            router.replace("/dashboard");
            return;
        }

        async function loadJobs() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch("/api/recruiter/jobs");
                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message || "Failed to load jobs"
                    );
                }

                setJobs(result.data);
            } catch (error) {
                console.error(error);
                setError("Unable to load your job postings.");
            } finally {
                setLoading(false);
            }
        }

        void loadJobs();
    }, [isPending, session, router]);

    return (
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-medium text-blue-600">
                        Recruiter Workspace
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                        Recruiter Dashboard
                    </h1>

                    <p className="mt-2 text-slate-600">
                        Manage your job postings and find the right candidates.
                    </p>
                </div>

                <Link
                    href="/recruiter/jobs/new"
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                    Post a Job
                </Link>
            </div>

            <section className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <p className="text-sm text-slate-500">Total Jobs</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        {loading ? "—" : jobs.length}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <p className="text-sm text-slate-500">Active Jobs</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        {loading ? "—" : jobs.length}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <p className="text-sm text-slate-500">Applicants</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        —
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                        Applicant tracking is coming next.
                    </p>
                </div>
            </section>

            <section className="mt-10">
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-slate-900">
                        Your Job Postings
                    </h2>

                    <Link
                        href="/recruiter/jobs"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                        View all
                    </Link>
                </div>

                {loading ? (
                    <div className="mt-5 rounded-xl border border-slate-200 p-8 text-center text-slate-500">
                        Loading your jobs...
                    </div>
                ) : error ? (
                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                        {error}
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="mt-5 rounded-xl border border-dashed border-slate-300 px-6 py-12 text-center">
                        <h3 className="text-lg font-semibold text-slate-900">
                            No job postings yet
                        </h3>

                        <p className="mt-2 text-sm text-slate-600">
                            Create your first job posting to get started.
                        </p>

                        <Link
                            href="/recruiter/jobs/new"
                            className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Create Your First Job
                        </Link>
                    </div>
                ) : (
                    <div className="mt-5 space-y-3">
                        {jobs.map((job) => (
                            <article
                                key={job.id}
                                className="rounded-xl border border-slate-200 bg-white p-5"
                            >
                                <h3 className="font-semibold text-slate-900">
                                    {job.title}
                                </h3>

                                <p className="mt-1 text-sm text-slate-600">
                                    {job.company} · {job.location}
                                </p>

                                <p className="mt-2 text-sm text-slate-500">
                                    BDT {job.salary.min.toLocaleString()} –{" "}
                                    {job.salary.max.toLocaleString()}
                                </p>

                                <Link
                                    href={`/jobs/${job.id}`}
                                    className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
                                >
                                    View Job
                                </Link>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}