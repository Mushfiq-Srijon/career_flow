import type { Collection } from "mongodb";

import { db } from "@/lib/auth";

export interface ApplicationRecord {
    userId: string;
    jobId: string;
    appliedAt: Date;
    status: "applied";
}

export const applications: Collection<ApplicationRecord> =
    db.collection<ApplicationRecord>("applications");
