import {
    userActiveGlobalRoleAssignments,
    userActiveOrgRoleAssignments,
} from "@/db";

export type UserGlobalRoleDTO =
    typeof userActiveGlobalRoleAssignments.$inferSelect;

export type UserOrgRoleDTO = typeof userActiveOrgRoleAssignments.$inferSelect;

export type UserOrgRoleWithOrgDTO = UserOrgRoleDTO & {
    org: {
        orgId: string;
        name: string;
        slug: string;
        profileIconUrl: string | null;
    };
};

export type UserDTO = {
    userId: string;
    authProviderId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    displayName: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    motorsportregId: string | null;
    driverLinkedAt: Date | null;
    assignedOrgRoles: UserOrgRoleDTO[];
    assignedGlobalRoles: UserGlobalRoleDTO[];
};

export interface UserRole {
    roleId: string;
    key: string;
    name: string;
}

export interface User {
    userId: string;
    authProviderId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    displayName: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    motorsportregId: string | null;
    driverLinkedAt: Date | null;
    roles: string[];
}

export interface UserWithExtendedDetails extends User {
    orgs: OrgWithRoles[];
}

export interface OrgWithRoles {
    org: {
        orgId: string;
        name: string;
        slug: string;
        profileIconUrl: string | null;
    };
    roles: UserRole[];
}

export interface UserDetailsDTO {
    displayName?: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    motorsportregId?: string | null;
    driverLinkedAt?: Date | null;
}
