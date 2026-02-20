import { classGroups } from "@/db";

export type IdentificationModes = "BASE_CLASS_ONLY" | "GROUP_PLUS_BASE_CLASS";

export type ClassGroupDTO = typeof classGroups.$inferSelect;

export interface ClassGroup {
    classGroupId: string;
    shortName: string;
    longName: string;
    identificationMode: IdentificationModes;
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
    identificationMode: IdentificationModes;
    orgId: string | null;
    classIds?: string[];
}

export interface ClassGroupUpdateDTO {
    classGroupId: string;
    shortName: string;
    longName: string;
    identificationMode: IdentificationModes;
    isEnabled: boolean;
    classIds?: string[];
}
