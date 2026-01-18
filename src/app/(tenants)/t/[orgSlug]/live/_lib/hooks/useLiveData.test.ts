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
import type {
    ProcessedLiveClassResults,
    ProcessedLiveIndexResults,
    ProcessedLiveRawResults,
} from "../types";
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
        classResults?: ProcessedLiveClassResults | null;
        paxResults?: ProcessedLiveIndexResults | null;
        rawResults?: ProcessedLiveRawResults | null;
    }) => {
        const Wrapper = ({ children }: { children: React.ReactNode }) =>
            // eslint-disable-next-line react/no-children-prop
            React.createElement(
                TenantProvider,
                { tenant: defaultTenant, children: undefined },
                // eslint-disable-next-line react/no-children-prop
                React.createElement(LiveResultsProvider, {
                    classResults: liveData.classResults ?? null,
                    paxResults: liveData.paxResults ?? null,
                    rawResults: liveData.rawResults ?? null,
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
                classResults: mockClassResults,
            }),
        });

        expect(result.current.classResults).toEqual(mockClassResults);
    });

    it("returns pax results from context", () => {
        const { result } = renderHook(() => useLiveData(), {
            wrapper: createWrapper({
                paxResults: mockPaxResults,
            }),
        });

        expect(result.current.paxResults).toEqual(mockPaxResults);
    });

    it("returns raw results from context", () => {
        const { result } = renderHook(() => useLiveData(), {
            wrapper: createWrapper({
                rawResults: mockRawResults,
            }),
        });

        expect(result.current.rawResults).toEqual(mockRawResults);
    });

    it("returns class names from class results", () => {
        const { result } = renderHook(() => useLiveData(), {
            wrapper: createWrapper({
                classResults: mockClassResults,
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
                classResults: mockClassResults,
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
                classResults: mockClassResults,
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
                classResults: mockClassResults,
            }),
        });

        const classEntry = mockClassResults.results[0]!.entries[0]!;
        const driverId = result.current.createDriverId({
            name: classEntry.driverName,
            number: classEntry.carNumber,
            carClass: classEntry.class,
        });
        const found = result.current.findDriverInClassResults(driverId);

        expect(found).not.toBeNull();
        expect(found?.driverName).toBe(classEntry.driverName);
    });

    it("returns null when driver not found in class results", () => {
        const { result } = renderHook(() => useLiveData(), {
            wrapper: createWrapper({
                classResults: mockClassResults,
            }),
        });

        const found =
            result.current.findDriverInClassResults("nonexistent|1|SS");
        expect(found).toBeNull();
    });

    it("finds driver in pax results", () => {
        const { result } = renderHook(() => useLiveData(), {
            wrapper: createWrapper({
                paxResults: mockPaxResults,
            }),
        });

        const paxEntry = mockPaxResults.results[0]!;
        const driverId = result.current.createDriverId({
            name: paxEntry.driverName,
            number: paxEntry.carNumber,
            carClass: paxEntry.class,
        });
        const found = result.current.findDriverInPaxResults(driverId);

        expect(found).not.toBeNull();
        expect(found?.driverName).toBe(paxEntry.driverName);
    });

    it("finds driver in raw results", () => {
        const { result } = renderHook(() => useLiveData(), {
            wrapper: createWrapper({
                rawResults: mockRawResults,
            }),
        });

        const rawEntry = mockRawResults.results[0]!;
        const driverId = result.current.createDriverId({
            name: rawEntry.driverName,
            number: rawEntry.carNumber,
            carClass: rawEntry.class,
        });
        const found = result.current.findDriverInRawResults(driverId);

        expect(found).not.toBeNull();
        expect(found?.driverName).toBe(rawEntry.driverName);
    });

    it("includes drivers from raw results in getAllDrivers", () => {
        const { result } = renderHook(() => useLiveData(), {
            wrapper: createWrapper({
                rawResults: mockRawResults,
            }),
        });

        const allDrivers = result.current.getAllDrivers();
        expect(allDrivers.length).toBeGreaterThan(0);

        // Check that raw result drivers are included
        const rawEntry = mockRawResults.results[0]!;
        const rawDriver = allDrivers.find(
            (d) => d.name === rawEntry.driverName
        );
        expect(rawDriver).toBeDefined();
        expect(rawDriver?.car).toBe(rawEntry.carModel);
        expect(rawDriver?.color).toBe(rawEntry.carColor);
    });

    it("sorts drivers by name then number in getAllDrivers", () => {
        const { result } = renderHook(() => useLiveData(), {
            wrapper: createWrapper({
                classResults: mockClassResults,
                paxResults: mockPaxResults,
                rawResults: mockRawResults,
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
