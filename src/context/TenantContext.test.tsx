import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import { TenantProvider, useTenant } from "./TenantContext";
import { mockValidTenant } from "@/__tests__/mocks/mock-tenants";

describe("TenantContext", () => {
    const mockTenant = mockValidTenant;

    it("provides tenant to children", () => {
        const TestComponent = () => {
            const tenant = useTenant();
            if (tenant.isValid && !tenant.isGlobal) {
                return <div>{tenant.org.name}</div>;
            }
            return <div>unexpected</div>;
        };

        render(
            <TenantProvider tenant={mockTenant}>
                <TestComponent />
            </TenantProvider>
        );

        expect(screen.getByText("Test Org")).toBeVisible();
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
            const tenant = useTenant();
            if (tenant.isValid && !tenant.isGlobal) {
                return (
                    <div>
                        <div>{tenant.org.slug}</div>
                        <div>valid</div>
                        <div>not-global</div>
                    </div>
                );
            }
            return <div>unexpected</div>;
        };

        render(
            <TenantProvider tenant={mockTenant}>
                <TestComponent />
            </TenantProvider>
        );

        expect(screen.getByText("test-org")).toBeVisible();
        expect(screen.getByText("valid")).toBeVisible();
        expect(screen.getByText("not-global")).toBeVisible();
    });
});
