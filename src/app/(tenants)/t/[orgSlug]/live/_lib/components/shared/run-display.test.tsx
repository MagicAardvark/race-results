import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { RunDisplay } from "./run-display";
import type { Run } from "@/dto/live-results";

describe("RunDisplay", () => {
    it("renders clean run", () => {
        const run: Run = {
            status: "clean",
            time: 57.222,
            penalty: 0,
            indexedTotalTime: 57.222,
            rawTotalTime: 57.222,
            isBest: false,
        };

        renderWithProviders(<RunDisplay runNumber={1} run={run} />);

        expect(screen.getByText(/1/i)).toBeVisible();
        expect(screen.getByText(/57\.222/i)).toBeVisible();
    });

    it("renders dirty run with penalty", () => {
        const run: Run = {
            status: "dirty",
            time: 58.524,
            penalty: 2,
            indexedTotalTime: 60.524,
            rawTotalTime: 60.524,
            isBest: false,
        };

        renderWithProviders(<RunDisplay runNumber={2} run={run} />);

        expect(screen.getByText(/Run 2/i)).toBeVisible();
        // Dirty runs show time+penalty format: "58.524+2"
        expect(screen.getByText(/58\.524\+2/i)).toBeVisible();
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

        renderWithProviders(<RunDisplay runNumber={3} run={run} />);

        expect(screen.getByText(/3/i)).toBeVisible();
        expect(screen.getByText(/DNF/i)).toBeVisible();
    });

    it("renders best run with highlight", () => {
        const run: Run = {
            status: "clean",
            time: 57.222,
            penalty: 0,
            indexedTotalTime: 57.222,
            rawTotalTime: 57.222,
            isBest: true,
        };

        const { container } = renderWithProviders(
            <RunDisplay runNumber={4} run={run} />
        );

        const element = container.querySelector("span[data-slot='badge']");
        expect(element?.className).toBeDefined();
        expect(element?.className).toMatch(/ring-green/);
    });

    it("does not highlight non-best run", () => {
        const run: Run = {
            status: "clean",
            time: 57.222,
            penalty: 0,
            indexedTotalTime: 57.222,
            rawTotalTime: 57.222,
            isBest: false,
        };

        const { container } = renderWithProviders(
            <RunDisplay runNumber={1} run={run} />
        );

        const element = container.querySelector("span[data-slot='badge']");
        expect(element?.className).toBeDefined();
        expect(element?.className).not.toMatch(/ring-green/);
    });

    it("renders run with single penalty", () => {
        const run: Run = {
            status: "dirty",
            time: 58.524,
            penalty: 1,
            indexedTotalTime: 60.524,
            rawTotalTime: 60.524,
            isBest: false,
        };

        renderWithProviders(<RunDisplay runNumber={2} run={run} />);

        expect(screen.getByText(/Run 2/i)).toBeVisible();
        // Dirty runs show time+penalty format: "58.524+1"
        expect(screen.getByText(/58\.524\+1/i)).toBeVisible();
    });
});
