import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { Input } from "./input";

describe("Input", () => {
    it("renders input element", () => {
        renderWithProviders(<Input data-testid="input" />);
        const input = screen.getByTestId("input");
        expect(input).toBeVisible();
        expect(input.tagName).toBe("INPUT");
        expect(input).toHaveAttribute("data-slot", "input");
    });

    it("handles text input", () => {
        renderWithProviders(<Input type="text" defaultValue="test" />);
        const input = screen.getByDisplayValue("test");
        expect(input).toBeVisible();
        expect(input).toHaveAttribute("type", "text");
    });

    it("handles email input", () => {
        renderWithProviders(<Input type="email" />);
        const input = screen.getByRole("textbox");
        expect(input).toHaveAttribute("type", "email");
    });

    it("handles placeholder", () => {
        renderWithProviders(<Input placeholder="Enter text" />);
        const input = screen.getByPlaceholderText("Enter text");
        expect(input).toBeVisible();
    });

    it("applies custom className", () => {
        renderWithProviders(
            <Input className="custom-class" data-testid="input" />
        );
        const input = screen.getByTestId("input");
        expect(input).toHaveClass("custom-class");
    });

    it("handles disabled state", () => {
        renderWithProviders(<Input disabled />);
        const input = screen.getByRole("textbox");
        expect(input).toBeDisabled();
    });

    it("handles required attribute", () => {
        renderWithProviders(<Input required />);
        const input = screen.getByRole("textbox");
        expect(input).toBeRequired();
    });
});
