import { apiGeneralRouteHandler } from "@/lib/middleware/request-handler/api-general-route-handler";
import { apiIngestRouteHandler } from "@/lib/middleware/request-handler/api-ingest-route-handler";
import { globalAdminHandler } from "@/lib/middleware/request-handler/global-admin-handler";
import { globalRoutesHandler } from "@/lib/middleware/request-handler/global-routes-handler";
import { invalidRequestHandler } from "@/lib/middleware/request-handler/invalid-request-handler";
import { tenantHandler } from "@/lib/middleware/request-handler/tenant-handler";
import { extractTenant } from "@/lib/middleware/utils";
import { NextRequest, NextResponse } from "next/server";

export type RequestHandlerKey =
    | "INVALID"
    | "TENANT_ROUTE"
    | "ADMIN_ROUTE"
    | "GENERAL_API_ROUTE"
    | "INGEST_API_ROUTE"
    | "GLOBAL_ROUTE";

export const REQUEST_HANDLERS = {
    INVALID: invalidRequestHandler,
    TENANT_ROUTE: tenantHandler,
    ADMIN_ROUTE: globalAdminHandler,
    GENERAL_API_ROUTE: apiGeneralRouteHandler,
    INGEST_API_ROUTE: apiIngestRouteHandler,
    GLOBAL_ROUTE: globalRoutesHandler,
};

export const routeRequest = async (req: NextRequest): Promise<NextResponse> => {
    const key = getRequestHandler(req);
    const handler = REQUEST_HANDLERS[key];

    return await handler.handleRequest(req);
};

const isIngestApiRoute = (req: NextRequest) => {
    return req.nextUrl.pathname.startsWith("/api/ingest");
};

const isGeneralApiRoute = (req: NextRequest) => {
    return !isIngestApiRoute(req) && req.nextUrl.pathname.startsWith("/api");
};

const isAdminRoute = (req: NextRequest) => {
    return req.nextUrl.pathname.startsWith("/admin");
};

export const getRequestHandler = (req: NextRequest): RequestHandlerKey => {
    const tenant = extractTenant(req);
    const isInvalidTenant = tenant.type === "INVALID_TENANT_FORMAT";
    const isValidTenant = tenant.type === "TENANT";
    const isAdmin = isAdminRoute(req);
    const isIngestApi = isIngestApiRoute(req);
    const isGeneralApi = isGeneralApiRoute(req);

    if (
        (isValidTenant && (isGeneralApi || isIngestApi || isAdmin)) ||
        isInvalidTenant
    ) {
        return "INVALID";
    }

    if (isValidTenant) {
        return "TENANT_ROUTE";
    }

    if (isAdmin) {
        return "ADMIN_ROUTE";
    }

    if (isIngestApi) {
        return "INGEST_API_ROUTE";
    }

    if (isGeneralApi) {
        return "GENERAL_API_ROUTE";
    }

    return "GLOBAL_ROUTE";
};
