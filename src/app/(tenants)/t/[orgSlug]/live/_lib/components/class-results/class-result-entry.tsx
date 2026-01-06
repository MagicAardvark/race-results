"use client";

import { useState } from "react";
import type { ClassResult } from "../../types";
import { DisplayMode } from "../../types";
import { useLiveData } from "../../hooks/useLiveData";
import { ResultCard } from "../shared/result-card";
import { PositionBadge } from "../shared/position-badge";
import { DriverInfo } from "../shared/driver-info";
import { TimeValue } from "../shared/time-value";
import { GapDisplay } from "../shared/gap-display";
import { RunData } from "./run-data";
import { RunTimeDisplay } from "./run-time-display";

type ClassResultEntryProps = {
    entry: ClassResult;
    allEntries: ClassResult[];
};

export const ClassResultEntry = ({ entry, allEntries }: ClassResultEntryProps) => {
    const { displayMode } = useLiveData();
    const [showRuns, setShowRuns] = useState(false);
    const isPaxLeader = entry.paxPosition === 1;
    const lastRun =
        entry.runInfo.runs.length > 0
            ? entry.runInfo.runs[entry.runInfo.runs.length - 1]
            : null;

    const isRallycross = displayMode === DisplayMode.rallycross;

    return (
        <ResultCard
            onClick={() => setShowRuns(!showRuns)}
            isHighlighted={isPaxLeader}
        >
            <PositionBadge
                label={isRallycross ? "Class" : "Pos"}
                value={entry.position}
                secondaryLabel={isRallycross ? undefined : "PAX"}
                secondaryValue={isRallycross ? undefined : entry.paxPosition}
            />
            <DriverInfo
                carClass={entry.carClass}
                number={entry.number}
                name={entry.name}
                car={entry.car}
                color={entry.color}
            />
            <TimeValue
                label={isRallycross ? "Total" : "Best"}
                value={isRallycross ? entry.runInfo.rallyCrossTime : entry.runInfo.total}
                secondaryLabel="Last"
                secondaryValue={lastRun ? <RunTimeDisplay run={lastRun} /> : "N/A"}
            />
            <GapDisplay
                gapToFirst={
                    isRallycross
                        ? entry.runInfo.rallyCrossToFirst
                        : entry.runInfo.toFirstInClass
                }
                gapToNext={
                    isRallycross
                        ? entry.runInfo.rallyCrossToNext
                        : entry.runInfo.toNextInClass
                }
                allEntries={allEntries.map((e) => ({
                    gapToFirst: isRallycross
                        ? e.runInfo.rallyCrossToFirst
                        : e.runInfo.toFirstInClass,
                }))}
            />
            {showRuns && (
                <div className="col-span-12 mt-2 border-t pt-2">
                    <RunData runInfo={entry.runInfo} />
                </div>
            )}
        </ResultCard>
    );
};

