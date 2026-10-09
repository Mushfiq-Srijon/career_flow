import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth, db } from "@/lib/auth";
import { Job } from "@/types/job";

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please sign in to continue",
                },
                { status: 401 }
            );
        }

        if (session.user.activeMode !== "recruiter") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Switch to Recruiter Mode first",
                },
                { status: 403 }
            );
        }

        const jobs = await db
            .collection<Job>("jobs")
            .find({ ownerId: session.user.id })
            .toArray();

        return NextResponse.json(
            {
                success: true,
                data: jobs,
            },
            { status: 200 }
        );
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch your jobs",
            },
            { status: 500 }
        );
    }
}