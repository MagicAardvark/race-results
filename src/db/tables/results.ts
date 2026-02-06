import { orgs } from "@/db/tables/orgs";
import {
    createdAt,
    deletedAt,
    endAt,
    startAt,
    updatedAt,
} from "@/db/utils/columns";
import { index, pgTable, text, uuid } from "drizzle-orm/pg-core";

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
