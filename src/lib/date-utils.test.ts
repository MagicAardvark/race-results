import { describe, it, expect } from "vitest";
import {
    formatDate,
    formatDateRange,
    formatWithDateAndTime,
    getDateString,
    getEffectiveDateRangeForYear,
    isSingleDay,
} from "./date-utils";

describe("formatDate", () => {
    it("formats date with weekday shorthand", () => {
        const result = formatDate("2024-01-15");
        expect(result).toBe("Mon, January 15, 2024");
    });

    it("handles different months", () => {
        const result = formatDate("2024-12-25");
        expect(result).toBe("Wed, December 25, 2024");
    });

    it("handles leap year dates", () => {
        const result = formatDate("2024-02-29");
        expect(result).toBe("Thu, February 29, 2024");
    });

    it("handles different years", () => {
        const result = formatDate("2025-01-01");
        expect(result).toBe("Wed, January 1, 2025");
    });

    it("returns a properly formatted date string", () => {
        const result = formatDate("2024-06-10");
        expect(result).toBe("Mon, June 10, 2024");
    });

    it("handles ISO date strings via fallback parsing", () => {
        const result = formatDate("2024-06-10T12:00:00Z");
        expect(result).toContain("June");
        expect(result).toContain("10");
        expect(result).toContain("2024");
    });
});

describe("getDateString", () => {
    it("returns YYYY-MM-DD for a Date (local time)", () => {
        const date = new Date(2024, 0, 15); // Jan 15, 2024
        expect(getDateString(date)).toBe("2024-01-15");
    });

    it("pads month and day with zero", () => {
        expect(getDateString(new Date(2024, 0, 1))).toBe("2024-01-01");
        expect(getDateString(new Date(2024, 8, 5))).toBe("2024-09-05");
    });

    it("preserves YYYY-MM-DD string unchanged", () => {
        expect(getDateString("2024-06-10")).toBe("2024-06-10");
    });

    it("converts ISO date-time string to YYYY-MM-DD (local date)", () => {
        const result = getDateString("2024-12-31T23:59:59Z");
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
});

describe("isSingleDay", () => {
    it("returns true when start and end dates are the same", () => {
        expect(isSingleDay("2024-01-15", "2024-01-15")).toBe(true);
    });

    it("returns false when start and end dates are different", () => {
        expect(isSingleDay("2024-01-15", "2024-01-16")).toBe(false);
    });

    it("returns false for multi-day events", () => {
        expect(isSingleDay("2024-01-15", "2024-01-20")).toBe(false);
    });

    it("handles ISO date strings", () => {
        expect(
            isSingleDay("2024-01-15T00:00:00Z", "2024-01-15T00:00:00Z")
        ).toBe(true);
    });
});

describe("formatDateRange", () => {
    it("formats single day as one date", () => {
        expect(formatDateRange("2024-06-10", "2024-06-10")).toBe(
            "Mon, June 10, 2024"
        );
    });

    it("formats date range with en dash", () => {
        expect(formatDateRange("2024-06-10", "2024-06-12")).toBe(
            "Mon, June 10, 2024 – Wed, June 12, 2024"
        );
    });

    it("accepts Date objects", () => {
        const start = new Date(2024, 5, 10);
        const end = new Date(2024, 5, 12);
        expect(formatDateRange(start, end)).toBe(
            "Mon, June 10, 2024 – Wed, June 12, 2024"
        );
    });
});

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

describe("getEffectiveDateRangeForYear", () => {
    it("returns Jan 1 00:00 and Dec 31 23:59 EST for the given year", () => {
        const { effectiveFrom, effectiveTo } =
            getEffectiveDateRangeForYear(2024);
        // EST midnight Jan 1 = 05:00 UTC same day
        expect(effectiveFrom.getUTCFullYear()).toBe(2024);
        expect(effectiveFrom.getUTCMonth()).toBe(0);
        expect(effectiveFrom.getUTCDate()).toBe(1);
        expect(effectiveFrom.getUTCHours()).toBe(5);
        // EST 23:59:59 Dec 31 = 04:59:59 UTC next day
        expect(effectiveTo.getUTCFullYear()).toBe(2025);
        expect(effectiveTo.getUTCMonth()).toBe(0);
        expect(effectiveTo.getUTCDate()).toBe(1);
        expect(effectiveTo.getUTCHours()).toBe(4);
        expect(effectiveTo.getUTCMinutes()).toBe(59);
        expect(effectiveTo.getUTCSeconds()).toBe(59);
    });

    it("returns different ranges for different years", () => {
        const { effectiveFrom: from2023 } = getEffectiveDateRangeForYear(2023);
        const { effectiveFrom: from2025 } = getEffectiveDateRangeForYear(2025);
        expect(from2023.getUTCFullYear()).toBe(2023);
        expect(from2025.getUTCFullYear()).toBe(2025);
    });
});
