import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.BETTER_AUTH_DB_URL as string);
export const db = client.db("career_flow_db");

export const auth = betterAuth({
    user: {
        additionalFields: {
            bio: {
                type: "string",
                required: false,
                input: true,
            },
            professionalTitle: { type: "string", required: false, input: true },
            location: { type: "string", required: false, input: true },
            skills: { type: "string", required: false, input: true },
            resumeUrl: { type: "string", required: false, input: true },
            githubUrl: { type: "string", required: false, input: true },
            linkedinUrl: { type: "string", required: false, input: true },
            portfolioUrl: { type: "string", required: false, input: true },
            preferredJobType: { type: "string", required: false, input: true },
            workArrangement: { type: "string", required: false, input: true },
            preferredLocation: { type: "string", required: false, input: true },
            expectedSalary: { type: "string", required: false, input: true },
        },
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
    },
    socialProviders: {
        google: {
            clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.BETTER_AUTH_GOOGLE_SECRET as string,
        },
    },

    database: mongodbAdapter(db, {
        client,
    }),
});