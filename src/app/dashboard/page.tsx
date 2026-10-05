"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import AppliedJobCard from "@/components/dashboard/AppliedJobCard";
import { getApplications, getJobs } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { Job } from "@/types/job";

export default function DashboardPage() {
    const { data: session, isPending: isSessionPending } = useSession();
    const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isSessionPending) {
            return;
        }

        async function loadAppliedJobs() {
            try {
                setLoading(true);
                setError("");

                const applicationsResponse = await getApplications();
                const response = await getJobs();

                if (!response.success) {
                    throw new Error(response.message || "Failed to fetch jobs");
                }

                const jobs = response.data.filter((job) =>
                    applicationsResponse.data.some(
                        (application) => application.jobId === job.id
                    )
                );

                setAppliedJobs(jobs);
            } catch (error) {
                console.error(error);
                setError("Unable to load your applied jobs.");
            } finally {
                setLoading(false);
            }
        }

        const timeoutId = window.setTimeout(() => {
            if (!session?.user) {
                setError("Please sign in to view your applied jobs.");
                setLoading(false);
                return;
            }

            void loadAppliedJobs();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [isSessionPending, session?.user]);

    return (
        <main className="min-h-[calc(100vh-73px)] bg-slate-50">
            <section className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                        Dashboard
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                        Applied Jobs
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                        {session?.user
                            ? `Signed in as ${session.user.name || session.user.email}.`
                            : "View the jobs you have applied for."}
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
                {loading && (
                    <div className="space-y-5">
                        {Array.from({ length: 2 }).map((_, index) => (
                            <div
                                key={index}
                                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
                            >
                                <div className="h-5 w-1/2 rounded bg-slate-200" />
                                <div className="mt-3 h-4 w-1/3 rounded bg-slate-200" />
                                <div className="mt-6 h-16 rounded bg-slate-200" />
                            </div>
                        ))}
                    </div>
                )}

                {!loading && error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                        <h2 className="font-semibold text-red-900">
                            Something went wrong
                        </h2>

                        <p className="mt-2 text-sm text-red-700">
                            {error}
                        </p>
                    </div>
                )}

                {!loading && !error && appliedJobs.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                        <h2 className="text-lg font-semibold text-slate-900">
                            No applied jobs yet
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Browse available jobs and apply to the ones you are interested in.
                        </p>

                        <Link
                            href="/jobs"
                            className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            Browse jobs
                        </Link>
                    </div>
                )}

                {!loading && !error && appliedJobs.length > 0 && (
                    <div className="space-y-5">
                        {appliedJobs.map((job) => (
                            <AppliedJobCard key={job.id} job={job} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}