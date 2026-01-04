export enum DisplayMode {
    autocross = "autocross",
    rallycross = "rallycross",
}

export type Run = {
    number: number;
    status: string;
    time: number;
    coneCount: number;
    isBest: boolean;
};

export type RunInfo = {
    total: number;
    paxTime: number;
    cleanCount: number;
    coneCount: number;
    dnfCount: number;
    toFirstInClass: number;
    toNextInClass: number;
    toFirstInPax: number;
    toNextInPax: number;
    runs: Run[];
    rallyCrossTime: number;
    rallyCrossToFirst: number;
    rallyCrossToNext: number;
};

export type ClassResult = {
    car: string;
    carClass: string;
    carClassGroup: string;
    color: string;
    name: string;
    number: string;
    position: string;
    paxPosition: number;
    runInfo: RunInfo;
};

export type ClassResultsJson = {
    results: Record<string, ClassResult[]>;
};

export type PaxResultsJson = {
    results: ClassResult[];
};

export type EntryInfo = {
    name: string;
    carClass: string;
    number: number;
    car: string;
    color: string;
};

export type ResultSummary = {
    position: number;
    entryInfo: EntryInfo;
    toFirst: number;
    toNext: number;
};

export interface RawResult extends ResultSummary {
    total: number;
    time: number;
    coneCount: number;
}

export type RawResultsJson = {
    results: RawResult[];
};

export type RunWorkAssignment = {
    run: number;
    work: number;
};

export type RunWork = {
    runWork: Record<string, RunWorkAssignment>;
    numberOfHeats: number;
    timestamp: Date;
};

