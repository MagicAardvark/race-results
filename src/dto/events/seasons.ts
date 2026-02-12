import { seasons } from "@/db";

export type SeasonDTO = typeof seasons.$inferSelect;

export interface CreateSeasonDTO {
    orgId: string;
    name: string;
    slug: string;
    startDate: string;
    endDate: string;
}

export interface CreateSeasonData {
    orgId: string;
    name: string;
    startDate: string;
    endDate: string;
}

export interface Season {
    seasonId: string;
    orgId: string;
    name: string;
    slug: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
}
