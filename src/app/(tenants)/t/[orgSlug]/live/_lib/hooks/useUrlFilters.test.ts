import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useUrlFilters } from "./useUrlFilters";

// Mock Next.js navigation
const mockReplace = vi.fn();
const mockPathname = "/test/path";
const mockSearchParams = new URLSearchParams("?classes=SS,STR");

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        replace: mockReplace,
    }),
    usePathname: () => mockPathname,
    useSearchParams: () => mockSearchParams,
}));

describe("useUrlFilters", () => {
    beforeEach(() => {
        mockReplace.mockClear();
        mockSearchParams.toString = vi.fn(() => "classes=SS,STR");
    });

    it("returns filters from URL search params", () => {
        const { result } = renderHook(() => useUrlFilters());

        const filters = result.current.getFilters("classes");
        expect(filters).toEqual(["SS", "STR"]);
    });

    it("returns empty array when param doesn't exist", () => {
        const { result } = renderHook(() => useUrlFilters());

        const filters = result.current.getFilters("nonexistent");
        expect(filters).toEqual([]);
    });

    it("filters values against valid values list", () => {
        const { result } = renderHook(() => useUrlFilters());

        const filters = result.current.getFilters("classes", ["SS", "DST"]);
        // STR is not in valid values, so it should be filtered out
        expect(filters).toEqual(["SS"]);
    });

    it("updates filters in URL", async () => {
        const { result } = renderHook(() => useUrlFilters());

        result.current.updateFilters("classes", ["SS", "DST"]);

        // updateFilters uses startTransition, so it's async
        // Wait for it to be called
        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalled();
        });
    });

    it("removes param when values array is empty", async () => {
        const { result } = renderHook(() => useUrlFilters());

        result.current.updateFilters("classes", []);

        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalled();
        });
    });
});
