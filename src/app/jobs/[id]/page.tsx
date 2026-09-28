"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import JobDetails from "@/components/jobs/JobDetails";
import { getJobById } from "@/lib/api";
import { Job } from "@/types/job";

export default function JobDetailsPage() {
    const params = useParams();
    const id = params.id as string;

    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchJob() {
            try {
                setLoading(true);
                setError("");

                const response = await getJobById(id);

                if (!response.success) {
                    throw new Error(response.message || "Failed to fetch job");
                }

                setJob(response.data);
            } catch (error) {
                console.error(error);
                setError("Unable to load this job.");
            } finally {
                setLoading(false);
            }
        }

        fetchJob();
    }, [id]);

    if (loading) {
        return (
            <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-8">
                    <div className="h-8 w-2/3 rounded bg-slate-200" />
                    <div className="mt-3 h-4 w-1/3 rounded bg-slate-200" />
                    <div className="mt-8 h-4 w-full rounded bg-slate-200" />
                    <div className="mt-3 h-4 w-5/6 rounded bg-slate-200" />
                    <div className="mt-8 h-32 rounded bg-slate-200" />
                </div>
            </main>
        );
    }

    if (error || !job) {
        return (
            <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
                    <h1 className="text-xl font-semibold text-red-900">
                        Job not found
                    </h1>

                    <p className="mt-2 text-sm text-red-700">
                        {error || "The job you are looking for does not exist."}
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="px-4 py-10 sm:px-6 lg:px-8">
            <JobDetails job={job} />
        </main>
    );
}