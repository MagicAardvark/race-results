import { usersRepository } from "@/db/repositories/users.repo";
import { User, UserDTO } from "@/dto/users";
import { auth, currentUser } from "@clerk/nextjs/server";

interface IUserService {
    getAllUsers(): Promise<User[]>;
    getCurrentUser(): Promise<User | null>;
}

export class UserService implements IUserService {
    async getAllUsers() {
        return mapUsers(await usersRepository.findAll());
    }

    async getCurrentUser(): Promise<User | null> {
        const { userId } = await auth();
        const currUser = await currentUser();

        if (userId === null || currUser === null) {
            return null;
        }

        const user = await usersRepository.findByAuthProviderId(userId);

        return user ? mapUser(user) : null;
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
