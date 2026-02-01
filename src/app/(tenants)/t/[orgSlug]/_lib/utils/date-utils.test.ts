import { describe, it, expect } from "vitest";
import { formatDate, formatDateRange, isSingleDay } from "./date-utils";

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
});
