
"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { useSession } from "@/lib/auth-client";

import RichTextEditor from "@/components/RichTextEditor";

type JobFormData = {
    title: string;
    company: string;
    location: string;
    salaryMin: string;
    salaryMax: string;
    description: string;
    requirements: string;
    responsibilities: string;
};

export default function NewJobPage() {
    const router = useRouter();
    const { data: session, isPending: isSessionPending } = useSession();

    const [formData, setFormData] = useState<JobFormData>({
        title: "",
        company: "",
        location: "",
        salaryMin: "",
        salaryMax: "",
        description: "",
        requirements: "",
        responsibilities: "",
    });

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isSessionPending) {
            return;
        }

        if (!session?.user) {
            router.replace("/sign-in");
            return;
        }

        if (session.user.activeMode !== "recruiter") {
            router.replace("/dashboard");
        }
    }, [isSessionPending, session, router]);

    function handleChange(
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const field = event.target.name as keyof JobFormData;
        const value = event.target.value;

        setFormData((previousData) => ({
            ...previousData,
            [field]: value,
        }));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        const salaryMin = Number(formData.salaryMin);
        const salaryMax = Number(formData.salaryMax);

        if (
            formData.salaryMin.trim() === "" ||
            formData.salaryMax.trim() === "" ||
            !Number.isFinite(salaryMin) ||
            !Number.isFinite(salaryMax) ||
            salaryMin < 0 ||
            salaryMax < salaryMin
        ) {
            setError("Please enter a valid salary range.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/jobs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: formData.title.trim(),
                    company: formData.company.trim(),
                    location: formData.location.trim(),
                    salary: {
                        min: salaryMin,
                        max: salaryMax,
                    },
                    description: formData.description.trim(),
                    requirements: formData.requirements,
                    responsibilities: formData.responsibilities,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                setError(result.message || "Failed to create the job.");
                return;
            }

            router.push("/recruiter/dashboard");
        } catch {
            setError("Unable to connect to the server. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (
        isSessionPending ||
        !session?.user ||
        session.user.activeMode !== "recruiter"
    ) {
        return (
            <main className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-slate-50 px-4">
                <p className="text-sm text-slate-600">
                    Loading...
                </p>
            </main>
        );
    }

    const inputClassName =
        "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

    const labelClassName = "block text-sm font-medium text-slate-700";

    return (
        <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-4 py-10 sm:px-6">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8">
                    <p className="text-sm font-medium text-blue-600">
                        Recruiter Workspace
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                        Post a Job
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        Share your opportunity with job seekers on CareerFlow.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
                >
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label htmlFor="title" className={labelClassName}>
                                Job Title
                            </label>
                            <input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Frontend Developer"
                                className={inputClassName}
                                required
                                maxLength={150}
                            />
                        </div>

                        <div>
                            <label htmlFor="company" className={labelClassName}>
                                Company
                            </label>
                            <input
                                id="company"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="e.g. Acme Ltd."
                                className={inputClassName}
                                required
                                maxLength={150}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="location" className={labelClassName}>
                            Job Location
                        </label>
                        <input
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g. Dhaka, Bangladesh or Remote"
                            className={inputClassName}
                            required
                            maxLength={150}
                        />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label htmlFor="salaryMin" className={labelClassName}>
                                Minimum Salary
                            </label>
                            <input
                                id="salaryMin"
                                name="salaryMin"
                                type="number"
                                min="0"
                                step="any"
                                value={formData.salaryMin}
                                onChange={handleChange}
                                placeholder="e.g. 30000"
                                className={inputClassName}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="salaryMax" className={labelClassName}>
                                Maximum Salary
                            </label>
                            <input
                                id="salaryMax"
                                name="salaryMax"
                                type="number"
                                min="0"
                                step="any"
                                value={formData.salaryMax}
                                onChange={handleChange}
                                placeholder="e.g. 50000"
                                className={inputClassName}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className={labelClassName}>
                            Job Description
                        </label>
                        <RichTextEditor
                            content={formData.description}
                            onChange={(content) =>
                                setFormData((previousData) => ({
                                    ...previousData,
                                    description: content,
                                }))
                            }
                            placeholder="Write the job description..."
                        />
                    </div>

                    <div>
                        <label htmlFor="requirements" className={labelClassName}>
                            Requirements
                        </label>
                        <RichTextEditor
                            content={formData.requirements}
                            onChange={(content) =>
                                setFormData((previousData) => ({
                                    ...previousData,
                                    requirements: content,
                                }))
                            }
                            placeholder="Write the job requirements..."
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="responsibilities"
                            className={labelClassName}
                        >
                            Responsibilities
                        </label>
                        <RichTextEditor
                            content={formData.responsibilities}
                            onChange={(content) =>
                                setFormData((previousData) => ({
                                    ...previousData,
                                    responsibilities: content,
                                }))
                            }
                            placeholder="Write the job responsibilities..."
                        />
                    </div>

                    {error && (
                        <div
                            role="alert"
                            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                        >
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={() => router.push("/recruiter/dashboard")}
                            disabled={isSubmitting}
                            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? "Publishing..." : "Post Job"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}