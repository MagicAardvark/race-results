import { describe, it, expect } from "vitest";
import { getNavigationPages } from "./navigation";
import { FEATURE_FLAGS } from "../config/feature-flags";

describe("getNavigationPages", () => {
    const basePath = "/t/test-org/live";

    it("returns all pages when no feature flags provided", () => {
        const pages = getNavigationPages(basePath);

        expect(pages).toHaveLength(5);
        expect(pages[0].name).toBe("Class");
        expect(pages[1].name).toBe("PAX");
        expect(pages[2].name).toBe("Raw");
        expect(pages[3].name).toBe("Work/Run");
        expect(pages[4].name).toBe("Me");
    });

    it("generates correct links", () => {
        const pages = getNavigationPages(basePath);

        expect(pages[0].link).toBe(basePath);
        expect(pages[1].link).toBe(`${basePath}/pax`);
        expect(pages[2].link).toBe(`${basePath}/raw`);
        expect(pages[3].link).toBe(`${basePath}/workrun`);
        expect(pages[4].link).toBe(`${basePath}/me`);
    });

    it("filters out PAX page when feature flag is disabled", () => {
        const featureFlags = {
            [FEATURE_FLAGS.PAX_ENABLED]: false,
            [FEATURE_FLAGS.WORK_RUN_ENABLED]: true,
        };

        const pages = getNavigationPages(basePath, featureFlags);

        expect(pages).toHaveLength(4);
        expect(pages.find((p) => p.name === "PAX")).toBeUndefined();
        expect(pages.find((p) => p.name === "Class")).toBeDefined();
    });

    it("filters out Work/Run page when feature flag is disabled", () => {
        const featureFlags = {
            [FEATURE_FLAGS.PAX_ENABLED]: true,
            [FEATURE_FLAGS.WORK_RUN_ENABLED]: false,
        };

        const pages = getNavigationPages(basePath, featureFlags);

        expect(pages).toHaveLength(4);
        expect(pages.find((p) => p.name === "Work/Run")).toBeUndefined();
        expect(pages.find((p) => p.name === "Class")).toBeDefined();
    });

    it("filters out both PAX and Work/Run when both flags are disabled", () => {
        const featureFlags = {
            [FEATURE_FLAGS.PAX_ENABLED]: false,
            [FEATURE_FLAGS.WORK_RUN_ENABLED]: false,
        };

        const pages = getNavigationPages(basePath, featureFlags);

        expect(pages).toHaveLength(3);
        expect(pages.find((p) => p.name === "PAX")).toBeUndefined();
        expect(pages.find((p) => p.name === "Work/Run")).toBeUndefined();
        expect(pages.find((p) => p.name === "Class")).toBeDefined();
    });

    it("includes all pages when all feature flags are enabled", () => {
        const featureFlags = {
            [FEATURE_FLAGS.PAX_ENABLED]: true,
            [FEATURE_FLAGS.WORK_RUN_ENABLED]: true,
        };

        const pages = getNavigationPages(basePath, featureFlags);

        expect(pages).toHaveLength(5);
        expect(pages.find((p) => p.name === "PAX")).toBeDefined();
        expect(pages.find((p) => p.name === "Work/Run")).toBeDefined();
    });

    it("includes pages without feature flags regardless of feature flags object", () => {
        const featureFlags = {
            [FEATURE_FLAGS.PAX_ENABLED]: false,
            [FEATURE_FLAGS.WORK_RUN_ENABLED]: false,
        };

        const pages = getNavigationPages(basePath, featureFlags);

        // Class, Raw, and Me don't have feature flags, so they should always be included
        expect(pages.find((p) => p.name === "Class")).toBeDefined();
        expect(pages.find((p) => p.name === "Raw")).toBeDefined();
        expect(pages.find((p) => p.name === "Me")).toBeDefined();
    });
});
