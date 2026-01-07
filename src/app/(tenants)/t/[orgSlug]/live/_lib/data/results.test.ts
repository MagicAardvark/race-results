import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    getClassResults,
    getPaxResults,
    getRawResults,
    getRunWork,
} from "./results";
import { fetchJson } from "../utils/api-client";
import { processClassResults } from "../utils/rallycross-calculator";
import { DisplayMode } from "../types";
import { mockClassResults } from "@/__tests__/mocks/mock-class-results";
import { mockPaxResults } from "@/__tests__/mocks/mock-pax-results";
import { mockRawResults } from "@/__tests__/mocks/mock-raw-results";
import { mockRunWork } from "@/__tests__/mocks/mock-run-work";
import type {
    ClassResultsJson,
    PaxResultsJson,
    RawResultsJson,
} from "../types";

vi.mock("../utils/api-client");
vi.mock("../utils/rallycross-calculator");
vi.mock("../config/config", () => ({
    LIVE_TIMING_CONFIG: {
        api: {
            classResults: "https://example.com/class.json",
            paxResults: "https://example.com/pax.json",
            rawResults: "https://example.com/raw.json",
            runWork: "https://example.com/runwork.json",
        },
    },
}));

describe("getClassResults", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("fetches and processes class results", async () => {
        const mockData = { results: mockClassResults.results };
        vi.mocked(fetchJson).mockResolvedValue(mockData);
        vi.mocked(processClassResults).mockReturnValue(
            mockClassResults.results
        );

        const result = await getClassResults(DisplayMode.autocross);

        expect(fetchJson).toHaveBeenCalledWith(
            "https://example.com/class.json"
        );
        expect(processClassResults).toHaveBeenCalledWith(
            mockData.results,
            DisplayMode.autocross
        );
        expect(result).toEqual(mockClassResults.results);
    });

    it("returns null when data is null", async () => {
        vi.mocked(fetchJson).mockResolvedValue(null);

        const result = await getClassResults();

        expect(result).toBeNull();
    });

    it("returns null when results are missing", async () => {
        vi.mocked(fetchJson).mockResolvedValue({} as ClassResultsJson);

        const result = await getClassResults();

        expect(result).toBeNull();
    });
});

describe("getPaxResults", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("fetches pax results", async () => {
        const mockData = { results: mockPaxResults.results };
        vi.mocked(fetchJson).mockResolvedValue(mockData);

        const result = await getPaxResults();

        expect(fetchJson).toHaveBeenCalledWith("https://example.com/pax.json");
        expect(result).toEqual(mockPaxResults.results);
    });

    it("returns null when data is null", async () => {
        vi.mocked(fetchJson).mockResolvedValue(null);

        const result = await getPaxResults();

        expect(result).toBeNull();
    });

    it("returns null when results are missing", async () => {
        vi.mocked(fetchJson).mockResolvedValue({} as PaxResultsJson);

        const result = await getPaxResults();

        expect(result).toBeNull();
    });
});

describe("getRawResults", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("fetches raw results", async () => {
        const mockData = { results: mockRawResults.results };
        vi.mocked(fetchJson).mockResolvedValue(mockData);

        const result = await getRawResults();

        expect(fetchJson).toHaveBeenCalledWith("https://example.com/raw.json");
        expect(result).toEqual(mockRawResults.results);
    });

    it("returns null when data is null", async () => {
        vi.mocked(fetchJson).mockResolvedValue(null);

        const result = await getRawResults();

        expect(result).toBeNull();
    });

    it("returns null when results are missing", async () => {
        vi.mocked(fetchJson).mockResolvedValue({} as RawResultsJson);

        const result = await getRawResults();

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

        const result = await getRunWork();

        expect(fetchJson).toHaveBeenCalledWith(
            "https://example.com/runwork.json"
        );
        expect(result).toEqual(expectedData);
    });

    it("returns null when data is null", async () => {
        vi.mocked(fetchJson).mockResolvedValue(null);

        const result = await getRunWork();

        expect(result).toBeNull();
    });
});
