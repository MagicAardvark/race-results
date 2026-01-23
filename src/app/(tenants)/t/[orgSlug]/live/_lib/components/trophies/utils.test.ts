import { describe, it, expect } from "vitest";
import { calculateTrophyData, calculateSpecialAwards } from "./utils";
import type { ResultsEntry } from "@/dto/live-results";
import { mockClassResults } from "@/__tests__/mocks/mock-class-results";
import { mockRawResults } from "@/__tests__/mocks/mock-raw-results";

describe("calculateTrophyData", () => {
    it("returns empty array when classResultsMap is null", () => {
        const result = calculateTrophyData(null, [], null);
        expect(result).toEqual([]);
    });

    it("returns empty array when no trophy winners exist", () => {
        const classResultsMap = new Map([
            [
                "SS",
                {
                    entries: [
                        {
                            ...mockClassResults.results[0]!.entries[0]!,
                            isTrophy: false,
                        },
                    ],
                    longName: "Super Street",
                },
            ],
        ]);

        const result = calculateTrophyData(classResultsMap, ["SS"], null);
        expect(result).toEqual([]);
    });

    it("calculates trophy data for classes with trophy winners", () => {
        const classResultsMap = new Map([
            [
                "SS",
                {
                    entries: mockClassResults.results[0]!.entries,
                    longName: "Super Street",
                },
            ],
        ]);

        const result = calculateTrophyData(classResultsMap, ["SS"], null);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]?.className).toBe("SS");
        expect(result[0]?.classLongName).toBe("Super Street");
    });

    it("includes PAX times for Pro and Novice classes", () => {
        const proEntry = {
            ...mockClassResults.results[0]!.entries[0]!,
            class: "P",
            isTrophy: true,
        };

        const paxResults = {
            results: [
                {
                    ...proEntry,
                    indexedTotalTime: 42.456,
                },
            ],
        };

        const classResultsMap = new Map([
            [
                "P",
                {
                    entries: [proEntry],
                    longName: "Pro",
                },
            ],
        ]);

        const result = calculateTrophyData(classResultsMap, ["P"], paxResults);
        expect(result[0]?.entries[0]?.paxTime).toBe("42.456");
    });

    it("sets paxTime to null for non-Pro/Novice classes", () => {
        const classResultsMap = new Map([
            [
                "SS",
                {
                    entries: [
                        {
                            ...mockClassResults.results[0]!.entries[0]!,
                            isTrophy: true,
                        },
                    ],
                    longName: "Super Street",
                },
            ],
        ]);

        const result = calculateTrophyData(classResultsMap, ["SS"], null);
        expect(result[0]?.entries[0]?.paxTime).toBeNull();
    });

    it("sorts entries by position", () => {
        const classResultsMap = new Map([
            [
                "SS",
                {
                    entries: [
                        {
                            ...mockClassResults.results[0]!.entries[0]!,
                            classPosition: {
                                position: 2,
                                toNext: null,
                                toFirst: null,
                            },
                            isTrophy: true,
                        },
                        {
                            ...mockClassResults.results[0]!.entries[0]!,
                            classPosition: {
                                position: 1,
                                toNext: null,
                                toFirst: null,
                            },
                            isTrophy: true,
                        },
                    ],
                    longName: "Super Street",
                },
            ],
        ]);

        const result = calculateTrophyData(classResultsMap, ["SS"], null);
        expect(result[0]?.entries[0]?.position).toBe(1);
        expect(result[0]?.entries[1]?.position).toBe(2);
    });

    it("calculates total drivers and trophy count correctly", () => {
        const classResultsMap = new Map([
            [
                "SS",
                {
                    entries: [
                        {
                            ...mockClassResults.results[0]!.entries[0]!,
                            isTrophy: true,
                        },
                        {
                            ...mockClassResults.results[0]!.entries[0]!,
                            isTrophy: false,
                        },
                        {
                            ...mockClassResults.results[0]!.entries[0]!,
                            isTrophy: true,
                        },
                    ],
                    longName: "Super Street",
                },
            ],
        ]);

        const result = calculateTrophyData(classResultsMap, ["SS"], null);
        expect(result[0]?.totalDrivers).toBe(3);
        expect(result[0]?.trophyCount).toBe(2);
    });
});

