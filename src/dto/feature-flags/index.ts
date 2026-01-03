import { featureFlags } from "@/db";
import { Infer } from "next/dist/compiled/superstruct";

export type FeatureFlagDTO = Infer<typeof featureFlags>;

export interface FeatureFlag {
    featureFlagId: string;
    orgId: string;
    featureKey: string;
    enabled: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export interface CreateFeatureFlagDTO {
    orgId: string;
    featureKey: string;
    enabled?: boolean;
}

export interface UpdateFeatureFlagDTO {
    featureFlagId?: string;
    orgId: string;
    featureKey: string;
    enabled: boolean;
}

export interface OrgFeatureFlags {
    [featureKey: string]: boolean;
}

