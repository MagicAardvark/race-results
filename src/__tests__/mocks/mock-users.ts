import type { User } from "@/dto/users";

/**
 * Reusable mock user data for testing
 */

export const mockUser: User = {
    userId: "user-123",
    authProviderId: "clerk-123",
    displayName: "Test User",
    roles: ["user"],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    deletedAt: null,
};

export const mockAdminUser: User = {
    ...mockUser,
    userId: "admin-123",
    displayName: "Admin User",
    roles: ["admin"],
};

/**
 * Helper function to create a custom user
 */
export function createMockUser(overrides?: Partial<User>): User {
    return {
        ...mockUser,
        ...overrides,
    };
}
