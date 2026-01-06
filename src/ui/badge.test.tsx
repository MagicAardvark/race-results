import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { Badge } from "./badge";

describe("Badge", () => {
    it("renders with default variant", () => {
        renderWithProviders(<Badge>Test Badge</Badge>);
        const badge = screen.getByText("Test Badge");
        expect(badge).toBeVisible();
        expect(badge).toHaveAttribute("data-variant", "default");
    });

    it("renders with different variants", () => {
        const { rerender } = renderWithProviders(
            <Badge variant="secondary">Secondary</Badge>
        );
        expect(screen.getByText("Secondary")).toHaveAttribute(
            "data-variant",
            "secondary"
        );

        rerender(<Badge variant="destructive">Destructive</Badge>);
        expect(screen.getByText("Destructive")).toHaveAttribute(
            "data-variant",
            "destructive"
        );

        rerender(<Badge variant="outline">Outline</Badge>);
        expect(screen.getByText("Outline")).toHaveAttribute(
            "data-variant",
            "outline"
        );
    });

    it("applies custom className", () => {
        renderWithProviders(<Badge className="custom-class">Custom</Badge>);
        const badge = screen.getByText("Custom");
        expect(badge).toHaveClass("custom-class");
    });

    it("renders as span by default", () => {
        renderWithProviders(<Badge>Test</Badge>);
        const badge = screen.getByText("Test");
        expect(badge.tagName).toBe("SPAN");
    });

    it("renders with asChild prop", () => {
        renderWithProviders(
            <Badge asChild>
                <div>Child Badge</div>
            </Badge>
        );
        expect(screen.getByText("Child Badge")).toBeVisible();
    });
});
