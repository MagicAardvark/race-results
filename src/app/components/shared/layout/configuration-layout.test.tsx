import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import { ConfigurationLayout } from "./configuration-layout";
import { tenantService } from "@/services/tenants/tenant.service";
import type { NavGroup } from "@/lib/shared/layout/configuration/navigation";
import { createMockValidTenant } from "@/__tests__/mocks/mock-tenants";

vi.mock("@/services/tenants/tenant.service");
vi.mock("./app-header", () => ({
    AppHeader: ({ sidebarTrigger }: { sidebarTrigger?: React.ReactNode }) => (
        <header data-testid="app-header">
            {sidebarTrigger}
            <div>Race Results</div>
        </header>
    ),
}));
vi.mock("./sidebar-navigation", () => ({
    SidebarNavigation: ({ navItems }: { navItems: NavGroup[] }) => (
        <nav data-testid="sidebar-navigation">
            {navItems.map((group) => (
                <div key={group.name}>{group.name}</div>
            ))}
        </nav>
    ),
}));
vi.mock("@/ui/sidebar", () => ({
    SidebarProvider: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="sidebar-provider">{children}</div>
    ),
    SidebarInset: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="sidebar-inset">{children}</div>
    ),
    SidebarTrigger: () => <button data-testid="sidebar-trigger">Menu</button>,
}));

describe("ConfigurationLayout", () => {
    const mockNavData: NavGroup[] = [
        {
            name: "Admin",
            items: [
                {
                    href: "/admin/organizations",
                    text: "Organizations",
                    roles: [],
                },
            ],
        },
    ];

    const mockTenant = createMockValidTenant({
        orgId: "org-1",
        name: "Test Org",
        slug: "test-org",
    });

    beforeEach(() => {
        vi.mocked(tenantService.getTenant).mockResolvedValue(mockTenant);
    });

    it("renders layout with header and sidebar", async () => {
        const Layout = await ConfigurationLayout({
            navigationData: mockNavData,
            children: <div>Test Content</div>,
        });

        render(Layout);

        expect(screen.getByTestId("app-header")).toBeVisible();
        expect(screen.getByTestId("sidebar-navigation")).toBeVisible();
        expect(screen.getByText("Test Content")).toBeVisible();
    });

    it("renders sidebar trigger in header", async () => {
        const Layout = await ConfigurationLayout({
            navigationData: mockNavData,
            children: <div>Test</div>,
        });

        render(Layout);

        expect(screen.getByTestId("sidebar-trigger")).toBeVisible();
    });

    it("renders navigation items", async () => {
        const Layout = await ConfigurationLayout({
            navigationData: mockNavData,
            children: <div>Test</div>,
        });

        render(Layout);

        expect(screen.getByText("Admin")).toBeVisible();
    });

    it("renders children in main content area", async () => {
        const Layout = await ConfigurationLayout({
            navigationData: mockNavData,
            children: <div data-testid="main-content">Main Content</div>,
        });

        render(Layout);

        expect(screen.getByTestId("main-content")).toBeVisible();
        expect(screen.getByText("Main Content")).toBeVisible();
    });
});
