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
