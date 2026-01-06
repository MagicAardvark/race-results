import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchJson } from "./api-client";

describe("fetchJson", () => {
    const originalFetch = global.fetch;
    const originalConsoleError = console.error;

    beforeEach(() => {
        global.fetch = vi.fn();
        console.error = vi.fn();
    });

    afterEach(() => {
        global.fetch = originalFetch;
        console.error = originalConsoleError;
        vi.clearAllMocks();
    });

    it("fetches and returns JSON data", async () => {
        const mockData = { result: "success" };
        (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            ok: true,
            json: async () => mockData,
        });

        const result = await fetchJson<typeof mockData>(
            "https://example.com/api"
        );

        expect(result).toEqual(mockData);
        expect(global.fetch).toHaveBeenCalledWith("https://example.com/api", {
            cache: "no-store",
        });
    });

    it("uses custom cache option", async () => {
        const mockData = { result: "success" };
        (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            ok: true,
            json: async () => mockData,
        });

        await fetchJson("https://example.com/api", { cache: "force-cache" });

        expect(global.fetch).toHaveBeenCalledWith("https://example.com/api", {
            cache: "force-cache",
        });
    });

    it("uses next revalidate option", async () => {
        const mockData = { result: "success" };
        (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            ok: true,
            json: async () => mockData,
        });

        await fetchJson("https://example.com/api", {
            next: { revalidate: 60 },
        });

        expect(global.fetch).toHaveBeenCalledWith(
            "https://example.com/api",
            expect.objectContaining({
                next: { revalidate: 60 },
            })
        );
    });

    it("throws error when response is not ok", async () => {
        (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            ok: false,
            status: 404,
            statusText: "Not Found",
            json: async () => ({}),
        });

        await expect(fetchJson("https://example.com/api")).rejects.toThrow(
            "Failed to fetch: 404 Not Found"
        );
    });

    it("logs error and rethrows on fetch failure", async () => {
        const fetchError = new Error("Network error");
        (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
            fetchError
        );

        await expect(fetchJson("https://example.com/api")).rejects.toThrow(
            "Network error"
        );

        expect(console.error).toHaveBeenCalledWith(
            "Error fetching https://example.com/api:",
            fetchError
        );
    });

    it("returns null when response is not ok and json parsing fails", async () => {
        (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            ok: false,
            status: 500,
            statusText: "Internal Server Error",
            json: async () => {
                throw new Error("Invalid JSON");
            },
        });

        await expect(fetchJson("https://example.com/api")).rejects.toThrow(
            "Failed to fetch: 500 Internal Server Error"
        );
    });
});
