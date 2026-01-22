import { sql } from "drizzle-orm";
import { pgView, uuid, text, boolean } from "drizzle-orm/pg-core";

export const currentRoles = pgView("roles_current_vw", {
    roleId: uuid("id").notNull(),
    key: text("role_key").notNull(),
    name: text("name").notNull(),
    isGlobal: boolean("is_global").notNull(),
}).as(sql`
  WITH global_roles AS (
    SELECT
      id,
      role_key,
      name,
      is_enabled,
      is_global,
      ROW_NUMBER() OVER (PARTITION BY id ORDER BY effective_at DESC) as row_num
    FROM roles
    WHERE
      effective_at <= CURRENT_TIMESTAMP
  )

  SELECT
    id,
    role_key,
    name,
    is_global
  FROM global_roles
  WHERE
    row_num = 1
  AND is_enabled = true
`);
