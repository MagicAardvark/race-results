import { baseClasses } from "@/db";

export type BaseCarClassDTO = typeof baseClasses.$inferSelect;

export interface BaseCarClass {
    classId: string;
    shortName: string;
    longName: string;
    isEnabled: boolean;
}

export interface BaseCarClassCreateDTO {
    shortName: string;
    longName: string;
}

export interface BaseCarClassUpdateDTO {
    classId: string;
    shortName: string;
    longName: string;
    isEnabled: boolean;
}
