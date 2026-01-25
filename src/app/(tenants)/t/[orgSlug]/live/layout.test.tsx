import { describe, it, expect, vi, beforeEach } from "vitest";
import { featureFlagsService } from "@/services/feature-flags/feature-flags.service";
import { liveResultsService } from "@/services/live-results/live-results.service";
import { requireValidTenant } from "./_lib/utils/tenant-guard";
import {
    mockValidTenant,
    mockGlobalTenant,
} from "@/__tests__/mocks/mock-tenants";
import { mockClassResults } from "@/__tests__/mocks/mock-class-results";
import { mockPaxResults } from "@/__tests__/mocks/mock-pax-results";
import { mockRawResults } from "@/__tests__/mocks/mock-raw-results";
import type { Tenant } from "@/dto/tenants";

// Mock dependencies
vi.mock("@/services/live-results/live-results.service", () => ({
    liveResultsService: {
        getClassResults: vi.fn(),
        getIndexedResults: vi.fn(),
        getRawResults: vi.fn(),
    },
}));

vi.mock("@/services/feature-flags/feature-flags.service", () => ({
    featureFlagsService: {
        getOrgFeatureFlags: vi.fn(),
    },
}));

vi.mock("./_lib/utils/tenant-guard", () => ({
    requireValidTenant: vi.fn(),
}));

vi.mock("./_lib/context/live-results-context", () => ({
    LiveResultsProvider: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="live-results-provider">{children}</div>
    ),
}));

vi.mock("./_lib/components/live-layout-client", () => ({
    LiveLayoutClient: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="live-layout-client">{children}</div>
    ),
}));

describe("LiveLayout", () => {
    // Helper to setup common mock return values
    const setupMockData = (tenant: Tenant = mockValidTenant) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(requireValidTenant).mockResolvedValue(tenant as any);
        vi.mocked(liveResultsService.getClassResults).mockResolvedValue(
            mockClassResults
        );
        vi.mocked(liveResultsService.getIndexedResults).mockResolvedValue(
            mockPaxResults
        );
        vi.mocked(liveResultsService.getRawResults).mockResolvedValue(
            mockRawResults
        );
        vi.mocked(featureFlagsService.getOrgFeatureFlags).mockResolvedValue({});
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("fetches all data in parallel", async () => {
        setupMockData();

        const LiveLayout = (await import("./layout")).default;

        await LiveLayout({ children: <div>Test</div> });

        expect(requireValidTenant).toHaveBeenCalled();
        expect(liveResultsService.getClassResults).toHaveBeenCalledWith(
            "test-org"
        );
        expect(liveResultsService.getIndexedResults).toHaveBeenCalledWith(
            "test-org"
        );
        expect(liveResultsService.getRawResults).toHaveBeenCalledWith(
            "test-org"
        );
        expect(featureFlagsService.getOrgFeatureFlags).toHaveBeenCalledWith(
            "org-123"
        );
    });

    it("handles global tenant", async () => {
        setupMockData(mockGlobalTenant);

        const LiveLayout = (await import("./layout")).default;

        await LiveLayout({ children: <div>Test</div> });

        expect(requireValidTenant).toHaveBeenCalled();
        // Should not call getOrgFeatureFlags for global tenant
        expect(featureFlagsService.getOrgFeatureFlags).not.toHaveBeenCalled();
    });
});
