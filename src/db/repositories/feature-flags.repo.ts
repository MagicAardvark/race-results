import { db, featureFlags } from "@/db";
import {
    CreateFeatureFlagDTO,
    FeatureFlagDTO,
    OrgFeatureFlags,
    UpdateFeatureFlagDTO,
} from "@/dto/feature-flags";
import { DatabaseError } from "@/lib/errors/app-errors";
import { and, eq, isNull } from "drizzle-orm";

interface IFeatureFlagsRepository {
    findByOrgId(orgId: string): Promise<OrgFeatureFlags>;
    findByOrgIdAndKey(orgId: string, featureKey: string): Promise<FeatureFlagDTO | null>;
    upsert(dto: UpdateFeatureFlagDTO): Promise<FeatureFlagDTO>;
    upsertMany(orgId: string, flags: OrgFeatureFlags): Promise<void>;
}

export class FeatureFlagsRepository implements IFeatureFlagsRepository {
    async findByOrgId(orgId: string): Promise<OrgFeatureFlags> {
        const flags = await db.query.featureFlags.findMany({
            where: {
                orgId: orgId,
                deletedAt: { isNull: true },
            },
        });

        const result: OrgFeatureFlags = {};
        for (const flag of flags) {
            result[flag.featureKey] = flag.enabled;
        }

        return result;
    }

    async findByOrgIdAndKey(
        orgId: string,
        featureKey: string
    ): Promise<FeatureFlagDTO | null> {
        const flag = await db.query.featureFlags.findFirst({
            where: {
                orgId: orgId,
                featureKey: featureKey,
                deletedAt: { isNull: true },
            },
        });

        return flag ?? null;
    }

    async upsert(dto: UpdateFeatureFlagDTO): Promise<FeatureFlagDTO> {
        // Use Drizzle's onConflictDoUpdate for true database-level upsert
        const [result] = await db
            .insert(featureFlags)
            .values({
                orgId: dto.orgId,
                featureKey: dto.featureKey,
                enabled: dto.enabled,
            })
            .onConflictDoUpdate({
                target: [featureFlags.orgId, featureFlags.featureKey],
                set: {
                    enabled: dto.enabled,
                    updatedAt: new Date(),
                },
            })
            .returning();

        if (!result) {
            throw new DatabaseError("Failed to upsert feature flag");
        }

        return result;
    }

    async upsertMany(orgId: string, flags: OrgFeatureFlags): Promise<void> {
        const updates = Object.entries(flags).map(([featureKey, enabled]) =>
            this.upsert({
                orgId,
                featureKey,
                enabled,
            })
        );

        await Promise.all(updates);
    }
}

export const featureFlagsRepository = new FeatureFlagsRepository();

