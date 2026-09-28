"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { applyToJob, isJobApplied } from "@/lib/storage";
import { Job } from "@/types/job";

interface JobDetailsProps {
    job: Job;
}

export default function JobDetails({ job }: JobDetailsProps) {
    const [applied, setApplied] = useState(false);

    useEffect(() => {
        setApplied(isJobApplied(job.id));
    }, [job.id]);

    function handleApply() {
        if (applied) {
            return;
        }

        applyToJob(job.id);
        setApplied(true);
    }

    return (
        <div className="mx-auto max-w-4xl">
            <Link
                href="/jobs"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
            >
                ← Back to jobs
            </Link>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="border-b border-slate-100 pb-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                                {job.title}
                            </h1>

                            <p className="mt-2 text-base font-medium text-slate-600">
                                {job.company}
                            </p>
                        </div>

                        <span className="w-fit rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
                            {job.location}
                        </span>
                    </div>

                    <div className="mt-5">
                        <p className="text-sm text-slate-500">Salary</p>

                        <p className="mt-1 text-lg font-semibold text-slate-900">
                            ৳{job.salary.min.toLocaleString()} - ৳
                            {job.salary.max.toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="mt-8 space-y-8">
                    <section>
                        <h2 className="text-xl font-semibold text-slate-900">
                            Job Description
                        </h2>

                        <p className="mt-3 text-sm leading-7 text-slate-600">
                            {job.description}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-slate-900">
                            Requirements
                        </h2>

                        <ul className="mt-3 space-y-2">
                            {job.requirements.map((requirement) => (
                                <li
                                    key={requirement}
                                    className="flex gap-3 text-sm leading-6 text-slate-600"
                                >
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                                    <span>{requirement}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-slate-900">
                            Responsibilities
                        </h2>

                        <ul className="mt-3 space-y-2">
                            {job.responsibilities.map((responsibility) => (
                                <li
                                    key={responsibility}
                                    className="flex gap-3 text-sm leading-6 text-slate-600"
                                >
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                                    <span>{responsibility}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <div className="border-t border-slate-100 pt-6">
                        <button
                            type="button"
                            onClick={handleApply}
                            disabled={applied}
                            className={`w-full rounded-xl px-5 py-3 text-sm font-semibold transition sm:w-auto ${applied
                                    ? "cursor-not-allowed bg-green-100 text-green-700"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                        >
                            {applied ? "Applied ✓" : "Apply for this job"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}