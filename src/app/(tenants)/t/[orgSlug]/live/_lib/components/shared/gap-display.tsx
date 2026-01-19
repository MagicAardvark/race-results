import { cn } from "@/lib/utils";
import { Car } from "lucide-react";

type GapDisplayProps = {
    gapToFirst: number | null | undefined;
    gapToNext?: number | null | undefined;
    allEntries?: Array<{ gapToFirst: number | null | undefined }>;
    maxGap?: number;
    className?: string;
};

const BAR_HEIGHT = "32px";
const CAR_ICON_SIZE = 16;
const GAP_OVERLAP_THRESHOLD = 0.001;
const PERCENTILE_THRESHOLD = 0.7;
const DEFAULT_MAX_GAP = 3.0;
const POSITION_SCALE = 65;
const POSITION_PADDING = 8;
const MAX_POSITION = 70;

const CAR_ICON_STYLE = {
    transform: "scaleX(-1)",
    fillOpacity: 0.3,
} as const;

/**
 * Calculates the 70th percentile of gaps for scaling the visualization
 */
function calculatePercentile70(gaps: number[]): number {
    if (gaps.length === 0) return DEFAULT_MAX_GAP;

    const sorted = [...gaps].sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * PERCENTILE_THRESHOLD) - 1;

    return sorted[Math.max(0, index)] || DEFAULT_MAX_GAP;
}

/**
 * Calculates the horizontal position percentage for a car icon
 * @param gap - The gap to first place in seconds
 * @param maxGap - The maximum gap used for scaling
 * @returns Position percentage from left (0-70%)
 */
function getGapPosition(gap: number, maxGap: number): number {
    const normalized = Math.min(gap / maxGap, 1);
    return Math.min(
        normalized * POSITION_SCALE + POSITION_PADDING,
        MAX_POSITION
    );
}

export function GapDisplay({
    gapToFirst,
    gapToNext,
    allEntries = [],
    maxGap: providedMaxGap,
    className = "col-span-12",
}: GapDisplayProps) {
    // Gap is positive when behind (slower), 0 when tied/leading, null when in first
    const gap = gapToFirst ?? 0;
    const isLeader = gap === 0 || gapToFirst === null;

    const maxGap =
        providedMaxGap ??
        calculatePercentile70(
            allEntries
                .map((e) => e.gapToFirst)
                .filter((g): g is number => g != null && g !== 0)
        );

    const userCarPosition = isLeader ? 0 : getGapPosition(gap, maxGap);

    const otherCars = allEntries
        .map((entry, index) => ({
            gapToFirst: entry.gapToFirst,
            id: `${index}-${entry.gapToFirst}`,
        }))
        .filter(
            (entry) =>
                entry.gapToFirst != null &&
                entry.gapToFirst !== 0 &&
                Math.abs(entry.gapToFirst - gap) > GAP_OVERLAP_THRESHOLD
        );

    return (
        <div
            className={cn(className, "relative")}
            style={{ height: BAR_HEIGHT }}
        >
            {/* Horizontal bar track */}
            <div className="absolute inset-0 flex items-center pr-20">
                <div className="bg-muted h-1 w-full rounded-full" />
            </div>

            {!isLeader && (
                <div className="absolute top-1/2 left-0 z-10 flex -translate-y-1/2 items-center justify-center">
                    <Car
                        size={CAR_ICON_SIZE}
                        className="fill-current text-gray-300"
                        style={CAR_ICON_STYLE}
                    />
                </div>
            )}

            {otherCars.map((car) => {
                const carGap = car.gapToFirst ?? 0;
                const carPosition = getGapPosition(carGap, maxGap);
                return (
                    <div
                        key={car.id}
                        className="absolute top-1/2 flex -translate-y-1/2 items-center justify-center transition-all"
                        style={{ left: `${carPosition}%` }}
                    >
                        <Car
                            size={CAR_ICON_SIZE}
                            className="fill-current text-gray-300"
                            style={CAR_ICON_STYLE}
                        />
                    </div>
                );
            })}

            <div
                className="absolute top-1/2 z-10 flex -translate-y-1/2 items-center justify-center transition-all"
                style={{ left: `${userCarPosition}%` }}
            >
                <Car
                    size={CAR_ICON_SIZE}
                    className="fill-current text-purple-700 transition-colors"
                    style={CAR_ICON_STYLE}
                />
            </div>

            {!isLeader && (
                <div className="text-muted-foreground absolute top-1/2 right-0 ml-2 flex -translate-y-1/2 flex-col items-end text-[10px]">
                    <div>First: {gap.toFixed(3)}s</div>
                    {gapToNext != null && gapToNext !== 0 && (
                        <div>Next: {gapToNext.toFixed(3)}s</div>
                    )}
                </div>
            )}
        </div>
    );
}
