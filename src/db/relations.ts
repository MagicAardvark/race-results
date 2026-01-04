import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
    orgs: {
        featureFlags: r.many.featureFlags({
            from: r.orgs.orgId,
            to: r.featureFlags.orgId,
        }),
        orgApiKeys: r.many.orgApiKeys({
            from: r.orgs.orgId,
            to: r.orgApiKeys.orgId,
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
    orgApiKeys: {
        org: r.one.orgs({
            from: r.orgApiKeys.orgId,
            to: r.orgs.orgId,
            optional: false,
        }),
    },
}));
