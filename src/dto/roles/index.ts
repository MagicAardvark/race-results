import { currentRoles } from "@/db";

export type RoleDTO = typeof currentRoles.$inferSelect;

export interface AvailableRole {
    roleId: string;
    key: string;
    name: string;
}

export interface Role {
    roleId: string;
    key: string;
    name: string;
    isGlobal: boolean;
}
