import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/__tests__/test-utils";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupText,
    InputGroupInput,
    InputGroupTextarea,
} from "./input-group";

describe("InputGroup", () => {
    it("renders input group element", () => {
        renderWithProviders(
            <InputGroup data-testid="group">Content</InputGroup>
        );
        const group = screen.getByTestId("group");
        expect(group).toBeVisible();
        expect(group).toHaveAttribute("data-slot", "input-group");
        expect(group).toHaveAttribute("role", "group");
    });
});

describe("InputGroupAddon", () => {
    it("renders addon element", () => {
        renderWithProviders(
            <InputGroup>
                <InputGroupAddon data-testid="addon">$</InputGroupAddon>
            </InputGroup>
        );
        const addon = screen.getByTestId("addon");
        expect(addon).toBeVisible();
        expect(addon).toHaveAttribute("data-slot", "input-group-addon");
        expect(addon).toHaveAttribute("role", "group");
    });

    it("renders with default inline-start align", () => {
        renderWithProviders(
            <InputGroup>
                <InputGroupAddon data-testid="addon">$</InputGroupAddon>
            </InputGroup>
        );
        const addon = screen.getByTestId("addon");
        expect(addon).toHaveAttribute("data-align", "inline-start");
    });

    it("renders with different align values", () => {
        const { rerender } = renderWithProviders(
            <InputGroup>
                <InputGroupAddon align="inline-end" data-testid="addon">
                    $
                </InputGroupAddon>
            </InputGroup>
        );
        expect(screen.getByTestId("addon")).toHaveAttribute(
            "data-align",
            "inline-end"
        );

        rerender(
            <InputGroup>
                <InputGroupAddon align="block-start" data-testid="addon">
                    Label
                </InputGroupAddon>
            </InputGroup>
        );
        expect(screen.getByTestId("addon")).toHaveAttribute(
            "data-align",
            "block-start"
        );
    });

    it("focuses input when addon is clicked", async () => {
        const user = userEvent.setup();
        const focusSpy = vi.fn();
        renderWithProviders(
            <InputGroup>
                <InputGroupAddon data-testid="addon">$</InputGroupAddon>
                <InputGroupInput data-testid="input" onFocus={focusSpy} />
            </InputGroup>
        );

        const addon = screen.getByTestId("addon");
        await user.click(addon);

        expect(focusSpy).toHaveBeenCalled();
    });

    it("does not focus input when button inside addon is clicked", async () => {
        const user = userEvent.setup();
        const focusSpy = vi.fn();
        renderWithProviders(
            <InputGroup>
                <InputGroupAddon data-testid="addon">
                    <InputGroupButton data-testid="button">
                        Clear
                    </InputGroupButton>
                </InputGroupAddon>
                <InputGroupInput data-testid="input" onFocus={focusSpy} />
            </InputGroup>
        );

        const button = screen.getByTestId("button");
        await user.click(button);

        expect(focusSpy).not.toHaveBeenCalled();
    });
});

describe("InputGroupButton", () => {
    it("renders button element", () => {
        renderWithProviders(
            <InputGroup>
                <InputGroupButton data-testid="button">Click</InputGroupButton>
            </InputGroup>
        );
        const button = screen.getByTestId("button");
        expect(button).toBeVisible();
        expect(button).toHaveAttribute("data-size", "xs");
    });

    it("renders with different sizes", () => {
        const { rerender } = renderWithProviders(
            <InputGroup>
                <InputGroupButton size="sm" data-testid="button">
                    Click
                </InputGroupButton>
            </InputGroup>
        );
        expect(screen.getByTestId("button")).toHaveAttribute("data-size", "sm");

        rerender(
            <InputGroup>
                <InputGroupButton size="icon-xs" data-testid="button">
                    <span>Icon</span>
                </InputGroupButton>
            </InputGroup>
        );
        expect(screen.getByTestId("button")).toHaveAttribute(
            "data-size",
            "icon-xs"
        );
    });
});

describe("InputGroupText", () => {
    it("renders text element", () => {
        renderWithProviders(
            <InputGroup>
                <InputGroupText data-testid="text">Text</InputGroupText>
            </InputGroup>
        );
        const text = screen.getByTestId("text");
        expect(text.tagName).toBe("SPAN");
        expect(text).toHaveTextContent("Text");
    });
});

describe("InputGroupInput", () => {
    it("renders input element", () => {
        renderWithProviders(
            <InputGroup>
                <InputGroupInput data-testid="input" />
            </InputGroup>
        );
        const input = screen.getByTestId("input");
        expect(input.tagName).toBe("INPUT");
        expect(input).toHaveAttribute("data-slot", "input-group-control");
    });

    it("handles input value", () => {
        renderWithProviders(
            <InputGroup>
                <InputGroupInput defaultValue="test" data-testid="input" />
            </InputGroup>
        );
        const input = screen.getByDisplayValue("test");
        expect(input).toBeVisible();
    });
});

describe("InputGroupTextarea", () => {
    it("renders textarea element", () => {
        renderWithProviders(
            <InputGroup>
                <InputGroupTextarea data-testid="textarea" />
            </InputGroup>
        );
        const textarea = screen.getByTestId("textarea");
        expect(textarea.tagName).toBe("TEXTAREA");
        expect(textarea).toHaveAttribute("data-slot", "input-group-control");
    });

    it("handles textarea value", () => {
        renderWithProviders(
            <InputGroup>
                <InputGroupTextarea
                    defaultValue="test"
                    data-testid="textarea"
                />
            </InputGroup>
        );
        const textarea = screen.getByDisplayValue("test");
        expect(textarea).toBeVisible();
    });
});
