import {
    makeRequest,
    testRequests,
} from "@/lib/middleware/__tests/test-requests";
import { globalAdminHandler } from "@/lib/middleware/request-handler/global-admin-handler";
import { beforeEach } from "node:test";
import { describe, expect, it, vi } from "vitest";

describe("GlobalAdminHandler", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("handleRequest", () => {
        it("should return 200", async () => {
            const result = await makeRequest(
                globalAdminHandler,
                testRequests.admin.home
            );
            expect(result.status).toBe(200);
        });
    });
});
