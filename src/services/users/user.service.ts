import { usersRepository } from "@/db/repositories/users.repo";
import {
    OrgWithRoles,
    User,
    UserDTO,
    UserWithExtendedDetails,
} from "@/dto/users";
import { auth } from "@clerk/nextjs/server";
import { ROLES } from "@/constants/global";
import { rolesService } from "@/services/roles/roles.service";

interface IUserService {
    getAllUsers(): Promise<User[]>;
    getCurrentUser(): Promise<UserWithExtendedDetails | null>;
    getUserById(userId: string): Promise<UserWithExtendedDetails | null>;
    getUserOrgsWithPermissions(userId: string): Promise<OrgWithRoles[]>;
    updateUser(userId: string, data: { displayName?: string }): Promise<void>;
    deleteUser(userId: string): Promise<void>;
    addUserToOrganization(userId: string, orgId: string): Promise<void>;
    addUserOrganizationRole(
        userId: string,
        orgId: string,
        roleId: string
    ): Promise<void>;
    negateUserOrganizationRole(
        userId: string,
        orgId: string,
        roleId: string
    ): Promise<void>;
}

export class UserService implements IUserService {
    async getAllUsers() {
        return mapUsers(await usersRepository.findAll());
    }

    async getCurrentUser(): Promise<UserWithExtendedDetails | null> {
        const { userId } = await auth();

        if (userId === null) {
            return null;
        }

        const user = await usersRepository.findByAuthProviderId(userId);

        if (!user) {
            return null;
        }

        return {
            ...mapUser(user),
            orgs: await this.getUserOrgsWithPermissions(user.userId),
        };
    }

    async getUserById(userId: string): Promise<UserWithExtendedDetails | null> {
        const user = await usersRepository.findByUserId(userId);
        return user
            ? {
                  ...mapUser(user),
                  orgs: await this.getUserOrgsWithPermissions(user.userId),
              }
            : null;
    }

    async getUserOrgsWithPermissions(userId: string): Promise<OrgWithRoles[]> {
        const roles = await usersRepository.findOrgRoles(userId);

        const orgsWithRoles: OrgWithRoles[] = [];

        Map.groupBy(roles, (role) => role.org.orgId).forEach((value) => {
            const org = value[0].org;
            orgsWithRoles.push({
                org: {
                    orgId: org.orgId,
                    name: org.name,
                    slug: org.slug,
                },
                roles: value.map((value) => ({
                    roleId: value.roleId,
                    key: value.roleKey,
                    name: value.roleName,
                })),
            });
        });

        return orgsWithRoles;
    }

    async updateUser(
        userId: string,
        data: { displayName?: string }
    ): Promise<void> {
        if (data.displayName !== undefined) {
            await usersRepository.update(userId, {
                displayName: data.displayName,
            });
        }
    }

    async updateUserGlobalRoles(userId: string, roleKeys: string[]) {
        if (roleKeys.length === 0) {
            throw new Error("At least one role must be assigned to the user.");
        }

        if (!roleKeys.includes(ROLES.user)) {
            throw new Error("The 'user' role must be assigned to the user.");
        }

        await usersRepository.updateUserGlobalRoles(userId, roleKeys);
    }

    async deleteUser(userId: string): Promise<void> {
        await usersRepository.delete(userId);
    }

    async addUserToOrganization(userId: string, orgId: string): Promise<void> {
        const defaultRole = await rolesService.getRoleByKey(ROLES.orgManager);

        if (!defaultRole) {
            throw new Error(
                `Cannot add user to organization: '${ROLES.orgManager}' role not found.`
            );
        }

        const orgRoles = (await this.getUserOrgsWithPermissions(userId)).filter(
            (role) => role.org.orgId === orgId
        );

        if (
            orgRoles.length > 0 &&
            orgRoles.some((role) =>
                role.roles.some((r) => r.key === ROLES.orgManager)
            )
        ) {
            throw new Error(
                `User is already a member of the organization with the '${ROLES.orgManager}' role.`
            );
        }

        await usersRepository.addUserOrganizationRole(
            userId,
            orgId,
            defaultRole.roleId
        );
    }

    async addUserOrganizationRole(
        userId: string,
        orgId: string,
        roleId: string
    ): Promise<void> {
        const orgRoles = (await this.getUserOrgsWithPermissions(userId)).filter(
            (role) => role.org.orgId === orgId
        );

        if (
            orgRoles.length > 0 &&
            orgRoles.some((role) => role.roles.some((r) => r.roleId === roleId))
        ) {
            throw new Error(
                `User already has the specified role in the organization.`
            );
        }

        await usersRepository.addUserOrganizationRole(userId, orgId, roleId);
    }

    async negateUserOrganizationRole(
        userId: string,
        orgId: string,
        roleId: string
    ): Promise<void> {
        await usersRepository.negateUserOrganizationRole(userId, orgId, roleId);
    }
}

const mapUsers = (data: UserDTO[]) => {
    return data.map(mapUser);
};

const mapUser = (data: UserDTO) => {
    return {
        userId: data.userId,
        displayName: data.displayName,
        authProviderId: data.authProviderId,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        deletedAt: data.deletedAt,
        roles: [
            ...data.assignedGlobalRoles.map(
                (assignedRole) => assignedRole.roleKey
            ),
            ...data.assignedOrgRoles.map(
                (assignedRole) => assignedRole.roleKey
            ),
        ],
    };
};

export const userService = new UserService();
