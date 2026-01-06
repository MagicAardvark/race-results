import { describe, it, expect } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import { ApiKeyManagement } from "./api-key-management";
import type { OrganizationExtended } from "@/dto/organizations";

describe("ApiKeyManagement", () => {
    const mockOrgWithKeys: OrganizationExtended = {
        orgId: "org-1",
        name: "Test Org",
        slug: "test-org",
        motorsportregOrgId: null,
        description: null,
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        orgApiKeys: [
            {
                apiKeyId: "key-1",
                apiKey: "rr_test123",
                apiKeyEnabled: true,
                effectiveAt: new Date("2024-01-01"),
            },
        ],
    };

    const mockOrgWithoutKeys: OrganizationExtended = {
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

    it("renders card with title", () => {
        render(<ApiKeyManagement org={mockOrgWithKeys} />);

        expect(screen.getByText("API Keys")).toBeVisible();
    });

    it("renders NoApiKeys component when no keys exist", () => {
        render(<ApiKeyManagement org={mockOrgWithoutKeys} />);

        expect(screen.getByText("No API Key History")).toBeVisible();
        expect(
            screen.getByText(/No API keys have been created/i)
        ).toBeVisible();
    });

    it("renders ApiKeyList when keys exist", () => {
        render(<ApiKeyManagement org={mockOrgWithKeys} />);

        expect(screen.getByText("Current API Key")).toBeVisible();
        expect(screen.getByText("Key Control")).toBeVisible();
    });

    it("renders generate button when no keys", () => {
        render(<ApiKeyManagement org={mockOrgWithoutKeys} />);

        expect(
            screen.getByRole("button", { name: /Generate API Key/i })
        ).toBeVisible();
    });

    it("renders 'No API Keys Available' when ApiKeyList has empty keys", () => {
        const orgWithEmptyKeys: OrganizationExtended = {
            ...mockOrgWithKeys,
            orgApiKeys: [],
        };

        render(<ApiKeyManagement org={orgWithEmptyKeys} />);

        // Should show NoApiKeys component
        expect(screen.getByText("No API Key History")).toBeVisible();
    });
});
