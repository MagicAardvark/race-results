import type { ClassResult, RawResult } from "../../types";

type RunStatisticsCardProps = {
    classResult: ClassResult | null;
    rawResult: RawResult | null;
};

export function RunStatisticsCard({
    classResult,
    rawResult,
}: RunStatisticsCardProps) {
    const totalRuns = classResult?.runInfo.runs.length ?? 0;
    const cleanRuns = classResult?.runInfo.cleanCount ?? "N/A";
    const coneCount =
        classResult?.runInfo.coneCount ?? rawResult?.coneCount ?? 0;
    const dnfCount = classResult?.runInfo.dnfCount ?? "N/A";

    return (
        <div className="rounded-lg border p-3 sm:p-4">
            <h3 className="text-muted-foreground mb-3 text-xs font-medium sm:text-sm">
                Run Statistics
            </h3>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <p className="text-muted-foreground text-xs">Total Runs</p>
                    <p className="mt-1 text-xl font-bold sm:text-2xl">
                        {totalRuns}
                    </p>
                </div>
                <div>
                    <p className="text-muted-foreground text-xs">Clean Runs</p>
                    <p className="mt-1 text-xl font-bold sm:text-2xl">
                        {cleanRuns}
                    </p>
                </div>
                <div>
                    <p className="text-muted-foreground text-xs">Cone Count</p>
                    <p className="mt-1 text-xl font-bold sm:text-2xl">
                        {coneCount}
                    </p>
                </div>
                <div>
                    <p className="text-muted-foreground text-xs">DNF Count</p>
                    <p className="mt-1 text-xl font-bold sm:text-2xl">
                        {dnfCount}
                    </p>
                </div>
            </div>
        </div>
    );
}
