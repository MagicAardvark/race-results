import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { LinkButton } from "./link-button";

describe("LinkButton", () => {
    it("renders link with href", () => {
        renderWithProviders(<LinkButton href="/test">Click me</LinkButton>);
        const link = screen.getByRole("link", { name: /click me/i });
        expect(link).toBeVisible();
        expect(link).toHaveAttribute("href", "/test");
    });

    it("renders children inside link", () => {
        renderWithProviders(
            <LinkButton href="/test">Go to test page</LinkButton>
        );
        expect(screen.getByText("Go to test page")).toBeVisible();
    });

    it("applies button wrapper classes", () => {
        renderWithProviders(<LinkButton href="/test">Test</LinkButton>);
        const button = screen.getByRole("button");
        expect(button).toHaveClass("flex", "cursor-pointer", "items-center");
    });

    it("passes through button props", () => {
        renderWithProviders(
            <LinkButton href="/test" disabled>
                Disabled Link
            </LinkButton>
        );
        const button = screen.getByRole("button");
        expect(button).toBeDisabled();
    });

    it("handles different href values", () => {
        renderWithProviders(<LinkButton href="/admin/users">Admin</LinkButton>);
        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("href", "/admin/users");
    });
});
