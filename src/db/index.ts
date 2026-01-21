import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { relations } from "./relations";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ relations, client: sql });

// import "dotenv/config";
// import { drizzle } from "drizzle-orm/neon-serverless";
// import { Pool } from "@neondatabase/serverless";

// const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
// export const db = drizzle({ client: pool });

export * from "./schema";
