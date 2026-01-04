import type { RunInfo } from "../../types";
import { RunDisplay } from "./run-display";
import { StatsGrid } from "../shared/stats-grid";

type RunDataProps = {
    runInfo: RunInfo;
};

export const RunData = ({ runInfo }: RunDataProps) => {
    const runs = runInfo.runs.map((run, i) => {
        return <RunDisplay key={i} run={run} />;
    });

    const stats = [
        { label: "Cones", value: runInfo.coneCount },
        { label: "Clean Runs", value: runInfo.cleanCount },
        { label: "DNF", value: runInfo.dnfCount },
    ];

    return (
        <div className="space-y-2">
            <div className="flex flex-row flex-wrap gap-2">{runs}</div>
            <StatsGrid stats={stats} />
        </div>
    );
};

