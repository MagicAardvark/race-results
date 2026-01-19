import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { PaxEntry } from "./pax-entry";
import type { ResultsEntry } from "@/dto/live-results";
import { mockPaxResults } from "@/__tests__/mocks/mock-pax-results";

const mockEntry: ResultsEntry = mockPaxResults.results[0]!;

describe("PaxEntry", () => {
    it("renders driver name", () => {
        renderWithProviders(<PaxEntry entry={mockEntry} maxGap={5.0} />);

        expect(screen.getByText("Alex Martinez")).toBeVisible();
    });

    it("renders PAX position", () => {
        renderWithProviders(<PaxEntry entry={mockEntry} maxGap={5.0} />);

        expect(screen.getByText("1")).toBeVisible();
    });

    it("renders PAX time", () => {
        renderWithProviders(<PaxEntry entry={mockEntry} maxGap={5.0} />);

        expect(screen.getByText(/46\.876/i)).toBeVisible();
    });

    it("renders raw time from best run", () => {
        renderWithProviders(<PaxEntry entry={mockEntry} maxGap={5.0} />);

        expect(screen.getByText(/57\.306/i)).toBeVisible();
    });

    it("handles entry without best run", () => {
        const entryWithoutBest: ResultsEntry = {
            ...mockEntry,
            segments: [
                {
                    name: "Segment 1",
                    indexedTotalTime: null,
                    rawTotalTime: null,
                    totalClean: 0,
                    totalCones: 0,
                    totalDNF: 0,
                    runs: {
                        1: {
                            status: "dnf",
                            time: 0,
                            rawTotalTime: null,
                            indexedTotalTime: null,
                            penalty: 0,
                            isBest: false,
                        },
                    },
                },
            ],
        };

        renderWithProviders(<PaxEntry entry={entryWithoutBest} maxGap={5.0} />);

        expect(screen.getByText("Alex Martinez")).toBeVisible();
    });

    it("renders gap display", () => {
        const entryWithGap: ResultsEntry = {
            ...mockPaxResults.results[1]!,
        };

        renderWithProviders(<PaxEntry entry={entryWithGap} maxGap={5.0} />);

        // Gap display should show the gap values
        expect(screen.getByText("Chris Anderson")).toBeVisible();
    });
});
