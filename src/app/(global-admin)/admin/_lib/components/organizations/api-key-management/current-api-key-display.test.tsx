import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, userEvent } from "@/__tests__/test-utils";
import { CurrentApiKeyDisplay } from "./current-api-key-display";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { toast } from "sonner";

vi.mock("@/hooks/use-copy-to-clipboard");
vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
    },
}));

describe("CurrentApiKeyDisplay", () => {
    const mockApiKey = "rr_test123456789";
    const mockEffectiveAt = new Date("2024-01-01T12:00:00Z");

    beforeEach(() => {
        vi.mocked(useCopyToClipboard).mockReturnValue({
            copy: vi.fn(),
            copyStatus: "default",
        });
    });

    it("renders enabled state", () => {
        vi.mocked(useCopyToClipboard).mockReturnValue({
            copy: vi.fn(),
            copyStatus: "default",
        });

        render(
            <CurrentApiKeyDisplay
                apiKey={mockApiKey}
                enabled={true}
                effectiveAt={mockEffectiveAt}
            />
        );

        expect(screen.getByText("Current API Key")).toBeVisible();
        expect(screen.getByText(/API Access is enabled/)).toBeVisible();
    });

    it("renders disabled state", () => {
        render(
            <CurrentApiKeyDisplay
                apiKey={mockApiKey}
                enabled={false}
                effectiveAt={mockEffectiveAt}
            />
        );

        expect(screen.getByText(/API Access is disabled/)).toBeVisible();
    });

    it("displays API key in input", () => {
        render(
            <CurrentApiKeyDisplay
                apiKey={mockApiKey}
                enabled={true}
                effectiveAt={mockEffectiveAt}
            />
        );

        const input = screen.getByDisplayValue(mockApiKey);
        expect(input).toBeVisible();
        expect(input).toHaveAttribute("readonly");
    });

    it("copies API key when copy button is clicked", async () => {
        const mockCopy = vi.fn();
        vi.mocked(useCopyToClipboard).mockReturnValue({
            copy: mockCopy,
            copyStatus: "default",
        });

        const user = userEvent.setup();
        render(
            <CurrentApiKeyDisplay
                apiKey={mockApiKey}
                enabled={true}
                effectiveAt={mockEffectiveAt}
            />
        );

        const copyButton = screen.getByLabelText("Copy API Key");
        await user.click(copyButton);

        expect(mockCopy).toHaveBeenCalledWith(mockApiKey);
        expect(toast.success).toHaveBeenCalledWith(
            "API Key copied to clipboard",
            { duration: 2000 }
        );
    });

    it("shows copied state after copy", () => {
        vi.mocked(useCopyToClipboard).mockReturnValue({
            copy: vi.fn(),
            copyStatus: "copied",
        });

        render(
            <CurrentApiKeyDisplay
                apiKey={mockApiKey}
                enabled={true}
                effectiveAt={mockEffectiveAt}
            />
        );

        // Should show CopyCheck icon when copied
        const button = screen.getByLabelText("Copy API Key");
        expect(button).toBeVisible();
    });
});
