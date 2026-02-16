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
        events: r.many.events({
            from: r.orgs.orgId,
            to: r.events.orgId,
        }),
        msrEvents: r.many.msrEvents({
            from: r.orgs.orgId,
            to: r.msrEvents.orgId,
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
    seasons: {
        org: r.one.orgs({
            from: r.seasons.orgId,
            to: r.orgs.orgId,
            optional: false,
        }),
        events: r.many.events({
            from: r.seasons.seasonId,
            to: r.events.seasonId,
        }),
    },
    events: {
        org: r.one.orgs({
            from: r.events.orgId,
            to: r.orgs.orgId,
            optional: false,
        }),
        season: r.one.seasons({
            from: r.events.seasonId,
            to: r.seasons.seasonId,
            optional: false,
        }),
        segments: r.many.eventSegments({
            from: r.events.eventId,
            to: r.eventSegments.eventId,
        }),
        entries: r.many.eventEntries({
            from: r.events.eventId,
            to: r.eventEntries.eventId,
        }),
        msrEvent: r.one.msrEvents({
            from: r.events.msrEventId,
            to: r.msrEvents.msrEventId,
            optional: true,
        }),
    },
    eventSegments: {
        event: r.one.events({
            from: r.eventSegments.eventId,
            to: r.events.eventId,
            optional: false,
        }),
        eventRuns: r.many.eventRuns({
            from: r.eventSegments.segmentId,
            to: r.eventRuns.segmentId,
        }),
    },
    eventEntries: {
        event: r.one.events({
            from: r.eventEntries.eventId,
            to: r.events.eventId,
            optional: false,
        }),
        baseClass: r.one.baseClasses({
            from: r.eventEntries.classId,
            to: r.baseClasses.classId,
            optional: false,
        }),
        classGroup: r.one.classGroups({
            from: r.eventEntries.classGroupId,
            to: r.classGroups.classGroupId,
            optional: true,
        }),
    },
    eventRuns: {
        eventSegment: r.one.eventSegments({
            from: r.eventRuns.segmentId,
            to: r.eventSegments.segmentId,
            optional: false,
        }),
        eventEntry: r.one.eventEntries({
            from: r.eventRuns.entryId,
            to: r.eventEntries.entryId,
            optional: false,
        }),
    },
    msrEvents: {
        event: r.one.events({
            from: r.msrEvents.msrEventId,
            to: r.events.eventId,
        }),
        org: r.one.orgs({
            from: r.msrEvents.orgId,
            to: r.orgs.orgId,
            optional: false,
        }),
        venue: r.one.msrEventVenues({
            from: r.msrEvents.venueId,
            to: r.msrEventVenues.msrEventVenueId,
            optional: true,
        }),
    },
    msrEventVenues: {
        msrEvents: r.many.msrEvents({
            from: r.msrEventVenues.msrEventVenueId,
            to: r.msrEvents.venueId,
        }),
    },
    activeOrgApiKeys: {
        org: r.one.orgs({
            from: r.activeOrgApiKeys.orgId,
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
