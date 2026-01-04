import type { Run } from "../../types";
import { Badge } from "@/ui/badge";
import { cn } from "@/lib/utils";
import { formatRunTime } from "../shared/time-utils";

type RunDisplayProps = {
    run: Run;
};

const getStatusVariant = (status: string) => {
    switch (status) {
        case "CLEAN":
            return "dark";
        case "DIRTY":
            return "secondary";
        case "DNF":
            return "destructive";
        default:
            return "outline";
    }
};

export const RunDisplay = ({ run }: RunDisplayProps) => {
    return (
        <Badge
            variant={getStatusVariant(run.status)}
            className={cn(
                "text-xs",
                run.isBest && "ring-2 ring-green-500"
            )}
        >
            Run {run.number}: {formatRunTime(run)}
        </Badge>
    );
};

