type PositionTimeCardProps = {
    title: string;
    position: string | number | null | undefined;
    time: number | null | undefined;
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
    return (
        <div className="rounded-lg border p-3 sm:p-4">
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</h3>
            <div className="mt-2 space-y-1">
                <div>
                    <p className="text-xs text-muted-foreground">Position</p>
                    <p className="text-2xl sm:text-3xl font-bold">{position || "N/A"}</p>
                </div>
                {time !== null && time !== undefined && (
                    <div>
                        <p className="text-xs text-muted-foreground">{timeLabel}</p>
                        <p className="text-xl sm:text-2xl font-bold">{time.toFixed(3)}</p>
                    </div>
                )}
                {gapToFirst !== null && gapToFirst !== undefined && (
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                        {gapToFirst > 0
                            ? `+${gapToFirst.toFixed(3)}s from first`
                            : gapLabel || "Leading"}
                    </p>
                )}
            </div>
        </div>
    );
}

