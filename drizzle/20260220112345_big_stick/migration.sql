ALTER TABLE "classes_groups" ADD COLUMN "identification_mode" text DEFAULT 'BASE_CLASS_ONLY' NOT NULL;--> statement-breakpoint
CREATE OR REPLACE VIEW "classes_flattened_group_classes_vw" AS (
SELECT
    cg.id as class_group_id,
    cgc.class_id,
    cg.org_id,
    cg.short_name as group_short_name,
    cg.long_name as group_long_name,
    cg.identification_mode
FROM classes_groups cg
INNER JOIN classes_group_classes cgc
    ON cg.id = cgc.class_group_id
);
CREATE OR REPLACE VIEW "classes_group_effective_index_values_vw" AS (
SELECT
    base.class_id,
    CASE
      WHEN cgc.identification_mode = 'GROUP_PLUS_BASE_CLASS' THEN
        CONCAT(cgc.group_short_name, base.short_name)
      ELSE
        base.short_name
    END as short_name,
    CASE
      WHEN cgc.identification_mode = 'BASE_CLASS_ONLY' THEN
        CONCAT(cgc.group_long_name, ' ', base.long_name)
      ELSE 
        base.long_name
    END as long_name,
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
);--> statement-breakpoint