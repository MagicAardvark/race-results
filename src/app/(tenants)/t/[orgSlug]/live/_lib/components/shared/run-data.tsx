import type { ResultsEntry } from "@/dto/live-results";
import { RunDisplay } from "./run-display";
import { StatsGrid } from "./stats-grid";

type RunDataProps = {
    entry: ResultsEntry;
};

export const RunData = ({ entry }: RunDataProps) => {
    const hasMultipleSegments = entry.segments.length > 1;

    return (
        <div className="space-y-4">
            {entry.segments.map((segment, segmentIndex) => {
                const runs = Object.entries(segment.runs)
                    .sort(
                        ([a], [b]) =>
                            Number.parseInt(a, 10) - Number.parseInt(b, 10)
                    )
                    .map(([runNumber, run]) => (
                        <RunDisplay
                            key={`${segmentIndex}-${runNumber}`}
                            runNumber={Number.parseInt(runNumber, 10)}
                            run={run}
                        />
                    ));

                return (
                    <div key={segmentIndex} className="space-y-2">
                        {hasMultipleSegments && (
                            <h4 className="text-sm font-semibold">
                                {segment.name}
                            </h4>
                        )}
                        <div className="flex flex-row flex-wrap gap-2">
                            {runs}
                        </div>
                    </div>
                );
            })}
            <div className="border-t pt-2">
                <StatsGrid
                    stats={[
                        { label: "Cones", value: entry.summary.totalCones },
                        {
                            label: "Clean Runs",
                            value: entry.summary.totalClean,
                        },
                        { label: "DNF", value: entry.summary.totalDNF },
                    ]}
                />
            </div>
        </div>
    );
};
