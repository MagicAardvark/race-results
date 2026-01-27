import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/test-utils";
import { OrganizationEntry } from "./organization-entry";
import type { OrganizationExtended } from "@/dto/organizations";

describe("OrganizationEntry", () => {
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

    it("renders organization name", () => {
        renderWithProviders(<OrganizationEntry org={mockOrg} />);

        expect(screen.getByText("Test Organization")).toBeVisible();
    });

    it("renders edit link button", () => {
        renderWithProviders(<OrganizationEntry org={mockOrg} />);

        const editLink = screen.getByRole("link");
        expect(editLink).toBeVisible();
        expect(editLink).toHaveAttribute(
            "href",
            "/admin/organizations/test-org"
        );
    });

    it("renders pencil icon in edit button", () => {
        renderWithProviders(<OrganizationEntry org={mockOrg} />);

        // The PencilIcon should be rendered (lucide-react icons render as SVG)
        const editLink = screen.getByRole("link");
        expect(editLink.querySelector("svg")).toBeInTheDocument();
    });

    it("renders as table row", () => {
        renderWithProviders(<OrganizationEntry org={mockOrg} />);

        const row = screen.getByText("Test Organization").closest("tr");
        expect(row).toBeVisible();
    });

    it("handles different organization names", () => {
        const differentOrg: OrganizationExtended = {
            ...mockOrg,
            name: "Another Organization",
            slug: "another-org",
        };

        renderWithProviders(<OrganizationEntry org={differentOrg} />);

        expect(screen.getByText("Another Organization")).toBeVisible();
        expect(screen.getByRole("link")).toHaveAttribute(
            "href",
            "/admin/organizations/another-org"
        );
    });
});
