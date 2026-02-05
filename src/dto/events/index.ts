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
    startAt: Date;
    endAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateEventData {
    orgId: string;
    name: string;
    startAt: Date;
    endAt: Date | undefined;
}

export interface CreateEventDTO {
    orgId: string;
    name: string;
    startAt: Date;
    endAt: Date;
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
