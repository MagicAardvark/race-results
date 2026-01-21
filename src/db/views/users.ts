import { userGlobalRoles, userOrgRoles } from "@/db/tables/users";
import { currentRoles } from "@/db/views/roles";
import { eq, and, lt, sql } from "drizzle-orm";
import { pgView } from "drizzle-orm/pg-core";

export const userActiveGlobalRoleAssignments = pgView(
    "user_global_roles_vw"
).as((qb) =>
    qb
        .select({
            userId: userGlobalRoles.userId,
            roleId: currentRoles.roleId,
            roleKey: currentRoles.key,
            roleName: currentRoles.name,
        })
        .from(userGlobalRoles)
        .innerJoin(
            currentRoles,
            eq(userGlobalRoles.roleId, currentRoles.roleId)
        )
        .where(
            and(
                eq(userGlobalRoles.isNegated, false),
                lt(userGlobalRoles.effectiveAt, sql`CURRENT_TIMESTAMP`)
            )
        )
);

export const userActiveOrgRoleAssignments = pgView("user_org_roles_vw").as(
    (qb) =>
        qb
            .select({
                userId: userOrgRoles.userId,
                roleId: currentRoles.roleId,
                roleKey: currentRoles.key,
                roleName: currentRoles.name,
                orgId: userOrgRoles.orgId,
            })
            .from(userOrgRoles)
            .innerJoin(
                currentRoles,
                eq(userOrgRoles.roleId, currentRoles.roleId)
            )
            .where(
                and(
                    eq(userOrgRoles.isNegated, false),
                    lt(userOrgRoles.effectiveAt, sql`CURRENT_TIMESTAMP`)
                )
            )
);
