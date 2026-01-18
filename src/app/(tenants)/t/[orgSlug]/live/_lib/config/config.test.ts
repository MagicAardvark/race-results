import { describe, it, expect } from "vitest";
import { LIVE_TIMING_CONFIG } from "./config";

describe("LIVE_TIMING_CONFIG", () => {
    it("exports config object with useLocalFiles, getApiUrl and defaults", () => {
        expect(LIVE_TIMING_CONFIG).toHaveProperty("useLocalFiles");
        expect(LIVE_TIMING_CONFIG).toHaveProperty("getApiUrl");
        expect(LIVE_TIMING_CONFIG).toHaveProperty("defaults");
    });

    it("has getApiUrl function that returns correct paths", () => {
        expect(typeof LIVE_TIMING_CONFIG.getApiUrl).toBe("function");

        const classUrl = LIVE_TIMING_CONFIG.getApiUrl("test-org", "class");
        const indexedUrl = LIVE_TIMING_CONFIG.getApiUrl("test-org", "indexed");
        const rawUrl = LIVE_TIMING_CONFIG.getApiUrl("test-org", "raw");
        const runworkUrl = LIVE_TIMING_CONFIG.getApiUrl("test-org", "runwork");

        expect(typeof classUrl).toBe("string");
        expect(typeof indexedUrl).toBe("string");
        expect(typeof rawUrl).toBe("string");
        expect(typeof runworkUrl).toBe("string");
    });

    it("has defaults configuration", () => {
        expect(LIVE_TIMING_CONFIG.defaults).toHaveProperty("expectedRuns");
        expect(LIVE_TIMING_CONFIG.defaults).toHaveProperty("displayMode");
    });

    it("has expectedRuns as a number", () => {
        expect(typeof LIVE_TIMING_CONFIG.defaults.expectedRuns).toBe("number");
        expect(LIVE_TIMING_CONFIG.defaults.expectedRuns).toBeGreaterThan(0);
    });

    it("has displayMode set to autocross", () => {
        expect(LIVE_TIMING_CONFIG.defaults.displayMode).toBe("autocross");
    });
});
