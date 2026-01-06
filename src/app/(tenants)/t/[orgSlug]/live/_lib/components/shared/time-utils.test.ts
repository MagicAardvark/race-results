import { describe, it, expect } from "vitest";
import { formatTime, formatRunTime } from "./time-utils";
import type { Run } from "../../types";

describe("formatTime", () => {
    it("formats time to 3 decimal places", () => {
        expect(formatTime(45.123456)).toBe("45.123");
    });

    it("returns N/A for null", () => {
        expect(formatTime(null)).toBe("N/A");
    });

    it("returns N/A for undefined", () => {
        expect(formatTime(undefined)).toBe("N/A");
    });

    it("handles zero", () => {
        expect(formatTime(0)).toBe("0.000");
    });

    it("handles negative numbers", () => {
        expect(formatTime(-1.5)).toBe("-1.500");
    });

    it("rounds to 3 decimal places", () => {
        expect(formatTime(45.1239)).toBe("45.124");
    });
});

describe("formatRunTime", () => {
    it("formats CLEAN run", () => {
        const run: Run = {
            number: 1,
            time: 45.123,
            status: "CLEAN",
            coneCount: 0,
            isBest: false,
        };
        expect(formatRunTime(run)).toBe("45.123");
    });

    it("formats DIRTY run with cone count", () => {
        const run: Run = {
            number: 1,
            time: 45.123,
            status: "DIRTY",
            coneCount: 2,
            isBest: false,
        };
        expect(formatRunTime(run)).toBe("45.123+2");
    });

    it("formats DIRTY run with zero cones", () => {
        const run: Run = {
            number: 1,
            time: 45.123,
            status: "DIRTY",
            coneCount: 0,
            isBest: false,
        };
        expect(formatRunTime(run)).toBe("45.123+0");
    });

    it("formats DNF run", () => {
        const run: Run = {
            number: 1,
            time: 0,
            status: "DNF",
            coneCount: 0,
            isBest: false,
        };
        const result = formatRunTime(run);
        expect(result).toContain("DNF");
        // Time might be null/undefined, so just check it contains DNF
        expect(result).toMatch(/\(DNF\)/);
    });

    it("formats DSQ run", () => {
        const run: Run = {
            number: 1,
            time: 45.123,
            status: "DSQ",
            coneCount: 0,
            isBest: false,
        };
        expect(formatRunTime(run)).toBe("45.123 (DSQ)");
    });

    it("handles zero time in CLEAN run", () => {
        const run: Run = {
            number: 1,
            time: 0,
            status: "CLEAN",
            coneCount: 0,
            isBest: false,
        };
        expect(formatRunTime(run)).toBe("0.000");
    });
});
