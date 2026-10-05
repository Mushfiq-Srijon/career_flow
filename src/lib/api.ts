import {
    JobApiResponse,
    JobsApiResponse,
} from "@/types/job";
import {
    ApplicationApiResponse,
    ApplicationsApiResponse,
} from "@/types/application";

export async function getJobs(): Promise<JobsApiResponse> {
    const response = await fetch("/api/jobs");

    if (!response.ok) {
        throw new Error("Failed to fetch jobs");
    }

    const data: JobsApiResponse = await response.json();

    return data;
}

export async function getJobById(id: string): Promise<JobApiResponse> {
    const response = await fetch(`/api/jobs/${id}`);

    if (!response.ok) {
        throw new Error("Failed to fetch job");
    }

    const data: JobApiResponse = await response.json();

    return data;
}

export async function getApplications(): Promise<ApplicationsApiResponse> {
    const response = await fetch("/api/applications", {
        cache: "no-store",
    });

    const data: ApplicationsApiResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch applications");
    }

    return data;
}

export async function applyToJob(jobId: string): Promise<ApplicationApiResponse> {
    const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId }),
    });

    const data: ApplicationApiResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to apply for this job");
    }

    return data;
}