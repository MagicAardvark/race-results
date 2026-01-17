import { ConfiguredCarClass } from "@/dto/classing";
import { EventConfiguration } from "@/dto/events";
import {
    ClassResultsClass,
    EventSegment,
    ResultsEntry,
    Run,
} from "@/dto/live-results";
import {
    LiveResultsSnapshot,
    RawRunData,
    RawRunSegment,
} from "@/dto/live-results/ingest";
import {
    determineTrophyStatus,
    getOverallTotalTimes,
    getPositionData,
    getSegmentTotalTimes,
    scoreRun,
    sortEntriesByTime,
} from "@/services/live-results/lib/scoring-utils";
import {
    ClassGrouping,
    InterimProcessedEntry,
} from "@/services/live-results/lib/types";

export class LiveResultsParser {
    private classData: Map<string, ConfiguredCarClass>;
    private eventConfig: EventConfiguration;
    private snapshot: LiveResultsSnapshot;

    constructor(
        classData: Map<string, ConfiguredCarClass>,
        eventConfig: EventConfiguration,
        snapshot: LiveResultsSnapshot
    ) {
        this.classData = classData;
        this.eventConfig = eventConfig;
        this.snapshot = snapshot;
    }

    async buildResults() {
        const processedRawData = this.processRawDataUpload();

        const classResults = await this.generateClassResults(processedRawData);
        const indexedResults = this.generateIndexedResults(classResults);
        const rawResults = this.generateRawResults(classResults);

        return {
            classResults: classResults,
            indexedResults: indexedResults,
            rawResults: rawResults,
        };
    }

    private processRawDataUpload(): InterimProcessedEntry[] {
        const results: InterimProcessedEntry[] = [];

        this.snapshot.forEach((entry) => {
            const normalizedClassKey = entry.class.toUpperCase();

            const processedRuns = this.processRuns(
                normalizedClassKey,
                entry.runs
            );

            const resultEntry = {
                entryKey: `${normalizedClassKey}-${entry.carNumber}-${entry.driverName}`,
                msrId: entry.msrId,
                email: entry.email,
                class: normalizedClassKey,
                carNumber: entry.carNumber,
                driverName: entry.driverName,
                carModel: entry.carModel,
                carColor: entry.carColor,
                sponsor: entry.sponsor,
                totalClean: processedRuns.totalClean,
                totalCones: processedRuns.totalCones,
                totalDNF: processedRuns.totalDNF,
                indexedTotalTime: processedRuns.indexedTotalTime,
                rawTotalTime: processedRuns.rawTotalTime,
                segments: processedRuns.segments,
            };

            results.push(resultEntry);
        });

        return results;
    }

    private processRuns(classKey: string, rawSegments: RawRunSegment[]) {
        let totalClean = 0;
        let totalCones = 0;
        let totalDNF = 0;

        const segments: EventSegment[] = [];

        const indexValue = this.classData.get(classKey)?.indexValue;

        rawSegments.forEach((rawRunData: RawRunData[], index: number) => {
            const runsInSegment = {} as Record<number, Run>;

            let segmentClean = 0;
            let segmentCones = 0;
            let segmentDNF = 0;

            let bestRunNumber: number | null = null;
            let bestRunTime: number | null = null;

            rawRunData.forEach((runData, index) => {
                const runNumber = index + 1;
                const run = scoreRun(
                    runData,
                    this.eventConfig.conePenaltyInSeconds,
                    indexValue
                );

                if (
                    run.rawTotalTime !== null &&
                    (bestRunTime === null || run.rawTotalTime < bestRunTime)
                ) {
                    bestRunNumber = runNumber;
                    bestRunTime = run.rawTotalTime;
                }

                segmentClean += run.status === "clean" ? 1 : 0;
                segmentCones += run.penalty;
                segmentDNF +=
                    run.status === "dnf" || run.status === "dsq" ? 1 : 0;

                totalClean += run.status === "clean" ? 1 : 0;
                totalCones += run.penalty;
                totalDNF +=
                    run.status === "dnf" || run.status === "dsq" ? 1 : 0;

                runsInSegment[runNumber] = {
                    ...run,
                    isBest: false,
                };
            });

            if (bestRunNumber !== null) {
                runsInSegment[bestRunNumber].isBest = true;
            }

            const segmentTimes = getSegmentTotalTimes(
                this.eventConfig.scoringMode,
                runsInSegment
            );

            segments.push({
                name: `Segment ${index + 1}`,
                indexedTotalTime: segmentTimes.indexedTotalTime,
                rawTotalTime: segmentTimes.rawTotalTime,
                totalClean: segmentClean,
                totalCones: segmentCones,
                totalDNF: segmentDNF,
                runs: runsInSegment,
            });
        });

        const { indexedTotalTime, rawTotalTime } = getOverallTotalTimes(
            this.eventConfig.scoringMode,
            segments
        );

        return {
            totalClean,
            totalCones,
            totalDNF,
            indexedTotalTime: indexedTotalTime,
            rawTotalTime: rawTotalTime,
            segments: segments,
        };
    }

