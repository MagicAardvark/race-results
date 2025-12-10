import { pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { created_at, deleted_at, updated_at } from "../utils/columns";

export const users = pgTable("users", {
    user_id: uuid("id").primaryKey().defaultRandom(),
    auth_provider_id: text("auth_provider_id").unique().notNull(),
    created_at: created_at,
    updated_at: updated_at,
    deleted_at: deleted_at,
    display_name: text("display_name")
}, table => [
    uniqueIndex("auth_provider_idx").on(table.auth_provider_id)
]);

