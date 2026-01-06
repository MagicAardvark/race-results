import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { PaxEntry } from "./pax-entry";
import type { ClassResult } from "../../types";

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
                status: "",
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

describe("PaxEntry", () => {
    it("renders driver name", () => {
        renderWithProviders(<PaxEntry entry={mockEntry} maxGap={5.0} />);

        expect(screen.getByText("Sarah Johnson")).toBeVisible();
    });

    it("renders PAX position", () => {
        renderWithProviders(<PaxEntry entry={mockEntry} maxGap={5.0} />);

        expect(screen.getByText("6")).toBeVisible();
    });

    it("renders PAX time", () => {
        renderWithProviders(<PaxEntry entry={mockEntry} maxGap={5.0} />);

        expect(screen.getByText(/47\.837/i)).toBeVisible();
    });

    it("renders raw time from best run", () => {
        renderWithProviders(<PaxEntry entry={mockEntry} maxGap={5.0} />);

        expect(screen.getByText(/57\.222/i)).toBeVisible();
    });

    it("handles entry without best run", () => {
        const entryWithoutBest: ClassResult = {
            ...mockEntry,
            runInfo: {
                ...mockEntry.runInfo,
                runs: [
                    {
                        number: 1,
                        status: "DNF",
                        time: 0,
                        coneCount: 0,
                        isBest: false,
                    },
                ],
            },
        };

        renderWithProviders(<PaxEntry entry={entryWithoutBest} maxGap={5.0} />);

        expect(screen.getByText("Sarah Johnson")).toBeVisible();
    });

    it("renders gap display", () => {
        renderWithProviders(<PaxEntry entry={mockEntry} maxGap={5.0} />);

        expect(screen.getByText(/First: \+0\.961s/)).toBeVisible();
        expect(screen.getByText(/Next: \+0\.195s/)).toBeVisible();
    });
});
