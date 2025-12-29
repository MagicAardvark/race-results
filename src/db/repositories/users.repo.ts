import { UserDTO } from "@/dto/users";
import { db } from "@/db";

interface IUserRepository {
    findAll(): Promise<UserDTO[]>;
    findByAuthProviderId(authProviderId: string): Promise<UserDTO | null>;
}

export class UsersRepository implements IUserRepository {
    async findAll(): Promise<UserDTO[]> {
        return db.query.users.findMany({
            with: {
                assignedGlobalRoles: {
                    with: {
                        role: true,
                    },
                },
                assignedOrgRoles: {
                    with: {
                        role: true,
                    },
                },
            },
            orderBy: (users, { asc }) => [asc(users.displayName)],
        });
    }

    async findByAuthProviderId(
        authProviderId: string
    ): Promise<UserDTO | null> {
        const dbUser = await db.query.users.findFirst({
            with: {
                assignedGlobalRoles: {
                    with: {
                        role: true,
                    },
                },
                assignedOrgRoles: {
                    with: {
                        role: true,
                    },
                },
            },
            where: {
                authProviderId: authProviderId,
                deletedAt: { isNull: true },
            },
        });

        return dbUser ?? null;
    }
}

export const usersRepository = new UsersRepository();
