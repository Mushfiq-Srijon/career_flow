export interface Job {
    id: string;
    ownerId?: string;
    title: string;
    company: string;
    location: string;
    salary: {
        min: number;
        max: number;
    };
    description: string;
    requirements: string[];
    responsibilities: string[];
}

export interface JobsApiResponse {
    success: boolean;
    data: Job[];
    message?: string;
}

export interface JobApiResponse {
    success: boolean;
    data: Job;
    message?: string;
}