import { useMemo } from "react";
import type { ResultsEntry } from "@/dto/live-results";
import { calculateMaxGapFromTimes } from "../utils/gap-calculator";

/**
 * Calculates the maximum gap for gap visualization scaling
 *
 * @param entries - Array of result entries
 * @param timeExtractor - Function to extract time from an entry (should be stable reference)
 * @param defaultValue - Default max gap value if no entries
 */
export function useMaxGap(
    entries: ResultsEntry[] | undefined,
    timeExtractor: (entry: ResultsEntry) => number | null | undefined,
    defaultValue = 3.0
): number {
    return useMemo(() => {
        if (!entries) return defaultValue;
        const allTimes = entries
            .map(timeExtractor)
            .filter((t): t is number => t != null);
        return calculateMaxGapFromTimes(allTimes);
        // Note: timeExtractor is intentionally not in deps - it should be a stable reference
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entries, defaultValue]);
}
