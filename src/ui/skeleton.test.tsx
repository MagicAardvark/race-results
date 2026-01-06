import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { Skeleton } from "./skeleton";

describe("Skeleton", () => {
    it("renders skeleton element", () => {
        renderWithProviders(<Skeleton data-testid="skeleton" />);
        const skeleton = screen.getByTestId("skeleton");
        expect(skeleton).toBeVisible();
        expect(skeleton).toHaveAttribute("data-slot", "skeleton");
    });

    it("applies default classes", () => {
        renderWithProviders(<Skeleton data-testid="skeleton" />);
        const skeleton = screen.getByTestId("skeleton");
        expect(skeleton).toHaveClass("bg-muted", "animate-pulse", "rounded-md");
    });

    it("applies custom className", () => {
        renderWithProviders(
            <Skeleton className="custom-class" data-testid="skeleton" />
        );
        const skeleton = screen.getByTestId("skeleton");
        expect(skeleton).toHaveClass("custom-class");
    });

    it("passes through div props", () => {
        renderWithProviders(
            <Skeleton aria-label="Loading" data-testid="skeleton" />
        );
        const skeleton = screen.getByTestId("skeleton");
        expect(skeleton).toHaveAttribute("aria-label", "Loading");
    });
});
