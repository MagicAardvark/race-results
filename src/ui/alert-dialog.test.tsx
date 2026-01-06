import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogMedia,
} from "./alert-dialog";
import { Button } from "@/ui/button";

describe("AlertDialog", () => {
    it("renders AlertDialog component", () => {
        renderWithProviders(
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button>Open</Button>
                </AlertDialogTrigger>
            </AlertDialog>
        );

        expect(screen.getByRole("button", { name: /open/i })).toBeVisible();
    });

    it("renders AlertDialogMedia component", () => {
        renderWithProviders(
            <AlertDialog open>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogMedia data-testid="media">
                            <span>Icon</span>
                        </AlertDialogMedia>
                        <AlertDialogTitle>Test Title</AlertDialogTitle>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>
        );

        const media = screen.getByTestId("media");
        expect(media).toBeVisible();
        expect(media).toHaveAttribute("data-slot", "alert-dialog-media");
    });

    it("applies custom className to AlertDialogMedia", () => {
        renderWithProviders(
            <AlertDialog open>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogMedia
                            data-testid="media"
                            className="custom-class"
                        >
                            <span>Icon</span>
                        </AlertDialogMedia>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>
        );

        const media = screen.getByTestId("media");
        expect(media).toHaveClass("custom-class");
    });
});
