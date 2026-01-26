import { db } from "@/db";
import "dotenv/config";
import {
    featureFlags,
    orgApiKeys,
    orgs,
    roles,
    userGlobalRoles,
    users,
} from "./schema";
import {
    baseClasses,
    classGroups,
    classIndexValues,
    classGroupClasses,
    classCategories,
    classTypes,
} from "@/db/tables/classes";
import { generateApiKey } from "@/lib/auth/generate-api-key";

async function main() {
    // eslint-disable-next-line no-console
    console.log("Starting seed...");

    await configureOrgs();

    await configureUsers();

    await configureClasses();

    // eslint-disable-next-line no-console
    console.log("Seed completed successfully!");
}

async function configureOrgs() {
    await db.delete(orgs);

    const insertedOrgs = await db
        .insert(orgs)
        .values((await import("@/db/seed-data/orgs.json")).default)
        .returning();

    const orgDefaultFeatureFlags = [];
    const orgDefaultApiKeys = [];

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

        // Default feature flags
        orgDefaultFeatureFlags.push({
            orgId: org.orgId,
            featureKey: "feature.liveTiming.paxEnabled",
            enabled: paxEnabled,
        });

        orgDefaultFeatureFlags.push({
            orgId: org.orgId,
            featureKey: "feature.liveTiming.workRunEnabled",
            enabled: workRunEnabled,
        });

        // Create an API key
        orgDefaultApiKeys.push({
            orgId: org.orgId,
            apiKey: generateApiKey(),
        });
    }

    await db.insert(featureFlags).values(orgDefaultFeatureFlags);
    await db.insert(orgApiKeys).values(orgDefaultApiKeys);
}

async function configureUsers() {
    await db.delete(users);
    await db.delete(roles);

    const userData = (await import("@/db/seed-data/users.json")).default;
    const roleData = (await import("@/db/seed-data/roles.json")).default;

    await db.insert(users).values(
        userData.map((user) => ({
            userId: user.userId,
            displayName: user.displayName,
            authProviderId:
                process.env[
                    `AUTHPROVIDER_ID_${user.displayName.replaceAll(" ", "")}`
                ]!,
        }))
    );

    await db.insert(roles).values(roleData).returning();

    const userGlobalRoleMapping = userData.flatMap((user) =>
        user.globalRoles.map((key) => ({
            userId: userData.find((u) => u.displayName === user.displayName)!
                .userId,
            roleId: roleData.find((r) => r.key === key)!.roleId,
        }))
    );

    await db.insert(userGlobalRoles).values(userGlobalRoleMapping);
}

async function configureClasses() {
    await db.delete(classTypes);
    await db.delete(classCategories);
    await db.delete(baseClasses);
    await db.delete(classGroups);

    const classTypeData = (await import("@/db/seed-data/class-types.json"))
        .default;

    await db.insert(classTypes).values(
        classTypeData.map((ct, index) => ({
            classTypeKey: ct.classTypeKey,
            shortName: ct.shortName,
            longName: ct.longName,
            isEnabled: true,
            relativeOrder: index + 1,
        }))
    );

    const classCategoriesData = (
        await import("@/db/seed-data/class-categories.json")
    ).default;

    const insertedCategories = await db
        .insert(classCategories)
        .values(
            classCategoriesData.map((cc, index) => ({
                shortName: cc.shortName,
                longName: cc.longName,
                classTypeKey: cc.classTypeKey,
                isEnabled: true,
                relativeOrder: index + 1,
            }))
        )
        .returning();

    const baseClassData = (await import("@/db/seed-data/base-classes.json"))
        .default;

    await db.insert(baseClasses).values(
        baseClassData.map((bc, index) => ({
            classId: bc.classId,
            shortName: bc.shortName,
            longName: bc.longName,
            classTypeKey: classTypeData[0].classTypeKey,
            classCategoryId:
                insertedCategories.find(
                    (c) => c.shortName === bc.categoryShortName
                )?.classCategoryId || null,
            isEnabled: true,
            isIndexed: true,
            relativeOrder: index + 1,
        }))
    );

    const indexValueInserts = baseClassData.flatMap((bc) =>
        bc.indexValues.map((v) => ({
            classId: bc.classId,
            effectiveFrom: new Date(`${v.year}-01-01T00:00:00-05:00`),
            effectiveTo: new Date(`${v.year}-12-31T23:59:59-05:00`),
            indexValue: v.value.toString(),
        }))
    );

    await db.insert(classIndexValues).values(indexValueInserts);

    const classGroupData = (await import("@/db/seed-data/class-groups.json"))
        .default;

    await db.insert(classGroups).values(
        classGroupData.map((cg) => ({
            classGroupId: cg.classGroupId,
            shortName: cg.shortName,
            longName: cg.longName,
            isEnabled: true,
            orgId: cg.orgId,
        }))
    );

    const classGroupClassMappings = [];
    for (const bc of baseClassData) {
        for (const cg of classGroupData) {
            classGroupClassMappings.push({
                classGroupId: cg.classGroupId,
                classId: bc.classId,
            });
        }
    }

    await db.insert(classGroupClasses).values(classGroupClassMappings);
}

main();
