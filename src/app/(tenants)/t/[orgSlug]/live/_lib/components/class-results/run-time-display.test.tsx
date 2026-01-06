import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { RunTimeDisplay } from "./run-time-display";
import type { Run } from "../../types";

describe("RunTimeDisplay", () => {
    it("renders clean run time", () => {
        const run: Run = {
            number: 1,
            status: "CLEAN",
            time: 57.222,
            coneCount: 0,
            isBest: false,
        };

        renderWithProviders(<RunTimeDisplay run={run} />);

        expect(screen.getByText(/57\.222/i)).toBeVisible();
    });

    it("renders dirty run time", () => {
        const run: Run = {
            number: 2,
            status: "DIRTY",
            time: 58.524,
            coneCount: 2,
            isBest: false,
        };

        renderWithProviders(<RunTimeDisplay run={run} />);

        expect(screen.getByText(/58\.524/i)).toBeVisible();
    });

    it("renders DNF run", () => {
        const run: Run = {
            number: 3,
            status: "DNF",
            time: 0,
            coneCount: 0,
            isBest: false,
        };

        renderWithProviders(<RunTimeDisplay run={run} />);

        expect(screen.getByText(/DNF/i)).toBeVisible();
    });

    it("applies bold styling for best run", () => {
        const run: Run = {
            number: 4,
            status: "CLEAN",
            time: 57.222,
            coneCount: 0,
            isBest: true,
        };

        const { container } = renderWithProviders(<RunTimeDisplay run={run} />);

        const element = container.querySelector("span");
        expect(element?.className).toMatch(/font-bold/);
    });

    it("does not apply bold styling for non-best run", () => {
        const run: Run = {
            number: 1,
            status: "CLEAN",
            time: 57.222,
            coneCount: 0,
            isBest: false,
        };

        const { container } = renderWithProviders(<RunTimeDisplay run={run} />);

        const element = container.querySelector("span");
        expect(element?.className).not.toMatch(/font-bold/);
    });
});
