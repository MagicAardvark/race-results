import { describe, it, expect } from "vitest";
import {
    scoreRun,
    consolidateRunStatusFromAxware,
    determineTrophyStatus,
    calculateGap,
    getPositionData,
    sortEntriesByTime,
    getSegmentTotalTimes,
    getOverallTotalTimes,
} from "../lib/scoring-utils";
import { InterimProcessedEntry } from "../lib/types";
import { Run } from "@/dto/live-results";

describe("scoring-utils", () => {
    describe("scoreRun", () => {
        it("scores clean run with no penalty", () => {
            const result = scoreRun([50.123, 0, "clean"], 2, 0.85);

            expect(result.status).toBe("clean");
            expect(result.time).toBe(50.123);
            expect(result.rawTotalTime).toBe(50.123);
            expect(result.indexedTotalTime).toBeCloseTo(42.60455, 3);
            expect(result.penalty).toBe(0);
        });

        it("scores dirty run with cone penalties", () => {
            const result = scoreRun([50.0, 3, "dirty"], 2, 0.85);

            expect(result.status).toBe("dirty");
            expect(result.rawTotalTime).toBe(56.0); // 50 + (3 * 2)
            expect(result.indexedTotalTime).toBeCloseTo(47.6, 3); // 56 * 0.85
        });

        it("handles DNF with null times", () => {
            const result = scoreRun([999, 0, "dnf"], 2, 0.85);

            expect(result.status).toBe("dnf");
            expect(result.rawTotalTime).toBeNull();
            expect(result.indexedTotalTime).toBeNull();
        });

        it("uses index value of 1 when undefined", () => {
            const result = scoreRun([50.0, 0, "clean"], 2, undefined);

            expect(result.rawTotalTime).toBe(50.0);
            expect(result.indexedTotalTime).toBe(50.0);
        });

        it("consolidates DSQ to DNF status", () => {
            const result = scoreRun([999, 0, "dsq"], 2, 0.85);

            expect(result.status).toBe("dnf");
            expect(result.rawTotalTime).toBeNull();
        });
    });

    describe("consolidateRunStatusFromAxware", () => {
        it("maps dsq to dnf", () => {
            expect(consolidateRunStatusFromAxware("dsq")).toBe("dnf");
        });

        it("maps out to dnf", () => {
            expect(consolidateRunStatusFromAxware("out")).toBe("dnf");
        });

        it("maps off to dnf", () => {
            expect(consolidateRunStatusFromAxware("off")).toBe("dnf");
        });

        it("preserves clean status", () => {
            expect(consolidateRunStatusFromAxware("clean")).toBe("clean");
        });

        it("preserves dirty status", () => {
            expect(consolidateRunStatusFromAxware("dirty")).toBe("dirty");
        });

        it("preserves dnf status", () => {
            expect(consolidateRunStatusFromAxware("dnf")).toBe("dnf");
        });
    });

    describe("determineTrophyStatus", () => {
        it("awards trophy with topn mode when position is within limit", () => {
            const result = determineTrophyStatus(
                { mode: "topn", value: 3 },
                2,
                10
            );

            expect(result).toBe(true);
        });

        it("denies trophy with topn mode when position exceeds limit", () => {
            const result = determineTrophyStatus(
                { mode: "topn", value: 3 },
                4,
                10
            );

            expect(result).toBe(false);
        });

        it("awards trophy with percentage mode at boundary", () => {
            // 33% of 6 = 1.98, rounds up to 2
            const result = determineTrophyStatus(
                { mode: "percentage", value: 33 },
                2,
                6
            );

            expect(result).toBe(true);
        });

        it("denies trophy with percentage mode outside boundary", () => {
            // 33% of 6 = 1.98, rounds up to 2
            const result = determineTrophyStatus(
                { mode: "percentage", value: 33 },
                3,
                6
            );

            expect(result).toBe(false);
        });

        it("rounds up trophy count with percentage mode", () => {
            // 25% of 5 = 1.25, rounds up to 2
            const result = determineTrophyStatus(
                { mode: "percentage", value: 25 },
                2,
                5
            );

            expect(result).toBe(true);
        });
    });

    describe("calculateGap", () => {
        const createEntry = (time: number | null): InterimProcessedEntry => ({
            entryKey: "test",
            msrId: "",
            email: "",
            class: "AS",
            carNumber: "1",
            driverName: "Test",
            carModel: "",
            carColor: "",
            sponsor: "",
            totalClean: 0,
            totalCones: 0,
            totalDNF: 0,
            indexedTotalTime: time,
            rawTotalTime: time,
            segments: [],
        });

        it("calculates positive gap when current is slower", () => {
            const current = createEntry(55.0);
            const other = createEntry(53.0);

            const gap = calculateGap(current, other, "indexedTotalTime");

            expect(gap).toBe(2.0);
        });

        it("calculates negative gap when current is faster", () => {
            const current = createEntry(53.0);
            const other = createEntry(55.0);

            const gap = calculateGap(current, other, "indexedTotalTime");

            expect(gap).toBe(-2.0);
        });

        it("returns null when current time is null", () => {
            const current = createEntry(null);
            const other = createEntry(53.0);

            const gap = calculateGap(current, other, "indexedTotalTime");

            expect(gap).toBeNull();
        });

        it("returns null when other time is null", () => {
            const current = createEntry(55.0);
            const other = createEntry(null);

            const gap = calculateGap(current, other, "indexedTotalTime");

            expect(gap).toBeNull();
        });
    });

    describe("getPositionData", () => {
        const entries: InterimProcessedEntry[] = [
            {
                entryKey: "first",
                msrId: "",
                email: "",
                class: "AS",
                carNumber: "1",
                driverName: "First",
                carModel: "",
                carColor: "",
                sponsor: "",
                totalClean: 0,
                totalCones: 0,
                totalDNF: 0,
                indexedTotalTime: 50.0,
                rawTotalTime: 50.0,
                segments: [],
            },
            {
                entryKey: "second",
                msrId: "",
                email: "",
                class: "AS",
                carNumber: "2",
                driverName: "Second",
                carModel: "",
                carColor: "",
                sponsor: "",
                totalClean: 0,
                totalCones: 0,
                totalDNF: 0,
                indexedTotalTime: 52.0,
                rawTotalTime: 52.0,
                segments: [],
            },
            {
                entryKey: "third",
                msrId: "",
                email: "",
                class: "AS",
                carNumber: "3",
                driverName: "Third",
                carModel: "",
                carColor: "",
                sponsor: "",
                totalClean: 0,
                totalCones: 0,
                totalDNF: 0,
                indexedTotalTime: 55.0,
                rawTotalTime: 55.0,
                segments: [],
            },
        ];

        it("calculates position data for first place", () => {
            const result = getPositionData(1, 0, entries, "indexedTotalTime");

            expect(result.position).toBe(1);
            expect(result.toNext).toBeNull();
            expect(result.toFirst).toBeNull();
        });

        it("calculates position data for second place", () => {
            const result = getPositionData(2, 1, entries, "indexedTotalTime");

            expect(result.position).toBe(2);
            expect(result.toNext).toBe(2.0); // 52 - 50
            expect(result.toFirst).toBe(2.0); // 52 - 50
        });

        it("calculates position data for third place", () => {
            const result = getPositionData(3, 2, entries, "indexedTotalTime");

            expect(result.position).toBe(3);
            expect(result.toNext).toBe(3.0); // 55 - 52
            expect(result.toFirst).toBe(5.0); // 55 - 50
        });
    });

    describe("sortEntriesByTime", () => {
        const entries: InterimProcessedEntry[] = [
            {
                entryKey: "entry-3",
                msrId: "",
                email: "",
                class: "AS",
                carNumber: "3",
                driverName: "Third",
                carModel: "",
                carColor: "",
                sponsor: "",
                totalClean: 0,
                totalCones: 0,
                totalDNF: 0,
                indexedTotalTime: 55.0,
                rawTotalTime: 55.0,
                segments: [],
            },
            {
                entryKey: "entry-1",
                msrId: "",
                email: "",
                class: "AS",
                carNumber: "1",
                driverName: "First",
                carModel: "",
                carColor: "",
                sponsor: "",
                totalClean: 0,
                totalCones: 0,
                totalDNF: 0,
                indexedTotalTime: 50.0,
                rawTotalTime: 50.0,
                segments: [],
            },
            {
                entryKey: "entry-2",
                msrId: "",
                email: "",
                class: "AS",
                carNumber: "2",
                driverName: "Second",
                carModel: "",
                carColor: "",
                sponsor: "",
                totalClean: 0,
                totalCones: 0,
                totalDNF: 0,
                indexedTotalTime: 52.0,
                rawTotalTime: 52.0,
                segments: [],
            },
        ];

        it("sorts entries by indexed time", () => {
            const { sorted, lookup } = sortEntriesByTime(
                entries,
                "indexedTotalTime"
            );

            expect(sorted[0].driverName).toBe("First");
            expect(sorted[1].driverName).toBe("Second");
            expect(sorted[2].driverName).toBe("Third");

            expect(lookup.get("entry-1")).toBe(0);
            expect(lookup.get("entry-2")).toBe(1);
            expect(lookup.get("entry-3")).toBe(2);
        });

        it("handles null times as infinity", () => {
            const entriesWithNull: InterimProcessedEntry[] = [
                { ...entries[0], indexedTotalTime: null },
                entries[1],
            ];

            const { sorted } = sortEntriesByTime(
                entriesWithNull,
                "indexedTotalTime"
            );

            expect(sorted[0].driverName).toBe("Second");
            expect(sorted[1].driverName).toBe("First");
        });
    });

    describe("getSegmentTotalTimes", () => {
        const runsInSegment: Record<number, Run> = {
            1: {
                status: "clean",
                time: 52.0,
                penalty: 0,
                indexedTotalTime: 44.2,
                rawTotalTime: 52.0,
                isBest: false,
            },
            2: {
                status: "clean",
                time: 50.0,
                penalty: 0,
                indexedTotalTime: 42.5,
                rawTotalTime: 50.0,
                isBest: true,
            },
            3: {
                status: "dirty",
                time: 48.0,
                penalty: 2,
                indexedTotalTime: 44.2,
                rawTotalTime: 52.0,
                isBest: false,
            },
        };

        it("returns times for best run with singlebest mode", () => {
            const result = getSegmentTotalTimes("singlebest", runsInSegment);

            expect(result.indexedTotalTime).toBe(42.5);
            expect(result.rawTotalTime).toBe(50.0);
        });

        it("returns null when no best run found", () => {
            const noBestRuns: Record<number, Run> = {
                1: { ...runsInSegment[1], isBest: false },
            };

            const result = getSegmentTotalTimes("singlebest", noBestRuns);

            expect(result.indexedTotalTime).toBeNull();
            expect(result.rawTotalTime).toBeNull();
        });
    });

    describe("getOverallTotalTimes", () => {
        const segments = [
            {
                name: "Segment 1",
                indexedTotalTime: 42.5,
                rawTotalTime: 50.0,
                totalClean: 1,
                totalCones: 0,
                totalDNF: 0,
                runs: {},
            },
            {
                name: "Segment 2",
                indexedTotalTime: 41.0,
                rawTotalTime: 48.0,
                totalClean: 1,
                totalCones: 0,
                totalDNF: 0,
                runs: {},
            },
            {
                name: "Segment 3",
                indexedTotalTime: 43.0,
                rawTotalTime: 51.0,
                totalClean: 1,
                totalCones: 0,
                totalDNF: 0,
                runs: {},
            },
        ];

        it("returns minimum time across segments with singlebest mode", () => {
            const result = getOverallTotalTimes("singlebest", segments);

            expect(result.indexedTotalTime).toBe(41.0);
            expect(result.rawTotalTime).toBe(48.0);
        });

        it("returns null when all segments have null times", () => {
            const nullSegments = segments.map((s) => ({
                ...s,
                indexedTotalTime: null,
                rawTotalTime: null,
            }));

            const result = getOverallTotalTimes("singlebest", nullSegments);

            expect(result.indexedTotalTime).toBeNull();
            expect(result.rawTotalTime).toBeNull();
        });

        it("skips null times when calculating minimum", () => {
            const mixedSegments = [
                segments[0],
                { ...segments[1], indexedTotalTime: null, rawTotalTime: null },
                segments[2],
            ];

            const result = getOverallTotalTimes("singlebest", mixedSegments);

            expect(result.indexedTotalTime).toBe(42.5);
            expect(result.rawTotalTime).toBe(50.0);
        });
    });
});
