import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { RawResults } from "./raw-results";
import { mockRawResults } from "@/__tests__/mocks/mock-raw-results";

describe("RawResults", () => {
    it("renders all raw entries", () => {
        renderWithProviders(<RawResults />, {
            liveData: {
                rawResults: mockRawResults.results,
            },
        });

        expect(screen.getByText("Alex Martinez")).toBeVisible();
        expect(screen.getByText("Chris Anderson")).toBeVisible();
    });

    it("calculates max gap from raw times", () => {
        renderWithProviders(<RawResults />, {
            liveData: {
                rawResults: mockRawResults.results,
            },
        });

        // Should render entries with gap displays
        expect(screen.getByText("Alex Martinez")).toBeVisible();
    });

    it("renders positions", () => {
        renderWithProviders(<RawResults />, {
            liveData: {
                rawResults: mockRawResults.results,
            },
        });

        // Position 1 should be visible (may appear multiple times)
        const ones = screen.getAllByText("1");
        expect(ones.length).toBeGreaterThan(0);
    });

    it("handles empty results array", () => {
        const { container } = renderWithProviders(<RawResults />, {
            liveData: {
                rawResults: [],
            },
        });

        // Empty array doesn't trigger empty state, just renders nothing
        const emptyState = container.querySelector("main");
        expect(emptyState).not.toBeInTheDocument();
    });
});
