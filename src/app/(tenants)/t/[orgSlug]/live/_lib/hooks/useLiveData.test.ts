import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import React from "react";
import { useLiveData } from "./useLiveData";
import { TenantProvider } from "@/context/TenantContext";
import { LiveResultsProvider } from "../context/live-results-context";
import { mockClassResults } from "@/__tests__/mocks/mock-class-results";
import { mockPaxResults } from "@/__tests__/mocks/mock-pax-results";
import { mockRawResults } from "@/__tests__/mocks/mock-raw-results";
import { DisplayMode } from "../types";
import type { ClassResult, RawResult } from "../types";
import type { ValidTenant } from "@/dto/tenants";

const defaultTenant: ValidTenant = {
    isValid: true,
    isGlobal: false,
    org: {
        orgId: "test-org-id",
        name: "Test Organization",
        slug: "test-org",
        motorsportregOrgId: null,
        description: null,
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
    },
};

describe("useLiveData", () => {
    const createWrapper = (liveData: {
        classResults?: Record<string, ClassResult[]>;
        paxResults?: ClassResult[];
        rawResults?: RawResult[];
    }) => {
        const Wrapper = ({ children }: { children: React.ReactNode }) =>
            // eslint-disable-next-line react/no-children-prop
            React.createElement(
                TenantProvider,
                { tenant: defaultTenant, children: undefined },
                // eslint-disable-next-line react/no-children-prop
                React.createElement(LiveResultsProvider, {
                    classResults: liveData.classResults ?? {},
                    paxResults: liveData.paxResults ?? [],
                    rawResults: liveData.rawResults ?? [],
                    runWork: null,
                    displayMode: DisplayMode.autocross,
                    featureFlags: {},
                    children: children,
                })
            );
        Wrapper.displayName = "TestWrapper";
        return Wrapper;
    };

    it("returns class results from context", () => {
        const { result } = renderHook(() => useLiveData(), {
            wrapper: createWrapper({
                classResults: mockClassResults.results,
            }),
        });

        expect(result.current.classResults).toEqual(mockClassResults.results);
    });

    it("returns pax results from context", () => {
        const { result } = renderHook(() => useLiveData(), {
            wrapper: createWrapper({
                paxResults: mockPaxResults.results,
            }),
        });

        expect(result.current.paxResults).toEqual(mockPaxResults.results);
    });

    it("returns raw results from context", () => {
        const { result } = renderHook(() => useLiveData(), {
            wrapper: createWrapper({
                rawResults: mockRawResults.results,
            }),
        });

        expect(result.current.rawResults).toEqual(mockRawResults.results);
    });

    it("returns class names from class results", () => {
        const { result } = renderHook(() => useLiveData(), {
            wrapper: createWrapper({
                classResults: mockClassResults.results,
            }),
        });

        expect(result.current.classNames).toContain("SS");
        expect(result.current.classNames).toContain("DST");
        expect(result.current.classNames).toContain("CS");
    });

    it("returns empty array for class names when no class results", () => {
        const { result } = renderHook(() => useLiveData(), {
            wrapper: createWrapper({}),
        });

        expect(result.current.classNames).toEqual([]);
    });

    it("creates driver ID correctly", () => {
        const { result } = renderHook(() => useLiveData(), {
            wrapper: createWrapper({
                classResults: mockClassResults.results,
            }),
        });

        const driverId = result.current.createDriverId({
            name: "John Doe",
            number: "1",
            carClass: "SS",
        });

        expect(driverId).toBe("John Doe|1|SS");
    });

    it("gets all drivers from class results", () => {
        const { result } = renderHook(() => useLiveData(), {
            wrapper: createWrapper({
                classResults: mockClassResults.results,
            }),
        });

        const drivers = result.current.getAllDrivers();
        expect(drivers.length).toBeGreaterThan(0);
        expect(drivers[0]).toHaveProperty("id");
        expect(drivers[0]).toHaveProperty("name");
        expect(drivers[0]).toHaveProperty("number");
        expect(drivers[0]).toHaveProperty("carClass");
    });

    it("finds driver in class results", () => {
        const { result } = renderHook(() => useLiveData(), {
            wrapper: createWrapper({
                classResults: mockClassResults.results,
            }),
        });

        const classResult = mockClassResults.results.SS[0];
        const driverId = result.current.createDriverId(classResult);
        const found = result.current.findDriverInClassResults(driverId);

        expect(found).not.toBeNull();
        expect(found?.name).toBe(classResult.name);
    });

    it("returns null when driver not found in class results", () => {
        const { result } = renderHook(() => useLiveData(), {
            wrapper: createWrapper({
                classResults: mockClassResults.results,
            }),
        });

        const found =
            result.current.findDriverInClassResults("nonexistent|1|SS");
        expect(found).toBeNull();
    });

    it("finds driver in pax results", () => {
        const { result } = renderHook(() => useLiveData(), {
            wrapper: createWrapper({
                paxResults: mockPaxResults.results,
            }),
        });

        const paxResult = mockPaxResults.results[0];
        const driverId = result.current.createDriverId(paxResult);
        const found = result.current.findDriverInPaxResults(driverId);

        expect(found).not.toBeNull();
        expect(found?.name).toBe(paxResult.name);
    });

    it("finds driver in raw results", () => {
        const { result } = renderHook(() => useLiveData(), {
            wrapper: createWrapper({
                rawResults: mockRawResults.results,
            }),
        });

        const rawResult = mockRawResults.results[0];
        const driverId = result.current.createDriverId({
            name: rawResult.entryInfo.name,
            number: rawResult.entryInfo.number.toString(),
            carClass: rawResult.entryInfo.carClass,
        });
        const found = result.current.findDriverInRawResults(driverId);

        expect(found).not.toBeNull();
        expect(found?.entryInfo.name).toBe(rawResult.entryInfo.name);
    });

    it("includes drivers from raw results in getAllDrivers", () => {
        const { result } = renderHook(() => useLiveData(), {
            wrapper: createWrapper({
                rawResults: mockRawResults.results,
            }),
        });

        const allDrivers = result.current.getAllDrivers();
        expect(allDrivers.length).toBeGreaterThan(0);

        // Check that raw result drivers are included
        const rawDriver = allDrivers.find(
            (d) => d.name === mockRawResults.results[0].entryInfo.name
        );
        expect(rawDriver).toBeDefined();
        expect(rawDriver?.car).toBe(mockRawResults.results[0].entryInfo.car);
        expect(rawDriver?.color).toBe(
            mockRawResults.results[0].entryInfo.color
        );
    });

    it("sorts drivers by name then number in getAllDrivers", () => {
        const { result } = renderHook(() => useLiveData(), {
            wrapper: createWrapper({
                classResults: mockClassResults.results,
                paxResults: mockPaxResults.results,
                rawResults: mockRawResults.results,
            }),
        });

        const allDrivers = result.current.getAllDrivers();

        // Should be sorted by name, then by number
        for (let i = 1; i < allDrivers.length; i++) {
            const prev = allDrivers[i - 1];
            const curr = allDrivers[i];

            if (prev.name === curr.name) {
                expect(
                    String(prev.number).localeCompare(String(curr.number))
                ).toBeLessThanOrEqual(0);
            } else {
                expect(prev.name.localeCompare(curr.name)).toBeLessThanOrEqual(
                    0
                );
            }
        }
    });
});
