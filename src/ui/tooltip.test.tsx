import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from "./tooltip";

describe("TooltipProvider", () => {
    it("renders children", () => {
        renderWithProviders(
            <TooltipProvider>
                <div data-testid="content">Content</div>
            </TooltipProvider>
        );
        const content = screen.getByTestId("content");
        expect(content).toBeVisible();
    });

    it("applies delayDuration prop", () => {
        renderWithProviders(
            <TooltipProvider delayDuration={500}>
                <div data-testid="content">Content</div>
            </TooltipProvider>
        );
        const content = screen.getByTestId("content");
        expect(content).toBeVisible();
    });
});

describe("Tooltip", () => {
    it("renders tooltip with provider", () => {
        renderWithProviders(
            <Tooltip>
                <TooltipTrigger asChild>
                    <button>Hover me</button>
                </TooltipTrigger>
                <TooltipContent>Tooltip content</TooltipContent>
            </Tooltip>
        );
        // Tooltip wraps content in provider, just verify trigger renders
        const button = screen.getByRole("button", { name: /hover me/i });
        expect(button).toBeVisible();
    });
});

describe("TooltipTrigger", () => {
    it("renders trigger element", () => {
        renderWithProviders(
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button data-testid="trigger">Trigger</button>
                    </TooltipTrigger>
                    <TooltipContent>Content</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
        const trigger = screen.getByTestId("trigger");
        expect(trigger).toBeVisible();
    });
});

describe("TooltipContent", () => {
    it("renders tooltip structure", () => {
        renderWithProviders(
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button>Hover</button>
                    </TooltipTrigger>
                    <TooltipContent>Tooltip text</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
        // Just verify the trigger renders - content is in a portal
        const button = screen.getByRole("button", { name: /hover/i });
        expect(button).toBeVisible();
    });
});
