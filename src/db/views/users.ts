import { sql } from "drizzle-orm";
import { pgView, text, uuid } from "drizzle-orm/pg-core";

export const userActiveGlobalRoleAssignments = pgView("user_global_roles_vw", {
    userId: uuid("user_id").notNull(),
    roleId: uuid("role_id").notNull(),
    roleKey: text("role_key").notNull(),
    roleName: text("role_name").notNull(),
}).as(sql`
WITH effective_global_roles AS (
  SELECT
    user_global_roles.user_id,
    roles_current_vw.id as role_id,
    roles_current_vw.role_key,
    roles_current_vw.name as role_name,
    user_global_roles.is_negated,
    ROW_NUMBER() OVER (
        PARTITION BY 
            user_global_roles.user_id, 
            roles_current_vw.id
        ORDER BY user_global_roles.effective_at DESC
    ) as row_num
  FROM
    user_global_roles
  JOIN roles_current_vw ON user_global_roles.role_id = roles_current_vw.id
  WHERE
    user_global_roles.effective_at < CURRENT_TIMESTAMP
)

SELECT
  user_id,
  role_id,
  role_key,
  role_name
FROM effective_global_roles
WHERE
  row_num = 1
AND is_negated = false
`);

export const userActiveOrgRoleAssignments = pgView("user_org_roles_vw", {
    userId: uuid("user_id").notNull(),
    roleId: uuid("role_id").notNull(),
    roleKey: text("role_key").notNull(),
    roleName: text("role_name").notNull(),
    orgId: uuid("org_id").notNull(),
}).as(sql`
WITH effective_org_roles AS (
  SELECT
    user_org_roles.user_id,
    roles_current_vw.id as role_id,
    roles_current_vw.role_key,
    roles_current_vw.name as role_name,
    user_org_roles.org_id,
    user_org_roles.is_negated,
    ROW_NUMBER() OVER (
        PARTITION BY 
            user_org_roles.user_id, 
            roles_current_vw.id, 
            user_org_roles.org_id 
        ORDER BY user_org_roles.effective_at DESC
    ) as row_num
  FROM
    user_org_roles
    JOIN roles_current_vw ON user_org_roles.role_id = roles_current_vw.id
  WHERE
    user_org_roles.effective_at < CURRENT_TIMESTAMP
)

SELECT
  user_id,
  role_id,
  role_key,
  role_name,
  org_id
FROM effective_org_roles
WHERE
  row_num = 1
AND is_negated = false
`);
