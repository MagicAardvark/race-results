"use client";

import { useMemo } from "react";
import { useLiveResults } from "../context/live-results-context";
import type { ResultsEntry, ClassResultsClass } from "@/dto/live-results";

export type DriverIdentifier = {
    id: string;
    name: string;
    number: string;
    carClass: string;
    car: string;
    color: string;
};

function createDriverId(driver: {
    name: string;
    number: string;
    carClass: string;
}): string {
    return `${driver.name}|${driver.number}|${driver.carClass}`;
}

function getAllDrivers(
    classResults: { results: ClassResultsClass[] } | null,
    paxResults: { results: ResultsEntry[] } | null,
    rawResults: { results: ResultsEntry[] } | null
): DriverIdentifier[] {
    const driverMap = new Map<string, DriverIdentifier>();

    // Collect from class results
    if (classResults?.results) {
        classResults.results.forEach((classData) => {
            classData.entries.forEach((entry) => {
                const id = createDriverId({
                    name: entry.driverName,
                    number: entry.carNumber,
                    carClass: entry.class,
                });
                if (!driverMap.has(id)) {
                    driverMap.set(id, {
                        id,
                        name: entry.driverName,
                        number: entry.carNumber,
                        carClass: entry.class,
                        car: entry.carModel,
                        color: entry.carColor,
                    });
                }
            });
        });
    }

    // Collect from PAX results (indexed results)
    if (paxResults?.results) {
        paxResults.results.forEach((entry) => {
            const id = createDriverId({
                name: entry.driverName,
                number: entry.carNumber,
                carClass: entry.class,
            });
            if (!driverMap.has(id)) {
                driverMap.set(id, {
                    id,
                    name: entry.driverName,
                    number: entry.carNumber,
                    carClass: entry.class,
                    car: entry.carModel,
                    color: entry.carColor,
                });
            }
        });
    }

    // Collect from raw results
    if (rawResults?.results) {
        rawResults.results.forEach((entry) => {
            const id = createDriverId({
                name: entry.driverName,
                number: entry.carNumber,
                carClass: entry.class,
            });
            if (!driverMap.has(id)) {
                driverMap.set(id, {
                    id,
                    name: entry.driverName,
                    number: entry.carNumber,
                    carClass: entry.class,
                    car: entry.carModel,
                    color: entry.carColor,
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
    classResults: { results: ClassResultsClass[] } | null
): ResultsEntry | null {
    if (!classResults?.results) return null;

    for (const classData of classResults.results) {
        const found = classData.entries.find(
            (entry) =>
                createDriverId({
                    name: entry.driverName,
                    number: entry.carNumber,
                    carClass: entry.class,
                }) === driverId
        );
        if (found) return found;
    }
    return null;
}

function findDriverInPaxResults(
    driverId: string,
    paxResults: { results: ResultsEntry[] } | null
): ResultsEntry | null {
    if (!paxResults?.results) return null;
    return (
        paxResults.results.find(
            (entry) =>
                createDriverId({
                    name: entry.driverName,
                    number: entry.carNumber,
                    carClass: entry.class,
                }) === driverId
        ) || null
    );
}

function findDriverInRawResults(
    driverId: string,
    rawResults: { results: ResultsEntry[] } | null
): ResultsEntry | null {
    if (!rawResults?.results) return null;
    return (
        rawResults.results.find(
            (entry) =>
                createDriverId({
                    name: entry.driverName,
                    number: entry.carNumber,
                    carClass: entry.class,
                }) === driverId
        ) || null
    );
}

/**
 * Hook to access live results data and utility functions
 */
export function useLiveData() {
    const context = useLiveResults();

    const classNames = useMemo(() => {
        if (!context.classResults?.results) return [];

        // Get unique class names, grouping P* into "P" and N* into "N"
        const classNamesSet = new Set<string>();
        let hasPro = false;
        let hasNovice = false;

        context.classResults.results.forEach((c) => {
            if (c.shortName.startsWith("P")) {
                hasPro = true;
            } else if (c.shortName.startsWith("N")) {
                hasNovice = true;
            } else {
                classNamesSet.add(c.shortName);
            }
        });

        const names = Array.from(classNamesSet);
        if (hasPro) names.push("P");
        if (hasNovice) names.push("N");

        return names;
    }, [context.classResults]);

    // Helper to get class results as a map for easier access
    // Groups classes starting with "P" into "Pro" and classes starting with "N" into "Novice"
    const classResultsMap = useMemo(() => {
        if (!context.classResults?.results) return null;
        const map = new Map<string, ClassResultsClass>();

        // Track grouped classes
        const proEntries: ResultsEntry[] = [];
        const noviceEntries: ResultsEntry[] = [];
        let proClassId: string | null = null;
        let noviceClassId: string | null = null;

        context.classResults.results.forEach((classData) => {
            const shortName = classData.shortName;

            if (shortName.startsWith("P")) {
                // Group into Pro
                proEntries.push(...classData.entries);
                if (!proClassId) {
                    proClassId = classData.classId;
                }
            } else if (shortName.startsWith("N")) {
                // Group into Novice
                noviceEntries.push(...classData.entries);
                if (!noviceClassId) {
                    noviceClassId = classData.classId;
                }
            } else {
                // Add class as-is
                map.set(shortName, classData);
            }
        });

        // Add grouped Pro class if there are entries
        if (proEntries.length > 0 && proClassId) {
            map.set("P", {
                isGroup: true,
                classId: proClassId,
                shortName: "P",
                longName: "Pro",
                entries: proEntries,
            });
        }

        // Add grouped Novice class if there are entries
        if (noviceEntries.length > 0 && noviceClassId) {
            map.set("N", {
                isGroup: true,
                classId: noviceClassId,
                shortName: "N",
                longName: "Novice",
                entries: noviceEntries,
            });
        }

        return map;
    }, [context.classResults]);

    // Memoize getAllDrivers result since it's expensive and used frequently
    const allDriversMemo = useMemo(
        () =>
            getAllDrivers(
                context.classResults,
                context.paxResults,
                context.rawResults
            ),
        [context.classResults, context.paxResults, context.rawResults]
    );

    return useMemo(
        () => ({
            // Data
            classResults: context.classResults,
            classResultsMap,
            paxResults: context.paxResults,
            rawResults: context.rawResults,
            runWork: context.runWork,
            displayMode: context.displayMode,
            featureFlags: context.featureFlags,
            classNames,
            // Utility functions - memoized results
            getAllDrivers: () => allDriversMemo,
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
            classResultsMap,
            allDriversMemo,
        ]
    );
}
