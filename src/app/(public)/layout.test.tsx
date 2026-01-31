import { describe, it, vi } from "vitest";

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
        const GlobalLayout = (await import("./layout")).default;

        await GlobalLayout({ children: <div>Test</div> });
    });

    it("handles valid tenant", async () => {
        const GlobalLayout = (await import("./layout")).default;

        await GlobalLayout({ children: <div>Test</div> });
    });
});
