import { NextResponse } from "next/server";
import { jobs } from "@/data/jobs";

export async function GET() {
    try {
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
                message: "Failed to fetch jobs",
            },
            { status: 500 }
        );
    }
}