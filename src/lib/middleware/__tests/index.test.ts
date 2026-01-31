import { getRequestHandler } from "@/lib/middleware";
import {
    createTestRequest,
    TestRequestDetails,
    testRequests,
} from "@/lib/middleware/__tests/test-requests";
import { beforeEach, describe, expect, it, vi } from "vitest";

const tests = [
    {
        expectedResult: "INVALID",
        tests: [
            {
                label: "should return invalid for tenant subdomain API request",
                request: testRequests.api.invalidBecauseOfSubdomain,
            },
            {
                label: "should return invalid for tenant subdomain API ingest requests",
                request: testRequests.ingestApi.invalidBecauseOfSubdomain,
            },
            {
                label: "should return invalid for tenant subdomain admin requests",
                request: testRequests.admin.invalidBecauseOfSubdomain,
            },
            {
                label: "should return invalid for tenant subdomain with extra subdomain",
                request: testRequests.tenant.extraSubDomain,
            },
        ],
    },
    {
        expectedResult: "TENANT_ROUTE",
        tests: [
            {
                label: "should return tenant for tenant slash route",
                request: testRequests.tenant.slashRoute,
            },
            {
                label: "should return tenant for tenant subdomain route",
                request: testRequests.tenant.subdomainRoute,
            },
        ],
    },
    {
        expectedResult: "GENERAL_API_ROUTE",
        tests: [
            {
                label: "should return general API for general API route",
                request: testRequests.api.valid,
            },
        ],
    },
    {
        expectedResult: "INGEST_API_ROUTE",
        tests: [
            {
                label: "should return ingest API for ingest API route",
                request: testRequests.ingestApi.complete,
            },
        ],
    },
    {
        expectedResult: "ADMIN_ROUTE",
        tests: [
            {
                label: "should return admin for admin route",
                request: testRequests.admin.home,
            },
        ],
    },
    {
        expectedResult: "GLOBAL_ROUTE",
        tests: [
            {
                label: "should return global for public home route",
                request: testRequests.public.home,
            },
        ],
    },
];

describe("getRequestHandler", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const getRequestHandlerResponse = (req: TestRequestDetails) =>
        getRequestHandler(createTestRequest(req));

    tests.forEach(({ expectedResult, tests }) => {
        tests.forEach(({ label, request }) => {
            it(label, () => {
                const result = getRequestHandlerResponse(request);
                expect(result).toBe(expectedResult);
            });
        });
    });
});
