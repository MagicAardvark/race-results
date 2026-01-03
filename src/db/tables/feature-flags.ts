import { createdAt, deletedAt, updatedAt } from "@/db/utils/columns";
import {
    boolean,
    index,
    pgTable,
    text,
    uniqueIndex,
    uuid,
} from "drizzle-orm/pg-core";
import { orgs } from "./orgs";

export const featureFlags = pgTable(
    "feature_flags",
    {
        featureFlagId: uuid("id").primaryKey().defaultRandom(),
        orgId: uuid("org_id")
            .notNull()
            .references(() => orgs.orgId, { onDelete: "cascade" }),
        featureKey: text("feature_key").notNull(),
        enabled: boolean("enabled").notNull().default(false),
        createdAt: createdAt,
        updatedAt: updatedAt,
        deletedAt: deletedAt,
    },
    (table) => [
        uniqueIndex("org_feature_key_idx").on(table.orgId, table.featureKey),
        index("org_id_idx").on(table.orgId),
        index("feature_key_idx").on(table.featureKey),
    ]
);

