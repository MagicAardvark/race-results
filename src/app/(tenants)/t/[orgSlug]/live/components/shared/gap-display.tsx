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

/**
 * Calculates the 70th percentile of gaps for scaling the visualization
 */
function calculatePercentile70(gaps: number[]): number {
    if (gaps.length === 0) return 3.0;
    
    const sorted = [...gaps].sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * 0.7) - 1;
    
    return sorted[Math.max(0, index)] || 3.0;
}

/**
 * Calculates the horizontal position percentage for a car icon
 * @param gap - The gap to first place in seconds
 * @param maxGap - The maximum gap used for scaling
 * @returns Position percentage from left (0-70%)
 */
function getGapPosition(gap: number, maxGap: number): number {
    const normalized = Math.min(gap / maxGap, 1);
    // Scale to 65% of width, add 8% padding, cap at 70% to leave room for labels
    return Math.min(normalized * 65 + 8, 70);
}

export function GapDisplay({
    gapToFirst,
    gapToNext,
    allEntries = [],
    maxGap: providedMaxGap,
    className = "col-span-12",
}: GapDisplayProps) {
    const gap = gapToFirst ?? 0;
    const isLeader = gap === 0;

    // Calculate max gap: use provided maxGap, or calculate from 70th percentile of all entries
    const maxGap = providedMaxGap ?? (() => {
        const allGaps = allEntries
            .map((e) => e.gapToFirst)
            .filter((g): g is number => g != null && g > 0);
        return calculatePercentile70(allGaps);
    })();

    const userCarPosition = isLeader ? 0 : getGapPosition(gap, maxGap);

    // Filter other cars: exclude leader, current entry (same gap), and entries with no gap
    const otherCars = allEntries
        .map((entry, index) => ({
            gapToFirst: entry.gapToFirst,
            id: `${index}-${entry.gapToFirst}`,
        }))
        .filter(
            (entry) =>
                entry.gapToFirst != null &&
                entry.gapToFirst > 0 &&
                Math.abs(entry.gapToFirst - gap) > GAP_OVERLAP_THRESHOLD
        );

    return (
        <div className={cn(className, "relative")} style={{ height: BAR_HEIGHT }}>
            {/* Horizontal bar track */}
            <div className="absolute inset-0 flex items-center pr-20">
                <div className="w-full h-1 bg-muted rounded-full" />
            </div>

            {!isLeader && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center z-10">
                    <Car
                        size={CAR_ICON_SIZE}
                        className="text-foreground"
                        style={{ transform: "scaleX(-1)" }}
                    />
                </div>
            )}

            {otherCars.map((car) => {
                const carPosition = getGapPosition(car.gapToFirst!, maxGap);
                return (
                    <div
                        key={car.id}
                        className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center transition-all"
                        style={{ left: `${carPosition}%` }}
                    >
                        <Car
                            size={CAR_ICON_SIZE}
                            className="text-gray-300 fill-current"
                            style={{ transform: "scaleX(-1)", fillOpacity: 0.3 }}
                        />
                    </div>
                );
            })}

            <div
                className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center transition-all z-10"
                style={{ left: `${userCarPosition}%` }}
            >
                <Car
                    size={CAR_ICON_SIZE}
                    className="text-purple-700 fill-current transition-colors"
                    style={{ transform: "scaleX(-1)", fillOpacity: 0.3 }}
                />
            </div>

            {!isLeader && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground flex flex-col items-end ml-2">
                    <div>First: +{gap.toFixed(3)}s</div>
                    {gapToNext != null && gapToNext > 0 && (
                        <div>Next: +{gapToNext.toFixed(3)}s</div>
                    )}
                </div>
            )}
        </div>
    );
}
