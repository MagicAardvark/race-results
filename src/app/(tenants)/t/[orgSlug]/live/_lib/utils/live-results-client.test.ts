import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
    getClassResults,
    getPaxResults,
    getRawResults,
    getRunWork,
} from "./live-results-client";
import { fetchJson } from "../utils/api-client";
import { mockClassResults } from "@/__tests__/mocks/mock-class-results";
import { mockPaxResults } from "@/__tests__/mocks/mock-pax-results";
import { mockRawResults } from "@/__tests__/mocks/mock-raw-results";
import { mockRunWork } from "@/__tests__/mocks/mock-run-work";

vi.mock("../utils/api-client");
vi.mock("next/headers", () => ({
    headers: vi.fn(() => {
        const headers = new Map();
        headers.set("cookie", "test-cookie=value");
        return {
            get: (key: string) => headers.get(key) || null,
        };
    }),
}));
vi.mock("../config/config", () => ({
    LIVE_TIMING_CONFIG: {
        get useLocalFiles() {
            return process.env.USE_LOCAL_FILES === "true";
        },
        getApiUrl: (orgSlug: string, endpoint: string) => {
            const useLocal = process.env.USE_LOCAL_FILES === "true";
            if (useLocal) {
                const localPaths: Record<string, string> = {
                    class: "/datasets/live-results/live/results/class.json",
                    indexed: "/datasets/live-results/live/results/indexed.json",
                    raw: "/datasets/live-results/live/results/raw.json",
                    runwork: "/datasets/live-results/live/results/runwork.json",
                };
                return localPaths[endpoint] || "";
            }
            const apiPaths: Record<string, string> = {
                class: "/api/test-org/live/results/class",
                indexed: "/api/test-org/live/results/indexed",
                raw: "/api/test-org/live/results/raw",
                runwork: "/api/test-org/live/runwork",
            };
            return apiPaths[endpoint] || "";
        },
    },
}));

const originalEnv = process.env;

// Helper to get expected base URL based on environment
function getExpectedBaseUrl(): string {
    if (process.env.APP_URL) {
        return process.env.APP_URL;
    }
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }
    return "http://localhost:3000";
}

describe("getClassResults", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env = { ...originalEnv };
        delete process.env.USE_LOCAL_FILES;
        delete process.env.APP_URL;
        delete process.env.VERCEL_URL;
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it("fetches class results from API", async () => {
        vi.mocked(fetchJson).mockResolvedValue(mockClassResults);

        const result = await getClassResults("test-org");

        const expectedBaseUrl = getExpectedBaseUrl();
        expect(fetchJson).toHaveBeenCalledWith(
            `${expectedBaseUrl}/api/test-org/live/results/class`,
            expect.objectContaining({
                headers: expect.objectContaining({
                    cookie: "test-cookie=value",
                }),
            })
        );
        expect(result).toEqual(mockClassResults);
    });

    it("uses APP_URL when set", async () => {
        process.env.APP_URL = "https://example.com";
        vi.mocked(fetchJson).mockResolvedValue(mockClassResults);

        await getClassResults("test-org");

        expect(fetchJson).toHaveBeenCalledWith(
            "https://example.com/api/test-org/live/results/class",
            expect.any(Object)
        );
    });

    it("uses VERCEL_URL when APP_URL is not set", async () => {
        process.env.VERCEL_URL = "example.vercel.app";
        vi.mocked(fetchJson).mockResolvedValue(mockClassResults);

        await getClassResults("test-org");

        expect(fetchJson).toHaveBeenCalledWith(
            "https://example.vercel.app/api/test-org/live/results/class",
            expect.any(Object)
        );
    });

    it("returns null when data is null", async () => {
        vi.mocked(fetchJson).mockResolvedValue(null);

        const result = await getClassResults("test-org");

        expect(result).toBeNull();
    });

    it("returns null when fetch fails", async () => {
        vi.mocked(fetchJson).mockRejectedValue(new Error("Fetch failed"));

        const result = await getClassResults("test-org");

        expect(result).toBeNull();
    });
});

describe("getPaxResults", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env = { ...originalEnv };
        delete process.env.USE_LOCAL_FILES;
        delete process.env.APP_URL;
        delete process.env.VERCEL_URL;
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it("fetches pax results from API", async () => {
        vi.mocked(fetchJson).mockResolvedValue(mockPaxResults);

        const result = await getPaxResults("test-org");

        const expectedBaseUrl = getExpectedBaseUrl();
        expect(fetchJson).toHaveBeenCalledWith(
            `${expectedBaseUrl}/api/test-org/live/results/indexed`,
            expect.objectContaining({
                headers: expect.objectContaining({
                    cookie: "test-cookie=value",
                }),
            })
        );
        expect(result).toEqual(mockPaxResults);
    });

    it("returns null when data is null", async () => {
        vi.mocked(fetchJson).mockResolvedValue(null);

        const result = await getPaxResults("test-org");

        expect(result).toBeNull();
    });

    it("returns null when fetch fails", async () => {
        vi.mocked(fetchJson).mockRejectedValue(new Error("Fetch failed"));

        const result = await getPaxResults("test-org");

        expect(result).toBeNull();
    });
});

describe("getRawResults", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env = { ...originalEnv };
        delete process.env.USE_LOCAL_FILES;
        delete process.env.APP_URL;
        delete process.env.VERCEL_URL;
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it("fetches raw results from API", async () => {
        vi.mocked(fetchJson).mockResolvedValue(mockRawResults);

        const result = await getRawResults("test-org");

        const expectedBaseUrl = getExpectedBaseUrl();
        expect(fetchJson).toHaveBeenCalledWith(
            `${expectedBaseUrl}/api/test-org/live/results/raw`,
            expect.objectContaining({
                headers: expect.objectContaining({
                    cookie: "test-cookie=value",
                }),
            })
        );
        expect(result).toEqual(mockRawResults);
    });

    it("returns null when data is null", async () => {
        vi.mocked(fetchJson).mockResolvedValue(null);

        const result = await getRawResults("test-org");

        expect(result).toBeNull();
    });

    it("returns null when fetch fails", async () => {
        vi.mocked(fetchJson).mockRejectedValue(new Error("Fetch failed"));

        const result = await getRawResults("test-org");

        expect(result).toBeNull();
    });
});

describe("getRunWork", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env = { ...originalEnv };
        delete process.env.USE_LOCAL_FILES;
        delete process.env.APP_URL;
        delete process.env.VERCEL_URL;
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it("fetches run work data from API", async () => {
        const expectedData = mockRunWork;
        vi.mocked(fetchJson).mockResolvedValue(expectedData);

        const result = await getRunWork("test-org");

        const expectedBaseUrl = getExpectedBaseUrl();
        expect(fetchJson).toHaveBeenCalledWith(
            `${expectedBaseUrl}/api/test-org/live/runwork`,
            expect.objectContaining({
                headers: expect.objectContaining({
                    cookie: "test-cookie=value",
                }),
            })
        );
        expect(result).toEqual(expectedData);
    });

    it("returns null when data is null", async () => {
        vi.mocked(fetchJson).mockResolvedValue(null);

        const result = await getRunWork("test-org");

        expect(result).toBeNull();
    });
});
