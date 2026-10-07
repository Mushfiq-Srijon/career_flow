import { NextResponse } from "next/server";

import { jobs } from "@/data/jobs";
import { auth } from "@/lib/auth";
import { applications } from "@/lib/applications";

async function getUserId(request: Request): Promise<string | null> {
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    return session?.user.id ?? null;
}

export async function GET(request: Request) {
    try {
        const userId = await getUserId(request);

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "You must be signed in" },
                { status: 401 }
            );
        }

        const records = await applications
            .find({ userId })
            .sort({ appliedAt: -1 })
            .toArray();

        return NextResponse.json({
            success: true,
            data: records.map((record) => ({
                id: record._id.toString(),
                jobId: record.jobId,
                appliedAt: record.appliedAt.toISOString(),
                status: record.status,
            })),
        });
    } catch {
        return NextResponse.json(
            { success: false, message: "Failed to fetch applications" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const userId = await getUserId(request);

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "You must be signed in" },
                { status: 401 }
            );
        }

        const body = (await request.json()) as { jobId?: unknown };

        if (typeof body.jobId !== "string" || !jobs.some((job) => job.id === body.jobId)) {
            return NextResponse.json(
                { success: false, message: "A valid job is required" },
                { status: 400 }
            );
        }

        await applications.createIndex(
            { userId: 1, jobId: 1 },
            { unique: true }
        );

        const application = {
            userId,
            jobId: body.jobId,
            appliedAt: new Date(),
            status: "applied" as const,
        };

        const result = await applications.insertOne(application);

        return NextResponse.json(
            {
                success: true,
                data: {
                    id: result.insertedId.toString(),
                    jobId: application.jobId,
                    appliedAt: application.appliedAt.toISOString(),
                    status: application.status,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        if (error && typeof error === "object" && "code" in error && error.code === 11000) {
            return NextResponse.json(
                { success: false, message: "You have already applied for this job" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { success: false, message: "Failed to create application" },
            { status: 500 }
        );
    }
}
