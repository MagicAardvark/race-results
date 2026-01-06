import { describe, it, expect, vi, beforeEach } from "vitest";
import { requireValidTenant } from "./tenant-guard";
import { tenantService } from "@/services/tenants/tenant.service";
import { redirect } from "next/navigation";
import {
    mockValidTenant,
    mockGlobalTenant,
    mockInvalidTenant,
} from "@/__tests__/mocks/mock-tenants";

vi.mock("@/services/tenants/tenant.service");
vi.mock("next/navigation", () => ({
    redirect: vi.fn(),
}));

describe("requireValidTenant", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns tenant when valid and not global", async () => {
        const mockTenant = mockValidTenant;

        vi.mocked(tenantService.getTenant).mockResolvedValue(mockTenant);

        const result = await requireValidTenant();

        expect(result).toEqual(mockTenant);
        expect(redirect).not.toHaveBeenCalled();
    });

    it("redirects when tenant is invalid", async () => {
        const mockTenant = mockInvalidTenant;

        vi.mocked(tenantService.getTenant).mockResolvedValue(mockTenant);

        await requireValidTenant();

        expect(redirect).toHaveBeenCalledWith("/");
    });

    it("redirects when tenant is global", async () => {
        const mockTenant = mockGlobalTenant;

        vi.mocked(tenantService.getTenant).mockResolvedValue(mockTenant);

        await requireValidTenant();

        expect(redirect).toHaveBeenCalledWith("/");
    });

    it("redirects when both invalid and global", async () => {
        const mockTenant = mockInvalidTenant;

        vi.mocked(tenantService.getTenant).mockResolvedValue(mockTenant);

        await requireValidTenant();

        expect(redirect).toHaveBeenCalledWith("/");
    });
});
