import { usersRepository } from "@/db/repositories/users.repo";
import { User, UserDTO } from "@/dto/users";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm/sql/expressions/conditions";

interface IUserService {
    getAllUsers(): Promise<User[]>;
    getCurrentUser(): Promise<User | null>;
    getUserById(userId: string): Promise<User | null>;
    updateUser(
        userId: string,
        data: { displayName?: string; roleKeys?: string[] }
    ): Promise<void>;
    getAllRoles(): Promise<Array<{ key: string; name: string }>>;
    deleteUser(userId: string): Promise<void>;
}

export class UserService implements IUserService {
    async getAllUsers() {
        return mapUsers(await usersRepository.findAll());
    }

    async getCurrentUser(): Promise<User | null> {
        const { userId } = await auth();

        if (userId === null) {
            return null;
        }

        const user = await usersRepository.findByAuthProviderId(userId);

        return user ? mapUser(user) : null;
    }

    async getUserById(userId: string): Promise<User | null> {
        const user = await usersRepository.findByUserId(userId);
        return user ? mapUser(user) : null;
    }

    async updateUser(
        userId: string,
        data: { displayName?: string; roleKeys?: string[] }
    ): Promise<void> {
        if (data.displayName !== undefined) {
            await db
                .update(users)
                .set({
                    displayName: data.displayName,
                    updatedAt: new Date(),
                })
                .where(eq(users.userId, userId));
        }

        if (data.roleKeys !== undefined) {
            await usersRepository.updateUserRoles(userId, data.roleKeys);
        }
    }

    async getAllRoles(): Promise<Array<{ key: string; name: string }>> {
        const roles = await db.query.roles.findMany({
            where: {
                isEnabled: true,
            },
        });

        return roles.map((r) => ({
            key: r.key,
            name: r.name,
        }));
    }

    async deleteUser(userId: string): Promise<void> {
        await usersRepository.delete(userId);
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
            ...data.assignedGlobalRoles
                .filter((assignedRole) => !assignedRole.isNegated)
                .map((assignedRole) => assignedRole.role.key),
            ...data.assignedOrgRoles
                .filter((assignedRole) => !assignedRole.isNegated)
                .map((assignedRole) => assignedRole.role.key),
        ],
    };
};

export const userService = new UserService();
