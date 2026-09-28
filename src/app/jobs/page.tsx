"use client";

import { useEffect, useState } from "react";
import { getJobs } from "@/lib/api";
import { Job } from "@/types/job";

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchJobs() {
            try {
                setLoading(true);
                setError("");

                const response = await getJobs();

                if (!response.success) {
                    throw new Error(response.message || "Failed to fetch jobs");
                }

                setJobs(response.data);
            } catch (error) {
                console.error(error);
                setError("Unable to load jobs. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        fetchJobs();
    }, []);

    if (loading) {
        return (
            <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <p className="text-slate-600">Loading jobs...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <p className="text-red-600">{error}</p>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <section>
                <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600">
                    Job Finder
                </p>

                <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                    Find your next opportunity
                </h1>

                <p className="mt-4 max-w-2xl text-lg text-slate-600">
                    Search for jobs across Bangladesh and find an opportunity that fits
                    your skills and career goals.
                </p>

                <div className="mt-10">
                    <p className="mb-4 text-sm font-medium text-slate-500">
                        Available jobs: {jobs.length}
                    </p>

                    <div className="space-y-4">
                        {jobs.map((job) => (
                            <div
                                key={job.id}
                                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                            >
                                <h2 className="text-xl font-semibold text-slate-900">
                                    {job.title}
                                </h2>

                                <p className="mt-1 text-sm text-slate-600">
                                    {job.company} · {job.location}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}