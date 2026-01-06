import { describe, it, expect, vi } from "vitest";
import { tenantService } from "@/services/tenants/tenant.service";
import {
    mockValidTenant,
    mockGlobalTenant,
} from "@/__tests__/mocks/mock-tenants";

// Mock dependencies
vi.mock("@/services/tenants/tenant.service", () => ({
    tenantService: {
        getTenant: vi.fn(),
    },
}));

vi.mock("@/context/TenantContext", () => ({
    TenantProvider: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="tenant-provider">{children}</div>
    ),
}));

vi.mock("@/app/components/shared/layout/app-header", () => ({
    AppHeader: () => <div data-testid="app-header" />,
}));

vi.mock("@/app/components/shared/layout/app-footer", () => ({
    AppFooter: () => <div data-testid="app-footer" />,
}));

describe("GlobalLayout", () => {
    it("calls tenantService.getTenant", async () => {
        const mockTenant = mockGlobalTenant;

        vi.mocked(tenantService.getTenant).mockResolvedValue(mockTenant);

        const GlobalLayout = (await import("./layout")).default;

        await GlobalLayout({ children: <div>Test</div> });

        expect(tenantService.getTenant).toHaveBeenCalled();
    });

    it("handles valid tenant", async () => {
        const mockTenant = mockValidTenant;

        vi.mocked(tenantService.getTenant).mockResolvedValue(mockTenant);

        const GlobalLayout = (await import("./layout")).default;

        await GlobalLayout({ children: <div>Test</div> });

        expect(tenantService.getTenant).toHaveBeenCalled();
    });
});
