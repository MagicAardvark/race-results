import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/__tests__/test-utils";
import { FeatureFlagsManagement } from "./feature-flags-management";
import type { OrganizationExtended } from "@/dto/organizations";
import type { OrgFeatureFlags } from "@/dto/feature-flags";

vi.mock("@/app/actions/organization.actions", () => ({
    updateOrganization: vi.fn(),
}));

describe("FeatureFlagsManagement", () => {
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
        "feature.liveTiming.workRunEnabled": false,
    };

    it("renders card with title", () => {
        renderWithProviders(
            <FeatureFlagsManagement
                org={mockOrg}
                featureFlags={mockFeatureFlags}
            />
        );

        expect(screen.getByText("Feature Flags")).toBeVisible();
    });

    it("renders grouped feature flags", () => {
        renderWithProviders(
            <FeatureFlagsManagement
                org={mockOrg}
                featureFlags={mockFeatureFlags}
            />
        );

        expect(screen.getByText(/Live Timing/i)).toBeVisible();
        expect(screen.getByLabelText(/Pax Enabled/i)).toBeVisible();
        expect(screen.getByLabelText(/Work Run Enabled/i)).toBeVisible();
    });

    it("shows correct initial checkbox states", () => {
        renderWithProviders(
            <FeatureFlagsManagement
                org={mockOrg}
                featureFlags={mockFeatureFlags}
            />
        );

        const paxCheckbox = screen.getByLabelText(/Pax Enabled/i);
        const workRunCheckbox = screen.getByLabelText(/Work Run Enabled/i);

        expect(paxCheckbox).toBeChecked();
        expect(workRunCheckbox).not.toBeChecked();
    });

    it("allows toggling feature flags", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <FeatureFlagsManagement
                org={mockOrg}
                featureFlags={mockFeatureFlags}
            />
        );

        const paxCheckbox = screen.getByLabelText(/Pax Enabled/i);
        expect(paxCheckbox).toBeChecked();

        await user.click(paxCheckbox);
        expect(paxCheckbox).not.toBeChecked();
    });

    it("handles empty feature flags", () => {
        renderWithProviders(
            <FeatureFlagsManagement org={mockOrg} featureFlags={{}} />
        );

        expect(screen.getByText("No feature flags configured")).toBeVisible();
    });

    it("renders save and cancel buttons", () => {
        renderWithProviders(
            <FeatureFlagsManagement
                org={mockOrg}
                featureFlags={mockFeatureFlags}
            />
        );

        expect(screen.getByRole("button", { name: /Save/i })).toBeVisible();
        expect(screen.getByRole("button", { name: /Cancel/i })).toBeVisible();
    });
});
