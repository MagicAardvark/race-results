import { orgs } from "./orgs";
import { createdAt, effectiveFrom, effectiveTo, updatedAt } from "@/db/utils/columns";
import {
    boolean,
    index,
    numeric,
    pgTable,
    primaryKey,
    text,
    uuid,
} from "drizzle-orm/pg-core";

export const baseClasses = pgTable(
    "classes_base",
    {
        classId: uuid("id").primaryKey().defaultRandom(),
        shortName: text("short_name").unique().notNull(),
        longName: text("long_name").unique().notNull(),
        isEnabled: boolean("is_enabled").notNull().default(true),
        // Null means global
        orgId: uuid("org_id").references(() => orgs.orgId, {
            onDelete: "cascade",
        }),
        createdAt: createdAt,
        updatedAt: updatedAt,
    },
    (table) => [
        index("base_class_short_name_idx").on(
            table.shortName,
            table.isEnabled,
            table.orgId
        ),
    ]
);

export const classIndexValues = pgTable(
    "classes_index_values",
    {
        indexValueId: uuid("id").primaryKey().defaultRandom(),
        classId: uuid("class_id")
            .notNull()
            .references(() => baseClasses.classId, { onDelete: "cascade" }),
        effectiveFrom: effectiveFrom,
        effectiveTo: effectiveTo,
        indexValue: numeric("index_value", {
            precision: 5,
            scale: 4,
        }).notNull(),
        // Null means global
        orgId: uuid("org_id").references(() => orgs.orgId, {
            onDelete: "cascade",
        }),
    },
    (table) => [
        index("class_index_value_class_effective_idx").on(
            table.classId,
            table.effectiveFrom,
            table.effectiveTo,
            table.orgId
        ),
    ]
);

export const classGroups = pgTable(
    "classes_groups",
    {
        classGroupId: uuid("id").primaryKey().defaultRandom(),
        shortName: text("short_name").unique().notNull(),
        longName: text("long_name").unique().notNull(),
        isEnabled: boolean("is_enabled").notNull().default(true),
        // Null means global
        orgId: uuid("org_id").references(() => orgs.orgId, {
            onDelete: "cascade",
        }),
        createdAt: createdAt,
        updatedAt: updatedAt,
    },
    (table) => [
        index("car_class_group_short_name_idx").on(
            table.shortName,
            table.isEnabled,
            table.orgId
        ),
    ]
);

export const classGroupClasses = pgTable(
    "classes_group_classes",
    {
        classGroupId: uuid("class_group_id")
            .notNull()
            .references(() => classGroups.classGroupId, {
                onDelete: "cascade",
            }),
        classId: uuid("class_id")
            .notNull()
            .references(() => baseClasses.classId, { onDelete: "cascade" }),
    },
    (table) => [
        primaryKey({ columns: [table.classGroupId, table.classId] }),
        index("class_group_class_group_idx").on(table.classGroupId),
    ]
);

