"use client";

import type { ResultsEntry } from "@/dto/live-results";
import { ResultEntryWrapper } from "../shared/result-entry-wrapper";

type PaxEntryProps = {
    entry: ResultsEntry;
    maxGap: number;
};

export const PaxEntry = ({ entry, maxGap }: PaxEntryProps) => {
    return (
        <ResultEntryWrapper
            entry={entry}
            position={{
                label: "PAX",
                value: entry.indexedPosition.position,
            }}
            time={{
                label: "PAX",
                value: entry.indexedTotalTime ?? 0,
            }}
            gap={{
                gapToFirst: entry.indexedPosition.toFirst ?? 0,
                gapToNext: entry.indexedPosition.toNext ?? 0,
                maxGap,
            }}
        />
    );
};
