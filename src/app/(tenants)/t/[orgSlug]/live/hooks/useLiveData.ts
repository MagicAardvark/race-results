"use client";

import { useMemo } from "react";
import { useLiveResults } from "../context/live-results-context";
import type { ClassResult, RawResult } from "../types";

export type DriverIdentifier = {
    id: string;
    name: string;
    number: string;
    carClass: string;
    car: string;
    color: string;
};

function createDriverId(driver: { name: string; number: string; carClass: string }): string {
    return `${driver.name}|${driver.number}|${driver.carClass}`;
}

function getAllDrivers(
    classResults: Record<string, ClassResult[]> | null,
    paxResults: ClassResult[] | null,
    rawResults: RawResult[] | null
): DriverIdentifier[] {
    const driverMap = new Map<string, DriverIdentifier>();

    // Collect from class results
    if (classResults) {
        Object.values(classResults).forEach((results) => {
            results.forEach((result) => {
                const id = createDriverId(result);
                if (!driverMap.has(id)) {
                    driverMap.set(id, {
                        id,
                        name: result.name,
                        number: String(result.number),
                        carClass: result.carClass,
                        car: result.car,
                        color: result.color,
                    });
                }
            });
        });
    }

    // Collect from PAX results (in case some drivers are only in PAX)
    if (paxResults) {
        paxResults.forEach((result) => {
            const id = createDriverId(result);
            if (!driverMap.has(id)) {
                driverMap.set(id, {
                    id,
                    name: result.name,
                    number: String(result.number),
                    carClass: result.carClass,
                    car: result.car,
                    color: result.color,
                });
            }
        });
    }

    // Collect from raw results (in case some drivers are only in raw)
    if (rawResults) {
        rawResults.forEach((result) => {
            const id = createDriverId({
                name: result.entryInfo.name,
                number: result.entryInfo.number.toString(),
                carClass: result.entryInfo.carClass,
            });
            if (!driverMap.has(id)) {
                driverMap.set(id, {
                    id,
                    name: result.entryInfo.name,
                    number: result.entryInfo.number.toString(),
                    carClass: result.entryInfo.carClass,
                    car: result.entryInfo.car,
                    color: result.entryInfo.color,
                });
            }
        });
    }

    return Array.from(driverMap.values()).sort((a, b) => {
        // Sort by name, then by number
        if (a.name !== b.name) {
            return a.name.localeCompare(b.name);
        }
        return String(a.number).localeCompare(String(b.number));
    });
}

function findDriverInClassResults(
    driverId: string,
    classResults: Record<string, ClassResult[]> | null
): ClassResult | null {
    if (!classResults) return null;

    for (const results of Object.values(classResults)) {
        const found = results.find((r) => createDriverId(r) === driverId);
        if (found) return found;
    }
    return null;
}

function findDriverInPaxResults(
    driverId: string,
    paxResults: ClassResult[] | null
): ClassResult | null {
    if (!paxResults) return null;
    return paxResults.find((r) => createDriverId(r) === driverId) || null;
}

function findDriverInRawResults(
    driverId: string,
    rawResults: RawResult[] | null
): RawResult | null {
    if (!rawResults) return null;
    return (
        rawResults.find(
            (r) =>
                createDriverId({
                    name: r.entryInfo.name,
                    number: r.entryInfo.number.toString(),
                    carClass: r.entryInfo.carClass,
                }) === driverId
        ) || null
    );
}

/**
 * Hook to access live results data and utility functions
 */
export function useLiveData() {
    const context = useLiveResults();

    const classNames = useMemo(
        () => (context.classResults ? Object.keys(context.classResults) : []),
        [context.classResults]
    );

    return useMemo(
        () => ({
            // Data
            classResults: context.classResults,
            paxResults: context.paxResults,
            rawResults: context.rawResults,
            runWork: context.runWork,
            displayMode: context.displayMode,
            featureFlags: context.featureFlags,
            classNames,
            // Utility functions
            getAllDrivers: () =>
                getAllDrivers(context.classResults, context.paxResults, context.rawResults),
            findDriverInClassResults: (driverId: string) =>
                findDriverInClassResults(driverId, context.classResults),
            findDriverInPaxResults: (driverId: string) =>
                findDriverInPaxResults(driverId, context.paxResults),
            findDriverInRawResults: (driverId: string) =>
                findDriverInRawResults(driverId, context.rawResults),
            createDriverId,
        }),
        [
            context.classResults,
            context.paxResults,
            context.rawResults,
            context.runWork,
            context.displayMode,
            context.featureFlags,
            classNames,
        ]
    );
}

