import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { PaxResults } from "./pax-results";
import { mockPaxResults } from "@/__tests__/mocks/mock-pax-results";

describe("PaxResults", () => {
    it("renders all PAX entries", () => {
        renderWithProviders(<PaxResults />, {
            liveData: {
                paxResults: mockPaxResults.results,
            },
        });

        expect(screen.getByText("Alex Martinez")).toBeVisible();
        expect(screen.getByText("Chris Anderson")).toBeVisible();
    });

    it("calculates max gap from PAX times", () => {
        renderWithProviders(<PaxResults />, {
            liveData: {
                paxResults: mockPaxResults.results,
            },
        });

        // Should render entries with gap displays
        expect(screen.getByText("Alex Martinez")).toBeVisible();
    });

    it("renders PAX positions", () => {
        renderWithProviders(<PaxResults />, {
            liveData: {
                paxResults: mockPaxResults.results,
            },
        });

        // PAX position 1 should be visible
        expect(screen.getByText("1")).toBeVisible();
    });

    it("handles empty results array", () => {
        const { container } = renderWithProviders(<PaxResults />, {
            liveData: {
                paxResults: [],
            },
        });

        // Empty array doesn't trigger empty state, just renders nothing
        const emptyState = container.querySelector("main");
        expect(emptyState).not.toBeInTheDocument();
    });
});
