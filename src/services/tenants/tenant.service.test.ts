import { describe, it, expect, vi, beforeEach } from "vitest";
import { tenantService } from "./tenant.service";
import { organizationService } from "@/services/organizations/organization.service";
import type { Organization } from "@/dto/organizations";

// Mock Next.js headers
vi.mock("next/headers", () => ({
    headers: vi.fn(),
}));

// Mock organization service
vi.mock("@/services/organizations/organization.service", () => ({
    organizationService: {
        getOrganizationBySlug: vi.fn(),
    },
}));

vi.mock("next/navigation", () => ({
    redirect: vi.fn(() => {
        throw new Error("NEXT_REDIRECT");
    }),
}));

describe("TenantService", () => {
    const mockOrg: Organization = {
        orgId: "org-1",
        name: "Test Organization",
        slug: "test-org",
        motorsportregOrgId: "msr-123",
        description: "Test description",
        headerImageUrl: null,
        isPublic: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
        deletedAt: null,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("getTenant", () => {
        it("redirects when no slug header", async () => {
            const { headers } = await import("next/headers");
            vi.mocked(headers).mockResolvedValue({
                get: vi.fn().mockReturnValue(null),
            } as unknown as Headers);

            await expect(tenantService.getTenant()).rejects.toThrow(
                "NEXT_REDIRECT"
            );
        });

        it("returns matching org when tenant slug exists", async () => {
            const { headers } = await import("next/headers");
            vi.mocked(headers).mockResolvedValue({
                get: vi.fn().mockReturnValue("test-org"),
            } as unknown as Headers);
            vi.mocked(
                organizationService.getOrganizationBySlug
            ).mockResolvedValue(mockOrg);

            const result = await tenantService.getTenant();

            expect(result.slug).toBe("test-org");
            expect(result.name).toBe("Test Organization");
        });

        it("redirects when no org found", async () => {
            const { headers } = await import("next/headers");
            vi.mocked(headers).mockResolvedValue({
                get: vi.fn().mockReturnValue("non-existent"),
            } as unknown as Headers);
            // Service checks for undefined, not null
            vi.mocked(
                organizationService.getOrganizationBySlug
            ).mockResolvedValue(null);

            await expect(tenantService.getTenant()).rejects.toThrow(
                "NEXT_REDIRECT"
            );
        });
    });

    describe("isValidTenant", () => {
        it("returns true when organization exists", async () => {
            vi.mocked(
                organizationService.getOrganizationBySlug
            ).mockResolvedValue(mockOrg);

            const result = await tenantService.isValidTenant("test-org");

            expect(result).toBe(true);
            expect(
                organizationService.getOrganizationBySlug
            ).toHaveBeenCalledWith("test-org");
        });

        it("returns false when organization not found", async () => {
            vi.mocked(
                organizationService.getOrganizationBySlug
            ).mockResolvedValue(null);

            const result = await tenantService.isValidTenant("non-existent");

            expect(result).toBe(false);
        });
    });
});
