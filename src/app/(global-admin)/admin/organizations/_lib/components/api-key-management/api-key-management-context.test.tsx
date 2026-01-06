import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import {
    ApiKeyManagementProvider,
    useApiKeyManagementContext,
} from "./api-key-management-context";
import { useApiKeyActions } from "@/hooks/admin/use-api-key-actions";
import type { OrganizationExtended } from "@/dto/organizations";

vi.mock("@/hooks/admin/use-api-key-actions");

function TestComponent() {
    const context = useApiKeyManagementContext();
    return (
        <div>
            <div data-testid="org-id">{context.org.orgId}</div>
            <div data-testid="is-pending">
                {context.isPending ? "true" : "false"}
            </div>
        </div>
    );
}

describe("ApiKeyManagementContext", () => {
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

    beforeEach(() => {
        vi.mocked(useApiKeyActions).mockReturnValue({
            handleUpdateApiKey: vi.fn(),
            isPending: false,
        });
    });

    it("provides org to children", () => {
        render(
            <ApiKeyManagementProvider org={mockOrg}>
                <TestComponent />
            </ApiKeyManagementProvider>
        );

        expect(screen.getByTestId("org-id")).toHaveTextContent("org-1");
    });

    it("provides isPending state", () => {
        vi.mocked(useApiKeyActions).mockReturnValue({
            handleUpdateApiKey: vi.fn(),
            isPending: true,
        });

        render(
            <ApiKeyManagementProvider org={mockOrg}>
                <TestComponent />
            </ApiKeyManagementProvider>
        );

        expect(screen.getByTestId("is-pending")).toHaveTextContent("true");
    });

    it("throws error when used outside provider", () => {
        const consoleSpy = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});

        expect(() => {
            render(<TestComponent />);
        }).toThrow(
            "useApiKeyManagementContext must be used within ApiKeyManagementProvider"
        );

        consoleSpy.mockRestore();
    });
});
