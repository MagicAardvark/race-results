import { orgs } from "@/db/tables/orgs";
import { date, decimal, pgTable, text, time, uuid } from "drizzle-orm/pg-core";

export const msrEvents = pgTable("msr_events", {
    msrEventId: text("id").primaryKey(),
    orgId: uuid("org_id")
        .references(() => orgs.orgId, { onDelete: "cascade" })
        .notNull(),
    name: text("name").notNull(),
    description: text("description"),
    image: text("image"),
    type: text("type").notNull(),
    start: date("start").notNull(),
    end: date("end").notNull(),
    registrationStartDate: date("registration_start"),
    registrationStartTime: time("registration_start_time"),
    registrationEndDate: date("registration_end"),
    registrationEndTime: time("registration_end_time"),
    detailUri: text("detail_uri").notNull(),
    venueId: text("venue_id")
        .notNull()
        .references(() => msrEventVenues.msrEventVenueId, {
            onDelete: "cascade",
        }),
});

export const msrEventVenues = pgTable("msr_event_venues", {
    msrEventVenueId: text("id").primaryKey(),
    city: text("city"),
    region: text("region"),
    country: text("country"),
    postalCode: text("postal_code"),
    lat: decimal("lat", { precision: 10, scale: 7 }),
    lng: decimal("lng", { precision: 10, scale: 7 }),
});
