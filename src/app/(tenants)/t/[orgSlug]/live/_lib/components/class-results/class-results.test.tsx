import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/__tests__/test-utils";
import { ClassResults } from "./class-results";
import { mockClassResults } from "@/__tests__/mocks/mock-class-results";

let mockFilters: string[] = [];
const mockUpdateFilters = vi.fn((key: string, value: string[]) => {
    if (key === "classes") {
        mockFilters = value;
    }
});
const mockGetFilters = vi.fn((key: string, defaultVal: string[]) => {
    if (key === "classes") return mockFilters;
    return defaultVal;
});

vi.mock("../../hooks/useUrlFilters", () => ({
    useUrlFilters: () => ({
        getFilters: mockGetFilters,
        updateFilters: mockUpdateFilters,
        searchParams: new URLSearchParams(),
    }),
}));

describe("ClassResults", () => {
    beforeEach(() => {
        mockFilters = [];
        mockGetFilters.mockClear();
        mockUpdateFilters.mockClear();
    });

    it("renders class links when results are available", () => {
        renderWithProviders(<ClassResults />, {
            liveData: {
                classResults: mockClassResults.results,
            },
        });

        expect(screen.getByRole("button", { name: /SS/i })).toBeVisible();
        expect(screen.getByRole("button", { name: /DST/i })).toBeVisible();
        expect(screen.getByRole("button", { name: /CS/i })).toBeVisible();
    });

    it("renders all class results when no filters are applied", () => {
        renderWithProviders(<ClassResults />, {
            liveData: {
                classResults: mockClassResults.results,
            },
        });

        const ssHeadings = screen.getAllByRole("heading", { name: /SS/i });
        expect(ssHeadings.length).toBeGreaterThan(0);
    });

    it("filters class results based on selected classes", async () => {
        const user = userEvent.setup();
        renderWithProviders(<ClassResults />, {
            liveData: {
                classResults: mockClassResults.results,
            },
        });

        const ssButton = screen.getByRole("button", { name: /SS/i });
        await user.click(ssButton);

        expect(mockUpdateFilters).toHaveBeenCalled();
    });
});
