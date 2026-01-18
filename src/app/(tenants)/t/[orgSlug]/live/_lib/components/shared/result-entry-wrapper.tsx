"use client";

import { useState, useCallback } from "react";
import type { ResultsEntry } from "@/dto/live-results";
import { ResultCard } from "./result-card";
import { RunData } from "./run-data";
import { getLastRun } from "./time-utils";
import { RunTimeDisplay } from "./run-time-display";
import { PositionBadge } from "./position-badge";
import { DriverInfo } from "./driver-info";
import { TimeValue } from "./time-value";
import { GapDisplay } from "./gap-display";

type PositionConfig = {
    label: string;
    value: string | number;
    secondaryLabel?: string;
    secondaryValue?: string | number;
};

type TimeConfig = {
    label: string;
    value: number | string;
    secondaryLabel?: string;
};

type GapConfig = {
    gapToFirst: number | null | undefined;
    gapToNext?: number | null | undefined;
    maxGap?: number;
    allEntries?: Array<{ gapToFirst: number | null | undefined }>;
};

type ResultEntryWrapperProps = {
    entry: ResultsEntry;
    position: PositionConfig;
    time: TimeConfig;
    gap: GapConfig;
    isHighlighted?: boolean;
};

/**
 * Shared wrapper component for result entries that handles common structure
 * and run data toggle functionality
 */
export function ResultEntryWrapper({
    entry,
    position,
    time,
    gap,
    isHighlighted = false,
}: ResultEntryWrapperProps) {
    const [showRuns, setShowRuns] = useState(false);
    const lastRun = getLastRun(entry);

    const handleToggleRuns = useCallback(() => {
        setShowRuns((prev) => !prev);
    }, []);

    return (
        <ResultCard onClick={handleToggleRuns} isHighlighted={isHighlighted}>
            <PositionBadge
                label={position.label}
                value={position.value}
                secondaryLabel={position.secondaryLabel}
                secondaryValue={position.secondaryValue}
            />
            <DriverInfo
                carClass={entry.class}
                number={entry.carNumber}
                name={entry.driverName}
                car={entry.carModel}
                color={entry.carColor}
            />
            <TimeValue
                label={time.label}
                value={time.value}
                secondaryLabel={time.secondaryLabel || "Last"}
                secondaryValue={
                    lastRun ? <RunTimeDisplay run={lastRun} /> : "N/A"
                }
            />
            <GapDisplay
                gapToFirst={gap.gapToFirst ?? 0}
                gapToNext={gap.gapToNext ?? 0}
                maxGap={gap.maxGap}
                allEntries={gap.allEntries}
            />
            {showRuns && (
                <div className="col-span-12 mt-2 border-t pt-2">
                    <RunData entry={entry} />
                </div>
            )}
        </ResultCard>
    );
}
