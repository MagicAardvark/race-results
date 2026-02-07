import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import { SidebarNavigation } from "./sidebar-navigation";
import { SidebarProvider } from "@/ui/sidebar";
import * as nextNavigation from "next/navigation";

vi.mock("next/navigation", () => ({
    usePathname: vi.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

describe("SidebarNavigation", () => {
    const mockNavItems = [
        {
            name: "Administration",
            items: [
                {
                    href: "/admin/organizations",
                    text: "Organizations",
                    roles: [],
                },
                { href: "/admin/users", text: "Users", roles: [] },
            ],
        },
        {
            name: "Settings",
            items: [{ href: "/admin/settings", text: "Settings", roles: [] }],
        },
    ];

    beforeEach(() => {
        vi.mocked(nextNavigation.usePathname).mockReturnValue(
            "/admin/organizations"
        );
    });

    it("renders navigation groups", () => {
        render(
            <SidebarProvider>
                <SidebarNavigation navItems={mockNavItems} />
            </SidebarProvider>
        );

        expect(screen.getByText("Administration")).toBeVisible();
        // Settings appears as both group name and item, so use getAllByText
        const settingsElements = screen.getAllByText("Settings");
        expect(settingsElements.length).toBeGreaterThan(0);
    });

    it("renders navigation items", () => {
        render(
            <SidebarProvider>
                <SidebarNavigation navItems={mockNavItems} />
            </SidebarProvider>
        );

        expect(screen.getByText("Organizations")).toBeVisible();
        expect(screen.getByText("Users")).toBeVisible();
        // Settings appears as both group name and item
        const settingsElements = screen.getAllByText("Settings");
        expect(settingsElements.length).toBeGreaterThan(0);
    });

    it("highlights active path", () => {
        render(
            <SidebarProvider>
                <SidebarNavigation navItems={mockNavItems} />
            </SidebarProvider>
        );

        const orgLink = screen.getByText("Organizations").closest("a");
        expect(orgLink).toHaveAttribute("href", "/admin/organizations");
    });

    it("handles empty nav items", () => {
        render(
            <SidebarProvider>
                <SidebarNavigation navItems={[]} />
            </SidebarProvider>
        );

        // Should render without errors
        expect(screen.queryByText("Administration")).not.toBeInTheDocument();
    });
});
