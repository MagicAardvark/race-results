import { describe, it, expect, vi } from "vitest";

import { organizationAdminService } from "@/services/organizations/organization.admin.service";
import { revalidatePath } from "next/cache";
import { createOrganization } from "@/app/(global-admin)/admin/_lib/actions/organizations/create-org";
import { beforeEach } from "node:test";

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

describe("createOrganization", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("creates organization successfully", async () => {
        vi.mocked(
            organizationAdminService.createOrganization
        ).mockResolvedValue("test-org");

        const name = "Test Organization";

        const result = await createOrganization(name);

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

        // if (result.isError) {
        //     expect(result.errors).toBe("Name cannot be empty");
        //     expect(
        //         organizationAdminService.createOrganization
        //     ).not.toHaveBeenCalled();
        // }
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
