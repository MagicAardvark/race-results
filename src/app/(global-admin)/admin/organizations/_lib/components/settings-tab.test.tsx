import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { SettingsTab } from "./settings-tab";
import type { OrganizationExtended } from "@/dto/organizations";
import type { OrgFeatureFlags } from "@/dto/feature-flags";

vi.mock("./api-key-management/api-key-management", () => ({
    ApiKeyManagement: ({ org }: { org: OrganizationExtended }) => (
        <div data-testid="api-key-management">API Keys for {org.name}</div>
    ),
}));

vi.mock("./feature-flags-management", () => ({
    FeatureFlagsManagement: ({
        org,
    }: {
        org: OrganizationExtended;
        featureFlags: OrgFeatureFlags;
    }) => (
        <div data-testid="feature-flags-management">
            Feature Flags for {org.name}
        </div>
    ),
}));

describe("SettingsTab", () => {
    const mockOrg: OrganizationExtended = {
        orgId: "org-1",
        name: "Test Organization",
        slug: "test-org",
        motorsportregOrgId: null,
        description: null,
        isPublic: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        orgApiKeys: [],
    };

    const mockFeatureFlags: OrgFeatureFlags = {
        "feature.liveTiming.paxEnabled": true,
    };

    it("renders API key management component", () => {
        renderWithProviders(
            <SettingsTab org={mockOrg} featureFlags={mockFeatureFlags} />
        );

        expect(screen.getByTestId("api-key-management")).toBeVisible();
        expect(
            screen.getByText(/API Keys for Test Organization/i)
        ).toBeVisible();
    });

    it("renders feature flags management component", () => {
        renderWithProviders(
            <SettingsTab org={mockOrg} featureFlags={mockFeatureFlags} />
        );

        expect(screen.getByTestId("feature-flags-management")).toBeVisible();
        expect(
            screen.getByText(/Feature Flags for Test Organization/i)
        ).toBeVisible();
    });
});
