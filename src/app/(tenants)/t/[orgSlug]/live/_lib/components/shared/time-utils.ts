import type { Run, ResultsEntry } from "@/dto/live-results";

/**
 * Formats a time value to 3 decimal places
 */
export function formatTime(time: number | null | undefined): string {
    if (time == null) return "N/A";
    return time.toFixed(3);
}

/**
 * Formats a run time display with status indicators
 * Only shows penalty when it's greater than 0
 */
export function formatRunTime(run: Run): string {
    if (run.status === "dirty") {
        // Only show penalty if it's greater than 0
        return run.penalty > 0
            ? `${run.time.toFixed(3)}+${run.penalty}`
            : run.time.toFixed(3);
    }

    if (run.status === "clean") {
        return run.time.toFixed(3);
    }

    return `${run.time.toFixed(3)} (${run.status.toUpperCase()})`;
}

/**
 * Finds the best run from an entry's segments
 */
export function getBestRun(entry: ResultsEntry): Run | null {
    for (const segment of entry.segments) {
        for (const run of Object.values(segment.runs)) {
            if (run.isBest) {
                return run;
            }
        }
    }
    return null;
}

/**
 * Formats the best time for display as {time}+{penalty count}
 * Only shows penalty when it's greater than 0
 */
export function formatBestTime(entry: ResultsEntry): string {
    const bestRun = getBestRun(entry);
    if (!bestRun) {
        return "N/A";
    }

    // Show time + penalty format only when penalty > 0 (e.g., "45.123+2")
    // Otherwise just show the time (e.g., "45.123")
    // Note: rawTotalTime already includes penalties (time + 2 seconds per penalty) for sorting
    return bestRun.penalty > 0
        ? `${bestRun.time.toFixed(3)}+${bestRun.penalty}`
        : bestRun.time.toFixed(3);
}

/**
 * Gets the last run from an entry's segments (highest run number)
 */
export function getLastRun(entry: ResultsEntry): Run | null {
    const allRuns: Array<{ runNumber: number; run: Run }> = [];

    entry.segments.forEach((segment) => {
        Object.entries(segment.runs).forEach(([runNumber, run]) => {
            allRuns.push({
                runNumber: Number.parseInt(runNumber, 10),
                run,
            });
        });
    });

    if (allRuns.length === 0) return null;

    // Sort by run number and get the last one
    allRuns.sort((a, b) => a.runNumber - b.runNumber);
    return allRuns[allRuns.length - 1].run;
}

/**
 * Formats a class position with "T" suffix if the driver is a trophy winner
 * @param position - The position number
 * @param isTrophy - Whether the driver is a trophy winner
 * @returns Formatted position string (e.g., "1T" or "5")
 */
export function formatClassPosition(
    position: number | null | undefined,
    isTrophy: boolean
): string {
    if (position == null) return "N/A";
    return isTrophy ? `${position}T` : String(position);
}
