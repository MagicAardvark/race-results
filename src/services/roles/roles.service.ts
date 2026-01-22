import { roleRepository } from "@/db/repositories/roles.repo";
import { AvailableRole, RoleDTO } from "@/dto/roles";

interface IRoleService {
    getGlobalRoles(): Promise<AvailableRole[]>;
    getOrgRoles(): Promise<AvailableRole[]>;
    getRoleByKey(key: string): Promise<AvailableRole | null>;
}

export class RolesService implements IRoleService {
    async getGlobalRoles(): Promise<AvailableRole[]> {
        return this.mapRoles(await roleRepository.getAvailableGlobalRoles());
    }

    async getOrgRoles(): Promise<AvailableRole[]> {
        return this.mapRoles(await roleRepository.getAvailableOrgRoles());
    }

    async getRoleByKey(key: string): Promise<AvailableRole | null> {
        const role = await roleRepository.getRoleByKey(key);
        return role ? this.mapRoles([role])[0] : null;
    }

    private mapRoles(roles: RoleDTO[]): AvailableRole[] {
        return roles.map((role) => ({
            roleId: role.roleId,
            key: role.key,
            name: role.name,
        }));
    }
}

export const rolesService = new RolesService();
