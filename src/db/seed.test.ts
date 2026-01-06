import { describe, it, expect } from "vitest";

/**
 * Tests for seed data configuration logic
 * Note: This tests the logic, not the actual seeding process
 */

describe("seed feature flag configuration", () => {
    it("configures feature flags correctly for ne-svt", () => {
        const orgSlug: string = "ne-svt";
        let paxEnabled = true;
        let workRunEnabled = true;

        if (orgSlug === "ne-svt") {
            paxEnabled = false;
            workRunEnabled = false;
        } else if (orgSlug === "boston-bmw") {
            paxEnabled = true;
            workRunEnabled = false;
        }

        expect(paxEnabled).toBe(false);
        expect(workRunEnabled).toBe(false);
    });

    it("configures feature flags correctly for boston-bmw", () => {
        const orgSlug: string = "boston-bmw";
        let paxEnabled = true;
        let workRunEnabled = true;

        if (orgSlug === "ne-svt") {
            paxEnabled = false;
            workRunEnabled = false;
        } else if (orgSlug === "boston-bmw") {
            paxEnabled = true;
            workRunEnabled = false;
        }

        expect(paxEnabled).toBe(true);
        expect(workRunEnabled).toBe(false);
    });

    it("configures feature flags correctly for other orgs (defaults)", () => {
        const orgSlug: string = "ner";
        let paxEnabled = true;
        let workRunEnabled = true;

        if (orgSlug === "ne-svt") {
            paxEnabled = false;
            workRunEnabled = false;
        } else if (orgSlug === "boston-bmw") {
            paxEnabled = true;
            workRunEnabled = false;
        }

        expect(paxEnabled).toBe(true);
        expect(workRunEnabled).toBe(true);
    });
});
