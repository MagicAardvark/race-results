import { describe, it, expect } from "vitest";
import { getOrgFeatureFlags, createFeatureFlagEntries } from "./seed";

/**
 * Tests for seed data configuration logic
 * Note: This tests the logic, not the actual seeding process
 */

describe("getOrgFeatureFlags", () => {
    it("configures feature flags correctly for ne-svt", () => {
        const flags = getOrgFeatureFlags("ne-svt");

        expect(flags.paxEnabled).toBe(false);
        expect(flags.workRunEnabled).toBe(false);
        expect(flags.trophiesEnabled).toBe(false);
    });

    it("configures feature flags correctly for boston-bmw", () => {
        const flags = getOrgFeatureFlags("boston-bmw");

        expect(flags.paxEnabled).toBe(true);
        expect(flags.workRunEnabled).toBe(false);
        expect(flags.trophiesEnabled).toBe(false);
    });

    it("configures feature flags correctly for ner", () => {
        const flags = getOrgFeatureFlags("ner");

        expect(flags.paxEnabled).toBe(true);
        expect(flags.workRunEnabled).toBe(true);
        expect(flags.trophiesEnabled).toBe(true);
    });

    it("configures feature flags correctly for other orgs (defaults)", () => {
        const flags = getOrgFeatureFlags("unknown-org");

        expect(flags.paxEnabled).toBe(true);
        expect(flags.workRunEnabled).toBe(true);
        expect(flags.trophiesEnabled).toBe(false);
    });
});

describe("createFeatureFlagEntries", () => {
    it("creates feature flag entries with correct structure and respects flag values", () => {
        const orgId = "test-org-id";
        const flags = {
            paxEnabled: true,
            workRunEnabled: false,
            trophiesEnabled: true,
        };

        const entries = createFeatureFlagEntries(orgId, flags);

        expect(entries).toHaveLength(3);
        expect(entries).toEqual([
            {
                orgId: "test-org-id",
                featureKey: "feature.liveTiming.paxEnabled",
                enabled: true,
            },
            {
                orgId: "test-org-id",
                featureKey: "feature.liveTiming.workRunEnabled",
                enabled: false,
            },
            {
                orgId: "test-org-id",
                featureKey: "feature.liveTiming.trophiesEnabled",
                enabled: true,
            },
        ]);
    });
});
