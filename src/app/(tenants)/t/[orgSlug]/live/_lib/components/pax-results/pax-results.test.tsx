import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { PaxResults } from "./pax-results";
import { mockPaxResults } from "@/__tests__/mocks/mock-pax-results";

describe("PaxResults", () => {
    it("renders empty state when no results", () => {
        renderWithProviders(<PaxResults />, {
            liveData: {
                paxResults: null,
            },
        });

        expect(screen.getByText("No results available")).toBeVisible();
    });

    it("renders all PAX entries", () => {
        renderWithProviders(<PaxResults />, {
            liveData: {
                paxResults: mockPaxResults,
            },
        });

        expect(screen.getByText("Alex Martinez")).toBeVisible();
        expect(screen.getByText("Chris Anderson")).toBeVisible();
        expect(screen.getByText("David Thompson")).toBeVisible();
    });

    it("renders PAX positions", () => {
        renderWithProviders(<PaxResults />, {
            liveData: {
                paxResults: mockPaxResults,
            },
        });

        expect(screen.getByText("1")).toBeVisible();
        expect(screen.getByText("2")).toBeVisible();
        expect(screen.getByText("3")).toBeVisible();
    });

    it("renders PAX times", () => {
        renderWithProviders(<PaxResults />, {
            liveData: {
                paxResults: mockPaxResults,
            },
        });

        expect(screen.getByText(/46\.876/i)).toBeVisible();
        expect(screen.getByText(/47\.007/i)).toBeVisible();
    });
});
