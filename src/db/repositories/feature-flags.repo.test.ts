import { describe, it, expect, vi, beforeEach } from "vitest";
import { featureFlagsRepository } from "./feature-flags.repo";
import { db, featureFlags } from "@/db";
import type { FeatureFlagDTO, OrgFeatureFlags } from "@/dto/feature-flags";
import { DatabaseError } from "@/lib/errors/app-errors";

// Mock db.query and db.insert
vi.mock("@/db", () => ({
    db: {
        query: {
            featureFlags: {
                findMany: vi.fn(),
                findFirst: vi.fn(),
            },
        },
        insert: vi.fn(),
    },
    featureFlags: {
        orgId: "orgId",
        featureKey: "featureKey",
    },
}));

describe("FeatureFlagsRepository", () => {
    const orgId = "org-1";
    const mockFlag: FeatureFlagDTO = {
        featureFlagId: "flag-1",
        orgId: orgId,
        featureKey: "feature1",
        enabled: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
        deletedAt: null,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("findByOrgId", () => {
        it("returns feature flags as object", async () => {
            vi.mocked(db.query.featureFlags.findMany).mockResolvedValue([
                mockFlag,
                { ...mockFlag, featureKey: "feature2", enabled: false },
            ]);

            const result = await featureFlagsRepository.findByOrgId(orgId);

            expect(result).toEqual({
                feature1: true,
                feature2: false,
            });
            expect(db.query.featureFlags.findMany).toHaveBeenCalledWith({
                where: {
                    orgId: orgId,
                    deletedAt: { isNull: true },
                },
            });
        });

        it("returns empty object when no flags found", async () => {
            vi.mocked(db.query.featureFlags.findMany).mockResolvedValue([]);

            const result = await featureFlagsRepository.findByOrgId(orgId);

            expect(result).toEqual({});
        });
    });

    describe("findByOrgIdAndKey", () => {
        it("returns feature flag when found", async () => {
            vi.mocked(db.query.featureFlags.findFirst).mockResolvedValue(
                mockFlag
            );

            const result = await featureFlagsRepository.findByOrgIdAndKey(
                orgId,
                "feature1"
            );

            expect(result).toEqual(mockFlag);
            expect(db.query.featureFlags.findFirst).toHaveBeenCalledWith({
                where: {
                    orgId: orgId,
                    featureKey: "feature1",
                    deletedAt: { isNull: true },
                },
            });
        });

        it("returns null when flag not found", async () => {
            vi.mocked(db.query.featureFlags.findFirst).mockResolvedValue(
                undefined
            );

            const result = await featureFlagsRepository.findByOrgIdAndKey(
                orgId,
                "non-existent"
            );

            expect(result).toBeNull();
        });
    });

    describe("upsert", () => {
        it("upserts feature flag successfully", async () => {
            const mockInsert = {
                values: vi.fn().mockReturnValue({
                    onConflictDoUpdate: vi.fn().mockReturnValue({
                        returning: vi.fn().mockResolvedValue([mockFlag]),
                    }),
                }),
            };
            vi.mocked(db.insert).mockReturnValue(mockInsert as never);

            const result = await featureFlagsRepository.upsert({
                orgId: orgId,
                featureKey: "feature1",
                enabled: true,
            });

            expect(result).toEqual(mockFlag);
            expect(db.insert).toHaveBeenCalledWith(featureFlags);
        });

        it("throws DatabaseError when upsert fails", async () => {
            const mockInsert = {
                values: vi.fn().mockReturnValue({
                    onConflictDoUpdate: vi.fn().mockReturnValue({
                        returning: vi.fn().mockResolvedValue([]),
                    }),
                }),
            };
            vi.mocked(db.insert).mockReturnValue(mockInsert as never);

            await expect(
                featureFlagsRepository.upsert({
                    orgId: orgId,
                    featureKey: "feature1",
                    enabled: true,
                })
            ).rejects.toThrow(DatabaseError);
        });
    });

    describe("upsertMany", () => {
        it("upserts multiple feature flags", async () => {
            const flags: OrgFeatureFlags = {
                feature1: true,
                feature2: false,
            };

            const mockInsert = {
                values: vi.fn().mockReturnValue({
                    onConflictDoUpdate: vi.fn().mockReturnValue({
                        returning: vi.fn().mockResolvedValue([mockFlag]),
                    }),
                }),
            };
            vi.mocked(db.insert).mockReturnValue(mockInsert as never);

            await featureFlagsRepository.upsertMany(orgId, flags);

            expect(db.insert).toHaveBeenCalledTimes(2);
        });

        it("handles empty flags object", async () => {
            await featureFlagsRepository.upsertMany(orgId, {});

            expect(db.insert).not.toHaveBeenCalled();
        });
    });
});
