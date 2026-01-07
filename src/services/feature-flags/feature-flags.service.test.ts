import { describe, it, expect, vi, beforeEach } from "vitest";
import { featureFlagsService } from "./feature-flags.service";
import { featureFlagsRepository } from "@/db/repositories/feature-flags.repo";
import type { OrgFeatureFlags } from "@/dto/feature-flags";

// Mock the repository
vi.mock("@/db/repositories/feature-flags.repo", () => ({
    featureFlagsRepository: {
        findByOrgId: vi.fn(),
        findByOrgIdAndKey: vi.fn(),
        upsertMany: vi.fn(),
    },
}));

describe("FeatureFlagsService", () => {
    const orgId = "org-1";

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("getOrgFeatureFlags", () => {
        it("returns feature flags for organization", async () => {
            const mockFlags: OrgFeatureFlags = {
                feature1: true,
                feature2: false,
            };
            vi.mocked(featureFlagsRepository.findByOrgId).mockResolvedValue(
                mockFlags
            );

            const result = await featureFlagsService.getOrgFeatureFlags(orgId);

            expect(result).toEqual(mockFlags);
            expect(featureFlagsRepository.findByOrgId).toHaveBeenCalledWith(
                orgId
            );
        });

        it("returns empty object when no flags found", async () => {
            vi.mocked(featureFlagsRepository.findByOrgId).mockResolvedValue({});

            const result = await featureFlagsService.getOrgFeatureFlags(orgId);

            expect(result).toEqual({});
        });
    });

    describe("updateOrgFeatureFlags", () => {
        it("updates feature flags for organization", async () => {
            const flags: OrgFeatureFlags = {
                feature1: true,
                feature2: false,
            };
            vi.mocked(featureFlagsRepository.upsertMany).mockResolvedValue(
                undefined
            );

            await featureFlagsService.updateOrgFeatureFlags(orgId, flags);

            expect(featureFlagsRepository.upsertMany).toHaveBeenCalledWith(
                orgId,
                flags
            );
        });

        it("handles empty flags object", async () => {
            vi.mocked(featureFlagsRepository.upsertMany).mockResolvedValue(
                undefined
            );

            await featureFlagsService.updateOrgFeatureFlags(orgId, {});

            expect(featureFlagsRepository.upsertMany).toHaveBeenCalledWith(
                orgId,
                {}
            );
        });
    });

    describe("isFeatureEnabled", () => {
        it("returns true when feature is enabled", async () => {
            vi.mocked(
                featureFlagsRepository.findByOrgIdAndKey
            ).mockResolvedValue({
                featureFlagId: "flag-1",
                orgId: orgId,
                featureKey: "feature1",
                enabled: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            });

            const result = await featureFlagsService.isFeatureEnabled(
                orgId,
                "feature1"
            );

            expect(result).toBe(true);
            expect(
                featureFlagsRepository.findByOrgIdAndKey
            ).toHaveBeenCalledWith(orgId, "feature1");
        });

        it("returns false when feature is disabled", async () => {
            vi.mocked(
                featureFlagsRepository.findByOrgIdAndKey
            ).mockResolvedValue({
                featureFlagId: "flag-1",
                orgId: orgId,
                featureKey: "feature1",
                enabled: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            });

            const result = await featureFlagsService.isFeatureEnabled(
                orgId,
                "feature1"
            );

            expect(result).toBe(false);
        });

        it("returns false when feature flag not found", async () => {
            vi.mocked(
                featureFlagsRepository.findByOrgIdAndKey
            ).mockResolvedValue(null);

            const result = await featureFlagsService.isFeatureEnabled(
                orgId,
                "non-existent"
            );

            expect(result).toBe(false);
        });
    });
});
