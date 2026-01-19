import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    getClassResults,
    getPaxResults,
    getRawResults,
    getRunWork,
} from "./_lib/utils/live-results-client";
import { featureFlagsService } from "@/services/feature-flags/feature-flags.service";
import { requireValidTenant } from "./_lib/utils/tenant-guard";
import {
    mockValidTenant,
    mockGlobalTenant,
} from "@/__tests__/mocks/mock-tenants";
import { mockRunWork } from "@/__tests__/mocks/mock-run-work";
import { mockClassResults } from "@/__tests__/mocks/mock-class-results";
import { mockPaxResults } from "@/__tests__/mocks/mock-pax-results";
import { mockRawResults } from "@/__tests__/mocks/mock-raw-results";
import type { Tenant } from "@/dto/tenants";

// Mock dependencies
vi.mock("./_lib/utils/live-results-client", () => ({
    getClassResults: vi.fn(),
    getPaxResults: vi.fn(),
    getRawResults: vi.fn(),
    getRunWork: vi.fn(),
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
        vi.mocked(getClassResults).mockResolvedValue(mockClassResults);
        vi.mocked(getPaxResults).mockResolvedValue(mockPaxResults);
        vi.mocked(getRawResults).mockResolvedValue(mockRawResults);
        vi.mocked(getRunWork).mockResolvedValue(mockRunWork);
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
        expect(getClassResults).toHaveBeenCalledWith("test-org");
        expect(getPaxResults).toHaveBeenCalledWith("test-org");
        expect(getRawResults).toHaveBeenCalledWith("test-org");
        expect(getRunWork).toHaveBeenCalledWith("test-org");
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
