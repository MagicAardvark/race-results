import { featureFlagsRepository } from "@/db/repositories/feature-flags.repo";
import { OrgFeatureFlags } from "@/dto/feature-flags";

interface IFeatureFlagsService {
    getOrgFeatureFlags(orgId: string): Promise<OrgFeatureFlags>;
    updateOrgFeatureFlags(orgId: string, flags: OrgFeatureFlags): Promise<void>;
    isFeatureEnabled(orgId: string, featureKey: string): Promise<boolean>;
}

export class FeatureFlagsService implements IFeatureFlagsService {
    async getOrgFeatureFlags(orgId: string): Promise<OrgFeatureFlags> {
        return await featureFlagsRepository.findByOrgId(orgId);
    }

    async updateOrgFeatureFlags(
        orgId: string,
        flags: OrgFeatureFlags
    ): Promise<void> {
        await featureFlagsRepository.upsertMany(orgId, flags);
    }

    async isFeatureEnabled(
        orgId: string,
        featureKey: string
    ): Promise<boolean> {
        const flag = await featureFlagsRepository.findByOrgIdAndKey(
            orgId,
            featureKey
        );
        return flag?.enabled ?? false;
    }
}

export const featureFlagsService = new FeatureFlagsService();
