import {
    makeRequest,
    testRequests,
} from "@/lib/middleware/__tests/test-requests";
import { apiGeneralRouteHandler } from "@/lib/middleware/request-handler/api-general-route-handler";
import { beforeEach } from "node:test";
import { describe, expect, it, vi } from "vitest";

describe("ApiGeneralRouteHandler", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("handleRequest", () => {
        it("should return 200", async () => {
            const result = await makeRequest(
                apiGeneralRouteHandler,
                testRequests.api.valid
            );

            expect(result.status).toBe(200);
        });
    });
});
