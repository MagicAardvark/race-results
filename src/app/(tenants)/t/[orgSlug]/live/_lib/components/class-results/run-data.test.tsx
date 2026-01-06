import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { RunData } from "./run-data";
import type { RunInfo } from "../../types";

const mockRunInfo: RunInfo = {
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
};

describe("RunData", () => {
    it("renders all run displays", () => {
        renderWithProviders(<RunData runInfo={mockRunInfo} />);

        expect(screen.getByText(/58\.524/i)).toBeVisible();
        expect(screen.getByText(/57\.646/i)).toBeVisible();
        expect(screen.getByText(/57\.414/i)).toBeVisible();
        expect(screen.getByText(/57\.222/i)).toBeVisible();
    });

    it("renders stats grid with correct values", () => {
        renderWithProviders(<RunData runInfo={mockRunInfo} />);

        expect(screen.getByText("Cones")).toBeVisible();
        expect(screen.getByText("9")).toBeVisible();
        expect(screen.getByText("Clean Runs")).toBeVisible();
        expect(screen.getByText("4")).toBeVisible();
        expect(screen.getByText("DNF")).toBeVisible();
        expect(screen.getByText("1")).toBeVisible();
    });

    it("handles empty runs array", () => {
        const emptyRunInfo: RunInfo = {
            ...mockRunInfo,
            runs: [],
        };

        renderWithProviders(<RunData runInfo={emptyRunInfo} />);

        expect(screen.getByText("Cones")).toBeVisible();
        expect(screen.getByText("Clean Runs")).toBeVisible();
        expect(screen.getByText("DNF")).toBeVisible();
    });

    it("renders stats with zero values", () => {
        const zeroRunInfo: RunInfo = {
            ...mockRunInfo,
            coneCount: 0,
            cleanCount: 0,
            dnfCount: 0,
        };

        renderWithProviders(<RunData runInfo={zeroRunInfo} />);

        // Multiple zeros appear, check that stats are rendered
        const zeroElements = screen.getAllByText("0");
        expect(zeroElements.length).toBeGreaterThanOrEqual(3);
    });
});
