import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { Label } from "./label";

describe("Label", () => {
    it("renders label element", () => {
        renderWithProviders(<Label>Test Label</Label>);
        const label = screen.getByText("Test Label");
        expect(label).toBeVisible();
        expect(label).toHaveAttribute("data-slot", "label");
    });

    it("associates with input using htmlFor", () => {
        renderWithProviders(
            <>
                <Label htmlFor="test-input">Label</Label>
                <input id="test-input" />
            </>
        );
        const label = screen.getByText("Label");
        const input = screen.getByRole("textbox");
        expect(label).toHaveAttribute("for", "test-input");
        expect(input).toHaveAttribute("id", "test-input");
    });

    it("applies custom className", () => {
        renderWithProviders(<Label className="custom-class">Label</Label>);
        const label = screen.getByText("Label");
        expect(label).toHaveClass("custom-class");
    });
});
