import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { RunData } from "./run-data";
import type { ResultsEntry } from "@/dto/live-results";

const mockEntry: ResultsEntry = {
    entryKey: "SS-1-Test Driver",
    msrId: "",
    email: "",
    class: "SS",
    carNumber: "1",
    driverName: "Test Driver",
    carModel: "Test Car",
    carColor: "Blue",
    sponsor: "",
    classPosition: { position: 1, toNext: null, toFirst: null },
    indexedPosition: { position: 1, toNext: null, toFirst: null },
    rawPosition: { position: 1, toNext: null, toFirst: null },
    isTrophy: true,
    summary: {
        totalClean: 4,
        totalCones: 9,
        totalDNF: 1,
    },
    indexedTotalTime: 47.837,
    rawTotalTime: 57.222,
    segments: [
        {
            name: "Segment 1",
            indexedTotalTime: 47.837,
            rawTotalTime: 57.222,
            totalClean: 4,
            totalCones: 9,
            totalDNF: 1,
            runs: {
                1: {
                    status: "clean",
                    time: 58.524,
                    penalty: 0,
                    indexedTotalTime: 48.571,
                    rawTotalTime: 58.524,
                    isBest: false,
                },
                2: {
                    status: "clean",
                    time: 57.646,
                    penalty: 0,
                    indexedTotalTime: 47.846,
                    rawTotalTime: 57.646,
                    isBest: false,
                },
                3: {
                    status: "clean",
                    time: 57.414,
                    penalty: 0,
                    indexedTotalTime: 47.653,
                    rawTotalTime: 57.414,
                    isBest: false,
                },
                4: {
                    status: "clean",
                    time: 57.222,
                    penalty: 0,
                    indexedTotalTime: 47.837,
                    rawTotalTime: 57.222,
                    isBest: true,
                },
            },
        },
    ],
};

describe("RunData", () => {
    it("renders all run displays", () => {
        renderWithProviders(<RunData entry={mockEntry} />);

        expect(screen.getByText(/58\.524/i)).toBeVisible();
        expect(screen.getByText(/57\.646/i)).toBeVisible();
        expect(screen.getByText(/57\.414/i)).toBeVisible();
        expect(screen.getByText(/57\.222/i)).toBeVisible();
    });

    it("renders segment name when multiple segments exist", () => {
        const multiSegmentEntry: ResultsEntry = {
            ...mockEntry,
            segments: [
                mockEntry.segments[0]!,
                {
                    name: "Segment 2",
                    indexedTotalTime: 47.837,
                    rawTotalTime: 57.222,
                    totalClean: 4,
                    totalCones: 9,
                    totalDNF: 1,
                    runs: {
                        1: {
                            status: "clean",
                            time: 58.524,
                            penalty: 0,
                            indexedTotalTime: 48.571,
                            rawTotalTime: 58.524,
                            isBest: false,
                        },
                    },
                },
            ],
        };

        renderWithProviders(<RunData entry={multiSegmentEntry} />);

        expect(screen.getByText("Segment 1")).toBeVisible();
        expect(screen.getByText("Segment 2")).toBeVisible();
    });

    it("does not render segment name when only one segment exists", () => {
        renderWithProviders(<RunData entry={mockEntry} />);

        // When there's only one segment, the name should not be shown
        expect(screen.queryByText("Segment 1")).not.toBeInTheDocument();
    });

    it("renders stats grid with correct values", () => {
        renderWithProviders(<RunData entry={mockEntry} />);

        expect(screen.getByText("Cones")).toBeVisible();
        expect(screen.getByText("9")).toBeVisible();
        expect(screen.getByText("Clean Runs")).toBeVisible();
        expect(screen.getByText("4")).toBeVisible();
        expect(screen.getByText("DNF")).toBeVisible();
        expect(screen.getByText("1")).toBeVisible();
    });

    it("renders total stats at bottom", () => {
        renderWithProviders(<RunData entry={mockEntry} />);

        expect(screen.getByText("Cones")).toBeVisible();
        expect(screen.getByText("Clean Runs")).toBeVisible();
        expect(screen.getByText("DNF")).toBeVisible();
    });

    it("handles empty segments", () => {
        const emptyEntry: ResultsEntry = {
            ...mockEntry,
            segments: [],
        };

        renderWithProviders(<RunData entry={emptyEntry} />);

        expect(screen.getByText("Cones")).toBeVisible();
        expect(screen.getByText("Clean Runs")).toBeVisible();
        expect(screen.getByText("DNF")).toBeVisible();
    });

    it("renders stats with zero values", () => {
        const zeroEntry: ResultsEntry = {
            ...mockEntry,
            summary: {
                totalClean: 0,
                totalCones: 0,
                totalDNF: 0,
            },
            segments: [
                {
                    ...mockEntry.segments[0],
                    totalClean: 0,
                    totalCones: 0,
                    totalDNF: 0,
                },
            ],
        };

        renderWithProviders(<RunData entry={zeroEntry} />);

        // Multiple zeros appear, check that stats are rendered
        const zeroElements = screen.getAllByText("0");
        expect(zeroElements.length).toBeGreaterThanOrEqual(3);
    });
});
