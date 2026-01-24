import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
    currentRoles: {
        role: r.one.roles({
            from: r.currentRoles.roleId,
            to: r.roles.roleId,
            optional: false,
        }),
    },
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
        assignedGlobalRoles: r.many.userActiveGlobalRoleAssignments({
            from: r.users.userId,
            to: r.userActiveGlobalRoleAssignments.userId,
        }),
        assignedOrgRoles: r.many.userActiveOrgRoleAssignments({
            from: r.users.userId,
            to: r.userActiveOrgRoleAssignments.userId,
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
    userActiveGlobalRoleAssignments: {
        user: r.one.users({
            from: r.userActiveGlobalRoleAssignments.userId,
            to: r.users.userId,
            optional: false,
        }),
        role: r.one.roles({
            from: r.userActiveGlobalRoleAssignments.roleId,
            to: r.roles.roleId,
            optional: false,
        }),
    },
    userActiveOrgRoleAssignments: {
        user: r.one.users({
            from: r.userActiveOrgRoleAssignments.userId,
            to: r.users.userId,
            optional: false,
        }),
        role: r.one.roles({
            from: r.userActiveOrgRoleAssignments.roleId,
            to: r.roles.roleId,
            optional: false,
        }),
        org: r.one.orgs({
            from: r.userActiveOrgRoleAssignments.orgId,
            to: r.orgs.orgId,
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
    classCategories: {
        baseClasses: r.many.baseClasses({
            from: r.classCategories.classCategoryId,
            to: r.baseClasses.classCategoryId,
        }),
    },
    classTypes: {
        baseClasses: r.many.baseClasses({
            from: r.classTypes.classTypeKey,
            to: r.baseClasses.classTypeKey,
        }),
    },
    baseClasses: {
        classIndexValues: r.many.classIndexValues({
            from: r.baseClasses.classId,
            to: r.classIndexValues.classId,
        }),
        classType: r.one.classTypes({
            from: r.baseClasses.classTypeKey,
            to: r.classTypes.classTypeKey,
            optional: true,
        }),
        classCategory: r.one.classCategories({
            from: r.baseClasses.classCategoryId,
            to: r.classCategories.classCategoryId,
            optional: true,
        }),
    },
    classIndexValues: {
        baseClass: r.one.baseClasses({
            from: r.classIndexValues.classId,
            to: r.baseClasses.classId,
            optional: false,
        }),
    },
    classGroups: {
        classes: r.many.classGroupClasses({
            from: r.classGroups.classGroupId,
            to: r.classGroupClasses.classGroupId,
        }),
    },
    classGroupClasses: {
        classGroup: r.one.classGroups({
            from: r.classGroupClasses.classGroupId,
            to: r.classGroups.classGroupId,
        }),
        baseClass: r.one.baseClasses({
            from: r.classGroupClasses.classId,
            to: r.baseClasses.classId,
            optional: false,
        }),
    },
    effectiveBaseClassIndexValues: {
        baseClass: r.one.baseClasses({
            from: r.effectiveBaseClassIndexValues.classId,
            to: r.baseClasses.classId,
            optional: false,
        }),
        org: r.one.orgs({
            from: r.effectiveBaseClassIndexValues.orgId,
            to: r.orgs.orgId,
            optional: true,
        }),
    },
    flattenedClassGroupClasses: {
        classGroup: r.one.classGroups({
            from: r.flattenedClassGroupClasses.classGroupId,
            to: r.classGroups.classGroupId,
            optional: false,
        }),
        baseClass: r.one.baseClasses({
            from: r.flattenedClassGroupClasses.classId,
            to: r.baseClasses.classId,
            optional: false,
        }),
        org: r.one.orgs({
            from: r.flattenedClassGroupClasses.orgId,
            to: r.orgs.orgId,
            optional: true,
        }),
    },
    effectiveClassGroupIndexValues: {
        classGroup: r.one.classGroups({
            from: r.effectiveClassGroupIndexValues.classGroupId,
            to: r.classGroups.classGroupId,
            optional: false,
        }),
        baseClass: r.one.baseClasses({
            from: r.effectiveClassGroupIndexValues.classId,
            to: r.baseClasses.classId,
            optional: false,
        }),
        org: r.one.orgs({
            from: r.effectiveClassGroupIndexValues.orgId,
            to: r.orgs.orgId,
            optional: true,
        }),
    },
    classesWithEffectiveIndexValues: {
        org: r.one.orgs({
            from: r.classesWithEffectiveIndexValues.orgId,
            to: r.orgs.orgId,
            optional: true,
        }),
        baseClass: r.one.baseClasses({
            from: r.classesWithEffectiveIndexValues.classId,
            to: r.baseClasses.classId,
            optional: true,
        }),
        classGroup: r.one.classGroups({
            from: r.classesWithEffectiveIndexValues.classGroupId,
            to: r.classGroups.classGroupId,
            optional: true,
        }),
    },
}));
