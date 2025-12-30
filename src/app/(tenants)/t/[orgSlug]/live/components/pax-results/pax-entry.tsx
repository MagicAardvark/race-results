import type { ClassResult } from "../../types";
import { ResultCard } from "../shared/result-card";
import { PositionBadge } from "../shared/position-badge";
import { DriverInfo } from "../shared/driver-info";
import { TimeValue } from "../shared/time-value";
import { GapDisplay } from "../shared/gap-display";

type PaxEntryProps = {
    entry: ClassResult;
    maxGap: number;
};

export const PaxEntry = ({ entry, maxGap }: PaxEntryProps) => {
    const best = entry.runInfo.runs.find((e) => e.isBest);

    return (
        <ResultCard>
            <PositionBadge
                label="PAX"
                value={entry.paxPosition}
            />
            <DriverInfo
                carClass={entry.carClass}
                number={entry.number}
                name={entry.name}
                car={entry.car}
                color={entry.color}
            />
            <TimeValue
                label="PAX"
                value={entry.runInfo.paxTime}
                secondaryLabel="Raw"
                secondaryValue={best?.time}
            />
            <GapDisplay
                gapToFirst={entry.runInfo.toFirstInPax}
                gapToNext={entry.runInfo.toNextInPax}
                maxGap={maxGap}
            />
        </ResultCard>
    );
};

