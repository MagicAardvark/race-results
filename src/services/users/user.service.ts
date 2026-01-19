import { usersRepository } from "@/db/repositories/users.repo";
import { User, UserDTO } from "@/dto/users";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import { ROLES } from "@/constants/global";

interface IUserService {
    getAllUsers(): Promise<User[]>;
    getCurrentUser(): Promise<User | null>;
    getUserById(userId: string): Promise<User | null>;
    updateUser(userId: string, data: { displayName?: string }): Promise<void>;
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
        data: { displayName?: string }
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
    }

    async updateUserGlobalRoles(userId: string, roleKeys: string[]) {
        if (roleKeys.length === 0) {
            throw new Error("At least one role must be assigned to the user.");
        }

        if (!roleKeys.includes(ROLES.user)) {
            throw new Error("The 'user' role must be assigned to the user.");
        }

        await usersRepository.updateUserRoles(userId, roleKeys);
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
