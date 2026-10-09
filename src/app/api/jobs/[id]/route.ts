import { NextResponse } from "next/server";

import { db } from "@/lib/auth";
import { jobs } from "@/data/jobs";
import { Job } from "@/types/job";

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

        const sampleJob = jobs.find((job) => job.id === id);

        const recruiterJob = sampleJob
            ? null
            : await db.collection<Job>("jobs").findOne({ id });

        const job = sampleJob || recruiterJob;

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