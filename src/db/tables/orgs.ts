import {
    createdAt,
    deletedAt,
    effectiveAt,
    updatedAt,
} from "@/db/utils/columns";

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
        motorsportregOrgId: text("motorsportreg_org_id").unique(),
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

export const orgApiKeys = pgTable(
    "org_api_keys",
    {
        apiKeyId: uuid("id").primaryKey().defaultRandom(),
        orgId: uuid("org_id")
            .notNull()
            .references(() => orgs.orgId, { onDelete: "cascade" }),
        apiKey: text("api_key").notNull(),
        apiKeyEnabled: boolean("api_key_enabled").notNull().default(true),
        effectiveAt: effectiveAt,
    },
    (table) => [
        uniqueIndex("org_api_key_idx").on(table.orgId, table.apiKey),
        index("api_key_enabled_idx").on(table.apiKeyEnabled),
    ]
);
