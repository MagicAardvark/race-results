import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { Separator } from "./separator";

describe("Separator", () => {
    it("renders separator element", () => {
        renderWithProviders(<Separator data-testid="separator" />);
        const separator = screen.getByTestId("separator");
        expect(separator).toBeVisible();
        expect(separator).toHaveAttribute("data-slot", "separator");
    });

    it("renders with horizontal orientation by default", () => {
        renderWithProviders(<Separator data-testid="separator" />);
        const separator = screen.getByTestId("separator");
        expect(separator).toHaveAttribute("data-orientation", "horizontal");
    });

    it("renders with vertical orientation", () => {
        renderWithProviders(
            <Separator orientation="vertical" data-testid="separator" />
        );
        const separator = screen.getByTestId("separator");
        expect(separator).toHaveAttribute("data-orientation", "vertical");
    });

    it("applies custom className", () => {
        renderWithProviders(
            <Separator className="custom-class" data-testid="separator" />
        );
        const separator = screen.getByTestId("separator");
        expect(separator).toHaveClass("custom-class");
    });

    it("handles decorative prop", () => {
        renderWithProviders(
            <Separator decorative={false} data-testid="separator" />
        );
        const separator = screen.getByTestId("separator");
        // When decorative is false, separator should still render
        expect(separator).toBeVisible();
    });
});
