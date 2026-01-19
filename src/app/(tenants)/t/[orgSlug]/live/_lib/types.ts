// Re-export DTO types for convenience
export type {
    ResultsEntry,
    ClassResultsClass,
    ProcessedLiveClassResults,
    ProcessedLiveIndexResults,
    ProcessedLiveRawResults,
    Run,
    EventSegment,
    Position,
    RunSummary,
} from "@/dto/live-results";

export enum DisplayMode {
    autocross = "autocross",
    rallycross = "rallycross",
}

// Keep RunWork type as it's unchanged
export type RunWorkAssignment = {
    run: number;
    work: number;
};

export type RunWork = {
    runWork: Record<string, RunWorkAssignment>;
    numberOfHeats: number;
    timestamp: Date;
};
