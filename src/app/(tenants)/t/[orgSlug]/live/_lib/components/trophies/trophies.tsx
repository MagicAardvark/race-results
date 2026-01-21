"use client";

import { useMemo, useState } from "react";
import { useLiveData } from "../../hooks/useLiveData";
import { EmptyState } from "../shared/empty-state";
import { ViewToggle } from "./view-toggle";
import { ClassTrophyAccordion } from "./class-trophy-accordion";
import { SpecialAwardsView } from "./special-awards-view";
import { calculateTrophyData, calculateSpecialAwards } from "./utils";
import type { ViewMode } from "./types";

export function Trophies() {
    const { classResultsMap, classNames, paxResults, rawResults } =
        useLiveData();
    const [viewMode, setViewMode] = useState<ViewMode>("trophies");

    const trophyData = useMemo(
        () => calculateTrophyData(classResultsMap, classNames, paxResults),
        [classResultsMap, classNames, paxResults]
    );

    const specialAwards = useMemo(
        () => calculateSpecialAwards(rawResults),
        [rawResults]
    );

    if (trophyData.length === 0 && !specialAwards) {
        return <EmptyState message="No trophy winners found" />;
    }

    return (
        <div className="space-y-4">
            <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />

            {viewMode === "trophies" && (
                <ClassTrophyAccordion trophyData={trophyData} />
            )}

            {viewMode === "awards" && specialAwards && (
                <SpecialAwardsView specialAwards={specialAwards} />
            )}
        </div>
    );
}
