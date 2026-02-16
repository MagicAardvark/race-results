import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/__tests__/test-utils";
import { OrganizationInformation } from "../components/organization-information";
import type { OrganizationExtended } from "@/dto/organizations";

vi.mock(
    "@/app/(global-admin)/admin/(organization)/(general)/_lib/actions/update-org",
    () => ({
        updateOrganization: vi.fn(),
    })
);

describe("OrganizationInformation", () => {
    const mockOrg: OrganizationExtended = {
        orgId: "org-1",
        name: "Test Organization",
        slug: "test-org",
        motorsportregOrgId: "msr-123",
        description: "Test description",
        headerImageUrl: null,
        profileIconUrl: null,
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        orgApiKeys: [],
    };

    it("renders organization information card", () => {
        renderWithProviders(<OrganizationInformation org={mockOrg} />);

        expect(screen.getByText("Organization Information")).toBeVisible();
    });

    it("renders all organization fields", () => {
        renderWithProviders(<OrganizationInformation org={mockOrg} />);

        expect(screen.getByText("Header Image")).toBeVisible();
        expect(screen.getByText("Profile Icon")).toBeVisible();
        expect(screen.getByLabelText("Name")).toBeVisible();
        expect(screen.getByLabelText("URL Slug")).toBeVisible();
        expect(screen.getByLabelText("MotorsportReg Org ID")).toBeVisible();
        expect(screen.getByLabelText("Description")).toBeVisible();
        expect(screen.getByLabelText("Publicly Viewable")).toBeVisible();
    });

    it("shows current header image when set", () => {
        const orgWithImage: OrganizationExtended = {
            ...mockOrg,
            headerImageUrl: "https://example.com/header.jpg",
        };
        renderWithProviders(<OrganizationInformation org={orgWithImage} />);

        const img = screen.getByRole("img", {
            name: /test organization header/i,
        });
        expect(img).toBeVisible();
        expect(img).toHaveAttribute("src", "https://example.com/header.jpg");
    });

    it("shows Remove button when org has header image", () => {
        const orgWithImage = {
            ...mockOrg,
            headerImageUrl: "https://example.com/header.jpg",
        };
        renderWithProviders(<OrganizationInformation org={orgWithImage} />);

        expect(screen.getByRole("button", { name: "Remove" })).toBeVisible();
    });

    it("shows profile icon when profileIconUrl is set", () => {
        const orgWithProfileIcon: OrganizationExtended = {
            ...mockOrg,
            profileIconUrl: "https://example.com/icon.png",
        };
        renderWithProviders(
            <OrganizationInformation org={orgWithProfileIcon} />
        );

        const img = screen.getByRole("img", {
            name: /test organization profile icon/i,
        });
        expect(img).toBeVisible();
        expect(img).toHaveAttribute("src", "https://example.com/icon.png");
    });

    it("pre-fills form with organization data", () => {
        renderWithProviders(<OrganizationInformation org={mockOrg} />);

        expect(screen.getByLabelText("Name")).toHaveValue("Test Organization");
        expect(screen.getByLabelText("URL Slug")).toHaveValue("test-org");
        expect(screen.getByLabelText("MotorsportReg Org ID")).toHaveValue(
            "msr-123"
        );
        expect(screen.getByLabelText("Publicly Viewable")).toBeChecked();
    });

    it("renders slug as read-only", () => {
        renderWithProviders(<OrganizationInformation org={mockOrg} />);

        const slugInput = screen.getByLabelText("URL Slug");
        expect(slugInput).toHaveAttribute("readonly");
    });

    it("allows editing organization name", async () => {
        const user = userEvent.setup();
        renderWithProviders(<OrganizationInformation org={mockOrg} />);

        const nameInput = screen.getByLabelText("Name");
        await user.clear(nameInput);
        await user.type(nameInput, "Updated Organization");

        expect(nameInput).toHaveValue("Updated Organization");
    });

    it("allows toggling public visibility", async () => {
        const user = userEvent.setup();
        renderWithProviders(<OrganizationInformation org={mockOrg} />);

        const publicCheckbox = screen.getByLabelText("Publicly Viewable");
        expect(publicCheckbox).toBeChecked();

        await user.click(publicCheckbox);
        expect(publicCheckbox).not.toBeChecked();
    });

    it("renders save and cancel buttons", () => {
        renderWithProviders(<OrganizationInformation org={mockOrg} />);

        expect(screen.getByRole("button", { name: /Save/i })).toBeVisible();
        expect(screen.getByRole("button", { name: /Cancel/i })).toBeVisible();
    });
});
