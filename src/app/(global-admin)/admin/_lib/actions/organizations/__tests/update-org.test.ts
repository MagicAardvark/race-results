import { describe, it, expect, vi, beforeEach } from "vitest";
import { organizationAdminService } from "@/services/organizations/organization.admin.service";
import {
    mockAdminUser,
    createMockUserWithExtendedDetails,
} from "@/__tests__/mocks/mock-users";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUserCached } from "@/services/users/user.service.cached";
import { updateOrganization } from "@/app/(global-admin)/admin/_lib/actions/organizations/update-org";
import { requireRole } from "@/lib/auth/require-role";
import { ROLES } from "@/constants/global";

vi.mock("@/services/organizations/organization.admin.service");
vi.mock("@/services/users/user.service.cached", () => ({
    getCurrentUserCached: vi.fn(),
}));

vi.mock("@/lib/auth/require-role");

vi.mock("next/cache", () => ({
    revalidatePath: vi.fn(),
    refresh: vi.fn(),
}));
vi.mock("next/navigation", () => ({
    redirect: vi.fn(() => {
        throw new Error("redirect called");
    }),
}));

describe("updateOrganization", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(getCurrentUserCached).mockResolvedValue(mockAdminUser);
        vi.mocked(requireRole).mockResolvedValue({} as never);
    });

    it("updates organization successfully", async () => {
        vi.mocked(
            organizationAdminService.updateOrganization
        ).mockResolvedValue("test-org");

        const formData = new FormData();
        formData.append("orgId", "org-1");
        formData.append("name", "Updated Name");
        formData.append("isPublic", "on");

        await expect(
            updateOrganization({ isError: false, message: "" }, formData)
        ).rejects.toThrow("redirect called");

        expect(requireRole).toHaveBeenCalledWith(ROLES.admin);
        expect(
            organizationAdminService.updateOrganization
        ).toHaveBeenCalledWith({
            orgId: "org-1",
            name: "Updated Name",
            motorsportregOrgId: null,
            description: null,
            isPublic: true,
            featureFlags: undefined,
        });
        expect(revalidatePath).toHaveBeenCalledWith("/admin");
        expect(redirect).toHaveBeenCalledWith("/admin/?saved=true");
    });

    it("handles feature flags", async () => {
        vi.mocked(
            organizationAdminService.updateOrganization
        ).mockResolvedValue("test-org");

        const formData = new FormData();
        formData.append("orgId", "org-1");
        formData.append("name", "Test Org");
        formData.append("feature.liveTiming.paxEnabled", "on");
        formData.append("feature.liveTiming.workRunEnabled", "on");

        await expect(
            updateOrganization({ isError: false, message: "" }, formData)
        ).rejects.toThrow("redirect called");

        expect(
            organizationAdminService.updateOrganization
        ).toHaveBeenCalledWith(
            expect.objectContaining({
                featureFlags: {
                    "feature.liveTiming.paxEnabled": true,
                    "feature.liveTiming.workRunEnabled": true,
                },
            })
        );
    });

    it("returns error when orgId is missing", async () => {
        const formData = new FormData();
        formData.append("name", "Test Org");

        const result = await updateOrganization(
            { isError: false, message: "" },
            formData
        );

        expect(result.isError).toBe(true);
        expect(result.message).toBe("Organization ID is required");
    });

    it("returns error when name is empty", async () => {
        const formData = new FormData();
        formData.append("orgId", "org-1");

        const result = await updateOrganization(
            { isError: false, message: "" },
            formData
        );

        expect(result.isError).toBe(true);
        expect(result.message).toBe("Name cannot be empty");
    });

    it("throws error when user is not admin", async () => {
        vi.mocked(getCurrentUserCached).mockResolvedValue(
            createMockUserWithExtendedDetails({ roles: [] })
        );

        const formData = new FormData();
        formData.append("orgId", "org-1");
        formData.append("name", "Test Org");

        await expect(
            updateOrganization({ isError: false, message: "" }, formData)
        ).rejects.toThrow("redirect called");
    });
});
