import { JobsApiResponse } from "@/types/job";

export async function getJobs(): Promise<JobsApiResponse> {
  const response = await fetch("/api/jobs");

  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }

  const data: JobsApiResponse = await response.json();

  return data;
}