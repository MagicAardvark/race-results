import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/__tests__/test-utils";
import { ClassLinks } from "./class-links";

describe("ClassLinks", () => {
    const mockClasses = ["SS", "STR", "BS"];
    const mockToggleFilter = vi.fn();
    const mockClearFilters = vi.fn();

    beforeEach(() => {
        mockToggleFilter.mockClear();
        mockClearFilters.mockClear();
    });

    it("renders all class filter buttons", () => {
        renderWithProviders(
            <ClassLinks
                classes={mockClasses}
                filteredClasses={[]}
                toggleFilter={mockToggleFilter}
                clearFilters={mockClearFilters}
            />
        );

        expect(screen.getByRole("button", { name: /SS/i })).toBeVisible();
        expect(screen.getByRole("button", { name: /STR/i })).toBeVisible();
        expect(screen.getByRole("button", { name: /BS/i })).toBeVisible();
    });

    it("calls toggleFilter when a button is clicked", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <ClassLinks
                classes={mockClasses}
                filteredClasses={[]}
                toggleFilter={mockToggleFilter}
                clearFilters={mockClearFilters}
            />
        );

        const ssButton = screen.getByRole("button", { name: /SS/i });
        await user.click(ssButton);

        expect(mockToggleFilter).toHaveBeenCalledWith("SS");
    });

    it("shows selected classes with active styling", () => {
        renderWithProviders(
            <ClassLinks
                classes={mockClasses}
                filteredClasses={["SS", "STR"]}
                toggleFilter={mockToggleFilter}
                clearFilters={mockClearFilters}
            />
        );

        const ssButton = screen.getByRole("button", { name: /SS/i });
        const strButton = screen.getByRole("button", { name: /STR/i });

        expect(ssButton).toHaveAttribute("data-variant", "default");
        expect(strButton).toHaveAttribute("data-variant", "default");
    });

    it("renders clear button when classes are filtered", () => {
        renderWithProviders(
            <ClassLinks
                classes={mockClasses}
                filteredClasses={["SS"]}
                toggleFilter={mockToggleFilter}
                clearFilters={mockClearFilters}
            />
        );

        expect(screen.getByRole("button", { name: /clear/i })).toBeVisible();
    });

    it("calls clearFilters when clear button is clicked", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <ClassLinks
                classes={mockClasses}
                filteredClasses={["SS", "STR"]}
                toggleFilter={mockToggleFilter}
                clearFilters={mockClearFilters}
            />
        );

        const clearButton = screen.getByRole("button", { name: /clear/i });
        await user.click(clearButton);

        expect(mockClearFilters).toHaveBeenCalledTimes(1);
    });
});
