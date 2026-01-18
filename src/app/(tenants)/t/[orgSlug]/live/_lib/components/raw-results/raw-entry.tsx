"use client";

import type { ResultsEntry } from "@/dto/live-results";
import { ResultEntryWrapper } from "../shared/result-entry-wrapper";
import { formatBestTime } from "../shared/time-utils";

type RawEntryProps = {
    entry: ResultsEntry;
    maxGap: number;
};

export const RawEntry = ({ entry, maxGap }: RawEntryProps) => {
    return (
        <ResultEntryWrapper
            entry={entry}
            position={{
                label: "Pos",
                value: entry.rawPosition.position,
            }}
            time={{
                label: "Raw",
                value: formatBestTime(entry),
            }}
            gap={{
                gapToFirst: entry.rawPosition.toFirst ?? 0,
                gapToNext: entry.rawPosition.toNext ?? 0,
                maxGap,
            }}
        />
    );
};
