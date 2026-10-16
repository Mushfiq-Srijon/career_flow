import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { randomUUID } from "node:crypto";

import { auth, db } from "@/lib/auth";
import { Job } from "@/types/job";

const jobsCollection = db.collection<Job>("jobs");


export async function GET() {
    try {
        const recruiterJobs = await jobsCollection.find({}).toArray();

        return NextResponse.json({
            success: true,
            data: recruiterJobs,
        });
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch jobs",
            },
            { status: 500 }
        );
    }
}


export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please sign in to post a job",
                },
                { status: 401 }
            );
        }

        if (session.user.activeMode !== "recruiter") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Switch to Recruiter Mode to post a job",
                },
                { status: 403 }
            );
        }

        const body = await request.json();


        if (
            typeof body.title !== "string" ||
            !body.title.trim() ||
            typeof body.company !== "string" ||
            !body.company.trim() ||
            typeof body.location !== "string" ||
            !body.location.trim() ||
            typeof body.description !== "string" ||
            !body.description.trim() ||
            typeof body.requirements !== "string" ||
            !body.requirements.trim() ||
            typeof body.responsibilities !== "string" ||
            !body.responsibilities.trim() ||
            typeof body.salary?.min !== "number" ||
            !Number.isFinite(body.salary.min) ||
            typeof body.salary?.max !== "number" ||
            !Number.isFinite(body.salary.max) ||
            body.salary.min < 0 ||
            body.salary.max < body.salary.min
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid job details",
                },
                { status: 400 }
            );
        }


        const newJob: Job = {
            id: randomUUID(),
            ownerId: session.user.id,
            title: body.title.trim(),
            company: body.company.trim(),
            location: body.location.trim(),
            salary: {
                min: body.salary.min,
                max: body.salary.max,
            },
            description: body.description,
            requirements: body.requirements,
            responsibilities: body.responsibilities,
        };


        await jobsCollection.insertOne(newJob);

        return NextResponse.json(
            {
                success: true,
                data: newJob,
            },
            { status: 201 }
        );
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to create job",
            },
            { status: 500 }
        );
    }
}