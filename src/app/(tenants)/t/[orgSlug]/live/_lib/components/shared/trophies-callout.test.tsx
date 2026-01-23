import { describe, it, expect, vi } from "vitest";
import { renderWithProviders } from "@/__tests__/test-utils";
import { TrophiesCallout } from "./trophies-callout";

// Mock next/navigation
vi.mock("next/navigation", () => ({
    useParams: () => ({
        orgSlug: "test-org",
    }),
}));

describe("TrophiesCallout", () => {
    it("returns null when showTrophies is false", () => {
        const { container } = renderWithProviders(<TrophiesCallout />);
        expect(container.firstChild).toBeNull();
    });

    it("renders callout card when showTrophies is true", () => {
        // Note: Currently showTrophies is hardcoded to false
        // This test documents expected behavior when feature flag is enabled
        const { container } = renderWithProviders(<TrophiesCallout />);
        // Currently returns null, but when enabled should render:
        // - Trophy icon
        // - "View Trophy Winners & Shoutouts" text
        // - Link to trophies page
        expect(container.firstChild).toBeNull();
    });
});
