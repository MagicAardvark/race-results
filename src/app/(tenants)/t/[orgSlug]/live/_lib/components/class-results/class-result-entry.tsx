"use client";

import type { ResultsEntry } from "@/dto/live-results";
import { DisplayMode } from "../../types";
import { useLiveData } from "../../hooks/useLiveData";
import { ResultEntryWrapper } from "../shared/result-entry-wrapper";
import { formatBestTime, formatClassPosition } from "../shared/time-utils";

type ClassResultEntryProps = {
    entry: ResultsEntry;
    allEntries: ResultsEntry[];
};

export const ClassResultEntry = ({
    entry,
    allEntries,
}: ClassResultEntryProps) => {
    const { displayMode } = useLiveData();
    const isPaxLeader = entry.indexedPosition.position === 1;
    const isRallycross = displayMode === DisplayMode.rallycross;
    const bestTimeDisplay = formatBestTime(entry);

    // For rallycross, use rawTotalTime as placeholder
    // TODO: Implement proper rallycross time calculation if needed
    const rallyCrossTime = isRallycross ? (entry.rawTotalTime ?? 0) : 0;

    return (
        <ResultEntryWrapper
            entry={entry}
            position={{
                label: isRallycross ? "Class" : "Pos",
                value: formatClassPosition(
                    entry.classPosition.position,
                    entry.isTrophy
                ),
                secondaryLabel: isRallycross ? undefined : "PAX",
                secondaryValue: isRallycross
                    ? undefined
                    : entry.indexedPosition.position,
            }}
            time={{
                label: isRallycross ? "Total" : "Best",
                value: isRallycross ? rallyCrossTime : bestTimeDisplay,
            }}
            gap={{
                gapToFirst: entry.classPosition.toFirst ?? 0,
                gapToNext: entry.classPosition.toNext ?? 0,
                allEntries: allEntries.map((e) => ({
                    gapToFirst: e.classPosition.toFirst ?? 0,
                })),
            }}
            isHighlighted={isPaxLeader}
        />
    );
};
