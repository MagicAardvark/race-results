import { describe, it, expect } from "vitest";
import { getClassResultKey, getRawResultKey } from "./key-generators";
import type { ClassResult, RawResult } from "../types";

describe("getClassResultKey", () => {
    const mockClassResult: ClassResult = {
        name: "John Doe",
        number: "1",
        carClass: "SS",
        carClassGroup: "SS",
        car: "Test Car",
        color: "Red",
        position: "1",
        paxPosition: 1,
        runInfo: {
            total: 45.123,
            paxTime: 40.0,
            cleanCount: 1,
            coneCount: 0,
            dnfCount: 0,
            toFirstInClass: 0,
            toNextInClass: 0,
            toFirstInPax: 0,
            toNextInPax: 0,
            runs: [],
            rallyCrossTime: 0,
            rallyCrossToFirst: 0,
            rallyCrossToNext: 0,
        },
    };

    it("generates key with className", () => {
        const key = getClassResultKey(mockClassResult, "SS");
        expect(key).toBe("SS-1-1-John Doe");
    });

    it("generates key without className", () => {
        const key = getClassResultKey(mockClassResult);
        expect(key).toBe("1-1-1-John Doe");
    });

    it("generates unique keys for different positions", () => {
        const result1 = { ...mockClassResult, position: "1" };
        const result2 = { ...mockClassResult, position: "2" };
        expect(getClassResultKey(result1, "SS")).not.toBe(
            getClassResultKey(result2, "SS")
        );
    });

    it("generates unique keys for different drivers", () => {
        const result1 = { ...mockClassResult, name: "John Doe" };
        const result2 = { ...mockClassResult, name: "Jane Smith" };
        expect(getClassResultKey(result1, "SS")).not.toBe(
            getClassResultKey(result2, "SS")
        );
    });
});

describe("getRawResultKey", () => {
    const mockRawResult: RawResult = {
        entryInfo: {
            name: "John Doe",
            number: 1,
            carClass: "SS",
            car: "Test Car",
            color: "Red",
        },
        time: 45.123,
        total: 45.123,
        coneCount: 0,
        position: 1,
        toFirst: 0,
        toNext: 0,
    };

    it("generates key from raw result", () => {
        const key = getRawResultKey(mockRawResult);
        expect(key).toBe("1-1-John Doe");
    });

    it("generates unique keys for different positions", () => {
        const result1 = { ...mockRawResult, position: 1 };
        const result2 = { ...mockRawResult, position: 2 };
        expect(getRawResultKey(result1)).not.toBe(getRawResultKey(result2));
    });

    it("generates unique keys for different drivers", () => {
        const result1 = {
            ...mockRawResult,
            entryInfo: { ...mockRawResult.entryInfo, name: "John Doe" },
        };
        const result2 = {
            ...mockRawResult,
            entryInfo: { ...mockRawResult.entryInfo, name: "Jane Smith" },
        };
        expect(getRawResultKey(result1)).not.toBe(getRawResultKey(result2));
    });
});
