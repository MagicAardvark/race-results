import type { ValidTenant, InvalidTenant, Tenant } from "@/dto/tenants";
import type { Organization } from "@/dto/organizations";

/**
 * Reusable mock tenant data for testing
 */

export const mockValidTenant: ValidTenant = {
    isValid: true,
    org: {
        orgId: "org-123",
        name: "Test Org",
        slug: "test-org",
        motorsportregOrgId: null,
        description: null,
        isPublic: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        deletedAt: null,
    },
};

export const mockInvalidTenant: InvalidTenant = {
    isValid: false,
};

/**
 * Helper function to create a custom valid tenant
 */
export function createMockValidTenant(
    overrides?: Partial<Organization>
): ValidTenant {
    return {
        isValid: true,
        org: {
            ...mockValidTenant.org,
            ...overrides,
        },
    };
}

/**
 * Helper function to create a custom tenant (any type)
 */
export function createMockTenant(
    overrides?: Partial<ValidTenant> | { isValid: false }
): Tenant {
    if (overrides && "isValid" in overrides && overrides.isValid === false) {
        return mockInvalidTenant;
    }

    const validOverrides = overrides as Partial<ValidTenant> | undefined;
    return createMockValidTenant(validOverrides?.org);
}
