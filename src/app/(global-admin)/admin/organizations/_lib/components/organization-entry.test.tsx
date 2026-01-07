import { describe, it, expect } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import { OrganizationEntry } from "./organization-entry";
import type { OrganizationExtended } from "@/dto/organizations";

describe("OrganizationEntry", () => {
    const mockOrg: OrganizationExtended = {
        orgId: "org-1",
        name: "Test Organization",
        slug: "test-org",
        motorsportregOrgId: null,
        description: null,
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        orgApiKeys: [],
    };

    it("renders organization name", () => {
        render(<OrganizationEntry org={mockOrg} />);

        expect(screen.getByText("Test Organization")).toBeVisible();
    });

    it("renders edit button with correct link", () => {
        render(<OrganizationEntry org={mockOrg} />);

        const editButton = screen.getByRole("link");
        expect(editButton).toHaveAttribute(
            "href",
            "/admin/organizations/test-org"
        );
    });

    it("renders pencil icon", () => {
        const { container } = render(<OrganizationEntry org={mockOrg} />);

        // PencilIcon should be rendered
        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
    });
});
