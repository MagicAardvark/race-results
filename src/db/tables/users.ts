import {
    createdAt,
    updatedAt,
    deletedAt,
    effectiveAt,
} from "@/db/utils/columns";
import {
    boolean,
    index,
    pgTable,
    primaryKey,
    text,
    timestamp,
    uniqueIndex,
    uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable(
    "users",
    {
        userId: uuid("id").primaryKey().defaultRandom(),
        authProviderId: text("auth_provider_id").unique().notNull(),
        createdAt: createdAt,
        updatedAt: updatedAt,
        deletedAt: deletedAt,
        displayName: text("display_name"),
        firstName: text("first_name"),
        lastName: text("last_name"),
        email: text("email"),
        motorsportregId: text("motorsportreg_id"),
        driverLinkedAt: timestamp("driver_linked_at", { withTimezone: true }),
    },
    (table) => [uniqueIndex("auth_provider_idx").on(table.authProviderId)]
);

export const userGlobalRoles = pgTable(
    "user_global_roles",
    {
        userId: uuid("user_id")
            .notNull()
            .references(() => users.userId, { onDelete: "cascade" }),
        roleId: uuid("role_id").notNull(),
        effectiveAt: effectiveAt,
        isNegated: boolean("is_negated").notNull().default(false),
    },
    (table) => [
        primaryKey({
            columns: [table.userId, table.roleId, table.effectiveAt],
        }),
        index("user_global_roles_user_idx").on(table.userId),
        index("user_global_roles_role_idx").on(table.roleId),
    ]
);

export const userOrgRoles = pgTable(
    "user_org_roles",
    {
        userId: uuid("user_id")
            .notNull()
            .references(() => users.userId, { onDelete: "cascade" }),
        roleId: uuid("role_id").notNull(),
        orgId: uuid("org_id").notNull(),
        effectiveAt: effectiveAt,
        isNegated: boolean("is_negated").notNull().default(false),
    },
    (table) => [
        primaryKey({
            columns: [
                table.userId,
                table.roleId,
                table.orgId,
                table.effectiveAt,
            ],
        }),
        index("user_org_roles_user_idx").on(table.userId),
        index("user_org_roles_role_idx").on(table.roleId),
        index("user_org_roles_org_idx").on(table.orgId),
    ]
);
