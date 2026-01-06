import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/__tests__/test-utils";
import { Button } from "./button-wrapper";

describe("Button", () => {
    it("renders children", () => {
        renderWithProviders(<Button>Click me</Button>);
        expect(screen.getByText("Click me")).toBeVisible();
    });

    it("renders as button by default", () => {
        renderWithProviders(<Button>Test</Button>);
        const button = screen.getByRole("button", { name: /test/i });
        expect(button).toBeVisible();
    });

    it("applies flex and cursor-pointer classes", () => {
        renderWithProviders(<Button>Test</Button>);
        const button = screen.getByRole("button", { name: /test/i });
        expect(button).toHaveClass("flex", "cursor-pointer", "items-center");
    });

    it("passes through button props", () => {
        renderWithProviders(<Button disabled>Disabled</Button>);
        const button = screen.getByRole("button", { name: /disabled/i });
        expect(button).toBeDisabled();
    });

    it("handles onClick", async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();

        renderWithProviders(<Button onClick={handleClick}>Click</Button>);

        const button = screen.getByRole("button", { name: /click/i });
        await user.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
