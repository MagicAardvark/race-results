import { describe, it, expect } from "vitest";
import { calculateMaxGapFromTimes } from "./gap-calculator";

describe("calculateMaxGapFromTimes", () => {
    it("returns default value for empty array", () => {
        expect(calculateMaxGapFromTimes([])).toBe(3.0);
    });

    it("calculates gap from single time", () => {
        expect(calculateMaxGapFromTimes([45.123])).toBe(0.1);
    });

    it("calculates gap from multiple times", () => {
        const times = [45.0, 45.5, 46.0, 46.5, 47.0, 47.5, 48.0];
        const result = calculateMaxGapFromTimes(times);
        // 70th percentile (5th element, 0-indexed) is 47.0
        // Gap from fastest (45.0) is 2.0
        expect(result).toBeGreaterThan(0);
        expect(result).toBeLessThanOrEqual(3.0);
    });

    it("returns minimum gap of 0.1", () => {
        const times = [45.0, 45.01, 45.02, 45.03, 45.04];
        const result = calculateMaxGapFromTimes(times);
        expect(result).toBeGreaterThanOrEqual(0.1);
    });

    it("handles unsorted times", () => {
        const times = [50.0, 45.0, 48.0, 46.0, 47.0];
        const result = calculateMaxGapFromTimes(times);
        expect(result).toBeGreaterThan(0);
    });

    it("handles times with duplicates", () => {
        const times = [45.0, 45.0, 45.0, 46.0, 47.0];
        const result = calculateMaxGapFromTimes(times);
        expect(result).toBeGreaterThanOrEqual(0.1);
    });
});
