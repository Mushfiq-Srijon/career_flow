const APPLIED_JOBS_KEY = "job-finder-applied-jobs";

export function getAppliedJobIds(): string[] {
    if (typeof window === "undefined") {
        return [];
    }

    const storedJobs = localStorage.getItem(APPLIED_JOBS_KEY);

    if (!storedJobs) {
        return [];
    }

    try {
        const parsedJobs: unknown = JSON.parse(storedJobs);

        if (!Array.isArray(parsedJobs)) {
            return [];
        }

        return parsedJobs.filter(
            (jobId): jobId is string => typeof jobId === "string"
        );
    } catch {
        return [];
    }
}

export function isJobApplied(jobId: string): boolean {
    return getAppliedJobIds().includes(jobId);
}

export function applyToJob(jobId: string): void {
    const appliedJobIds = getAppliedJobIds();

    if (appliedJobIds.includes(jobId)) {
        return;
    }

    localStorage.setItem(
        APPLIED_JOBS_KEY,
        JSON.stringify([...appliedJobIds, jobId])
    );
}