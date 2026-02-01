import {
    createTestRequest,
    testRequests,
} from "@/lib/middleware/__tests/test-requests";
import {
    extractTenant,
    getLiveBasePath,
    getTenantRequestMode,
} from "@/lib/middleware/utils";
import { describe, expect, it } from "vitest";

const tests = [
    {
        label: "should return non-tenant for requests without subdomain or /t/ path",
        request: testRequests.public.home,
        expected: { type: "NON_TENANT" },
    },
    {
        label: "should return non-tenant for www.race-results.org (www = main site)",
        request: testRequests.public.wwwOrg,
        expected: { type: "NON_TENANT" },
    },
    {
        label: "should return non-tenant for www.race-results.live (www = main site)",
        request: testRequests.public.wwwLive,
        expected: { type: "NON_TENANT" },
    },
    {
        label: "should return non-tenant for requests with www subdomain",
        request: testRequests.public.wwwAsSubdomain,
        expected: { type: "NON_TENANT" },
    },
    {
        label: "should return tenant for requests with /t/ path",
        request: testRequests.tenant.slashRoute,
        expected: { type: "TENANT", tenant: "org1" },
    },
    {
        label: "should return tenant for requests with subdomain",
        request: testRequests.tenant.subdomainRoute,
        expected: { type: "TENANT", tenant: "org1" },
    },
    {
        label: "should return invalid tenant format for requests with extra subdomain",
        request: testRequests.tenant.extraSubDomain,
        expected: { type: "INVALID_TENANT_FORMAT" },
    },
    {
        label: "should return tenant from /t/ path even if subdomain is present",
        request: testRequests.tenant.subDomainAndSlash,
        expected: { type: "TENANT", tenant: "org1" },
    },
];

describe("extractTenant", () => {
    tests.forEach(({ label, request, expected }) => {
        it(label, async () => {
            const req = createTestRequest(request);
            const tenant = extractTenant(req);

            expect(tenant).toEqual(expected);
        });
    });
});

describe("getTenantRequestMode", () => {
    it("returns subdomain for [org].race-results.org", () => {
        expect(getTenantRequestMode("myorg.race-results.org")).toBe(
            "subdomain"
        );
    });
    it("returns subdomain for [org].localhost", () => {
        expect(getTenantRequestMode("myorg.localhost")).toBe("subdomain");
    });
    it("returns path for www.race-results.org", () => {
        expect(getTenantRequestMode("www.race-results.org")).toBe("path");
    });
    it("returns path for apex race-results.org", () => {
        expect(getTenantRequestMode("race-results.org")).toBe("path");
    });
});

describe("getLiveBasePath", () => {
    it("returns /live for subdomain host", () => {
        expect(getLiveBasePath("myorg.race-results.org", "myorg")).toBe(
            "/live"
        );
    });
    it("returns /t/[orgSlug]/live for path (apex) host", () => {
        expect(getLiveBasePath("race-results.org", "myorg")).toBe(
            "/t/myorg/live"
        );
    });
    it("returns /t/[orgSlug]/live for www host", () => {
        expect(getLiveBasePath("www.race-results.org", "myorg")).toBe(
            "/t/myorg/live"
        );
    });
});
