import { baseClasses, classCategories, classTypes } from "@/db";

export type ClassTypeDTO = typeof classTypes.$inferSelect;

export interface ClassType {
    classTypeId: string;
    classTypeKey: string;
    shortName: string;
    longName: string;
    isEnabled: boolean;
}

export type ClassCategoryDTO = typeof classCategories.$inferSelect;

export interface ClassCategory {
    classCategoryId: string;
    shortName: string;
    longName: string;
    isEnabled: boolean;
}

export interface BaseCarClassDTO {
    classes_base: typeof baseClasses.$inferSelect;
    classes_types: ClassTypeDTO | null;
    classes_categories: ClassCategoryDTO | null;
}

export interface BaseCarClass {
    classId: string;
    shortName: string;
    longName: string;
    isEnabled: boolean;
    classType?: ClassType | null;
    classCategory?: ClassCategory | null;
}

export interface BaseCarClassCreateDTO {
    shortName: string;
    longName: string;
    classTypeKey: string | null;
    classCategoryId: string | null;
    isIndexed: boolean;
    indexValue: number | null;
}

export interface BaseCarClassUpdateDTO {
    classId: string;
    shortName: string;
    longName: string;
    classTypeKey: string | null;
    classCategoryId: string | null;
    isEnabled: boolean;
    isIndexed: boolean;
}
