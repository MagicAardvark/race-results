import { HEADERS } from "@/constants/global";
import { organizationsAPIService } from "@/services/organizations/organizations.api.service";
import { tenantService } from "@/services/tenants/tenant.service";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const GLOBAL_TENANT = "global";

type Area = "public" | "tenants" | "ingest" | "admin" | "unknown";

const configureTenantResponse = ({ tenant }: { tenant: string }) => {
    const res = NextResponse.next();
    res.headers.set(HEADERS.TENANT_SLUG, tenant);

    return res;
};

const handleTenantRequest = async (req: NextRequest) => {
    const tenant = parseTenantFromRequest(req);

    const isValid = await tenantService.isValidTenant(tenant);

    if (!isValid) {
        const url = req.nextUrl;
        url.pathname = "/tenant-not-found";
        return NextResponse.rewrite(url);
    }

    return configureTenantResponse({ tenant: tenant });
};

const handleIngestRequest = async (req: NextRequest) => {
    const apiKey = req.headers.get(HEADERS.API.INGEST_API_KEY);

    if (!apiKey) {
        return NextResponse.json(
            { error: `Missing ${HEADERS.API.INGEST_API_KEY} header` },
            { status: 401 }
        );
    }

    const ingestRegex = /\/api\/ingest\/([^\/]+)\/(.*)/;

    const match = req.nextUrl.pathname.match(ingestRegex);

    if (match) {
        const orgSlug = match[1];

        const isValid = await organizationsAPIService.validateApiRequest(
            orgSlug,
            apiKey
        );

        if (isValid) {
            return NextResponse.next();
        }
    }

    return NextResponse.json(
        { error: `Invalid ${HEADERS.API.INGEST_API_KEY} or organization` },
        { status: 401 }
    );
};

const handleIngestApiRequest = async (req: NextRequest) => {
    if (req.nextUrl.pathname.startsWith("/api/ingest")) {
        return handleIngestRequest(req);
    }

    return NextResponse.next();
};

const determineArea = (req: NextRequest): Area => {
    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith("/admin")) {
        return "admin";
    }

    if (pathname.startsWith("/api/ingest")) {
        return "ingest";
    }

    if (pathname.startsWith("/t/")) {
        return "tenants";
    }

    return "public";
};

const parseTenantFromRequest = (req: NextRequest) => {
    const url = req.nextUrl;
    const host = req.headers.get("host") || "";
    const pathParts = url.pathname.split("/").filter(Boolean);

    const subdomain = host.split(".")[0];
    const isSubdomainTenant =
        !host.includes("vercel.app") &&
        subdomain !== "www" &&
        !subdomain.startsWith("localhost");

    // Request in the form of [org].domain.
    if (isSubdomainTenant) {
        return subdomain;
    }

    // Request in the form of t/[org]
    if (pathParts[0] === "t" && pathParts[1]) {
        return pathParts[1];
    }

    return GLOBAL_TENANT;
};

export default clerkMiddleware(async (_auth, req) => {
    const area = determineArea(req);

    switch (area) {
        case "ingest":
            return await handleIngestApiRequest(req);
        case "tenants":
            return await handleTenantRequest(req);
        case "admin":
        case "public":
        default:
            return configureTenantResponse({ tenant: GLOBAL_TENANT });
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
