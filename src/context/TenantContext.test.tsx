import { describe, it, expect, vi } from "vitest";
import { defaultOrg, render, screen } from "@/__tests__/test-utils";
import { TenantProvider, useTenant } from "./TenantContext";

describe("TenantContext", () => {
    const mockTenant = defaultOrg;

    it("provides tenant to children", () => {
        const TestComponent = () => {
            const org = useTenant();

            return <div>{org.name}</div>;
        };

        render(
            <TenantProvider org={mockTenant}>
                <TestComponent />
            </TenantProvider>
        );

        expect(screen.getByText("Test Organization")).toBeVisible();
    });

    it("throws error when useTenant is used outside provider", () => {
        const consoleSpy = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});

        const TestComponent = () => {
            useTenant();
            return null;
        };

        expect(() => {
            render(<TestComponent />);
        }).toThrow("useTenant must be used within a TenantProvider");

        consoleSpy.mockRestore();
    });

    it("provides access to tenant properties", () => {
        const TestComponent = () => {
            const org = useTenant();
            return (
                <div>
                    <div>{org.slug}</div>
                    <div>valid</div>
                    <div>not-global</div>
                </div>
            );
        };

        render(
            <TenantProvider org={mockTenant}>
                <TestComponent />
            </TenantProvider>
        );

        expect(screen.getByText("test-org")).toBeVisible();
        expect(screen.getByText("valid")).toBeVisible();
        expect(screen.getByText("not-global")).toBeVisible();
    });
});
