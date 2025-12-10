import { pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { created_at, deleted_at, updated_at } from "../utils/columns";

export const orgs = pgTable("orgs", {
    org_id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").unique().notNull(),
    slug: text("slug").unique().notNull(),
    createdAt: created_at,
    updatedAt: updated_at,
    deletedAt: deleted_at
}, table => [
    uniqueIndex("slug_idx").on(table.slug)
]);