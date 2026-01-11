import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/__tests__/test-utils";
import { DeleteUserButton } from "./delete-user-button";
import { deleteUser } from "@/app/actions/user.actions";
import { toast } from "sonner";

vi.mock("@/app/actions/user.actions", () => ({
    deleteUser: vi.fn(),
}));

vi.mock("sonner", () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));

describe("DeleteUserButton", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders delete button", () => {
        renderWithProviders(
            <DeleteUserButton userId="user-1" userName="Test User" />
        );

        expect(
            screen.getByRole("button", { name: /delete user/i })
        ).toBeVisible();
    });

    it("opens confirmation dialog when clicked", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <DeleteUserButton userId="user-1" userName="Test User" />
        );

        const trigger = screen.getByRole("button", { name: /delete user/i });
        await user.click(trigger);

        expect(screen.getByRole("alertdialog")).toBeVisible();
        expect(
            screen.getByText(/are you sure you want to delete/i)
        ).toBeVisible();
        expect(screen.getByText(/test user/i)).toBeVisible();
    });

    it("displays generic message when userName is null", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <DeleteUserButton userId="user-1" userName={null} />
        );

        const trigger = screen.getByRole("button", { name: /delete user/i });
        await user.click(trigger);

        expect(screen.getByText(/this user/i)).toBeVisible();
    });

    it("calls deleteUser action when confirmed", async () => {
        const user = userEvent.setup();
        vi.mocked(deleteUser).mockResolvedValue({
            isError: false,
            message: "",
        });

        renderWithProviders(
            <DeleteUserButton userId="user-1" userName="Test User" />
        );

        const trigger = screen.getByRole("button", { name: /delete user/i });
        await user.click(trigger);

        // There are two buttons with "Delete User" - one is the trigger, one is in the dialog
        const confirmButtons = screen.getAllByRole("button", {
            name: /delete user/i,
        });
        const dialogConfirmButton = confirmButtons.find(
            (btn) => btn.closest('[role="alertdialog"]') !== null
        );

        if (dialogConfirmButton) {
            await user.click(dialogConfirmButton);
        }

        expect(deleteUser).toHaveBeenCalledWith("user-1");
    });

    it("shows error toast when delete fails", async () => {
        const user = userEvent.setup();
        vi.mocked(deleteUser).mockResolvedValue({
            isError: true,
            message: "Failed to delete user",
        });

        renderWithProviders(
            <DeleteUserButton userId="user-1" userName="Test User" />
        );

        const trigger = screen.getByRole("button", { name: /delete user/i });
        await user.click(trigger);

        const confirmButtons = screen.getAllByRole("button", {
            name: /delete user/i,
        });
        const dialogConfirmButton = confirmButtons.find(
            (btn) => btn.closest('[role="alertdialog"]') !== null
        );

        if (dialogConfirmButton) {
            await user.click(dialogConfirmButton);
        }

        // Wait for async operation
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(toast.error).toHaveBeenCalledWith("Failed to delete user");
    });

    it("disables button while pending", async () => {
        const user = userEvent.setup();
        let resolveDelete: () => void;
        const deletePromise = new Promise<{
            isError: boolean;
            message: string;
        }>((resolve) => {
            resolveDelete = () => resolve({ isError: false, message: "" });
        });
        vi.mocked(deleteUser).mockReturnValue(deletePromise);

        renderWithProviders(
            <DeleteUserButton userId="user-1" userName="Test User" />
        );

        const trigger = screen.getByRole("button", { name: /delete user/i });
        await user.click(trigger);

        const confirmButtons = screen.getAllByRole("button", {
            name: /delete user/i,
        });
        const dialogConfirmButton = confirmButtons.find(
            (btn) => btn.closest('[role="alertdialog"]') !== null
        );

        if (dialogConfirmButton) {
            await user.click(dialogConfirmButton);
            // Button should be disabled after click
            expect(dialogConfirmButton).toBeDisabled();
        }

        // Resolve the promise
        resolveDelete!();
        await deletePromise;
    });
});
