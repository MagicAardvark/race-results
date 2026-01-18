import { describe, it, expect } from "vitest";
import { LiveResultsParser } from "../lib/live-results-parser";
import { EventConfiguration } from "@/dto/events";
import { LiveResultsSnapshot } from "@/dto/live-results/ingest";
import { ConfiguredCarClass } from "@/dto/classing";

const mockSnapshot: LiveResultsSnapshot = [
    {
        msrId: "",
        email: "",
        class: "as",
        carNumber: "123",
        driverName: "Jane Doe",
        carModel: "2008 Chevrolet Corvette Z06",
        carColor: "Blue",
        sponsor: "",
        runs: [
            [
                [56.562, 0, "clean"],
                [55.084, 0, "clean"],
                [56.745, 0, "clean"],
                [56.475, 0, "clean"],
                [55.041, 0, "clean"],
                [54.95, 0, "clean"],
                [54.793, 0, "clean"],
            ],
        ],
    },
    {
        msrId: "",
        email: "",
        class: "as",
        carNumber: "23",
        driverName: "John Smith",
        carModel: "2008 Chevrolet Corvette Z06",
        carColor: "Blue",
        sponsor: "",
        runs: [
            [
                [58.112, 0, "clean"],
                [54.997, 1, "dirty"],
                [54.869, 0, "clean"],
                [55.137, 0, "clean"],
                [53.923, 0, "clean"],
                [53.884, 1, "dirty"],
                [53.903, 1, "dirty"],
            ],
        ],
    },
];

const indexValue = 0.83;

const mockClassData = new Map<string, ConfiguredCarClass>();
mockClassData.set("AS", {
    classId: "class-1",
    shortName: "AS",
    longName: "A Street",
    indexValue: indexValue,
    classGroupId: null,
    groupShortName: null,
    groupLongName: null,
});

const mockEventConfig: EventConfiguration = {
    scoringMode: "singlebest",
    conePenaltyInSeconds: 2,
    trophyConfiguration: {
        mode: "percentage",
        value: 33,
    },
};

describe("LiveResultsParser", () => {
    describe("buildResults", () => {
        it("selects best run and applies cone penalties and index values", async () => {
            const parser = new LiveResultsParser(
                mockClassData,
                mockEventConfig,
                mockSnapshot
            );

            const results = await parser.buildResults();
            const firstDriver = results.classResults[0].entries[0];

            // John Smith: best clean run is 53.923
            expect(firstDriver.rawTotalTime).toBe(53.923);
            expect(firstDriver.indexedTotalTime).toBeCloseTo(
                53.923 * indexValue,
                3
            );
            expect(firstDriver.summary.totalClean).toBe(4);
            expect(firstDriver.summary.totalCones).toBe(3);
        });

        it("applies cone penalties when selecting best run", async () => {
            const snapshot: LiveResultsSnapshot = [
                {
                    ...mockSnapshot[0],
                    runs: [
                        [
                            [50.0, 2, "dirty"], // 50 + 4 = 54
                            [52.0, 0, "clean"], // 52 (best)
                        ],
                    ],
                },
            ];

            const parser = new LiveResultsParser(
                mockClassData,
                mockEventConfig,
                snapshot
            );

            const results = await parser.buildResults();
            expect(results.classResults[0].entries[0].rawTotalTime).toBe(52.0);
        });

        it("calculates position gaps correctly", async () => {
            const parser = new LiveResultsParser(
                mockClassData,
                mockEventConfig,
                mockSnapshot
            );

            const results = await parser.buildResults();
            const [first, second] = results.classResults[0].entries;

            // First place
            expect(first.classPosition.position).toBe(1);
            expect(first.classPosition.toFirst).toBeNull();
            expect(first.classPosition.toNext).toBeNull();

            // Second place
            expect(second.classPosition.position).toBe(2);
            expect(second.classPosition.toFirst).toBeCloseTo(0.722, 3);
            expect(second.classPosition.toNext).toBeCloseTo(0.722, 3);
        });

        it("calculates trophy status with percentage mode", async () => {
            const parser = new LiveResultsParser(
                mockClassData,
                mockEventConfig,
                mockSnapshot
            );

            const results = await parser.buildResults();
            const entries = results.classResults[0].entries;

            // 33% of 2 = 0.66, rounds up to 1
            expect(entries[0].isTrophy).toBe(true);
            expect(entries[1].isTrophy).toBe(false);
        });

        it("calculates trophy status with topn mode", async () => {
            const topnConfig: EventConfiguration = {
                ...mockEventConfig,
                trophyConfiguration: { mode: "topn", value: 1 },
            };

            const parser = new LiveResultsParser(
                mockClassData,
                topnConfig,
                mockSnapshot
            );

            const results = await parser.buildResults();
            const entries = results.classResults[0].entries;

            expect(entries[0].isTrophy).toBe(true);
            expect(entries[1].isTrophy).toBe(false);
        });

        it("treats DSQ, out, and off as DNF", async () => {
            const snapshot: LiveResultsSnapshot = [
                {
                    ...mockSnapshot[0],
                    runs: [
                        [
                            [50.0, 0, "clean"],
                            [0, 0, "dsq"],
                            [0, 0, "out"],
                            [0, 0, "off"],
                        ],
                    ],
                },
            ];

            const parser = new LiveResultsParser(
                mockClassData,
                mockEventConfig,
                snapshot
            );

            const results = await parser.buildResults();
            const entry = results.classResults[0].entries[0];

            expect(entry.summary.totalDNF).toBe(3);
            expect(entry.summary.totalClean).toBe(1);
            expect(entry.rawTotalTime).toBe(50.0);
        });

        it("uses minimum time across multiple segments", async () => {
            const snapshot: LiveResultsSnapshot = [
                {
                    ...mockSnapshot[0],
                    runs: [[[52.0, 0, "clean"]], [[51.0, 0, "clean"]]],
                },
            ];

            const parser = new LiveResultsParser(
                mockClassData,
                mockEventConfig,
                snapshot
            );

            const results = await parser.buildResults();
            const entry = results.classResults[0].entries[0];

            expect(entry.segments).toHaveLength(2);
            expect(entry.rawTotalTime).toBe(51.0);
            expect(entry.indexedTotalTime).toBeCloseTo(51.0 * indexValue, 3);
        });

        it("skips entries with unknown class data", async () => {
            const snapshot: LiveResultsSnapshot = [
                {
                    ...mockSnapshot[0],
                    class: "UNKNOWN",
                },
            ];

            const parser = new LiveResultsParser(
                mockClassData,
                mockEventConfig,
                snapshot
            );

            const results = await parser.buildResults();

            expect(results.classResults).toHaveLength(0);
            expect(results.indexedResults).toHaveLength(0);
            expect(results.rawResults).toHaveLength(0);
        });

        it("generates sorted indexed and raw results across all classes", async () => {
            const parser = new LiveResultsParser(
                mockClassData,
                mockEventConfig,
                mockSnapshot
            );

            const results = await parser.buildResults();

            // Both sorted with John Smith first (53.923 vs 54.793)
            expect(results.indexedResults).toHaveLength(2);
            expect(results.indexedResults[0].driverName).toBe("John Smith");
            expect(results.indexedResults[1].driverName).toBe("Jane Doe");

            expect(results.rawResults).toHaveLength(2);
            expect(results.rawResults[0].driverName).toBe("John Smith");
            expect(results.rawResults[1].driverName).toBe("Jane Doe");
        });
    });
});
