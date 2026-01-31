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

/**
 * Feature flag configuration for organizations
 */
export interface OrgFeatureFlags {
    paxEnabled: boolean;
    workRunEnabled: boolean;
    trophiesEnabled: boolean;
}

/**
 * Determines feature flag configuration based on organization slug
 * @param orgSlug - The organization slug
 * @returns Feature flag configuration
 */
export function getOrgFeatureFlags(orgSlug: string): OrgFeatureFlags {
    switch (orgSlug) {
        case "ne-svt":
            // NE-SVT: disable pax and work run
            return {
                paxEnabled: false,
                workRunEnabled: false,
                trophiesEnabled: false,
            };
        case "boston-bmw":
            // Boston BMW: enable pax, disable work run
            return {
                paxEnabled: true,
                workRunEnabled: false,
                trophiesEnabled: false,
            };
        case "ner":
            // NER: enable all features
            return {
                paxEnabled: true,
                workRunEnabled: true,
                trophiesEnabled: true,
            };
        default:
            // Default: enable pax and work run, disable trophies
            return {
                paxEnabled: true,
                workRunEnabled: true,
                trophiesEnabled: false,
            };
    }
}

/**
 * Creates feature flag entries for an organization
 * @param orgId - The organization ID
 * @param flags - The feature flag configuration
 * @returns Array of feature flag entries
 */
export function createFeatureFlagEntries(
    orgId: string,
    flags: OrgFeatureFlags
): Array<{ orgId: string; featureKey: string; enabled: boolean }> {
    return [
        {
            orgId,
            featureKey: "feature.liveTiming.paxEnabled",
            enabled: flags.paxEnabled,
        },
        {
            orgId,
            featureKey: "feature.liveTiming.workRunEnabled",
            enabled: flags.workRunEnabled,
        },
        {
            orgId,
            featureKey: "feature.liveTiming.trophiesEnabled",
            enabled: flags.trophiesEnabled,
        },
    ];
}

async function main() {
    // eslint-disable-next-line no-console
    console.log("Starting seed...");

    try {
        await configureOrgs();
        await configureUsers();
        await configureClasses();

        // eslint-disable-next-line no-console
        console.log("Seed completed successfully!");
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Seed failed:", error);
        process.exit(1);
    }
}

export async function configureOrgs() {
    await db.delete(orgs);

    const orgData = (await import("@/db/seed-data/orgs.json")).default;
    const insertedOrgs = await db.insert(orgs).values(orgData).returning();

    const orgDefaultFeatureFlags = [];
    const orgDefaultApiKeys = [];

    for (const org of insertedOrgs) {
        const flags = getOrgFeatureFlags(org.slug);
        orgDefaultFeatureFlags.push(
            ...createFeatureFlagEntries(org.orgId, flags)
        );

        orgDefaultApiKeys.push({
            orgId: org.orgId,
            apiKey: generateApiKey(),
        });
    }

    await db.insert(featureFlags).values(orgDefaultFeatureFlags);
    await db.insert(orgApiKeys).values(orgDefaultApiKeys);
}

export async function configureUsers() {
    await db.delete(users);
    await db.delete(roles);

    const userData = (await import("@/db/seed-data/users.json")).default;
    const roleData = (await import("@/db/seed-data/roles.json")).default;

    await db.insert(users).values(
        userData.map((user) => {
            const envKey = `AUTHPROVIDER_ID_${user.displayName.replaceAll(" ", "")}`;
            const authProviderId = process.env[envKey];
            if (!authProviderId) {
                throw new Error(
                    `Missing environment variable: ${envKey} for user ${user.displayName}`
                );
            }
            return {
                userId: user.userId,
                displayName: user.displayName,
                authProviderId,
            };
        })
    );

    const insertedRoles = await db.insert(roles).values(roleData).returning();

    const userGlobalRoleMapping = userData.flatMap((user) =>
        user.globalRoles.map((key) => {
            const role = insertedRoles.find((r) => r.key === key);
            if (!role) {
                throw new Error(`Role not found: ${key}`);
            }
            return {
                userId: user.userId,
                roleId: role.roleId,
            };
        })
    );

    await db.insert(userGlobalRoles).values(userGlobalRoleMapping);
}

export async function configureClasses() {
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

    if (classTypeData.length === 0) {
        throw new Error("No class types found in seed data");
    }

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

    const classGroupClassMappings = baseClassData.flatMap((bc) =>
        classGroupData.map((cg) => ({
            classGroupId: cg.classGroupId,
            classId: bc.classId,
        }))
    );

    await db.insert(classGroupClasses).values(classGroupClassMappings);
}

// Only run main() if this file is executed directly (not when imported)
// This prevents the seed from running when the file is imported in tests
if (
    (typeof require !== "undefined" && require.main === module) ||
    (process.argv[1]?.includes("seed") && process.env.NODE_ENV !== "test")
) {
    void main();
}