describe("calculateSpecialAwards", () => {
    it("returns null when rawResults is null", () => {
        const result = calculateSpecialAwards(null);
        expect(result).toBeNull();
    });

    it("returns null when rawResults.results is undefined", () => {
        const result = calculateSpecialAwards({ results: [] });
        expect(result).not.toBeNull();
        expect(result?.coneKiller).toBeNull();
    });

    it("calculates Cone Killer award", () => {
        const rawResults = {
            results: [
                {
                    ...mockRawResults.results[0]!,
                    summary: {
                        totalClean: 3,
                        totalCones: 15,
                        totalDNF: 0,
                    },
                },
                {
                    ...mockRawResults.results[0]!,
                    driverName: "Other Driver",
                    summary: {
                        totalClean: 3,
                        totalCones: 10,
                        totalDNF: 0,
                    },
                },
            ],
        };

        const result = calculateSpecialAwards(rawResults);
        expect(result?.coneKiller).not.toBeNull();
        expect(result?.coneKiller?.totalCones).toBe(15);
    });

    it("calculates Speed Demon award", () => {
        const rawResults = {
            results: [
                {
                    ...mockRawResults.results[0]!,
                    segments: [
                        {
                            name: "Segment 1",
                            indexedTotalTime: 40.0,
                            rawTotalTime: 40.0,
                            totalClean: 1,
                            totalCones: 0,
                            totalDNF: 0,
                            runs: {
                                1: {
                                    status: "clean" as const,
                                    time: 40.0,
                                    rawTotalTime: 40.0,
                                    indexedTotalTime: 40.0,
                                    penalty: 0,
                                    isBest: true,
                                },
                            },
                        },
                    ],
                },
            ],
        };

        const result = calculateSpecialAwards(rawResults);
        expect(result?.speedDemon).not.toBeNull();
        expect(result?.speedDemon?.fastestTime).toBe(40.0);
    });

    it("calculates Squeaky Clean award", () => {
        const squeakyCleanEntry: ResultsEntry = {
            ...mockRawResults.results[0]!,
            summary: {
                totalClean: 4,
                totalCones: 0,
                totalDNF: 0,
            },
            segments: [
                {
                    name: "Segment 1",
                    indexedTotalTime: 45.0,
                    rawTotalTime: 45.0,
                    totalClean: 4,
                    totalCones: 0,
                    totalDNF: 0,
                    runs: {
                        1: {
                            status: "clean",
                            time: 45.0,
                            rawTotalTime: 45.0,
                            indexedTotalTime: 45.0,
                            penalty: 0,
                            isBest: true,
                        },
                        2: {
                            status: "clean",
                            time: 46.0,
                            rawTotalTime: 46.0,
                            indexedTotalTime: 46.0,
                            penalty: 0,
                            isBest: false,
                        },
                        3: {
                            status: "clean",
                            time: 47.0,
                            rawTotalTime: 47.0,
                            indexedTotalTime: 47.0,
                            penalty: 0,
                            isBest: false,
                        },
                        4: {
                            status: "clean",
                            time: 48.0,
                            rawTotalTime: 48.0,
                            indexedTotalTime: 48.0,
                            penalty: 0,
                            isBest: false,
                        },
                    },
                },
            ],
        };

        const rawResults = {
            results: [squeakyCleanEntry],
        };

        const result = calculateSpecialAwards(rawResults);
        expect(result?.squeakyClean.length).toBeGreaterThan(0);
        expect(result?.squeakyClean[0]?.name).toBe(
            squeakyCleanEntry.driverName
        );
    });

    it("does not include entries with DNFs in Squeaky Clean", () => {
        const entryWithDNF: ResultsEntry = {
            ...mockRawResults.results[0]!,
            summary: {
                totalClean: 3,
                totalCones: 0,
                totalDNF: 1,
            },
        };

        const rawResults = {
            results: [entryWithDNF],
        };

        const result = calculateSpecialAwards(rawResults);
        expect(result?.squeakyClean.length).toBe(0);
    });

    it("does not include entries with cones in Squeaky Clean", () => {
        const entryWithCones: ResultsEntry = {
            ...mockRawResults.results[0]!,
            summary: {
                totalClean: 4,
                totalCones: 1,
                totalDNF: 0,
            },
        };

        const rawResults = {
            results: [entryWithCones],
        };

        const result = calculateSpecialAwards(rawResults);
        expect(result?.squeakyClean.length).toBe(0);
    });

    it("calculates Consistency King award", () => {
        const consistentEntry: ResultsEntry = {
            ...mockRawResults.results[0]!,
            segments: [
                {
                    name: "Segment 1",
                    indexedTotalTime: 45.0,
                    rawTotalTime: 45.0,
                    totalClean: 3,
                    totalCones: 0,
                    totalDNF: 0,
                    runs: {
                        1: {
                            status: "clean" as const,
                            time: 45.0,
                            rawTotalTime: 45.0,
                            indexedTotalTime: 45.0,
                            penalty: 0,
                            isBest: true,
                        },
                        2: {
                            status: "clean" as const,
                            time: 45.1,
                            rawTotalTime: 45.1,
                            indexedTotalTime: 45.1,
                            penalty: 0,
                            isBest: false,
                        },
                        3: {
                            status: "clean" as const,
                            time: 45.2,
                            rawTotalTime: 45.2,
                            indexedTotalTime: 45.2,
                            penalty: 0,
                            isBest: false,
                        },
                    },
                },
            ],
        };

        const rawResults = {
            results: [consistentEntry],
        };

        const result = calculateSpecialAwards(rawResults);
        expect(result?.consistencyKing).not.toBeNull();
        expect(result?.consistencyKing?.variance).toBeGreaterThan(0);
    });
});
