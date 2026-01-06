import { describe, it, expect, vi } from "vitest";
import { organizationAdminService } from "@/services/organizations/organization.admin.service";
import { featureFlagsService } from "@/services/feature-flags/feature-flags.service";

// Mock dependencies
vi.mock("@/services/organizations/organization.admin.service", () => ({
    organizationAdminService: {
        findBySlug: vi.fn(),
    },
}));

vi.mock("@/services/feature-flags/feature-flags.service", () => ({
    featureFlagsService: {
        getOrgFeatureFlags: vi.fn(),
    },
}));

vi.mock(
    "@/app/(global-admin)/admin/organizations/_lib/components/update-org-form",
    () => ({
        UpdateOrgForm: () => <div data-testid="update-org-form" />,
    })
);

vi.mock(
    "@/app/(global-admin)/admin/organizations/_lib/components/api-key-management/api-key-management",
    () => ({
        ApiKeyManagement: () => <div data-testid="api-key-management" />,
    })
);

describe("OrganizationSlugPage", () => {
    it("calls organizationAdminService.findBySlug", async () => {
        vi.mocked(organizationAdminService.findBySlug).mockResolvedValue(null);

        const Page = (await import("./page")).default;

        await Page({ params: Promise.resolve({ slug: "test-org" }) });

        expect(organizationAdminService.findBySlug).toHaveBeenCalledWith(
            "test-org"
        );
    });

    it("handles organization not found", async () => {
        vi.mocked(organizationAdminService.findBySlug).mockResolvedValue(null);

        const Page = (await import("./page")).default;

        const result = await Page({
            params: Promise.resolve({ slug: "non-existent" }),
        });

        expect(organizationAdminService.findBySlug).toHaveBeenCalled();
        // Should render empty state
        expect(result).toBeDefined();
    });

    it("handles organization found", async () => {
        const mockOrg = {
            orgId: "org-123",
            name: "Test Org",
            slug: "test-org",
            motorsportregOrgId: null,
            description: null,
            isPublic: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
            orgApiKeys: [],
        };

        vi.mocked(organizationAdminService.findBySlug).mockResolvedValue(
            mockOrg
        );
        vi.mocked(featureFlagsService.getOrgFeatureFlags).mockResolvedValue({});

        const Page = (await import("./page")).default;

        await Page({ params: Promise.resolve({ slug: "test-org" }) });

        expect(organizationAdminService.findBySlug).toHaveBeenCalled();
        expect(featureFlagsService.getOrgFeatureFlags).toHaveBeenCalledWith(
            "org-123"
        );
    });
});
