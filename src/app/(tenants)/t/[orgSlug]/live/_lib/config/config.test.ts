import { describe, it, expect } from "vitest";
import { LIVE_TIMING_CONFIG } from "./config";

describe("LIVE_TIMING_CONFIG", () => {
    it("exports config object with api and defaults", () => {
        expect(LIVE_TIMING_CONFIG).toHaveProperty("api");
        expect(LIVE_TIMING_CONFIG).toHaveProperty("defaults");
    });

    it("has api configuration with all endpoints", () => {
        expect(LIVE_TIMING_CONFIG.api).toHaveProperty("classResults");
        expect(LIVE_TIMING_CONFIG.api).toHaveProperty("paxResults");
        expect(LIVE_TIMING_CONFIG.api).toHaveProperty("rawResults");
        expect(LIVE_TIMING_CONFIG.api).toHaveProperty("runWork");
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

    it("has all API URLs as strings", () => {
        expect(typeof LIVE_TIMING_CONFIG.api.classResults).toBe("string");
        expect(typeof LIVE_TIMING_CONFIG.api.paxResults).toBe("string");
        expect(typeof LIVE_TIMING_CONFIG.api.rawResults).toBe("string");
        expect(typeof LIVE_TIMING_CONFIG.api.runWork).toBe("string");
    });
});
