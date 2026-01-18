import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { RunTimeDisplay } from "./run-time-display";
import type { Run } from "@/dto/live-results";

describe("RunTimeDisplay", () => {
    it("renders clean run time", () => {
        const run: Run = {
            status: "clean",
            time: 57.222,
            penalty: 0,
            indexedTotalTime: 57.222,
            rawTotalTime: 57.222,
            isBest: false,
        };

        renderWithProviders(<RunTimeDisplay run={run} />);

        expect(screen.getByText(/57\.222/i)).toBeVisible();
    });

    it("renders dirty run time", () => {
        const run: Run = {
            status: "dirty",
            time: 58.524,
            penalty: 2,
            indexedTotalTime: 60.524,
            rawTotalTime: 60.524,
            isBest: false,
        };

        renderWithProviders(<RunTimeDisplay run={run} />);

        expect(screen.getByText(/58\.524/i)).toBeVisible();
    });

    it("renders dnf run", () => {
        const run: Run = {
            status: "dnf",
            time: 0,
            penalty: 0,
            indexedTotalTime: null,
            rawTotalTime: null,
            isBest: false,
        };

        renderWithProviders(<RunTimeDisplay run={run} />);

        expect(screen.getByText(/DNF/i)).toBeVisible();
    });

    it("applies bold styling for best run", () => {
        const run: Run = {
            status: "clean",
            time: 57.222,
            penalty: 0,
            indexedTotalTime: 57.222,
            rawTotalTime: 57.222,
            isBest: true,
        };

        const { container } = renderWithProviders(<RunTimeDisplay run={run} />);

        const element = container.querySelector("span");
        expect(element?.className).toMatch(/font-bold/);
    });

    it("does not apply bold styling for non-best run", () => {
        const run: Run = {
            status: "clean",
            time: 57.222,
            penalty: 0,
            indexedTotalTime: 57.222,
            rawTotalTime: 57.222,
            isBest: false,
        };

        const { container } = renderWithProviders(<RunTimeDisplay run={run} />);

        const element = container.querySelector("span");
        expect(element?.className).not.toMatch(/font-bold/);
    });
});
