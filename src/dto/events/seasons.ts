import { seasons } from "@/db";

export type SeasonDTO = typeof seasons.$inferSelect;

export interface CreateSeasonDTO {
    orgId: string;
    name: string;
    slug: string;
    startAt: Date;
    endAt: Date;
}

export interface CreateSeasonData {
    orgId: string;
    name: string;
    startAt: Date;
    endAt: Date;
}

export interface Season {
    seasonId: string;
    orgId: string;
    name: string;
    slug: string;
    startAt: Date;
    endAt: Date;
    isCurrent: boolean;
}
