"use client";

import type { ClassResult, RawResult } from "../../types";
import { useLiveData } from "../../hooks/useLiveData";
import { PositionTimeCard } from "./position-time-card";

type ClassPositionTimeCardProps = {
    classResult: ClassResult | null;
    rawResult: RawResult | null;
};

export function ClassPositionTimeCard({
    classResult,
    rawResult,
}: ClassPositionTimeCardProps) {
    const { displayMode } = useLiveData();
    const bestTime =
        displayMode === "rallycross" && classResult?.runInfo.rallyCrossTime
            ? classResult.runInfo.rallyCrossTime
            : classResult?.runInfo.runs
                  .filter((r) => r.isBest)
                  .map((r) => r.time)
                  .reduce((a, b) => Math.min(a, b), Infinity) || rawResult?.time || null;

    const gapToFirst =
        displayMode === "autocross"
            ? classResult?.runInfo.toFirstInClass
            : classResult?.runInfo.rallyCrossToFirst;

    return (
        <PositionTimeCard
            title="Class"
            position={classResult?.position}
            time={bestTime}
            timeLabel={displayMode === "rallycross" ? "Rallycross Time" : "Best Time"}
            gapToFirst={gapToFirst}
        />
    );
}

