import { effectiveAt } from "@/db/utils/columns";
import { boolean, pgTable, text, unique, uuid } from "drizzle-orm/pg-core";

export const roles = pgTable(
    "roles",
    {
        roleId: uuid("id").primaryKey().defaultRandom(),
        key: text("role_key").notNull(),
        name: text("name").notNull().unique(),
        effectiveAt: effectiveAt,
        isEnabled: boolean("is_enabled").notNull().default(true),
    },
    (table) => [unique("unique_role").on(table.key, table.effectiveAt)]
);
