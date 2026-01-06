import { describe, it, expect, vi } from "vitest";
import { organizationAdminService } from "@/services/organizations/organization.admin.service";

// Mock dependencies
vi.mock("@/services/organizations/organization.admin.service", () => ({
    organizationAdminService: {
        getAll: vi.fn(),
    },
}));

vi.mock(
    "@/app/(global-admin)/admin/organizations/_lib/components/create-org-dialog",
    () => ({
        CreateOrgDialog: () => <div data-testid="create-org-dialog" />,
    })
);

vi.mock(
    "@/app/(global-admin)/admin/organizations/_lib/components/organization-entry",
    () => ({
        OrganizationEntry: () => <div data-testid="organization-entry" />,
    })
);

describe("OrganizationsPage", () => {
    it("calls organizationAdminService.getAll", async () => {
        vi.mocked(organizationAdminService.getAll).mockResolvedValue([]);

        const Page = (await import("./page")).default;

        await Page();

        expect(organizationAdminService.getAll).toHaveBeenCalled();
    });

    it("handles empty organizations list", async () => {
        vi.mocked(organizationAdminService.getAll).mockResolvedValue([]);

        const Page = (await import("./page")).default;

        await Page();

        expect(organizationAdminService.getAll).toHaveBeenCalled();
    });

    it("handles organizations list", async () => {
        const mockOrgs = [
            {
                orgId: "org-1",
                name: "Org 1",
                slug: "org-1",
                motorsportregOrgId: null,
                description: null,
                isPublic: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
                orgApiKeys: [],
            },
        ];

        vi.mocked(organizationAdminService.getAll).mockResolvedValue(mockOrgs);

        const Page = (await import("./page")).default;

        await Page();

        expect(organizationAdminService.getAll).toHaveBeenCalled();
    });
});
