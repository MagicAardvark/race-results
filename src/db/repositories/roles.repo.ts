import { db } from "@/db";
import { GlobalRoleDTO, OrgRoleDTO } from "@/dto/roles";

interface IRoleRepository {
    getAvailableGlobalRoles(): Promise<GlobalRoleDTO[]>;
    getAvailableOrgRoles(): Promise<OrgRoleDTO[]>;
}

export class RoleRepository implements IRoleRepository {
    async getAvailableGlobalRoles(): Promise<GlobalRoleDTO[]> {
        return db.query.availableGlobalRoles.findMany();
    }

    async getAvailableOrgRoles(): Promise<OrgRoleDTO[]> {
        return await db.query.availableOrgRoles.findMany();
    }
}

export const roleRepository = new RoleRepository();
