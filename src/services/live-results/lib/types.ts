import { EntryDetails, EventSegment } from "@/dto/live-results";

export interface InterimProcessedEntry extends EntryDetails {
    totalClean: number;
    totalCones: number;
    totalDNF: number;
    indexedTotalTime: number | null;
    rawTotalTime: number | null;
    segments: EventSegment[];
}

export type ClassGrouping = Record<
    string,
    {
        classInfo: {
            isGroup: boolean;
            classId: string;
            shortName: string;
            longName: string;
        };
        results: InterimProcessedEntry[];
    }
>;
