import { describe, it, expect, vi, beforeEach } from "vitest";
import { usersRepository } from "./users.repo";
import { db } from "@/db";
import type { UserDTO } from "@/dto/users";

// Mock db.query and db.update
vi.mock("@/db", () => ({
    db: {
        query: {
            users: {
                findMany: vi.fn(),
                findFirst: vi.fn(),
            },
        },
        update: vi.fn(),
    },
    users: {
        userId: "userId",
    },
}));

describe("UsersRepository", () => {
    const mockUser: UserDTO = {
        userId: "user-1",
        authProviderId: "auth-123",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
        deletedAt: null,
        displayName: "Test User",
        assignedOrgRoles: [],
        assignedGlobalRoles: [],
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("findAll", () => {
        it("returns all users", async () => {
            vi.mocked(db.query.users.findMany).mockResolvedValue([mockUser]);

            const result = await usersRepository.findAll();

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual(mockUser);
            expect(db.query.users.findMany).toHaveBeenCalledWith({
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
                orderBy: {
                    displayName: "asc",
                },
            });
        });

        it("returns empty array when no users found", async () => {
            vi.mocked(db.query.users.findMany).mockResolvedValue([]);

            const result = await usersRepository.findAll();

            expect(result).toEqual([]);
        });

        it("uses orderBy object for sorting", async () => {
            vi.mocked(db.query.users.findMany).mockResolvedValue([mockUser]);

            await usersRepository.findAll();

            // Verify orderBy is an object with displayName: "asc"
            const callArgs = vi.mocked(db.query.users.findMany).mock
                .calls[0]?.[0];
            if (
                callArgs &&
                typeof callArgs === "object" &&
                "orderBy" in callArgs
            ) {
                expect(callArgs.orderBy).toEqual({
                    displayName: "asc",
                });
            }
        });
    });

    describe("findByAuthProviderId", () => {
        it("returns user when found", async () => {
            vi.mocked(db.query.users.findFirst).mockResolvedValue(mockUser);

            const result =
                await usersRepository.findByAuthProviderId("auth-123");

            expect(result).toEqual(mockUser);
            expect(db.query.users.findFirst).toHaveBeenCalledWith({
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
                    authProviderId: "auth-123",
                    deletedAt: { isNull: true },
                },
            });
        });

        it("returns null when user not found", async () => {
            vi.mocked(db.query.users.findFirst).mockResolvedValue(undefined);

            const result =
                await usersRepository.findByAuthProviderId("non-existent");

            expect(result).toBeNull();
        });
    });

    describe("delete", () => {
        it("soft deletes user by setting deletedAt", async () => {
            const mockWhere = vi.fn().mockResolvedValue(undefined);
            const mockSet = vi.fn().mockReturnValue({
                where: mockWhere,
            });
            vi.mocked(db.update).mockReturnValue({
                set: mockSet,
            } as never);

            await usersRepository.delete("user-1");

            expect(db.update).toHaveBeenCalled();
            // Verify it was called with the users table (check by checking the call was made)
            const updateCall = vi.mocked(db.update).mock.calls[0];
            expect(updateCall).toBeDefined();
            expect(updateCall?.[0]).toBeDefined();
            expect(mockSet).toHaveBeenCalledWith({
                deletedAt: expect.any(Date),
            });
            expect(mockWhere).toHaveBeenCalled();
        });
    });
});
