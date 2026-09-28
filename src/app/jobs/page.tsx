"use client";

import { useEffect, useState } from "react";

import JobCard from "@/components/jobs/JobCard";
import JobCardSkeleton from "@/components/jobs/JobCardSkeleton";
import EmptyJobs from "@/components/jobs/EmptyJobs";
import JobSearch from "@/components/jobs/JobSearch";

import { getJobs } from "@/lib/api";
import { Job } from "@/types/job";

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    useEffect(() => {
        fetchJobs();
    }, []);

    return (
        <main>
            {/* Hero */}
            <section className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                    <div className="max-w-3xl">
                        <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-blue-600">
                            Job Finder
                        </p>

                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                            Find a job that fits your future.
                        </h1>

                        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                            Explore opportunities from companies across Bangladesh and find
                            your next career opportunity.
                        </p>

                        <div className="mt-8 max-w-2xl">
                            <JobSearch
                                value={search}
                                onChange={setSearch}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Jobs */}
            <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            Latest opportunities
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Explore available jobs and find the right opportunity for you.
                        </p>
                    </div>

                    {!loading && !error && (
                        <p className="text-sm font-medium text-slate-500">
                            {jobs.length} jobs
                        </p>
                    )}
                </div>

                {loading && (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <JobCardSkeleton key={index} />
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

                        <button
                            type="button"
                            onClick={fetchJobs}
                            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {!loading && !error && jobs.length === 0 && <EmptyJobs />}

                {!loading && !error && jobs.length > 0 && (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {jobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}