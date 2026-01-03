import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
    orgs: {
        featureFlags: r.many.featureFlags({
            from: r.orgs.orgId,
            to: r.featureFlags.orgId,
        }),
    },
    featureFlags: {
        org: r.one.orgs({
            from: r.featureFlags.orgId,
            to: r.orgs.orgId,
            optional: false,
        }),
    },
    users: {
        assignedOrgRoles: r.many.userOrgRoles({
            from: r.users.userId,
            to: r.userOrgRoles.userId,
        }),
        assignedGlobalRoles: r.many.userGlobalRoles({
            from: r.users.userId,
            to: r.userGlobalRoles.userId,
        }),
    },
    userOrgRoles: {
        user: r.one.users({
            from: r.userOrgRoles.userId,
            to: r.users.userId,
            optional: false,
        }),
        org: r.one.orgs({
            from: r.userOrgRoles.orgId,
            to: r.orgs.orgId,
            optional: false,
        }),
        role: r.one.roles({
            from: r.userOrgRoles.roleId,
            to: r.roles.roleId,
            optional: false,
        }),
    },
    userGlobalRoles: {
        user: r.one.users({
            from: r.userGlobalRoles.userId,
            to: r.users.userId,
            optional: false,
        }),
        role: r.one.roles({
            from: r.userGlobalRoles.roleId,
            to: r.roles.roleId,
            optional: false,
        }),
    },
}));

// export const usersRelations = relations(users, ({ many }) => ({
//     assignedRoles: many(userRoles, { relationName: "assigned_user_roles" }),
// }));

// export const userRolesRelations = relations(userRoles, ({ one }) => ({
//     user: one(users, {
//         fields: [userRoles.userId],
//         references: [users.userId],
//         relationName: "assigned_user_roles",
//     }),
//     org: one(orgs, {
//         fields: [userRoles.orgId],
//         references: [orgs.orgId],
//         relationName: "assigned_user_role_to_org",
//     }),
//     role: one(roles, {
//         fields: [userRoles.roleId],
//         references: [roles.roleId],
//         relationName: "assigned_role_details",
//     }),
// }));
