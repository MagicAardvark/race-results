import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/__tests__/test-utils";
import { WorkRunFilter } from "./work-run-filter";

describe("WorkRunFilter", () => {
    const mockClasses = ["SS", "STR", "BS"];
    const mockHandleSelectClass = vi.fn();

    beforeEach(() => {
        mockHandleSelectClass.mockClear();
    });

    it("renders all class filter buttons", () => {
        renderWithProviders(
            <WorkRunFilter
                classes={mockClasses}
                selectedClass=""
                handleSelectClass={mockHandleSelectClass}
            />
        );

        expect(screen.getByRole("button", { name: /SS/i })).toBeVisible();
        expect(screen.getByRole("button", { name: /STR/i })).toBeVisible();
        expect(screen.getByRole("button", { name: /BS/i })).toBeVisible();
    });

    it("calls handleSelectClass when a button is clicked", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <WorkRunFilter
                classes={mockClasses}
                selectedClass=""
                handleSelectClass={mockHandleSelectClass}
            />
        );

        const ssButton = screen.getByRole("button", { name: /SS/i });
        await user.click(ssButton);

        expect(mockHandleSelectClass).toHaveBeenCalledWith("SS");
    });

    it("shows selected class with active styling", () => {
        renderWithProviders(
            <WorkRunFilter
                classes={mockClasses}
                selectedClass="SS"
                handleSelectClass={mockHandleSelectClass}
            />
        );

        const ssButton = screen.getByRole("button", { name: /SS/i });
        expect(ssButton).toHaveAttribute("data-variant", "default");
    });

    it("handles empty classes array", () => {
        renderWithProviders(
            <WorkRunFilter
                classes={[]}
                selectedClass=""
                handleSelectClass={mockHandleSelectClass}
            />
        );

        // No buttons should be rendered
        expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
});
