import { sql } from "drizzle-orm";
import { pgView, uuid, text } from "drizzle-orm/pg-core";

export const availableGlobalRoles = pgView("roles_available_global_vw", {
    roleId: uuid("id").notNull(),
    key: text("role_key").notNull(),
    name: text("name").notNull(),
}).as(sql`
WITH global_roles AS (
  SELECT
    id,
    role_key,
    name,
    is_enabled,
    ROW_NUMBER() OVER (PARTITION BY id ORDER BY effective_at DESC) as row_num
  FROM roles
  WHERE
    is_global = true
)

SELECT
  id,
  role_key,
  name
FROM global_roles
WHERE
  row_num = 1
AND is_enabled = true`);

export const availableOrgRoles = pgView("roles_available_org_vw", {
    roleId: uuid("id").notNull(),
    key: text("role_key").notNull(),
    name: text("name").notNull(),
}).as(sql`
WITH org_roles AS (
  SELECT
    id,
    role_key,
    name,
    is_enabled,
    ROW_NUMBER() OVER (PARTITION BY id ORDER BY effective_at DESC) as row_num
  FROM roles
  WHERE
    is_global = false
)

SELECT
  id,
  role_key,
  name
FROM org_roles
WHERE
  row_num = 1
AND is_enabled = true`);
