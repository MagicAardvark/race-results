type PositionTimeCardProps = {
    title: string;
    position: string | number | null | undefined;
    time: number | string | null | undefined;
    timeLabel?: string;
    gapToFirst?: number | null;
    gapLabel?: string;
};

export function PositionTimeCard({
    title,
    position,
    time,
    timeLabel = "Time",
    gapToFirst,
    gapLabel,
}: PositionTimeCardProps) {
    const displayTime =
        time === null || time === undefined
            ? "N/A"
            : typeof time === "string"
              ? time
              : time.toFixed(3);

    return (
        <div className="rounded-lg border p-3 sm:p-4">
            <h3 className="text-muted-foreground text-xs font-medium sm:text-sm">
                {title}
            </h3>
            <div className="mt-2 space-y-1">
                <div>
                    <p className="text-muted-foreground text-xs">Position</p>
                    <p className="text-2xl font-bold sm:text-3xl">
                        {position || "N/A"}
                    </p>
                </div>
                {time !== null && time !== undefined && (
                    <div>
                        <p className="text-muted-foreground text-xs">
                            {timeLabel}
                        </p>
                        <p className="font-mono text-xl font-bold sm:text-2xl">
                            {displayTime}
                        </p>
                    </div>
                )}
                {gapToFirst !== null && gapToFirst !== undefined && (
                    <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
                        {gapToFirst === 0
                            ? gapLabel || ""
                            : `${gapToFirst.toFixed(3)}s from first`}
                    </p>
                )}
            </div>
        </div>
    );
}
