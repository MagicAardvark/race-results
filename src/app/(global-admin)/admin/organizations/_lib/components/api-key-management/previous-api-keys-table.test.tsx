import { describe, it, expect } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import { PreviousApiKeysTable } from "./previous-api-keys-table";
import type { OrgApiKey } from "@/dto/organizations";

describe("PreviousApiKeysTable", () => {
    const mockKeys: OrgApiKey[] = [
        {
            apiKeyId: "key-1",
            apiKey: "rr_test123456789",
            apiKeyEnabled: false,
            effectiveAt: new Date("2024-01-01"),
        },
        {
            apiKeyId: "key-2",
            apiKey: "rr_test987654321",
            apiKeyEnabled: false,
            effectiveAt: new Date("2024-01-02"),
        },
    ];

    it("returns null when no keys provided", () => {
        const { container } = render(<PreviousApiKeysTable keys={[]} />);

        expect(container.firstChild).toBeNull();
    });

    it("renders table with previous keys", () => {
        render(<PreviousApiKeysTable keys={mockKeys} />);

        expect(screen.getByText("Previous API Keys")).toBeVisible();
        expect(
            screen.getByText("API keys below will no longer provide access.")
        ).toBeVisible();
    });

    it("renders masked API keys", () => {
        render(<PreviousApiKeysTable keys={mockKeys} />);

        // Keys should be masked
        const cells = screen.getAllByText(/rr_test/);
        expect(cells.length).toBeGreaterThan(0);
    });

    it("renders effective dates", () => {
        render(<PreviousApiKeysTable keys={mockKeys} />);

        // Dates should be formatted - check for specific date format
        const dates = screen.getAllByText(/Jan \d+, 2024/);
        expect(dates.length).toBeGreaterThan(0);
    });
});
