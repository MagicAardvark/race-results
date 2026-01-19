import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    getClassResults,
    getPaxResults,
    getRawResults,
    getRunWork,
} from "./results";
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
        useLocalFiles: false,
        getApiUrl: (orgSlug: string, endpoint: string) => {
            const endpoints: Record<string, string> = {
                class: "https://example.com/class.json",
                indexed: "https://example.com/pax.json",
                raw: "https://example.com/raw.json",
                runwork: "https://example.com/runwork.json",
            };
            return endpoints[endpoint] || "";
        },
    },
}));

describe("getClassResults", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("fetches class results", async () => {
        vi.mocked(fetchJson).mockResolvedValue(mockClassResults);

        const result = await getClassResults("test-org");

        expect(fetchJson).toHaveBeenCalled();
        expect(result).toEqual(mockClassResults);
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
    });

    it("fetches pax results", async () => {
        vi.mocked(fetchJson).mockResolvedValue(mockPaxResults);

        const result = await getPaxResults("test-org");

        expect(fetchJson).toHaveBeenCalled();
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
    });

    it("fetches raw results", async () => {
        vi.mocked(fetchJson).mockResolvedValue(mockRawResults);

        const result = await getRawResults("test-org");

        expect(fetchJson).toHaveBeenCalled();
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
    });

    it("fetches run work data", async () => {
        const expectedData = mockRunWork;
        vi.mocked(fetchJson).mockResolvedValue(expectedData);

        const result = await getRunWork("test-org");

        expect(fetchJson).toHaveBeenCalled();
        expect(result).toEqual(expectedData);
    });

    it("returns null when data is null", async () => {
        vi.mocked(fetchJson).mockResolvedValue(null);

        const result = await getRunWork("test-org");

        expect(result).toBeNull();
    });
});
