import { describe, it, expect, vi, beforeEach } from "vitest";
import { userService } from "./user.service";
import { usersRepository } from "@/db/repositories/users.repo";
import type { UserDTO } from "@/dto/users";

// Mock Clerk
vi.mock("@clerk/nextjs/server", () => ({
    auth: vi.fn(),
    currentUser: vi.fn(),
}));

// Mock the repository
vi.mock("@/db/repositories/users.repo", () => ({
    usersRepository: {
        findAll: vi.fn(),
        findByAuthProviderId: vi.fn(),
        findById: vi.fn(),
    },
}));

describe("UserService", () => {
    const mockUserDTO: UserDTO = {
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

    describe("getAllUsers", () => {
        it("returns all users", async () => {
            vi.mocked(usersRepository.findAll).mockResolvedValue([mockUserDTO]);

            const result = await userService.getAllUsers();

            expect(result).toHaveLength(1);
            expect(result[0].userId).toBe("user-1");
            expect(usersRepository.findAll).toHaveBeenCalled();
        });

        it("maps users correctly with roles", async () => {
            const userWithRoles: UserDTO = {
                ...mockUserDTO,
                assignedGlobalRoles: [
                    {
                        userId: "user-1",
                        roleId: "role-1",
                        effectiveAt: new Date(),
                        isNegated: false,
                        role: {
                            roleId: "role-1",
                            key: "admin",
                            name: "Admin",
                            effectiveAt: new Date(),
                            isEnabled: true,
                        },
                    },
                ],
            };
            vi.mocked(usersRepository.findAll).mockResolvedValue([
                userWithRoles,
            ]);

            const result = await userService.getAllUsers();

            expect(result[0].roles).toContain("admin");
        });

        it("filters out negated roles", async () => {
            const userWithNegatedRole: UserDTO = {
                ...mockUserDTO,
                assignedGlobalRoles: [
                    {
                        userId: "user-1",
                        roleId: "role-1",
                        effectiveAt: new Date(),
                        isNegated: true,
                        role: {
                            roleId: "role-1",
                            key: "admin",
                            name: "Admin",
                            effectiveAt: new Date(),
                            isEnabled: true,
                        },
                    },
                ],
            };
            vi.mocked(usersRepository.findAll).mockResolvedValue([
                userWithNegatedRole,
            ]);

            const result = await userService.getAllUsers();

            expect(result[0].roles).not.toContain("admin");
        });

        it("includes org roles in mapped user", async () => {
            const userWithOrgRoles: UserDTO = {
                ...mockUserDTO,
                assignedOrgRoles: [
                    {
                        userId: "user-1",
                        orgId: "org-1",
                        roleId: "role-1",
                        effectiveAt: new Date(),
                        isNegated: false,
                        role: {
                            roleId: "role-1",
                            key: "org_admin",
                            name: "Org Admin",
                            effectiveAt: new Date(),
                            isEnabled: true,
                        },
                    },
                ],
            };
            vi.mocked(usersRepository.findAll).mockResolvedValue([
                userWithOrgRoles,
            ]);

            const result = await userService.getAllUsers();

            expect(result[0].roles).toContain("org_admin");
        });

        it("filters out negated org roles", async () => {
            const userWithNegatedOrgRole: UserDTO = {
                ...mockUserDTO,
                assignedOrgRoles: [
                    {
                        userId: "user-1",
                        orgId: "org-1",
                        roleId: "role-1",
                        effectiveAt: new Date(),
                        isNegated: true,
                        role: {
                            roleId: "role-1",
                            key: "org_admin",
                            name: "Org Admin",
                            effectiveAt: new Date(),
                            isEnabled: true,
                        },
                    },
                ],
            };
            vi.mocked(usersRepository.findAll).mockResolvedValue([
                userWithNegatedOrgRole,
            ]);

            const result = await userService.getAllUsers();

            expect(result[0].roles).not.toContain("org_admin");
        });
    });

    describe("getCurrentUser", () => {
        it("returns user when authenticated", async () => {
            const { auth, currentUser } = await import("@clerk/nextjs/server");
            vi.mocked(auth).mockResolvedValue({
                userId: "auth-123",
            } as unknown as Awaited<ReturnType<typeof auth>>);
            vi.mocked(currentUser).mockResolvedValue({
                id: "auth-123",
            } as unknown as Awaited<ReturnType<typeof currentUser>>);
            vi.mocked(usersRepository.findByAuthProviderId).mockResolvedValue(
                mockUserDTO
            );

            const result = await userService.getCurrentUser();

            expect(result).not.toBeNull();
            expect(result?.userId).toBe("user-1");
        });

        it("returns null when not authenticated", async () => {
            const { auth, currentUser } = await import("@clerk/nextjs/server");
            vi.mocked(auth).mockResolvedValue({
                userId: null,
            } as unknown as Awaited<ReturnType<typeof auth>>);
            vi.mocked(currentUser).mockResolvedValue(null);

            const result = await userService.getCurrentUser();

            expect(result).toBeNull();
        });

        it("returns null when user not found in database", async () => {
            const { auth, currentUser } = await import("@clerk/nextjs/server");
            vi.mocked(auth).mockResolvedValue({
                userId: "auth-123",
            } as unknown as Awaited<ReturnType<typeof auth>>);
            vi.mocked(currentUser).mockResolvedValue({
                id: "auth-123",
            } as unknown as Awaited<ReturnType<typeof currentUser>>);
            vi.mocked(usersRepository.findByAuthProviderId).mockResolvedValue(
                null
            );

            const result = await userService.getCurrentUser();

            expect(result).toBeNull();
        });
    });
});
