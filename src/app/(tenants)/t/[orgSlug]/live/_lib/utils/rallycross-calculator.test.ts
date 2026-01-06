import { describe, it, expect } from "vitest";
import {
    calculateRallycrossTimes,
    processClassResults,
} from "./rallycross-calculator";
import type { ClassResult } from "../types";
import { DisplayMode } from "../types";

const mockEntry: ClassResult = {
    car: "2022 Porsche GT4",
    carClassGroup: "SS",
    carClass: "SS",
    color: "Frozen Berry",
    name: "Sarah Johnson",
    number: "35",
    position: "1T",
    paxPosition: 6,
    runInfo: {
        cleanCount: 4,
        coneCount: 9,
        dnfCount: 1,
        toFirstInClass: 0,
        toNextInClass: 0,
        toFirstInPax: 0.961,
        toNextInPax: 0.195,
        runs: [
            {
                number: 1,
                status: "CLEAN",
                time: 58.524,
                coneCount: 0,
                isBest: false,
            },
            {
                number: 2,
                status: "CLEAN",
                time: 57.646,
                coneCount: 0,
                isBest: false,
            },
            {
                number: 3,
                status: "CLEAN",
                time: 57.414,
                coneCount: 0,
                isBest: false,
            },
            {
                number: 4,
                status: "CLEAN",
                time: 57.222,
                coneCount: 0,
                isBest: true,
            },
        ],
        total: 57.222,
        paxTime: 47.837,
        rallyCrossTime: 0,
        rallyCrossToFirst: 0,
        rallyCrossToNext: 0,
    },
};

describe("calculateRallycrossTimes", () => {
    it("calculates rallycross time from runs", () => {
        const entries = [mockEntry];
        const result = calculateRallycrossTimes(entries, 4);

        expect(result[0].runInfo.rallyCrossTime).toBe(
            58.524 + 57.646 + 57.414 + 57.222
        );
    });

    it("adds penalty for DNF runs", () => {
        const entryWithDNF: ClassResult = {
            ...mockEntry,
            runInfo: {
                ...mockEntry.runInfo,
                runs: [
                    {
                        number: 1,
                        status: "DNF",
                        time: 50.0,
                        coneCount: 0,
                        isBest: false,
                    },
                    {
                        number: 2,
                        status: "CLEAN",
                        time: 55.0,
                        coneCount: 0,
                        isBest: false,
                    },
                ],
            },
        };

        const result = calculateRallycrossTimes([entryWithDNF], 2);

        // DNF: 50 + 10 = 60, CLEAN: 55
        expect(result[0].runInfo.rallyCrossTime).toBe(60 + 55);
    });

    it("adds penalty for cones", () => {
        const entryWithCones: ClassResult = {
            ...mockEntry,
            runInfo: {
                ...mockEntry.runInfo,
                runs: [
                    {
                        number: 1,
                        status: "CLEAN",
                        time: 50.0,
                        coneCount: 2,
                        isBest: false,
                    },
                    {
                        number: 2,
                        status: "CLEAN",
                        time: 55.0,
                        coneCount: 1,
                        isBest: false,
                    },
                ],
            },
        };

        const result = calculateRallycrossTimes([entryWithCones], 2);

        // Run 1: 50 + (2 * 2) = 54, Run 2: 55 + (1 * 2) = 57
        expect(result[0].runInfo.rallyCrossTime).toBe(54 + 57);
    });

    it("pads missing runs with default values", () => {
        const entryWithFewRuns: ClassResult = {
            ...mockEntry,
            runInfo: {
                ...mockEntry.runInfo,
                runs: [
                    {
                        number: 1,
                        status: "CLEAN",
                        time: 50.0,
                        coneCount: 0,
                        isBest: false,
                    },
                ],
            },
        };

        const result = calculateRallycrossTimes([entryWithFewRuns], 4);

        expect(result[0].runInfo.runs).toHaveLength(4);
        expect(result[0].runInfo.runs[1].time).toBe(100);
        expect(result[0].runInfo.runs[1].status).toBe("CLEAN");
    });

    it("sorts entries by rallycross time", () => {
        const entry1: ClassResult = {
            ...mockEntry,
            name: "Driver 1",
            runInfo: {
                ...mockEntry.runInfo,
                runs: [
                    {
                        number: 1,
                        status: "CLEAN",
                        time: 60.0,
                        coneCount: 0,
                        isBest: false,
                    },
                ],
            },
        };

        const entry2: ClassResult = {
            ...mockEntry,
            name: "Driver 2",
            runInfo: {
                ...mockEntry.runInfo,
                runs: [
                    {
                        number: 1,
                        status: "CLEAN",
                        time: 50.0,
                        coneCount: 0,
                        isBest: false,
                    },
                ],
            },
        };

        const result = calculateRallycrossTimes([entry1, entry2], 1);

        expect(result[0].name).toBe("Driver 2");
        expect(result[1].name).toBe("Driver 1");
    });

    it("calculates positions and gaps", () => {
        const entry1: ClassResult = {
            ...mockEntry,
            name: "Driver 1",
            runInfo: {
                ...mockEntry.runInfo,
                runs: [
                    {
                        number: 1,
                        status: "CLEAN",
                        time: 50.0,
                        coneCount: 0,
                        isBest: false,
                    },
                ],
            },
        };

        const entry2: ClassResult = {
            ...mockEntry,
            name: "Driver 2",
            runInfo: {
                ...mockEntry.runInfo,
                runs: [
                    {
                        number: 1,
                        status: "CLEAN",
                        time: 55.0,
                        coneCount: 0,
                        isBest: false,
                    },
                ],
            },
        };

        const result = calculateRallycrossTimes([entry1, entry2], 1);

        expect(result[0].position).toBe("1");
        expect(result[0].runInfo.rallyCrossToFirst).toBe(0);
        expect(result[0].runInfo.rallyCrossToNext).toBe(0);

        expect(result[1].position).toBe("2");
        expect(result[1].runInfo.rallyCrossToFirst).toBe(5.0);
        expect(result[1].runInfo.rallyCrossToNext).toBe(5.0);
    });
});

describe("processClassResults", () => {
    const mockResults: Record<string, ClassResult[]> = {
        SS: [mockEntry],
    };

    it("returns results unchanged for autocross mode", () => {
        const result = processClassResults(mockResults, DisplayMode.autocross);

        expect(result).toEqual(mockResults);
    });

    it("processes results for rallycross mode", () => {
        const result = processClassResults(mockResults, DisplayMode.rallycross);

        expect(result.SS[0].runInfo.rallyCrossTime).toBeGreaterThan(0);
        expect(result.SS[0].runInfo.rallyCrossToFirst).toBe(0);
    });

    it("processes multiple classes", () => {
        const multiClassResults: Record<string, ClassResult[]> = {
            SS: [mockEntry],
            STR: [
                {
                    ...mockEntry,
                    carClass: "STR",
                    name: "Driver 2",
                },
            ],
        };

        const result = processClassResults(
            multiClassResults,
            DisplayMode.rallycross
        );

        expect(result.SS).toBeDefined();
        expect(result.STR).toBeDefined();
        expect(result.SS[0].runInfo.rallyCrossTime).toBeGreaterThan(0);
        expect(result.STR[0].runInfo.rallyCrossTime).toBeGreaterThan(0);
    });
});
