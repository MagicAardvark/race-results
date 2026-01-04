import type { Run } from "../../types";

/**
 * Formats a time value to 3 decimal places
 */
export function formatTime(time: number | null | undefined): string {
    if (time == null) return "N/A";
    return time.toFixed(3);
}

/**
 * Formats a run time display with status indicators
 */
export function formatRunTime(run: Run): string {
    if (run.status === "DIRTY") {
        return `${run.time?.toFixed(3)}+${run.coneCount}`;
    }

    if (run.status === "CLEAN") {
        return run.time?.toFixed(3).toString() ?? "N/A";
    }

    return `${run.time?.toFixed(3)} (${run.status})`;
}

