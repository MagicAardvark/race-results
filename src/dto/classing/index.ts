import { classesWithEffectiveIndexValues } from "@/db";

export type ClassesWithEffectiveIndexValueDTO =
    typeof classesWithEffectiveIndexValues.$inferSelect;

export interface BaseCarClass {
    classId: string;
    shortName: string;
    longName: string;
    indexValue: number;
}

export interface ConfiguredCarClass extends BaseCarClass {
    classId: string;
    shortName: string;
    longName: string;
    classGroupId: string | null;
    groupShortName: string | null;
    groupLongName: string | null;
    indexValue: number;
}
