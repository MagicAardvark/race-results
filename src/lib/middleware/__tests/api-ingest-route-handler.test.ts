import {
    makeRequest,
    testRequests,
} from "@/lib/middleware/__tests/test-requests";
import { apiIngestRouteHandler } from "@/lib/middleware/request-handler/api-ingest-route-handler";
import { organizationsAPIService } from "@/services/organizations/organizations.api.service";
import { beforeEach } from "node:test";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/services/organizations/organizations.api.service", () => ({
    organizationsAPIService: {
        validateApiRequest: vi.fn(),
    },
}));

describe("ApiIngestRouteHandler", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("handleRequest", () => {
        it("should response with 200 OK for valid ingest request", async () => {
            vi.mocked(
                organizationsAPIService.validateApiRequest
            ).mockResolvedValue(true);

            const result = await makeRequest(
                apiIngestRouteHandler,
                testRequests.ingestApi.complete
            );

            expect(result.status).toBe(200);
        });

        it("should response with 400 Bad Request for missing API key", async () => {
            const result = await makeRequest(
                apiIngestRouteHandler,
                testRequests.ingestApi.missingApiKey
            );

            expect(result.status).toBe(400);
        });

        it("should respond with 400 Bad Request for missing organization", async () => {
            const result = await makeRequest(
                apiIngestRouteHandler,
                testRequests.ingestApi.missingOrg
            );

            expect(result.status).toBe(400);
        });

        it("should response with 401 Unauthorized for invalid API key", async () => {
            vi.mocked(
                organizationsAPIService.validateApiRequest
            ).mockResolvedValue(false);

            const result = await makeRequest(
                apiIngestRouteHandler,
                testRequests.ingestApi.complete
            );

            expect(result.status).toBe(401);
        });
    });
});
