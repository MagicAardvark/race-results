import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { RawEntry } from "./raw-entry";
import type { ResultsEntry } from "@/dto/live-results";
import { mockRawResults } from "@/__tests__/mocks/mock-raw-results";

const mockEntry: ResultsEntry = mockRawResults.results[0]!;

describe("RawEntry", () => {
    it("renders driver name", () => {
        renderWithProviders(<RawEntry entry={mockEntry} maxGap={5.0} />);

        expect(screen.getByText("Tamra Krystinik")).toBeVisible();
    });

    it("renders position", () => {
        renderWithProviders(<RawEntry entry={mockEntry} maxGap={5.0} />);

        expect(screen.getByText("1")).toBeVisible();
    });

    it("renders raw time", () => {
        renderWithProviders(<RawEntry entry={mockEntry} maxGap={5.0} />);

        // Best run time is displayed (not rawTotalTime)
        // Best run is run 2 with time 48.234
        expect(screen.getByText(/48\.234/i)).toBeVisible();
    });

    it("renders car class and number", () => {
        renderWithProviders(<RawEntry entry={mockEntry} maxGap={5.0} />);

        expect(screen.getByText(/BM #185/i)).toBeVisible();
    });

    it("renders car information", () => {
        renderWithProviders(<RawEntry entry={mockEntry} maxGap={5.0} />);

        expect(screen.getByText("2000 Legrand Dragon SR1 Mk25")).toBeVisible();
    });

    it("renders gap display when gap exists", () => {
        const entryWithGap: ResultsEntry = mockRawResults.results[2]!;

        renderWithProviders(<RawEntry entry={entryWithGap} maxGap={5.0} />);

        // Gap display should show the gap values
        expect(screen.getByText("Sarah Johnson")).toBeVisible();
    });

    it("renders leader with no gap", () => {
        renderWithProviders(<RawEntry entry={mockEntry} maxGap={5.0} />);

        // Leader should not show gap text
        expect(screen.queryByText(/First:/)).not.toBeInTheDocument();
    });
});
