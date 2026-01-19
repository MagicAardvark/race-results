export type UserDTO = {
    userId: string;
    authProviderId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    displayName: string | null;
    assignedOrgRoles: UserOrgRolesDTO[];
    assignedGlobalRoles: UserGlobalRolesDTO[];
};

export type RoleDTO = {
    roleId: string;
    key: string;
    name: string;
    effectiveAt: Date;
    isEnabled: boolean;
    isGlobal: boolean;
};

export type UserOrgRolesDTO = {
    userId: string;
    roleId: string;
    orgId: string;
    effectiveAt: Date;
    isNegated: boolean;
    role: RoleDTO;
};

export type UserGlobalRolesDTO = {
    userId: string;
    roleId: string;
    effectiveAt: Date;
    isNegated: boolean;
    role: RoleDTO;
};

export interface UserRole {
    userId: string;
    role: string;
    effectiveAt: Date;
    isNegated: boolean;
}

export interface User {
    userId: string;
    authProviderId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    displayName: string | null;
    roles: string[];
}
