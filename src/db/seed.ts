import { db } from "@/db";
import "dotenv/config";
import { orgs, roles, users } from "./schema";
import { featureFlagsRepository } from "./repositories/feature-flags.repo";

async function main() {
    await db.delete(orgs);
    await db.delete(roles);
    await db.delete(users);

    const insertedOrgs = await db
        .insert(orgs)
        .values((await import("@/db/seed-data/orgs.json")).default)
        .returning();

    await db
        .insert(roles)
        .values((await import("@/db/seed-data/roles.json")).default)
        .returning();

    // Set feature flags for organizations
    for (const org of insertedOrgs) {
        let paxEnabled = true;
        let workRunEnabled = true;

        // Configure feature flags based on org slug
        if (org.slug === "ne-svt") {
            // NE-SVT: disable both
            paxEnabled = false;
            workRunEnabled = false;
        } else if (org.slug === "boston-bmw") {
            // Boston BMW: disable workRunEnabled only
            paxEnabled = true;
            workRunEnabled = false;
        }
        // ner (and any others): both enabled (defaults)

        // Set the feature flags
        await featureFlagsRepository.upsert({
            orgId: org.orgId,
            featureKey: "feature.liveTiming.paxEnabled",
            enabled: paxEnabled,
        });

        await featureFlagsRepository.upsert({
            orgId: org.orgId,
            featureKey: "feature.liveTiming.workRunEnabled",
            enabled: workRunEnabled,
        });
    }

    console.log("Seed completed successfully!");
}

main();
