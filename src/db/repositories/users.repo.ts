import { UserDTO, UserOrgRoleWithOrgDTO } from "@/dto/users";
import { db } from "@/db";
import { users, userGlobalRoles, userOrgRoles } from "@/db/schema";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import { and } from "drizzle-orm/sql";
import { roleRepository } from "@/db/repositories/roles.repo";
import { AvailableRole } from "@/dto/roles";
import { ROLES } from "@/constants/global";
import { DatabaseError } from "@/lib/errors/app-errors";

interface IUserRepository {
    findAll(): Promise<UserDTO[]>;
    findByAuthProviderId(authProviderId: string): Promise<UserDTO | null>;
    findByUserId(userId: string): Promise<UserDTO | null>;
    findOrgRoles(userId: string): Promise<UserOrgRoleWithOrgDTO[]>;
    create(authProviderId: string, displayName?: string): Promise<UserDTO>;
    updateUserGlobalRoles(userId: string, roleKeys: string[]): Promise<void>;
    delete(userId: string): Promise<void>;
    addUserToOrganization(userId: string, orgId: string): Promise<void>;
}

const USER_QUERY_OPTIONS = {
    with: {
        assignedGlobalRoles: true,
        assignedOrgRoles: true,
    },
} as const;

export class UsersRepository implements IUserRepository {
    async findAll(): Promise<UserDTO[]> {
        return db.query.users.findMany({
            ...USER_QUERY_OPTIONS,
            orderBy: {
                displayName: "asc",
            },
        });
    }

    async findByAuthProviderId(
        authProviderId: string
    ): Promise<UserDTO | null> {
        const dbUser = await db.query.users.findFirst({
            ...USER_QUERY_OPTIONS,
            where: {
                authProviderId,
                deletedAt: { isNull: true },
            },
        });

        return dbUser ?? null;
    }

    async findByUserId(userId: string): Promise<UserDTO | null> {
        const dbUser = await db.query.users.findFirst({
            ...USER_QUERY_OPTIONS,
            where: {
                userId,
                deletedAt: { isNull: true },
            },
        });

        return dbUser ?? null;
    }

    async findOrgRoles(userId: string): Promise<UserOrgRoleWithOrgDTO[]> {
        const roles = await db.query.userActiveOrgRoleAssignments.findMany({
            with: {
                org: true,
            },
            where: {
                userId: userId,
            },
        });

        return roles;
    }

    async create(
        authProviderId: string,
        displayName?: string
    ): Promise<UserDTO> {
        const existingUser = await this.findExistingUser(authProviderId);
        const user = existingUser
            ? await this.updateExistingUser(existingUser, displayName)
            : await this.insertNewUser(authProviderId, displayName);

        await this.ensureUserRole(user.userId);

        return (await this.findByAuthProviderId(authProviderId))!;
    }

    private async findExistingUser(authProviderId: string) {
        return db.query.users.findFirst({
            where: {
                authProviderId,
            },
        });
    }

    private async updateExistingUser(
        existingUser: Awaited<ReturnType<typeof this.findExistingUser>>,
        displayName?: string
    ) {
        if (!existingUser) {
            throw new Error("Cannot update non-existent user");
        }

        const updates: {
            deletedAt?: null;
            displayName?: string | null;
            updatedAt: Date;
        } = {
            updatedAt: new Date(),
        };

        if (existingUser.deletedAt) {
            updates.deletedAt = null;
            updates.displayName = displayName ?? existingUser.displayName;
        } else if (displayName && displayName !== existingUser.displayName) {
            updates.displayName = displayName;
        }

        if (Object.keys(updates).length > 1) {
            await db
                .update(users)
                .set(updates)
                .where(eq(users.userId, existingUser.userId));
        }

        return existingUser;
    }

    private async insertNewUser(authProviderId: string, displayName?: string) {
        const [newUser] = await db
            .insert(users)
            .values({
                authProviderId,
                displayName: displayName ?? null,
            })
            .returning();

        return newUser;
    }

    private async ensureUserRole(userId: string) {
        const userRole = await roleRepository.getRoleByKey(ROLES.user);

        if (!userRole) {
            throw new Error(
                `Cannot assign role: '${ROLES.user}' role not found in database. Please run database seed.`
            );
        }

        const existingRole = await db.query.userGlobalRoles.findFirst({
            where: {
                userId,
                roleId: userRole.roleId,
            },
        });

        if (!existingRole) {
            await db.insert(userGlobalRoles).values({
                userId,
                roleId: userRole.roleId,
            });
        }
    }

    async updateUserGlobalRoles(
        userId: string,
        roleKeys: string[]
    ): Promise<void> {
        // Get all available roles
        const globalRoles = await roleRepository.getAvailableGlobalRoles();

        // Get current user roles (only non-negated roles)
        const currentRoles = await db.query.userGlobalRoles.findMany({
            where: {
                userId,
                isNegated: false,
            },
        });

        // Find roles to add and remove
        const roleMap = new Map<string, AvailableRole>(
            globalRoles.map((r) => [r.key, r])
        );

        const targetRoleIds: string[] = roleKeys
            .map((key) => {
                const role = roleMap.get(key);
                return role?.roleId as string | undefined;
            })
            .filter((id): id is string => typeof id === "string");

        const currentRoleIds = new Set(
            currentRoles
                .map((r) => r.roleId)
                .filter((id): id is string => id !== undefined)
        );

        // Remove roles that are no longer assigned
        const rolesToRemove = currentRoles.filter(
            (r) => !targetRoleIds.includes(r.roleId)
        );

        if (rolesToRemove.length > 0) {
            // Delete roles that need to be removed
            // Only delete non-negated roles to avoid deleting historical records
            for (const roleToRemove of rolesToRemove) {
                await db
                    .delete(userGlobalRoles)
                    .where(
                        and(
                            eq(userGlobalRoles.userId, userId),
                            eq(userGlobalRoles.roleId, roleToRemove.roleId),
                            eq(userGlobalRoles.isNegated, false)
                        )
                    );
            }
        }

        // Add new roles
        const rolesToAdd = targetRoleIds.filter(
            (roleId) => !currentRoleIds.has(roleId)
        );

        if (rolesToAdd.length > 0) {
            await db.insert(userGlobalRoles).values(
                rolesToAdd.map((roleId) => ({
                    userId,
                    roleId,
                }))
            );
        }
    }

    async delete(userId: string): Promise<void> {
        await db
            .update(users)
            .set({ deletedAt: new Date() })
            .where(eq(users.userId, userId));
    }

    async addUserToOrganization(userId: string, orgId: string): Promise<void> {
        const defaultRole = await roleRepository.getRoleByKey(ROLES.orgManager);

        if (!defaultRole) {
            throw new DatabaseError(
                `Cannot add user to organization: '${ROLES.orgManager}' role not found in database.`
            );
        }

        await db
            .insert(userOrgRoles)
            .values({
                userId: userId,
                orgId: orgId,
                roleId: defaultRole.roleId,
            })
            .onConflictDoNothing();
    }
}

export const usersRepository = new UsersRepository();
