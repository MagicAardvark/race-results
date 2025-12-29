import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { relations } from "./relations";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ relations, client: sql });

export * from "./schema";
