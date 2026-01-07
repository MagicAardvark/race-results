import { describe, it, expect } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/__tests__/test-utils";
import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
    it("renders checkbox element", () => {
        renderWithProviders(<Checkbox data-testid="checkbox" />);
        const checkbox = screen.getByTestId("checkbox");
        expect(checkbox).toBeVisible();
        expect(checkbox).toHaveAttribute("data-slot", "checkbox");
    });

    it("handles checked state", () => {
        renderWithProviders(<Checkbox checked data-testid="checkbox" />);
        const checkbox = screen.getByTestId("checkbox");
        expect(checkbox).toHaveAttribute("aria-checked", "true");
    });

    it("handles unchecked state", () => {
        renderWithProviders(
            <Checkbox checked={false} data-testid="checkbox" />
        );
        const checkbox = screen.getByTestId("checkbox");
        expect(checkbox).toHaveAttribute("aria-checked", "false");
    });

    it("handles click to toggle", async () => {
        const user = userEvent.setup();
        renderWithProviders(<Checkbox data-testid="checkbox" />);
        const checkbox = screen.getByTestId("checkbox");

        await user.click(checkbox);
        expect(checkbox).toHaveAttribute("aria-checked", "true");
    });

    it("applies custom className", () => {
        renderWithProviders(
            <Checkbox className="custom-class" data-testid="checkbox" />
        );
        const checkbox = screen.getByTestId("checkbox");
        expect(checkbox).toHaveClass("custom-class");
    });

    it("handles disabled state", () => {
        renderWithProviders(<Checkbox disabled data-testid="checkbox" />);
        const checkbox = screen.getByTestId("checkbox");
        expect(checkbox).toBeDisabled();
    });
});
