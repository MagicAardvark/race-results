import { timestamp } from "drizzle-orm/pg-core";

export const generalTimestamp = (name: string) =>
    timestamp(name, { withTimezone: true });

export const createdAt = generalTimestamp("created_at").notNull().defaultNow();
export const updatedAt = generalTimestamp("updated_at").notNull().defaultNow();
export const deletedAt = generalTimestamp("deleted_at");
export const effectiveAt = generalTimestamp("effective_at")
    .notNull()
    .defaultNow();
export const effectiveFrom = generalTimestamp("effective_from")
    .notNull()
    .defaultNow();
export const effectiveTo = generalTimestamp("effective_to")
    .notNull()
    .defaultNow();
export const startAt = generalTimestamp("start_at").notNull();
export const endAt = generalTimestamp("end_at").notNull();
