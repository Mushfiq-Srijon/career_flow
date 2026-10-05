import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.BETTER_AUTH_DB_URL as string);
export const db = client.db("career_flow_db");

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    },

    database: mongodbAdapter(db, {
        client,
    }),
});