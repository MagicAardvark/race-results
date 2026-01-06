import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useIsMobile } from "./use-mobile";

describe("useIsMobile", () => {
    const originalInnerWidth = window.innerWidth;
    const originalMatchMedia = window.matchMedia;

    beforeEach(() => {
        // Reset window.innerWidth
        Object.defineProperty(window, "innerWidth", {
            writable: true,
            configurable: true,
            value: originalInnerWidth,
        });

        // Mock matchMedia
        window.matchMedia = vi.fn().mockImplementation((query) => {
            const matches =
                query === "(max-width: 767px)" && window.innerWidth < 768;
            return {
                matches,
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            };
        });
    });

    afterEach(() => {
        window.matchMedia = originalMatchMedia;
        Object.defineProperty(window, "innerWidth", {
            writable: true,
            configurable: true,
            value: originalInnerWidth,
        });
    });

    it("returns true for mobile width", () => {
        Object.defineProperty(window, "innerWidth", {
            writable: true,
            configurable: true,
            value: 500,
        });

        const { result } = renderHook(() => useIsMobile());

        expect(result.current).toBe(true);
    });

    it("returns false for desktop width", () => {
        Object.defineProperty(window, "innerWidth", {
            writable: true,
            configurable: true,
            value: 1024,
        });

        const { result } = renderHook(() => useIsMobile());

        expect(result.current).toBe(false);
    });

    it("returns false for tablet width (768px)", () => {
        Object.defineProperty(window, "innerWidth", {
            writable: true,
            configurable: true,
            value: 768,
        });

        const { result } = renderHook(() => useIsMobile());

        expect(result.current).toBe(false);
    });

    it("returns true for width just below breakpoint", () => {
        Object.defineProperty(window, "innerWidth", {
            writable: true,
            configurable: true,
            value: 767,
        });

        const { result } = renderHook(() => useIsMobile());

        expect(result.current).toBe(true);
    });

    it("updates when window width changes", () => {
        const addEventListenerSpy = vi.fn();
        const removeEventListenerSpy = vi.fn();

        window.matchMedia = vi.fn().mockImplementation((query) => {
            const matches =
                query === "(max-width: 767px)" && window.innerWidth < 768;
            const mockMedia = {
                matches,
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: addEventListenerSpy,
                removeEventListener: removeEventListenerSpy,
                dispatchEvent: vi.fn(),
            };
            return mockMedia;
        });

        Object.defineProperty(window, "innerWidth", {
            writable: true,
            configurable: true,
            value: 1024,
        });

        const { unmount } = renderHook(() => useIsMobile());

        // Verify addEventListener was called
        expect(addEventListenerSpy).toHaveBeenCalledWith(
            "change",
            expect.any(Function)
        );

        unmount();

        // Verify removeEventListener was called on unmount
        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            "change",
            expect.any(Function)
        );
    });
});
