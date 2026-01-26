import {
    baseClasses,
    classCategories,
    classIndexValues,
    classTypes,
} from "@/db";

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

export type IndexValueDTO = typeof classIndexValues.$inferSelect;

export interface IndexValue {
    indexValueId: string;
    value: number;
    year: number;
}

export interface BaseCarClassDTO {
    classes_base: typeof baseClasses.$inferSelect;
    classes_types: ClassTypeDTO | null;
    classes_categories: ClassCategoryDTO | null;
    classes_index_values?: IndexValueDTO[];
}

export interface BaseCarClass {
    classId: string;
    shortName: string;
    longName: string;
    isIndexed: boolean;
    isEnabled: boolean;
    classType: ClassType | null;
    classCategory: ClassCategory | null;
    indexValues: IndexValue[];
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
}
