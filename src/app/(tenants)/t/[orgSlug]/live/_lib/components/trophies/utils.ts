import type { ResultsEntry } from "@/dto/live-results";
import type { TrophyClassData, SpecialAwards } from "./types";
import { formatBestTime } from "../shared/time-utils";

type ClassResultsMap = Map<
    string,
    {
        entries: ResultsEntry[];
        longName?: string;
    }
>;

type PaxResults = {
    results: ResultsEntry[];
} | null;

/**
 * Gets all clean run times from an entry
 */
function getCleanRunTimes(entry: ResultsEntry): number[] {
    const runTimes: number[] = [];
    entry.segments.forEach((segment) => {
        Object.values(segment.runs).forEach((run) => {
            if (run.status === "clean" && run.time > 0) {
                runTimes.push(run.time);
            }
        });
    });
    return runTimes;
}

/**
 * Creates a driver info object from an entry
 */
function createDriverInfo(entry: ResultsEntry): {
    name: string;
    number: string;
    car: string;
    class: string;
} {
    return {
        name: entry.driverName,
        number: entry.carNumber,
        car: entry.carModel,
        class: entry.class,
    };
}

/**
 * Checks if an entry is squeaky clean (no DNFs, no cones, no penalties, all runs clean)
 */
function isSqueakyClean(entry: ResultsEntry): boolean {
    const hasNoDNFs = entry.summary.totalDNF === 0;
    const hasNoCones = entry.summary.totalCones === 0;

    let allRunsClean = true;
    let hasNoPenalties = true;
    entry.segments.forEach((segment) => {
        Object.values(segment.runs).forEach((run) => {
            if (run.status !== "clean") {
                allRunsClean = false;
            }
            if (run.penalty > 0) {
                hasNoPenalties = false;
            }
        });
    });

    return hasNoDNFs && hasNoCones && hasNoPenalties && allRunsClean;
}

export function calculateTrophyData(
    classResultsMap: ClassResultsMap | null,
    classNames: string[],
    paxResults: PaxResults
): TrophyClassData[] {
    if (!classResultsMap) return [];

    const data: TrophyClassData[] = [];

    classNames.forEach((className) => {
        const classData = classResultsMap.get(className);
        if (!classData) return;

        // Filter to only trophy winners
        const trophyEntries = classData.entries.filter(
            (entry) => entry.isTrophy
        );

        if (trophyEntries.length === 0) return;

        // Get PAX times for Pro/Novice classes
        const isProOrNovice = className === "P" || className === "N";

        const entries = trophyEntries
            .sort((a, b) => a.classPosition.position - b.classPosition.position)
            .map((entry) => {
                const rawTime = formatBestTime(entry);

                // Get PAX time if in Pro or Novice
                let paxTime: string | null = null;
                if (isProOrNovice && paxResults?.results) {
                    const paxEntry = paxResults.results.find(
                        (p) =>
                            p.driverName === entry.driverName &&
                            p.carNumber === entry.carNumber &&
                            p.class === entry.class
                    );
                    if (paxEntry?.indexedTotalTime != null) {
                        paxTime = paxEntry.indexedTotalTime.toFixed(3);
                    }
                }

                return {
                    position: entry.classPosition.position,
                    name: entry.driverName,
                    number: entry.carNumber,
                    car: entry.carModel,
                    class: entry.class,
                    rawTime,
                    paxTime,
                };
            });

        data.push({
            className,
            classLongName: classData.longName || className,
            entries,
            totalDrivers: classData.entries.length,
            trophyCount: entries.length,
        });
    });

    return data;
}

export function calculateSpecialAwards(
    rawResults: { results: ResultsEntry[] } | null
): SpecialAwards | null {
    if (!rawResults?.results) return null;

    let coneKiller: SpecialAwards["coneKiller"] = null;
    let hailMary: SpecialAwards["hailMary"] = null;
    let consistencyKing: SpecialAwards["consistencyKing"] = null;
    let speedDemon: SpecialAwards["speedDemon"] = null;
    const squeakyClean: SpecialAwards["squeakyClean"] = [];

    rawResults.results.forEach((entry) => {
        // Check for Cone Killer
        const totalCones = entry.summary.totalCones;
        if (!coneKiller || totalCones > coneKiller.totalCones) {
            coneKiller = {
                ...createDriverInfo(entry),
                totalCones,
            };
        }

        // Check for Hail Mary - find biggest outlier
        const allRunTimes = getCleanRunTimes(entry);

        if (allRunTimes.length >= 2) {
            const sortedTimes = [...allRunTimes].sort((a, b) => a - b);
            const fastest = sortedTimes[0];
            const secondFastest = sortedTimes[1];
            const outlierGap = secondFastest - fastest;

            if (!hailMary || outlierGap > hailMary.outlierGap) {
                hailMary = {
                    ...createDriverInfo(entry),
                    fastestRun: fastest,
                    outlierGap,
                };
            }
        }

        // Check for Consistency King/Queen - smallest variance between clean runs
        const consistencyRunTimes = getCleanRunTimes(entry);

        if (consistencyRunTimes.length >= 2) {
            const mean =
                consistencyRunTimes.reduce((a, b) => a + b, 0) /
                consistencyRunTimes.length;
            const variance =
                consistencyRunTimes.reduce(
                    (sum, time) => sum + Math.pow(time - mean, 2),
                    0
                ) / consistencyRunTimes.length;
            const stdDev = Math.sqrt(variance);

            if (!consistencyKing || stdDev < consistencyKing.variance) {
                consistencyKing = {
                    ...createDriverInfo(entry),
                    variance: stdDev,
                    avgTime: mean,
                };
            }
        }

        // Check for Speed Demon - fastest single run time overall
        const speedRunTimes = getCleanRunTimes(entry);
        if (speedRunTimes.length > 0) {
            const fastestTime = Math.min(...speedRunTimes);
            if (!speedDemon || fastestTime < speedDemon.fastestTime) {
                speedDemon = {
                    ...createDriverInfo(entry),
                    fastestTime,
                };
            }
        }

        // Check for Squeaky Clean - all runs completed, no DNFs, no penalties/cones
        if (isSqueakyClean(entry)) {
            squeakyClean.push(createDriverInfo(entry));
        }
    });

    return { coneKiller, hailMary, consistencyKing, speedDemon, squeakyClean };
}
