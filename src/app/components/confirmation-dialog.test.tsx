import { describe, it, expect } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/__tests__/test-utils";
import { ConfirmationDialog } from "./confirmation-dialog";
import { Button } from "@/ui/button";

describe("ConfirmationDialog", () => {
    it("renders trigger button", () => {
        renderWithProviders(
            <ConfirmationDialog
                triggerButton={<Button>Delete</Button>}
                actionButton={<Button>Confirm</Button>}
                title="Delete Item"
                content="Are you sure you want to delete this item?"
            />
        );

        expect(screen.getByRole("button", { name: /delete/i })).toBeVisible();
    });

    it("opens dialog when trigger is clicked", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <ConfirmationDialog
                triggerButton={<Button>Delete</Button>}
                actionButton={<Button>Confirm</Button>}
                title="Delete Item"
                content="Are you sure you want to delete this item?"
            />
        );

        const trigger = screen.getByRole("button", { name: /delete/i });
        await user.click(trigger);

        expect(screen.getByRole("alertdialog")).toBeVisible();
        expect(screen.getByText(/delete item/i)).toBeVisible();
        expect(
            screen.getByText(/are you sure you want to delete this item/i)
        ).toBeVisible();
    });

    it("displays custom title and content", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <ConfirmationDialog
                triggerButton={<Button>Open</Button>}
                actionButton={<Button>Save</Button>}
                title="Custom Title"
                content="Custom content message"
            />
        );

        await user.click(screen.getByRole("button", { name: /open/i }));

        expect(screen.getByText(/custom title/i)).toBeVisible();
        expect(screen.getByText(/custom content message/i)).toBeVisible();
    });

    it("displays default cancel text", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <ConfirmationDialog
                triggerButton={<Button>Open</Button>}
                actionButton={<Button>Confirm</Button>}
                title="Test"
                content="Test content"
            />
        );

        await user.click(screen.getByRole("button", { name: /open/i }));

        expect(screen.getByRole("button", { name: /cancel/i })).toBeVisible();
    });

    it("displays custom cancel text", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <ConfirmationDialog
                triggerButton={<Button>Open</Button>}
                actionButton={<Button>Confirm</Button>}
                title="Test"
                content="Test content"
                cancelText="No, go back"
            />
        );

        await user.click(screen.getByRole("button", { name: /open/i }));

        expect(
            screen.getByRole("button", { name: /no, go back/i })
        ).toBeVisible();
    });

    it("closes dialog when cancel is clicked", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <ConfirmationDialog
                triggerButton={<Button>Open</Button>}
                actionButton={<Button>Confirm</Button>}
                title="Test"
                content="Test content"
            />
        );

        await user.click(screen.getByRole("button", { name: /open/i }));
        expect(screen.getByRole("alertdialog")).toBeVisible();

        await user.click(screen.getByRole("button", { name: /cancel/i }));
        expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });

    it("renders action button in dialog", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <ConfirmationDialog
                triggerButton={<Button>Open</Button>}
                actionButton={<Button>Delete Forever</Button>}
                title="Test"
                content="Test content"
            />
        );

        await user.click(screen.getByRole("button", { name: /open/i }));

        expect(
            screen.getByRole("button", { name: /delete forever/i })
        ).toBeVisible();
    });
});
