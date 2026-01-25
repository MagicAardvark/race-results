import { describe, it, expect } from "vitest";
import { LIVE_TIMING_CONFIG } from "./config";

describe("LIVE_TIMING_CONFIG", () => {
    it("exports config object with getApiUrl", () => {
        expect(LIVE_TIMING_CONFIG).toHaveProperty("getApiUrl");
    });

    it("has getApiUrl function that returns correct paths", () => {
        expect(typeof LIVE_TIMING_CONFIG.getApiUrl).toBe("function");

        const classUrl = LIVE_TIMING_CONFIG.getApiUrl("test-org", "class");
        const indexedUrl = LIVE_TIMING_CONFIG.getApiUrl("test-org", "indexed");
        const rawUrl = LIVE_TIMING_CONFIG.getApiUrl("test-org", "raw");
        const runworkUrl = LIVE_TIMING_CONFIG.getApiUrl("test-org", "runwork");

        expect(classUrl).toBe("/api/test-org/live/results/class");
        expect(indexedUrl).toBe("/api/test-org/live/results/indexed");
        expect(rawUrl).toBe("/api/test-org/live/results/raw");
        expect(runworkUrl).toBe("/api/test-org/live/results/runwork");
    });
});
