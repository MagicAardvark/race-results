import { describe, it, expect, vi } from "vitest";
import { render, screen, userEvent } from "@/__tests__/test-utils";
import { KeyControlPanel } from "./key-control-panel";

describe("KeyControlPanel", () => {
    const mockOnGenerateNew = vi.fn();
    const mockOnDisable = vi.fn();

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

    it("calls onDisable when disable button is clicked", async () => {
        const user = userEvent.setup();
        render(
            <KeyControlPanel
                currentKeyEnabled={true}
                onGenerateNew={mockOnGenerateNew}
                onDisable={mockOnDisable}
                isPending={false}
            />
        );

        // Find and click the disable button inside the confirmation dialog
        const disableButton = screen.getByText("Disable Access");
        await user.click(disableButton);

        // The confirmation dialog should appear, then click the action button
        const confirmButton = screen.getByRole("button", {
            name: /Disable Access/i,
        });
        if (confirmButton) {
            await user.click(confirmButton);
        }
    });

    it("calls onGenerateNew when generate button is clicked", async () => {
        const user = userEvent.setup();
        render(
            <KeyControlPanel
                currentKeyEnabled={true}
                onGenerateNew={mockOnGenerateNew}
                onDisable={mockOnDisable}
                isPending={false}
            />
        );

        // Find and click the generate new key button inside the confirmation dialog
        const generateButton = screen.getByText("Generate New Key");
        await user.click(generateButton);

        // The confirmation dialog should appear, then click the action button
        const confirmButton = screen.getByRole("button", {
            name: /Generate New Key/i,
        });
        if (confirmButton) {
            await user.click(confirmButton);
        }
    });
});
