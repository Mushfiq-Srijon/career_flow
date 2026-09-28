export interface Job {
    id: string;
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