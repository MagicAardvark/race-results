export type RunStatus = "clean" | "dirty" | "dnf" | "dsq";

export interface EntryDetails {
    entryKey: string;
    msrId: string;
    email: string;
    class: string;
    carNumber: string;
    driverName: string;
    carModel: string;
    carColor: string;
    sponsor: string;
}

export interface RunSummary {
    totalClean: number;
    totalCones: number;
    totalDNF: number;
}

export interface Position {
    position: number;
    toNext: number | null;
    toFirst: number | null;
}

export interface Run {
    status: RunStatus;
    time: number;
    penalty: number;
    indexedTotalTime: number | null;
    rawTotalTime: number | null;
    isBest: boolean;
}

export interface EventSegment {
    name: string;
    indexedTotalTime: number | null;
    rawTotalTime: number | null;
    totalClean: number;
    totalCones: number;
    totalDNF: number;
    runs: Record<number, Run>;
}

export interface ResultsEntry extends EntryDetails {
    classPosition: Position;
    indexedPosition: Position;
    rawPosition: Position;

    isTrophy: boolean;

    summary: RunSummary;

    indexedTotalTime: number | null;
    rawTotalTime: number | null;

    segments: EventSegment[];
}

export interface ClassResultsClass {
    isGroup: boolean;
    classId: string;
    shortName: string;
    longName: string;

    entries: ResultsEntry[];
}

export interface ProcessedLiveResults<T> {
    uploadTimestamp: Date;
    processedTimestamp: Date;
    results: T[];
}

export type ProcessedLiveClassResults = ProcessedLiveResults<ClassResultsClass>;

export type ProcessedLiveRawResults = ProcessedLiveResults<ResultsEntry>;

export type ProcessedLiveIndexResults = ProcessedLiveResults<ResultsEntry>;
