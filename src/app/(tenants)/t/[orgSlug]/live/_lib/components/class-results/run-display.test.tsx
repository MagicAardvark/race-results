import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { RunDisplay } from "./run-display";
import type { Run } from "../../types";

describe("RunDisplay", () => {
    it("renders clean run", () => {
        const run: Run = {
            number: 1,
            status: "CLEAN",
            time: 57.222,
            coneCount: 0,
            isBest: false,
        };

        renderWithProviders(<RunDisplay run={run} />);

        expect(screen.getByText(/1/i)).toBeVisible();
        expect(screen.getByText(/57\.222/i)).toBeVisible();
    });

    it("renders dirty run with cone count", () => {
        const run: Run = {
            number: 2,
            status: "DIRTY",
            time: 58.524,
            coneCount: 2,
            isBest: false,
        };

        renderWithProviders(<RunDisplay run={run} />);

        expect(screen.getByText(/Run 2/i)).toBeVisible();
        // Dirty runs show time+coneCount format: "58.524+2"
        expect(screen.getByText(/58\.524\+2/i)).toBeVisible();
    });

    it("renders DNF run", () => {
        const run: Run = {
            number: 3,
            status: "DNF",
            time: 0,
            coneCount: 0,
            isBest: false,
        };

        renderWithProviders(<RunDisplay run={run} />);

        expect(screen.getByText(/3/i)).toBeVisible();
        expect(screen.getByText(/DNF/i)).toBeVisible();
    });

    it("renders best run with highlight", () => {
        const run: Run = {
            number: 4,
            status: "CLEAN",
            time: 57.222,
            coneCount: 0,
            isBest: true,
        };

        const { container } = renderWithProviders(<RunDisplay run={run} />);

        const element = container.querySelector("span[data-slot='badge']");
        expect(element?.className).toBeDefined();
        expect(element?.className).toMatch(/ring-green/);
    });

    it("does not highlight non-best run", () => {
        const run: Run = {
            number: 1,
            status: "CLEAN",
            time: 57.222,
            coneCount: 0,
            isBest: false,
        };

        const { container } = renderWithProviders(<RunDisplay run={run} />);

        const element = container.querySelector("span[data-slot='badge']");
        expect(element?.className).toBeDefined();
        expect(element?.className).not.toMatch(/ring-green/);
    });

    it("renders run with single cone", () => {
        const run: Run = {
            number: 2,
            status: "DIRTY",
            time: 58.524,
            coneCount: 1,
            isBest: false,
        };

        renderWithProviders(<RunDisplay run={run} />);

        expect(screen.getByText(/Run 2/i)).toBeVisible();
        // Dirty runs show time+coneCount format: "58.524+1"
        expect(screen.getByText(/58\.524\+1/i)).toBeVisible();
    });
});
