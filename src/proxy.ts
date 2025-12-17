import { tenantService } from "@/services/tenants/tenant.service";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const GLOBAL_TENANT = "global";

const configureResponse = ({ tenant }: { tenant: string }) => {
    const res = NextResponse.next();
    res.headers.set("x-tenant-slug", tenant);

    return res;
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
    const tenant = parseTenantFromRequest(req);

    if (tenant === GLOBAL_TENANT) {
        return configureResponse({ tenant: GLOBAL_TENANT });
    }

    const isValid = await tenantService.isValidTenant(tenant);

    if (!isValid) {
        const url = req.nextUrl;
        url.pathname = "/tenant-not-found";
        return NextResponse.rewrite(url);
    }

    return configureResponse({ tenant: tenant });
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
