import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    createOrganization,
    updateOrganization,
    updateApiKey,
} from "./organization.actions";
import { organizationAdminService } from "@/services/organizations/organization.admin.service";
import {
    mockAdminUser,
    createMockUserWithExtendedDetails,
} from "@/__tests__/mocks/mock-users";
import { revalidatePath, refresh } from "next/cache";
import { redirect } from "next/navigation";
import type { OrganizationExtended } from "@/dto/organizations";
import { getCurrentUserCached } from "@/services/users/user.service.cached";

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

describe("organization.actions", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("createOrganization", () => {
        it("creates organization successfully", async () => {
            vi.mocked(
                organizationAdminService.createOrganization
            ).mockResolvedValue("test-org");

            const formData = new FormData();
            formData.append("name", "Test Organization");

            await expect(
                createOrganization({ isError: false, message: "" }, formData)
            ).rejects.toThrow("redirect called");

            expect(
                organizationAdminService.createOrganization
            ).toHaveBeenCalledWith({
                name: "Test Organization",
            });
            expect(revalidatePath).toHaveBeenCalledWith(
                "/admin/organizations/"
            );
            expect(redirect).toHaveBeenCalledWith(
                "/admin/organizations/test-org"
            );
        });

        it("returns error when name is empty", async () => {
            const formData = new FormData();

            const result = await createOrganization(
                { isError: false, message: "" },
                formData
            );

            expect(result.isError).toBe(true);
            expect(result.message).toBe("Name cannot be empty");
            expect(
                organizationAdminService.createOrganization
            ).not.toHaveBeenCalled();
        });

        it("returns error when service throws", async () => {
            vi.mocked(
                organizationAdminService.createOrganization
            ).mockRejectedValue(new Error("Service error"));

            const formData = new FormData();
            formData.append("name", "Test Organization");

            const result = await createOrganization(
                { isError: false, message: "" },
                formData
            );

            expect(result.isError).toBe(true);
            expect(result.message).toBe("Service error");
        });

        it("returns error when slug is null", async () => {
            vi.mocked(
                organizationAdminService.createOrganization
            ).mockResolvedValue(null as unknown as string);

            const formData = new FormData();
            formData.append("name", "Test Organization");

            const result = await createOrganization(
                { isError: false, message: "" },
                formData
            );

            expect(result.isError).toBe(true);
            expect(result.message).toBe(
                "Organization could not be found after save"
            );
        });
    });

    describe("updateOrganization", () => {
        beforeEach(() => {
            vi.mocked(getCurrentUserCached).mockResolvedValue(mockAdminUser);
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
            expect(revalidatePath).toHaveBeenCalledWith(
                "/admin/organizations/"
            );
            expect(redirect).toHaveBeenCalledWith(
                "/admin/organizations/test-org?saved=true"
            );
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

    describe("updateApiKey", () => {
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
                isPublic: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
                orgApiKeys: [],
            };
            vi.mocked(organizationAdminService.createApiKey).mockResolvedValue(
                mockOrg
            );

            await updateApiKey("org-1", { isEnabled: true });

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
                updateApiKey("org-1", { isEnabled: true })
            ).rejects.toThrow("redirect called");
        });
    });
});
