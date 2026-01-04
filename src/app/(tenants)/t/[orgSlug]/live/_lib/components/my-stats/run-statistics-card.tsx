import type { ClassResult, RawResult } from "../../types";

type RunStatisticsCardProps = {
    classResult: ClassResult | null;
    rawResult: RawResult | null;
};

export function RunStatisticsCard({ classResult, rawResult }: RunStatisticsCardProps) {
    const totalRuns = classResult?.runInfo.runs.length ?? 0;
    const cleanRuns = classResult?.runInfo.cleanCount ?? "N/A";
    const coneCount = classResult?.runInfo.coneCount ?? rawResult?.coneCount ?? 0;
    const dnfCount = classResult?.runInfo.dnfCount ?? "N/A";

    return (
        <div className="rounded-lg border p-3 sm:p-4">
            <h3 className="mb-3 text-xs sm:text-sm font-medium text-muted-foreground">
                Run Statistics
            </h3>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <p className="text-xs text-muted-foreground">Total Runs</p>
                    <p className="mt-1 text-xl sm:text-2xl font-bold">{totalRuns}</p>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground">Clean Runs</p>
                    <p className="mt-1 text-xl sm:text-2xl font-bold">{cleanRuns}</p>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground">Cone Count</p>
                    <p className="mt-1 text-xl sm:text-2xl font-bold">{coneCount}</p>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground">DNF Count</p>
                    <p className="mt-1 text-xl sm:text-2xl font-bold">{dnfCount}</p>
                </div>
            </div>
        </div>
    );
}

