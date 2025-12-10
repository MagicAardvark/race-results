import { timestamp } from "drizzle-orm/pg-core";

export const created_at = timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
export const updated_at = timestamp("updated_at", { withTimezone: true }).notNull().defaultNow();
export const deleted_at = timestamp("deleted_at", { withTimezone: true });