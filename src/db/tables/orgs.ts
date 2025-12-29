import { createdAt, deletedAt, updatedAt } from "@/db/utils/columns";

import {
    boolean,
    index,
    pgTable,
    text,
    uniqueIndex,
    uuid,
} from "drizzle-orm/pg-core";

export const orgs = pgTable(
    "orgs",
    {
        orgId: uuid("id").primaryKey().defaultRandom(),
        name: text("name").unique().notNull(),
        slug: text("slug").unique().notNull(),
        description: text("description"),
        isPublic: boolean("is_public").notNull().default(false),
        createdAt: createdAt,
        updatedAt: updatedAt,
        deletedAt: deletedAt,
    },
    (table) => [
        uniqueIndex("slug_idx").on(table.slug),
        index("slug_with_visibility_idx").on(table.slug, table.isPublic),
    ]
);
