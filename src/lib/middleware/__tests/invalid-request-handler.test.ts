import {
    makeRequest,
    testRequests,
} from "@/lib/middleware/__tests/test-requests";
import { invalidRequestHandler } from "@/lib/middleware/request-handler/invalid-request-handler";
import { beforeEach } from "node:test";
import { describe, expect, it, vi } from "vitest";

describe("InvalidRequestHandler", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("handleRequest", () => {
        it("should return 400 response for invalid requests", async () => {
            const result = await makeRequest(
                invalidRequestHandler,
                testRequests.api.invalidBecauseOfSubdomain
            );

            expect(result.status).toBe(400);
        });
    });
});
