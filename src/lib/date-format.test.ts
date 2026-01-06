import { describe, it, expect } from "vitest";
import { formatWithDateAndTime } from "./date-format";

describe("formatWithDateAndTime", () => {
    it("formats date with date and time", () => {
        const date = new Date(2024, 0, 15, 14, 30, 0);
        const result = formatWithDateAndTime(date);
        expect(result).toContain("Jan");
        expect(result).toContain("15");
        expect(result).toContain("2024");
        expect(result).toMatch(/\d{1,2}:\d{2}/); // Time format
    });

    it("formats different dates correctly", () => {
        const date1 = new Date(2024, 11, 25, 9, 15, 0);
        const date2 = new Date(2023, 5, 10, 23, 45, 0);

        const result1 = formatWithDateAndTime(date1);
        const result2 = formatWithDateAndTime(date2);

        expect(result1).not.toBe(result2);
        expect(result1).toContain("Dec");
        expect(result2).toContain("Jun");
    });

    it("handles midnight", () => {
        const date = new Date(2024, 0, 1, 0, 0, 0);
        const result = formatWithDateAndTime(date);
        expect(result).toBeTruthy();
        expect(result.length).toBeGreaterThan(0);
    });

    it("handles end of day", () => {
        const date = new Date(2024, 0, 1, 23, 59, 59);
        const result = formatWithDateAndTime(date);
        expect(result).toBeTruthy();
        expect(result.length).toBeGreaterThan(0);
    });
});
