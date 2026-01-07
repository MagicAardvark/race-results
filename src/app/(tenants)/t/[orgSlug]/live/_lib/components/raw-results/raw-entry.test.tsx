import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { RawEntry } from "./raw-entry";
import type { RawResult } from "../../types";

const mockEntry: RawResult = {
    position: 1,
    entryInfo: {
        name: "Alex Martinez",
        carClass: "DST",
        number: 2,
        car: "2015 Scion FR-S",
        color: "Blue",
    },
    total: 57.306,
    time: 57.306,
    coneCount: 0,
    toFirst: 0,
    toNext: 0,
};

describe("RawEntry", () => {
    it("renders driver name", () => {
        renderWithProviders(<RawEntry entry={mockEntry} maxGap={5.0} />);

        expect(screen.getByText("Alex Martinez")).toBeVisible();
    });

    it("renders position", () => {
        renderWithProviders(<RawEntry entry={mockEntry} maxGap={5.0} />);

        expect(screen.getByText("1")).toBeVisible();
    });

    it("renders raw time", () => {
        renderWithProviders(<RawEntry entry={mockEntry} maxGap={5.0} />);

        expect(screen.getByText(/57\.306/i)).toBeVisible();
    });

    it("renders car class and number", () => {
        renderWithProviders(<RawEntry entry={mockEntry} maxGap={5.0} />);

        expect(screen.getByText(/DST #2/i)).toBeVisible();
    });

    it("renders car information", () => {
        renderWithProviders(<RawEntry entry={mockEntry} maxGap={5.0} />);

        expect(screen.getByText("2015 Scion FR-S")).toBeVisible();
    });

    it("renders gap display when gap exists", () => {
        const entryWithGap: RawResult = {
            ...mockEntry,
            toFirst: 1.234,
            toNext: 0.567,
        };

        renderWithProviders(<RawEntry entry={entryWithGap} maxGap={5.0} />);

        expect(screen.getByText(/First: \+1\.234s/)).toBeVisible();
        expect(screen.getByText(/Next: \+0\.567s/)).toBeVisible();
    });

    it("renders leader with no gap", () => {
        renderWithProviders(<RawEntry entry={mockEntry} maxGap={5.0} />);

        // Leader should not show gap text
        expect(screen.queryByText(/First:/)).not.toBeInTheDocument();
    });
});
