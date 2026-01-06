import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
    SheetClose,
} from "./sheet";
import { Button } from "@/ui/button";

describe("Sheet", () => {
    it("renders sheet structure", () => {
        renderWithProviders(
            <Sheet open>
                <SheetContent>
                    <SheetTitle>Sheet Title</SheetTitle>
                </SheetContent>
            </Sheet>
        );
        // Sheet content is in a portal, check for title
        const title = screen.getByText("Sheet Title");
        expect(title).toBeVisible();
    });

    it("renders sheet with title", () => {
        renderWithProviders(
            <Sheet open>
                <SheetContent>
                    <SheetTitle>Test Sheet</SheetTitle>
                </SheetContent>
            </Sheet>
        );
        expect(screen.getByText("Test Sheet")).toBeVisible();
    });

    it("renders sheet with description", () => {
        renderWithProviders(
            <Sheet open>
                <SheetContent>
                    <SheetDescription>Test description</SheetDescription>
                </SheetContent>
            </Sheet>
        );
        expect(screen.getByText("Test description")).toBeVisible();
    });

    it("renders sheet header", () => {
        renderWithProviders(
            <Sheet open>
                <SheetContent>
                    <SheetHeader data-testid="header">
                        <SheetTitle>Title</SheetTitle>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        );
        const header = screen.getByTestId("header");
        expect(header).toBeVisible();
        expect(header).toHaveAttribute("data-slot", "sheet-header");
    });

    it("renders sheet footer", () => {
        renderWithProviders(
            <Sheet open>
                <SheetContent>
                    <SheetFooter data-testid="footer">
                        Footer Content
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        );
        const footer = screen.getByTestId("footer");
        expect(footer).toBeVisible();
        expect(footer).toHaveAttribute("data-slot", "sheet-footer");
    });

    it("renders with default right side", () => {
        renderWithProviders(
            <Sheet open>
                <SheetContent data-testid="content">
                    <SheetTitle>Test</SheetTitle>
                </SheetContent>
            </Sheet>
        );
        const content = screen.getByTestId("content");
        expect(content).toHaveAttribute("data-side", "right");
    });

    it("renders with different sides", () => {
        const { rerender } = renderWithProviders(
            <Sheet open>
                <SheetContent side="left" data-testid="content">
                    <SheetTitle>Test</SheetTitle>
                </SheetContent>
            </Sheet>
        );
        expect(screen.getByTestId("content")).toHaveAttribute(
            "data-side",
            "left"
        );

        rerender(
            <Sheet open>
                <SheetContent side="top" data-testid="content">
                    <SheetTitle>Test</SheetTitle>
                </SheetContent>
            </Sheet>
        );
        expect(screen.getByTestId("content")).toHaveAttribute(
            "data-side",
            "top"
        );
    });

    it("shows close button by default", () => {
        renderWithProviders(
            <Sheet open>
                <SheetContent>
                    <SheetTitle>Test</SheetTitle>
                </SheetContent>
            </Sheet>
        );
        const closeButton = screen.getByRole("button", { name: /close/i });
        expect(closeButton).toBeVisible();
    });

    it("hides close button when showCloseButton is false", () => {
        renderWithProviders(
            <Sheet open>
                <SheetContent showCloseButton={false}>
                    <SheetTitle>Test</SheetTitle>
                </SheetContent>
            </Sheet>
        );
        const closeButton = screen.queryByRole("button", { name: /close/i });
        expect(closeButton).not.toBeInTheDocument();
    });

    it("renders SheetTrigger", () => {
        renderWithProviders(
            <Sheet>
                <SheetTrigger asChild>
                    <Button>Open Sheet</Button>
                </SheetTrigger>
            </Sheet>
        );
        const trigger = screen.getByRole("button", { name: /open sheet/i });
        expect(trigger).toBeVisible();
    });

    it("renders SheetClose", () => {
        renderWithProviders(
            <Sheet open>
                <SheetContent showCloseButton={false}>
                    <SheetTitle>Test</SheetTitle>
                    <SheetClose asChild>
                        <Button>Close</Button>
                    </SheetClose>
                </SheetContent>
            </Sheet>
        );
        const closeButton = screen.getByRole("button", { name: /close/i });
        expect(closeButton).toBeVisible();
        expect(closeButton).toHaveAttribute("data-slot", "sheet-close");
    });
});
