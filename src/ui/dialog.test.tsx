import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "./dialog";
import { Button } from "@/ui/button";

describe("Dialog", () => {
    it("renders dialog structure", () => {
        renderWithProviders(
            <Dialog open>
                <DialogContent>
                    <DialogTitle>Dialog Title</DialogTitle>
                </DialogContent>
            </Dialog>
        );
        // Dialog content is in a portal, so we check for the title
        const title = screen.getByText("Dialog Title");
        expect(title).toBeVisible();
    });

    it("renders dialog with title", () => {
        renderWithProviders(
            <Dialog open>
                <DialogContent>
                    <DialogTitle>Test Dialog</DialogTitle>
                </DialogContent>
            </Dialog>
        );
        expect(screen.getByText("Test Dialog")).toBeVisible();
    });

    it("renders dialog with description", () => {
        renderWithProviders(
            <Dialog open>
                <DialogContent>
                    <DialogDescription>Test description</DialogDescription>
                </DialogContent>
            </Dialog>
        );
        expect(screen.getByText("Test description")).toBeVisible();
    });

    it("renders dialog header", () => {
        renderWithProviders(
            <Dialog open>
                <DialogContent>
                    <DialogHeader data-testid="header">
                        <DialogTitle>Title</DialogTitle>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        );
        const header = screen.getByTestId("header");
        expect(header).toBeVisible();
        expect(header).toHaveAttribute("data-slot", "dialog-header");
    });

    it("renders dialog footer", () => {
        renderWithProviders(
            <Dialog open>
                <DialogContent>
                    <DialogFooter data-testid="footer">
                        Footer Content
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
        const footer = screen.getByTestId("footer");
        expect(footer).toBeVisible();
        expect(footer).toHaveAttribute("data-slot", "dialog-footer");
    });

    it("shows close button by default", () => {
        renderWithProviders(
            <Dialog open>
                <DialogContent>
                    <DialogTitle>Test</DialogTitle>
                </DialogContent>
            </Dialog>
        );
        const closeButton = screen.getByRole("button", { name: /close/i });
        expect(closeButton).toBeVisible();
    });

    it("hides close button when showCloseButton is false", () => {
        renderWithProviders(
            <Dialog open>
                <DialogContent showCloseButton={false}>
                    <DialogTitle>Test</DialogTitle>
                </DialogContent>
            </Dialog>
        );
        const closeButton = screen.queryByRole("button", { name: /close/i });
        expect(closeButton).not.toBeInTheDocument();
    });

    it("renders footer with close button when showCloseButton is true", () => {
        renderWithProviders(
            <Dialog open>
                <DialogContent showCloseButton={false}>
                    <DialogFooter showCloseButton>Footer</DialogFooter>
                </DialogContent>
            </Dialog>
        );
        const closeButtons = screen.getAllByRole("button", { name: /close/i });
        expect(closeButtons.length).toBeGreaterThan(0);
        expect(closeButtons[0]).toBeVisible();
    });

    it("renders DialogTrigger", () => {
        renderWithProviders(
            <Dialog>
                <DialogTrigger asChild>
                    <Button>Open Dialog</Button>
                </DialogTrigger>
            </Dialog>
        );
        const trigger = screen.getByRole("button", { name: /open dialog/i });
        expect(trigger).toBeVisible();
    });

    it("renders DialogClose", () => {
        renderWithProviders(
            <Dialog open>
                <DialogContent showCloseButton={false}>
                    <DialogTitle>Test</DialogTitle>
                    <DialogClose asChild>
                        <Button>Close</Button>
                    </DialogClose>
                </DialogContent>
            </Dialog>
        );
        const closeButton = screen.getByRole("button", { name: /close/i });
        expect(closeButton).toBeVisible();
        expect(closeButton).toHaveAttribute("data-slot", "dialog-close");
    });
});
