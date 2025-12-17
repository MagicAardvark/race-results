import { roles } from "@/db/schema";
import {
    createdAt,
    updatedAt,
    deletedAt,
    effectiveAt,
} from "@/db/utils/columns";
import { relations } from "drizzle-orm";
import { boolean, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";

export const users = pgTable(
    "users",
    {
        userId: uuid("id").primaryKey().defaultRandom(),
        authProviderId: text("auth_provider_id").unique().notNull(),
        createdAt: createdAt,
        updatedAt: updatedAt,
        deletedAt: deletedAt,
        displayName: text("display_name"),
    },
    (table) => [uniqueIndex("auth_provider_idx").on(table.authProviderId)]
);

export const userRoles = pgTable("user_roles", {
    userId: uuid("id")
        .notNull()
        .references(() => users.userId, { onDelete: "cascade" }),
    role: text("role")
        .notNull()
        .references(() => roles.role, { onDelete: "cascade" }),
    effectiveAt: effectiveAt,
    isNegated: boolean("is_negated").notNull().default(false),
});

export const usersRelations = relations(users, ({ many }) => ({
    assignedRoles: many(userRoles, { relationName: "assigned_user_roles" }),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
    user: one(users, {
        fields: [userRoles.userId],
        references: [users.userId],
        relationName: "assigned_user_roles",
    }),
}));
