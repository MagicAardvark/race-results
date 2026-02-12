export type ScoringModes = "singlebest";

export type TrophyModes = "topn" | "percentage";

export interface TrophyConfiguration {
    mode: TrophyModes;
    value: number;
}

export interface EventConfiguration {
    scoringMode: ScoringModes;
    conePenaltyInSeconds: number;
    trophyConfiguration: TrophyConfiguration;
}

export interface EventDTO {
    eventId: string;
    orgId: string;
    name: string;
    slug: string;
    seasonId: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    msrEventId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateEventData {
    orgId: string;
    seasonId: string;
    name: string;
    isMultiDay: boolean;
    startDate: string;
    endDate: string | undefined;
    msrEventId?: string;
}

export interface CreateEventDTO {
    orgId: string;
    seasonId: string;
    name: string;
    startDate: string;
    endDate: string;
    msrEventId?: string;
}

export interface UpdateEventData {
    eventId: string;
    orgId: string;
    name: string;
    isMultiDay: boolean;
    startDate: string;
    endDate: string | undefined;
}

export interface UpdateEventDTO {
    name: string;
    startDate: string;
    endDate: string;
}
