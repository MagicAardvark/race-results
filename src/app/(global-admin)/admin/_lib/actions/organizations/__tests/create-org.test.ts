import { describe, it, expect, vi } from "vitest";

import { organizationAdminService } from "@/services/organizations/organization.admin.service";
import { revalidatePath } from "next/cache";
import { createOrganization } from "@/app/(global-admin)/admin/_lib/actions/organizations/create-org";
import { beforeEach } from "node:test";
import { ROLES } from "@/constants/global";
import { requireRole } from "@/lib/auth/require-role";
import { mockAdminUser } from "@/__tests__/mocks/mock-users";
import { getCurrentUserCached } from "@/services/users/user.service.cached";

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

describe("createOrganization", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(getCurrentUserCached).mockResolvedValue(mockAdminUser);
        vi.mocked(requireRole).mockResolvedValue({} as never);
    });

    it("creates organization successfully", async () => {
        vi.mocked(
            organizationAdminService.createOrganization
        ).mockResolvedValue("test-org");

        const name = "Test Organization";

        const result = await createOrganization(name);

        expect(requireRole).toHaveBeenCalledWith(ROLES.admin);
        expect(
            organizationAdminService.createOrganization
        ).toHaveBeenCalledWith({
            name: "Test Organization",
        });
        expect(result.isError).toBe(false);
        expect(revalidatePath).toHaveBeenCalledWith("/admin");
    });

    it("returns error when name is empty", async () => {
        const name = "";

        const result = await createOrganization(name);

        expect(result.isError).toBe(true);
    });

    it("returns error when service throws", async () => {
        vi.mocked(
            organizationAdminService.createOrganization
        ).mockRejectedValue(new Error("Service error"));

        const name = "Test Organization";

        const result = await createOrganization(name);

        expect(result.isError).toBe(true);

        if (result.isError) {
            expect(result.errors).toBe("Service error");
        }
    });

    it("returns error when slug is null", async () => {
        vi.mocked(
            organizationAdminService.createOrganization
        ).mockResolvedValue(null as unknown as string);

        const name = "Test Organization";

        const result = await createOrganization(name);

        expect(result.isError).toBe(true);

        if (result.isError) {
            expect(result.errors).toBe(
                "Organization could not be found after save"
            );
        }
    });
});
