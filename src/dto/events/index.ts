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
    startAt: Date;
    endAt: Date;
    msrEventId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateEventData {
    orgId: string;
    seasonId: string;
    name: string;
    startAt: Date;
    endAt: Date | undefined;
    msrEventId?: string;
}

export interface CreateEventDTO {
    orgId: string;
    seasonId: string;
    name: string;
    startAt: Date;
    endAt: Date;
    msrEventId?: string;
}

export interface UpdateEventData {
    eventId: string;
    orgId: string;
    name: string;
    startAt: Date;
    endAt: Date | undefined;
}

export interface UpdateEventDTO {
    name: string;
    startAt: Date;
    endAt: Date;
}
