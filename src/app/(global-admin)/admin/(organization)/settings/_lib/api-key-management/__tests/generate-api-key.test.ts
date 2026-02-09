import { describe, it, expect, vi, beforeEach } from "vitest";
import { organizationAdminService } from "@/services/organizations/organization.admin.service";
import {
    mockAdminUser,
    createMockUserWithExtendedDetails,
} from "@/__tests__/mocks/mock-users";
import type { OrganizationExtended } from "@/dto/organizations";
import { getCurrentUserCached } from "@/services/users/user.service.cached";
import { refresh } from "next/cache";
import { generateApiKey } from "@/app/(global-admin)/admin/(organization)/settings/_lib/api-key-management/actions/generate-api-key";

vi.mock("@/services/organizations/organization.admin.service");
vi.mock("@/services/users/user.service.cached", () => ({
    getCurrentUserCached: vi.fn(),
}));

vi.mock("next/cache", () => ({
    revalidatePath: vi.fn(),
    refresh: vi.fn(),
}));
vi.mock("next/navigation", () => ({
    redirect: vi.fn(() => {
        throw new Error("redirect called");
    }),
}));

describe("generateApiKey", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    beforeEach(() => {
        vi.mocked(getCurrentUserCached).mockResolvedValue(mockAdminUser);
    });

    it("updates API key successfully", async () => {
        const mockOrg: OrganizationExtended = {
            orgId: "org-1",
            name: "Test Org",
            slug: "test-org",
            motorsportregOrgId: null,
            description: null,
            headerImageUrl: null,
            isPublic: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
            orgApiKeys: [],
        };
        vi.mocked(organizationAdminService.createApiKey).mockResolvedValue(
            mockOrg
        );

        await generateApiKey("org-1", { isEnabled: true });

        expect(organizationAdminService.createApiKey).toHaveBeenCalledWith(
            "org-1",
            true
        );
        expect(refresh).toHaveBeenCalled();
    });

    it("throws error when user is not admin", async () => {
        vi.mocked(getCurrentUserCached).mockResolvedValue(
            createMockUserWithExtendedDetails({ roles: [] })
        );

        await expect(
            generateApiKey("org-1", { isEnabled: true })
        ).rejects.toThrow("redirect called");
    });
});
