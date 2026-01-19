import { roleRepository } from "@/db/repositories/roles.repo";
import { AvailableRole, GlobalRoleDTO, OrgRoleDTO } from "@/dto/roles";

interface IRoleService {
    getGlobalRoles(): Promise<AvailableRole[]>;
    getOrgRoles(): Promise<AvailableRole[]>;
}

export class RolesService implements IRoleService {
    async getGlobalRoles(): Promise<AvailableRole[]> {
        return this.mapRoles(await roleRepository.getAvailableGlobalRoles());
    }

    async getOrgRoles(): Promise<AvailableRole[]> {
        return this.mapRoles(await roleRepository.getAvailableOrgRoles());
    }

    private mapRoles(roles: GlobalRoleDTO[] | OrgRoleDTO[]): AvailableRole[] {
        return roles.map((role) => ({
            roleId: role.roleId,
            key: role.key,
            name: role.name,
        }));
    }
}

export const rolesService = new RolesService();
