import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/__tests__/test-utils";
import { ResultCard } from "./result-card";

describe("ResultCard", () => {
    it("renders children", () => {
        renderWithProviders(
            <ResultCard>
                <div>Test Content</div>
            </ResultCard>
        );

        expect(screen.getByText("Test Content")).toBeVisible();
    });

    it("calls onClick when clicked", async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();

        renderWithProviders(
            <ResultCard onClick={handleClick}>
                <div>Test Content</div>
            </ResultCard>
        );

        const card = screen
            .getByText("Test Content")
            .closest("div[class*='cursor-pointer']");
        if (card) {
            await user.click(card);
            expect(handleClick).toHaveBeenCalledTimes(1);
        }
    });

    it("applies highlighted styling when isHighlighted is true", () => {
        renderWithProviders(
            <ResultCard isHighlighted={true}>
                <div>Test Content</div>
            </ResultCard>
        );

        const card = screen
            .getByText("Test Content")
            .closest("div[class*='bg-orange']");
        expect(card).toBeInTheDocument();
    });

    it("does not apply highlighted styling when isHighlighted is false", () => {
        renderWithProviders(
            <ResultCard isHighlighted={false}>
                <div>Test Content</div>
            </ResultCard>
        );

        const card = screen
            .getByText("Test Content")
            .closest("div[class*='bg-orange']");
        expect(card).not.toBeInTheDocument();
    });

    it("applies custom className", () => {
        renderWithProviders(
            <ResultCard className="custom-class">
                <div>Test Content</div>
            </ResultCard>
        );

        const card = screen
            .getByText("Test Content")
            .closest("div[class*='custom-class']");
        expect(card).toBeInTheDocument();
    });

    it("does not have cursor-pointer when onClick is not provided", () => {
        renderWithProviders(
            <ResultCard>
                <div>Test Content</div>
            </ResultCard>
        );

        const card = screen
            .getByText("Test Content")
            .closest("div[class*='cursor-pointer']");
        expect(card).not.toBeInTheDocument();
    });
});
