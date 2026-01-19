import type { Run } from "@/dto/live-results";
import { cn } from "@/lib/utils";
import { formatRunTime } from "./time-utils";

type RunTimeDisplayProps = {
    run: Run;
};

export const RunTimeDisplay = ({ run }: RunTimeDisplayProps) => {
    return (
        <span
            className={cn(
                run.isBest && "font-bold text-green-600 dark:text-green-400"
            )}
        >
            {formatRunTime(run)}
        </span>
    );
};
