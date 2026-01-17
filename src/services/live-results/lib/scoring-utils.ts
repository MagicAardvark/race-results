import { ScoringModes, TrohpyConfiguration } from "@/dto/events";
import { EventSegment, Run, RunStatus } from "@/dto/live-results";
import { RawRunData, RawRunStatus } from "@/dto/live-results/ingest";
import { InterimProcessedEntry } from "@/services/live-results/lib/types";

export function scoreRun(
    runData: RawRunData,
    conePenaltyInSeconds: number,
    indexValue: number | undefined
) {
    const [time, penalty, status] = runData;

    const runStatus = consolidateRunStatusFromAxware(status);

    let totalTime: number | null = null;

    switch (runStatus) {
        case "dnf":
        case "dsq":
            totalTime = null;
            break;
        case "dirty":
            totalTime = time + penalty * conePenaltyInSeconds;
            break;
        default:
            totalTime = time;
    }

    return {
        status: runStatus,
        time,
        rawTotalTime: totalTime,
        indexedTotalTime:
            totalTime === null
                ? null
                : totalTime * (indexValue !== undefined ? indexValue : 1),
        penalty,
    };
}
export function getSegmentTotalTimes(
    scoringMode: ScoringModes,
    runsInSegment: Record<number, Run>
): {
    indexedTotalTime: number | null;
    rawTotalTime: number | null;
} {
    switch (scoringMode) {
        case "singlebest":
            const best = Object.values(runsInSegment).find((run) => run.isBest);

            if (typeof best === "undefined") {
                return { indexedTotalTime: null, rawTotalTime: null };
            }

            return {
                indexedTotalTime: best.indexedTotalTime,
                rawTotalTime: best.rawTotalTime,
            };
        default:
            return { indexedTotalTime: null, rawTotalTime: null };
    }
}

export function getOverallTotalTimes(
    scoringMode: ScoringModes,
    segments: EventSegment[]
): {
    indexedTotalTime: number | null;
    rawTotalTime: number | null;
} {
    switch (scoringMode) {
        case "singlebest":
            const indexedTimes: number[] = [];
            const rawTimes: number[] = [];

            for (const segment of segments) {
                if (segment.indexedTotalTime !== null) {
                    indexedTimes.push(segment.indexedTotalTime);
                }
                if (segment.rawTotalTime !== null) {
                    rawTimes.push(segment.rawTotalTime);
                }
            }

            if (indexedTimes.length === 0 || rawTimes.length === 0) {
                return { indexedTotalTime: null, rawTotalTime: null };
            }

            return {
                indexedTotalTime: Math.min(...indexedTimes),
                rawTotalTime: Math.min(...rawTimes),
            };
        default:
            return { indexedTotalTime: null, rawTotalTime: null };
    }
}

export function consolidateRunStatusFromAxware(
    status: RawRunStatus
): RunStatus {
    if (status === "dsq" || status === "out" || status === "off") {
        return "dnf";
    }

    return status;
}

export function determineTrophyStatus(
    trophyConfig: TrohpyConfiguration,
    classPosition: number,
    totalEntries: number
): boolean {
    switch (trophyConfig.mode) {
        case "topn":
            return classPosition <= trophyConfig.value;
        case "percentage":
            const trophyCount = Math.ceil(
                (trophyConfig.value / 100) * totalEntries
            );
            return classPosition <= trophyCount;
        default:
            return false;
    }
}

export function getPositionData(
    position: number,
    entryIndex: number,
    entries: InterimProcessedEntry[],
    key: "indexedTotalTime" | "rawTotalTime"
) {
    if (entryIndex === 0) {
        return {
            position: position,
            toNext: null,
            toFirst: null,
        };
    }

    return {
        position: position,
        toNext: calculateGap(entries[entryIndex], entries[entryIndex - 1], key),
        toFirst: calculateGap(entries[entryIndex], entries[0], key),
    };
}

export function calculateGap(
    current: InterimProcessedEntry,
    other: InterimProcessedEntry,
    key: "indexedTotalTime" | "rawTotalTime"
) {
    if (other === null || other[key] === null || current[key] === null) {
        return null;
    }

    return other[key] - current[key];
}

export function sortEntriesByTime(
    entries: InterimProcessedEntry[],
    key: "indexedTotalTime" | "rawTotalTime"
) {
    const sorted = [
        ...entries.sort((a, b) => (a[key] ?? Infinity) - (b[key] ?? Infinity)),
    ];
    const lookup = new Map<string, number>();
    sorted.forEach((entry, idx) => {
        lookup.set(entry.entryKey, idx);
    });

    return { sorted, lookup };
}
