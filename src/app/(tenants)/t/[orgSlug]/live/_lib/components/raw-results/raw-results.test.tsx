import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { RawResults } from "./raw-results";
import { mockRawResults } from "@/__tests__/mocks/mock-raw-results";

describe("RawResults", () => {
    it("renders empty state when no results", () => {
        renderWithProviders(<RawResults />, {
            liveData: {
                rawResults: null,
            },
        });

        expect(screen.getByText("No results available")).toBeVisible();
    });

    it("renders all raw entries", () => {
        renderWithProviders(<RawResults />, {
            liveData: {
                rawResults: mockRawResults,
            },
        });

        expect(screen.getByText("Tamra Krystinik")).toBeVisible();
        expect(screen.getByText("Alex Martinez")).toBeVisible();
        expect(screen.getByText("Sarah Johnson")).toBeVisible();
    });

    it("renders raw positions", () => {
        renderWithProviders(<RawResults />, {
            liveData: {
                rawResults: mockRawResults,
            },
        });

        expect(screen.getByText("1")).toBeVisible();
        expect(screen.getByText("2")).toBeVisible();
        expect(screen.getByText("3")).toBeVisible();
    });

    it("renders raw times", () => {
        renderWithProviders(<RawResults />, {
            liveData: {
                rawResults: mockRawResults,
            },
        });

        // Best run time is displayed (not rawTotalTime)
        // First entry's best run is 48.234 (run 2)
        expect(screen.getByText(/48\.234/i)).toBeVisible();
        // Second entry's best run is 57.306 (run 8) - may appear multiple times
        const timeElements = screen.getAllByText(/57\.306/i);
        expect(timeElements.length).toBeGreaterThan(0);
        expect(timeElements[0]).toBeVisible();
    });
});
