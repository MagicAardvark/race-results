"use client";

import { useLiveData } from "../../hooks/useLiveData";
import { RawEntry } from "./raw-entry";
import { EmptyState } from "../shared/empty-state";

/**
 * Calculates the 70th percentile time and returns the max gap
 */
function calculateMaxGapFromTimes(times: number[]): number {
    if (times.length === 0) return 3.0;
    
    const sorted = [...times].sort((a, b) => a - b);
    const percentile70Index = Math.ceil(sorted.length * 0.7) - 1;
    const percentile70Time = sorted[Math.max(0, percentile70Index)] || 0;
    const fastestTime = sorted[0] || 0;
    
    return Math.max(percentile70Time - fastestTime, 0.1);
}

export const RawResults = () => {
    const { rawResults } = useLiveData();

    if (!rawResults) {
        return <EmptyState message="No results available" />;
    }

    const allTimes = rawResults
        .map((e) => e.total)
        .filter((t): t is number => t != null);
    const maxGap = calculateMaxGapFromTimes(allTimes);

    const entries = rawResults.map((entry) => {
        const uniqueKey = `${entry.position}-${entry.entryInfo.number}-${entry.entryInfo.name}`;
        
        return (
            <RawEntry
                key={uniqueKey}
                entry={entry}
                maxGap={maxGap}
            />
        );
    });

    return <div className="space-y-2">{entries}</div>;
};

