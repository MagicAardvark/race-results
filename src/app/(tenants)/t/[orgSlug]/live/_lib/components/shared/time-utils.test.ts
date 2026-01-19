import { describe, it, expect } from "vitest";
import { formatTime, formatRunTime, formatClassPosition } from "./time-utils";
import type { Run } from "@/dto/live-results";

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
    it("formats clean run", () => {
        const run: Run = {
            status: "clean",
            time: 45.123,
            penalty: 0,
            indexedTotalTime: 45.123,
            rawTotalTime: 45.123,
            isBest: false,
        };
        expect(formatRunTime(run)).toBe("45.123");
    });

    it("formats dirty run with penalty", () => {
        const run: Run = {
            status: "dirty",
            time: 45.123,
            penalty: 2,
            indexedTotalTime: 47.123,
            rawTotalTime: 47.123,
            isBest: false,
        };
        expect(formatRunTime(run)).toBe("45.123+2");
    });

    it("formats dirty run with zero penalty (shows as clean)", () => {
        const run: Run = {
            status: "dirty",
            time: 45.123,
            penalty: 0,
            indexedTotalTime: 45.123,
            rawTotalTime: 45.123,
            isBest: false,
        };
        // Zero penalty should not show +0
        expect(formatRunTime(run)).toBe("45.123");
    });

    it("formats dnf run", () => {
        const run: Run = {
            status: "dnf",
            time: 0,
            penalty: 0,
            indexedTotalTime: null,
            rawTotalTime: null,
            isBest: false,
        };
        const result = formatRunTime(run);
        expect(result).toContain("DNF");
        expect(result).toMatch(/\(DNF\)/);
    });

    it("formats dsq run", () => {
        const run: Run = {
            status: "dsq",
            time: 45.123,
            penalty: 0,
            indexedTotalTime: null,
            rawTotalTime: null,
            isBest: false,
        };
        expect(formatRunTime(run)).toBe("45.123 (DSQ)");
    });

    it("handles zero time in clean run", () => {
        const run: Run = {
            status: "clean",
            time: 0,
            penalty: 0,
            indexedTotalTime: 0,
            rawTotalTime: 0,
            isBest: false,
        };
        expect(formatRunTime(run)).toBe("0.000");
    });
});

describe("formatClassPosition", () => {
    it("formats position with T when isTrophy is true", () => {
        expect(formatClassPosition(1, true)).toBe("1T");
        expect(formatClassPosition(5, true)).toBe("5T");
    });

    it("formats position without T when isTrophy is false", () => {
        expect(formatClassPosition(1, false)).toBe("1");
        expect(formatClassPosition(5, false)).toBe("5");
    });

    it("returns N/A for null position", () => {
        expect(formatClassPosition(null, true)).toBe("N/A");
        expect(formatClassPosition(null, false)).toBe("N/A");
    });

    it("returns N/A for undefined position", () => {
        expect(formatClassPosition(undefined, true)).toBe("N/A");
        expect(formatClassPosition(undefined, false)).toBe("N/A");
    });

    it("handles zero position", () => {
        expect(formatClassPosition(0, true)).toBe("0T");
        expect(formatClassPosition(0, false)).toBe("0");
    });
});
