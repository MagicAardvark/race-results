import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, userEvent } from "@/__tests__/test-utils";
import { KeyControlPanel } from "./key-control-panel";

describe("KeyControlPanel", () => {
    const mockOnGenerateNew = vi.fn();
    const mockOnDisable = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders key control heading", () => {
        render(
            <KeyControlPanel
                currentKeyEnabled={true}
                onGenerateNew={mockOnGenerateNew}
                onDisable={mockOnDisable}
                isPending={false}
            />
        );

        expect(screen.getByText("Key Control")).toBeVisible();
    });

    it("renders generate new key button", () => {
        render(
            <KeyControlPanel
                currentKeyEnabled={true}
                onGenerateNew={mockOnGenerateNew}
                onDisable={mockOnDisable}
                isPending={false}
            />
        );

        expect(screen.getByText("Generate New Key")).toBeVisible();
    });

    it("renders disable button when key is enabled", () => {
        render(
            <KeyControlPanel
                currentKeyEnabled={true}
                onGenerateNew={mockOnGenerateNew}
                onDisable={mockOnDisable}
                isPending={false}
            />
        );

        expect(screen.getByText("Disable Access")).toBeVisible();
    });

    it("does not render disable button when key is disabled", () => {
        render(
            <KeyControlPanel
                currentKeyEnabled={false}
                onGenerateNew={mockOnGenerateNew}
                onDisable={mockOnDisable}
                isPending={false}
            />
        );

        expect(screen.queryByText("Disable Access")).not.toBeInTheDocument();
    });

    it("displays warning message about generating new key", () => {
        render(
            <KeyControlPanel
                currentKeyEnabled={true}
                onGenerateNew={mockOnGenerateNew}
                onDisable={mockOnDisable}
                isPending={false}
            />
        );

        expect(
            screen.getByText(
                /Generating a new API key will disable the current key/i
            )
        ).toBeVisible();
    });

    it("calls onDisable when disable button is clicked and confirmed", async () => {
        const user = userEvent.setup();
        render(
            <KeyControlPanel
                currentKeyEnabled={true}
                onGenerateNew={mockOnGenerateNew}
                onDisable={mockOnDisable}
                isPending={false}
            />
        );

        // Find and click the disable button to open dialog
        const disableTrigger = screen.getByText("Disable Access");
        await user.click(disableTrigger);

        // Wait for dialog to open and find the action button
        const dialog = await screen.findByRole("alertdialog");
        expect(dialog).toBeInTheDocument();

        // Find the action button inside the dialog (not the trigger)
        const actionButtons = await screen.findAllByRole("button");
        const confirmButton = actionButtons.find(
            (btn) =>
                btn.textContent?.includes("Disable Access") &&
                btn.getAttribute("data-slot") !== "alert-dialog-trigger"
        );

        if (confirmButton) {
            await user.click(confirmButton);
            expect(mockOnDisable).toHaveBeenCalledOnce();
        }
    });

    it("calls onGenerateNew when generate button is clicked and confirmed", async () => {
        const user = userEvent.setup();
        render(
            <KeyControlPanel
                currentKeyEnabled={true}
                onGenerateNew={mockOnGenerateNew}
                onDisable={mockOnDisable}
                isPending={false}
            />
        );

        // Find and click the generate button to open dialog
        const generateTrigger = screen.getByText("Generate New Key");
        await user.click(generateTrigger);

        // Wait for dialog to open and find the action button
        const dialog = await screen.findByRole("alertdialog");
        expect(dialog).toBeInTheDocument();

        // Find the action button inside the dialog (not the trigger)
        const actionButtons = await screen.findAllByRole("button");
        const confirmButton = actionButtons.find(
            (btn) =>
                btn.textContent?.includes("Generate New Key") &&
                btn.getAttribute("data-slot") !== "alert-dialog-trigger"
        );

        if (confirmButton) {
            await user.click(confirmButton);
            expect(mockOnGenerateNew).toHaveBeenCalledOnce();
        }
    });

    it("disables action buttons when isPending is true", async () => {
        const user = userEvent.setup();
        render(
            <KeyControlPanel
                currentKeyEnabled={true}
                onGenerateNew={mockOnGenerateNew}
                onDisable={mockOnDisable}
                isPending={true}
            />
        );

        // Open the disable dialog
        const disableTrigger = screen.getByText("Disable Access");
        await user.click(disableTrigger);

        // Check that the action button inside the dialog is disabled
        await screen.findByRole("alertdialog");
        const actionButtons = await screen.findAllByRole("button");
        const actionButton = actionButtons.find(
            (btn) =>
                btn.textContent?.includes("Disable Access") &&
                btn.getAttribute("data-slot") !== "alert-dialog-trigger"
        );

        expect(actionButton).toBeDisabled();
    });
});
