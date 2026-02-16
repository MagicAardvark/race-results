import { describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";
import { beforeEach } from "node:test";
import { organizationsAPIService } from "@/services/organizations/organizations.api.service";
import { organizationAdminService } from "@/services/organizations/organization.admin.service";
import { featureFlagsService } from "@/services/feature-flags/feature-flags.service";

vi.mock("@/services/organizations/organizations.api.service", () => ({
    organizationsAPIService: {
        getOrgIdFromApiKey: vi.fn(),
    },
}));

vi.mock("@/services/organizations/organization.admin.service", () => ({
    organizationAdminService: {
        findById: vi.fn(),
    },
}));

vi.mock("@/services/feature-flags/feature-flags.service", () => ({
    featureFlagsService: {
        getOrgFeatureFlags: vi.fn(),
    },
}));

vi.mock("@/services/events/events.service", () => ({
    eventsService: {
        getCurrentEvent: vi.fn().mockResolvedValue({
            eventId: "event-123",
            name: "Test Event",
            slug: "test-event",
            orgId: "org-123",
            startAt: new Date(),
            endAt: new Date(Date.now() + 3600000),
            seasonId: null,
            deletedAt: null,
        }),
    },
}));

const mockOrg = {
    orgId: "org-123",
    name: "Test Org",
    slug: "test-org",
    motorsportregOrgId: null,
    description: "",
    headerImageUrl: null,
    profileIconUrl: null,
    isPublic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    orgApiKeys: [],
};

const setupValidAuth = (featureEnabled = true) => {
    vi.mocked(organizationsAPIService.getOrgIdFromApiKey).mockResolvedValue(
        "org-123"
    );
    vi.mocked(organizationAdminService.findById).mockResolvedValue(mockOrg);
    vi.mocked(featureFlagsService.getOrgFeatureFlags).mockResolvedValue({
        "feature.liveTiming.workRunEnabled": featureEnabled,
    });
};

const callAuthEndpoint = async (apiKey: string) => {
    const request = {
        json: async () => ({ apiKey }),
    } as NextRequest;
    const response = await POST(request, {});
    return { response, data: await response.json() };
};

describe("POST", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns 401 for invalid API key", async () => {
        vi.mocked(organizationsAPIService.getOrgIdFromApiKey).mockResolvedValue(
            null
        );

        const { response } = await callAuthEndpoint("invalid_key");

        expect(response.status).toBe(401);
    });

    it("returns 404 if organization not found", async () => {
        vi.mocked(organizationsAPIService.getOrgIdFromApiKey).mockResolvedValue(
            "org-123"
        );

        vi.mocked(organizationAdminService.findById).mockResolvedValue(null);

        const { response } = await callAuthEndpoint("valid_key");
        expect(response.status).toBe(404);
    });

    it("returns run-work API when feature is enabled", async () => {
        setupValidAuth(true);

        const { response, data } = await callAuthEndpoint("valid_key");

        expect(response.status).toBe(200);
        expect(data.org.apis["run-work"]).toBe(
            "api/ingest/test-org/live/runwork"
        );
    });

    it("omits run-work API when feature is disabled", async () => {
        setupValidAuth(false);

        const { response, data } = await callAuthEndpoint("valid_key");

        expect(response.status).toBe(200);
        expect(data.org.apis["run-work"]).toBeUndefined();
    });
});
