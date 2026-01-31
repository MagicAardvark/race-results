import { HEADERS } from "@/constants/global";
import {
    makeRequest,
    testRequests,
} from "@/lib/middleware/__tests/test-requests";
import { tenantHandler } from "@/lib/middleware/request-handler/tenant-handler";
import { tenantService } from "@/services/tenants/tenant.service";
import { beforeEach } from "node:test";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/services/tenants/tenant.service", () => ({
    tenantService: {
        isValidTenant: vi.fn(),
    },
}));

describe("TenantHandler", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("handleRequest", () => {
        it("should rewrite subdomain to /t/{tenant} path for /", async () => {
            vi.mocked(tenantService.isValidTenant).mockResolvedValue(true);

            const result = await makeRequest(
                tenantHandler,
                testRequests.tenant.subdomainHome
            );

            expect(result.status).toBe(200);
            expect(result.headers.get("x-middleware-rewrite")).toBe(
                "https://org1.race-results.org/t/org1/"
            );
            expect(result.headers.get(HEADERS.TENANT_SLUG)).toBe("org1");
        });

        it("should rewrite to /tenant-not-found if tenant is missing", async () => {
            const result = await makeRequest(
                tenantHandler,
                testRequests.public.home
            );

            expect(result.status).toBe(200);
            expect(result.headers.get("x-middleware-rewrite")).toContain(
                "/tenant-not-found"
            );
        });

        it("should not set TENANT_SLUG header if tenant is invalid", async () => {
            vi.mocked(tenantService.isValidTenant).mockResolvedValue(false);

            const result = await makeRequest(
                tenantHandler,
                testRequests.tenant.subdomainRoute
            );

            expect(result.status).toBe(200);
            expect(result.headers.get(HEADERS.TENANT_SLUG)).toBeNull();
        });

        it("should rewrite to /tenant-not-found for invalid tenant", async () => {
            vi.mocked(tenantService.isValidTenant).mockResolvedValue(false);

            const result = await makeRequest(
                tenantHandler,
                testRequests.tenant.subdomainRoute
            );

            expect(result.status).toBe(200);
            expect(result.headers.get("x-middleware-rewrite")).toContain(
                "/tenant-not-found"
            );
        });

        it("should rewrite URL for valid tenant", async () => {
            vi.mocked(tenantService.isValidTenant).mockResolvedValue(true);

            const result = await makeRequest(
                tenantHandler,
                testRequests.tenant.subdomainRoute
            );

            expect(result.status).toBe(200);
            expect(result.headers.get("x-middleware-rewrite")).toBe(
                "https://org1.race-results.org/t/org1/live"
            );
            expect(result.headers.get(HEADERS.TENANT_SLUG)).toBe("org1");
        });

        it("should proceed without rewrite if URL already contains tenant", async () => {
            vi.mocked(tenantService.isValidTenant).mockResolvedValue(true);

            const result = await makeRequest(
                tenantHandler,
                testRequests.tenant.slashRoute
            );

            expect(result.status).toBe(200);
            expect(result.headers.get("x-middleware-rewrite")).toBeNull();
        });

        it("should not rewrite if tenant is valid and already in path", async () => {
            vi.mocked(tenantService.isValidTenant).mockResolvedValue(true);

            const result = await makeRequest(
                tenantHandler,
                testRequests.tenant.subDomainAndSlash
            );

            expect(result.status).toBe(200);
            expect(result.headers.get("x-middleware-rewrite")).toBeNull();
            expect(result.headers.get(HEADERS.TENANT_SLUG)).toBe("org1");
        });
    });
});
