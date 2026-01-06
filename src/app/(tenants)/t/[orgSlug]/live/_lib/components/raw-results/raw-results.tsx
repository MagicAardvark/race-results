"use client";

import { useMemo } from "react";
import { useLiveData } from "../../hooks/useLiveData";
import { calculateMaxGapFromTimes } from "../../utils/gap-calculator";
import { getRawResultKey } from "../../utils/key-generators";
import { RawEntry } from "./raw-entry";
import { EmptyState } from "../shared/empty-state";

export const RawResults = () => {
    const { rawResults } = useLiveData();

    const maxGap = useMemo(() => {
        if (!rawResults) return 3.0;
        const allTimes = rawResults
            .map((e) => e.total)
            .filter((t): t is number => t != null);
        return calculateMaxGapFromTimes(allTimes);
    }, [rawResults]);

    if (!rawResults) {
        return <EmptyState message="No results available" />;
    }

    return (
        <div className="space-y-2">
            {rawResults.map((entry) => (
                <RawEntry key={getRawResultKey(entry)} entry={entry} maxGap={maxGap} />
            ))}
        </div>
    );
};

