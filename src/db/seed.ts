import { db } from "@/db";
import "dotenv/config";
import { orgs, roles, users } from "./schema";

async function main() {
    await db.delete(orgs);
    await db.delete(roles);
    await db.delete(users);

    await db
        .insert(orgs)
        .values((await import("@/db/seed-data/orgs.json")).default)
        .returning();

    await db
        .insert(roles)
        .values((await import("@/db/seed-data/roles.json")).default)
        .returning();
}

main();
