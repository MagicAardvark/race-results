import { availableGlobalRoles } from "@/db";

export type GlobalRoleDTO = typeof availableGlobalRoles.$inferSelect;

export type OrgRoleDTO = typeof availableGlobalRoles.$inferSelect;

export interface AvailableRole {
    roleId: string;
    key: string;
    name: string;
}
