import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { Textarea } from "./textarea";

describe("Textarea", () => {
    it("renders textarea element", () => {
        renderWithProviders(<Textarea data-testid="textarea" />);
        const textarea = screen.getByTestId("textarea");
        expect(textarea).toBeVisible();
        expect(textarea.tagName).toBe("TEXTAREA");
        expect(textarea).toHaveAttribute("data-slot", "textarea");
    });

    it("handles value", () => {
        renderWithProviders(<Textarea defaultValue="test content" />);
        const textarea = screen.getByDisplayValue("test content");
        expect(textarea).toBeVisible();
    });

    it("handles placeholder", () => {
        renderWithProviders(<Textarea placeholder="Enter text" />);
        const textarea = screen.getByPlaceholderText("Enter text");
        expect(textarea).toBeVisible();
    });

    it("applies custom className", () => {
        renderWithProviders(
            <Textarea className="custom-class" data-testid="textarea" />
        );
        const textarea = screen.getByTestId("textarea");
        expect(textarea).toHaveClass("custom-class");
    });

    it("handles disabled state", () => {
        renderWithProviders(<Textarea disabled />);
        const textarea = screen.getByRole("textbox");
        expect(textarea).toBeDisabled();
    });

    it("handles required attribute", () => {
        renderWithProviders(<Textarea required />);
        const textarea = screen.getByRole("textbox");
        expect(textarea).toBeRequired();
    });

    it("handles rows attribute", () => {
        renderWithProviders(<Textarea rows={5} data-testid="textarea" />);
        const textarea = screen.getByTestId("textarea");
        expect(textarea).toHaveAttribute("rows", "5");
    });
});
