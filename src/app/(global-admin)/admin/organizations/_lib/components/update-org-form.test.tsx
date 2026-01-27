import { describe, it, expect, vi } from "vitest";
import { render, screen, userEvent } from "@/__tests__/test-utils";
import { UpdateOrgForm } from "./update-org-form";
import type { OrganizationExtended } from "@/dto/organizations";
import type { OrgFeatureFlags } from "@/dto/feature-flags";

vi.mock("@/app/actions/organization.actions", () => ({
    updateOrganization: vi.fn(),
}));

describe("UpdateOrgForm", () => {
    const mockOrg: OrganizationExtended = {
        orgId: "org-1",
        name: "Test Organization",
        slug: "test-org",
        motorsportregOrgId: "msr-123",
        description: "Test description",
        isPublic: true,
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
        render(<UpdateOrgForm org={mockOrg} featureFlags={mockFeatureFlags} />);

        expect(screen.getByText("Organization Information")).toBeVisible();
    });

    it("renders organization name field", () => {
        render(<UpdateOrgForm org={mockOrg} featureFlags={mockFeatureFlags} />);

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeVisible();
        expect(nameInput).toHaveValue("Test Organization");
    });

    it("renders slug field as read-only", () => {
        render(<UpdateOrgForm org={mockOrg} featureFlags={mockFeatureFlags} />);

        const slugInput = screen.getByLabelText("URL Slug");
        expect(slugInput).toBeVisible();
        expect(slugInput).toHaveAttribute("readonly");
    });

    it("renders motorsportreg org ID field", () => {
        render(<UpdateOrgForm org={mockOrg} featureFlags={mockFeatureFlags} />);

        const msrInput = screen.getByLabelText("MotorsportReg Org ID");
        expect(msrInput).toBeVisible();
        expect(msrInput).toHaveValue("msr-123");
    });

    it("renders description field", () => {
        render(<UpdateOrgForm org={mockOrg} featureFlags={mockFeatureFlags} />);

        const descriptionInput = screen.getByLabelText("Description");
        expect(descriptionInput).toBeVisible();
    });

    it("renders isPublic checkbox", () => {
        render(<UpdateOrgForm org={mockOrg} featureFlags={mockFeatureFlags} />);

        const publicCheckbox = screen.getByLabelText("Publicly Viewable");
        expect(publicCheckbox).toBeVisible();
        expect(publicCheckbox).toBeChecked();
    });

    it("renders save and cancel buttons", () => {
        render(<UpdateOrgForm org={mockOrg} featureFlags={mockFeatureFlags} />);

        expect(screen.getByRole("button", { name: /Save/i })).toBeVisible();
        expect(screen.getByRole("button", { name: /Cancel/i })).toBeVisible();
    });

    it("allows user to edit organization name", async () => {
        const user = userEvent.setup();
        render(<UpdateOrgForm org={mockOrg} featureFlags={mockFeatureFlags} />);

        const nameInput = screen.getByLabelText("Name");
        await user.clear(nameInput);
        await user.type(nameInput, "Updated Organization");

        expect(nameInput).toHaveValue("Updated Organization");
    });

    it("allows user to toggle isPublic checkbox", async () => {
        const user = userEvent.setup();
        render(<UpdateOrgForm org={mockOrg} featureFlags={mockFeatureFlags} />);

        const publicCheckbox = screen.getByLabelText("Publicly Viewable");
        expect(publicCheckbox).toBeChecked();

        await user.click(publicCheckbox);
        expect(publicCheckbox).not.toBeChecked();
    });
});
