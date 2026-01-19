import type { ResultsEntry } from "@/dto/live-results";

type RunStatisticsCardProps = {
    classResult: ResultsEntry | null;
    rawResult: ResultsEntry | null;
};

export function RunStatisticsCard({
    classResult,
    rawResult,
}: RunStatisticsCardProps) {
    const entry = classResult || rawResult;

    // Count total runs across all segments
    const totalRuns = entry
        ? entry.segments.reduce(
              (sum, segment) => sum + Object.keys(segment.runs).length,
              0
          )
        : 0;
    const cleanRuns = entry?.summary.totalClean ?? "N/A";
    const coneCount = entry?.summary.totalCones ?? 0;
    const dnfCount = entry?.summary.totalDNF ?? "N/A";

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
