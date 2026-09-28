import Link from "next/link";
import { Job } from "@/types/job";

interface JobCardProps {
    job: Job;
}

export default function JobCard({ job }: JobCardProps) {
    return (
        <Link
            href={`/jobs/${job.id}`}
            className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900 transition group-hover:text-blue-600">
                        {job.title}
                    </h2>

                    <p className="mt-1 text-sm font-medium text-slate-600">
                        {job.company}
                    </p>
                </div>

                <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    {job.location}
                </span>
            </div>

            <p className="mt-5 line-clamp-2 text-sm leading-6 text-slate-600">
                {job.description}
            </p>

            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <div>
                    <p className="text-xs text-slate-500">Salary</p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                        ৳{job.salary.min.toLocaleString()} - ৳
                        {job.salary.max.toLocaleString()}
                    </p>
                </div>

                <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
                    View details →
                </span>
            </div>
        </Link>
    );
}