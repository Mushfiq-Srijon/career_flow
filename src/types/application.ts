export interface Application {
    id: string;
    jobId: string;
    appliedAt: string;
    status: string;
}

export interface ApplicationsApiResponse {
    success: boolean;
    data: Application[];
    message?: string;
}

export interface ApplicationApiResponse {
    success: boolean;
    data: Application;
    message?: string;
}
