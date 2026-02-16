import type { User, UserWithExtendedDetails } from "@/dto/users";
import { defaultOrg } from "../test-utils";

/**
 * Reusable mock user data for testing.
 * Uses defaultOrg from test-utils as the canonical org shape for user.orgs.
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

export const mockUserWithExtendedDetails: UserWithExtendedDetails = {
    ...mockUser,
    orgs: [
        {
            org: {
                ...defaultOrg,
            },
            roles: [
                {
                    roleId: "role-123",
                    key: "user",
                    name: "User",
                },
            ],
        },
    ],
};

export const mockAdminUser: UserWithExtendedDetails = {
    ...mockUser,
    userId: "admin-123",
    displayName: "Admin User",
    roles: ["admin"],
    orgs: [
        {
            org: {
                ...defaultOrg,
            },
            roles: [
                {
                    roleId: "role-123",
                    key: "user",
                    name: "User",
                },
                {
                    roleId: "role-124",
                    key: "admin",
                    name: "Admin",
                },
            ],
        },
    ],
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

export function createMockUserWithExtendedDetails(
    overrides?: Partial<UserWithExtendedDetails>
): UserWithExtendedDetails {
    return {
        ...mockUserWithExtendedDetails,
        ...overrides,
    };
}
