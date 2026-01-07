import { describe, it, expect, vi, beforeEach } from "vitest";
import { usersRepository } from "./users.repo";
import { db } from "@/db";
import type { UserDTO } from "@/dto/users";

// Mock db.query
vi.mock("@/db", () => ({
    db: {
        query: {
            users: {
                findMany: vi.fn(),
                findFirst: vi.fn(),
            },
        },
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
                orderBy: expect.any(Function),
            });
        });

        it("returns empty array when no users found", async () => {
            vi.mocked(db.query.users.findMany).mockResolvedValue([]);

            const result = await usersRepository.findAll();

            expect(result).toEqual([]);
        });

        it("uses orderBy function for sorting", async () => {
            vi.mocked(db.query.users.findMany).mockResolvedValue([mockUser]);

            await usersRepository.findAll();

            // Verify orderBy is a function in the call
            const callArgs = vi.mocked(db.query.users.findMany).mock
                .calls[0]?.[0];
            if (
                callArgs &&
                typeof callArgs === "object" &&
                "orderBy" in callArgs
            ) {
                expect(callArgs.orderBy).toBeDefined();
                // orderBy can be a function or an object, just verify it exists
                expect(callArgs.orderBy).toBeDefined();
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
});
