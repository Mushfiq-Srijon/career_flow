"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import EmptyJobs from "@/components/jobs/EmptyJobs";
import JobCard from "@/components/jobs/JobCard";
import JobCardSkeleton from "@/components/jobs/JobCardSkeleton";
import JobFilters from "@/components/jobs/JobFilters";
import JobSearch from "@/components/jobs/JobSearch";

import { getJobs } from "@/lib/api";
import { Job } from "@/types/job";

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);

    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [minSalary, setMinSalary] = useState("");
    const [maxSalary, setMaxSalary] = useState("");

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

    const filteredJobs = useMemo(() => {
        return jobs.filter((job) => {
            // Search
            const searchTerm = search.trim().toLowerCase();

            const matchesSearch =
                !searchTerm ||
                job.title.toLowerCase().includes(searchTerm) ||
                job.company.toLowerCase().includes(searchTerm);

            // Location
            const matchesLocation =
                !location || job.location === location;

            // Salary
            const minimum = minSalary
                ? Number(minSalary)
                : null;

            const maximum = maxSalary
                ? Number(maxSalary)
                : null;

            const matchesMinimumSalary =
                minimum === null || job.salary.max >= minimum;

            const matchesMaximumSalary =
                maximum === null || job.salary.min <= maximum;

            const matchesSalary =
                matchesMinimumSalary && matchesMaximumSalary;

            return (
                matchesSearch &&
                matchesLocation &&
                matchesSalary
            );
        });
    }, [jobs, search, location, minSalary, maxSalary]);

    function clearFilters() {
        setSearch("");
        setLocation("");
        setMinSalary("");
        setMaxSalary("");
    }

    return (
        <main>
            {/* Hero */}
            <section className="m-0 rounded-none border-0 md:mx-5 md:mb-5 md:mt-0 md:rounded-b-3xl md:border-b border-slate-200 bg-linear-to-b from-blue-50 to-violet-200">
                <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,520px)] lg:gap-12 lg:px-8 lg:py-16">
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

                    <div className="relative mx-auto aspect-4/3 w-full max-w-[520px] lg:mx-0">
                        <Image
                            src="/banner.png"
                            alt=""
                            fill
                            priority
                            sizes="(min-width: 1024px) 520px, 90vw"
                            className="object-contain"
                        />
                    </div>
                </div>
            </section>

            {/* Job results */}
            <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
                    {/* Filters */}
                    <JobFilters
                        location={location}
                        minSalary={minSalary}
                        maxSalary={maxSalary}
                        onLocationChange={setLocation}
                        onMinSalaryChange={setMinSalary}
                        onMaxSalaryChange={setMaxSalary}
                        onClear={clearFilters}
                    />

                    {/* Results */}
                    <div>
                        <div className="mb-6 flex items-end justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">
                                    Latest opportunities
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Explore available jobs and find the right opportunity for
                                    you.
                                </p>
                            </div>

                            {!loading && !error && (
                                <p className="whitespace-nowrap text-sm font-medium text-slate-500">
                                    {filteredJobs.length} jobs
                                </p>
                            )}
                        </div>

                        {/* Loading */}
                        {loading && (
                            <div className="grid gap-5 sm:grid-cols-2">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <JobCardSkeleton key={index} />
                                ))}
                            </div>
                        )}

                        {/* Error */}
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

                        {/* Empty */}
                        {!loading &&
                            !error &&
                            filteredJobs.length === 0 && <EmptyJobs />}

                        {/* Results */}
                        {!loading &&
                            !error &&
                            filteredJobs.length > 0 && (
                                <div className="grid gap-5 sm:grid-cols-2">
                                    {filteredJobs.map((job) => (
                                        <JobCard
                                            key={job.id}
                                            job={job}
                                        />
                                    ))}
                                </div>
                            )}
                    </div>
                </div>
            </section>
        </main>
    );
}