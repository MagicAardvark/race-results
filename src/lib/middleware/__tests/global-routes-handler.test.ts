import {
    makeRequest,
    testRequests,
} from "@/lib/middleware/__tests/test-requests";
import { globalRoutesHandler } from "@/lib/middleware/request-handler/global-routes-handler";
import { beforeEach } from "node:test";
import { describe, expect, it, vi } from "vitest";

describe("InvalidRequestHandler", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("handleRequest", () => {
        it("should return 200", async () => {
            const result = await makeRequest(
                globalRoutesHandler,
                testRequests.public.home
            );
            expect(result.status).toBe(200);
        });
    });
});
