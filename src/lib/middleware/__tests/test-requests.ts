import { createRequest } from "@/__tests__/test-utils";
import { HEADERS } from "@/constants/global";
import { IRequestHandler } from "@/lib/middleware/request-handler/request-handler";

const host = "race-results.org";

export type TestRequestDetails = {
    path: string;
    subdomain?: string;
    host?: string;
    headers?: Record<string, string>;
};

export const testRequests = {
    api: {
        valid: { path: "/api" },
        invalidBecauseOfSubdomain: { path: "/api", subdomain: "org1" },
    },
    ingestApi: {
        complete: {
            path: "/api/ingest/org1/",
            headers: {
                [HEADERS.API.INGEST_API_KEY]: "invalid-api-key",
            },
        },
        missingApiKey: { path: "/api/ingest/org1/" },
        missingOrg: {
            path: "/api/ingest",
            headers: {
                [HEADERS.API.INGEST_API_KEY]: "invalid-api-key",
            },
        },
        invalidBecauseOfSubdomain: { path: "/api/ingest", subdomain: "org1" },
    },
    admin: {
        home: { path: "/admin" },
        users: { path: "/admin/users" },
        invalidBecauseOfSubdomain: { path: "/admin", subdomain: "org1" },
    },
    tenant: {
        slashRoute: { path: "/t/org1/live" },
        subdomainRoute: { path: "/live", subdomain: "org1" },
        subdomainHome: { path: "/", subdomain: "org1" },
        subDomainAndSlash: {
            path: "/t/org1/dashboard",
            subdomain: "org1",
        },
        extraSubDomain: { path: "/live", subdomain: "extra.org1" },
    },
    public: {
        home: { path: "/" },
        wwwOrg: { path: "/", host: "www.race-results.org" },
        wwwLive: { path: "/", host: "www.race-results.live" },
        stagingOrg: { path: "/", host: "staging.race-results.org" },
        stagingLive: { path: "/", host: "staging.race-results.live" },
        /** Non-allowed base domain (e.g. Vercel preview or CNAME) → main site, not tenant */
        vercelPreview: { path: "/", host: "pr-42-race-results.vercel.app" },
        unknownBaseDomain: { path: "/", host: "myorg.evil.com" },
    },
};

export const createTestRequest = (req: TestRequestDetails) =>
    createRequest(
        req.path,
        req.subdomain
            ? `${req.subdomain}.${req.host ?? host}`
            : (req.host ?? host),
        req.headers
    );

export const makeRequest = async (
    handler: IRequestHandler,
    req: TestRequestDetails
) => await handler.handleRequest(createTestRequest(req));
