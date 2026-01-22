import { db } from "@/db";
import { RoleDTO } from "@/dto/roles";

interface IRoleRepository {
    getAvailableGlobalRoles(): Promise<RoleDTO[]>;
    getAvailableOrgRoles(): Promise<RoleDTO[]>;
    getRoleByKey(roleKey: string): Promise<RoleDTO | null>;
}

export class RoleRepository implements IRoleRepository {
    async getAvailableGlobalRoles(): Promise<RoleDTO[]> {
        return db.query.currentRoles.findMany({
            where: {
                isGlobal: true,
            },
        });
    }

    async getAvailableOrgRoles(): Promise<RoleDTO[]> {
        return db.query.currentRoles.findMany({
            where: {
                isGlobal: false,
            },
        });
    }

    async getRoleByKey(roleKey: string): Promise<RoleDTO | null> {
        const role = await db.query.currentRoles.findFirst({
            where: {
                key: roleKey,
            },
        });

        return role ?? null;
    }
}

export const roleRepository = new RoleRepository();
