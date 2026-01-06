import { describe, it, expect, beforeEach } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { MyStats } from "./my-stats";
import { mockClassResults } from "@/__tests__/mocks/mock-class-results";
import { mockPaxResults } from "@/__tests__/mocks/mock-pax-results";
import { mockRawResults } from "@/__tests__/mocks/mock-raw-results";

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();

Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
});

describe("MyStats", () => {
    beforeEach(() => {
        localStorageMock.clear();
    });

    it("renders no drivers message when no drivers available", () => {
        renderWithProviders(<MyStats />, {
            liveData: {
                classResults: undefined,
                paxResults: undefined,
                rawResults: undefined,
            },
        });

        expect(screen.getByText(/No drivers found in results/i)).toBeVisible();
    });

    it("renders select driver message when no driver is selected", () => {
        renderWithProviders(<MyStats />, {
            liveData: {
                classResults: mockClassResults.results,
                paxResults: mockPaxResults.results,
                rawResults: mockRawResults.results,
            },
        });

        expect(
            screen.getByText(/Please select your name from the dropdown/i)
        ).toBeVisible();
    });

    it("renders driver select component", () => {
        renderWithProviders(<MyStats />, {
            liveData: {
                classResults: mockClassResults.results,
                paxResults: mockPaxResults.results,
                rawResults: mockRawResults.results,
            },
        });

        expect(screen.getByRole("combobox")).toBeVisible();
    });

    it("renders stats cards when driver is selected via localStorage", () => {
        const driverId = `Sarah Johnson|35|SS`;
        localStorageMock.setItem("selected-driver-id", driverId);

        renderWithProviders(<MyStats />, {
            liveData: {
                classResults: mockClassResults.results,
                paxResults: mockPaxResults.results,
                rawResults: mockRawResults.results,
            },
        });

        // Should show class position card
        expect(screen.getByText("Class")).toBeVisible();
    });

    it("renders class times visualization when class result exists", () => {
        const driverId = `Sarah Johnson|35|SS`;
        localStorageMock.setItem("selected-driver-id", driverId);

        renderWithProviders(<MyStats />, {
            liveData: {
                classResults: mockClassResults.results,
                paxResults: mockPaxResults.results,
                rawResults: mockRawResults.results,
            },
        });

        expect(screen.getByText("Class Times Visualization")).toBeVisible();
    });

    it("renders run statistics card", () => {
        const driverId = `Sarah Johnson|35|SS`;
        localStorageMock.setItem("selected-driver-id", driverId);

        renderWithProviders(<MyStats />, {
            liveData: {
                classResults: mockClassResults.results,
                paxResults: mockPaxResults.results,
                rawResults: mockRawResults.results,
            },
        });

        expect(screen.getByText("Run Statistics")).toBeVisible();
    });
});
