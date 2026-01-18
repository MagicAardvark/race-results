"use client";

import { useCallback } from "react";
import type { ResultsEntry } from "@/dto/live-results";
import { useLiveData } from "../../hooks/useLiveData";
import { useMaxGap } from "../../hooks/useMaxGap";
import { PaxEntry } from "./pax-entry";
import { EmptyState } from "../shared/empty-state";

export const PaxResults = () => {
    const { paxResults } = useLiveData();
    const timeExtractor = useCallback(
        (entry: ResultsEntry) => entry.indexedTotalTime,
        []
    );
    const maxGap = useMaxGap(paxResults?.results, timeExtractor);

    if (!paxResults?.results) {
        return <EmptyState message="No results available" />;
    }

    return (
        <div className="space-y-2">
            {paxResults.results.map((entry) => (
                <PaxEntry key={entry.entryKey} entry={entry} maxGap={maxGap} />
            ))}
        </div>
    );
};
