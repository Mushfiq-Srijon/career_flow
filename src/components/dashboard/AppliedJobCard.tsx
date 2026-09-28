import Link from "next/link";

import { Job } from "@/types/job";

interface AppliedJobCardProps {
    job: Job;
}

export default function AppliedJobCard({
    job,
}: AppliedJobCardProps) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-linear-to-b from-blue-50 to-blue-100 p-6 shadow-sm hover:border-purple-500 hover:shadow-lg">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                        {job.title}
                    </h2>

                    <p className="mt-1 text-sm font-medium text-slate-600">
                        {job.company}
                    </p>
                </div>

                <span className="w-fit rounded-lg bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                    Applied
                </span>
            </div>

            <div className="mt-5 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
                <div>
                    <p className="text-xs text-slate-500">Location</p>
                    <p className="mt-1 text-sm font-medium text-slate-800">
                        {job.location}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-slate-500">Salary</p>
                    <p className="mt-1 text-sm font-medium text-slate-800">
                        ৳{job.salary.min.toLocaleString()} - ৳
                        {job.salary.max.toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="mt-5">
                <Link
                    href={`/jobs/${job.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                    View job details →
                </Link>
            </div>
        </div>
    );
}