import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/__tests__/test-utils";
import { FilterButtons } from "./filter-buttons";

describe("FilterButtons", () => {
    const mockOnToggle = vi.fn();
    const mockOnClear = vi.fn();
    const items = ["SS", "STR", "BS"];

    it("renders all filter buttons", () => {
        renderWithProviders(
            <FilterButtons
                items={items}
                selectedItems={[]}
                onToggle={mockOnToggle}
            />
        );

        expect(screen.getByRole("button", { name: /SS/i })).toBeVisible();
        expect(screen.getByRole("button", { name: /STR/i })).toBeVisible();
        expect(screen.getByRole("button", { name: /BS/i })).toBeVisible();
    });

    it("calls onToggle when a button is clicked", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <FilterButtons
                items={items}
                selectedItems={[]}
                onToggle={mockOnToggle}
            />
        );

        const ssButton = screen.getByRole("button", { name: /SS/i });
        await user.click(ssButton);

        expect(mockOnToggle).toHaveBeenCalledWith("SS");
    });

    it("shows selected items with active styling", () => {
        renderWithProviders(
            <FilterButtons
                items={items}
                selectedItems={["SS", "STR"]}
                onToggle={mockOnToggle}
            />
        );

        const ssButton = screen.getByRole("button", { name: /SS/i });
        const strButton = screen.getByRole("button", { name: /STR/i });
        const bsButton = screen.getByRole("button", { name: /BS/i });

        // All buttons should be visible
        expect(ssButton).toBeVisible();
        expect(strButton).toBeVisible();
        expect(bsButton).toBeVisible();

        // Selected buttons should have different styling (check data-variant attribute)
        expect(ssButton).toHaveAttribute("data-variant", "default");
        expect(strButton).toHaveAttribute("data-variant", "default");
        expect(bsButton).toHaveAttribute("data-variant", "outline");
    });

    it("renders clear button when showClear is true and items are selected", () => {
        renderWithProviders(
            <FilterButtons
                items={items}
                selectedItems={["SS"]}
                onToggle={mockOnToggle}
                onClear={mockOnClear}
                showClear={true}
            />
        );

        expect(screen.getByRole("button", { name: /clear/i })).toBeVisible();
    });

    it("calls onClear when clear button is clicked", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <FilterButtons
                items={items}
                selectedItems={["SS", "STR"]}
                onToggle={mockOnToggle}
                onClear={mockOnClear}
                showClear={true}
            />
        );

        const clearButton = screen.getByRole("button", { name: /clear/i });
        await user.click(clearButton);

        expect(mockOnClear).toHaveBeenCalled();
    });
});
