import type { ClassResult } from "../types";
import { DisplayMode } from "../types";
import { LIVE_TIMING_CONFIG } from "../config/config";

/**
 * Calculates rallycross times and positions for a class
 */
export function calculateRallycrossTimes(
    entries: ClassResult[],
    expectedRuns: number = LIVE_TIMING_CONFIG.defaults.expectedRuns
): ClassResult[] {
    const processedEntries = entries.map((entry) => {
        const runInfo = { ...entry.runInfo };
        const runs = [...runInfo.runs];

        // Pad missing runs
        if (runs.length < expectedRuns) {
            for (let i = runs.length; i < expectedRuns; i++) {
                runs.push({
                    number: i + 1,
                    status: "CLEAN",
                    time: 100,
                    coneCount: 0,
                    isBest: false,
                });
            }
        }

        // Calculate rallycross time
        const rallyCrossTime = runs.reduce(
            (total, r) =>
                total +
                (r.status === "DNF" ? r.time + 10 : r.time + r.coneCount * 2),
            0
        );

        return {
            ...entry,
            runInfo: {
                ...runInfo,
                runs,
                rallyCrossTime,
            },
        };
    });

    // Sort by rallycross time
    processedEntries.sort(
        (a, b) => a.runInfo.rallyCrossTime - b.runInfo.rallyCrossTime
    );

    // Calculate positions and gaps
    return processedEntries.map((entry, index) => {
        const position = (index + 1).toString();
        const rallyCrossToFirst =
            index > 0
                ? entry.runInfo.rallyCrossTime -
                  processedEntries[0].runInfo.rallyCrossTime
                : 0;
        const rallyCrossToNext =
            index > 0
                ? entry.runInfo.rallyCrossTime -
                  processedEntries[index - 1].runInfo.rallyCrossTime
                : 0;

        return {
            ...entry,
            position,
            runInfo: {
                ...entry.runInfo,
                rallyCrossToFirst,
                rallyCrossToNext,
            },
        };
    });
}

/**
 * Processes class results based on display mode
 */
export function processClassResults(
    results: Record<string, ClassResult[]>,
    displayMode: DisplayMode
): Record<string, ClassResult[]> {
    if (displayMode !== DisplayMode.rallycross) {
        return results;
    }

    const processed: Record<string, ClassResult[]> = {};

    for (const [className, entries] of Object.entries(results)) {
        processed[className] = calculateRallycrossTimes(entries);
    }

    return processed;
}

