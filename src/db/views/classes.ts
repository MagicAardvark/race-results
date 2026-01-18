import { effectiveFrom, effectiveTo } from "@/db/utils/columns";
import { sql } from "drizzle-orm";
import { numeric, pgView, text, uuid } from "drizzle-orm/pg-core";

export const effectiveBaseClassIndexValues = pgView(
    "classes_effective_index_values_vw",
    {
        classId: uuid("class_id").notNull(),
        shortName: text("short_name").notNull(),
        longName: text("long_name").notNull(),
        indexValue: numeric("index_value", {
            precision: 5,
            scale: 4,
        }).notNull(),
        orgId: uuid("org_id"),
        effectiveFrom: effectiveFrom,
        effectiveTo: effectiveTo,
    }
).as(sql`
SELECT
    base.id as class_id,
    base.short_name,
    base.long_name,
    index_values.index_value,
    base.org_id,
    index_values.effective_from,
    index_values.effective_to
FROM classes_base base
INNER JOIN classes_index_values index_values
    ON base.id = index_values.class_id
    AND (
        (base.org_id IS NULL AND index_values.org_id IS NULL)
        OR base.org_id = index_values.org_id
    )
`);

export const flattenedClassGroupClasses = pgView(
    "classes_flattened_group_classes_vw",
    {
        classGroupId: uuid("class_group_id").notNull(),
        classId: uuid("class_id").notNull(),
        orgId: uuid("org_id"),
        groupShortName: text("group_short_name").notNull(),
        groupLongName: text("group_long_name").notNull(),
    }
).as(sql`
SELECT
    cg.id as class_group_id,
    cgc.class_id,
    cg.org_id,
    cg.short_name as group_short_name,
    cg.long_name as group_long_name
FROM classes_groups cg
INNER JOIN classes_group_classes cgc
    ON cg.id = cgc.class_group_id
`);

export const effectiveClassGroupIndexValues = pgView(
    "classes_group_effective_index_values_vw",
    {
        classGroupId: uuid("class_group_id").notNull(),
        classId: uuid("class_id").notNull(),
        shortName: text("short_name").notNull(),
        longName: text("long_name").notNull(),
        groupShortName: text("group_short_name").notNull(),
        groupLongName: text("group_long_name").notNull(),
        orgId: uuid("org_id"),
        indexValue: numeric("index_value", {
            precision: 5,
            scale: 4,
        }).notNull(),
        effectiveFrom: effectiveFrom,
        effectiveTo: effectiveTo,
    }
).as(sql`
SELECT
    base.class_id,
    CONCAT(cgc.group_short_name, base.short_name) as short_name,
    CONCAT(cgc.group_long_name, ' ', base.long_name) as long_name,
    base.index_value,
    cgc.org_id,
    base.effective_from,
    base.effective_to,
    cgc.class_group_id,
    cgc.group_short_name,
    cgc.group_long_name
FROM classes_effective_index_values_vw base
INNER JOIN classes_flattened_group_classes_vw cgc
  ON base.class_id = cgc.class_id
`);

export const classesWithEffectiveIndexValues = pgView(
    "classes_with_effective_index_values_vw",
    {
        classId: uuid("class_id").notNull(),
        shortName: text("short_name").notNull(),
        longName: text("long_name").notNull(),
        classGroupId: uuid("class_group_id"),
        groupShortName: text("group_short_name").notNull(),
        groupLongName: text("group_long_name").notNull(),
        orgId: uuid("org_id"),
        indexValue: numeric("index_value", {
            precision: 5,
            scale: 4,
        }).notNull(),
        effectiveFrom: effectiveFrom,
        effectiveTo: effectiveTo,
    }
).as(sql`
SELECT
  class_id,
  short_name,
  long_name,
  index_value,
  org_id,
  effective_from,
  effective_to,
  null as class_group_id,
  null as group_short_name,
  null as group_long_name
FROM classes_effective_index_values_vw
UNION
SELECT
  class_id,
  short_name,
  long_name,
  index_value,
  org_id,
  effective_from,
  effective_to,
  class_group_id,
  group_short_name,
  group_long_name
FROM classes_group_effective_index_values_vw
`);
