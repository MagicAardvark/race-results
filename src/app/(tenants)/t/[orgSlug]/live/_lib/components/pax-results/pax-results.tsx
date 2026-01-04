"use client";

import { useMemo } from "react";
import { useLiveData } from "../../hooks/useLiveData";
import { calculateMaxGapFromTimes } from "../../utils/gap-calculator";
import { getClassResultKey } from "../../utils/key-generators";
import { PaxEntry } from "./pax-entry";
import { EmptyState } from "../shared/empty-state";

export const PaxResults = () => {
    const { paxResults } = useLiveData();

    const maxGap = useMemo(() => {
        if (!paxResults) return 3.0;
        const allTimes = paxResults
            .map((e) => e.runInfo.paxTime)
            .filter((t): t is number => t != null);
        return calculateMaxGapFromTimes(allTimes);
    }, [paxResults]);

    if (!paxResults) {
        return <EmptyState message="No results available" />;
    }

    return (
        <div className="space-y-2">
            {paxResults.map((entry) => (
                <PaxEntry
                    key={getClassResultKey(entry)}
                    entry={entry}
                    maxGap={maxGap}
                />
            ))}
        </div>
    );
};

