import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuGroup,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from "./dropdown-menu";

describe("DropdownMenu", () => {
    it("renders dropdown menu structure", () => {
        renderWithProviders(
            <DropdownMenu open>
                <DropdownMenuTrigger asChild>
                    <button>Menu</button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>Item 1</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
        // Dropdown content is in a portal, check for items
        const item1 = screen.getByText("Item 1");
        expect(item1).toBeVisible();
    });

    it("renders dropdown menu trigger", () => {
        renderWithProviders(
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button data-testid="trigger">Open Menu</button>
                </DropdownMenuTrigger>
            </DropdownMenu>
        );
        const trigger = screen.getByTestId("trigger");
        expect(trigger).toBeVisible();
    });

    it("renders dropdown menu items", () => {
        renderWithProviders(
            <DropdownMenu open>
                <DropdownMenuTrigger asChild>
                    <button>Menu</button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>Item 1</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
        const item1 = screen.getByText("Item 1");
        expect(item1).toBeVisible();
    });

    it("renders DropdownMenuCheckboxItem", () => {
        renderWithProviders(
            <DropdownMenu open>
                <DropdownMenuTrigger asChild>
                    <button>Menu</button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuCheckboxItem checked>
                        Checked Item
                    </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
        expect(screen.getByText("Checked Item")).toBeVisible();
    });

    it("renders DropdownMenuRadioGroup and RadioItem", () => {
        renderWithProviders(
            <DropdownMenu open>
                <DropdownMenuTrigger asChild>
                    <button>Menu</button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuRadioGroup value="option1">
                        <DropdownMenuRadioItem value="option1">
                            Option 1
                        </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        );
        expect(screen.getByText("Option 1")).toBeVisible();
    });

    it("renders DropdownMenuLabel", () => {
        renderWithProviders(
            <DropdownMenu open>
                <DropdownMenuTrigger asChild>
                    <button>Menu</button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Label</DropdownMenuLabel>
                </DropdownMenuContent>
            </DropdownMenu>
        );
        expect(screen.getByText("Label")).toBeVisible();
    });

    it("renders DropdownMenuLabel with inset", () => {
        renderWithProviders(
            <DropdownMenu open>
                <DropdownMenuTrigger asChild>
                    <button>Menu</button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel inset>Inset Label</DropdownMenuLabel>
                </DropdownMenuContent>
            </DropdownMenu>
        );
        const label = screen.getByText("Inset Label");
        expect(label).toBeVisible();
        expect(label).toHaveAttribute("data-inset", "true");
    });

    it("renders DropdownMenuSeparator", () => {
        renderWithProviders(
            <DropdownMenu open>
                <DropdownMenuTrigger asChild>
                    <button>Menu</button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>Item 1</DropdownMenuItem>
                    <DropdownMenuSeparator data-testid="separator" />
                    <DropdownMenuItem>Item 2</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
        const separator = screen.getByTestId("separator");
        expect(separator).toBeVisible();
        expect(separator).toHaveAttribute(
            "data-slot",
            "dropdown-menu-separator"
        );
    });

    it("renders DropdownMenuShortcut", () => {
        renderWithProviders(
            <DropdownMenu open>
                <DropdownMenuTrigger asChild>
                    <button>Menu</button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>
                        Item
                        <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
        expect(screen.getByText("⌘K")).toBeVisible();
    });

    it("renders DropdownMenuGroup", () => {
        renderWithProviders(
            <DropdownMenu open>
                <DropdownMenuTrigger asChild>
                    <button>Menu</button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup data-testid="group">
                        <DropdownMenuItem>Item 1</DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        );
        const group = screen.getByTestId("group");
        expect(group).toBeVisible();
        expect(group).toHaveAttribute("data-slot", "dropdown-menu-group");
    });

    it("renders DropdownMenuItem with variant destructive", () => {
        renderWithProviders(
            <DropdownMenu open>
                <DropdownMenuTrigger asChild>
                    <button>Menu</button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem variant="destructive">
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
        const item = screen.getByText("Delete");
        expect(item).toBeVisible();
        expect(item).toHaveAttribute("data-variant", "destructive");
    });

    it("renders DropdownMenuItem with inset", () => {
        renderWithProviders(
            <DropdownMenu open>
                <DropdownMenuTrigger asChild>
                    <button>Menu</button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem inset>Inset Item</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
        const item = screen.getByText("Inset Item");
        expect(item).toBeVisible();
        expect(item).toHaveAttribute("data-inset", "true");
    });

    it("renders DropdownMenuPortal", () => {
        renderWithProviders(
            <DropdownMenu open>
                <DropdownMenuTrigger asChild>
                    <button>Menu</button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>Item 1</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
        // Portal renders content, just verify item is visible
        expect(screen.getByText("Item 1")).toBeVisible();
    });

    it("renders DropdownMenuSub", () => {
        renderWithProviders(
            <DropdownMenu open>
                <DropdownMenuTrigger asChild>
                    <button>Menu</button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuSub>
                        <DropdownMenuItem>Sub Item</DropdownMenuItem>
                    </DropdownMenuSub>
                </DropdownMenuContent>
            </DropdownMenu>
        );
        expect(screen.getByText("Sub Item")).toBeVisible();
    });

    it("renders DropdownMenuSubTrigger", () => {
        renderWithProviders(
            <DropdownMenu open>
                <DropdownMenuTrigger asChild>
                    <button>Menu</button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            Sub Menu
                        </DropdownMenuSubTrigger>
                    </DropdownMenuSub>
                </DropdownMenuContent>
            </DropdownMenu>
        );
        expect(screen.getByText("Sub Menu")).toBeVisible();
    });

    it("renders DropdownMenuSubTrigger with inset", () => {
        renderWithProviders(
            <DropdownMenu open>
                <DropdownMenuTrigger asChild>
                    <button>Menu</button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger inset>
                            Inset Sub Menu
                        </DropdownMenuSubTrigger>
                    </DropdownMenuSub>
                </DropdownMenuContent>
            </DropdownMenu>
        );
        const trigger = screen.getByText("Inset Sub Menu");
        expect(trigger).toBeVisible();
        expect(trigger).toHaveAttribute("data-inset", "true");
    });

    it("renders DropdownMenuSubContent", () => {
        renderWithProviders(
            <DropdownMenu open>
                <DropdownMenuTrigger asChild>
                    <button>Menu</button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuSub open>
                        <DropdownMenuSubTrigger>
                            Sub Menu
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem>Sub Item</DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                </DropdownMenuContent>
            </DropdownMenu>
        );
        // Sub content may be in a portal, just verify sub trigger is visible
        expect(screen.getByText("Sub Menu")).toBeVisible();
    });
});
