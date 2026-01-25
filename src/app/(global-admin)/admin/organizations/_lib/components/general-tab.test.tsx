import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/__tests__/test-utils";
import { GeneralTab } from "./general-tab";
import type { OrganizationExtended } from "@/dto/organizations";

vi.mock("@/app/actions/organization.actions", () => ({
    updateOrganization: vi.fn(),
}));

describe("GeneralTab", () => {
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

    it("renders organization information card", () => {
        renderWithProviders(<GeneralTab org={mockOrg} />);

        expect(screen.getByText("Organization Information")).toBeVisible();
    });

    it("renders all organization fields", () => {
        renderWithProviders(<GeneralTab org={mockOrg} />);

        expect(screen.getByLabelText("Name")).toBeVisible();
        expect(screen.getByLabelText("URL Slug")).toBeVisible();
        expect(screen.getByLabelText("MotorsportReg Org ID")).toBeVisible();
        expect(screen.getByLabelText("Description")).toBeVisible();
        expect(screen.getByLabelText("Publicly Viewable")).toBeVisible();
    });

    it("pre-fills form with organization data", () => {
        renderWithProviders(<GeneralTab org={mockOrg} />);

        expect(screen.getByLabelText("Name")).toHaveValue("Test Organization");
        expect(screen.getByLabelText("URL Slug")).toHaveValue("test-org");
        expect(screen.getByLabelText("MotorsportReg Org ID")).toHaveValue(
            "msr-123"
        );
        expect(screen.getByLabelText("Publicly Viewable")).toBeChecked();
    });

    it("renders slug as read-only", () => {
        renderWithProviders(<GeneralTab org={mockOrg} />);

        const slugInput = screen.getByLabelText("URL Slug");
        expect(slugInput).toHaveAttribute("readonly");
    });

    it("allows editing organization name", async () => {
        const user = userEvent.setup();
        renderWithProviders(<GeneralTab org={mockOrg} />);

        const nameInput = screen.getByLabelText("Name");
        await user.clear(nameInput);
        await user.type(nameInput, "Updated Organization");

        expect(nameInput).toHaveValue("Updated Organization");
    });

    it("allows toggling public visibility", async () => {
        const user = userEvent.setup();
        renderWithProviders(<GeneralTab org={mockOrg} />);

        const publicCheckbox = screen.getByLabelText("Publicly Viewable");
        expect(publicCheckbox).toBeChecked();

        await user.click(publicCheckbox);
        expect(publicCheckbox).not.toBeChecked();
    });

    it("renders save and cancel buttons", () => {
        renderWithProviders(<GeneralTab org={mockOrg} />);

        expect(screen.getByRole("button", { name: /Save/i })).toBeVisible();
        expect(screen.getByRole("button", { name: /Cancel/i })).toBeVisible();
    });
});
