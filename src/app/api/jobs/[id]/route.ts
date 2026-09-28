import { NextResponse } from "next/server";

import { jobs } from "@/data/jobs";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(
    _request: Request,
    context: RouteContext
) {
    try {
        const { id } = await context.params;

        const job = jobs.find((job) => job.id === id);

        if (!job) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Job not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: job,
            },
            { status: 200 }
        );
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch job",
            },
            { status: 500 }
        );
    }
}