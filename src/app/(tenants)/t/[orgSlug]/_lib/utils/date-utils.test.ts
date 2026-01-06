import { describe, it, expect } from "vitest";
import { formatDate, isSingleDay } from "./date-utils";

describe("formatDate", () => {
    it("formats date correctly", () => {
        const result = formatDate("2024-01-15");
        expect(result).toBe("January 15, 2024");
    });

    it("handles different months", () => {
        const result = formatDate("2024-12-25");
        expect(result).toBe("December 25, 2024");
    });

    it("handles leap year dates", () => {
        const result = formatDate("2024-02-29");
        expect(result).toBe("February 29, 2024");
    });

    it("handles different years", () => {
        const result = formatDate("2025-01-01");
        expect(result).toBe("January 1, 2025");
    });

    it("returns a properly formatted date string", () => {
        const result = formatDate("2024-06-10");
        expect(result).toBe("June 10, 2024");
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
