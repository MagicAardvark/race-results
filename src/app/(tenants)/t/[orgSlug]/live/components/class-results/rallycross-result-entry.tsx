"use client";

import { useState } from "react";
import type { ClassResult } from "../../types";
import { ResultCard } from "../shared/result-card";
import { PositionBadge } from "../shared/position-badge";
import { DriverInfo } from "../shared/driver-info";
import { TimeValue } from "../shared/time-value";
import { GapDisplay } from "../shared/gap-display";
import { RunData } from "./run-data";
import { RunTimeDisplay } from "./run-time-display";

type RallycrossResultEntryProps = {
    entry: ClassResult;
    allEntries: ClassResult[];
};

export const RallycrossResultEntry = ({
    entry,
    allEntries,
}: RallycrossResultEntryProps) => {
    const [showRuns, setShowRuns] = useState(false);
    const isPaxLeader = entry.paxPosition === 1;
    const lastRun =
        entry.runInfo.runs.length > 0
            ? entry.runInfo.runs[entry.runInfo.runs.length - 1]
            : null;

    return (
        <ResultCard
            onClick={() => setShowRuns(!showRuns)}
            isHighlighted={isPaxLeader}
        >
            <PositionBadge label="Class" value={entry.position} />
            <DriverInfo
                carClass={entry.carClass}
                number={entry.number}
                name={entry.name}
                car={entry.car}
                color={entry.color}
            />
            <TimeValue
                label="Total"
                value={entry.runInfo.rallyCrossTime}
                secondaryLabel="Last"
                secondaryValue={
                    lastRun ? <RunTimeDisplay run={lastRun} /> : "N/A"
                }
            />
            <GapDisplay
                gapToFirst={entry.runInfo.rallyCrossToFirst}
                gapToNext={entry.runInfo.rallyCrossToNext}
                allEntries={allEntries.map((e) => ({ gapToFirst: e.runInfo.rallyCrossToFirst }))}
            />
            {showRuns && (
                <div className="col-span-12 mt-2 border-t pt-2">
                    <RunData runInfo={entry.runInfo} />
                </div>
            )}
        </ResultCard>
    );
};

