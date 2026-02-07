import { eventEntries, eventRuns } from "@/db";

export interface EventCloseoutDTO {
    orgId: string;
    eventId: string;
    results: EventEntryDTO[];
}

export interface EventEntryDTO {
    classId: string;
    classGroupId: string | null;
    carNumber: string;
    driverName: string;
    slug: string;
    carModel: string;
    sponsor: string | null;
    externalAccountId: string | null;
    runs: EventRunDTO[];
}

export interface EventRunDTO {
    segmentId: string;
    runNumber: number;
    status: string;
    timeMs: number | null;
    penaltyCount: number;
}

export type EventEntryInsertDTO = typeof eventEntries.$inferInsert;

export type EventRunInsertDTO = typeof eventRuns.$inferInsert;
