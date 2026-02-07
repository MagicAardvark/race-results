import { baseClasses, classGroups } from "@/db/schema";
import { orgs } from "@/db/tables/orgs";
import {
    createdAt,
    deletedAt,
    endAt,
    startAt,
    updatedAt,
} from "@/db/utils/columns";
import { index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const seasons = pgTable("results_seasons", {
    seasonId: uuid("id").primaryKey().defaultRandom(),
    orgId: uuid("org_id")
        .notNull()
        .references(() => orgs.orgId, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    createdAt: createdAt,
    updatedAt: updatedAt,
    deletedAt: deletedAt,
    startAt: startAt,
    endAt: endAt,
});

export const events = pgTable(
    "results_events",
    {
        eventId: uuid("id").primaryKey().defaultRandom(),
        orgId: uuid("org_id")
            .notNull()
            .references(() => orgs.orgId, { onDelete: "cascade" }),
        seasonId: uuid("season_id")
            .notNull()
            .references(() => seasons.seasonId, {
                onDelete: "cascade",
            }),
        name: text("name").notNull(),
        slug: text("slug").notNull(),
        startAt: startAt,
        endAt: endAt,
        createdAt: createdAt,
        updatedAt: updatedAt,
        deletedAt: deletedAt,
    },
    (table) => [
        index("results_events_org_id_idx").on(table.orgId),
        index("results_events_season_id_idx").on(table.seasonId),
    ]
);

export const eventSegments = pgTable("results_event_segments", {
    segmentId: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
        .notNull()
        .references(() => events.eventId, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    order: integer("order").notNull(),
});

export const eventEntries = pgTable("results_event_entries", {
    entryId: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
        .notNull()
        .references(() => events.eventId, { onDelete: "cascade" }),
    classId: uuid("class_id")
        .notNull()
        .references(() => baseClasses.classId, { onDelete: "cascade" }),
    classGroupId: uuid("class_group_id").references(
        () => classGroups.classGroupId,
        { onDelete: "cascade" }
    ),
    carNumber: text("car_number").notNull(),
    driverName: text("driver_name").notNull(),
    slug: text("slug").notNull(),
    carModel: text("car_model"),
    sponsor: text("sponsor"),
    externalAccountId: text("external_account_id"),
});

export const eventRuns = pgTable("results_event_runs", {
    runId: uuid("id").primaryKey().defaultRandom(),
    entryId: uuid("entry_id")
        .notNull()
        .references(() => eventEntries.entryId, { onDelete: "cascade" }),
    segmentId: uuid("segment_id")
        .notNull()
        .references(() => eventSegments.segmentId, { onDelete: "cascade" }),
    runNumber: integer("run_number").notNull(),
    status: text("status").notNull(),
    timeMs: integer("time_ms"),
    penaltyCount: integer("penalty_count").notNull().default(0),
});