    private async getFinalResultObject(
        entry: InterimProcessedEntry,
        classEntryIndex: number,
        classResultsSorted: InterimProcessedEntry[],
        overallSortedByIndex: InterimProcessedEntry[],
        overallSortedByRaw: InterimProcessedEntry[],
        indexLookup: Map<string, number>,
        rawLookup: Map<string, number>
    ) {
        const classPosition = classEntryIndex + 1;

        const indexedPositionIndex = indexLookup.get(entry.entryKey)!;
        const rawPositionIndex = rawLookup.get(entry.entryKey)!;

        return {
            entryKey: entry.entryKey,
            msrId: entry.msrId,
            email: entry.email,
            class: entry.class,
            carNumber: entry.carNumber,
            driverName: entry.driverName,
            carModel: entry.carModel,
            carColor: entry.carColor,
            sponsor: entry.sponsor,
            classPosition: getPositionData(
                classPosition,
                classEntryIndex,
                classResultsSorted,
                "indexedTotalTime"
            ),
            indexedPosition: getPositionData(
                indexedPositionIndex + 1,
                indexedPositionIndex,
                overallSortedByIndex,
                "indexedTotalTime"
            ),
            rawPosition: getPositionData(
                rawPositionIndex + 1,
                rawPositionIndex,
                overallSortedByRaw,
                "rawTotalTime"
            ),
            isTrophy: determineTrophyStatus(
                this.eventConfig.trophyConfiguration,
                classPosition,
                classResultsSorted.length
            ),
            summary: {
                totalClean: entry.totalClean,
                totalCones: entry.totalCones,
                totalDNF: entry.totalDNF,
            },
            indexedTotalTime: entry.indexedTotalTime,
            rawTotalTime: entry.rawTotalTime,
            segments: entry.segments,
        };
    }

    private async generateClassResults(
        interimResults: InterimProcessedEntry[]
    ) {
        const groupedByClass = this.groupByClass(interimResults);

        const classResults: ClassResultsClass[] = [];

        const { sorted: overallSortedByIndex, lookup: indexLookup } =
            sortEntriesByTime(interimResults, "indexedTotalTime");

        const { sorted: overallSortedByRaw, lookup: rawLookup } =
            sortEntriesByTime(interimResults, "rawTotalTime");

        for (const classKey in groupedByClass) {
            const { results } = groupedByClass[classKey];

            const finalResults: ResultsEntry[] = [];

            const classResultsSorted = results.sort(
                (a, b) =>
                    (a.indexedTotalTime ?? Infinity) -
                    (b.indexedTotalTime ?? Infinity)
            );

            for (const [
                classEntryIndex,
                entry,
            ] of classResultsSorted.entries()) {
                finalResults.push(
                    await this.getFinalResultObject(
                        entry,
                        classEntryIndex,
                        classResultsSorted,
                        overallSortedByIndex,
                        overallSortedByRaw,
                        indexLookup,
                        rawLookup
                    )
                );
            }

            classResults.push({
                ...groupedByClass[classKey].classInfo,
                entries: finalResults,
            });
        }

        return classResults;
    }

    private generateIndexedResults(classResults: ClassResultsClass[]) {
        const flatResults = classResults.flatMap((cls) => cls.entries);

        return flatResults.sort(
            (a, b) =>
                (a.indexedTotalTime ?? Infinity) -
                (b.indexedTotalTime ?? Infinity)
        );
    }

    private generateRawResults(classResults: ClassResultsClass[]) {
        const flatResults = classResults.flatMap((cls) => cls.entries);

        return flatResults.sort(
            (a, b) =>
                (a.rawTotalTime ?? Infinity) - (b.rawTotalTime ?? Infinity)
        );
    }

    private groupByClass(entries: InterimProcessedEntry[]) {
        return entries.reduce((acc, result) => {
            // Skip entries with no class data
            const classInfo = this.classData.get(result.class);

            if (classInfo === undefined) {
                return acc;
            }

            const classKey = classInfo.groupShortName ?? classInfo.shortName;
            const isGroup = classInfo.classGroupId !== null;

            if (!acc[classKey]) {
                acc[classKey] = {
                    classInfo: {
                        isGroup: isGroup,
                        classId: classInfo.classGroupId ?? classInfo.classId,
                        shortName: classKey,
                        longName: isGroup
                            ? classInfo.groupLongName!
                            : classInfo.longName,
                    },
                    results: [],
                };
            }

            acc[classKey].results.push(result);

            return acc;
        }, {} as ClassGrouping);
    }
}
