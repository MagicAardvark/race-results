import {
    createTestRequest,
    testRequests,
} from "@/lib/middleware/__tests/test-requests";
import { extractTenant } from "@/lib/middleware/utils";
import { describe, expect, it } from "vitest";

const tests = [
    {
        label: "should return non-tenant for requests without subdomain or /t/ path",
        request: testRequests.public.home,
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
