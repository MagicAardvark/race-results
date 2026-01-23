import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/__tests__/test-utils";
import { ViewToggle } from "./view-toggle";

describe("ViewToggle", () => {
    it("renders both toggle buttons", () => {
        const mockOnChange = vi.fn();
        renderWithProviders(
            <ViewToggle viewMode="trophies" onViewModeChange={mockOnChange} />
        );

        expect(screen.getByText("Class Trophies")).toBeVisible();
        expect(screen.getByText("Shoutouts")).toBeVisible();
    });

    it("highlights trophies button when viewMode is trophies", () => {
        const mockOnChange = vi.fn();
        renderWithProviders(
            <ViewToggle viewMode="trophies" onViewModeChange={mockOnChange} />
        );

        const trophiesButton = screen
            .getByText("Class Trophies")
            .closest("button");
        expect(trophiesButton).toHaveAttribute("data-variant", "default");
    });

    it("highlights shoutouts button when viewMode is awards", () => {
        const mockOnChange = vi.fn();
        renderWithProviders(
            <ViewToggle viewMode="awards" onViewModeChange={mockOnChange} />
        );

        const shoutoutsButton = screen.getByText("Shoutouts").closest("button");
        expect(shoutoutsButton).toHaveAttribute("data-variant", "default");
    });

    it("calls onViewModeChange when trophies button is clicked", async () => {
        const mockOnChange = vi.fn();
        const user = userEvent.setup();
        renderWithProviders(
            <ViewToggle viewMode="awards" onViewModeChange={mockOnChange} />
        );

        const trophiesButton = screen.getByText("Class Trophies");
        await user.click(trophiesButton);

        expect(mockOnChange).toHaveBeenCalledWith("trophies");
    });

    it("calls onViewModeChange when shoutouts button is clicked", async () => {
        const mockOnChange = vi.fn();
        const user = userEvent.setup();
        renderWithProviders(
            <ViewToggle viewMode="trophies" onViewModeChange={mockOnChange} />
        );

        const shoutoutsButton = screen.getByText("Shoutouts");
        await user.click(shoutoutsButton);

        expect(mockOnChange).toHaveBeenCalledWith("awards");
    });
});
