import { classGroups } from "@/db";

export type ClassGroupDTO = typeof classGroups.$inferSelect;

export interface ClassGroup {
    classGroupId: string;
    shortName: string;
    longName: string;
    isEnabled: boolean;
    orgId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface ClassGroupWithClasses extends ClassGroup {
    classIds: string[];
}

export interface ClassGroupCreateDTO {
    shortName: string;
    longName: string;
    orgId: string | null;
    classIds?: string[];
}

export interface ClassGroupUpdateDTO {
    classGroupId: string;
    shortName: string;
    longName: string;
    isEnabled: boolean;
    classIds?: string[];
}
