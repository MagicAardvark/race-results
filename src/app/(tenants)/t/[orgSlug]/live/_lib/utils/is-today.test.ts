import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { isToday } from "./is-today";

describe("isToday", () => {
    const originalDate = Date;

    beforeEach(() => {
        // Mock Date to have consistent test results
        global.Date = class extends originalDate {
            constructor(...args: unknown[]) {
                if (args.length === 0) {
                    super(2024, 0, 15, 12, 0, 0); // Jan 15, 2024, 12:00 PM
                } else {
                    super(...(args as ConstructorParameters<typeof Date>));
                }
            }
        } as typeof Date;
    });

    afterEach(() => {
        global.Date = originalDate;
    });

    it("returns true for today's date", () => {
        const today = new Date(2024, 0, 15, 14, 30, 0);
        expect(isToday(today)).toBe(true);
    });

    it("returns false for yesterday", () => {
        const yesterday = new Date(2024, 0, 14, 12, 0, 0);
        expect(isToday(yesterday)).toBe(false);
    });

    it("returns false for tomorrow", () => {
        const tomorrow = new Date(2024, 0, 16, 12, 0, 0);
        expect(isToday(tomorrow)).toBe(false);
    });

    it("returns false for different month", () => {
        const differentMonth = new Date(2024, 1, 15, 12, 0, 0);
        expect(isToday(differentMonth)).toBe(false);
    });

    it("returns false for different year", () => {
        const differentYear = new Date(2023, 0, 15, 12, 0, 0);
        expect(isToday(differentYear)).toBe(false);
    });

    it("works regardless of time of day", () => {
        const earlyMorning = new Date(2024, 0, 15, 0, 0, 0);
        const lateNight = new Date(2024, 0, 15, 23, 59, 59);
        expect(isToday(earlyMorning)).toBe(true);
        expect(isToday(lateNight)).toBe(true);
    });
});
