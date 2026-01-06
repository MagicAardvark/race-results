import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useCopyToClipboard } from "./use-copy-to-clipboard";

// Mock navigator.clipboard
const mockWriteText = vi.fn();
Object.assign(navigator, {
    clipboard: {
        writeText: mockWriteText,
    },
});

describe("useCopyToClipboard", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        mockWriteText.mockResolvedValue(undefined);
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it("initializes with default status", () => {
        const { result } = renderHook(() => useCopyToClipboard());

        expect(result.current.copyStatus).toBe("default");
    });

    it("copies text to clipboard", async () => {
        const { result } = renderHook(() => useCopyToClipboard());

        result.current.copy("test text");

        // Flush promises to ensure the async operation completes
        await Promise.resolve();

        expect(mockWriteText).toHaveBeenCalledWith("test text");
    });
});
