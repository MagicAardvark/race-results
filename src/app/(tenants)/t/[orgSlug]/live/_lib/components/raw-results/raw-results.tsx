"use client";

import { useCallback } from "react";
import type { ResultsEntry } from "@/dto/live-results";
import { useLiveData } from "../../hooks/useLiveData";
import { useMaxGap } from "../../hooks/useMaxGap";
import { RawEntry } from "./raw-entry";
import { EmptyState } from "../shared/empty-state";
import { TrophiesCallout } from "../shared/trophies-callout";

export const RawResults = () => {
    const { rawResults } = useLiveData();
    const timeExtractor = useCallback(
        (entry: ResultsEntry) => entry.rawTotalTime,
        []
    );
    const maxGap = useMaxGap(rawResults?.results, timeExtractor);

    if (!rawResults?.results) {
        return <EmptyState message="No results available" />;
    }

    return (
        <div className="space-y-4">
            <TrophiesCallout />
            <div className="space-y-2">
                {rawResults.results.map((entry) => (
                    <RawEntry
                        key={entry.entryKey}
                        entry={entry}
                        maxGap={maxGap}
                    />
                ))}
            </div>
        </div>
    );
};
