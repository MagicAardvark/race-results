import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    SelectGroup,
    SelectLabel,
    SelectSeparator,
} from "./select";

describe("Select", () => {
    it("renders select structure", () => {
        renderWithProviders(
            <Select open>
                <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                </SelectContent>
            </Select>
        );
        // Select content is in a portal, check for items
        const option1 = screen.getByText("Option 1");
        expect(option1).toBeVisible();
    });

    it("renders select trigger", () => {
        renderWithProviders(
            <Select>
                <SelectTrigger data-testid="trigger">
                    <SelectValue placeholder="Select..." />
                </SelectTrigger>
            </Select>
        );
        const trigger = screen.getByTestId("trigger");
        expect(trigger).toBeVisible();
        expect(trigger).toHaveAttribute("data-slot", "select-trigger");
    });

    it("renders select trigger with default size", () => {
        renderWithProviders(
            <Select>
                <SelectTrigger data-testid="trigger">
                    <SelectValue placeholder="Select..." />
                </SelectTrigger>
            </Select>
        );
        const trigger = screen.getByTestId("trigger");
        expect(trigger).toHaveAttribute("data-size", "default");
    });

    it("renders select trigger with small size", () => {
        renderWithProviders(
            <Select>
                <SelectTrigger size="sm" data-testid="trigger">
                    <SelectValue placeholder="Select..." />
                </SelectTrigger>
            </Select>
        );
        const trigger = screen.getByTestId("trigger");
        expect(trigger).toHaveAttribute("data-size", "sm");
    });

    it("renders select value with placeholder", () => {
        renderWithProviders(
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Choose option" />
                </SelectTrigger>
            </Select>
        );
        expect(screen.getByText("Choose option")).toBeVisible();
    });

    it("renders select items", () => {
        renderWithProviders(
            <Select open>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="1" data-testid="item1">
                        Item 1
                    </SelectItem>
                    <SelectItem value="2" data-testid="item2">
                        Item 2
                    </SelectItem>
                </SelectContent>
            </Select>
        );
        const item1 = screen.getByTestId("item1");
        expect(item1).toBeVisible();
        expect(item1).toHaveAttribute("data-slot", "select-item");
        expect(item1).toHaveTextContent("Item 1");
    });

    it("renders SelectGroup", () => {
        renderWithProviders(
            <Select open>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup data-testid="group">
                        <SelectItem value="1">Item 1</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        );
        const group = screen.getByTestId("group");
        expect(group).toBeVisible();
        expect(group).toHaveAttribute("data-slot", "select-group");
    });

    it("renders SelectLabel", () => {
        renderWithProviders(
            <Select open>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel data-testid="label">
                            Group Label
                        </SelectLabel>
                        <SelectItem value="1">Item 1</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        );
        const label = screen.getByTestId("label");
        expect(label).toBeVisible();
        expect(label).toHaveAttribute("data-slot", "select-label");
        expect(label).toHaveTextContent("Group Label");
    });

    it("renders SelectSeparator", () => {
        renderWithProviders(
            <Select open>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="1">Item 1</SelectItem>
                    <SelectSeparator data-testid="separator" />
                    <SelectItem value="2">Item 2</SelectItem>
                </SelectContent>
            </Select>
        );
        const separator = screen.getByTestId("separator");
        expect(separator).toBeVisible();
        expect(separator).toHaveAttribute("data-slot", "select-separator");
    });

    it("renders SelectContent with popper position", () => {
        renderWithProviders(
            <Select open>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                    <SelectItem value="1">Item 1</SelectItem>
                </SelectContent>
            </Select>
        );
        // Content is in a portal, just verify the item is visible
        expect(screen.getByText("Item 1")).toBeVisible();
    });

    it("renders SelectContent with item-aligned position", () => {
        renderWithProviders(
            <Select open>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                    <SelectItem value="1">Item 1</SelectItem>
                </SelectContent>
            </Select>
        );
        // Content is in a portal, just verify the item is visible
        expect(screen.getByText("Item 1")).toBeVisible();
    });
});
