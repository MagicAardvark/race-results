import type { Run } from "@/dto/live-results";
import { Badge } from "@/ui/badge";
import { cn } from "@/lib/utils";
import { formatRunTime } from "./time-utils";

type RunDisplayProps = {
    runNumber: number;
    run: Run;
};

/**
 * Maps run status to badge variant
 */
function getStatusVariant(
    status: string
): "dark" | "secondary" | "destructive" | "outline" {
    const upperStatus = status.toUpperCase();
    if (upperStatus === "CLEAN") return "dark";
    if (upperStatus === "DIRTY") return "secondary";
    if (upperStatus === "DNF" || upperStatus === "DSQ") return "destructive";
    return "outline";
}

export const RunDisplay = ({ runNumber, run }: RunDisplayProps) => {
    return (
        <Badge
            variant={getStatusVariant(run.status)}
            className={cn("text-xs", run.isBest && "ring-2 ring-green-500")}
        >
            Run {runNumber}: {formatRunTime(run)}
        </Badge>
    );
};
