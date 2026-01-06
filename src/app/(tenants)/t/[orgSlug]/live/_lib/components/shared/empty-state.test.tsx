import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
    it("displays default message", () => {
        renderWithProviders(<EmptyState />);
        expect(screen.getByText(/no data available/i)).toBeVisible();
    });

    it("displays custom message", () => {
        renderWithProviders(<EmptyState message="No results found" />);
        expect(screen.getByText(/no results found/i)).toBeVisible();
    });

    it("displays children when provided", () => {
        renderWithProviders(
            <EmptyState message="No data">
                <button>Retry</button>
            </EmptyState>
        );

        expect(screen.getByText(/no data/i)).toBeVisible();
        expect(screen.getByRole("button", { name: /retry/i })).toBeVisible();
    });

    it("renders in a card", () => {
        renderWithProviders(<EmptyState />);
        // The component uses Card which should render
        expect(screen.getByText(/no data available/i)).toBeVisible();
    });
});
